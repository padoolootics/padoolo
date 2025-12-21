import ProductSlider from "@/components/Slider/ProductSlider";
import HeroSlider from "@/components/HeroSlider";
import ImageSlider from "@/components/Slider/ImageSlider";
import NewArrival from "@/components/NewArrival";
import ProductTabber from "./components/Tabber";
import ProductServices from "@/lib/api/services/ProductServices";
import PageServices from "@/lib/api/services/pageServices";
import { Product } from "@/types/products";

// type Product = {
//   id: number;
//   name: string;
//   slug: string;
//   price: number;
//   image: string;
//   category?: string;
// };

export default async function Home() {
  // const pageData = await PageServices.getPageBySlug("home-page");

  // const spotlightRawProducts = await ProductServices.getProductsByCategory(
  //   pageData?.acf?.spotlight_deals
  // );
  // const newArrivalsRawProducts = await ProductServices.getProductsByCategory(
  //   pageData?.acf?.new_arrivals
  // );
  // const sunglassesRawProducts = await ProductServices.getProductsByCategory(
  //   pageData?.acf?.sunglasses_category_id
  // );
  // const eyeglassesRawProducts = await ProductServices.getProductsByCategory(
  //   pageData?.acf?.eyeglasses_category_id
  // );
  // const latestRawProducts = await ProductServices.getProductsByCategory(
  //   pageData?.acf?.latest_products_category_id
  // );
  // const bestsellersRawProducts = await ProductServices.getProductsByCategory(
  //   pageData?.acf?.bestsellers_category_id
  // );
  // const watchRawProducts = await ProductServices.getProductsByCategory(
  //   pageData?.acf?.watch_category_id
  // );

  let pageData = null;
  let spotlightRawProducts: any = null;
  let newArrivalsRawProducts: any = null;
  let sunglassesRawProducts: any = null;
  let eyeglassesRawProducts: any = null;
  let latestRawProducts: any = null;
  let bestsellersRawProducts: any = null;
  let watchRawProducts: any = null;

  try {
    pageData = await PageServices.getPageBySlug("home-page");

    const [
      spotlight,
      newArrivals,
      sunglasses,
      eyeglasses,
      latest,
      bestsellers,
      watch,
    ] = await Promise.all([
      ProductServices.getProductsByCategory(pageData?.acf?.spotlight_deals),
      ProductServices.getProductsByCategory(pageData?.acf?.new_arrivals),
      ProductServices.getProductsByCategory(
        pageData?.acf?.sunglasses_category_id
      ),
      ProductServices.getProductsByCategory(
        pageData?.acf?.eyeglasses_category_id
      ),
      ProductServices.getProductsByCategory(
        pageData?.acf?.latest_products_category_id
      ),
      ProductServices.getProductsByCategory(
        pageData?.acf?.bestsellers_category_id
      ),
      ProductServices.getProductsByCategory(pageData?.acf?.watch_category_id),
    ]);

    spotlightRawProducts = spotlight;
    newArrivalsRawProducts = newArrivals;
    sunglassesRawProducts = sunglasses;
    eyeglassesRawProducts = eyeglasses;
    latestRawProducts = latest;
    bestsellersRawProducts = bestsellers;
    watchRawProducts = watch;
  } catch (error) {
    console.error("Error fetching data:", error);
    pageData = { acf: {} };
    spotlightRawProducts = [];
    newArrivalsRawProducts = [];
    sunglassesRawProducts = [];
    eyeglassesRawProducts = [];
    latestRawProducts = [];
    bestsellersRawProducts = [];
    watchRawProducts = [];
  }

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider data={pageData?.acf} />
      {/* SECTION 1: Spotlight + New Arrivals */}
      <div className="container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 pb-2 lg:pb-8 px-4 lg:px-0">
          <div>
            <ProductSlider
              title="Spotlight Deals"
              layout="single"
              products={spotlightRawProducts}
            />

            <div className="bg-[#D99E46] text-center mb-[20px] h-[70px] w-[263px] mx-auto relative mt-12">
              <span className="absolute left-0 right-0 top-[-20px] block text-[30px] text-[#001F3E]">
                SALE UP TO
              </span>
              <span className="absolute left-0 right-0 bottom-[-70px] block text-[90px] text-[#001F3E] font-[700]">
                70%
              </span>
            </div>
          </div>

          <ProductSlider
            title="New Arrivals"
            layout="grid2x2"
            products={newArrivalsRawProducts}
          />
        </div>
      </div>

      {/* SECTION 2: Image Slider  */}
      <ImageSlider />

      {/* SECTION 3: Tabbed Sunglasses / Eyeglasses */}
      <ProductTabber
        productsByTab={{
          Sunglasses: sunglassesRawProducts,
          Eyeglasses: eyeglassesRawProducts,
        }}
        layout={"tabbed"}
        tabs={["Sunglasses", "Eyeglasses"]}
      />
      {/* SECTION 4: bestseller again */}
      <ProductTabber
        productsByTab={{
          "Latest's Products": latestRawProducts,
          "Bestseller's": bestsellersRawProducts,
        }}
        layout="tabbed"
        tabs={["Latest's Products", "Bestseller's"]}
      />

      {/* SECTION 5: Banner + Watch Slider */}
      <div className="flex flex-col md:flex-row gap-8 items-stretch mb-12">
        {/* Left section: visible only on desktop (lg and above) */}
        <div
          className="hidden lg:block w-full md:w-1/3 h-80 lg:h-auto bg-cover bg-center flex flex-col justify-center p-6 text-white"
          style={{ backgroundImage: "url('/watches/bg.png')" }}
        ></div>

        {/* Right section: always full width */}
        <div className="w-full text-center xl:text-left lg:text-left">
          <NewArrival products={watchRawProducts} />
        </div>
      </div>

      {/* SECTION 6: Latest Tabbed Products */}
      <ProductTabber
        productsByTab={{
          "Latest's Products": latestRawProducts,
          "Bestseller's": bestsellersRawProducts,
        }}
        layout="tabbed"
        tabs={["Latest's Products", "Bestseller's"]}
      />

      {/* SECTION 7: Center Tabbed */}
      <ProductTabber
        productsByTab={{
          Eyeglasses: eyeglassesRawProducts,
          Sunglasses: sunglassesRawProducts,
        }}
        layout="center-tabbed"
        tabs={["Eyeglasses", "Sunglasses"]}
      />
    </div>
  );
}
