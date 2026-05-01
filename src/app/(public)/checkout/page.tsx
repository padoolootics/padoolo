"use client";

import { useEffect, useState, useCallback } from "react";
import { useCartContext } from "@/lib/Contexts/CartContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartServices, {
  CartTotalResponse,
  CheckoutRequest,
} from "@/lib/api/services/CartServices";
import CheckoutServices, { PaymentGateway } from "@/lib/api/services/CheckoutServices";
import { useAuth } from "@/lib/Contexts/AuthContext";
import { setAuthToken } from "@/lib/api/services/httpServices";
import { useRouter } from "next/navigation";
import { ArrowPathIcon, CreditCardIcon } from "@heroicons/react/24/solid";
import { getLocalCart } from "@/lib/hooks/localCart";
import PayPalComponent from "@/components/paypalbutton";
import UserServices from "@/lib/api/services/UserServices";

// Components
import AddressForm from "./components/AddressForm";
import OrderSummary from "./components/OrderSummary";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import CouponSection from "./components/CouponSection";

export interface UserAddress {
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
}

const emptyAddress: UserAddress = {
  first_name: "",
  last_name: "",
  address_1: "",
  address_2: "",
  company: "",
  city: "",
  postcode: "",
  country: "",
  state: "",
  phone: "",
  email: "",
};

const CheckoutPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { clearCart, loading: cartLoading } = useCartContext();
  const router = useRouter();

  // State
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);
  const [isLoadingGateways, setIsLoadingGateways] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [cartData, setCartData] = useState<CartTotalResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [couponCode, setCouponCode] = useState<string>("");
  const [couponLoading, setCouponLoading] = useState<boolean>(false);
  const [customerNote, setCustomerNote] = useState<string>("");
  const [addressInput, setAddressInput] = useState('');
  
  const [billingDetails, setBillingDetails] = useState<UserAddress>({...emptyAddress});
  const [shippingDetails, setShippingDetails] = useState<UserAddress>({...emptyAddress});

  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Initialize data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const fetchedGateways = await CheckoutServices.getPaymentGateways();
        const allGateways = fetchedGateways || [];
        const filteredGateways = allGateways.filter((g, index, self) => {
          // Specifically remove redundant card and pay-later entries from PayPal Payments plugin
          const isRedundant = (g.id.includes("card") || g.id.includes("pay-later")) && (g.id.startsWith("ppcp") || g.id.includes("paypal"));
          if (isRedundant) return false;

          const isPayPal = g.id.includes("paypal") || g.id.startsWith("ppcp");
          if (isPayPal) {
            // Keep only the first main PayPal gateway
            return index === self.findIndex(ig => (ig.id === "ppcp-gateway" || ig.id === "paypal") || (ig.id.includes("paypal") || ig.id.startsWith("ppcp")));
          }
          return true;
        });
        setPaymentGateways(filteredGateways);
        
        // If the current selected method is not in the list, select the first one
        if (filteredGateways.length > 0) {
          const ids = filteredGateways.map(g => g.id);
          if (!ids.includes(selectedPaymentMethod)) {
            // Prefer PayPal if available
            const paypalGateway = filteredGateways.find(g => g.id.includes("paypal") || g.id.startsWith("ppcp"));
            setSelectedPaymentMethod(paypalGateway ? paypalGateway.id : filteredGateways[0].id);
          }
        }
      } catch (error) {
        toast.error("Failed to load payment options.");
      } finally {
        setIsLoadingGateways(false);
      }

      if (isAuthenticated) {
        try {
          const userInfo = await UserServices.getCurrentUserInfo();
          if (userInfo.billing) setBillingDetails(prev => ({ ...prev, ...userInfo.billing }));
          if (userInfo.shipping) setShippingDetails(prev => ({ ...prev, ...userInfo.shipping }));
        } catch (e) {
          console.warn("Could not fetch detailed user info", e);
        }
      }
    };

    fetchInitialData();
  }, [isAuthenticated]);

  // Fetch cart totals
  const fetchCartTotals = useCallback(async () => {
    setIsLoading(true);
    try {
      const localCarts = getLocalCart();
      const localCartItems = localCarts.map((c) => ({
        product_id: c.id,
        variation_id: c.variationId || undefined,
        quantity: c.quantity,
      }));

      const payload = isAuthenticated 
        ? { coupons: couponCode ? [couponCode] : [], items: [] }
        : { items: localCartItems, coupons: couponCode ? [couponCode] : [] };

      if (isAuthenticated) setAuthToken(localStorage.getItem("token"));
      
      const data = await CartServices.getCartTotal(payload);
      setCartData(data);
    } catch (error) {
      console.error("Failed to fetch cart totals:", error);
      toast.error("Failed to load cart totals.");
    } finally {
      setIsLoading(false);
    }
  }, [couponCode, isAuthenticated]);

  useEffect(() => {
    fetchCartTotals();
  }, [fetchCartTotals]);

  // Google Maps Logic
  useEffect(() => {
    if (typeof window === 'undefined' || isLoading || cartLoading) return;

    const SCRIPT_ID = 'google-maps-script';

    const initAutocomplete = (inputId: string, type: 'billing' | 'shipping') => {
      if (typeof google === 'undefined' || !google.maps || !google.maps.places) return;
      const input = document.getElementById(inputId) as HTMLInputElement;
      if (!input) return;

      // Avoid multiple initializations on the same element
      if ((input as any)._autocomplete) return;

      const autocomplete = new google.maps.places.Autocomplete(input, {
        fields: ['address_components', 'formatted_address']
      });

      (input as any)._autocomplete = autocomplete;

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.address_components) return;

        const newAddress: Partial<UserAddress> = {};
        place.address_components.forEach((comp: any) => {
          const types = comp.types;
          if (types.includes('street_number')) newAddress.address_1 = comp.long_name;
          if (types.includes('route')) newAddress.address_1 = (newAddress.address_1 ? newAddress.address_1 + ' ' : '') + comp.long_name;
          if (types.includes('locality')) newAddress.city = comp.long_name;
          if (types.includes('administrative_area_level_1')) newAddress.state = comp.long_name;
          if (types.includes('postal_code')) newAddress.postcode = comp.long_name;
          if (types.includes('country')) newAddress.country = comp.long_name;
        });

        if (type === 'billing') {
          setBillingDetails(prev => ({ ...prev, ...newAddress }));
        } else {
          setShippingDetails(prev => ({ ...prev, ...newAddress }));
        }
      });
    };

    const handleLoad = () => {
      initAutocomplete('billing-address_1', 'billing');
      if (shipToDifferentAddress) {
        // Use a small timeout to ensure the element is in the DOM
        setTimeout(() => initAutocomplete('shipping-address_1', 'shipping'), 100);
      }
    };

    if (typeof google === 'undefined') {
      if (!document.getElementById(SCRIPT_ID)) {
        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
        script.async = true;
        script.onload = handleLoad;
        document.body.appendChild(script);
      } else {
        const existingScript = document.getElementById(SCRIPT_ID);
        if (existingScript) {
          existingScript.addEventListener('load', handleLoad);
        }
      }
    } else {
      handleLoad();
    }

    return () => {
      const existingScript = document.getElementById(SCRIPT_ID);
      if (existingScript) {
        existingScript.removeEventListener('load', handleLoad);
      }
    };
  }, [GOOGLE_API_KEY, shipToDifferentAddress, isLoading, cartLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: "billing" | "shipping") => {
    const { name, value } = e.target;
    if (type === "billing") {
      setBillingDetails(prev => ({ ...prev, [name]: value }));
    } else {
      setShippingDetails(prev => ({ ...prev, [name]: value }));
    }
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    try {
      const res = await CheckoutServices.validateCoupon(couponCode);
      if (res.valid) {
        toast.success(res.message);
        fetchCartTotals();
      } else {
        toast.error(res.message);
        setCouponCode("");
      }
    } catch (error) {
      toast.error("Error validating coupon.");
    } finally {
      setCouponLoading(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const required = ["first_name", "last_name", "address_1", "city", "postcode", "country"];
    
    required.forEach(field => {
      if (!billingDetails[field as keyof UserAddress]) errors[field] = "Required";
      if (shipToDifferentAddress && !shippingDetails[field as keyof UserAddress]) errors[`shipping_${field}`] = "Required";
    });

    if (!billingDetails.phone) errors.phone = "Required";
    if (!billingDetails.email) errors.email = "Required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createWooOrder = async () => {
    if (!cartData) return;
    setIsProcessingCheckout(true);
    try {
      // Use shipping details if different address is specified, otherwise use billing details
      const shippingPayload = shipToDifferentAddress ? shippingDetails : billingDetails;
      
      const requestData: CheckoutRequest = {
        customer_id: isAuthenticated ? Number(user?.id) : undefined,
        payment_method: selectedPaymentMethod,
        payment_method_title: selectedPaymentMethod === "cod" ? "Cash on delivery" : "PayPal",
        set_paid: false,
        customer_note: customerNote,
        billing: billingDetails,
        shipping: {
          first_name: shippingPayload.first_name,
          last_name: shippingPayload.last_name,
          address_1: shippingPayload.address_1,
          address_2: shippingPayload.address_2,
          company: shippingPayload.company,
          city: shippingPayload.city,
          postcode: shippingPayload.postcode,
          country: shippingPayload.country,
          state: shippingPayload.state,
        },
        line_items: cartData.items.map(item => ({
          product_id: item.product_id,
          variation_id: item.variation_id,
          quantity: item.quantity,
        })),
        shipping_lines: (() => {
          const chosenRate = cartData.shipping?.packages?.[0]?.rates?.find(r => r.id === cartData.shipping.chosen_method);
          return chosenRate 
            ? [{
                method_id: cartData.shipping.chosen_method,
                method_title: chosenRate.label,
                total: cartData.shipping.total,
              }]
            : [];
        })(),
        coupon_lines: cartData.coupons.map(c => ({ code: c.code })),
      };

      console.log("Creating order with request data:", requestData);

      const res = await CheckoutServices.createOrder(requestData);
      console.log("Order creation response:", res);
      if (res.id) {
        return { orderId: res.id, orderTotal: res.total };
      } else {
        toast.error("Order creation failed.");
      }
    } catch (error) {
      toast.error("Checkout failed.");
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      toast.error("Please fix form errors.");
      return;
    }
    const res = await createWooOrder();
    if (res) {
      clearCart();
      router.push(`/order-confirmation/${res.orderId}`);
    }
  };

  if (cartLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ArrowPathIcon className="h-12 w-12 text-yellow-600 animate-spin" />
      </div>
    );
  }

  if (!cartData || cartData.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => router.push("/")} className="bg-yellow-600 text-white px-6 py-2 rounded-lg">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 lg:max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Side */}
          <div className="flex-grow lg:w-2/3 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <AddressForm
                type="billing"
                title="Billing Details"
                icon={<CreditCardIcon className="h-5 w-5 mr-2 text-yellow-600" />}
                details={billingDetails}
                onChange={handleInputChange}
                errors={formErrors}
              />

              <div className="mt-8 pt-8 border-t border-gray-100">
                <label className="flex items-center mb-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shipToDifferentAddress}
                    onChange={(e) => setShipToDifferentAddress(e.target.checked)}
                    className="h-5 w-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Ship to a different address</span>
                </label>

                {shipToDifferentAddress && (
                  <AddressForm
                    type="shipping"
                    title="Shipping Address"
                    details={shippingDetails}
                    onChange={handleInputChange}
                    errors={formErrors}
                  />
                )}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes (optional)</label>
                <textarea
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                  rows={3}
                  placeholder="Notes about your order, e.g. special notes for delivery."
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            <OrderSummary cartData={cartData} />
            
            <CouponSection
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              onApply={handleApplyCoupon}
              isLoading={couponLoading}
              appliedCoupons={cartData.coupons}
            />

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
              <PaymentMethodSelector
                gateways={paymentGateways}
                selectedMethod={selectedPaymentMethod}
                onSelect={setSelectedPaymentMethod}
                isLoading={isLoadingGateways}
              />

              <div className="mt-8">
                {selectedPaymentMethod.includes("paypal") || selectedPaymentMethod.startsWith("ppcp") ? (
                  <PayPalComponent
                    cartItems={cartData.items.map(item => ({
                      product_id: item.product_id,
                      variation_id: item.variation_id || undefined,
                      quantity: item.quantity,
                    }))}
                    onPaymentSuccess={() => {}}
                    validateForm={validateForm}
                    createWooOrder={createWooOrder}
                    couponCode={couponCode}
                  />
                ) : (
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessingCheckout}
                    className="w-full bg-yellow-600 text-white py-4 rounded-xl font-bold hover:bg-yellow-700 transition disabled:opacity-50"
                  >
                    {isProcessingCheckout ? "Processing..." : "Place Order"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default CheckoutPage;
