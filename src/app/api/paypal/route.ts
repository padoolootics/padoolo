import { NextResponse } from "next/server";
import CartServices from "@/lib/api/services/CartServices";

const WOOCOMMERCE_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

// const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

const PAYPAL_API_BASE_URL =
  process.env.APP_MODE === 'testing'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

const PAYPAL_CLIENT_ID =
  process.env.APP_MODE === 'testing'
    ? process.env.PAYPAL_CLIENT_ID
    : process.env.PAYPAL_CLIENT_PROD_ID;

const PAYPAL_CLIENT_SECRET =
  process.env.APP_MODE === 'testing'
    ? process.env.PAYPAL_CLIENT_SECRET
    : process.env.PAYPAL_CLIENT_PROD_SECRET;

// Function to fetch a WooCommerce order securely
async function getWooCommerceOrder(orderId: number) {
  if (!WOOCOMMERCE_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    throw new Error("WooCommerce credentials not set.");
  }

  const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/orders/${orderId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64")}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch WooCommerce order ${orderId}`);
  }

  return response.json();
}

// Function to generate an access token for PayPal API calls
async function generateAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");
  const response = await fetch(`${PAYPAL_API_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    console.error("PayPal Access Token Error:", data);
    throw new Error(data.error_description || "Failed to generate PayPal access token");
  }
  return data.access_token;
}

// Function to create a PayPal order
async function createPayPalOrder(
  accessToken: string,
  wooOrderTotal: string
) {
  const response = await fetch(`${PAYPAL_API_BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      application_context: {
        shipping_preference: "NO_SHIPPING",
      },
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: wooOrderTotal,
          },
        },
      ],
    }),
  });

  const data = await response.json();
  return data;
}

// Function to capture the payment
async function capturePayPalPayment(accessToken: string, orderId: string) {
  console.log(`Attempting to capture PayPal order with ID: ${orderId}`);
  try {
    const response = await fetch(
      `${PAYPAL_API_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    console.log("PayPal Capture API response:", data);

    if (!response.ok) {
      console.error(
        "PayPal API returned a non-ok status:",
        response.status,
        response.statusText
      );
      throw new Error(
        data.message || "PayPal capture failed with non-ok status."
      );
    }

    return data;
  } catch (error) {
    console.error("An error occurred during PayPal capture:", error);
    throw error;
  }
}

// UPDATED FUNCTION: Update the WooCommerce order status with PayPal payment data
async function updateWooCommerceOrder(orderId: number, status: string, captureDetails: any) {
    if (!WOOCOMMERCE_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
        console.error("WooCommerce credentials not set. Order status cannot be updated.");
        return;
    }

    // Prepare the update data, including new meta_data for PayPal details
    const data = {
        status: status,
        set_paid: true, // Mark the order as paid in WooCommerce
        meta_data: [
            { key: '_paypal_transaction_id', value: captureDetails.id },
            { key: '_paypal_status', value: captureDetails.status },
            { key: '_paypal_payer_email', value: captureDetails.payer.email_address },
            { key: '_paypal_payer_name', value: `${captureDetails.payer.name.given_name} ${captureDetails.payer.name.surname}` },
            { key: '_paypal_currency', value: captureDetails.purchase_units[0]?.payments?.captures[0]?.amount?.currency_code },
            { key: '_paypal_amount', value: captureDetails.purchase_units[0]?.payments?.captures[0]?.amount?.value },
        ],
    };

    // Construct the API endpoint URL for a specific order
    const updateUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/orders/${orderId}`;

    try {
        const response = await fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // Use Basic Auth for WooCommerce API
                'Authorization': `Basic ${Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Failed to update WooCommerce order status for ID ${orderId}:`, errorData);
            throw new Error(`WooCommerce API returned a non-ok status: ${response.status}`);
        }

        const updatedOrder = await response.json();
        console.log(`WooCommerce order ${orderId} status updated to: ${updatedOrder.status} with PayPal details.`);
        return updatedOrder;
    } catch (error) {
        console.error(`An error occurred while updating WooCommerce order ${orderId}:`, error);
        throw error;
    }
}

export async function POST(req: Request) {
  const { action, cartItems, orderId, wooOrderId, wooOrderTotal } =
    await req.json();

  console.log("Received wooOrderId:", wooOrderId, "and wooOrderTotal:", wooOrderTotal);

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    return NextResponse.json(
      { error: "PayPal credentials not set." },
      { status: 500 }
    );
  }

  try {
    const accessToken = await generateAccessToken();

    if (action === "createOrder") {
      // SECURITY: Fetch the actual order from WooCommerce to verify the total
      // This prevents price manipulation from the client side.
      let wooOrder;
      try {
        wooOrder = await getWooCommerceOrder(wooOrderId);
      } catch (err) {
        console.error("Order verification failed:", err);
        return NextResponse.json({ error: "Order not found." }, { status: 404 });
      }

      // Clean the total from WooCommerce: remove any currency symbols and ensure proper decimal format
      let actualTotal = String(wooOrder.total).replace(/[^\d.]/g, '');
      const numericActualTotal = parseFloat(actualTotal);

      // Clean the total provided by client for comparison
      let clientTotal = String(wooOrderTotal).replace(/[^\d.]/g, '');
      const numericClientTotal = parseFloat(clientTotal);

      console.log(`Security Check: ClientTotal=${numericClientTotal}, ActualTotal=${numericActualTotal}`);

      // Allow for small rounding differences (e.g. 0.01) but reject significant differences
      if (Math.abs(numericClientTotal - numericActualTotal) > 0.01) {
        console.error("Security Alert: Price manipulation detected!");
        return NextResponse.json({ error: "Price discrepancy detected. Order rejected." }, { status: 400 });
      }
      
      const cleanTotal = numericActualTotal.toFixed(2);
      
      console.log(`Creating PayPal order for verified total: ${cleanTotal}`);
      
      const order = await createPayPalOrder(
        accessToken,
        cleanTotal
      );
      
      if (!order.id) {
        console.error("PayPal order creation failed. Details:", JSON.stringify(order, null, 2));
        return NextResponse.json({ error: order.message || "Failed to create PayPal order" }, { status: 400 });
      }

      return NextResponse.json({ orderID: order.id });
    }

    if (action === "capturePayment") {
      const capture = await capturePayPalPayment(accessToken, orderId);
      
      if (capture.status === "COMPLETED") {
          // SECONDARY SECURITY: Verify the captured amount matches the WooCommerce order
          const wooOrder = await getWooCommerceOrder(wooOrderId);
          const capturedAmount = parseFloat(capture.purchase_units[0]?.payments?.captures[0]?.amount?.value || "0");
          const expectedAmount = parseFloat(String(wooOrder.total).replace(/[^\d.]/g, ''));

          console.log(`Capture verification: Captured=${capturedAmount}, Expected=${expectedAmount}`);

          if (Math.abs(capturedAmount - expectedAmount) > 0.01) {
            console.error("Critical Security Alert: Captured amount does not match order total!");
            // We still update the order but maybe mark it for manual review or as "on-hold" instead of "processing"
            await updateWooCommerceOrder(wooOrderId, "on-hold", capture);
            return NextResponse.json({ ...capture, status: "REVIEW_REQUIRED", message: "Amount mismatch detected." });
          }

          await updateWooCommerceOrder(wooOrderId, "processing", capture);
      }

      return NextResponse.json(capture);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}