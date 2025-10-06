import { NextRequest, NextResponse } from "next/server";

// WooCommerce API credentials
const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL!;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const { email, authType } = await request.json();
    const normalizedEmail = email.toLowerCase();

    // Check if user exists in WooCommerce by email
    const response = await fetch(
      `${WOOCOMMERCE_URL}/wp-json/wc/v3/customers?email=${encodeURIComponent(
        normalizedEmail
      )}`,
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString(
              "base64"
            ),
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status}`);
    }

    const customers = await response.json();
    console.log("WooCommerce check-user raw response:", customers);

    if (customers.length > 0) {
      const user = customers[0];
      const userAuthType =
        user.meta_data?.find((m: any) => m.key === "auth_type")?.value ||
        "credentials";
      const googleId =
        user.meta_data?.find((m: any) => m.key === "google_id")?.value || null;

      if (userAuthType !== authType) {
        return NextResponse.json(
          {
            exists: true,
            authType: userAuthType,
            error: `account_exists_${userAuthType}`,
          },
          { status: 409 }
        );
      }

      return NextResponse.json({
        exists: true,
        authType: userAuthType,
        wooUserId: user.id,
        password: googleId,
      });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error("Check user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
