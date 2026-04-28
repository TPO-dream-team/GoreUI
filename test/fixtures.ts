import { test as base } from '@playwright/test';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type MyWorkerFixtures = {
  backendContainer: StartedPostgreSqlContainer;
};

type MyTestFixtures = {
  dbClient: Client;
  backendUrl: string;
};

export const test = base.extend<MyTestFixtures, MyWorkerFixtures>({
    backendContainer: [async ({}, use, testInfo) => {
    const initSqlPath = path.resolve(__dirname, './../../GoreBackend/deployment/db.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');
    const backendPath = path.resolve(__dirname, './../../GoreBackend/src');
    
    const container = await new PostgreSqlContainer("postgres:17-alpine")
      .withDatabase("Goredb")
      .withUsername("postgres")
      .withPassword("admin")
      .start();

    const connectionUri = container.getConnectionUri();
    
    const client = new Client({ connectionString: connectionUri });
    await client.connect();
    await client.query(initSql);
    await client.end();

    const backendPort = 9000 + testInfo.workerIndex;
    const backendUrl = `http://0.0.0.0:${backendPort}`;

    // 4. Spawn C# Process
    const npgsqlConnectionString = `Host=${container.getHost()};Port=${container.getMappedPort(5432)};Database=${container.getDatabase()};Username=${container.getUsername()};Password=${container.getPassword()}`;
    const backend = spawn('dotnet', [
      'run', 
      '--project', backendPath,
      '--no-launch-profile', 
      '--urls', backendUrl
    ], {
      env: { 
        ...process.env, 
        "ConnectionStrings__Default": npgsqlConnectionString,
        "ASPNETCORE_ENVIRONMENT": "Development"
      },
      stdio: 'inherit',
    });

    console.log(`[Worker ${testInfo.workerIndex}] Waiting for Backend at ${backendUrl}...`);
    let isReady = false;
    for (let i = 0; i < 60; i++) {
      try {
        const response = await fetch(`${backendUrl}/mountain`);
        if (response.ok || response.status === 401) {
          isReady = true;
          break;
        }
      } catch {
        await new Promise(res => setTimeout(res, 1000));
      }
    }

    if (!isReady) {
      backend.kill();
      await container.stop();
      throw new Error(`C# Backend on ${backendUrl} failed to start.`);
    }

    await use(container);

    // Cleanup
    backend.kill();
    await container.stop();
  }, { scope: 'worker' }],

  backendUrl: async ({ backendContainer }, use, testInfo) => {
    const backendPort = 9000 + testInfo.workerIndex;
    await use(`http://127.0.0.1:${backendPort}`);
  },

  dbClient: async ({ backendContainer }, use) => {
    const client = new Client({ connectionString: backendContainer.getConnectionUri() });
    await client.connect();
    
    // RESET DATA BEFORE each test
    await client.query(`
      TRUNCATE TABLE POST_COMMENT, POST, BOARD_CHAT, BOARD, SCAN, "users" 
      RESTART IDENTITY CASCADE;
      INSERT INTO "users" (id, username, password_hash, role) 
      VALUES ('7a1268fd-484f-4719-8ec2-58b8c8f494f7', 'admin', '$2a$11$FKH5edK1umKbi9v.qFCc6O4zpZ/Dd.KKeMceegHjlfYVAw0TeoQfm', 'admin')
      ON CONFLICT (id) DO NOTHING;
    `);

    await use(client);
    await client.end();
  },
  page: async ({ page, backendUrl }, use) => { //Spremeni localhost:xyz na taprav backend url
    await page.route('**/localhost:5148/**', (route) => {
      const newUrl = route.request().url().replace('http://localhost:5148', backendUrl);
      console.log(`Redirecting API call: ${route.request().url()} -> ${newUrl}`);
      route.continue({ url: newUrl });
    });

    await use(page);
  },
});

export { expect } from '@playwright/test';