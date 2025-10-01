// lib/api/services/PageServices.ts

import requests from './httpServices';


interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  acf: Record<string, any>; // or type it better if you want
}

const PageServices = {
  getPageBySlug: async (slug: string): Promise<WPPage | null> => {
    const res = await requests.get<WPPage[]>(`/wp/v2/pages?slug=${slug}`);
    return res.length > 0 ? res[0] : null;
  },

  getPageById: async (id: number): Promise<any> => {
      return requests.get<any>(`wp/v2/pages/${id}`);
    },
};

export default PageServices;
