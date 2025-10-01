import { NextRequest, NextResponse } from "next/server";

const WOOCOMMERCE_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

// Define a type for a category from the WooCommerce API
interface WooCommerceCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
  image: { src: string };
  description: string;
}

interface Category {
  id: number;
  name: string;
  count: number;
  slug: string;
  children: Category[];
}

// Recursive function to build a tree structure from a flat list of categories
const buildCategoryTree = (categories: WooCommerceCategory[], parentId = 0): Category[] => {
    return categories
        .filter(category => category.parent === parentId)
        .map(category => ({
            ...category,
            children: buildCategoryTree(categories, category.id),
        }));
};

export async function GET(req: NextRequest) {
  try {
    // Construct the URL with query parameters
    const queryString = new URLSearchParams({
        consumer_key: CONSUMER_KEY || '',
        consumer_secret: CONSUMER_SECRET || '',
        per_page: "100", // Fetch a large number of categories to ensure we get all of them
        hide_empty: "true"
    }).toString();

    const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products/categories?${queryString}`;

    // Fetch categories from WooCommerce directly using fetch
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    const data = await response.json();

    // Build the hierarchical tree structure
    const categoryTree = buildCategoryTree(data);

    return NextResponse.json(categoryTree);
  } catch (error) {
    console.error("Error fetching categories from WooCommerce:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
