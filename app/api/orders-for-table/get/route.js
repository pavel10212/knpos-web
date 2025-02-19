import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const response = await fetch(
      `http://${
        process.env.NEXT_PUBLIC_IP
      }:3000/orders-for-table?table_token=${request.headers.get(
        "table-token"
      )}`,
      {
        headers: {
          "table-token": request.headers.get("table-token"),
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
