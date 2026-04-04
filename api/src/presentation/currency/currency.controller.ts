import { Controller, Get } from '@nestjs/common';
import { CurrencyService } from '@modules/currency/currency.service';
import {
  GetRatesPresenter,
  GetSupportedCurrencyPresenter,
} from './currency.presenter';

@Controller('currency')
export class CurrencyController {
  constructor(
    private readonly currencyService: CurrencyService,
    private readonly getRatesPresenter: GetRatesPresenter,
    private readonly getSupportedCurrencyPresenter: GetSupportedCurrencyPresenter,
  ) {}

  @Get('rates')
  async getRates() {
    const result = await this.currencyService.getRates();
    return this.getRatesPresenter.present(result.value);
  }

  @Get('supported')
  async getSupportedCurrencies() {
    const result = await this.currencyService.getSupportedCurrencies();
    return this.getSupportedCurrencyPresenter.present(result.value);
  }
}
