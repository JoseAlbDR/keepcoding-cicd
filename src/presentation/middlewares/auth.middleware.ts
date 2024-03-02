import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../domain';
import { JWTAdapter } from '../../config';

export class AuthMiddleware {
  constructor(private readonly jwtAdapter: JWTAdapter) {}

  public authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { token } = req.signedCookies;

      if (!token) return res.status(401).json('Invalid authentication');

      const payload = await this.jwtAdapter.validateToken(token);

      if (!token) return res.status(401).json('Invalid authentication');

      req.body.user = payload;
      next();
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.unauthorized('Invalid authentication');
    }
  };
}
