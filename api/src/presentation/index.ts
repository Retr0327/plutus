import { CurrencyController } from './currency/currency.controller';
import {
  GetRatesPresenter,
  GetSupportedCurrencyPresenter,
} from './currency/currency.presenter';

const controllers = [CurrencyController];

const controllerProviders = [GetRatesPresenter, GetSupportedCurrencyPresenter];

export { controllers, controllerProviders };
