import { HttpException } from '@nestjs/common';
import { Result } from '@common/result';

export type CreateAdjustmentOutput = Result<{ id: string }, HttpException>;
