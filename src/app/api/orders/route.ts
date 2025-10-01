import { NextRequest, NextResponse } from 'next/server';

const WOOCOMMERCE_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

// Define a type for the data you expect from the frontend.
// This provides type-safety and helps prevent errors.
interface OrderPayload {
    // This is optional for guest users, but required for logged-in users.
    customer_id?: number; 
    payment_method: string;
    payment_method_title: string;
    set_paid: boolean;
    billing: {
        first_name: string;
        last_name: string;
        address_1: string;
        city: string;
        postcode: string;
        country: string;
        email: string;
        phone: string;
    };
    shipping: {
        first_name: string;
        last_name: string;
        address_1: string;
        city: string;
        postcode: string;
        country: string;
    };
    line_items: Array<{
        product_id: number;
        quantity: number;
    }>;
    shipping_lines: {
        method_id: string;
        method_title: string;
        total: string;
    };
    coupon_lines?: Array<{
        code: string;
    }>;
}

/**
 * Handle POST requests to create a new order in WooCommerce.
 * This function acts as a secure proxy to the WooCommerce REST API.
 */
export async function POST(req: NextRequest) {
    // Check for required environment variables.
    if (!WOOCOMMERCE_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
        return NextResponse.json(
            { error: 'Server configuration error: Missing WooCommerce API credentials.' },
            { status: 500 }
        );
    }

    try {
        const payload: OrderPayload = await req.json();

        // 1. Determine if it's a logged-in or guest user.
        // A logged-in user should have a customer_id, usually passed from the frontend session.
        const isGuest = !payload.customer_id;

        // 2. Prepare the order data for the WooCommerce API.
        const orderData: any = { // Use 'any' for now to allow dynamic properties
            payment_method: payload.payment_method,
            payment_method_title: payload.payment_method_title,
            set_paid: payload.set_paid,
            billing: payload.billing,
            shipping: payload.shipping,
            line_items: payload.line_items,
            
            // This is the key change! We must explicitly add the shipping line.
            // WooCommerce does not calculate shipping costs from the address alone.
            shipping_lines: payload.shipping_lines,
            coupon_lines: payload.coupon_lines || [],
            
        };

        // If it's a logged-in user, include their customer_id.
        // This links the order to their account in WooCommerce.
        if (!isGuest) {
            orderData.customer_id = payload.customer_id;
        }

        // 3. Make the API call to WooCommerce.
        const wooCommerceApiUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/orders`;
        const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

        const response = await fetch(wooCommerceApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${auth}`,
            },
            body: JSON.stringify(orderData),
        });

        const wooCommerceResult = await response.json();

        // Check if the WooCommerce API call was successful.
        if (response.ok) {
            // console.log('WooCommerce Order Created: 555', wooCommerceResult, wooCommerceResult.id);
            // Success! Return the created order data to the frontend.
            return NextResponse.json(wooCommerceResult, { status: 201 });
        } else {
            // The WooCommerce API returned an error.
            console.error('WooCommerce API Error:', wooCommerceResult);
            return NextResponse.json(
                { error: 'Failed to create order', details: wooCommerceResult },
                { status: response.status }
            );
        }
    } catch (error) {
        // Handle any unexpected errors during the process.
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Internal server error.' },
            { status: 500 }
        );
    }
}


/**
 * Handle GET requests to fetch an order by ID from WooCommerce.
 */
export async function GET(req: NextRequest) {
    // Check for required environment variables.
    if (!WOOCOMMERCE_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
        return NextResponse.json(
            { error: 'Server configuration error: Missing WooCommerce API credentials.' },
            { status: 500 }
        );
    }

    try {
        // Extract order ID from the request URL.
        const url = req.nextUrl;
        const orderId = url.pathname.split('/').pop();
        console.log("Fetching order ID:", orderId);

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required.' }, { status: 400 });
        }

        // Make the API call to WooCommerce to fetch the order by ID.
        const wooCommerceApiUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/orders/${orderId}`;
        const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

        const response = await fetch(wooCommerceApiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${auth}`,
            },
        });

        const wooCommerceResult = await response.json();

        if (response.ok) {
            // Return the order data to the frontend.
            return NextResponse.json(wooCommerceResult, { status: 200 });
        } else {
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