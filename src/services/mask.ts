import { findMajority as findMajorityInCandidates } from '@/helpers/find-majority';
import { masks } from '@/helpers/pre-assembled-masks';
import { Mask } from '@/types';

export class MaskService {
  // não usar caracteres especiais de regex na 'key' e.g. '.' '*' '+' '?' '^' '$' '(' ')' '[' ']' '{' '}' '|' '\'
  private readonly maskConfig: Record<string, Record<'clean' | 'match', RegExp>> = {
    'A': { clean: /[^A-Za-z]/g, match: /[A-Za-z]/g },       /* alphabet .....*/
    '0': { clean: /[^0-9]/g, match: /[0-9]/g },             /* numeric ......*/
    '#': { clean: /[^A-Za-z0-9]/g, match: /[A-Za-z0-9]/g }, /* alphanumeric .*/
  };

  public set(masks: string, input: string) {
    const mask = this.findSuitableMask(masks, input);
    if (!mask) return input;

    const majority = this.findMajority([...mask]);
    const chars = [...input.replace(this.maskConfig[majority.value].clean, '')];

    return [...mask].reduce((result, symbol) => {
      const inputValue = majority.value === symbol ? chars.shift() : '';
      const maskValue = chars.length ? symbol : '';

      return result.concat(inputValue || maskValue);
    }, '');
  }

  public clear(masks: string, input: string) {
    const mask = this.findSuitableMask(masks, input);
    if (!mask) return input;

    const majority = this.findMajority([...mask]);
    const symbols = [...mask.replace(this.maskConfig[majority.value].match, '')];

    return [...input].reduce((result, char) => {
      if (result.length >= majority.qty) return result.slice(0, majority.qty);
      return symbols.includes(char) ? result : result.concat(char);
    }, '');
  }

  public get(mask?: Mask | ((mask: typeof masks) => Mask)) {
    return typeof mask === 'function' ? mask(masks) : (mask ?? '');
  }

  private findSuitableMask(masks: string, input: string) {
    const suitable = (mask: string, index: number, array: string[]) => {
      const { value: symbolChar } = this.findMajority([...mask]);

      if (!this.maskConfig[symbolChar]) return false;

      const maskLength = mask.match(new RegExp(`[${symbolChar}]`, 'g'))?.length;
      const inputLength = input.match(this.maskConfig[symbolChar].match)?.length;

      const inputIsGreaterThanMask = (inputLength ?? 0) > (maskLength ?? 0);
      const isLastMask = index === array.length - 1;

      return !inputIsGreaterThanMask || isLastMask;
    };

    return masks.split(',').find(suitable)?.trim();
  }

  private findMajority(array: string[]) {
    return findMajorityInCandidates(array, Object.keys(this.maskConfig));
  }
}

export const maskService = new MaskService()