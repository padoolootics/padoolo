import requests from './httpServices';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  // Add other fields as necessary based on your product model
}

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
    return requests.get<Product>(`/products/${slug}`);
  },

  getAllProducts: async (): Promise<Product> => {
    return requests.get<Product>(`/wc/v3/products`);
  },

};

export default ProductServices;