"use client";

import {useSocketStore} from "@/hooks/useSocket";

export default function Footer({token}) {
    const callWaiterSocket = useSocketStore((state) => state.callWaiterSocket);
    const handleCallWaiterHere = async () => {
        try {
            await callWaiterSocket(token);
            alert("Waiter has been notified and will arrive at your table shortly!");
        } catch (error) {
            console.log("Error calling waiter: ", error);
            alert("Unable to call waiter. Please try again.");
        }
    };

    return (
        <footer className="bg-white text-white fixed bottom-0 w-full p-4 shadow-lg flex justify-center z-50">
            <button
                onClick={handleCallWaiterHere}
                className="bg-customYellow text-white px-6 py-2 rounded-full shadow-md hover:bg-customYellow hover:text-white transition-all flex items-center gap-2 border border-customYellow"
                disabled={false}
            >
                <i className="fas fa-bell"></i> Call Waiter
            </button>
        </footer>
    );
}