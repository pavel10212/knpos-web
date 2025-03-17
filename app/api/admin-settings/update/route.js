import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const settings = await request.json();
    const apiUrl = `http://${process.env.NEXT_PUBLIC_IP}:3000/admin-settings-update`;
    
    const response = await fetch(
      apiUrl,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
        },
        body: JSON.stringify(settings),
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}