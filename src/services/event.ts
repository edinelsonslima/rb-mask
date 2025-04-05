import { FormEvent, FormEventHandler } from "react";
import { HTMLInput, Mask, Target } from "@/types";
import { MaskService } from "./mask";

export class EventService extends MaskService {
  public input<T extends FormEvent<HTMLInput>>(
    mask: Mask,
    target: Target,
    onInput?: FormEventHandler<HTMLInputElement>,
  ) {
    return (evt: T) => {
      let unmasked = evt.currentTarget.value;

      if (typeof mask === 'object') {
        unmasked = mask.clear(evt.currentTarget.value);
        evt.currentTarget.value = mask.set(unmasked);
      }

      if (typeof mask === 'string') {
        unmasked = super.clear(mask, evt.currentTarget.value);
        evt.currentTarget.value = super.set(mask, unmasked);
      }

      this.updateUnmasked(unmasked, target);
      onInput?.(evt);
      return evt;
    };
  }

  public value(mask: Mask, value: string, target: Target) {
    if (typeof mask === 'object') {
      const masked = mask.set(value);
      this.updateUnmasked(mask.clear(masked), target);
      return masked;
    }

    if (typeof mask === 'string') {
      const masked = super.set(mask, value);
      this.updateUnmasked(super.clear(mask, masked), target);
      return masked;
    }

    this.updateUnmasked(value, target);
    return value;
  }

  private updateUnmasked(value: string, target: Target) {
    if (target?.current) {
      return target.current!['rb-value'] = value;
    }

    // Delay to avoid waiting for the reference to initialize
    const animationFrameId = requestAnimationFrame(() => {
      if (target?.current) {
        target.current!['rb-value'] = value;
      }

      cancelAnimationFrame(animationFrameId);
    });
  }
}

export const eventService = new EventService()