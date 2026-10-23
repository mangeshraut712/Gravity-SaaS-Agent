/**
 * Enhanced Gateway Index
 * Production-ready gateway with all enhancements
 */

import { createServer, Server } from 'http';
import { pathToFileURL } from 'node:url';
import dotenv from 'dotenv';
import { createGatewayApp, startSessionCleanup } from './app.js';
import { WebSocketManager } from './services/websocket.js';
import { logger } from './services/logger.js';
import { healthCheckService, registerDefaultHealthChecks } from './services/health-check.js';
import { modelProviderManager } from './services/model-provider.js';
import { ChannelMessage } from '@gravity/types';

dotenv.config();

export interface RunningGateway {
    server: Server;
    wsManager: WebSocketManager;
    stopSessionCleanup: () => void;
    detachSignals: () => void;
}

export async function startServer(): Promise<RunningGateway> {
    const port = process.env.PORT || 3003;
    const runtime = createGatewayApp();
    const server = createServer(runtime.app);
    const wsManager = new WebSocketManager(server, { maxClients: 1000 });

    await modelProviderManager.init();
    logger.info('Model provider manager initialized', { providers: modelProviderManager.getAvailableProviders() });

    registerDefaultHealthChecks();
    const stopSessionCleanup = startSessionCleanup(runtime.sessions);

    runtime.channelManager.onMessage(async (message: ChannelMessage) => {
        logger.info('Received channel message', { channelId: message.channelId, userId: message.userId });
    });

    await new Promise<void>((resolve) => {
        server.listen(port, () => {
            logger.info(`🚀 Enhanced Gravity Gateway running on port ${port}`, {
                port,
                env: process.env.NODE_ENV || 'development',
                version: process.env.npm_package_version || '1.0.0',
            });
            resolve();
        });
    });

    const shutdown = (signal: string) => {
        logger.info(`${signal} received, shutting down gracefully`);
        stopSessionCleanup();
        server.close(() => {
            logger.info('Server closed');
            healthCheckService.destroy();
            process.exit(0);
        });
    };

    const onTerm = () => shutdown('SIGTERM');
    const onInt = () => shutdown('SIGINT');
    process.on('SIGTERM', onTerm);
    process.on('SIGINT', onInt);

    return {
        server,
        wsManager,
        stopSessionCleanup,
        detachSignals: () => {
            process.off('SIGTERM', onTerm);
            process.off('SIGINT', onInt);
        },
    };
}

function isDirectExecution(): boolean {
    const entry = process.argv[1];
    if (!entry) return false;
    return import.meta.url === pathToFileURL(entry).href;
}

if (isDirectExecution()) {
    startServer().catch((error: unknown) => {
        logger.error('Failed to start gateway', undefined, error instanceof Error ? error : new Error(String(error)));
        process.exit(1);
    });
}
