import { api } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");

  try {
    const users = await api.getUsers();
    
    let filteredUsers = users;
    if (role === 'counselor') {
      filteredUsers = users.filter((u: any) => ['PSIKOLOG', 'DP3A', 'KONSELOR'].includes(u.role));
    }

    return NextResponse.json(filteredUsers);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
