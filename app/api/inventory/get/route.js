import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      `http://${process.env.NEXT_PUBLIC_IP}:3000/inventory-get`,
      {
        headers: { Authorization: `Bearer ${process.env.ADMIN_API_KEY}` },
      }
    );
    const data = await response.json();
    console.log("data", data);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
