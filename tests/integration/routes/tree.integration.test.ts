import { Node } from '@adapters/db/models';
import { API_URL } from '@config';
import { expectedMockTree, mockPayload, rootNodePayload } from '@mocks';
import { clearAllTables, seedDbForTests } from '@tests/helpers';
import axios from 'axios';

describe('Tree route tests', () => {
  const TREE_URL = '/api/tree';

  afterEach(async () => {
    await clearAllTables();
  });

  describe(`POST ${TREE_URL} tests`, () => {
    test('Should return 201 status code and create a new root node', async () => {
      const resp = await axios.post(`${API_URL}${TREE_URL}`, rootNodePayload);

      const newNode = await Node.findAll({});

      expect(resp.status).toBe(201);
      expect(resp.headers['content-type']).toEqual(expect.stringContaining('json'));
      expect(newNode).toHaveLength(1);
      expect(resp.data).toEqual({
        ...newNode[0].toJSON(),
        createdAt: new Date(newNode[0].createdAt).toISOString(),
        updatedAt: new Date(newNode[0].updatedAt).toISOString(),
      });
    });

    test('Should return status code 404 when payload is invalid', async () => {
      const resp = await axios.post(`${API_URL}${TREE_URL}`, undefined, { validateStatus: () => true });

      const newNode = await Node.findAll({});

      expect(resp.status).toBe(400);
      expect(resp.headers['content-type']).toEqual(expect.stringContaining('json'));
      expect(newNode).toHaveLength(0);
      expect(resp.data).toEqual({
        details: [
          {
            field: 'label',
            message: 'Invalid input: expected string, received undefined',
          },
        ],
        error: 'Validation failed',
      });
    });

    test('Should return 400 status code when child node does not have a parent', async () => {
      const resp = await axios.post(`${API_URL}${TREE_URL}`, mockPayload, { validateStatus: () => true });

      const newNode = await Node.findAll({});

      expect(resp.status).toBe(400);
      expect(resp.headers['content-type']).toEqual(expect.stringContaining('json'));
      expect(newNode).toHaveLength(0);
      expect(resp.data).toEqual({
        errors: [
          {
            message: 'Parent node with ID 1 not found.',
          },
        ],
      });
    });
  });

  describe(`GET ${TREE_URL} tests`, () => {
    test('Should return 200 status code with 2 nested trees', async () => {
      await seedDbForTests();
      const resp = await axios.get(`${API_URL}${TREE_URL}`, { validateStatus: () => true });

      expect(resp.status).toBe(200);
      expect(resp.headers['content-type']).toEqual(expect.stringContaining('json'));
      expect(resp.data).toHaveLength(2);
      expect(resp.data).toEqual(expectedMockTree);
    });

    test('Should return status code 200 with an empty array when nodes table is empty', async () => {
      const resp = await axios.get(`${API_URL}${TREE_URL}`, { validateStatus: () => true });

      expect(resp.status).toBe(200);
      expect(resp.headers['content-type']).toEqual(expect.stringContaining('json'));
      expect(resp.data).toHaveLength(0);
      expect(resp.data).toEqual([]);
    });

    test('Should return status code 200 with a tree with a root node only', async () => {
      await Node.create({ label: 'root' });
      const resp = await axios.get(`${API_URL}${TREE_URL}`, { validateStatus: () => true });

      expect(resp.status).toBe(200);
      expect(resp.headers['content-type']).toEqual(expect.stringContaining('json'));
      expect(resp.data).toHaveLength(1);
      expect(resp.data).toEqual([{ id: 1, label: 'root', children: [] }]);
    });
  });
});
