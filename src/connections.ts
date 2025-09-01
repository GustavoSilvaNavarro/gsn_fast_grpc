import { logger } from '@adapters';
import { connectDb } from '@adapters/db';
import type { PrismaClient } from '@prisma/client';

type Connections = {
  db: PrismaClient;
};

export const createConnections = async (): Promise<Connections> => {
  const db = await connectDb();

  return { db };
};

export const closeConnections = async ({ db }: Connections) => {
  logger.warn('😩 Closing connections');
  await db.$disconnect();
};
