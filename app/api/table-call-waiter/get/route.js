import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const response = await fetch(
      `http://${process.env.NEXT_PUBLIC_IP}:3000/table-call-waiter`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
          "table-token": request.headers.get("table-token"),
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch waiter call:", error);
    return NextResponse.json(
      { error: "Failed to fetch waiter call" },
      { status: 500 }
    );
  }
}
