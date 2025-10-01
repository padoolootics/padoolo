import { NextRequest, NextResponse } from "next/server";

// IMPORTANT: Do not use NEXT_PUBLIC for private credentials
const WOOCOMMERCE_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    // Map frontend filters to WooCommerce API parameters
    const params: { [key: string]: string | number | boolean } = {
      per_page: 12, // Set a default limit for products per page
      page: searchParams.get("page") || 1, // Default to page 1 if not specified
    };

    // Add category filter if provided
    const categoryId = searchParams.get("categoryId");
    if (categoryId) {
      params.category = categoryId;
    }

    const tags = searchParams.getAll("tags");
    if (tags.length > 0) {
      params.tag = tags.join(",");
    }

    const minPrice = searchParams.get("minPrice");
    if (minPrice) {
      params.min_price = minPrice;
    }

    const maxPrice = searchParams.get("maxPrice");
    if (maxPrice) {
      params.max_price = maxPrice;
    }

    const sort = searchParams.get("sort");
    if (sort === "price_asc") {
      params.orderby = "price";
      params.order = "asc";
    } else if (sort === "price_desc") {
      params.orderby = "price";
      params.order = "desc";
    } else if (sort === "name-asc") {
      params.orderby = "title";
      params.order = "asc";
    } else if (sort === "name-desc") {
      params.orderby = "title";
      params.order = "desc";
    } else {
      params.orderby = "date"; // Default sort
    }

    const showDiscount = searchParams.get("discount");
    if (showDiscount === "true") {
      params.on_sale = true;
    }

    // Construct the URL with query parameters
    const queryString = new URLSearchParams({
      ...params,
      consumer_key: CONSUMER_KEY || '',
      consumer_secret: CONSUMER_SECRET || '',
    } as any).toString();

    const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products?${queryString}`;

    // Use cache: 'no-store' to disable caching completely
    const response = await fetch(url, { 
      cache: 'no-store' 
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const data = await response.json();
    const total = parseInt(response.headers.get("X-WP-Total") || "0"); // Total products
    const totalPages = Math.ceil(total / Number(params.per_page)); // Calculate total pages

    // console.log("Fetched products cache disabled:", data);

    // Format the products for frontend use
    const formattedProducts = data.map((product: any) => ({
      id: product.id,
      name: product.name,
      image: product.images[0]?.src,
      price: parseFloat(product.price),
      oldPrice: parseFloat(product.regular_price) > parseFloat(product.price) ? parseFloat(product.regular_price) : undefined,
      discount: product.on_sale ? Math.round(((parseFloat(product.regular_price) - parseFloat(product.price)) / parseFloat(product.regular_price)) * 100) : undefined,
      category: product.categories[0]?.name,
      tags: product.tags.map((tag: any) => tag.name),
      brand: product.attributes.find((attr: any) => attr.name === 'Brand')?.options[0] || 'Unknown',
      size: product.attributes.find((attr: any) => attr.name === 'Size')?.options || [],
      rating: product.average_rating ? parseFloat(product.average_rating) : 0,
    }));

    return NextResponse.json({ products: data, totalPages });
  } catch (error) {
    console.error("Error fetching products from WooCommerce:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
