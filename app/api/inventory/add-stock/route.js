import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const body = await request.json();
    const response = await fetch(
      `http://${process.env.NEXT_PUBLIC_IP}:3000/inventory-add-stock`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
        },
        body: JSON.stringify(body),
      }
    );
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to add stock to product" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
