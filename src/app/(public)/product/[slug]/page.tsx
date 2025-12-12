import { notFound } from "next/navigation";
// import { fetchProductById, fetchProductVariations } from '@/lib/woo-api';
import { Product, ProductVariation } from "../types/woocommerce";
import ProductClient from "./ProductClient";
import ProductServices from "@/lib/api/services/ProductServices";
import ProductTabber from "../../components/Tabber";
import Link from "next/link";

type Props = {
  params: { slug: string };
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  //   const productId = await ProductServices.getProductBySlug(params.slug);

  //   if (!productId) {
  //     notFound();
  //   }

  // Fetch main product data
  const productArray: any = await ProductServices.getProductBySlug(slug);
  const product = productArray[0];

  const relatedIds = product.related_ids.map((pId: any) => pId).join(",");
  const relatedItems = await ProductServices.getProductBySpecificIds(
    relatedIds
  );

    // console.log('product by slug', product);

  let variations: any[] = [];
  if (product.type === "variable" && product.variations.length > 0) {
    // Fetch all available variations for a variable product
    // variations = await fetchProductVariations(product.id);
    variations = await ProductServices.getProductVariations(product.id);
  }

  // --- Grouped Product Handling ---
  // If it's a grouped product, you might also fetch the child products here
  // based on an array of child product IDs often found in the main product object.
  // For simplicity, this example focuses on Simple/Variable products.

  return (
    <div className="container mx-auto py-12">
        {/*  bredcrumbs starts here */}
      <div className="container mx-auto">
        <div className="flex items-center gap-2 mt-0 mb-4">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Home /
          </Link>
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            products /
          </Link>
          <Link
            href="/"
            className="text-gray-400 hover:text-gray-800 text-sm font-medium"
          >
            {slug}
          </Link>
        </div>
      </div>
      <ProductClient product={product} variations={variations} />
      <div className="container mx-auto related-products-product-page-wr mt-4">
        <ProductTabber
          productsByTab={{
            "Related Products": relatedItems,
          }}
          layout={"tabbed"}
          tabs={["Related Products"]}
        />
      </div>
    </div>
  );
}

// Optional: Generate static paths if using static generation
// export async function generateStaticParams() {
//   // Fetch list of all product slugs from API
//   const slugs = ['123', '456']; // Example slugs/IDs
//   return slugs.map((slug) => ({ slug }));
// }
