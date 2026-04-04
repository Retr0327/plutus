import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from './config';
import { entities } from './entities';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({ ...typeOrmModuleOptions, entities }),
    TypeOrmModule.forFeature(entities),
  ],
  exports: [TypeOrmModule],
})
export class PostgresModule {}
