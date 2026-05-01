import { NextResponse } from "next/server";
import HomeServices from "@/lib/api/services/HomeServices";

/**
 * API route to serve aggregated home page data.
 * This can be used for client-side hydration or as a general 
 * "Master Data" endpoint to reduce frontend fetch logic.
 */
export async function GET() {
  try {
    const data = await HomeServices.getHomeMasterData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Master Data API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch home master data" },
      { status: 500 }
    );
  }
}
