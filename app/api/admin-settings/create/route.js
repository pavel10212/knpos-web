import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const settings = await request.json();
    const response = await fetch(
      `http://${process.env.NEXT_PUBLIC_IP}:3000/admin-settings-create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
        },
        body: JSON.stringify(settings),
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