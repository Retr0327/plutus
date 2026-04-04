import { DataSource } from 'typeorm';
import { getEnv } from '@common/env';

const ENV = getEnv();

const dataSource = new DataSource({
  type: 'postgres',
  host: ENV.postgresHost,
  port: ENV.postgresPort,
  username: ENV.postgresUser,
  password: ENV.postgresPassword,
  database: ENV.postgresDb,
  entities: ['./libs/modules/postgres/entities/**/*.ts'],
  migrationsTableName: '_Migrations',
  migrations: ['./libs/modules/postgres/migrations/*.ts'],
});

export default dataSource;
