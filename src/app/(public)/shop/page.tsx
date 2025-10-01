import Banner from "@/components/Category/Banner";
import ShopComponent from "@/components/ShopComponent";

export default async function Page() {
  return (
    <>
      <Banner
        title={"Shop"}
        breadcrumb={["Home", "Shop"]}
      />
      <ShopComponent />
    </>
  );
}
