import { NextResponse } from 'next/server';

export async function GET() {
  // Use a different variable name to emphasize it's not a public variable
  const WOOCOMMERCE_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  if (!WOOCOMMERCE_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    console.error("Missing WooCommerce API credentials.");
    return NextResponse.json(
      { message: 'Server-side WooCommerce API credentials are not set.' },
      { status: 500 }
    );
  }

  try {
    // The API URL to fetch all payment gateways
    const wooCommerceApiUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/payment_gateways`;
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    const response = await fetch(wooCommerceApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      }
    });

    if (!response.ok) {
        console.error(`WooCommerce API Error: ${response.status} - ${response.statusText}`);
        throw new Error(`Failed to fetch payment gateways from WooCommerce.`);
    }

    const wooCommerceResult = await response.json();
    
    // Filter the results to get only the gateways that are enabled
    const enabledGateways = wooCommerceResult.filter((gateway: any) => gateway.enabled);

    const gateways = enabledGateways.map((gateway: any) => ({
      id: gateway.id,
      title: gateway.title,
      description: gateway.description,
    }));

    return NextResponse.json(gateways, { status: 200 });
  } catch (error) {
    console.error("An error occurred in the payment gateways route:", error);
    return NextResponse.json(
      { message: 'Failed to fetch payment gateways. Please check the server logs.' },
      { status: 500 }
    );
  }
}
