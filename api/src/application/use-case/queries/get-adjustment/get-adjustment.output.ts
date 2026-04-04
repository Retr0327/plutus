import { HttpException } from '@nestjs/common';
import { AdjustmentMapper } from '@plutus/infrastructure/mappers/adjustment.mapper';
import { Result } from '@common/result';

export type GetAdjustmentOutput = Result<
  ReturnType<(typeof AdjustmentMapper)['toDto']> | null,
  HttpException
>;
