import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MongoClient } from 'mongodb';
import { createApp } from '../src/infrastructure/http/expressServer';
import { getEnvOrThrow } from 'env-utils-js';
import dotenv from 'dotenv';

dotenv.config();

describe('Transaction API', () => {
    let app: any;
    let client: MongoClient;
    let db: any;

    beforeAll(async () => {
        const mongoUrl = getEnvOrThrow('MONGO_URI');
        client = new MongoClient(mongoUrl);
        await client.connect();
        db = client.db('test_db'); // Use a test database
        app = createApp(db);
    });

    afterAll(async () => {
        await db.collection('transactions').deleteMany({});
        await client.close();
    });

    it('should create a transaction', async () => {
        const res = await request(app)
            .post('/api/transactions')
            .send({
                userId: 'user123',
                type: 'expense',
                description: 'Test Transaction',
                amount: 100,
                category: 'Food',
                date: new Date().toISOString(),
                currency: 'usd'
            });

        expect(res.status).toBe(201);
        expect(res.body.description).toBe('Test Transaction');
        expect(res.body.id).toBeDefined();
    });

    it('should get all transactions', async () => {
        const res = await request(app).get('/api/transactions');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should update a transaction', async () => {
        // First create one
        const createRes = await request(app)
            .post('/api/transactions')
            .send({
                userId: 'user123',
                type: 'expense',
                description: 'To Update',
                amount: 50,
                category: 'Food',
                date: new Date().toISOString(),
                currency: 'usd'
            });

        const id = createRes.body.id;

        const updateRes = await request(app)
            .put(`/api/transactions/${id}`)
            .send({
                description: 'Updated Description',
                amount: 75
            });

        expect(updateRes.status).toBe(200);
        expect(updateRes.body.description).toBe('Updated Description');
        expect(updateRes.body.amount).toBe(75);
    });

    it('should delete a transaction', async () => {
        // First create one
        const createRes = await request(app)
            .post('/api/transactions')
            .send({
                userId: 'user123',
                type: 'expense',
                description: 'To Delete',
                amount: 50,
                category: 'Food',
                date: new Date().toISOString(),
                currency: 'usd'
            });

        const id = createRes.body.id;

        const deleteRes = await request(app).delete(`/api/transactions/${id}`);
        expect(deleteRes.status).toBe(204);

        const getRes = await request(app).get(`/api/transactions/${id}`);
        expect(getRes.status).toBe(404);
    });
});
