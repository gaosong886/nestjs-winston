import { ModuleMetadata, Type } from '@nestjs/common';
import { LoggerOptions } from 'winston';

export interface WinstonModuleOptions extends LoggerOptions {
  isGlobal?: boolean;
}

export interface WinstonModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  useExisting?: Type<WinstonModuleOptionsFactory>;
  useClass?: Type<WinstonModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<WinstonModuleOptions> | WinstonModuleOptions;
  inject?: any[];
}

export interface WinstonModuleOptionsFactory {
  createWinstonModuleOptions():
    | Promise<WinstonModuleOptions>
    | WinstonModuleOptions;
}
