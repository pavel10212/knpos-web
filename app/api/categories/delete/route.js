import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    const body = await request.json();
    const response = await fetch(
      `http://${process.env.NEXT_PUBLIC_IP}:3000/category-delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to delete category" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
