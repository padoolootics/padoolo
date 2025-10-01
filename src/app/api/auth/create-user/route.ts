import { NextRequest, NextResponse } from "next/server";

// WooCommerce API credentials
const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL!;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const { email, name, image, password, authType, googleId } = await request.json();

    // Extract first and last name from full name
    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create user in WooCommerce
    const userData = {
      email,
      first_name: firstName,
      last_name: lastName,
      username: email,
      password: password, // This is the Google ID
      meta_data: [
        {
          key: 'auth_type',
          value: authType
        },
        ...(authType === 'google' ? [{
          key: 'google_id',
          value: googleId
        }] : [])
      ]
    };

    const response = await fetch(
      `${WOOCOMMERCE_URL}/wp-json/wc/v3/customers`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("WooCommerce create user error:", errorData);
      throw new Error(`Failed to create user: ${response.status}`);
    }

    const newUser = await response.json();
    
    // Return both the user ID and password (Google ID) for JWT token generation
    return NextResponse.json({ 
      success: true, 
      wooUserId: newUser.id,
      password: password // This is the Google ID
    });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}