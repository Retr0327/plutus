import { Query } from '@nestjs/cqrs';
import { GetCampaignOutput } from './get-campaign.output';

type Input = {
  id: number;
};

export class GetCampaignQuery extends Query<GetCampaignOutput> {
  readonly id: number;

  constructor(input: Input) {
    super();
    this.id = input.id;
  }
}
