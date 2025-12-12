import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/infrastructure/http/expressServer';
import { Application } from 'express';
import { Db } from 'mongodb';

let app: Application;

beforeAll(() => {
  // The / route doesn't use the db, so we can pass a mock/dummy object.
  const mockDb = {
    collection: () => ({
      find: () => ({
        toArray: () => Promise.resolve([]),
      }),
    }),
  } as unknown as Db;
  app = createApp(mockDb);
});

describe('GET /', () => {
  it('should return "Hello TypeScript + Express!"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('My Accounts 0.7.3');
  });
});