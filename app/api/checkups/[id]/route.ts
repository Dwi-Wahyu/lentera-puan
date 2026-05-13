import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const checkup = await prisma.medicalCheckup.findUnique({
      where: { id },
    });

    if (!checkup) {
      return NextResponse.json({ error: "Checkup not found" }, { status: 404 });
    }

    return NextResponse.json(checkup);
  } catch {
    return NextResponse.json({ error: "Failed to fetch checkup" }, { status: 500 });
  }
}
