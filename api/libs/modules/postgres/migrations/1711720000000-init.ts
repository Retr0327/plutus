import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1711720000000 implements MigrationInterface {
  name = 'Init1711720000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "campaigns" (
        "id" SERIAL NOT NULL,
        "name" varchar(255) NOT NULL,
        "advertiser" varchar(255) NOT NULL,
        "start_date" bigint NOT NULL,
        "end_date" bigint NOT NULL,
        "updated_at" bigint NOT NULL,
        "archived_at" bigint DEFAULT NULL,
        "created_at" bigint NOT NULL,
        CONSTRAINT "PK_campaigns" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "invoices" (
        "id" SERIAL NOT NULL,
        "invoice_number" varchar(50) NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'draft',
        "campaign_id" integer NOT NULL,
        "updated_at" bigint NOT NULL,
        "archived_at" bigint DEFAULT NULL,
        "created_at" bigint NOT NULL,
        CONSTRAINT "PK_invoices" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_invoices_invoice_number" UNIQUE ("invoice_number"),
        CONSTRAINT "FK_invoices_campaign" FOREIGN KEY ("campaign_id")
          REFERENCES "campaigns" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "campaign_line_items" (
        "id" SERIAL NOT NULL,
        "name" varchar(255) NOT NULL,
        "booked_amount" decimal(12,2) NOT NULL,
        "actual_amount" decimal(12,2) NOT NULL,
        "campaign_id" integer NOT NULL,
        "updated_at" bigint NOT NULL,
        "created_at" bigint NOT NULL,
        CONSTRAINT "PK_campaign_line_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_campaign_line_items_campaign" FOREIGN KEY ("campaign_id")
          REFERENCES "campaigns" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "invoice_line_items" (
        "id" SERIAL NOT NULL,
        "actual_amount" decimal(12,2) NOT NULL,
        "invoice_id" integer NOT NULL,
        "campaign_line_item_id" integer NOT NULL,
        "updated_at" bigint NOT NULL,
        "created_at" bigint NOT NULL,
        CONSTRAINT "PK_invoice_line_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_invoice_line_items_invoice" FOREIGN KEY ("invoice_id")
          REFERENCES "invoices" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_invoice_line_items_campaign_line_item" FOREIGN KEY ("campaign_line_item_id")
          REFERENCES "campaign_line_items" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `ALTER TABLE "invoice_line_items" ADD CONSTRAINT "UQ_invoice_line_items_invoice_campaign_line" UNIQUE ("invoice_id", "campaign_line_item_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "adjustments" (
        "id" SERIAL NOT NULL,
        "amount" decimal(12,2) NOT NULL,
        "reason" varchar(500) NOT NULL,
        "created_by" varchar(255) NOT NULL,
        "invoice_line_item_id" integer NOT NULL,
        "updated_at" bigint NOT NULL,
        "created_at" bigint NOT NULL,
        CONSTRAINT "PK_adjustments" PRIMARY KEY ("id"),
        CONSTRAINT "FK_adjustments_invoice_line_item" FOREIGN KEY ("invoice_line_item_id")
          REFERENCES "invoice_line_items" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" SERIAL NOT NULL,
        "entity_type" varchar(50) NOT NULL,
        "entity_id" varchar(50) NOT NULL,
        "old_value" jsonb,
        "new_value" jsonb,
        "changed_by" varchar(255) NOT NULL DEFAULT 'system',
        "action" varchar(20) NOT NULL DEFAULT 'update',
        "created_at" bigint NOT NULL,
        CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_audit_logs_entity" ON "audit_logs" ("entity_type", "entity_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(`DROP TABLE "adjustments"`);
    await queryRunner.query(`DROP TABLE "invoice_line_items"`);
    await queryRunner.query(`DROP TABLE "campaign_line_items"`);
    await queryRunner.query(`DROP TABLE "invoices"`);
    await queryRunner.query(`DROP TABLE "campaigns"`);
  }
}
