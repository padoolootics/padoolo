import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const credentials = await request.json();
    const wpResponse = await fetch(`${process.env.WP_API_URL}/jwt-auth/v1/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: credentials.email, // WordPress uses 'username' (can be email)
        password: credentials.password,
      }),
    });

    const wpData = await wpResponse.json();
    if (!wpResponse.ok) {
      throw new Error(wpData.message || 'Login failed');
    }

    // Transform WordPress response to match AuthContext
    const user = {
      id: wpData.user_id?.toString() || '1', // Ensure string ID
      name: wpData.user_display_name || 'User',
      email: wpData.user_email || credentials.email,
    };
    const token = wpData.token;

    return NextResponse.json({ token, user });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 401 });
  }
}