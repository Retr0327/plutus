import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seeder1711720000001 implements MigrationInterface {
  name = 'Seeder1711720000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "campaigns" ("id", "name", "advertiser", "start_date", "end_date", "created_at", "updated_at")
      VALUES
        ('dncnkn18pqamrqx43689pckc', 'Summer Brand Awareness', 'Nike', 1780300800000, 1788220800000, 1711720000000, 1711720000000),
        ('e93gwh0zat8pfu25u8tp0izc', 'Holiday Retargeting', 'Target', 1793548800000, 1798732800000, 1711720000000, 1711720000000),
        ('sdi6ncsk3lxwvvddsjkt34t8', 'Q1 Product Launch', 'Samsung', 1798819200000, 1806508800000, 1711720000000, 1711720000000)
    `);

    await queryRunner.query(`
      INSERT INTO "campaign_line_items" ("id", "name", "booked_amount", "actual_amount", "campaign_id", "created_at", "updated_at")
      VALUES
        ('drmahwrh2rqjq3dbrh06m21q', 'Display Ads - Premium Placements', 50000.00, 48750.00, 'dncnkn18pqamrqx43689pckc', 1711720000000, 1711720000000),
        ('pcthoxi1gvucwn8a4zvb9s7n', 'Video Pre-roll - YouTube', 75000.00, 73200.00, 'dncnkn18pqamrqx43689pckc', 1711720000000, 1711720000000),
        ('pacmrsccnwu1jcld325zntqf', 'Social Media Impressions - Meta', 30000.00, 31500.00, 'dncnkn18pqamrqx43689pckc', 1711720000000, 1711720000000),
        ('r20b55yhy92p20gndj59gsyv', 'Display Retargeting - Google', 40000.00, 39200.00, 'e93gwh0zat8pfu25u8tp0izc', 1711720000000, 1711720000000),
        ('jb70tdaswghyxaqddiw4zid7', 'Email Campaign - Holiday Promo', 15000.00, 14800.00, 'e93gwh0zat8pfu25u8tp0izc', 1711720000000, 1711720000000),
        ('sjm5l1zj3af3ibof725y0y9j', 'Social Ads - TikTok', 25000.00, 26100.00, 'e93gwh0zat8pfu25u8tp0izc', 1711720000000, 1711720000000),
        ('f9t6brfk41eld50cevehedcm', 'Search Ads - Google', 60000.00, 58500.00, 'sdi6ncsk3lxwvvddsjkt34t8', 1711720000000, 1711720000000),
        ('u0843x7x1lq0rpoyrhrags3h', 'Connected TV - Streaming', 90000.00, 87300.00, 'sdi6ncsk3lxwvvddsjkt34t8', 1711720000000, 1711720000000),
        ('comcoaviguqq2nju6b0j0vxb', 'Programmatic Display', 35000.00, 35800.00, 'sdi6ncsk3lxwvvddsjkt34t8', 1711720000000, 1711720000000),
        ('atufs2rcpb0wl9c6r0rqbhqa', 'Social Ads - Instagram', 20000.00, 20500.00, 'sdi6ncsk3lxwvvddsjkt34t8', 1711720000000, 1711720000000)
    `);

    await queryRunner.query(`
      INSERT INTO "invoices" ("id", "invoice_number", "status", "campaign_id", "created_at", "updated_at")
      VALUES
        ('ywtkrlcr3xfx7lengdncbg4z', 'INV-2026-001', 'finalized', 'dncnkn18pqamrqx43689pckc', 1711720000000, 1711720000000),
        ('i27q4xho19okxgiqdidp46em', 'INV-2026-002', 'draft', 'dncnkn18pqamrqx43689pckc', 1711720000000, 1711720000000),
        ('zw8nz9w4xekqugi9qm275ksj', 'INV-2026-003', 'finalized', 'e93gwh0zat8pfu25u8tp0izc', 1711720000000, 1711720000000),
        ('l0po876ygllp7fy41uv4t2lm', 'INV-2026-004', 'draft', 'e93gwh0zat8pfu25u8tp0izc', 1711720000000, 1711720000000),
        ('kb046vs5rz3cnyqbejrpswgv', 'INV-2027-005', 'finalized', 'sdi6ncsk3lxwvvddsjkt34t8', 1711720000000, 1711720000000),
        ('ukxdakn69w8johiygjajdume', 'INV-2027-006', 'draft', 'sdi6ncsk3lxwvvddsjkt34t8', 1711720000000, 1711720000000)
    `);

    await queryRunner.query(`
      INSERT INTO "invoice_line_items" ("id", "actual_amount", "invoice_id", "campaign_line_item_id", "created_at", "updated_at")
      VALUES
        ('nzjs4zd7e7edepopyzhla2ut', 48750.00, 'ywtkrlcr3xfx7lengdncbg4z', 'drmahwrh2rqjq3dbrh06m21q', 1711720000000, 1711720000000),
        ('ytvsjvqemf9v2jp99nttzhy6', 73200.00, 'ywtkrlcr3xfx7lengdncbg4z', 'pcthoxi1gvucwn8a4zvb9s7n', 1711720000000, 1711720000000),
        ('s3aujt991ermkpcvowxsexxe', 31500.00, 'i27q4xho19okxgiqdidp46em', 'pacmrsccnwu1jcld325zntqf', 1711720000000, 1711720000000),
        ('qxx1j78psiwfuhxsqm92eqlm', 39200.00, 'zw8nz9w4xekqugi9qm275ksj', 'r20b55yhy92p20gndj59gsyv', 1711720000000, 1711720000000),
        ('y85twauvhfun7aq5tz785wdu', 14800.00, 'zw8nz9w4xekqugi9qm275ksj', 'jb70tdaswghyxaqddiw4zid7', 1711720000000, 1711720000000),
        ('qdutqrfyym6myx8ypq8yu1as', 26100.00, 'l0po876ygllp7fy41uv4t2lm', 'sjm5l1zj3af3ibof725y0y9j', 1711720000000, 1711720000000),
        ('e861qfnkyiqmaqxh038r1wmk', 58500.00, 'kb046vs5rz3cnyqbejrpswgv', 'f9t6brfk41eld50cevehedcm', 1711720000000, 1711720000000),
        ('j7gidj1ot5d3vha9628jb294', 87300.00, 'kb046vs5rz3cnyqbejrpswgv', 'u0843x7x1lq0rpoyrhrags3h', 1711720000000, 1711720000000),
        ('tu7h2bnh1u5yn4cqv0x8t9f0', 35800.00, 'ukxdakn69w8johiygjajdume', 'comcoaviguqq2nju6b0j0vxb', 1711720000000, 1711720000000),
        ('he4s0oall1rnms9109q7h4u1', 20500.00, 'ukxdakn69w8johiygjajdume', 'atufs2rcpb0wl9c6r0rqbhqa', 1711720000000, 1711720000000)
    `);

    await queryRunner.query(`
      INSERT INTO "adjustments" ("id", "amount", "reason", "created_by", "invoice_line_item_id", "created_at", "updated_at")
      VALUES
        ('wdwxw0d22nqhp8elur10gzoc', -1218.75, 'Under-delivery credit: 2.5% below guaranteed impressions', 'jane.doe@agency.com', 'nzjs4zd7e7edepopyzhla2ut', 1711720000000, 1711720000000),
        ('x6qrgxawedshnz29zjtron22', -5000.00, 'Rate renegotiation per amended IO', 'john.smith@agency.com', 'ytvsjvqemf9v2jp99nttzhy6', 1711720000000, 1711720000000),
        ('iom837ejvmk7hl08soestsbs', 1500.00, 'Bonus impressions delivered at no charge', 'jane.doe@agency.com', 's3aujt991ermkpcvowxsexxe', 1711720000000, 1711720000000),
        ('x7xajgqpfee9imypgp6zs3tl', -750.00, 'Late delivery penalty per contract clause 4.2', 'mike.wilson@agency.com', 'y85twauvhfun7aq5tz785wdu', 1711720000000, 1711720000000),
        ('l00tpxmkvqrj3fk87x5pa555', -2500.00, 'Overspend correction on CPC bidding', 'sarah.chen@agency.com', 'e861qfnkyiqmaqxh038r1wmk', 1711720000000, 1711720000000),
        ('zaa3ytfpiwsxirrvspxyryd4', 3000.00, 'Makegood for missed ad placements on 01/15', 'sarah.chen@agency.com', 'j7gidj1ot5d3vha9628jb294', 1711720000000, 1711720000000)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "adjustments" WHERE "id" IN ('wdwxw0d22nqhp8elur10gzoc','x6qrgxawedshnz29zjtron22','iom837ejvmk7hl08soestsbs','x7xajgqpfee9imypgp6zs3tl','l00tpxmkvqrj3fk87x5pa555','zaa3ytfpiwsxirrvspxyryd4')`,
    );
    await queryRunner.query(
      `DELETE FROM "invoice_line_items" WHERE "id" IN ('nzjs4zd7e7edepopyzhla2ut','ytvsjvqemf9v2jp99nttzhy6','s3aujt991ermkpcvowxsexxe','qxx1j78psiwfuhxsqm92eqlm','y85twauvhfun7aq5tz785wdu','qdutqrfyym6myx8ypq8yu1as','e861qfnkyiqmaqxh038r1wmk','j7gidj1ot5d3vha9628jb294','tu7h2bnh1u5yn4cqv0x8t9f0','he4s0oall1rnms9109q7h4u1')`,
    );
    await queryRunner.query(
      `DELETE FROM "invoices" WHERE "id" IN ('ywtkrlcr3xfx7lengdncbg4z','i27q4xho19okxgiqdidp46em','zw8nz9w4xekqugi9qm275ksj','l0po876ygllp7fy41uv4t2lm','kb046vs5rz3cnyqbejrpswgv','ukxdakn69w8johiygjajdume')`,
    );
    await queryRunner.query(
      `DELETE FROM "campaign_line_items" WHERE "id" IN ('drmahwrh2rqjq3dbrh06m21q','pcthoxi1gvucwn8a4zvb9s7n','pacmrsccnwu1jcld325zntqf','r20b55yhy92p20gndj59gsyv','jb70tdaswghyxaqddiw4zid7','sjm5l1zj3af3ibof725y0y9j','f9t6brfk41eld50cevehedcm','u0843x7x1lq0rpoyrhrags3h','comcoaviguqq2nju6b0j0vxb','atufs2rcpb0wl9c6r0rqbhqa')`,
    );
    await queryRunner.query(
      `DELETE FROM "campaigns" WHERE "id" IN ('dncnkn18pqamrqx43689pckc','e93gwh0zat8pfu25u8tp0izc','sdi6ncsk3lxwvvddsjkt34t8')`,
    );
  }
}
