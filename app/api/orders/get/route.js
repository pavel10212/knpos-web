import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const table_num = searchParams.get("table_num");

    let url = `http://${process.env.NEXT_PUBLIC_IP}:3000/orders-get`;
    if (table_num) {
      url = `http://${process.env.NEXT_PUBLIC_IP}:3000/orders-for-table?table_num=${table_num}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
