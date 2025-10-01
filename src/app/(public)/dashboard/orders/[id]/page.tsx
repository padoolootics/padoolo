"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowPathIcon,
  CheckIcon,
  UserIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  ThumbsUp,
  CreditCard,
  ChevronLeft,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { OrderResponse } from "@/lib/api/services/CartServices";
import { setAuthToken } from "@/lib/api/services/httpServices";
import { useAuth } from "@/lib/Contexts/AuthContext";
import CartServices from "@/lib/api/services/CartServices";

// This component uses `useParams` to get the order ID from the URL
export default function Page() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { id: orderID } = params;

  // Use the useAuth hook to get the authentication state
  const { isAuthenticated, user } = useAuth();
  const userDetails = user;

  // State to track if the auth check is complete
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // State for the FeedbackModal, though the modal component is not provided

  // Define tracking steps dynamically based on order status.
  const getTrackingSteps = (status: string) => {
    let currentStep = 0;
    const steps = [
      { label: "Order Placed", icon: <CreditCard className="w-6 h-6" /> },
      { label: "Packaging", icon: <Package className="w-6 h-6" /> },
      { label: "On The Way", icon: <Truck className="w-6 h-6" /> },
      { label: "Delivered", icon: <ThumbsUp className="w-6 h-6" /> },
    ];

    switch (status) {
      case "processing":
        currentStep = 1;
        break;
      case "shipped":
        currentStep = 3;
        break;
      case "delivered":
        currentStep = 4;
        break;
      case "completed":
        currentStep = 4;
        break;
      default:
        currentStep = 0;
    }
    return { steps, currentStep };
  };

  // Effect to set auth readiness once user details are available
  useEffect(() => {
    if (user !== undefined) {
      setIsAuthReady(true);
    }
  }, [user]);

  // Main effect to fetch order data
  useEffect(() => {
    // Only proceed if auth state is ready and user is authenticated
    if (!isAuthReady) return;

    if (!isAuthenticated) {
      router.push("/login");
      toast.warn("You need to be logged in to view your orders.");
      return;
    }

    if (orderID) {
      const fetchOrder = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem("token");
          setAuthToken(token);
          const orderDetails = await CartServices.getOrderById(orderID);
          setOrder(orderDetails);
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
  }, [orderID, isAuthenticated, isAuthReady, router, user]);

  // Helper function to calculate subtotal
  const calculateSubtotal = () => {
    if (!order) return "0.00";
    const subtotal = order.line_items.reduce(
      (sum, item) => sum + parseFloat(item.total),
      0
    );
    return subtotal.toFixed(2);
  };

  // Loading and error states
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
        <div className="text-center p-8 bg-white shadow-lg rounded-xl max-w-lg w-full">
          <p className="text-xl font-semibold text-gray-800 mb-4">
            {error || "No order found."}
          </p>
          <button
            onClick={() => router.push("/dashboard/orders")}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Go to My Orders
          </button>
        </div>
      </div>
    );
  }

  const { steps, currentStep } = getTrackingSteps(order.status);

  // Helper function to format the address
  const formatAddress = (address: any) => (
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
      {address.phone && <p>Phone: {address.phone}</p>}
    </div>
  );

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <div className="bg-white mx-auto max-w-4xl overflow-hidden space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <button
              onClick={() => router.push(`/dashboard/orders`)}
              className="flex items-center text-sm text-yellow-500 hover:text-yellow-600 font-medium cursor-pointer transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              <h1 className="uppercase">ORDER DETAILS</h1>
            </button>
            <button
              className="text-sm text-yellow-500 hover:text-yellow-600 font-medium cursor-pointer transition-colors duration-200"
              onClick={() => setIsOpen(true)}
            >
              Leave a Rating +
            </button>
          </div>

          {/* Order Summary */}
          <div className="px-6">
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-800">
                  Order ID: #{order.id}
                </div>
                <div className="text-sm text-gray-500">
                  {order.line_items.length} Products · Placed on{" "}
                  {new Date(order.date_created).toLocaleDateString()}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800">
                €{parseFloat(order.total).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="px-6 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Order status:{" "}
              <strong className="capitalize">
                {order.status.replace("-", " ")}
              </strong>
            </p>
            <div className="relative flex justify-between items-start">
              {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1 relative text-center"
                  >
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute top-[15%] left-full h-1 w-full -translate-x-1/2 ${
                          isCompleted ? "bg-yellow-400" : "bg-gray-300"
                        }`}
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full border-2 z-10 ${
                        isCompleted
                          ? "bg-yellow-500 border-yellow-500"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckIcon className="w-5 h-5 text-white" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                      )}
                    </div>
                    <div
                      className={`mt-4 w-12 h-12 flex items-center justify-center rounded-full ${
                        isCurrent
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <p
                      className={`mt-1 text-xs font-medium w-24 ${
                        isCurrent ? "text-gray-800 font-bold" : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary & Addresses */}
          <div className="px-6 pb-6 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800 text-xl mb-4">
              Order Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Product List */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Products ({order.line_items.length})
                </h3>
                <div className="space-y-4">
                  {order.line_items.map((product: any) => (
                    <div
                      key={product.id}
                      className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-16 h-16 bg-white rounded-md overflow-hidden flex-shrink-0">
                        {product.image?.src && (
                          <Image
                            src={product.image.src}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-gray-800">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Qty: {product.quantity}
                        </p>
                        <p className="text-sm font-semibold text-gray-700 mt-1">
                          €{parseFloat(product.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Order Totals
                </h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>€{calculateSubtotal()}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Discount</span>
                    <span>-€{parseFloat(order.discount_total).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>€{parseFloat(order.shipping_total).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>€{parseFloat(order.total_tax).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-gray-900 border-t border-gray-200 pt-4 mt-4">
                    <span>Total</span>
                    <span>€{parseFloat(order.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Addresses and Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-700 px-6 pb-6">
            <div>
              <h4 className="font-semibold text-lg text-gray-800 mb-3">
                Billing Address
              </h4>
              {formatAddress(order.billing)}
            </div>
            <div>
              <h4 className="font-semibold text-lg text-gray-800 mb-3">
                Shipping Address
              </h4>
              {formatAddress(order.shipping)}
            </div>
            <div className="md:col-span-2">
              <h4 className="font-semibold text-lg text-gray-800 mb-3">
                Order Notes
              </h4>
              <p className="font-normal text-gray-500">
                {order.customer_note || "No additional notes provided."}
              </p>
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
      {/* Assuming you have a FeedbackModal component */}
      {/* <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} /> */}
    </>
  );
}
