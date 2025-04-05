import { ComponentPropsWithRef, useImperativeHandle } from 'react';
import { useMask } from '@/hooks/use-mask';
import { Mask } from '@/types';
import { masks } from '@/helpers/pre-assembled-masks';

interface Input extends ComponentPropsWithRef<'input'> {
  mask?: Mask;
}

function InputComponent({ mask: maskProp = '', ref, ...props }: Input) {
  const mask = useMask(maskProp);

  useImperativeHandle(ref, () => mask.ref.current!);

  return <input {...props} ref={mask.ref} onInput={mask.bindInputEvent(props.onInput)}/>;
}

export const Input = Object.assign(InputComponent, { masks })
