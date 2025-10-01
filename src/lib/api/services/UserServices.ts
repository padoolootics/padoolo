import requests from './httpServices';
import { Order, WPUser } from '../types';

const UserServices = {
  getCurrentUserInfo: async (): Promise<WPUser> => {
    return requests.get<WPUser>('custom/v1/user-info');
  },

  updateCurrentUserInfo: async ( accountInfo: any ): Promise<any> => {
    return requests.post<any>('custom/v1/user-info', accountInfo );
  },

  getOrders: async (): Promise<Order> => {
    return requests.get<Order>('wc/v3/orders');
  },

   getOrderById: async (id: number): Promise<Order> => {
    return requests.get<Order>(`wc/v3/orders/${id}`);
  },

  getCurrentUserAccInfo: async (): Promise<WPUser> => {
    return requests.get<WPUser>('custom/v1/account-info');
  },

  updateUserInfo: async (
    id: number,
    userInfo: {
      firstName?: string;
      lastName?: string;
      email?: string;
      billing_first_name?: string;
      billing_last_name?: string;
      billing_company?: string;
      billing_address_1?: string;
      billing_address_2?: string;
      billing_city?: string;
      billing_state?: string;
      billing_postcode?: string;
      billing_country?: string;
      billing_phone?: string;
      shipping_first_name?: string;
      shipping_last_name?: string;
      shipping_company?: string;
      shipping_address_1?: string;
      shipping_address_2?: string;
      shipping_city?: string;
      shipping_state?: string;
      shipping_postcode?: string;
      shipping_country?: string;
      avatar?: File; // For the avatar file upload
    }
  ): Promise<any> => {
    const formData = new FormData();

    // Append user information to the formData
    if (userInfo.firstName) formData.append('firstName', userInfo.firstName);
    if (userInfo.lastName) formData.append('lastName', userInfo.lastName);
    if (userInfo.email) formData.append('email', userInfo.email);

    // Append billing information
    if (userInfo.billing_first_name) formData.append('billing_first_name', userInfo.billing_first_name);
    if (userInfo.billing_last_name) formData.append('billing_last_name', userInfo.billing_last_name);
    if (userInfo.billing_company) formData.append('billing_company', userInfo.billing_company);
    if (userInfo.billing_address_1) formData.append('billing_address_1', userInfo.billing_address_1);
    if (userInfo.billing_address_2) formData.append('billing_address_2', userInfo.billing_address_2);
    if (userInfo.billing_city) formData.append('billing_city', userInfo.billing_city);
    if (userInfo.billing_state) formData.append('billing_state', userInfo.billing_state);
    if (userInfo.billing_postcode) formData.append('billing_postcode', userInfo.billing_postcode);
    if (userInfo.billing_country) formData.append('billing_country', userInfo.billing_country);
    if (userInfo.billing_phone) formData.append('billing_phone', userInfo.billing_phone);

    // Append shipping information
    if (userInfo.shipping_first_name) formData.append('shipping_first_name', userInfo.shipping_first_name);
    if (userInfo.shipping_last_name) formData.append('shipping_last_name', userInfo.shipping_last_name);
    if (userInfo.shipping_company) formData.append('shipping_company', userInfo.shipping_company);
    if (userInfo.shipping_address_1) formData.append('shipping_address_1', userInfo.shipping_address_1);
    if (userInfo.shipping_address_2) formData.append('shipping_address_2', userInfo.shipping_address_2);
    if (userInfo.shipping_city) formData.append('shipping_city', userInfo.shipping_city);
    if (userInfo.shipping_state) formData.append('shipping_state', userInfo.shipping_state);
    if (userInfo.shipping_postcode) formData.append('shipping_postcode', userInfo.shipping_postcode);
    if (userInfo.shipping_country) formData.append('shipping_country', userInfo.shipping_country);

    // Append avatar file if provided
    if (userInfo.avatar) formData.append('avatar', userInfo.avatar);

    // Send the request using the modified request handler
    return requests.post<any>('custom/v1/account-info', formData);
  },
};

export default UserServices;