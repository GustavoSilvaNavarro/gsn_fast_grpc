type LOG_LEVELS = 'info' | 'trace' | 'debug' | 'warn' | 'error' | 'fatal';

type ENVIRONMENT = 'dev' | 'stg' | 'prd' | 'local' | 'test';

export const NAME = process.env.NAME ?? 'tree_server';
export const ENVIRONMENT: ENVIRONMENT = (process.env.ENVIRONMENT ?? process.env.NODE_ENV ?? 'dev') as ENVIRONMENT;

// ENTRY POINTS
export const PORT = process.env.PORT || 8080;
export const API_URL = process.env.API_URL || 'http://localhost:8080';

// Adapters
export const LOG_LEVEL: LOG_LEVELS = (process.env.LOG_LEVEL as LOG_LEVELS) || ENVIRONMENT === 'test' ? 'fatal' : 'info';
export const SEED_TABLE = process.env.SEED_TABLE === 'true';

// ! DB Config
export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_PORT = +(process.env.DB_PORT ?? 5433);
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;
