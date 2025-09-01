import { logger } from '@adapters';
import * as Config from '@config';
import { startServer } from '@server';
import { onExit } from 'signal-exit';

import { closeConnections, createConnections } from './connections';

// Handle process errors
process.on('uncaughtException', (error) => {
  logger.error('uncaughtException', error);
  throw error;
});
process.on('unhandledRejection', (err) => logger.error('unhandledRejection', err));

// Bootstrap service
(async () => {
  const connection = await createConnections();
  startServer();

  logger.info(`${Config.NAME} started and running`);
  onExit(() => {
    closeConnections(connection)
      .then(() => process.exit(1))
      .catch((err) => {
        logger.error(`😭 Error closing connections => ${err}`);
        process.exit(1);
      });
    logger.info(`${Config.NAME} | Service is shutting down, closing connections...`);
  });
})();
