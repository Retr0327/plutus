import { Command } from '@nestjs/cqrs';
import { ArchiveCampaignOutput } from './archive-campaign.output';

type ArchiveCampaignCommandInput = {
  id: string;
};

export class ArchiveCampaignCommand extends Command<ArchiveCampaignOutput> {
  readonly id: string;

  constructor(input: ArchiveCampaignCommandInput) {
    super();
    this.id = input.id;
  }
}
