import requests from './httpServices';
import { Product, VariationProduct } from '@/types/products';

interface GetProductParams {
  category?: string;
  title?: string;
  slug?: string;
}

const ProductServices = {
  // Fetch products that are showing
  getShowingProducts: async (): Promise<Product[]> => {
    return requests.get<Product[]>('/products/show');
  },

  // Fetch products by store, with optional filters
  getShowingStoreProducts: async ({
    category = '',
    title = '',
    slug = '',
  }: GetProductParams): Promise<Product[]> => {
    return requests.get<Product[]>('/products/store', { category, title, slug });
  },

  // Fetch discounted products
  getDiscountedProducts: async (): Promise<Product[]> => {
    return requests.get<Product[]>('/products/discount');
  },

  // Fetch product details by its slug
  getProductBySlug: async (slug: string): Promise<Product> => {
    return requests.get<Product>(`/wc/v3/products/?slug=${slug}`);
  },

  getAllProducts: async (): Promise<Product[]> => {
    return requests.get<Product[]>(`/wc/v3/products`);
  },

  getProductsByCategory: async (categorySlug: string): Promise<Product[]> => {
    return requests.get<Product[]>(`/wc/v3/products?category=${categorySlug}`);
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    return requests.get<Product[]>(`/wc/v3/products?search=${query}`);
  },
  
  getProductById: async (productId: number): Promise<Product> => {
    return requests.get<Product>(`/wc/v3/products/${productId}`);
  },

  getProductVariations: async (productId: number): Promise<any> => {
    return requests.get<any>(`/wc/v3/products/${productId}/variations?per_page=100`);
  },

  getProductBySpecificIds: async (productIds: string): Promise<Product[]> => {
    return requests.get<Product[]>(`/wc/v3/products/?include=${productIds}`);
  },

  getProductVariationBySpecificId: async (productId: number, variationId?: number): Promise<VariationProduct> => {
    return requests.get<VariationProduct>(`/wc/v3/products/${productId}/variations/${variationId}`);
  },

  getRelatedProducts: async (
    categoryId: number,
    excludeProductId: number,
    perPage = 4
  ): Promise<Product[]> => {
    return requests.get<Product[]>(
      `/wc/v3/products?category=${categoryId}&exclude=${excludeProductId}&per_page=${perPage}`
    );
  },

  getProductsByCategorySlug: async (categorySlug: string): Promise<Product[]> => {
    return requests.get<Product[]>(`/custom/v1/products-by-category/?category_slug=${categorySlug}`);
  },

};

export default ProductServices;