import { NextResponse } from 'next/server';

const WOOCOMMERCE_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

// Function to fetch all coupons from WooCommerce
async function getCouponsFromWooCommerce() {
  const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/coupons`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch coupons: ${response.statusText}`);
  }

  return await response.json();
}

// Function to check if the provided coupon is valid
async function isCouponValid(couponCode: string) {
  try {
    // Fetch all coupons from WooCommerce
    const coupons = await getCouponsFromWooCommerce();

    // Check if the provided coupon code exists in the fetched coupons list
    const coupon = coupons.find((coupon: any) => coupon.code === couponCode);

    if (!coupon) {
      return { valid: false, message: 'Coupon is not valid.' };
    }

    // Additional checks can be added here (e.g., expiration date, usage limits, etc.)
    if (coupon.date_expires && new Date(coupon.date_expires) < new Date()) {
      return { valid: false, message: 'Coupon has expired.' };
    }

    return { valid: true, message: 'Coupon is valid.' };
  } catch (error: any) {
    return { valid: false, message: error.message };
  }
}

// API route handler
export async function POST(req: Request) {
  try {
    // Parse the incoming request body to get the coupon code
    const { couponCode } = await req.json();

    // Ensure that the coupon code is provided
    if (!couponCode) {
      return NextResponse.json({ valid: false, message: 'Coupon code is required.' }, { status: 400 });
    }

    // Check if the coupon is valid by calling the WooCommerce API
    const validationResult = await isCouponValid(couponCode);

    return NextResponse.json(validationResult);
  } catch (error: any) {
    // Return error response if any exception occurs
    return NextResponse.json({ valid: false, message: error.message }, { status: 500 });
  }
}