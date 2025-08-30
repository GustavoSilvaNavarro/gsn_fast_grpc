import { logger } from '@adapters';
import { PORT } from '@config';
import { Server, ServerCredentials } from '@grpc/grpc-js';

export const startServer = () => {
  const server = new Server();

  // Bind the server to a specific address and port.
  server.bindAsync(`0.0.0.0:${PORT}`, ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      logger.error('🔥 Error starting the server', err);
      throw err;
    }
    logger.info(`👻 gRPC server running on port ${port}`);
  });
};
