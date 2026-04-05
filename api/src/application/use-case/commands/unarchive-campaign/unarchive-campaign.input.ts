import { Command } from '@nestjs/cqrs';
import { UnarchiveCampaignOutput } from './unarchive-campaign.output';

type UnarchiveCampaignCommandInput = {
  id: number;
};

export class UnarchiveCampaignCommand extends Command<UnarchiveCampaignOutput> {
  readonly id: number;

  constructor(input: UnarchiveCampaignCommandInput) {
    super();
    this.id = input.id;
  }
}
