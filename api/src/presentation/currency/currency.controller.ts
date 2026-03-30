import { CurrencyService } from '@modules/currency/currency.service';
import { Controller, Get } from '@nestjs/common';
import {
  GetRatesPresenter,
  GetSupportedCurrencyPresenter,
} from './currency.presenter';

@Controller('currency')
export class CurrencyController {
  constructor(
    private readonly currencyService: CurrencyService,
    private readonly ratesPresenter: GetRatesPresenter,
    private readonly supportedCurrencyPresenter: GetSupportedCurrencyPresenter,
  ) {}

  @Get('rates')
  async getRates() {
    const result = await this.currencyService.getRates();
    return this.ratesPresenter.present(result.value);
  }

  @Get('supported')
  async getSupportedCurrencies() {
    const result = await this.currencyService.getSupportedCurrencies();
    return this.supportedCurrencyPresenter.present(result.value);
  }
}
