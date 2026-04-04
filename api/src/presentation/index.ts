import { AuditLogController } from './audit-log/audit-log.controller';
import { GetAuditLogsPresenter } from './audit-log/audit-log.presenter';
import { CampaignController } from './campaign/campaign.controller';
import {
  ArchiveCampaignPresenter,
  GetCampaignSummaryPresenter,
  GetOneCampaignPresenter,
  UnarchiveCampaignPresenter,
} from './campaign/campaign.presenter';
import { CurrencyController } from './currency/currency.controller';
import {
  GetRatesPresenter,
  GetSupportedCurrencyPresenter,
} from './currency/currency.presenter';

const controllers = [
  CurrencyController,
  CampaignController,
  AuditLogController,
];

const controllerProviders = [
  ArchiveCampaignPresenter,
  UnarchiveCampaignPresenter,
  GetAuditLogsPresenter,
  GetRatesPresenter,
  GetSupportedCurrencyPresenter,
  GetOneCampaignPresenter,
  GetCampaignSummaryPresenter,
];

export { controllers, controllerProviders };
