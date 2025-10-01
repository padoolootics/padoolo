import { NextRequest, NextResponse } from "next/server";
const WOOCOMMERCE_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

export async function POST(req: NextRequest) {
  try {
    const { currentPassword, newPassword, userId } = await req.json();
    console.log("Received data:", { currentPassword, newPassword, userId });

    // Call WooCommerce REST API to verify current password
    const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/customers/${userId}`;
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    // Validate current password (You might need a separate endpoint for this)
    const response = await fetch(url, {
      method: 'GET', // Fetch the customer info
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch customer data');
    }

    const data = await response.json();

    if (!data.id) {
      throw new Error('Customer not found');
    }

    // If the customer data is valid, proceed to update the password
    const updateResponse = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify({
        password: newPassword,  // New password
        current_password: currentPassword,  // Verify the current password
      }),
    });

    if (!updateResponse.ok) {
      throw new Error("Failed to update password");
    }

    const updateData = await updateResponse.json();
    console.log("WooCommerce response changepass:", updateData);

    if (updateData.id) {
      return NextResponse.json({ success: true, message: "Password updated successfully" });
    } else {
      return NextResponse.json({ success: false, message: "Failed to update password" });
    }
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json({ error: "Error changing password" }, { status: 500 });
  }
}
