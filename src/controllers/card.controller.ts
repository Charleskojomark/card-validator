import { Request, Response, NextFunction } from 'express';
import { validateCardService } from '../services/card.service';

export const validateCardHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { cardNumber } = req.body;

    if (cardNumber === undefined || cardNumber === null || cardNumber === '') {
      res.status(400).json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'cardNumber is required and must be a non-empty string',
      });
      return;
    }

    if (typeof cardNumber !== 'string') {
      res.status(400).json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'cardNumber must be a string',
      });
      return;
    }

    // Quick regex to ensure we don't pass absurdly malformed data (like letters) to the service
    // Spaces and dashes are allowed in the input
    if (!/^[\d\s-]+$/.test(cardNumber)) {
      res.status(422).json({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: 'cardNumber must contain digits only (spaces and dashes are allowed)',
      });
      return;
    }

    const result = validateCardService(cardNumber);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
