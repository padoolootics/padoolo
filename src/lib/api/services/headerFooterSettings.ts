import requests from './httpServices';

export type LinkTarget = '_self' | '_blank';

export interface HFMenuItem {
  label: string;
  url: string;
  target: string;
}

export interface HFMenu {
  title: string;
  items: HFMenuItem[];
}

export interface IconBoxContent {
    label: string;
  url: string;
  text: string;
}

export interface HFFooter {
  footer_logo: string;
  footer_menus: {
    menu_1: HFMenu;
    menu_2: HFMenu;
    menu_3: HFMenu;
    menu_4: HFMenu;
  };
  social_links: HFMenuItem[];
  footer_copyright: string;
  icon_boxes: IconBoxContent[];
}

type MarqueItem = {
  label: string;
};

export interface HFSettings {
  site_logo: string;
  header_menu: HFMenuItem[];
  marque: MarqueItem;
  footer: HFFooter;
}



const hfSettingServices = {
  
  getHFSettings: async (): Promise<HFSettings> => {
    return requests.get<HFSettings>(`/custom/v1/hfsettings`);
  },

};

export default hfSettingServices;