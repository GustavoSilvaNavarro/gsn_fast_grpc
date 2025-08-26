import * as Config from '@config';

import { BunyanLogger } from './logger';

export const logger = new BunyanLogger(Config.NAME);
