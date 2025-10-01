import Banner from "@/components/Category/Banner";
import ShopComponent from "@/components/ShopComponent";

export default async function Page() {
  const categoryId = 16;
  return (
    <>
      <Banner
        title={"Sunglasses"}
        breadcrumb={["Home", "Category", "Sunglasses"]}
      />
      <ShopComponent catId={categoryId} />
    </>
  );
}
