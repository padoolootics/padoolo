import ProductServices from "@/lib/api/services/ProductServices";
import ProductDetail from "../../components/ProductDetail";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import RelatedProductSlider from "../../components/RelatedProductsSlider";
import ProductTabber from "../../components/Tabber";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const productDetails: any = await ProductServices.getProductBySlug(slug);
  const finalProduct = productDetails[0];
  const product = {
    price: "290.00",
    regular_price: "290.00",
    sale_price: "265.00",
  };

  const relatedIds = finalProduct.related_ids.map((pId: any) => pId).join(",");
  const relatedItems = await ProductServices.getProductBySpecificIds(
    relatedIds
  );

  const categoryId = finalProduct.categories?.[0]?.id;
  let relatedProducts: any = [];

  if (categoryId) {
    relatedProducts = await ProductServices.getRelatedProducts(
      categoryId,
      finalProduct.id
    );
  }

  const discount = product.sale_price
    ? `${Math.round(
        (1 -
          parseFloat(product.sale_price) / parseFloat(product.regular_price)) *
          100
      )}% OFF`
    : null;

  return (
    <>
      {/*  bredcrumbs starts here */}
      <div className="container mx-auto">
        <div className="flex items-center gap-2 mt-4">
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
      {/* breadcrumbs ends here */}
      <ProductDetail product={finalProduct} discount={discount} />
      <div className="container mx-auto related-products-product-page-wr mt-4">
        <ProductTabber
          productsByTab={{
            "Related Products": relatedItems,
          }}
          layout={"tabbed"}
          tabs={["Related Products"]}
        />
      </div>
    </>
  );
}
