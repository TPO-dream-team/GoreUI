import { test, expect } from '../fixtures.js';

test('Database should be initialized with mountains', async ({ dbClient }) => {
  const result = await dbClient.query('SELECT COUNT(*) FROM MOUNTAIN');
  const count = parseInt(result.rows[0].count);

  //console.log(`Found ${count} mountains in the DB`);
  expect(count).toBeGreaterThan(0);
});

test('Admin user should exist', async ({ dbClient }) => {
  const result = await dbClient.query("SELECT username FROM \"users\" WHERE username = 'admin'");
  expect(result.rows[0].username).toBe('admin');
});

test.describe('Mountain API', () => {
  
  test('GET /mountain should return a list of mountains', async ({ request, backendUrl }) => {
    
    const response = await request.get(`${backendUrl}/mountain`);
    expect(response.ok()).toBeTruthy();
    
    const mountains = await response.json();
    console.log(`Fetched ${mountains.length} mountains from API`);

    expect(Array.isArray(mountains)).toBe(true);
    expect(mountains.length).toBeGreaterThan(0);

    const firstMountain = mountains[0];
    expect(firstMountain).toHaveProperty('name');
    expect(firstMountain).toHaveProperty('height');
    
    const triglav = mountains.find((m: any) => m.name === 'Triglav');
    console.log(firstMountain)
    expect(triglav).toBeDefined();
    expect(Number(triglav.height)).toBe(2864);
  });
});

