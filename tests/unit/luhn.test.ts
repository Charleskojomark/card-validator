import { isValidLuhn } from '../../src/utils/luhn';

describe('Luhn Algorithm Utility', () => {
  it('should return true for a valid Visa card number', () => {
    // 4532015112830366 is a structurally valid test Visa
    expect(isValidLuhn('4532015112830366')).toBe(true);
  });

  it('should return false for an invalid card number', () => {
    expect(isValidLuhn('4532015112830367')).toBe(false);
  });

  it('should return false for empty strings', () => {
    expect(isValidLuhn('')).toBe(false);
  });

  it('should return false for strings with less than 2 digits', () => {
    expect(isValidLuhn('4')).toBe(false);
  });

  it('should return false if input contains non-numeric characters', () => {
    expect(isValidLuhn('453201511283036a')).toBe(false);
  });

  it('should return true for a valid Mastercard test number', () => {
    expect(isValidLuhn('5425233430109903')).toBe(true);
  });
});
