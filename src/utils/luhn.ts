/**
 * Validates a card number using the Luhn algorithm (ISO/IEC 7812).
 * 
 * @param digits - A string containing ONLY numeric digits (no spaces or dashes).
 * @returns boolean indicating whether the number passes the checksum.
 */
export const isValidLuhn = (digits: string): boolean => {
  // Luhn algorithm typically requires at least 2 digits to be meaningful
  if (!digits || digits.length < 2) {
    return false;
  }

  // Ensure the input contains only numeric characters
  if (!/^\d+$/.test(digits)) {
    return false;
  }

  let sum = 0;
  let isSecond = false;

  // Start from the rightmost digit and move left
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isSecond) {
      digit *= 2;
      // If doubling results in a two-digit number, subtract 9 
      // (which is equivalent to adding the two digits together)
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isSecond = !isSecond;
  }

  return sum % 10 === 0;
};
