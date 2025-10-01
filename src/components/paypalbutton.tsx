"use client";

import { useAuth } from "@/lib/Contexts/AuthContext";
import { useCartContext } from "@/lib/Contexts/CartContext";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface CartItem {
  product_id: number;
  variation_id?: number;
  quantity: number;
}

interface PayPalComponentProps {
  cartItems: CartItem[];
  onPaymentSuccess: (captureDetails: any) => void;
  validateForm: () => boolean;
  createWooOrder: () => Promise<{ orderId: any; orderTotal: any } | undefined>;
  couponCode: string;
}

const PayPalComponent = ({
  cartItems,
  onPaymentSuccess,
  validateForm,
  createWooOrder,
  couponCode,
}: PayPalComponentProps) => {
  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
    currency: "EUR",
    intent: "capture",
  };

  // State to store the WooCommerce Order ID
  const [wooOrderId, setWooOrderId] = useState<number | undefined>(undefined);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { clearCart } = useCartContext();

  const createOrder = async (data: any, actions: any) => {
    // Before creating the PayPal order, validate the user's form
    if (!validateForm()) {
      toast.error("Please fill out all required fields.");
      return;
    }

    // First, create the order in WooCommerce to get the total and order ID securely
    const wooOrderData = await createWooOrder();

    if (!wooOrderData || !wooOrderData.orderId || !wooOrderData.orderTotal) {
      toast.error("Failed to create WooCommerce order. Please try again.");
      console.error(
        "WooCommerce order data is missing or incomplete:",
        wooOrderData
      );
      throw new Error("Missing WooCommerce order details.");
    }

    // Store the wooOrderId in the component's state
    setWooOrderId(wooOrderData.orderId);

    // Pass the raw cart items, along with the wooOrderId and wooOrderTotal, to the server
    // The server will use the total to create the PayPal order
    const response = await fetch("/api/paypal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "createOrder",
        cartItems, // Pass cart items to the server for verification if needed
        wooOrderId: wooOrderData.orderId,
        wooOrderTotal: wooOrderData.orderTotal,
      }),
    });

    const order = await response.json();

    if (!response.ok) {
      // Show an error to the user if the order creation fails
      toast.error(`Failed to create PayPal order: ${order.error}`);
      throw new Error(`Failed to create PayPal order: ${order.error}`);
    }

    // Return the PayPal order ID to the PayPal SDK
    return order.orderID;
  };

  const onApprove = async (data: any, actions: any) => {
    console.log("Order approved with data:", data);

    if (!wooOrderId) {
      toast.error(
        "Could not retrieve WooCommerce order details. Please refresh and try again."
      );
      return;
    }

    const response = await fetch("/api/paypal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "capturePayment",
        orderId: data.orderID,
        wooOrderId: wooOrderId,
      }),
    });

    const capture = await response.json();
    console.log("Payment captured:", capture);

    // If the payment is completed, call the provided success callback
    if (capture.status === "COMPLETED") {
      onPaymentSuccess(capture);
      if (!isAuthenticated) {
        clearCart();
        router.push("/order-placed/");
        
      } else {
        clearCart();
        router.push("/order-confirmation/" + wooOrderId);
      }
    } else {
      // Handle cases where capture is not completed
      toast.error("Payment was not completed. Please try again.");
    }
  };

  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
    return (
      <div>
        PayPal Client ID is not configured. Please check your .env.local file.
      </div>
    );
  }

  // Only render the PayPal buttons if there are items in the cart
  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div>
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={createOrder}
          onApprove={onApprove}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalComponent;
