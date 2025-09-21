// src/websocket.ts
import { WebSocketServer, WebSocket } from 'ws';
import { createClient } from 'redis';
import { Server } from 'http';

// A map to store clients subscribed to each project
const projectSubscriptions = new Map<string, Set<WebSocket>>();

export const setupWebSocketServer = (httpServer: Server) => {
    const wss = new WebSocketServer({ server: httpServer });

    wss.on('connection', (ws) => {
        console.log('[WebSocket] Client connected.');

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message.toString());

                // Handle subscription messages from the frontend
                if (data.type === 'subscribe' && data.projectId) {
                    const projectId = data.projectId;
                    if (!projectSubscriptions.has(projectId)) {
                        projectSubscriptions.set(projectId, new Set());
                    }
                    projectSubscriptions.get(projectId)!.add(ws);
                    console.log(`[WebSocket] Client subscribed to project: ${projectId}`);
                }
            } catch (error) {
                console.error('[WebSocket] Failed to parse message:', error);
            }
        });

        ws.on('close', () => {
            console.log('[WebSocket] Client disconnected.');
            // Clean up subscriptions when a client disconnects
            projectSubscriptions.forEach((clients, projectId) => {
                if (clients.has(ws)) {
                    clients.delete(ws);
                    if (clients.size === 0) {
                        projectSubscriptions.delete(projectId);
                    }
                }
            });
        });
    });

    console.log('[WebSocket] Server is set up.');
};

// --- Redis Pub/Sub Integration ---
const subscriber = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });

subscriber.on('error', (err) => console.error('[Redis Subscriber] Error:', err));

export const connectRedisSubscriber = async () => {
    await subscriber.connect();
    // Subscribe to the channel where our metrics service will publish messages
    await subscriber.subscribe('metrics-channel', (message) => {
        try {
            const newMetric = JSON.parse(message);
            const projectId = newMetric.projectId;

            // If we have clients subscribed to this project, broadcast the new metric
            if (projectSubscriptions.has(projectId)) {
                const clients = projectSubscriptions.get(projectId)!;
                clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(newMetric));
                    }
                });
            }
        } catch (error) {
            console.error('[Redis Subscriber] Failed to process message:', error);
        }
    });
    console.log('[Redis Subscriber] Connected and subscribed to metrics-channel.');
};