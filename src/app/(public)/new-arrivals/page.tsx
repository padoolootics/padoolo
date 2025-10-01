import Banner from "@/components/Category/Banner";
import ShopComponent from "@/components/ShopComponent";

export default async function Page() {
  const categoryId = 21;
  return (
    <>
      <Banner
        title={"New Arrivals"}
        breadcrumb={["Home", "Category", "New Arrivals"]}
      />
      <ShopComponent catId={categoryId} />
    </>
  );
}
