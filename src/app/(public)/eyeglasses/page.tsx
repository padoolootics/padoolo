import Banner from "@/components/Category/Banner";
import ShopComponent from "@/components/ShopComponent";

export default async function Page() {
  const categoryId = 17;
  return (
    <>
      <Banner
        title={"Eyeglasses"}
        breadcrumb={["Home", "Category", "Eyeglasses"]}
      />
      <ShopComponent catId={categoryId} />
    </>
  );
}
