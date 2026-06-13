import { api } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const available = searchParams.get("available");

  try {
    const safehouses = await api.getSafehouses();
    
    let filteredSafehouses = safehouses;
    if (available === 'true') {
      filteredSafehouses = safehouses.filter((sh: any) => sh.status !== "PENUH");
    }

    return NextResponse.json(filteredSafehouses);
  } catch (error) {
    console.error("Failed to fetch safehouses:", error);
    return NextResponse.json({ error: "Failed to fetch safehouses" }, { status: 500 });
  }
}
