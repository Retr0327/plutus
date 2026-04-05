import { readFileSync } from 'fs';
import { join } from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';

interface SeedRow {
  readonly id: number;
  readonly campaign_id: number;
  readonly campaign_name: string;
  readonly line_item_name: string;
  readonly booked_amount: number;
  readonly actual_amount: number;
  readonly adjustments: number;
}

interface CampaignSeed {
  readonly id: number;
  readonly name: string;
  readonly advertiser: string;
  readonly startDate: number;
  readonly endDate: number;
}

interface InvoiceSeed {
  readonly id: number;
  readonly invoiceNumber: string;
  readonly campaignId: number;
}

interface CampaignLineItemSeed {
  readonly id: number;
  readonly campaignId: number;
  readonly name: string;
  readonly bookedAmount: number;
  readonly actualAmount: number;
}

interface InvoiceLineItemSeed {
  readonly id: number;
  readonly invoiceId: number;
  readonly campaignLineItemId: number;
  readonly actualAmount: number;
}

interface AdjustmentSeed {
  readonly id: number;
  readonly invoiceLineItemId: number;
  readonly amount: number;
}

function extractAdvertiser(campaignName: string): string {
  const colonIdx = campaignName.indexOf(':');
  return colonIdx > 0
    ? campaignName.substring(0, colonIdx).trim()
    : campaignName;
}

// Synthetic date ranges — multiple campaigns intentionally share the same month window
function generateDateRange(campaignId: number): {
  startDate: number;
  endDate: number;
} {
  const baseYear = 2025;
  const monthOffset = campaignId % 12;
  const start = new Date(baseYear, monthOffset, 1);
  const end = new Date(baseYear, monthOffset + 1, 0);
  return { startDate: start.getTime(), endDate: end.getTime() };
}

function escapeStr(val: string): string {
  return val.replace(/'/g, "''");
}

function round2(val: number): string {
  return val.toFixed(2);
}

function validateRow(row: unknown, index: number): SeedRow {
  const r = row as Record<string, unknown>;
  if (
    typeof r.id !== 'number' ||
    typeof r.campaign_id !== 'number' ||
    typeof r.campaign_name !== 'string' ||
    typeof r.line_item_name !== 'string' ||
    typeof r.booked_amount !== 'number' ||
    typeof r.actual_amount !== 'number' ||
    typeof r.adjustments !== 'number' ||
    !Number.isFinite(r.booked_amount) ||
    !Number.isFinite(r.actual_amount) ||
    !Number.isFinite(r.adjustments)
  ) {
    throw new Error(`Invalid seed row at index ${index}: ${JSON.stringify(r)}`);
  }
  return r as unknown as SeedRow;
}

const BATCH_SIZE = 500;

async function insertBatched(
  queryRunner: QueryRunner,
  table: string,
  columns: readonly string[],
  rows: readonly (readonly string[])[],
): Promise<void> {
  const colList = columns.map((c) => `"${c}"`).join(', ');

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const values = batch
      .map((row) => `(${row.join(', ')})`)
      .join(',\n        ');
    await queryRunner.query(
      `INSERT INTO "${table}" (${colList}) VALUES\n        ${values}`,
    );
  }
}

async function resetSequence(
  queryRunner: QueryRunner,
  table: string,
): Promise<void> {
  await queryRunner.query(
    `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), COALESCE((SELECT MAX("id") FROM "${table}"), 0))`,
  );
}

export class Seeder1711720000001 implements MigrationInterface {
  name = 'Seeder1711720000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const seedPath = join(__dirname, 'seeder', 'seeder.json');
    const parsed: unknown[] = JSON.parse(readFileSync(seedPath, 'utf-8'));
    const rawData = parsed.map((row, i) => validateRow(row, i));

    const now = Date.now();

    // --- Group by campaign_id ---
    const campaignMap = new Map<number, { name: string; rows: SeedRow[] }>();
    for (const row of rawData) {
      if (!campaignMap.has(row.campaign_id)) {
        campaignMap.set(row.campaign_id, {
          name: row.campaign_name,
          rows: [],
        });
      }
      campaignMap.get(row.campaign_id)!.rows.push(row);
    }

    // --- Build all seed records with numeric IDs ---
    const campaigns: CampaignSeed[] = [];
    const invoices: InvoiceSeed[] = [];
    const campaignLineItems: CampaignLineItemSeed[] = [];
    const invoiceLineItems: InvoiceLineItemSeed[] = [];
    const adjustments: AdjustmentSeed[] = [];

    let invoiceIdSeq = 0;
    let cliIdSeq = 0;
    let iliIdSeq = 0;
    let adjIdSeq = 0;

    for (const [numericCampaignId, { name, rows }] of campaignMap) {
      const campaignId = numericCampaignId;
      const invoiceId = ++invoiceIdSeq;
      const { startDate, endDate } = generateDateRange(numericCampaignId);

      campaigns.push({
        id: campaignId,
        name,
        advertiser: extractAdvertiser(name),
        startDate,
        endDate,
      });

      invoices.push({
        id: invoiceId,
        invoiceNumber: `INV-${String(numericCampaignId).padStart(4, '0')}`,
        campaignId,
      });

      for (const row of rows) {
        const cliId = ++cliIdSeq;
        const iliId = ++iliIdSeq;

        campaignLineItems.push({
          id: cliId,
          campaignId,
          name: row.line_item_name,
          bookedAmount: row.booked_amount,
          actualAmount: row.actual_amount,
        });

        invoiceLineItems.push({
          id: iliId,
          invoiceId,
          campaignLineItemId: cliId,
          actualAmount: row.actual_amount,
        });

        if (row.adjustments !== 0.0) {
          adjustments.push({
            id: ++adjIdSeq,
            invoiceLineItemId: iliId,
            amount: row.adjustments,
          });
        }
      }
    }

    // --- Insert campaigns ---
    await insertBatched(
      queryRunner,
      'campaigns',
      [
        'id',
        'name',
        'advertiser',
        'start_date',
        'end_date',
        'created_at',
        'updated_at',
      ],
      campaigns.map((c) => [
        `${c.id}`,
        `'${escapeStr(c.name)}'`,
        `'${escapeStr(c.advertiser)}'`,
        `${c.startDate}`,
        `${c.endDate}`,
        `${now}`,
        `${now}`,
      ]),
    );

    // --- Insert invoices ---
    await insertBatched(
      queryRunner,
      'invoices',
      [
        'id',
        'invoice_number',
        'status',
        'campaign_id',
        'created_at',
        'updated_at',
      ],
      invoices.map((inv) => [
        `${inv.id}`,
        `'${inv.invoiceNumber}'`,
        `'draft'`,
        `${inv.campaignId}`,
        `${now}`,
        `${now}`,
      ]),
    );

    // --- Insert campaign line items ---
    await insertBatched(
      queryRunner,
      'campaign_line_items',
      [
        'id',
        'name',
        'booked_amount',
        'actual_amount',
        'campaign_id',
        'created_at',
        'updated_at',
      ],
      campaignLineItems.map((cli) => [
        `${cli.id}`,
        `'${escapeStr(cli.name)}'`,
        `${round2(cli.bookedAmount)}`,
        `${round2(cli.actualAmount)}`,
        `${cli.campaignId}`,
        `${now}`,
        `${now}`,
      ]),
    );

    // --- Insert invoice line items ---
    await insertBatched(
      queryRunner,
      'invoice_line_items',
      [
        'id',
        'actual_amount',
        'invoice_id',
        'campaign_line_item_id',
        'created_at',
        'updated_at',
      ],
      invoiceLineItems.map((ili) => [
        `${ili.id}`,
        `${round2(ili.actualAmount)}`,
        `${ili.invoiceId}`,
        `${ili.campaignLineItemId}`,
        `${now}`,
        `${now}`,
      ]),
    );

    // --- Insert adjustments ---
    await insertBatched(
      queryRunner,
      'adjustments',
      [
        'id',
        'amount',
        'reason',
        'created_by',
        'invoice_line_item_id',
        'created_at',
        'updated_at',
      ],
      adjustments.map((adj) => [
        `${adj.id}`,
        `${round2(adj.amount)}`,
        `'Billing adjustment'`,
        `'system@plutus.io'`,
        `${adj.invoiceLineItemId}`,
        `${now}`,
        `${now}`,
      ]),
    );

    // --- Reset sequences to match inserted data ---
    await resetSequence(queryRunner, 'campaigns');
    await resetSequence(queryRunner, 'invoices');
    await resetSequence(queryRunner, 'campaign_line_items');
    await resetSequence(queryRunner, 'invoice_line_items');
    await resetSequence(queryRunner, 'adjustments');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE "adjustments" CASCADE`);
    await queryRunner.query(`TRUNCATE "invoice_line_items" CASCADE`);
    await queryRunner.query(`TRUNCATE "campaign_line_items" CASCADE`);
    await queryRunner.query(`TRUNCATE "invoices" CASCADE`);
    await queryRunner.query(`TRUNCATE "campaigns" CASCADE`);
  }
}
