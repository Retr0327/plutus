import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { CreateDateEntity } from '@modules/postgres/common';
import { adaptType } from '@modules/postgres/common/column.decorator';

@Entity('audit_logs')
@Index('IDX_audit_logs_entity', ['entityType', 'entityId'])
export class AuditLog extends CreateDateEntity {
  constructor(args?: Partial<AuditLog>) {
    super();
    Object.assign(this, args);
  }

  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ length: 50, name: 'entity_type' })
  entityType!: string;

  @Column({ length: 50, name: 'entity_id' })
  entityId!: string;

  @Column({ length: 20, default: 'update' })
  action!: string;

  @Column({ length: 255, name: 'changed_by', default: 'system' })
  changedBy!: string;

  @Column({
    type: adaptType('jsonb') as 'text',
    nullable: true,
    name: 'old_value',
  })
  oldValue!: Record<string, unknown> | null;

  @Column({
    type: adaptType('jsonb') as 'text',
    nullable: true,
    name: 'new_value',
  })
  newValue!: Record<string, unknown> | null;
}
