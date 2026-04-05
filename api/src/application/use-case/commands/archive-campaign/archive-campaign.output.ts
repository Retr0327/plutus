import { HttpException } from '@nestjs/common';
import { Result } from '@common/result';

export type ArchiveCampaignOutput = Result<{ id: number }, HttpException>;
