import { api } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  try {
    const params: any = {};
    if (search) params.search = search;
    
    const patients = await api.getPatients(params);
    return NextResponse.json(patients);
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}
