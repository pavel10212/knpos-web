import {NextResponse} from "next/server";

export async function GET() {
    try {
        // Create an AbortController for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(
            `http://${process.env.NEXT_PUBLIC_IP}:3000/orders-get`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
                },
                signal: controller.signal
            }
        );
        
        // Clear the timeout as soon as we get a response
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(JSON.stringify(data), {
            status: 200,
        });
    } catch (error) {
        // Specific error message for timeout errors
        if (error.name === 'AbortError') {
            return NextResponse.json(
                { error: 'Request timed out. Please try again.' },
                { status: 504 }
            );
        }
        
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
