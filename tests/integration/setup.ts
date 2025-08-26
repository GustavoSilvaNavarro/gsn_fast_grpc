import { Agent } from 'node:http';

import { clearAllTables, connectTestDb, sequelizeTestConnection } from '@tests/helpers';
import axios from 'axios';

axios.defaults.httpAgent = new Agent({ keepAlive: false });

beforeAll(async () => {
  await connectTestDb();
  await clearAllTables();
});

afterAll(async () => {
  await clearAllTables();
  await sequelizeTestConnection.close();
});
