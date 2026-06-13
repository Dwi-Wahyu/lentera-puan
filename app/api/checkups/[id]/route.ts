import { api } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const checkup = await api.getCheckup(id);

    if (!checkup) {
      return NextResponse.json({ error: "Checkup not found" }, { status: 404 });
    }

    return NextResponse.json(checkup);
  } catch (error) {
    console.error("Failed to fetch checkup:", error);
    return NextResponse.json({ error: "Failed to fetch checkup" }, { status: 500 });
  }
}
