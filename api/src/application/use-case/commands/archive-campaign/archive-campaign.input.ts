import { Command } from '@nestjs/cqrs';
import { ArchiveCampaignOutput } from './archive-campaign.output';

type ArchiveCampaignCommandInput = {
  id: number;
};

export class ArchiveCampaignCommand extends Command<ArchiveCampaignOutput> {
  readonly id: number;

  constructor(input: ArchiveCampaignCommandInput) {
    super();
    this.id = input.id;
  }
}
