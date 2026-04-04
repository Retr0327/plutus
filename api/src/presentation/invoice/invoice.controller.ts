import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ArchiveInvoiceCommand,
  CreateAdjustmentCommand,
  DeleteAdjustmentCommand,
  GetAdjustmentHistoryQuery,
  GetAdjustmentQuery,
  GetCampaignQuery,
  GetInvoiceListQuery,
  GetInvoiceQuery,
  UnarchiveInvoiceCommand,
  UpdateAdjustmentCommand,
} from '@plutus/application/use-case';
import {
  CreateAdjustmentDto,
  DeleteAdjustmentQueryDto,
  InvoiceListQueryDto,
  UpdateAdjustmentDto,
} from './invoice.dto';
import {
  ArchiveInvoicePresenter,
  DeleteAdjustmentPresenter,
  GetAdjustmentHistoryPresenter,
  GetAdjustmentPresenter,
  GetInvoiceListPresenter,
  GetOneInvoicePresenter,
  UnarchiveInvoicePresenter,
} from './invoice.presenter';

@Controller('invoices')
export class InvoiceController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly getInvoiceListPresenter: GetInvoiceListPresenter,
    private readonly getOneInvoicePresenter: GetOneInvoicePresenter,
    private readonly archiveInvoicePresenter: ArchiveInvoicePresenter,
    private readonly unarchiveInvoicePresenter: UnarchiveInvoicePresenter,
    private readonly getAdjustmentPresenter: GetAdjustmentPresenter,
    private readonly deleteAdjustmentPresenter: DeleteAdjustmentPresenter,
    private readonly getAdjustmentHistoryPresenter: GetAdjustmentHistoryPresenter,
  ) {}

  @Get()
  async findAll(@Query() query: InvoiceListQueryDto) {
    const result = await this.queryBus.execute(
      new GetInvoiceListQuery({
        page: query.page,
        limit: query.limit,
        status: query.status,
        campaignId: query.campaignId,
        includeArchived: query.includeArchived,
      }),
    );
    if (result.isErr()) {
      throw new InternalServerErrorException();
    }
    return this.getInvoiceListPresenter.present(result.value);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const invoiceOrError = await this.queryBus.execute(
      new GetInvoiceQuery({ id }),
    );
    if (invoiceOrError.isErr()) {
      throw new InternalServerErrorException();
    }
    if (invoiceOrError.value === null) {
      throw new NotFoundException({ id });
    }

    const invoice = invoiceOrError.value;

    const campaignOrError = await this.queryBus.execute(
      new GetCampaignQuery({ id: invoice.campaignId }),
    );
    if (campaignOrError.isErr()) {
      throw campaignOrError.error;
    }
    if (campaignOrError.value === null) {
      throw new NotFoundException({ campaignId: invoice.campaignId });
    }
    return this.getOneInvoicePresenter.present({
      invoice,
      campaign: campaignOrError.value,
    });
  }

  @Patch(':id/archive')
  async archive(@Param('id') id: string) {
    const archiveOrError = await this.commandBus.execute(
      new ArchiveInvoiceCommand({ id }),
    );
    if (archiveOrError.isErr()) {
      throw archiveOrError.error;
    }
    const invoiceOrError = await this.queryBus.execute(
      new GetInvoiceQuery({ id: archiveOrError.value.id }),
    );
    if (invoiceOrError.isErr()) {
      throw new InternalServerErrorException();
    }
    if (invoiceOrError.value === null) {
      throw new NotFoundException({ id });
    }
    return this.archiveInvoicePresenter.present({
      id: invoiceOrError.value.id,
      archivedAt: invoiceOrError.value.archivedAt,
    });
  }

  @Patch(':id/unarchive')
  async unarchive(@Param('id') id: string) {
    const unarchiveOrError = await this.commandBus.execute(
      new UnarchiveInvoiceCommand({ id }),
    );
    if (unarchiveOrError.isErr()) {
      throw unarchiveOrError.error;
    }
    return this.unarchiveInvoicePresenter.present({
      id: unarchiveOrError.value.id,
    });
  }

  @Post(':invoiceId/line-items/:lineItemId/adjustments')
  @HttpCode(HttpStatus.CREATED)
  async createAdjustment(
    @Param('invoiceId') invoiceId: string,
    @Param('lineItemId') lineItemId: string,
    @Body() body: CreateAdjustmentDto,
  ) {
    const result = await this.commandBus.execute(
      new CreateAdjustmentCommand({
        invoiceId,
        lineItemId,
        amount: body.amount,
        reason: body.reason,
        createdBy: body.createdBy,
      }),
    );
    if (result.isErr()) {
      throw result.error;
    }
    const adjustmentOrError = await this.queryBus.execute(
      new GetAdjustmentQuery({
        invoiceId,
        lineItemId,
        adjustmentId: result.value.id,
      }),
    );
    if (adjustmentOrError.isErr()) {
      throw new InternalServerErrorException();
    }
    if (adjustmentOrError.value === null) {
      throw new NotFoundException({ id: result.value.id });
    }
    return this.getAdjustmentPresenter.present({
      adjustment: adjustmentOrError.value,
    });
  }

  @Patch(':invoiceId/line-items/:lineItemId/adjustments/:adjustmentId')
  async updateAdjustment(
    @Param('invoiceId') invoiceId: string,
    @Param('lineItemId') lineItemId: string,
    @Param('adjustmentId') adjustmentId: string,
    @Body() body: UpdateAdjustmentDto,
  ) {
    const result = await this.commandBus.execute(
      new UpdateAdjustmentCommand({
        invoiceId,
        lineItemId,
        adjustmentId,
        amount: body.amount,
        reason: body.reason,
        updatedBy: body.updatedBy,
      }),
    );
    if (result.isErr()) {
      throw result.error;
    }
    const adjustmentOrError = await this.queryBus.execute(
      new GetAdjustmentQuery({
        invoiceId,
        lineItemId,
        adjustmentId: result.value.id,
      }),
    );
    if (adjustmentOrError.isErr()) {
      throw new InternalServerErrorException();
    }
    if (adjustmentOrError.value === null) {
      throw new NotFoundException({ id: result.value.id });
    }
    return this.getAdjustmentPresenter.present({
      adjustment: adjustmentOrError.value,
    });
  }

  @Delete(':invoiceId/line-items/:lineItemId/adjustments/:adjustmentId')
  async remove(
    @Param('invoiceId') invoiceId: string,
    @Param('lineItemId') lineItemId: string,
    @Param('adjustmentId') adjustmentId: string,
    @Query() query: DeleteAdjustmentQueryDto,
  ) {
    if (!query.deletedBy) {
      throw new BadRequestException('deletedBy query parameter is required');
    }
    const result = await this.commandBus.execute(
      new DeleteAdjustmentCommand({
        invoiceId,
        lineItemId,
        adjustmentId,
        deletedBy: query.deletedBy,
      }),
    );
    if (result.isErr()) {
      throw result.error;
    }
    return this.deleteAdjustmentPresenter.present({
      id: result.value.id,
    });
  }

  @Get(':invoiceId/line-items/:lineItemId/adjustments/:adjustmentId/history')
  async getAdjustmentHistory(
    @Param('invoiceId') invoiceId: string,
    @Param('lineItemId') lineItemId: string,
    @Param('adjustmentId') adjustmentId: string,
  ) {
    const result = await this.queryBus.execute(
      new GetAdjustmentHistoryQuery({
        invoiceId,
        lineItemId,
        adjustmentId,
      }),
    );
    if (result.isErr()) {
      throw result.error;
    }
    return this.getAdjustmentHistoryPresenter.present({
      items: result.value.items,
    });
  }
}
