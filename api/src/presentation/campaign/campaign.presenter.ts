import { Injectable } from '@nestjs/common';
import {
  CampaignSummaryDto,
  PaginationMeta,
} from '@plutus/application/use-case/queries/get-campaign-summary/get-campaign-summary.output';
import { CampaignMapper } from '@plutus/infrastructure/mappers/campaign.mapper';
import { InvoiceMapper } from '@plutus/infrastructure/mappers/invoice.mapper';
import { Presenter } from '@common/domain/interfaces/presenter';
import { InvoiceStatus } from '@modules/postgres/enum';

export type GetOneCampaignPresenterInput = {
  readonly campaign: ReturnType<(typeof CampaignMapper)['toDto']>;
  readonly invoice: ReturnType<(typeof InvoiceMapper)['toDto']> | null;
};

export type GetOneCampaignPresenterOutput = {
  id: string;
  name: string;
  advertiser: string;
  startDate: number;
  endDate: number;
  archivedAt: number | null;
  lineItems: {
    id: string;
    name: string;
    bookedAmount: number;
    actualAmount: number;
  }[];
  invoices: {
    id: string;
    invoiceNumber: string;
    status: InvoiceStatus;
    totalBillableAmount: number;
  }[];
  totalBookedAmount: number;
  totalActualAmount: number;
};

@Injectable()
export class GetOneCampaignPresenter implements Presenter<
  GetOneCampaignPresenterInput,
  GetOneCampaignPresenterOutput
> {
  present(input: GetOneCampaignPresenterInput) {
    const { campaign, invoice } = input;

    const totalBookedAmount = campaign.lineItems.reduce(
      (sum, li) => sum + li.bookedAmount,
      0,
    );
    const totalActualAmount = campaign.lineItems.reduce(
      (sum, li) => sum + li.actualAmount,
      0,
    );

    const invoices = invoice
      ? [
          {
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            status: invoice.status,
            totalBillableAmount: invoice.totalAmount,
          },
        ]
      : [];

    return {
      id: campaign.id,
      name: campaign.name,
      advertiser: campaign.advertiser,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      archivedAt: campaign.archivedAt,
      lineItems: campaign.lineItems.map((item) => ({
        id: item.id,
        name: item.name,
        bookedAmount: item.bookedAmount,
        actualAmount: item.actualAmount,
      })),
      invoices,
      totalBookedAmount,
      totalActualAmount,
    };
  }
}

export type GetCampaignSummaryPresenterInput = {
  items: CampaignSummaryDto[];
  meta: PaginationMeta;
};

export type GetCampaignSummaryPresenterOutput =
  GetCampaignSummaryPresenterInput;

@Injectable()
export class GetCampaignSummaryPresenter implements Presenter<
  GetCampaignSummaryPresenterInput,
  GetCampaignSummaryPresenterOutput
> {
  present(input: GetCampaignSummaryPresenterInput) {
    return { items: input.items, meta: input.meta };
  }
}

export type ArchiveCampaignPresenterInput = {
  id: string;
  archivedAt: number | null;
};

export type ArchiveCampaignPresenterOutput = ArchiveCampaignPresenterInput;

@Injectable()
export class ArchiveCampaignPresenter implements Presenter<
  ArchiveCampaignPresenterInput,
  ArchiveCampaignPresenterOutput
> {
  present(input: ArchiveCampaignPresenterOutput) {
    return { id: input.id, archivedAt: input.archivedAt };
  }
}

export type UnarchiveCampaignPresenterInput = { id: string };

export type UnarchiveCampaignPresenterOutput = UnarchiveCampaignPresenterInput;

@Injectable()
export class UnarchiveCampaignPresenter implements Presenter<
  UnarchiveCampaignPresenterInput,
  UnarchiveCampaignPresenterOutput
> {
  present(input: UnarchiveCampaignPresenterOutput) {
    return { id: input.id, archivedAt: null };
  }
}
