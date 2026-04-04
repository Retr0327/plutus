import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getEnv } from '@common/env';

const ENV = getEnv();

export const typeOrmModuleOptions: TypeOrmModuleOptions =
  ENV.nodeEnv !== 'test'
    ? {
        type: 'postgres',
        host: ENV.postgresHost,
        port: ENV.postgresPort,
        username: ENV.postgresUser,
        password: ENV.postgresPassword,
        database: ENV.postgresDb,
        synchronize: false,
        logging: false,
      }
    : {
        type: 'better-sqlite3',
        name: 'default',
        database: ':memory:',
        synchronize: true,
      };
