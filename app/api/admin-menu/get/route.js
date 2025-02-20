import {NextResponse} from "next/server";


export async function GET() {
    try {
        const response = await fetch(
            `http://${process.env.NEXT_PUBLIC_IP}:3000/admin-menu-get`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: {
                'Cache-Control': 'max-age=3600, s-maxage=3600, stale-while-revalidate=59',
            },
        });
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}