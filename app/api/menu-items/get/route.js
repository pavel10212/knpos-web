import {NextResponse} from "next/server";

export async function GET(req) {
    const token = req.headers.get('table-token');

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(
            `http://${process.env.NEXT_PUBLIC_IP}:3000/menu-get`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
                    'table-token': token || '',
                },
                signal: controller.signal
            }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: {
                'Cache-Control': 'stale-while-revalidate=60, max-age=30'
            }
        });
    } catch (error) {
        console.error('Error fetching menu data:', error);
        if (error.name === 'AbortError') {
            return NextResponse.json(
                { error: 'Request timed out. Please try again.' },
                { status: 504 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to fetch menu data. Please try again.' },
            { status: 500 }
        );
    }
}