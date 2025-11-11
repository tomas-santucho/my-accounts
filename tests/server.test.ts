import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { startServer } from '../src/infrastructure/http/expressServer';
import { Server } from 'http';

let app: Express.Application;
let server: Server;

beforeAll(() => {
  const { app: expressApp, server: httpServer } = startServer();
  app = expressApp;
  server = httpServer;
});

afterAll(() => {
  server.close();
});

describe('GET /', () => {
  it('should return "Hello TypeScript + Express!"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello TypeScript + Express!');
  });
});
