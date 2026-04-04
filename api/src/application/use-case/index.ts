import { ArchiveCampaignCommand } from './commands/archive-campaign/archive-campaign.input';
import { ArchiveCampaignUseCase } from './commands/archive-campaign/archive-campaign.use-case';
import { ArchiveInvoiceCommand } from './commands/archive-invoice/archive-invoice.input';
import { ArchiveInvoiceUseCase } from './commands/archive-invoice/archive-invoice.use-case';

const useCases = [ArchiveCampaignUseCase, ArchiveInvoiceUseCase];

export {
  useCases,
  ArchiveCampaignCommand,
  ArchiveCampaignUseCase,
  ArchiveInvoiceCommand,
  ArchiveInvoiceUseCase,
};
