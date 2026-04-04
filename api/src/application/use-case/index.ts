import { ArchiveCampaignCommand } from './commands/archive-campaign/archive-campaign.input';
import { ArchiveCampaignUseCase } from './commands/archive-campaign/archive-campaign.use-case';
import { ArchiveInvoiceCommand } from './commands/archive-invoice/archive-invoice.input';
import { ArchiveInvoiceUseCase } from './commands/archive-invoice/archive-invoice.use-case';
import { CreateAdjustmentCommand } from './commands/create-adjustment/create-adjustment.input';
import { CreateAdjustmentUseCase } from './commands/create-adjustment/create-adjustment.use-case';

const useCases = [
  CreateAdjustmentUseCase,
  ArchiveCampaignUseCase,
  ArchiveInvoiceUseCase,
];

export {
  useCases,
  CreateAdjustmentCommand,
  CreateAdjustmentUseCase,
  ArchiveCampaignCommand,
  ArchiveCampaignUseCase,
  ArchiveInvoiceCommand,
  ArchiveInvoiceUseCase,
};
