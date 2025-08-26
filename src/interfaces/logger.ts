export type Message = string | Error | unknown;

export type OtherLogParams = unknown[];

export interface Logger {
  debug(message: Message, ...payload: OtherLogParams): void;
  error(message: Message, ...payload: OtherLogParams): void;
  fatal(message: Message, ...payload: OtherLogParams): void;
  info(message: Message, ...payload: OtherLogParams): void;
  trace(message: Message, ...payload: OtherLogParams): void;
  warn(message: Message, ...payload: OtherLogParams): void;
}
