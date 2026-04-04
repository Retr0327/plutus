import {
  Column,
  ColumnOptions,
  ColumnType,
  FindOperator,
  ILike,
  Like,
  PrimaryColumn,
  PrimaryColumnOptions,
} from 'typeorm';
import { getEnv } from '@common/env';

const ENV = getEnv();

export function caseInsensitiveLike(value: string): FindOperator<string> {
  return ENV.nodeEnv === 'test' ? Like(value) : ILike(value);
}

export function adaptType(type: ColumnType) {
  if (ENV.nodeEnv !== 'test') {
    return type;
  }

  switch (type) {
    case 'timestamp':
    case 'timestamptz':
    case 'char':
    case 'simple-json':
    case 'json':
      return 'text';
    case 'jsonb':
      return 'simple-json';
    default:
      return type;
  }
}

export function PrimaryDateColumn(
  options?: Omit<PrimaryColumnOptions, 'type'>,
) {
  const { nullable = false, comment, ...rest } = options || {};
  if (ENV.nodeEnv === 'test') {
    return Column({
      nullable,
      type: adaptType('timestamptz'),
      comment,
      ...rest,
    });
  }
  return PrimaryColumn({
    type: adaptType('timestamptz'),
    nullable,
    comment,
    ...rest,
  });
}

export function PrimaryCuidColumn(
  options?: Omit<PrimaryColumnOptions, 'length' | 'type'>,
) {
  const {
    primary = false,
    nullable = false,
    comment,
    name,
    ...rest
  } = options || {};
  return primary
    ? PrimaryColumn({
        type: adaptType('char'),
        length: 24,
        comment,
        name,
        ...rest,
      })
    : Column({
        nullable,
        type: adaptType('char'),
        length: 24,
        comment,
        name,
        ...rest,
      });
}

export function TimeStampColumn(
  options: Omit<ColumnOptions, 'type' | 'transformer'>,
) {
  const columnOptions: ColumnOptions = {
    type: 'bigint',
    transformer: {
      to: (value: number | Date) => {
        if (value instanceof Date) {
          return Math.floor(value.getTime() / 1000);
        }
        return value;
      },
      from: (value: number) => {
        return value;
      },
    },
    ...options,
  };
  return Column(columnOptions);
}
