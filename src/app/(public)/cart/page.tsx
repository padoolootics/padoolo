"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useCartContext } from "@/lib/Contexts/CartContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartServices, {
  CartTotalRequest,
  CartTotalResponse,
} from "@/lib/api/services/CartServices";
import { useAuth } from "@/lib/Contexts/AuthContext";
import { setAuthToken } from "@/lib/api/services/httpServices";
import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const CartPage = () => {
  const { cart, removeFromCart, updateCartItem } = useCartContext();
  const { isAuthenticated } = useAuth();

  const [cartData, setCartData] = useState<CartTotalResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Main loader for the page
  const [isCartDataStale, setIsCartDataStale] = useState(true); // Tracks if totals need to be re-fetched
  const [updatingItemKey, setUpdatingItemKey] = useState<string | null>(null); // Loader for individual cart items
  const [isUpdatingCartTotals, setIsUpdatingCartTotals] = useState(false); // Loader for cart totals section
  const [couponCode, setCouponCode] = useState("");
  const [shippingMethods, setShippingMethods] = useState<any[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("");

  // Memoized function to fetch cart totals with a more complete request payload
  const fetchCartTotals = useCallback(
    async (requestData: CartTotalRequest = {}) => {
      try {
        setAuthToken(localStorage.getItem("token"));

        let cartItemsToPass = requestData.items;

        // New logic: If the user is not authenticated, get cart items from local state
        if (!isAuthenticated && !cartItemsToPass) {
          cartItemsToPass = cart.map((item) => ({
            product_id: item.id,
            variation_id: item.variationId || 0, // Ensure variation_id is a number, defaults to 0
            quantity: item.quantity,
          }));
        }

        const finalRequest = {
          ...requestData,
          items: cartItemsToPass,
          // Ensure coupons are passed correctly
          coupons:
            requestData.coupons || cartData?.coupons?.map((c) => c.code) || [],
          // Ensure shipping method is passed correctly
          shipping_method:
            requestData.shipping_method || selectedShippingMethod,
        };

        const data = await CartServices.getCartTotal(finalRequest);
        setCartData(data);

        if (data.shipping.chosen_method) {
          setSelectedShippingMethod(data.shipping.chosen_method);
        }
        if (data.shipping.packages.length > 0) {
          const rates = data.shipping.packages[0].rates;
          setShippingMethods(rates);
        }
        return data;
      } catch (error) {
        console.error("Failed to fetch cart totals:", error);
        toast.error("Failed to load cart. Please try again.");
        setCartData(null);
        return null;
      }
    },
    [isAuthenticated, cart, cartData?.coupons, selectedShippingMethod]
  );

  // Main effect to load cart data initially and when it becomes "stale"
  // useEffect(() => {
  //   const loadData = async () => {
  //     if (isCartDataStale) {
  //       setIsLoading(true);
  //       // On initial load, pass an empty object. The useCallback above handles the rest.
  //       await fetchCartTotals({});
  //       setIsLoading(false);
  //       setIsCartDataStale(false);
  //     }
  //   };
  //   loadData();
  // }, [isCartDataStale, isAuthenticated, cart, fetchCartTotals]);

  useEffect(() => {
    const loadData = async () => {
      if (isCartDataStale && cart.length > 0) {
        setIsLoading(true);
        const itemsToFetch = cart.map((item) => ({
          product_id: item.id,
          variation_id: item.variationId || 0,
          quantity: item.quantity,
        }));
        await fetchCartTotals({ items: itemsToFetch });
        setIsLoading(false);
        setIsCartDataStale(false);
      }
    };

    // This part is crucial: if cart is not empty and cartData is not yet loaded, or if the data is stale, fetch it.
    if (cart.length > 0 && (!cartData || isCartDataStale)) {
      loadData();
    } else if (cart.length === 0 && cartData && cartData?.items.length > 0) {
      // Handle the case where the local cart becomes empty after all items are removed.
      setCartData(null);
    } else {
      // If the cart is empty on initial load, show the empty message right away.
      setIsLoading(false);
    }
  }, [isCartDataStale, isAuthenticated, cart, fetchCartTotals, cartData]);

  // Handle quantity changes
  const handleQuantityUpdate = async (
    productId: number,
    variationId: number,
    quantity: number,
    cartItemKey: string
  ) => {
    if (quantity <= 0) return;

    setUpdatingItemKey(cartItemKey);
    try {
      await updateCartItem(productId, quantity, variationId);
      setIsCartDataStale(true); // Signal that cart totals need a refresh
    } finally {
      setUpdatingItemKey(null);
    }
  };

  // Handle removing an item
  const handleRemoveItem = async (
    productId: number,
    variationId: number,
    cartItemKey: string
  ) => {
    setUpdatingItemKey(cartItemKey);
    try {
      console.log('#####', productId, variationId )
      await removeFromCart(productId, variationId);
      setIsCartDataStale(true);
      toast.success("Item removed from cart!");
    } finally {
      setUpdatingItemKey(null);
    }
  };

  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error("Please enter a coupon code.");
      return;
    }
    setIsUpdatingCartTotals(true);
    const itemsForApi = cartData?.items.map((item: any) => ({
      product_id: item.product_id,
      variation_id: item.variation_id,
      quantity: item.quantity,
    }));
    try {
      const updatedCartData = await fetchCartTotals({
        items: itemsForApi,
        coupons: [couponCode],
        shipping_method: selectedShippingMethod,
        merge: false,
      });

      // Check if the applied coupon exists in the updated cart data
      if (updatedCartData?.coupons?.some((c) => c.code === couponCode)) {
        toast.success("Coupon applied successfully!");
      } else {
        toast.error("Coupon is not valid or has expired.");
      }
    } finally {
      setIsUpdatingCartTotals(false);
    }
  };

  // Handle shipping method change
  const handleShippingChange = async (rateId: string) => {
    setSelectedShippingMethod(rateId);
    setIsUpdatingCartTotals(true);
    const itemsForApi = cartData?.items.map((item: any) => ({
      product_id: item.product_id,
      variation_id: item.variation_id,
      quantity: item.quantity,
    }));

    // Pass the existing coupons and the new shipping method
    const currentCoupons =
      cartData?.coupons?.map((coupon) => coupon.code) || [];

    try {
      await fetchCartTotals({
        items: itemsForApi,
        shipping_method: rateId,
        coupons: currentCoupons,
        merge: false,
      });
      toast.success("Shipping method updated!");
    } finally {
      setIsUpdatingCartTotals(false);
    }
  };

  // Skeleton Loader Component
  const CartSkeleton = () => (
    <div className="flex flex-col lg:flex-row justify-between gap-6 animate-pulse">
      <div className="w-full lg:w-2/3 pr-6">
        <div className="h-6 bg-gray-200 rounded-md mb-4 w-48"></div>
        <div className="space-y-4">
          <div className="h-28 bg-gray-200 rounded-[5px]"></div>
          <div className="h-28 bg-gray-200 rounded-[5px]"></div>
        </div>
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="h-10 bg-gray-200 rounded-lg w-full md:w-2/3"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-full md:w-auto"></div>
        </div>
      </div>
      <div className="w-full lg:w-1/3">
        <div className="border rounded-lg p-4 space-y-4">
          <div className="h-6 bg-gray-200 rounded-md w-36"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-12 bg-gray-200 rounded-lg w-full mt-4"></div>
        </div>
      </div>
    </div>
  );

  // If cart is empty, show a message
  if (!isLoading && (!cartData || cartData.items.length === 0)) {
    return (
      <div className="flex justify-center items-center h-96 p-4 sm:p-8 border rounded-lg border-gray-200 m-4">
        <p className="text-xl text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  // Determine which shipping methods to display based on the existence of free shipping.
  let filteredShippingMethods = shippingMethods;
  const freeShippingMethod = shippingMethods.find(
    (method) =>
      method.id.includes("free_shipping") ||
      method.label.includes("Free Shipping")
  );

  // If a free shipping method is found, only display that one.
  if (freeShippingMethod) {
    filteredShippingMethods = [freeShippingMethod];
  }

  return (
    <>
      <div className="container mx-auto py-8 px-4">
        {/* {isLoading ? (
          <CartSkeleton />
        ) : ( */}
        <div
          className={`flex flex-col lg:flex-row justify-between gap-6 ${
            isLoading ? "opacity-50" : ""
          }`}
        >
          <div className="w-full lg:w-2/3 pr-0 lg:pr-6 ">
            <h2 className="text-xl font-semibold mb-4">
              My Cart ({cartData?.items.length} items)
            </h2>

            <div className="space-y-4">
              {cartData?.items.map((item: any) => (
                <div
                  key={item.cart_item_key}
                  className="flex flex-col md:flex-row justify-between border border-gray-200 p-4 rounded-[5px] relative"
                >
                  {updatingItemKey === item.cart_item_key && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-[5px] z-10">
                      <ArrowPathIcon className="h-6 w-6 text-blue-500 animate-spin" />
                    </div>
                  )}
                  <div className="flex flex-row gap-4 sm:flex-row">
                    <Image
                      className="w-24 h-auto object-cover mb-4 sm:mb-0 sm:mr-4 rounded-[5px]"
                      src={item.image || "/placeholder-image.jpg"}
                      alt={item.name}
                      width={100}
                      height={128}
                    />
                    <div className="flex-1">
                      <p className="text-lg font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.variation.length > 0 ? (
                          <span>
                            {item.variation.map((v: any, i: any) => (
                              <span key={i}>
                                {/* {v.attribute}:  */}
                                {/* {v.value} */}
                                {/* {i < item.variation.length - 1 ? ", " : ""} */}
                              </span>
                            ))}
                          </span>
                        ) : (
                          item.sku
                        )}
                      </p>
                      <p className="text-sm font-semibold text-gray-500">
                        €{item.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row mt-0 items-center md:mt-4 sm:mt-0 sm:flex-row md:items-start sm:items-center justify-between sm:space-x-2 space-y-4 sm:space-y-0 min-w-80">
                    <div className="flex items-center justify-between text-sm mb-0">
                      <div className="border border-gray-300 px-4 py-2 flex items-center justify-between w-24">
                        <button
                          onClick={() =>
                            handleQuantityUpdate(
                              item.product_id,
                              item.variation_id,
                              item.quantity - 1,
                              item.cart_item_key
                            )
                          }
                          disabled={
                            item.quantity <= 1 ||
                            updatingItemKey === item.cart_item_key
                          }
                          className="cursor-pointer text-2xl font-light hover:text-gray-600 disabled:opacity-50"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityUpdate(
                              item.product_id,
                              item.variation_id,
                              parseInt(e.target.value),
                              item.cart_item_key
                            )
                          }
                          disabled={updatingItemKey === item.cart_item_key}
                          className="w-10 text-center border-none focus:outline-none"
                        />
                        <button
                          onClick={() =>
                            handleQuantityUpdate(
                              item.product_id,
                              item.variation_id,
                              item.quantity + 1,
                              item.cart_item_key
                            )
                          }
                          disabled={updatingItemKey === item.cart_item_key}
                          className="cursor-pointer text-2xl font-light hover:text-gray-600 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p className="text-sm mb-0 text-gray-500">
                      €
                      {(
                        parseFloat(item.line_total) + parseFloat(item.line_tax)
                      ).toFixed(2)}
                    </p>
                    <button
                      className="text-gray-500 mr-4 hover:text-red-500 cursor-pointer disabled:opacity-50"
                      onClick={() =>
                        handleRemoveItem(
                          item.product_id,
                          (item.variation_id === 0 ? undefined : item.variation_id),
                          item.cart_item_key
                        )
                      }
                      disabled={updatingItemKey === item.cart_item_key}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 hidden">
              <input
                type="text"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="px-4 py-2 border rounded-lg text-sm w-full md:w-2/3"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={isUpdatingCartTotals}
                className="bg-yellow-500 text-white px-6 py-2 rounded-lg text-sm w-full md:w-auto disabled:opacity-50"
              >
                Apply Coupon
              </button>
            </div>
            {(cartData?.coupons ?? []).length > 0 && (
              <div className="mt-4">
                <p className="text-green-600 font-semibold">Applied Coupons:</p>
                <ul className="list-disc list-inside text-sm">
                  {(cartData?.coupons ?? []).map((coupon: any, index: any) => (
                    <li key={index}>
                      {coupon.code} (Discount: -€{coupon.discount})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="w-full lg:w-1/3">
            <div className="border border-gray-200 rounded-lg p-4 space-y-4 relative">
              {isUpdatingCartTotals && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
                  <ArrowPathIcon className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
              )}
              <p className="text-lg font-semibold">Cart totals</p>
              <div className="flex justify-between text-sm">
                <p>SUBTOTAL</p>
                <p>€{cartData?.subtotal}</p>
              </div>
              <div className="flex justify-between text-sm text-green-600 font-semibold">
                <p>Discounts</p>
                <p>
                  -€
                  {(
                    parseFloat(cartData?.discount_total || "0") +
                    parseFloat(cartData?.discount_tax || "0")
                  ).toFixed(2)}
                </p>
              </div>

              <div className="flex justify-between font-semibold text-base border-t pt-4">
                <p>SHIPPING</p>
                <p>€{cartData?.shipping.total}</p>
              </div>

              {/* Conditional rendering for shipping methods */}
              {filteredShippingMethods.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Available Shipping Methods:
                  </p>
                  {filteredShippingMethods.map((method) => (
                    <label
                      key={method.id}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <input
                        type="radio"
                        name="shipping-method"
                        value={method.id}
                        checked={selectedShippingMethod === method.id}
                        onChange={() => handleShippingChange(method.id)}
                        disabled={isUpdatingCartTotals}
                      />
                      <span>
                        {method.label} (Costs: €{method.cost})
                      </span>
                    </label>
                  ))}
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg border-t pt-4">
                <p>TOTAL</p>
                <p>€{cartData?.total}</p>
              </div>
              <Link href={isAuthenticated ? "/checkout" : "/checkout"}>
                <button
                  className="bg-orange-600 text-white cursor-pointer w-full py-2 rounded-lg text-lg mt-4 disabled:opacity-50"
                  disabled={isUpdatingCartTotals}
                >
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
        {/* // )} */}
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

export default CartPage;
