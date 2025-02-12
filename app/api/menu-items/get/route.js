import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      `http://${process.env.NEXT_PUBLIC_IP}:3000/admin-menu-get`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
