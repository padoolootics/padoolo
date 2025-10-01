import requests, { setAuthToken } from "./httpServices";

export interface Variation {
  attribute: string;
  value: string;
}

export interface Product {
  product_id: number;
  product_name: string;
  price: string;
  regular_price: string;
  sale_price: string;
  variation: Variation[];
  variation_attributes: { [key: string]: string };
  variation_id: number | null;
  quantity: number;
  cart_item_key: number;
}

interface AddProduct {
  id: number;
  quantity: number;
  variation_id?: number;
}

interface UpdateProduct {
  product_id: number;
  variation_id?: number;
  quantity?: number;
}

interface RemoveProduct {
  product_id: number;
  variation_id?: number;
}

interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  variation_id?: number;
}

type SyncLocalCartRequest = {
  merge?: boolean; // false = replace, true = merge
  items: CartItem[];
};

type SyncLocalCartResponse = {
  message: string;
  cart: Product[];
};

/**
 * Represents a single item to be added or updated in the cart.
 */
interface CartItemRequest {
  product_id: number;
  variation_id?: number;
  quantity: number;
}

/**
 * Represents the full request body sent to the cart-total endpoint.
 */
export interface CartTotalRequest {
  merge?: boolean; // optional; default is false (replace)
  items?: CartItemRequest[]; // optional, can be empty if merge is true or user is logged in
  coupons?: string[]; // optional
  shipping_method?: string; // optional
}

// --- Response types ---

/**
 * Represents the full details of a single item in the cart.
 */
interface CartItemResponse {
  cart_item_key: string;
  product_id: number;
  variation_id: number;
  sku: string;
  name: string;
  quantity: number;
  image: string | null;
  price: string;
  price_incl_tax: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  backorders_allowed: boolean;
  line_subtotal: string;
  line_subtotal_tax: string;
  line_total: string;
  line_tax: string;
  tax_class: string;
  variation: { attribute: string; value: string; key: string; slug: string }[];
}

/**
 * Represents an applied coupon.
 */
interface CouponResponse {
  code: string;
  discount: string;
  applies_tax: string;
}

/**
 * Represents a fee applied to the cart.
 */
interface FeeResponse {
  name: string;
  total: string;
  tax: string;
}

/**
 * Represents a single shipping rate.
 */
interface ShippingRate {
  id: string;
  label: string;
  cost: string;
  taxes: string[];
}

/**
 * Represents a shipping package.
 */
interface ShippingPackage {
  package_id: number;
  destination: {
    country: string;
    state: string;
    postcode: string;
    city: string;
  };
  rates: ShippingRate[];
}

/**
 * Represents shipping information.
 */
interface ShippingResponse {
  chosen_method: string;
  total: string;
  tax?: string;
  packages: ShippingPackage[];
}

/**
 * Represents currency details.
 */
interface CurrencyResponse {
  code: string;
  symbol: string;
  position: string;
  decimals: number;
  decimal_sep: string;
  thousand_sep: string;
}

/**
 * Represents customer details.
 */
interface CustomerResponse {
  is_logged_in: boolean;
  shipping: {
    country: string;
    state: string;
    postcode: string;
    city: string;
  };
}

/**
 * Represents the full response object from the cart-total endpoint.
 */
export interface CartTotalResponse {
  items: CartItemResponse[];
  coupons: CouponResponse[];
  fees: FeeResponse[];
  subtotal: string;
  discount_total: string;
  discount_tax: string;
  shipping: ShippingResponse;
  total_tax: string;
  total: string;
  currency: CurrencyResponse;
  customer: CustomerResponse;
  meta: {
    merge: boolean;
    source_items: CartItemRequest[];
  };
  extensions: any;
  taxes: any;
  needs_payment: any;
  needs_shipping: any;
}

// =================================================================================================
// New and updated types for the checkout process
// =================================================================================================
/**
 * Represents the request body for the checkout process.
 */
export interface CheckoutRequest {
  customer_id?: number;
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  customer_note?: string;
  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    company: string;
    city: string;
    postcode: string;
    country: string;
    state: string;
    phone: string;
    email: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    company: string;
    city: string;
    postcode: string;
    country: string;
    state: string;
    phone: string;
    email: string;
  };
  line_items: Array<{
    product_id: number;
    variation_id: number;
    quantity: number;
  }>;
  shipping_lines?: Array<{
    method_id: string | undefined;
    method_title: string | undefined;
    total: string;
  }>;
  coupon_lines?: Array<{
    code: string;
  }>;
}

/**
 * Represents the full response from the WooCommerce Orders API.
 */
export interface OrderResponse {
  id: number;
  parent_id: number;
  status: string;
  currency: string;
  version: string;
  prices_include_tax: boolean;
  date_created: string;
  date_modified: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  customer_id: number;
  order_key: string;
  billing: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  customer_note: string;
  line_items: Array<{
    id: number;
    name: string;
    product_id: number;
    variation_id: number;
    quantity: number;
    tax_class: string;
    subtotal: string;
    subtotal_tax: string;
    total: string;
    total_tax: string;
    price: number;
  }>;
  shipping_lines: Array<{
    id: number;
    method_title: string;
    method_id: string;
    total: string;
    total_tax: string;
    taxes: string[];
  }>;
  fee_lines: any[];
  coupon_lines: any[];
  meta_data: any[];
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    email_templates: Array<{ href: string }>;
    customer: Array<{ href: string }>;
  };
}

/**
 * Represents the simplified response returned by the processCheckout service method.
 */
export interface CheckoutResponse {
  success: boolean;
  order_id?: number;
  message?: string;
}

const CartServices = {
  getCart: async (): Promise<Product[]> => {
    return requests.get<Product[]>("/wcx/v1/cart");
  },

  addToCart: async (product: AddProduct): Promise<Product> => {
    return requests.post<any>("/wcx/v1/cart/add-item", product);
  },

  updateCart: async (product: UpdateProduct): Promise<Product> => {
    return requests.post<any>("/wcx/v1/cart/update-item", product);
  },

  removeCart: async (product: RemoveProduct): Promise<Product> => {
    return requests.post<any>("/wcx/v1/cart/remove-item", product);
  },

  clearCart: async (): Promise<any> => {
    return requests.get<any>("/wcx/v1/cart/clear-cart");
  },

  syncLocalCart: async (
    payload: SyncLocalCartRequest
  ): Promise<SyncLocalCartResponse> => {
    return requests.post<SyncLocalCartResponse>(
      "/wcx/v1/sync-local-products",
      payload
    );
  },

  getCartTotal: async (
    requestData: CartTotalRequest
  ): Promise<CartTotalResponse> => {
    // Calling the real API endpoint
    return requests.post<CartTotalResponse>(
      "/custom/v1/cart-total",
      requestData
    );
  },

  // processCheckout: async (requestData: CheckoutRequest): Promise<CheckoutResponse> => {
  //   try {
  //     // Calling the real WordPress WooCommerce orders endpoint
  //     const response = await requests.post<OrderResponse>("/wc/v3/orders", requestData);
  //     return { success: true, order_id: response.id };
  //   } catch (error: any) {
  //     return {
  //       success: false,
  //       message: error.response?.data?.message || "Failed to process checkout.",
  //     };
  //   }
  // },

  processCheckout: async (
    requestData: CheckoutRequest
  ): Promise<CheckoutResponse> => {
    try {
      // Calling the real WordPress WooCommerce orders endpoint
      const response = await requests.post<OrderResponse>(
        "/wc/v3/orders",
        requestData
      );
      return { success: true, order_id: response.id };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to process checkout.",
      };
    }
  },

  /**
   * Fetches a single order by its ID.
   * @param orderId The ID of the order to fetch.
   * @returns A promise that resolves to the OrderResponse.
   */
  getOrderById: async (orderId: string): Promise<OrderResponse> => {
    return requests.get<OrderResponse>(`/wc/v3/orders/${orderId}`);
  },
};

export default CartServices;
