"use client";

import { useEffect, useState, useCallback } from "react";
import { useCartContext } from "@/lib/Contexts/CartContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartServices, {
  CartTotalResponse,
  CheckoutRequest,
} from "@/lib/api/services/CartServices";
import { useAuth } from "@/lib/Contexts/AuthContext";
import { setAuthToken } from "@/lib/api/services/httpServices";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowPathIcon, CreditCardIcon } from "@heroicons/react/24/solid";
import { getLocalCart } from "@/lib/hooks/localCart";
import PayPalComponent from "@/components/paypalbutton";
import UserServices from "@/lib/api/services/UserServices";

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
}

interface UserAddress {
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

interface UserWithDetails extends UserResponse {
  billing: Partial<UserAddress>;
  shipping: Partial<UserAddress>;
}

const splitName = (fullName: string) => {
  const names = (fullName || "").trim().split(" ");
  const first_name = names[0] || "";
  const last_name = names.slice(1).join(" ") || "";
  return { first_name, last_name };
};

interface FormErrors {
  [key: string]: string;
}

interface PaymentGateway {
  id: string;
  title: string;
  description: string;
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
  const { clearCart, loading } = useCartContext();
  const userDetails = user as UserWithDetails | null;
  const router = useRouter();
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);
  const [isLoadingGateways, setIsLoadingGateways] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("cod");
  const [cartData, setCartData] = useState<CartTotalResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [isSameAsBilling, setIsSameAsBilling] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  // const [paypalCartItems, setPaypalCartItems] = useState<
  //   { product_id: number; variation_id?: number; quantity: number }[]
  // >([]);
  const [couponCode, setCouponCode] = useState<string>("");
  const [couponLoading, setCouponLoading] = useState<boolean>(false);
  const [customerNote, setCustomerNote] = useState<string>("");
  const [debouncedAddress, setDebouncedAddress] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [addressPredictions, setAddressPredictions] = useState<string[]>([]);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  // Use the unified address shape for both billing and shipping
  const [billingDetails, setBillingDetails] = useState<UserAddress>({
    ...emptyAddress,
  });
  const [shippingDetails, setShippingDetails] = useState<UserAddress>({
    ...emptyAddress,
  });

  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // console.log("billingDetails", billingDetails);

  // Handler to update the address input
  const handleAddressChange = (e: any) => {
    const { value } = e.target;
    setAddressInput(value);
  };

  // Debounce the address input to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (addressInput.length >= 2) {
        setDebouncedAddress(addressInput);
      }
    }, 500); // 500ms debounce time (adjust as needed)

    return () => clearTimeout(timeoutId); // Cleanup timeout on every rerender
  }, [addressInput]);

  // Load the Google Maps script and initialize the Autocomplete service
  useEffect(() => {
    if (debouncedAddress.length >= 2) {
      if (typeof google !== 'undefined') {
        const inputElement = document.getElementById('billing-address_1');
        const autocomplete = new google.maps.places.Autocomplete(inputElement);
        autocomplete.setFields(['address_component', 'formatted_address']);
        
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) {
            // setAddressPredictions([place.formatted_address]);
            // Extract address components and populate the UserAddress object
            const addressComponents = place.address_components;
            const address: UserAddress = {
              first_name: billingDetails.first_name, 
              last_name: billingDetails.last_name,
              address_1: "",
              address_2: "",
              company: billingDetails.company,
              city: "",
              postcode: "",
              country: "",
              state: "",
              phone: billingDetails.phone,
              email: billingDetails.email,
            };

            // Loop through address components and map to UserAddress fields
            addressComponents.forEach((component: any ) => {
              const types = component.types;
              if (types.includes('street_number')) {
                address.address_1 = component.long_name;
              }
              if (types.includes('route')) {
                address.address_1 += " " + component.long_name;
              }
              if (types.includes('locality')) {
                address.city = component.long_name;
              }
              if (types.includes('administrative_area_level_1')) {
                address.state = component.long_name;
              }
              if (types.includes('postal_code')) {
                address.postcode = component.long_name;
              }
              if (types.includes('country')) {
                address.country = component.long_name;
              }
            });

            // Set the extracted address into the state
            setBillingDetails(address);
            setAddressPredictions([place.formatted_address]);
          }
        });
      }
    }
  }, [billingDetails.company, billingDetails.email, billingDetails.first_name, billingDetails.last_name, billingDetails.phone, debouncedAddress]);


  // Load the Google Maps script and initialize the Autocomplete service
  useEffect(() => {
    if (debouncedAddress.length >= 2) {
      if (typeof google !== 'undefined') {
        const inputElement = document.getElementById('shipping-address_1');
        const autocomplete = new google.maps.places.Autocomplete(inputElement);
        autocomplete.setFields(['address_component', 'formatted_address']);
        
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) {
            // setAddressPredictions([place.formatted_address]);
            // Extract address components and populate the UserAddress object
            const addressComponents2 = place.address_components;
            const address2: UserAddress = {
              first_name: shippingDetails.first_name, 
              last_name: shippingDetails.last_name,
              address_1: "",
              address_2: "",
              company: shippingDetails.company,
              city: "",
              postcode: "",
              country: "",
              state: "",
              phone: shippingDetails.phone,
              email: shippingDetails.email,
            };

            // Loop through address components and map to UserAddress fields
            addressComponents2.forEach((component: any ) => {
              const types = component.types;
              if (types.includes('street_number')) {
                address2.address_1 = component.long_name;
              }
              if (types.includes('route')) {
                address2.address_1 += " " + component.long_name;
              }
              if (types.includes('locality')) {
                address2.city = component.long_name;
              }
              if (types.includes('administrative_area_level_1')) {
                address2.state = component.long_name;
              }
              if (types.includes('postal_code')) {
                address2.postcode = component.long_name;
              }
              if (types.includes('country')) {
                address2.country = component.long_name;
              }
            });

            // Set the extracted address into the state
            setShippingDetails(address2);
            setAddressPredictions([place.formatted_address]);
          }
        });
      }
    }
  }, [billingDetails.company, billingDetails.email, billingDetails.first_name, billingDetails.last_name, billingDetails.phone, debouncedAddress, shippingDetails.company, shippingDetails.email, shippingDetails.first_name, shippingDetails.last_name, shippingDetails.phone]);


  // Load the Google Maps API script dynamically
  useEffect(() => {
    if (typeof google === 'undefined') {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => {
        console.log('Google Maps script loaded successfully');
      };
      document.body.appendChild(script);
    }
  }, [GOOGLE_API_KEY]);

  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error("Please enter a coupon code.");
      return;
    }
    setCouponLoading(true);

    const response = await fetch("/api/coupons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ couponCode: couponCode }),
    });

    const data = await response.json(); // { valid: true, message: "Coupon is valid." }

    // Check if the coupon is valid and show corresponding toast message
    if (data.valid) {
      toast.success(data.message || "Coupon applied successfully!");

      fetchCartTotals();
      setCouponLoading(false);
    } else {
      toast.error(data.message || "Coupon is invalid.");
      setCouponCode("");
      fetchCartTotals();
      setCouponLoading(false);
    }
  };

  // console.log("cartData", cartData);

  

  const isBusy = loading || isLoading;
  const localCarts = getLocalCart();
  const localCartItems = localCarts.map((c) => ({
    product_id: c.id,
    variation_id: c.variationId || undefined,
    quantity: c.quantity,
  }));
  // if (!isAuthenticated) {
  //   setPaypalCartItems(localCartItems);
  // }

  useEffect(() => {
    const fetchGateways = async () => {
      try {
        const response = await fetch("/api/payment-gateways");
        const data = await response.json();
        setPaymentGateways(data || []);
      } catch (error) {
        // console.error("Error fetching payment gateways:", error);
        toast.error("Failed to load payment options.");
      } finally {
        setIsLoadingGateways(false);
      }
    };
    fetchGateways();
  }, []);

  const updateWooCommerceOrder = async (paypalOrderId: string) => {
    // console.log("updateWooCommerceOrder PayPal Order ID:", paypalOrderId);
  };

  const fetchCartTotals = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated) {
        setAuthToken(localStorage.getItem("token"));
        // const data = await CartServices.getCartTotal({});
        const data = await CartServices.getCartTotal({
          coupons: couponCode ? [couponCode] : [],
          items: [],
        });

        setCartData(data);
        // const serverCartItems = data.items.map((c) => ({
        //   product_id: c.product_id,
        //   variation_id: c.variation_id || undefined,
        //   quantity: c.quantity,
        // }));
        // setPaypalCartItems(serverCartItems || []);
      } else {
        const fData = {
          items: localCartItems,
          coupons: couponCode ? [couponCode] : [],
        };
        const data = await CartServices.getCartTotal(fData);
        setCartData(data);
      }
    } catch (error) {
      console.error("Failed to fetch cart totals:", error);
      toast.error("Failed to load cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [couponCode, isAuthenticated, localCartItems]);

  useEffect(() => {
    fetchCartTotals();
  }, [isAuthenticated]);

  const getUserInfo = async () => {
    try {
      setAuthToken(localStorage.getItem("token"));
      const userINfo = await UserServices.getCurrentUserInfo();
      setBillingDetails(userINfo.billing as UserAddress);
      setShippingDetails(userINfo.shipping as UserAddress);
    } catch (e) {
      console.warn("Could not fetch detailed user info", e);
    }
  };

  // Populate billing/shipping fully using snake_case fields
  // useEffect(() => {
  //   if (!userDetails) return;

  //   const split = splitName(userDetails.name || "");
  //   getUserInfo();

  //   const resolvedBilling: UserAddress = {
  //     first_name: userDetails.billing?.first_name || split.first_name,
  //     last_name: userDetails.billing?.last_name || split.last_name,
  //     address_1: userDetails.billing?.address_1 || "",
  //     address_2: userDetails.billing?.address_2 || "",
  //     company: userDetails.billing?.company || "",
  //     city: userDetails.billing?.city || "",
  //     postcode: userDetails.billing?.postcode || "",
  //     country: userDetails.billing?.country || "",
  //     state: userDetails.billing?.state || "",
  //     phone: userDetails.billing?.phone || "",
  //     email: userDetails.billing?.email || userDetails.email || "",
  //   };

  //   setBillingDetails(resolvedBilling);

  //   const resolvedShipping: UserAddress = {
  //     first_name:
  //       userDetails.shipping?.first_name ||
  //       (isSameAsBilling ? resolvedBilling.first_name : split.first_name),
  //     last_name:
  //       userDetails.shipping?.last_name ||
  //       (isSameAsBilling ? resolvedBilling.last_name : split.last_name),
  //     address_1:
  //       userDetails.shipping?.address_1 ||
  //       (isSameAsBilling ? resolvedBilling.address_1 : ""),
  //     address_2:
  //       userDetails.shipping?.address_2 ||
  //       (isSameAsBilling ? resolvedBilling.address_2 : ""),
  //     company:
  //       userDetails.shipping?.company ||
  //       (isSameAsBilling ? resolvedBilling.company : ""),
  //     city:
  //       userDetails.shipping?.city ||
  //       (isSameAsBilling ? resolvedBilling.city : ""),
  //     postcode:
  //       userDetails.shipping?.postcode ||
  //       (isSameAsBilling ? resolvedBilling.postcode : ""),
  //     country:
  //       userDetails.shipping?.country ||
  //       (isSameAsBilling ? resolvedBilling.country : ""),
  //     state:
  //       userDetails.shipping?.state ||
  //       (isSameAsBilling ? resolvedBilling.state : ""),
  //     phone:
  //       userDetails.shipping?.phone ||
  //       (isSameAsBilling ? resolvedBilling.phone : ""),
  //     email:
  //       userDetails.shipping?.email ||
  //       (isSameAsBilling ? resolvedBilling.email : userDetails.email || ""),
  //   };

  //   setShippingDetails(resolvedShipping);
  // }, [userDetails, isSameAsBilling]);

  // Single handler that works with snake_case names
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "billing" | "shipping"
  ) => {
    const { name, value } = e.target as HTMLInputElement & {
      name: keyof UserAddress;
    };
    if(name === 'address_1') {
      console.log("handleInputChange---(****)", name, value);
      setAddressInput(value);
    }
    
    if (type === "billing") {
      setBillingDetails((prev) => ({ ...prev, [name]: value }));
      if (isSameAsBilling) {
        setShippingDetails((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setShippingDetails((prev) => ({ ...prev, [name]: value }));
    }

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ✅ Validation uses the same snake_case keys
  const validateForm = () => {
    const newErrors: FormErrors = {};

    const must = [
      "first_name",
      "last_name",
      "address_1",
      "city",
      "postcode",
      "country",
      "phone",
      "email",
    ] as (keyof UserAddress)[];

    must.forEach((k) => {
      if (!String(billingDetails[k] || "").trim()) {
        newErrors[k] = `Billing ${k.replace("_", " ")} is required.`;
      }
    });

    if (isSameAsBilling) {
      [
        "first_name",
        "last_name",
        "address_1",
        "city",
        "postcode",
        "country",
      ].forEach((k) => {
        const key = k as keyof UserAddress;
        if (!String(shippingDetails[key] || "").trim()) {
          newErrors[`shipping_${k}`] = `Shipping ${k.replace(
            "_",
            " "
          )} is required.`;
        }
      });
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onPaymentSuccess = async (captureDetails: any) => {
    // console.log("Payment successful: hooorayyy!", captureDetails);
  };

  const createWooOrder = async () => {
    try {
      if (!cartData || !cartData.items || cartData.items.length === 0) {
        toast.error(
          "Your cart is empty. Please add items before checking out."
        );
        setIsProcessingCheckout(false);
        return;
      }

      const itemsForApi = cartData.items.map((item) => ({
        product_id: item.product_id,
        variation_id: item.variation_id,
        quantity: item.quantity,
      }));

      const shippingPackage = cartData.shipping?.packages?.[0];
      const chosenShippingRate = shippingPackage?.rates?.find(
        (rate) => rate.id === cartData.shipping.chosen_method
      );

      // ✅ Build shipping payload: either copy everything from billing or use shippingDetails
      const shippingPayload: UserAddress = isSameAsBilling
        ? { ...billingDetails }
        : { ...shippingDetails };

      // ✅ Include ALL fields for both billing and shipping
      const requestData: CheckoutRequest = {
        customer_id: isAuthenticated ? Number(user?.id) : undefined,
        payment_method: selectedPaymentMethod,
        payment_method_title:
          selectedPaymentMethod === "cod" ? "Cash on delivery" : "PayPal",
        set_paid: false,
        customer_note: customerNote,
        billing: {
          first_name: billingDetails.first_name,
          last_name: billingDetails.last_name,
          company: billingDetails.company,
          address_1: billingDetails.address_1,
          address_2: billingDetails.address_2,
          city: billingDetails.city,
          state: billingDetails.state,
          postcode: billingDetails.postcode,
          country: billingDetails.country,
          email: billingDetails.email,
          phone: billingDetails.phone,
        },
        shipping: {
          first_name: shippingPayload.first_name,
          last_name: shippingPayload.last_name,
          company: shippingPayload.company,
          address_1: shippingPayload.address_1,
          address_2: shippingPayload.address_2,
          city: shippingPayload.city,
          state: shippingPayload.state,
          postcode: shippingPayload.postcode,
          country: shippingPayload.country,
          // Some WooCommerce setups ignore these on shipping, but you asked for "all fields"
          email: shippingPayload.email,
          phone: shippingPayload.phone,
        } as any,
        line_items: itemsForApi,
        shipping_lines: chosenShippingRate
          ? [
              {
                method_id: chosenShippingRate.id,
                method_title: chosenShippingRate.label,
                total: cartData.shipping.total,
              },
            ]
          : [],
        coupon_lines: cartData.coupons.map((coupon) => ({
          code: coupon.code,
        })),
      };

      // console.log("createWooOrder requestData", requestData);

      const result = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const orderRes = await result.json();

      console.log("createWooOrder orderRes", orderRes);

      if (result.ok) {
        // toast.success("Order placed successfully!");

        return { orderId: orderRes.id, orderTotal: orderRes.total };
      } else {
        toast.error("Something went wrong. Please try again.");
        return undefined;
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("An unexpected error occurred during checkout.");
      return undefined;
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields."); 
      return;
    }

    setIsProcessingCheckout(true);
    try {
      if (!cartData || !cartData.items || cartData.items.length === 0) {
        toast.error(
          "Your cart is empty. Please add items before checking out."
        );
        setIsProcessingCheckout(false);
        return;
      }

      const itemsForApi = cartData.items.map((item) => ({
        product_id: item.product_id,
        variation_id: item.variation_id,
        quantity: item.quantity,
      }));

      const shippingPackage = cartData.shipping?.packages?.[0];
      const chosenShippingRate = shippingPackage?.rates?.find(
        (rate) => rate.id === cartData.shipping.chosen_method
      );

      // ✅ Build shipping payload: either copy everything from billing or use shippingDetails
      const shippingPayload: UserAddress = isSameAsBilling
        ? { ...billingDetails }
        : { ...shippingDetails };

      // ✅ Include ALL fields for both billing and shipping
      const requestData: CheckoutRequest = {
        customer_id: isAuthenticated ? Number(userDetails?.id) : undefined,
        payment_method: selectedPaymentMethod,
        payment_method_title:
          selectedPaymentMethod === "cod" ? "Cash on delivery" : "PayPal",
        set_paid: false,
        customer_note: customerNote,
        billing: {
          first_name: billingDetails.first_name,
          last_name: billingDetails.last_name,
          company: billingDetails.company,
          address_1: billingDetails.address_1,
          address_2: billingDetails.address_2,
          city: billingDetails.city,
          state: billingDetails.state,
          postcode: billingDetails.postcode,
          country: billingDetails.country,
          email: billingDetails.email,
          phone: billingDetails.phone,
        },
        shipping: {
          first_name: shippingPayload.first_name,
          last_name: shippingPayload.last_name,
          company: shippingPayload.company,
          address_1: shippingPayload.address_1,
          address_2: shippingPayload.address_2,
          city: shippingPayload.city,
          state: shippingPayload.state,
          postcode: shippingPayload.postcode,
          country: shippingPayload.country,
          // Some WooCommerce setups ignore these on shipping, but you asked for "all fields"
          email: shippingPayload.email,
          phone: shippingPayload.phone,
        } as any,
        line_items: itemsForApi,
        shipping_lines: chosenShippingRate
          ? [
              {
                method_id: chosenShippingRate.id,
                method_title: chosenShippingRate.label,
                total: cartData.shipping.total,
              },
            ]
          : [],
        coupon_lines: cartData.coupons.map((coupon) => ({
          code: coupon.code,
        })),
      };

      const result = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (result.ok) {
        // toast.success("Order placed successfully!");
        clearCart();
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("An unexpected error occurred during checkout.");
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  if (isBusy) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <ArrowPathIcon className="h-12 w-12 text-gray-500 animate-spin" />
      </div>
    );
  }

  const items = Array.isArray(cartData?.items) ? cartData!.items : [];
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 p-6 lg:p-0">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Your cart is empty!
          </h2>
          <p className="text-gray-600 mb-6">
            Please add some products to your cart before proceeding to checkout.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50">
        <div className="container mx-auto p-4 lg:p-8 min-h-screen">
          <div className="lg:max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* Left Column */}
            <div className="w-full lg:w-2/3 bg-white p-6">
              <h1 className="text-2xl font-medium text-gray-800 mb-6">
                Checkout
              </h1>

              {/* Billing Details */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 flex items-center mb-4">
                  <CreditCardIcon className="h-5 w-5 mr-2 text-indigo-500" />
                  Billing Details
                </h2>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    id="billing-first_name"
                    label="First name"
                    name="first_name"
                    value={billingDetails.first_name}
                    onChange={(e) => handleInputChange(e, "billing")}
                    required
                    error={formErrors.first_name}
                  />
                  <InputField
                    id="billing-last_name"
                    label="Last name"
                    name="last_name"
                    value={billingDetails.last_name}
                    onChange={(e) => handleInputChange(e, "billing")}
                    required
                    error={formErrors.last_name}
                  />
                  <InputField
                    id="billing-company"
                    label="Company"
                    name="company"
                    value={billingDetails.company}
                    onChange={(e) => handleInputChange(e, "billing")}
                  />
                  <InputField
                    id="billing-phone"
                    label="Phone"
                    name="phone"
                    value={billingDetails.phone}
                    onChange={(e) => handleInputChange(e, "billing")}
                    required
                    error={formErrors.phone}
                  />
                  <InputField
                    id="billing-email"
                    label="Email address"
                    type="email"
                    name="email"
                    value={billingDetails.email}
                    onChange={(e) => handleInputChange(e, "billing")}
                    required
                    error={formErrors.email}
                  />
                  <InputField
                    id="billing-country"
                    label="Country"
                    name="country"
                    value={billingDetails.country}
                    onChange={(e) => handleInputChange(e, "billing")}
                    required
                    error={formErrors.country}
                  />
                  <div className="md:col-span-2" />
                  <InputField
                    id="billing-address_1"
                    label="Address 1"
                    name="address_1"
                    value={billingDetails.address_1}
                    onChange={(e) => handleInputChange(e, "billing")}
                    className="md:col-span-2"
                    required
                    error={formErrors.address_1}
                  />
                  <InputField
                    id="billing-address_2"
                    label="Address 2"
                    name="address_2"
                    value={billingDetails.address_2}
                    onChange={(e) => handleInputChange(e, "billing")}
                    className="md:col-span-2"
                  />
                  <InputField
                    id="billing-city"
                    label="City"
                    name="city"
                    value={billingDetails.city}
                    onChange={(e) => handleInputChange(e, "billing")}
                    required
                    error={formErrors.city}
                  />
                  <InputField
                    id="billing-state"
                    label="State"
                    name="state"
                    value={billingDetails.state}
                    onChange={(e) => handleInputChange(e, "billing")}
                  />
                  <InputField
                    id="billing-postcode"
                    label="Postcode / ZIP"
                    name="postcode"
                    value={billingDetails.postcode}
                    onChange={(e) => handleInputChange(e, "billing")}
                    required
                    error={formErrors.postcode}
                  />
                </form>
              </div>

              {/* Shipping Details */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <input
                    id="shipping-same-as-billing"
                    name="shipping-same-as-billing"
                    type="checkbox"
                    checked={isSameAsBilling}
                    onChange={(e) => setIsSameAsBilling(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="shipping-same-as-billing"
                    className="ml-2 block text-sm font-medium text-gray-900"
                  >
                    Ship to a different address
                  </label>
                </div>

                {isSameAsBilling && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Shipping Address
                    </h3>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        id="shipping-first_name"
                        label="First name"
                        name="first_name"
                        value={shippingDetails.first_name}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        required
                        error={formErrors.shipping_first_name}
                      />
                      <InputField
                        id="shipping-last_name"
                        label="Last name"
                        name="last_name"
                        value={shippingDetails.last_name}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        required
                        error={formErrors.shipping_last_name}
                      />
                      <InputField
                        id="shipping-company"
                        label="Company"
                        name="company"
                        value={shippingDetails.company}
                        onChange={(e) => handleInputChange(e, "shipping")}
                      />
                      <InputField
                        id="shipping-phone"
                        label="Phone"
                        name="phone"
                        value={shippingDetails.phone}
                        onChange={(e) => handleInputChange(e, "shipping")}
                      />
                      <InputField
                        id="shipping-email"
                        label="Email address"
                        type="email"
                        name="email"
                        value={shippingDetails.email}
                        onChange={(e) => handleInputChange(e, "shipping")}
                      />
                      <InputField
                        id="shipping-country"
                        label="Country"
                        name="country"
                        value={shippingDetails.country}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        required
                        error={formErrors.shipping_country}
                      />
                      <div className="md:col-span-2" />
                      <InputField
                        id="shipping-address_1"
                        label="Address 1"
                        name="address_1"
                        value={shippingDetails.address_1}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        className="md:col-span-2"
                        required
                        error={formErrors.shipping_address_1}
                      />
                      <InputField
                        id="shipping-address_2"
                        label="Address 2"
                        name="address_2"
                        value={shippingDetails.address_2}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        className="md:col-span-2"
                      />
                      <InputField
                        id="shipping-city"
                        label="City"
                        name="city"
                        value={shippingDetails.city}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        required
                        error={formErrors.shipping_city}
                      />
                      <InputField
                        id="shipping-state"
                        label="State"
                        name="state"
                        value={shippingDetails.state}
                        onChange={(e) => handleInputChange(e, "shipping")}
                      />
                      <InputField
                        id="shipping-postcode"
                        label="Postcode / ZIP"
                        name="postcode"
                        value={shippingDetails.postcode}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        required
                        error={formErrors.shipping_postcode}
                      />
                    </form>
                  </div>
                )}
                <div className="mb-4">
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Customer Note
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-yellow-700 focus:border-yellow-700"
                    placeholder="Write your note here..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className={`w-full lg:w-1/3 ${isBusy ? "opacity-50" : ""}`}>
              <div className="bg-white p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  {cartData?.items.map((item) => (
                    <div
                      key={item.cart_item_key}
                      className="flex justify-between items-center text-sm p-2 border-b border-gray-100"
                    >
                      <div className="flex items-center space-x-3">
                        <Image
                          src={item.image || "/placeholder-image.jpg"}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800">
                            {item.name}
                          </span>
                          <span className="text-gray-500">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-medium text-gray-600">
                        €{parseFloat(item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 my-4"></div>
                <div className="relative">
                  {couponLoading ? (
                    <div className="flex justify-center items-center py-4 bg-white opacity-50 inset-0 bg-opacity-75 absolute w-full">
                      <ArrowPathIcon className="h-6 w-6 text-gray-500 animate-spin" />
                    </div>
                  ) : null}

                  <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm w-full md:w-2/3"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      // disabled={isUpdatingCartTotals}
                      className="bg-yellow-500 cursor-pointer text-white px-6 py-2 rounded-lg text-sm w-full md:w-auto disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 my-4"></div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between font-medium text-gray-600">
                    <span>Subtotal</span>
                    <span>€{cartData?.subtotal}</span>
                  </div>
                  <div className="flex justify-between font-medium text-green-600">
                    <span>Discounts</span>
                    <span>
                      -€
                      {(
                        parseFloat(cartData?.discount_total || "0") +
                        parseFloat(cartData?.discount_tax || "0")
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-600">
                    <span>Shipping</span>
                    <span>€{cartData?.shipping.total}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 my-4"></div>
                <div className="flex justify-between text-xl font-semibold text-gray-900">
                  <span>TOTAL</span>
                  <span>€{cartData?.total}</span>
                </div>
                <div className="border-t border-gray-200 my-4"></div>

                {/* Payment Method */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-700 flex items-center mb-4">
                    <CreditCardIcon className="h-5 w-5 mr-2 text-indigo-500" />
                    Payment Method
                  </h2>
                  {isLoadingGateways ? (
                    <div className="flex justify-center items-center py-4">
                      <ArrowPathIcon className="h-6 w-6 text-gray-500 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {paymentGateways.length > 0 ? (
                        paymentGateways.map((gateway) => (
                          <label
                            key={gateway.id}
                            htmlFor={`payment-method-${gateway.id}`}
                            className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                              selectedPaymentMethod === gateway.id
                                ? "border-indigo-500 bg-indigo-50 shadow-md"
                                : "border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <input
                              id={`payment-method-${gateway.id}`}
                              name="payment-method"
                              type="radio"
                              value={gateway.id}
                              checked={selectedPaymentMethod === gateway.id}
                              onChange={() =>
                                setSelectedPaymentMethod(gateway.id)
                              }
                              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                            />
                            <span className="ml-3 font-medium text-gray-700">
                              {gateway.title}
                            </span>
                            <p className="mt-1 ml-7 text-sm text-gray-500">
                              {gateway.description}
                            </p>
                          </label>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          No payment gateways are currently enabled.
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-200 my-4"></div>

                {/* Place Order / PayPal */}
                {selectedPaymentMethod === "ppcp-gateway" ? (
                  <div className="mt-8">
                    <PayPalComponent
                      cartItems={
                        isAuthenticated
                          ? Array.isArray(cartData?.items)
                            ? cartData.items.map((c) => ({
                                product_id: c.product_id,
                                variation_id: c.variation_id || undefined,
                                quantity: c.quantity,
                              }))
                            : []
                          : localCartItems
                      }
                      onPaymentSuccess={updateWooCommerceOrder}
                      validateForm={validateForm}
                      createWooOrder={createWooOrder}
                      couponCode={couponCode}
                    />
                  </div>
                ) : (
                  <div className="mt-0 hidden">
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessingCheckout}
                      className=" w-full bg-yellow-600 cursor-pointer text-white py-3 rounded-xl text-lg font-semibold hover:bg-yellow-700 disabled:opacity-50 transition duration-200 shadow-lg"
                    >
                      {isProcessingCheckout ? (
                        <span className="flex items-center justify-center">
                          <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                          Placing order...
                        </span>
                      ) : (
                        "Place Order"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        theme="light"
      />
    </>
  );
};

// Reusable Input Field component for a cleaner UI
interface InputFieldProps {
  id: string;
  label: string;
  name: keyof UserAddress | string;
  type?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  required?: boolean;
  error?: string;
}

const InputField = ({
  id,
  label,
  name,
  type = "text",
  value,
  onChange,
  className = "",
  required = false,
  error = "",
}: InputFieldProps) => (
  <div className={className}>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`mt-1 block w-full rounded-lg bg-gray-50 border-gray-300 shadow-sm focus:border-yellow-700 focus:ring-yellow-700 transition duration-200 py-2 px-3 ${
        error ? "border-red-500" : ""
      }`}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

export default CheckoutPage;
