import { AuditLogController } from './audit-log/audit-log.controller';
import { GetAuditLogsPresenter } from './audit-log/audit-log.presenter';
import { CurrencyController } from './currency/currency.controller';
import {
  GetRatesPresenter,
  GetSupportedCurrencyPresenter,
} from './currency/currency.presenter';

const controllers = [CurrencyController, AuditLogController];

const controllerProviders = [
  GetAuditLogsPresenter,
  GetRatesPresenter,
  GetSupportedCurrencyPresenter,
];

export { controllers, controllerProviders };
