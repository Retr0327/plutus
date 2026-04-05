import { HttpException } from '@nestjs/common';
import { Result } from '@common/result';

export type DeleteAdjustmentOutput = Result<{ id: number }, HttpException>;
