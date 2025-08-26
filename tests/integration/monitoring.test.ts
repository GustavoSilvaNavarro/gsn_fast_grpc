import * as Config from '@config';
import axios from 'axios';

describe('Monitoring Route', () => {
  const HEALTH_ROUTE = '/healthz';

  describe(`GET ${HEALTH_ROUTE}`, () => {
    test('Should return a 204 status code', async () => {
      const resp = await axios.get(`${Config.API_URL}${HEALTH_ROUTE}`);

      expect(resp.status).toBe(204);
    });
  });
});
