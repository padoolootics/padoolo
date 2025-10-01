import Banner from "@/components/Category/Banner";
import ShopComponent from "@/components/ShopComponent";

export default async function Page() {
  const categoryId = 36;
  return (
    <>
      <Banner
        title={"Clothing"}
        breadcrumb={["Home", "Category", "Clothing"]}
      />
      <ShopComponent catId={categoryId} />
    </>
  );
}
