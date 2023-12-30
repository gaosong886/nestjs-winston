## nestjs-winston

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

[Winston](https://github.com/winstonjs/winston) logging module for [Nestjs](https://github.com/nestjs/nest).

## Installation

```bash
$ npm i --save @gaosong886/nestjs-winston winston 
```

## Quick start

Import the `WinstonModule`

```ts
import { Module } from '@nestjs/common';
import { format, transports } from 'winston';
import { WinstonModule, WinstonModuleOptions } from '@gaosong886/nestjs-winston';
import 'winston-daily-rotate-file'; // Expand winston.transports with adding 'DailyRotateFile'

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: async (): Promise<WinstonModuleOptions> => {
        const { combine, label, timestamp, printf } = format;

        // Create a transport to a rotating file
        // https://github.com/winstonjs/winston-daily-rotate-file
        const appTransport = new transports.DailyRotateFile({
          filename: 'logs/app-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        });

        const options: WinstonModuleOptions = {
          format: combine(
            label({ label: 'MyLabel' }),
            timestamp({ format: 'YYYY/MM/DD hh:mm:ss' }),
            printf(({ label, pid, timestamp, level, message, context }) => {
              return `[${label}] ${pid} - ${timestamp} ${level} [${context}] ${message}`;
            }),
          ),
          transports: [appTransport],
        };
        return options;
      },
    })
  ],
  ...
})
export class AppModule {}
```

Inject the `WinstonService` into your class

```ts
import { Injectable } from '@nestjs/common';
import { WinstonService } from 'src/common/winston/winston.service';

@Injectable()
export class MyService {
  constructor(private readonly winstonService: WinstonService) {
    this.winstonService.setContext(MyService.name);
  }

  doSomething() {
    this.winstonService.log('Hello');
    // [MyLabel] 7972 - 2023/11/25 04:28:57 info [MyService] Hello
  }
}

```
