import {NextResponse} from "next/server";

export async function GET(req) {
    const token = req.headers.get('table-token');

    try {
        const response = await fetch(
            `http://${process.env.NEXT_PUBLIC_IP}:3000/admin-menu-get`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
                    'table-token': token || '',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return new NextResponse(JSON.stringify(data), {
            status: 200,
        });
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}