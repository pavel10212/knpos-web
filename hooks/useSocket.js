import io from "socket.io-client";
import {create} from "zustand";


const SOCKET_URL = `http://${process.env.NEXT_PUBLIC_IP}:3000`;


export const useSocketStore = create((set, get) => ({
    socket: null,
    error: null,

    initializeSocket: () => {
        const {socket} = get();
        if (socket) return;

        const newSocket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            upgrade: false,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        set({socket: newSocket});

        newSocket.on("connect", () => {
            console.log("Socket connected");
        });
        newSocket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
            set({error: "Socket connection error"});
        });
    },
    callWaiterSocket: (table_token) => {
        const {socket} = get();
        console.log("Calling waiter for table:", table_token);
        socket.emit("table-call-waiter", table_token);
    },
}));




