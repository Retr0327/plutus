import { z, ZodType } from 'zod';
import {
  ArgumentMetadata,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';

export interface ZodToClsConstructor<T> {
  new (args: T): T;
  schema: ZodType;
}

export function ZodToCls<
  Z extends ZodType<any, any, any>,
  T extends z.infer<Z>,
>(schema: Z): ZodToClsConstructor<T> {
  class cls {
    constructor(args: z.infer<Z>) {
      Object.assign(this, args);
    }
    static schema: Z = schema;
  }

  return cls as any;
}

export class ZodValidationPipe<
  T extends ZodType<any, any, any>,
> implements PipeTransform {
  constructor(private readonly schema?: T) {}

  async transform(value: unknown, metadata: ArgumentMetadata) {
    if (
      !metadata.metatype ||
      metadata.type === 'custom' ||
      !this.toValidate(metadata.metatype)
    ) {
      return value;
    }

    const cls = metadata?.metatype as ZodToClsConstructor<unknown>;
    try {
      if (this.schema) {
        const parsedValue = await this.schema.parseAsync(value);
        return parsedValue;
      }

      const parsedValue = await cls.schema.parseAsync(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.issues.map(
          (e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`,
        );
        throw new UnprocessableEntityException(messages);
      }
      throw new UnprocessableEntityException();
    }
  }

  private toValidate(metaType: new (...args: any[]) => any): boolean {
    const types: (new (...args: any[]) => any)[] = [
      String,
      Boolean,
      Number,
      Array,
      Object,
    ];
    return !types.includes(metaType);
  }
}
