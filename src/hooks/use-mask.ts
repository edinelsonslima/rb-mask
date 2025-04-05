import { useMemo, useRef, useEffect, FormEventHandler } from "react";
import { masks } from "@/helpers/pre-assembled-masks";
import { maskService } from "@/services/mask";
import { Mask, HTMLInput } from "@/types";
import { eventService } from "@/services/event";

export function useMask(prop?: Mask | ((mask: typeof masks) => Mask)) {
  const mask = useMemo(() => maskService.get(prop), [prop]);
  const inputRef = useRef<HTMLInput>(null);

  useEffect(() => {
    if (inputRef.current?.value) {
      inputRef.current.value = eventService.value(mask, inputRef.current.value, inputRef);
    }

    if (inputRef.current?.defaultValue) {
      inputRef.current.defaultValue = eventService.value(mask, inputRef.current.defaultValue, inputRef);
    }
  }, [mask]);

  return useMemo(
    () => ({
      ref: inputRef,
      bindInputEvent: (oninput?: FormEventHandler<HTMLInputElement>) => {
        return eventService.input(mask, inputRef, oninput);
      },
      input: () => ({
        unmasked: inputRef.current?.['rb-value'],
        masked: inputRef.current?.value,
      }),
      props: {
        ref: inputRef,
        onInput: eventService.input(mask, inputRef),
      },
    }),
    [mask],
  );
}