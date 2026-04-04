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
import { InvoiceController } from './invoice/invoice.controller';
import {
  ArchiveInvoicePresenter,
  DeleteAdjustmentPresenter,
  GetAdjustmentHistoryPresenter,
  GetAdjustmentPresenter,
  GetInvoiceListPresenter,
  GetOneInvoicePresenter,
  UnarchiveInvoicePresenter,
} from './invoice/invoice.presenter';

const controllers = [
  CurrencyController,
  CampaignController,
  InvoiceController,
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
  GetInvoiceListPresenter,
  GetOneInvoicePresenter,
  ArchiveInvoicePresenter,
  UnarchiveInvoicePresenter,
  GetAdjustmentPresenter,
  DeleteAdjustmentPresenter,
  GetAdjustmentHistoryPresenter,
];

export { controllers, controllerProviders };
