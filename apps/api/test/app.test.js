import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
import { listQuerySchema } from '../src/catalog.js';

const fakePool = {
  async execute(sql) {
    if (sql.includes('COUNT(*)')) return [[{ count: 0 }]];
    return [[]];
  }
};

async function withServer(callback) {
  const server = createApp({ pool: fakePool, frontendUrl: 'http://localhost:3000' }).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try { await callback('http://127.0.0.1:' + server.address().port); }
  finally { await new Promise(resolve => server.close(resolve)); }
}

test('health endpoint returns ok', async () => {
  await withServer(async base => {
    const res = await fetch(base + '/api/health');
    assert.equal(res.status, 200);
    assert.equal((await res.json()).status, 'ok');
  });
});

test('catalog returns an empty paginated list', async () => {
  await withServer(async base => {
    const res = await fetch(base + '/api/v1/products');
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body.products, []);
    assert.equal(body.pagination.total, 0);
  });
});

test('invalid catalog limits are rejected', async () => {
  assert.equal(listQuerySchema.safeParse({ limit: '1000' }).success, false);
  await withServer(async base => {
    const res = await fetch(base + '/api/v1/products?limit=1000');
    assert.equal(res.status, 400);
  });
});

test('missing product gets 404', async () => {
  await withServer(async base => {
    const res = await fetch(base + '/api/v1/products/nonexistent');
    assert.equal(res.status, 404);
  });
});
