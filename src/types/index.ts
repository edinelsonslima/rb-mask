import { RefObject } from 'react';

export type Mask = string | { set: (input: string) => string; clear: (input: string) => string };

export type HTMLInput = HTMLInputElement & { 'rb-value': string };

export type Target = RefObject<HTMLInput | null> | undefined;
