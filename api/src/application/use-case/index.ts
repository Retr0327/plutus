import { ArchiveCampaignCommand } from './commands/archive-campaign/archive-campaign.input';
import { ArchiveCampaignUseCase } from './commands/archive-campaign/archive-campaign.use-case';
import { ArchiveInvoiceCommand } from './commands/archive-invoice/archive-invoice.input';
import { ArchiveInvoiceUseCase } from './commands/archive-invoice/archive-invoice.use-case';
import { CreateAdjustmentCommand } from './commands/create-adjustment/create-adjustment.input';
import { CreateAdjustmentUseCase } from './commands/create-adjustment/create-adjustment.use-case';
import { DeleteAdjustmentCommand } from './commands/delete-adjustment/delete-adjustment.input';
import { DeleteAdjustmentUseCase } from './commands/delete-adjustment/delete-adjustment.use-case';
import { UnarchiveCampaignCommand } from './commands/unarchive-campaign/unarchive-campaign.input';
import { UnarchiveCampaignUseCase } from './commands/unarchive-campaign/unarchive-campaign.use-case';
import { UnarchiveInvoiceCommand } from './commands/unarchive-invoice/unarchive-invoice.input';
import { UnarchiveInvoiceUseCase } from './commands/unarchive-invoice/unarchive-invoice.use-case';
import { UpdateAdjustmentCommand } from './commands/update-adjustment/update-adjustment.input';
import { UpdateAdjustmentUseCase } from './commands/update-adjustment/update-adjustment.use-case';
import { GetAdjustmentHistoryQuery } from './queries/get-adjustment-history/get-adjustment-history.input';
import { GetAdjustmentHistoryUseCase } from './queries/get-adjustment-history/get-adjustment-history.use-case';

const useCases = [
  GetAdjustmentHistoryUseCase,
  CreateAdjustmentUseCase,
  UpdateAdjustmentUseCase,
  DeleteAdjustmentUseCase,
  ArchiveCampaignUseCase,
  UnarchiveCampaignUseCase,
  ArchiveInvoiceUseCase,
  UnarchiveInvoiceUseCase,
];

export {
  useCases,
  GetAdjustmentHistoryQuery,
  GetAdjustmentHistoryUseCase,
  CreateAdjustmentCommand,
  CreateAdjustmentUseCase,
  UpdateAdjustmentCommand,
  UpdateAdjustmentUseCase,
  DeleteAdjustmentCommand,
  DeleteAdjustmentUseCase,
  ArchiveCampaignCommand,
  ArchiveCampaignUseCase,
  UnarchiveCampaignCommand,
  UnarchiveCampaignUseCase,
  ArchiveInvoiceCommand,
  ArchiveInvoiceUseCase,
  UnarchiveInvoiceCommand,
  UnarchiveInvoiceUseCase,
};
