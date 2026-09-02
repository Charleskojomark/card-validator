import { CardScheme } from '../types/card.types';

const CARD_SCHEMES: CardScheme[] = [
  {
    name: 'American Express',
    prefixes: ['34', '37'],
    validLengths: [15],
  },
  {
    name: 'Discover',
    prefixes: ['6011', '644', '645', '646', '647', '648', '649', '65'],
    validLengths: [16, 19],
  },
  {
    name: 'Mastercard',
    // Mastercard uses 51-55. It also uses 2221-2720, which is handled programmatically below
    prefixes: ['51', '52', '53', '54', '55'],
    validLengths: [16],
  },
  {
    name: 'Visa',
    prefixes: ['4'],
    validLengths: [13, 16, 19],
  }
];

/**
 * Detects the card scheme (e.g. Visa, Mastercard) based on the Issuer Identification Number (IIN) prefix.
 * 
 * @param digits - A string containing ONLY numeric digits.
 * @returns The matched CardScheme or null if unrecognized.
 */
export const detectScheme = (digits: string): CardScheme | null => {
  if (!digits) return null;

  for (const scheme of CARD_SCHEMES) {
    // Handle Mastercard 2221-2720 range programmatically for brevity
    if (scheme.name === 'Mastercard' && digits.length >= 4) {
      const prefix = parseInt(digits.substring(0, 4), 10);
      if (prefix >= 2221 && prefix <= 2720) {
        return scheme;
      }
    }

    if (scheme.prefixes.some(prefix => digits.startsWith(prefix))) {
      return scheme;
    }
  }

  return null;
};
