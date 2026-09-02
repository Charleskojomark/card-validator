import request from 'supertest';
import app from '../../src/app';

describe('POST /validate-card', () => {
  it('should return 200 OK and valid: true for a valid Visa', async () => {
    const response = await request(app)
      .post('/validate-card')
      .send({ cardNumber: '4532015112830366' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      valid: true,
      scheme: 'Visa',
      last4: '0366',
      message: 'Card number is valid',
    });
  });

  it('should return 200 OK and valid: false for a Luhn failure', async () => {
    const response = await request(app)
      .post('/validate-card')
      .send({ cardNumber: '4532015112830367' });

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(false);
    expect(response.body.message).toContain('failed Luhn check');
  });

  it('should return 400 Bad Request if cardNumber is missing', async () => {
    const response = await request(app)
      .post('/validate-card')
      .send({}); // missing body field

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
  });

  it('should return 400 Bad Request if cardNumber is not a string', async () => {
    const response = await request(app)
      .post('/validate-card')
      .send({ cardNumber: 1234567890123456 }); // number instead of string

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
  });

  it('should return 422 Unprocessable Entity if cardNumber contains letters', async () => {
    const response = await request(app)
      .post('/validate-card')
      .send({ cardNumber: '4532abc12830366' });

    expect(response.status).toBe(422);
    expect(response.body.error).toBe('Unprocessable Entity');
  });

  it('should strip spaces and dashes and return 200 OK for a valid number', async () => {
    const response = await request(app)
      .post('/validate-card')
      .send({ cardNumber: '4532 0151-1283 0366' });

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(true);
  });
  
  it('should handle 404 for unknown endpoints gracefully', async () => {
    const response = await request(app)
      .get('/random-unknown-endpoint')
      .send();

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Not Found');
  });
});
