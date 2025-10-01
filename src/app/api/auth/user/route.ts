import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('No token');

    const wpResponse = await fetch(`${process.env.WP_API_URL}/wp/v2/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const wpData = await wpResponse.json();
    if (!wpResponse.ok) {
      throw new Error(wpData.message || 'Invalid token');
    }

    // Transform WordPress user to match AuthContext
    const user = {
      id: wpData.id.toString(),
      name: wpData.name,
      email: wpData.email,
    };

    return NextResponse.json(user);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Invalid token' }, { status: 401 });
  }
}