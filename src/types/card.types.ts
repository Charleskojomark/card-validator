export interface ValidateCardRequest {
  cardNumber: string;
}

export interface ValidateCardResponse {
  valid: boolean;
  scheme: string | null;
  last4: string | null;
  message: string;
}

export interface CardScheme {
  name: string;
  prefixes: string[];
  validLengths: number[];
}
