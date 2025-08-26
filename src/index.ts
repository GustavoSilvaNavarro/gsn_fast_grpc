import { logger } from '@adapters';
import * as Config from '@config';
import { onExit } from 'signal-exit';

// Handle process errors
process.on('uncaughtException', (error) => {
  logger.error('uncaughtException', error);
  throw error;
});
process.on('unhandledRejection', (err) => logger.error('unhandledRejection', err));

// Bootstrap service
(async () => {
  logger.info(`${Config.NAME} started and running`);

  onExit(() => {
    logger.info(`${Config.NAME} | Service is shutting down, closing connections...`);
  });
})();
