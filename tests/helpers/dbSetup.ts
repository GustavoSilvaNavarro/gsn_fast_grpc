import { connectDb } from '@adapters/db';
import { Node } from '@adapters/db/models';
import { seeData } from '@mocks';
import type { Sequelize } from 'sequelize-typescript';

export let sequelizeTestConnection: Sequelize;

export const connectTestDb = async () => {
  sequelizeTestConnection = await connectDb();
};

export const clearAllTables = async () => {
  await Node.truncate({ restartIdentity: true, cascade: true, force: true });
};

export const seedDbForTests = async () => {
  await Node.bulkCreate(seeData);
};
