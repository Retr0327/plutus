import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ArchiveCampaignCommand,
  GetCampaignQuery,
  GetCampaignSummaryQuery,
  GetInvoiceQuery,
  UnarchiveCampaignCommand,
} from '@plutus/application/use-case';
import { CampaignListQueryDto } from './campaign.dto';
import {
  ArchiveCampaignPresenter,
  GetCampaignSummaryPresenter,
  GetOneCampaignPresenter,
  UnarchiveCampaignPresenter,
} from './campaign.presenter';

@Controller('campaigns')
export class CampaignController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly archiveCampaignPresenter: ArchiveCampaignPresenter,
    private readonly getCampaignSummaryPresenter: GetCampaignSummaryPresenter,
    private readonly getOneCampaignPresenter: GetOneCampaignPresenter,
    private readonly unarchiveCampaignPresenter: UnarchiveCampaignPresenter,
  ) {}

  @Get()
  async findAll(@Query() query: CampaignListQueryDto) {
    const campaignSummaryOrError = await this.queryBus.execute(
      new GetCampaignSummaryQuery({
        page: query.page,
        limit: query.limit,
        search: query.search,
        advertiser: query.advertiser,
        includeArchived: query.includeArchived,
      }),
    );
    if (campaignSummaryOrError.isErr()) {
      throw new InternalServerErrorException();
    }
    return this.getCampaignSummaryPresenter.present(
      campaignSummaryOrError.value,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const campaignOrError = await this.queryBus.execute(
      new GetCampaignQuery({ id }),
    );
    if (campaignOrError.isErr()) {
      throw new InternalServerErrorException();
    }
    if (campaignOrError.value === null) {
      throw new NotFoundException({ id });
    }
    const invoiceOrError = await this.queryBus.execute(
      new GetInvoiceQuery({ campaignId: id }),
    );
    return this.getOneCampaignPresenter.present({
      campaign: campaignOrError.value,
      invoice: invoiceOrError.isOk() ? invoiceOrError.value : null,
    });
  }

  @Patch(':id/archive')
  async archive(@Param('id') id: string) {
    const archiveOrError = await this.commandBus.execute(
      new ArchiveCampaignCommand({ id }),
    );
    if (archiveOrError.isErr()) {
      throw archiveOrError.error;
    }
    const campaignOrError = await this.queryBus.execute(
      new GetCampaignQuery({ id: archiveOrError.value.id }),
    );
    if (campaignOrError.isErr()) {
      throw new InternalServerErrorException();
    }
    if (campaignOrError.value === null) {
      throw new NotFoundException({ id });
    }
    return this.archiveCampaignPresenter.present({
      id: campaignOrError.value.id,
      archivedAt: campaignOrError.value.archivedAt,
    });
  }

  @Patch(':id/unarchive')
  async unarchive(@Param('id') id: string) {
    const unarchiveOrError = await this.commandBus.execute(
      new UnarchiveCampaignCommand({ id }),
    );
    if (unarchiveOrError.isErr()) {
      throw unarchiveOrError.error;
    }
    return this.unarchiveCampaignPresenter.present({
      id: unarchiveOrError.value.id,
    });
  }
}
