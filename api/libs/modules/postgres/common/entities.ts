import { BeforeInsert, PrimaryGeneratedColumn } from 'typeorm';
import { TimeStampColumn } from './column.decorator';

export class CreateDateEntity {
  @TimeStampColumn({ name: 'created_at' })
  createdAt!: number;

  @BeforeInsert()
  initCreatedAt() {
    if (!this.createdAt) {
      this.createdAt = Date.now();
    }
  }
}

export class UpdateDateEntity extends CreateDateEntity {
  @TimeStampColumn({ name: 'updated_at' })
  updatedAt!: number;
}

export class TimeStampEntity extends UpdateDateEntity {}

export class DefaultEntity extends TimeStampEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;
}
