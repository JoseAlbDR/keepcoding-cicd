import { Router } from 'express';
import { ChangeLocaleController } from './controller';

export class ChangeLocaleRoutes {
  static get routes(): Router {
    const router = Router();

    const changeLocaleController = new ChangeLocaleController();

    router.get('/:locale', changeLocaleController.translate);

    return router;
  }
}
