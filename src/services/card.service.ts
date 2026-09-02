import { ValidateCardResponse } from '../types/card.types';
import { isValidLuhn } from '../utils/luhn';
import { detectScheme } from '../utils/card-scheme';

/**
 * Validates a card number by checking its scheme, length, and Luhn checksum.
 * 
 * @param input - The raw card number string (may contain spaces or dashes).
 * @returns A structured validation response.
 */
export const validateCardService = (input: string): ValidateCardResponse => {
  // Normalise input: remove all spaces and dashes
  const normalisedDigits = input.replace(/[\s-]/g, '');

  // If after normalisation we have non-numeric characters or it's empty
  if (!normalisedDigits || !/^\d+$/.test(normalisedDigits)) {
    return {
      valid: false,
      scheme: null,
      last4: null,
      message: 'Card number must contain only digits, spaces, or dashes',
    };
  }

  const last4 = normalisedDigits.length >= 4 
    ? normalisedDigits.slice(-4) 
    : normalisedDigits;

  const scheme = detectScheme(normalisedDigits);

  if (!scheme) {
    const passesLuhn = isValidLuhn(normalisedDigits);
    return {
      valid: false,
      scheme: null,
      last4,
      message: passesLuhn 
        ? 'Card number failed scheme detection (unsupported card type)' 
        : 'Card number failed Luhn check and scheme detection',
    };
  }

  // Validate length according to the detected scheme
  if (!scheme.validLengths.includes(normalisedDigits.length)) {
    return {
      valid: false,
      scheme: scheme.name,
      last4,
      message: `Invalid length for ${scheme.name} card`,
    };
  }

  // Finally, run the Luhn algorithm checksum
  if (!isValidLuhn(normalisedDigits)) {
    return {
      valid: false,
      scheme: scheme.name,
      last4,
      message: 'Card number failed Luhn check',
    };
  }

  return {
    valid: true,
    scheme: scheme.name,
    last4,
    message: 'Card number is valid',
  };
};
