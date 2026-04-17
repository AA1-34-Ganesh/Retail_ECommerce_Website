const request = require('supertest');
const express = require('express');
const app = require('../index'); // or export app from index.js

describe('API Tests', () => {
  it('GET /api/products should return products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
  });

  it('GET /api/health should return OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.status).toBe('ok');
  });
});