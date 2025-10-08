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
  return data.access_token;
}

// Function to create a PayPal order
async function createPayPalOrder(
  accessToken: string,
  wooOrderTotal: string
) {
  // IMPORTANT: The PayPal API requires a total amount, not a list of individual cart items.
  // We're using the secure `wooOrderTotal` passed from the client here.
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

// NEW FUNCTION: Update the WooCommerce order status
// async function updateWooCommerceOrder(orderId: number, status: string) {
//     if (!WOOCOMMERCE_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
//         console.error("WooCommerce credentials not set. Order status cannot be updated.");
//         return;
//     }

//     // Prepare the update data
//     const data = {
//         status: status,
//     };

//     // Construct the API endpoint URL for a specific order
//     const updateUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/orders/${orderId}`;

//     try {
//         const response = await fetch(updateUrl, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//                 // Use Basic Auth for WooCommerce API
//                 'Authorization': `Basic ${Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')}`,
//             },
//             body: JSON.stringify(data),
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             console.error(`Failed to update WooCommerce order status for ID ${orderId}:`, errorData);
//             throw new Error(`WooCommerce API returned a non-ok status: ${response.status}`);
//         }

//         const updatedOrder = await response.json();
//         console.log(`WooCommerce order ${orderId} status updated to: ${updatedOrder.status}`);
//         return updatedOrder;
//     } catch (error) {
//         console.error(`An error occurred while updating WooCommerce order ${orderId}:`, error);
//         throw error;
//     }
// }

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
      // Cart items are received here but are not used to calculate the total on the server
      // because we're using the `wooOrderTotal` that was already securely generated
      // by the `createWooOrder` function on the client.
      const order = await createPayPalOrder(
        accessToken,
        wooOrderTotal
      );
      console.log("Created PayPal order:", order);
      return NextResponse.json({ orderID: order.id });
    }

    if (action === "capturePayment") {
      const capture = await capturePayPalPayment(accessToken, orderId);
      
      // We'll update the WooCommerce order only if the PayPal payment was successfully COMPLETED
      if (capture.status === "COMPLETED") {
          // Pass the PayPal capture details to the update function
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