import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const available = searchParams.get("available");

  try {
    let where = {};
    if (available === 'true') {
      where = {
        status: {
          not: "PENUH"
        }
      };
    }

    const safehouses = await prisma.safeHouse.findMany({
      where
    });

    return NextResponse.json(safehouses);
  } catch {
    return NextResponse.json({ error: "Failed to fetch safehouses" }, { status: 500 });
  }
}
