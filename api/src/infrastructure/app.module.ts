import { controllerProviders, controllers } from 'src/presentation';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { useCases } from '@plutus/application/use-case';
import { CurrencyModule } from '@modules/currency/currency.module';
import { PostgresModule } from '@modules/postgres/postgres.module';
import { repositoryProviders } from './repository';

@Module({
  imports: [PostgresModule, CurrencyModule, CqrsModule],
  controllers,
  providers: [...controllerProviders, ...repositoryProviders, ...useCases],
})
export class AppModule {}
