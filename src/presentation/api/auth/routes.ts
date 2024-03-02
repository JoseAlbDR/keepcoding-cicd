import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { ErrorHandler } from '../../../domain';
import { AuthController } from './controller';
import { JWTAdapter, envs } from '../../../config';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const jwtAdapter = new JWTAdapter(envs.JWT_SEED);
    const authService = new AuthService(jwtAdapter);
    const errorHandler = new ErrorHandler();
    const authController = new AuthController(authService, errorHandler);

    router.post('/signup', authController.signup);
    router.post('/login', authController.login);

    return router;
  }
}
