# Card Number Validator API

A clean, production-ready REST API for validating credit card numbers, built as part of the Backend Developer Intern Assessment.

## Overview

This project provides a single endpoint (`POST /validate-card`) that accepts a card number and validates it using the industry-standard **Luhn algorithm** (ISO/IEC 7812). It also performs card scheme detection (Visa, Mastercard, Amex, Discover) based on IIN prefixes.

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Charleskojomark/card-validator.git
   cd card-validator
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3000`.

### Running Tests
The project uses Jest for both unit and integration testing.
```bash
npm test              # Run all tests
npm run test:coverage # Run all tests with coverage report
```

## API Specification

### `POST /validate-card`

Validates a given card number. Spaces and dashes in the input are automatically normalised.

**Request Body:**
```json
{
  "cardNumber": "4532015112830366"
}
```

**Success Response (Valid Card) — `200 OK`:**
```json
{
  "valid": true,
  "scheme": "Visa",
  "last4": "0366",
  "message": "Card number is valid"
}
```

**Success Response (Invalid Card) — `200 OK`:**
```json
{
  "valid": false,
  "scheme": "Visa",
  "last4": "0367",
  "message": "Card number failed Luhn check"
}
```

## Design Decisions

During the live review, I am happy to discuss these architectural choices in depth:

1. **Express over a heavier framework (e.g., NestJS):**
   A single-endpoint validation API does not warrant the heavy boilerplate and dependency injection overhead of NestJS. Express was chosen to demonstrate a fundamental understanding of HTTP routing, middleware, and request validation without hiding behind framework magic. 

2. **The `200 OK` status for invalid cards:**
   When a user submits a syntactically correct request with an invalid card number, the *HTTP transaction* is successful. Returning a `400 Bad Request` here would conflate HTTP semantics with business logic. Therefore, invalid cards return `200 OK` with a business payload of `"valid": false`. `400` and `422` are reserved strictly for missing/malformed HTTP requests.

3. **Luhn Algorithm Utility:**
   The Luhn logic is decoupled into a pure function (`src/utils/luhn.ts`) with zero side effects or dependencies. This makes it highly testable and easy to reuse.

4. **Commit History:**
   The project was built using atomic, logical commits to demonstrate a professional version control workflow, separating configuration, interfaces, pure functions, and API routing.

## cURL Examples

**Valid Visa (Test Number):**
```bash
curl -X POST http://localhost:3000/validate-card \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "4532015112830366"}'
```

**Invalid Number (Fails Luhn):**
```bash
curl -X POST http://localhost:3000/validate-card \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "1234567890123456"}'
```

**Malformed Request (Missing Field):**
```bash
curl -X POST http://localhost:3000/validate-card \
  -H "Content-Type: application/json" \
  -d '{}'
```
