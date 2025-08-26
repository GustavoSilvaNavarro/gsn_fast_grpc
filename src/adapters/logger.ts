import * as Config from '@config';
import { Logger, Message, OtherLogParams } from '@interfaces';
import bunyan, { LogLevel } from 'bunyan';

export class BunyanLogger implements Logger {
  logger: bunyan;

  constructor(
    name: string = process.env.NAME || '',
    level: LogLevel = (Config.LOG_LEVEL || 'info') as LogLevel,
    stream = process.stdout,
  ) {
    this.logger = bunyan.createLogger({ name, level, stream });
  }

  debug(message: Message, ...payload: OtherLogParams): void {
    return this.logger.debug(message, ...payload);
  }

  error(message: Message, ...payload: OtherLogParams): void {
    return this.logger.error(message, ...payload);
  }

  fatal(message: Message, ...payload: OtherLogParams): void {
    return this.logger.fatal(message, ...payload);
  }

  info(message: Message, ...payload: OtherLogParams): void {
    return this.logger.info(message, ...payload);
  }

  trace(message: Message, ...payload: OtherLogParams): void {
    return this.logger.trace(message, ...payload);
  }

  warn(message: Message, ...payload: OtherLogParams): void {
    return this.logger.warn(message, ...payload);
  }
}
