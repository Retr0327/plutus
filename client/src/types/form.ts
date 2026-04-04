import type { NumberInputProps, SelectProps, TextareaProps, TextInputProps } from '@mantine/core';
import type { ReactNode } from 'react';
import type { FieldValues, Path } from 'react-hook-form';

export type ControllerProps =
  | ({ control: 'text-input' } & TextInputProps)
  | ({ control: 'number-input' } & NumberInputProps)
  | ({ control: 'textarea' } & TextareaProps)
  | ({ control: 'select' } & SelectProps);

export type ControllerMap<TFieldValues extends FieldValues> = Partial<
  Record<
    Path<TFieldValues>,
    ControllerProps & {
      col?: number;
      Field?: (props: { children: ReactNode }) => ReactNode;
    }
  >
>;
