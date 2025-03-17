import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiUrl = `http://${process.env.NEXT_PUBLIC_IP}:3000/admin-settings-get`;
    
    const response = await fetch(
      apiUrl,
      {
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
        },
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