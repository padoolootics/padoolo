import Banner from "@/components/Category/Banner";
import ShopComponent from "@/components/ShopComponent";

export default async function Page() {
  const categoryId = 22;
  return (
    <>
      <Banner
        title={"Spotlight Deals"}
        breadcrumb={["Home", "Category", "Spotlight Deals"]}
      />
      <ShopComponent catId={categoryId} />
    </>
  );
}
