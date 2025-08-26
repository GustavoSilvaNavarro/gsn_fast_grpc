import routes from '@routes';
import express from 'express';
import supertest from 'supertest';

const server = express();
server.use(express.json());
server.use('/', routes);

const request = supertest(server);

describe('Monitoring Routes tests', () => {
  const HEALTH_ROUTE = '/healthz';

  describe(`GET ${HEALTH_ROUTE}`, () => {
    describe('Healthz check', () => {
      test('Should return status code 204, status health check', async () => {
        const resp = await request.get(HEALTH_ROUTE);

        expect(resp.statusCode).toBe(204);
        expect(resp.body).toEqual({});
      });
    });
  });
});
