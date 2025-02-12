import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        error: "Token is required",
      },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `http://${process.env.NEXT_PUBLIC_IP}:3000/find-table?token=${token}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || "Failed to fetch table",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error finding table:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
