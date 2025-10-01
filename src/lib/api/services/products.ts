import { Product, ProductList } from '../types';

export const productApi = {
  getProducts: async (params?: { page?: number; per_page?: number }): Promise<{ data: ProductList | null; error: string | null }> => {
    try {
      if (!process.env.NEXT_PUBLIC_WP_API_URL) {
        return { data: null, error: 'WP_API_URL is not configured' };
      }
      const url = new URL(`${process.env.NEXT_PUBLIC_WP_API_URL}/wc/store/v1/products`);
      if (params) {
        if (params.page) url.searchParams.append('page', params.page.toString());
        if (params.per_page) url.searchParams.append('per_page', params.per_page.toString());
      }
      const response = await fetch(url.toString(), { cache: process.env.CACHE_MODE as RequestCache || 'default' });
      if (!response.ok) {
        return { data: null, error: `Failed to fetch products: ${response.statusText}` };
      }
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
  getProduct: async (id: number): Promise<{ data: Product | null; error: string | null }> => {
    try {
      if (!process.env.WP_API_URL) {
        return { data: null, error: 'WP_API_URL is not configured' };
      }
      const url = new URL(`/wc/store/v1/products/${id}`, process.env.WP_API_URL);
      const response = await fetch(url.toString(), { cache: process.env.CACHE_MODE as RequestCache || 'default' });
      if (!response.ok) {
        return { data: null, error: `Failed to fetch product: ${response.statusText}` };
      }
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
};