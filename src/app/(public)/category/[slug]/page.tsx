import ProductServices from "@/lib/api/services/ProductServices";
import Details from "./details";
import Banner from "@/components/Category/Banner";
import ShopComponent from "@/components/ShopComponent";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params;
  // console.log('Category slug:', slug);
  // const products = await ProductServices.getProductsByCategorySlug(slug);
  const categoryId = 21

  return (
    <>
    <Banner title={'New Arrivals'} breadcrumb={["Home", "Category", "New Arrivals"]} />
      {/* <Details products={products} /> */}
      <ShopComponent catId={categoryId} />
    </>
  );
}
