import { EventEmitter } from 'node:events';
import type { Express } from 'express';
import type { AddressInfo } from 'node:net';

export async function withServer(app: Express, run: (baseUrl: string) => Promise<void>): Promise<void> {
    const server = app.listen(0);
    await new Promise<void>((resolve) => server.once('listening', () => resolve()));
    const address = server.address() as AddressInfo;
    try {
        await run(`http://127.0.0.1:${address.port}`);
    } finally {
        await new Promise<void>((resolve, reject) => {
            server.close((error) => (error ? reject(error) : resolve()));
        });
    }
}

export function mockResponse() {
    const res = new EventEmitter() as EventEmitter & {
        statusCode: number;
        body: unknown;
        headers: Record<string, string>;
        status: (code: number) => typeof res;
        json: (payload: unknown) => typeof res;
        send: (payload: unknown) => typeof res;
        setHeader: (name: string, value: string | number) => typeof res;
        getHeader: (name: string) => string | undefined;
        removeHeader: (name: string) => typeof res;
        set: (name: string, value: string) => typeof res;
        end: () => typeof res;
    };
    res.statusCode = 200;
    res.body = undefined;
    res.headers = {};
    res.status = function status(code) {
        this.statusCode = code;
        return this;
    };
    res.json = function json(payload) {
        this.body = payload;
        return this;
    };
    res.send = function send(payload) {
        this.body = payload;
        return this;
    };
    res.setHeader = function setHeader(name, value) {
        this.headers[name] = String(value);
        return this;
    };
    res.getHeader = function getHeader(name) {
        return this.headers[name];
    };
    res.removeHeader = function removeHeader(name) {
        delete this.headers[name];
        return this;
    };
    res.set = function set(name, value) {
        this.headers[name] = value;
        return this;
    };
    res.end = function end() {
        return this;
    };
    return res;
}
