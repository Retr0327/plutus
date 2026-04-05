import { HttpException } from '@nestjs/common';
import { Result } from '@common/result';

export type UpdateAdjustmentOutput = Result<{ id: number }, HttpException>;
