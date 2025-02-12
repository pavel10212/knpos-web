import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    const { itemId } = await request.json();
    const response = await fetch(
      `http://${process.env.NEXT_PUBLIC_IP}:3000/menu-delete/${itemId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete the menu item");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
