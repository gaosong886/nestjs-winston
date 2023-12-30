import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import {
  WinstonModuleAsyncOptions,
  WinstonModuleOptions,
  WinstonModuleOptionsFactory,
} from './winston.interfaces';
import { WinstonService } from './winston.service';
import { WINSTON_OPTIONS_PROVIDER } from './winston.constants';

@Module({})
export class WinstonModule {
  static forRoot(options: WinstonModuleOptions): DynamicModule {
    const providers = [
      {
        provide: WINSTON_OPTIONS_PROVIDER,
        useValue: options,
      },
      WinstonService,
    ];

    return {
      module: WinstonModule,
      providers: providers,
      exports: providers,
      global: options.isGlobal ? options.isGlobal : false,
    };
  }

  static forRootAsync(options: WinstonModuleAsyncOptions): DynamicModule {
    const providers = [
      WinstonModule.createAsyncOptionsProvider(options),
      WinstonService,
    ];

    if (options.useClass) {
      const useClass = options.useClass as Type<WinstonModuleOptionsFactory>;
      providers.push({ provide: useClass, useClass: useClass });
    }

    return {
      module: WinstonModule,
      imports: options.imports,
      providers: providers,
      exports: providers,
      global: options.isGlobal ? options.isGlobal : false,
    };
  }

  private static createAsyncOptionsProvider(
    options: WinstonModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: WINSTON_OPTIONS_PROVIDER,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<WinstonModuleOptionsFactory>,
    ];
    return {
      provide: WINSTON_OPTIONS_PROVIDER,
      useFactory: async (optionsFactory: WinstonModuleOptionsFactory) =>
        await optionsFactory.createWinstonModuleOptions(),
      inject,
    };
  }
}
