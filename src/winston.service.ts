import { Inject, Injectable, LoggerService, Scope } from '@nestjs/common';
import { Logger, LoggerOptions, createLogger } from 'winston';
import { WINSTON_OPTIONS_PROVIDER } from './winston.constants';

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonService implements LoggerService {
  private context?: string;
  private logger: Logger;

  constructor(@Inject(WINSTON_OPTIONS_PROVIDER) options: LoggerOptions) {
    this.logger = createLogger(options);
  }

  setContext(context: string): void {
    this.context = context;
  }

  log(message: string): Logger {
    return this.logger.info(this.combine(message));
  }

  error(message: string): Logger {
    return this.logger.error(this.combine(message));
  }

  warn(message: string): Logger {
    return this.logger.warn(this.combine(message));
  }

  debug(message: string): Logger {
    return this.logger.debug(this.combine(message));
  }

  verbose(message: string): Logger {
    return this.logger.verbose(this.combine(message));
  }

  private combine(message: string): any {
    return {
      pid: process.pid,
      context: this.context,
      message,
    };
  }
}
