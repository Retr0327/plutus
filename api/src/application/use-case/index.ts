import { ArchiveCampaignCommand } from './commands/archive-campaign/archive-campaign.input';
import { ArchiveCampaignUseCase } from './commands/archive-campaign/archive-campaign.use-case';

const useCases = [ArchiveCampaignUseCase];

export { useCases, ArchiveCampaignCommand, ArchiveCampaignUseCase };
