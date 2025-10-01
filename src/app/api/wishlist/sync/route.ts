import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { wishlist } = await request.json();
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      // For guest users, return client-side wishlist (stored in localStorage)
      return NextResponse.json(wishlist);
    }

    // Sync wishlist with custom WordPress endpoint
    const wpResponse = await fetch(`${process.env.WP_API_URL}/custom/v1/wishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ wishlist }),
    });

    const wpWishlist = await wpResponse.json();
    if (!wpResponse.ok) {
      throw new Error(wpWishlist.message || 'Wishlist sync failed');
    }

    // Transform wishlist to match WishlistItem (assuming endpoint returns same format)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedWishlist = wpWishlist.map((item: any) => ({
      id: item.id.toString(),
      name: item.name,
      price: parseFloat(item.price || '0'),
      image: item.image || '',
    }));

    return NextResponse.json(transformedWishlist);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Wishlist sync failed' }, { status: 500 });
  }
}