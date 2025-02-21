import {NextResponse} from "next/server";

export async function POST(request) {
    const authHeader = request.headers.get("Authorization");
    const token = request.headers.get("table-token");
    if (!authHeader) {
        return NextResponse.json(
            {error: "No authorization token"},
            {status: 401}
        );
    }

    try {
        const orderDetails = await request.json();

        const response = await fetch(
            `http://${process.env.NEXT_PUBLIC_IP}:3000/orders-insert`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
                    "table-token": token,
                },
                body: JSON.stringify(orderDetails),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
