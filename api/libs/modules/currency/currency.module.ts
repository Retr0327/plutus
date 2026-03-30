import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Global()
@Module({
  imports: [HttpModule.register({ timeout: 5000 })],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
