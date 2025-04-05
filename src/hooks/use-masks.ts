import { createRef, FormEventHandler, RefObject, useMemo } from 'react';
import { eventService } from '@/services/event';
import { maskService } from '@/services/mask';
import { Mask, HTMLInput } from '@/types';
import { masks } from '@/helpers/pre-assembled-masks';


interface MasksProps {
  mask?: Mask | ((mask: typeof masks) => Mask);
  onInput?: FormEventHandler<HTMLInputElement>;
  value?: string | number;
  defaultValue?: string | number;
}

export function useMasks() {
  const inputs = useMemo(() => new Map<string, RefObject<HTMLInput | null>>(), []);

  return {
    inputs: () => {
      return new Map(
        Array.from(inputs).map(([name, ref]) => {
          const value = { unmasked: ref.current?.['rb-value'], masked: ref.current?.value };
          return [name, value];
        }),
      );
    },

    mask: (name: string, { mask, value, defaultValue, onInput }: MasksProps) => {
      mask = maskService.get(mask);
      value = String(value ?? '');
      defaultValue = String(defaultValue ?? '');

      return {
        onInput: eventService.input(mask, inputs.get(name), onInput),
        ref: inputs.get(name) ?? inputs.set(name, createRef<HTMLInput>()).get(name)!,
        ...(value && { value: eventService.value(mask, value, inputs.get(name)) }),
        ...(defaultValue && { defaultValue: eventService.value(mask, defaultValue, inputs.get(name)) }),
      };
    },
  };
}
