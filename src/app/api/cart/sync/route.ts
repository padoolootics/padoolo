import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    
  try {
    const { cart } = await request.json();
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    

    // For authenticated users, include JWT; for guests, rely on WooCommerce session
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('Syncing cart...', cart);

    // Sync cart with WooCommerce Store API
    const wpResponse = await fetch(`${process.env.WP_API_URL}/wc/store/v1/cart`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ items: cart }), // Adjust based on WooCommerce API requirements
    });

    const wpCart = await wpResponse.json();
    if (!wpResponse.ok) {
      throw new Error(wpCart.message || 'Cart sync failed');
    }

    // Transform WooCommerce cart to match CartItem
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedCart = wpCart.items?.map((item: any) => ({
      id: item.id.toString(),
      name: item.name,
      price: parseFloat(item.price || item.prices?.price || '0'),
      quantity: item.quantity,
      image: item.image?.src || '',
    })) || [];

    return NextResponse.json(transformedCart);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Cart sync failed' }, { status: 500 });
  }
}