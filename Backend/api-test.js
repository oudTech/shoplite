const BASE = 'http://localhost:3000';

const tests = [
  { name: 'GET /products', method: 'GET', path: '/products', expect: 200 },
  { name: 'GET /products/1', method: 'GET', path: '/products/1', expect: 200 },
  { name: 'GET /products/99999', method: 'GET', path: '/products/99999', expect: 404 },
  { name: 'POST valid', method: 'POST', path: '/products',
    body: { name: 'Mouse', price: 3000, category: 'Electronics', stock: 5 }, expect: 201 },
  { name: 'POST missing price', method: 'POST', path: '/products',
    body: { name: 'Mouse' }, expect: 400 },
  { name: 'POST bad price', method: 'POST', path: '/products',
    body: { name: 'Mouse', price: -5 }, expect: 400 },
  { name: 'GET nonsense path', method: 'GET', path: '/completely-made-up-path', expect: 404 },
  { name: 'GET /health', method: 'GET', path: '/health', expect: 200 },
];

async function run() {
  for (const t of tests) {
    const options = { method: t.method };
    if (t.body) {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(t.body);
    }
    const res = await fetch(BASE + t.path, options);
    const data = await res.json();
    const result = res.status === t.expect ? 'PASS' : 'FAIL';
    console.log(`${result} | ${t.name} | expected ${t.expect}, got ${res.status} | ${JSON.stringify(data).slice(0, 70)}`);
  }
}

run();