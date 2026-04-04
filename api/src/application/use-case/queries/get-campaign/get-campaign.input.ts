import { Query } from '@nestjs/cqrs';
import { GetCampaignOutput } from './get-campaign.output';

type Input = {
  id: string;
};

export class GetCampaignQuery extends Query<GetCampaignOutput> {
  readonly id: string;

  constructor(input: Input) {
    super();
    this.id = input.id;
  }
}
