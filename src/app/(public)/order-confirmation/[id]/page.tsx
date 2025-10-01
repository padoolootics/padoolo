"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartServices, { OrderResponse } from "@/lib/api/services/CartServices";
import { setAuthToken } from "@/lib/api/services/httpServices";
import { useAuth } from "@/lib/Contexts/AuthContext";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  MapPinIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";

const Page = () => {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const userDetails = user;

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    if (userDetails !== undefined) {
      setIsAuthReady(true);
    }
  }, [userDetails]);

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    if (!isAuthenticated) {
      // router.push("/login");
      // toast.warn("You need to be logged in to view your order.");
      // return;
    }

    if (id) {
      const fetchOrder = async () => {
        setIsLoading(true);
        setError(null);
        console.log("Fetching order with ID:", id);
        try {
          setAuthToken(localStorage.getItem("token"));
          // const orderDetails = await CartServices.getOrderById(id);
          const orderDetails = await fetch(`/api/order/${id}`);
          // if (!orderDetails.ok) {
          //   throw new Error("Network response was not ok");
          // }
          const orderData = await orderDetails.json();
          setOrder(orderData);
        } catch (err: any) {
          console.error("Failed to fetch order:", err);
          setError("Failed to load order details. Please try again.");
          toast.error("Failed to load order details.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrder();
    } else {
      setIsLoading(false);
      setError("No order ID provided.");
    }
  }, [id, isAuthenticated, isAuthReady, router, userDetails]);

  const calculateSubtotal = () => {
    if (!order) return "0.00";
    const subtotal = order.line_items.reduce(
      (sum, item) => sum + parseFloat(item.total),
      0
    );
    return subtotal.toFixed(2);
  };

  if (isLoading || !isAuthReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <ArrowPathIcon className="h-12 w-12 text-gray-500 animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
        <div className="text-center p-8 bg-white max-w-lg w-full">
          <p className="text-xl font-semibold text-gray-800 mb-4">
            {error || "No order found."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition duration-200"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Helper function to format the address
  const formatAddress = (
    address: OrderResponse["billing"] | OrderResponse["shipping"]
  ) => {
    return (
      <div className="text-sm text-gray-600 space-y-1">
        <p className="font-semibold text-gray-800">
          {address.first_name} {address.last_name}
        </p>
        <p>{address.address_1}</p>
        {address.address_2 && <p>{address.address_2}</p>}
        <p>
          {address.city}, {address.state} {address.postcode}
        </p>
        <p>{address.country}</p>
        {"email" in address && <p>Email: {address.email}</p>}
        {"phone" in address && <p>Phone: {address.phone}</p>}
      </div>
    );
  };

  return (
    <>
      <div className="bg-gray-50">
        <div className="container mx-auto p-4 lg:p-8 min-h-screen">
          <div className="lg:max-w-4xl mx-auto bg-white p-6 lg:p-10">
            <div className="flex flex-col items-center text-center mb-8">
              <CheckCircleIcon className="h-20 w-20 text-green-500 mb-4" />
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Order Confirmed!
              </h1>
              <p className="text-gray-600 text-lg">
                Thank you for your purchase. Your order has been placed
                successfully.
              </p>
              <p className="text-gray-800 font-semibold text-xl mt-4">
                Order ID: #{order.id}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mt-8">
              {/* Order Summary Section */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-4">
                  <ShoppingBagIcon className="h-6 w-6 mr-2 text-yellow-500" />
                  Order Summary
                </h2>
                <div className="space-y-4">
                  {order.line_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center border-b border-gray-100 pb-2"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">
                          {item.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-600">
                        €{parseFloat(item.total).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span>Subtotal</span>
                    <span>€{calculateSubtotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-red-600">
                    <span>Discounts</span>
                    <span>-€{parseFloat(order.discount_total).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span>Shipping</span>
                    <span>€{parseFloat(order.shipping_total).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span>Tax</span>
                    <span>€{parseFloat(order.total_tax).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-semibold text-gray-900 border-t border-gray-200 pt-4 mt-4">
                    <span>Total</span>
                    <span>€{parseFloat(order.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Address Details Section */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-4">
                  <MapPinIcon className="h-6 w-6 mr-2 text-yellow-500" />
                  Delivery Details
                </h2>
                <div className="grid gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Billing Address
                    </h3>
                    {formatAddress(order.billing)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Shipping Address
                    </h3>
                    {formatAddress(order.shipping)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Payment Method
                    </h3>
                    <p className="text-sm text-gray-600">
                      {order.payment_method_title}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Order Status
                    </h3>
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800 capitalize">
                      {order.status}
                    </span>
                  </div>
                </div>
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

export default Page;
