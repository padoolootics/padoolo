import ProductServices from "./ProductServices";
import PageServices from "./pageServices";
import { Product } from "@/types/products";

export interface HomeMasterData {
  pageData: any;
  sections: {
    sec2_1: Product[];
    sec2_2: Product[];
    sec4_tab1: Product[];
    sec4_tab2: Product[];
    sec5_tab1: Product[];
    sec5_tab2: Product[];
    sec6: Product[];
    sec7_tab1: Product[];
    sec7_tab2: Product[];
    sec8_tab1: Product[];
    sec8_tab2: Product[];
  };
}

const HomeServices = {
  /**
   * Fetches all data required for the home page in parallel.
   * This centralizes the fetching logic and improves performance by 
   * reducing the number of individual service calls.
   */
  getHomeMasterData: async (): Promise<HomeMasterData> => {
    try {
      const pageData = await PageServices.getPageBySlug("home-page");
      const acf = pageData?.acf || {};

      const [
        _sec2_1,
        _sec2_2,
        _sec4_1,
        _sec4_2,
        _sec5_1,
        _sec5_2,
        _sec6,
        _sec7_1,
        _sec7_2,
        _sec8_1,
        _sec8_2,
      ] = await Promise.all([
        ProductServices.getProductsByCategory(acf?.sec2_1_category_id || ""),
        ProductServices.getProductsByCategory(acf?.sec2_2_category_id || ""),
        ProductServices.getProductsByCategory(acf?.sec4_tab1_category_id || ""),
        ProductServices.getProductsByCategory(acf?.sec4_tab_2_category_id || ""),
        ProductServices.getProductsByCategory(acf?.sec5_tab_1_category_id || ""),
        ProductServices.getProductsByCategory(acf?.sec5_tab_2_category_id || ""),
        ProductServices.getProductsByCategory(acf?.sec6_category_id || ""),
        ProductServices.getProductsByCategory(acf?.sec7_tab_1_category_id || ""),
        ProductServices.getProductsByCategory(acf?.sec7_tab_2_category_id || ""),
        ProductServices.getProductsByCategory(acf?.sec8_tab_1_category_id || ""),
        ProductServices.getProductsByCategory(acf?.sec8_tab_2_category_id || ""),
      ]);

      return {
        pageData,
        sections: {
          sec2_1: _sec2_1,
          sec2_2: _sec2_2,
          sec4_tab1: _sec4_1,
          sec4_tab2: _sec4_2,
          sec5_tab1: _sec5_1,
          sec5_tab2: _sec5_2,
          sec6: _sec6,
          sec7_tab1: _sec7_1,
          sec7_tab2: _sec7_2,
          sec8_tab1: _sec8_1,
          sec8_tab2: _sec8_2,
        },
      };
    } catch (error) {
      console.error("Error fetching home master data:", error);
      throw error;
    }
  },
};

export default HomeServices;
