import { NextRequest, NextResponse } from 'next/server';

// Load environment variables for security.
// Ensure these are set in your .env.local file.
const WOOCOMMERCE_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

// Helper function to handle both GET and POST requests
const handleApiRequest = async (request: NextRequest) => {
  const url = new URL(request.url);
  const productId = url.searchParams.get('productId');
  const method = request.method;

  // Check if API credentials are provided
  if (!WOOCOMMERCE_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    return NextResponse.json({ message: 'WooCommerce API credentials not set.' }, { status: 500 });
  }

  // Authentication credentials for WooCommerce API
  const auth = `${CONSUMER_KEY}:${CONSUMER_SECRET}`;
  const base64Auth = Buffer.from(auth).toString('base64');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${base64Auth}`,
  };

  try {
    // Handle GET request to fetch reviews for a specific product
    if (method === 'GET' && productId) {
      const wooUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products/reviews?product=${productId}`;
      const response = await fetch(wooUrl, { headers });
      
      if (!response.ok) {
        return NextResponse.json({ message: 'Failed to fetch reviews from WooCommerce.' }, { status: response.status });
      }
      
      const reviews = await response.json();
      return NextResponse.json(reviews);
    } 
    
    // Handle POST request to create a new review
    else if (method === 'POST') {
      const body = await request.json();
      const wooUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products/reviews`;
      
      const response = await fetch(wooUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json({ message: errorData?.message || 'Failed to submit review to WooCommerce.' }, { status: response.status });
      }
      
      const newReview = await response.json();
      return NextResponse.json(newReview);
    } 
    
    else {
      // Return an error for unsupported methods or missing product ID
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('WooCommerce API Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
};

export const GET = handleApiRequest;
export const POST = handleApiRequest;