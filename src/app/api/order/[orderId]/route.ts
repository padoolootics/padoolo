import { NextRequest, NextResponse } from 'next/server';

const WOOCOMMERCE_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

/**
 * Handle GET requests to fetch an order by ID from WooCommerce.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  // Check for required environment variables.
  if (!WOOCOMMERCE_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    return NextResponse.json(
      { error: 'Server configuration error: Missing WooCommerce API credentials.' },
      { status: 500 }
    );
  }

  try {
    // Extract order ID from the route parameters
    const params = await context.params;
    const { orderId } = params;

    console.log("Extracted Order ID:", orderId);

    // Ensure orderId is provided.
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required.' }, { status: 400 });
    }

    // Construct the WooCommerce API URL to fetch the order by ID.
    const wooCommerceApiUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/orders/${orderId}`;
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    // Make the API call to WooCommerce.
    const response = await fetch(wooCommerceApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
    });

    // Parse the response data from WooCommerce.
    const wooCommerceResult = await response.json();

    if (response.ok) {
      // If successful, return the order data to the frontend.
      return NextResponse.json(wooCommerceResult, { status: 200 });
    } else {
      // Log the error and return it to the frontend.
      console.error('WooCommerce API Error:', wooCommerceResult);
      return NextResponse.json(
        { error: 'Failed to fetch order', details: wooCommerceResult },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}