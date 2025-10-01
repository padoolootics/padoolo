const CACHE_MODE = process.env.CACHE_MODE || 'default';

export const fetchClient = {
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(endpoint, process.env.WP_API_URL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
    }
    const response = await fetch(url.toString(), { cache: CACHE_MODE as RequestCache });
    if (!response.ok) throw new Error('Fetch failed');
    return response.json();
  },
};