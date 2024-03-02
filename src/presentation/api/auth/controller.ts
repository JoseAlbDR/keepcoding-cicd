import { Request, Response } from 'express';
import {
  CustomError,
  ErrorHandler,
  LoginDto,
  SignupDto,
} from '../../../domain';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly errorHandler: ErrorHandler
  ) {}

  signup = (req: Request, res: Response) => {
    const [error, signupDto] = SignupDto.create(req.body);

    if (error)
      return this.errorHandler.handleError(CustomError.badRequest(error), res);

    this.authService
      .signup(signupDto!)
      .then((user) => res.status(201).json(user))
      .catch((err) => this.errorHandler.handleError(err, res));
  };

  login = (req: Request, res: Response) => {
    const [error, loginDto] = LoginDto.create(req.body);

    if (error)
      return this.errorHandler.handleError(CustomError.badRequest(error), res);

    this.authService
      .login(loginDto!)
      .then((token) => {
        const oneDay = 1000 * 60 * 60 * 24;
        res.cookie('token', token, {
          httpOnly: true,
          expires: new Date(Date.now() + oneDay),
          secure: process.env.NODE_ENV === 'production',
          signed: true,
        });

        return res.json({ msg: 'user successfully logged in' });
      })
      .catch((err) => this.errorHandler.handleError(err, res));
  };
}
