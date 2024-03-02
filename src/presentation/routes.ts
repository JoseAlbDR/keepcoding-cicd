import { Router } from 'express';
import { ProductRoutes } from './api/products/routes';
import { TagsRoutes } from './api/tags/routes';
import { ProductWebRoutes } from './web/products/routes';
import { AuthRoutes } from './api/auth/routes';
import { FileUploadRoutes } from './api/fileupload/routes';
import { ChangeLocaleRoutes } from './web/change-locale/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // API routes
    router.use('/api/v1/products', ProductRoutes.routes);
    router.use('/api/v1/tags', TagsRoutes.routes);
    router.use('/api/v1/auth', AuthRoutes.routes);
    router.use('/api/v1/upload', FileUploadRoutes.routes);

    // WEB routes
    router.use('/', ProductWebRoutes.routes);
    router.use('/change-locale', ChangeLocaleRoutes.routes);

    return router;
  }
}
