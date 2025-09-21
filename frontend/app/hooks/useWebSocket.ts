'use client'
import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"

interface Metric {
    timeStamp: string;
    responseTime: string;
}

export const useWebSocket = (projectId: string) => {
    const queryClient = useQueryClient();
    useEffect(() => {
        const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000');
        ws.onopen = () => {
            console.log('[WebSocket] Connected.');
            ws.send(JSON.stringify({ type: 'subscribe', projectId }));
        };
        ws.onmessage = (event) => {
            const newMetric = JSON.parse(event.data);
            queryClient.setQueryData(['projectMetrics', projectId], (oldData: any) => {
                const dataArray = oldData || [];
                return [...dataArray, newMetric];
            });
        }
        ws.onclose = () => {
            console.log('[WebSocket] Disconnected.');
        };
        return () => {
            ws.close();
        };

    }, [projectId, queryClient]);
}