import ProductSlider from "@/components/Slider/ProductSlider";
import HeroSlider from "@/components/HeroSlider";
import ImageSlider from "@/components/Slider/ImageSlider";
import NewArrival from "@/components/NewArrival";
import ProductTabber from "./components/Tabber";
import HomeServices from "@/lib/api/services/HomeServices";
import { Product } from "@/types/products";

export default async function Home() {
  let masterData: any = null;

  try {
    masterData = await HomeServices.getHomeMasterData();
  } catch (error) {
    console.error("Error fetching home data:", error);
    masterData = { 
      pageData: { acf: {} }, 
      sections: {
        sec2_1: [], sec2_2: [], sec4_tab1: [], sec4_tab2: [],
        sec5_tab1: [], sec5_tab2: [], sec6: [], sec7_tab1: [],
        sec7_tab2: [], sec8_tab1: [], sec8_tab2: []
      } 
    };
  }

  const { pageData, sections } = masterData;
  const acf = pageData?.acf || {};
  
  const {
    sec2_1: sec2_1_products,
    sec2_2: sec2_2_products,
    sec4_tab1: sec4_tab1_products,
    sec4_tab2: sec4_tab2_products,
    sec5_tab1: sec5_tab1_products,
    sec5_tab2: sec5_tab2_products,
    sec6: sec6_products,
    sec7_tab1: sec7_tab1_products,
    sec7_tab2: sec7_tab2_products,
    sec8_tab1: sec8_tab1_products,
    sec8_tab2: sec8_tab2_products,
  } = sections;

  // console.log('spotlightRawProducts', spotlightRawProducts);

  const sec4Tab1Title = acf?.sec4_tab_1_title || "Sunglasses";
  const sec4Tab2Title = acf?.sec4_tab_2_title || "Glasses";
  const sec5Tab1Title = acf?.sec5_tab_1_title || "Tab 1";
  const sec5Tab2Title = acf?.sec5_tab_2_title || "Tab 2";
  const sec7Tab1Title = acf?.sec7_tab1_title || "Tab 1";
  const sec7Tab2Title = acf?.sec7_tab_2_title || "Tab 2";
  const sec8Tab1Title = acf?.sec8_tab_1_title || "Tab 1";
  const sec8Tab2Title = acf?.sec8_tab_2_title || "Tab 2";

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider data={acf} />
      {/* SECTION 1: Spotlight + New Arrivals */}
      <div className="container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 pb-2 lg:pb-8 px-4 lg:px-0">
          <div>
            <ProductSlider
              title={acf?.sec2_1_heading || "Spotlight Deals"}
              layout="single"
              products={sec2_1_products}
            />

            <div className="bg-[#D99E46] text-center mb-[20px] h-[70px] w-[263px] mx-auto relative mt-12">
              <span className="absolute left-0 right-0 top-[-20px] block text-[30px] text-[#001F3E]">
                {acf?.sec2_offer_text || "SALE UP TO"}
              </span>
              <span className="absolute left-0 right-0 bottom-[-70px] block text-[90px] text-[#001F3E] font-[700]">
                {acf?.sec2_offer_percentage || "70%"}
              </span>
            </div>
          </div>

          <ProductSlider
            title={acf?.sec2_2_heading || "New Arrivals"}
            layout="grid2x2"
            products={sec2_2_products}
          />
        </div>
      </div>

      {/* SECTION 2: Image Slider  */}
      <ImageSlider acf={acf} />

      {/* SECTION 3: Tabbed Sunglasses / Eyeglasses */}
      <ProductTabber
        productsByTab={{
          [sec4Tab1Title]: sec4_tab1_products,
          [sec4Tab2Title]: sec4_tab2_products,
        }}
        layout={"tabbed"}
        tabs={[sec4Tab1Title, sec4Tab2Title]}
      />

      {/* SECTION 4: Tabbed Products (sec5) */}
      <ProductTabber
        productsByTab={{
          [sec5Tab1Title]: sec5_tab1_products,
          [sec5Tab2Title]: sec5_tab2_products,
        }}
        layout="tabbed"
        tabs={[sec5Tab1Title, sec5Tab2Title]}
      />

      {/* SECTION 5: Banner + Watch Slider */}
      <div className="flex flex-col md:flex-row gap-8 items-stretch mb-12">
        {/* Left section: visible only on desktop (lg and above) */}
        <div
          className="hidden lg:block w-full md:w-1/3 h-80 lg:h-auto bg-cover bg-center justify-center p-6 text-white"
          style={{
            backgroundImage: `url('${acf?.sec6_image_1 || "/watches/bg.png"}')`,
          }}
        ></div>

        {/* Right section: always full width */}
        <div className="w-full text-center xl:text-left lg:text-left">
          <NewArrival
            products={sec6_products}
            heading={acf?.sec6_heading}
            buttonText={acf?.sec6_button_text}
            buttonUrl={acf?.sec6_button_url}
          />
        </div>
      </div>

      {/* SECTION 6: Tabbed Products (sec7) */}
      <ProductTabber
        productsByTab={{
          [sec7Tab1Title]: sec7_tab1_products,
          [sec7Tab2Title]: sec7_tab2_products,
        }}
        layout="tabbed"
        tabs={[sec7Tab1Title, sec7Tab2Title]}
      />

      {/* SECTION 7: Center Tabbed */}
      <ProductTabber
        productsByTab={{
          [sec8Tab1Title]: sec8_tab1_products,
          [sec8Tab2Title]: sec8_tab2_products,
        }}
        layout="center-tabbed"
        tabs={[sec8Tab1Title, sec8Tab2Title]}
      />
    </div>
  );
}
