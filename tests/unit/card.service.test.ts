import { validateCardService } from '../../src/services/card.service';

describe('Card Service', () => {
  it('should return valid: true for a valid Visa', () => {
    const result = validateCardService('4532015112830366');
    expect(result).toEqual({
      valid: true,
      scheme: 'Visa',
      last4: '0366',
      message: 'Card number is valid'
    });
  });

  it('should strip spaces and dashes before validation', () => {
    const result = validateCardService('4532 0151-1283 0366');
    expect(result.valid).toBe(true);
    expect(result.scheme).toBe('Visa');
  });

  it('should return valid: false for a Luhn failure', () => {
    const result = validateCardService('4532015112830367');
    expect(result).toEqual({
      valid: false,
      scheme: 'Visa',
      last4: '0367',
      message: 'Card number failed Luhn check'
    });
  });

  it('should return valid: false for an unknown scheme that passes Luhn', () => {
    // 1234567812345670 passes Luhn (assumed for this test case shape)
    // Actually we need a real Luhn valid number that doesn't match our scheme list.
    // Let's use 0000000000000000 (passes Luhn, unknown scheme)
    const result = validateCardService('0000000000000000');
    expect(result.valid).toBe(false);
    expect(result.scheme).toBeNull();
    expect(result.message).toContain('failed scheme detection');
  });

  it('should return valid: false if length is incorrect for the scheme', () => {
    // Visa starts with 4, but let's give it 14 digits (valid Visa lengths are 13, 16, 19)
    // 40000000000003 passes Luhn
    const result = validateCardService('40000000000003');
    expect(result.valid).toBe(false);
    expect(result.scheme).toBe('Visa');
    expect(result.message).toContain('Invalid length');
  });

  it('should return valid: false for non-numeric input (after stripping spaces)', () => {
    const result = validateCardService('4532 abc');
    expect(result.valid).toBe(false);
    expect(result.scheme).toBeNull();
  });
});
