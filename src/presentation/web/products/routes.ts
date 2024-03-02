import { Request, Response, Router } from 'express';
import { ProductService } from '../../api/services/product.service';
import { ProductWebController } from './controller';
import { ErrorHandler } from '../../../domain';

export class ProductWebRoutes {
  static get routes(): Router {
    const router = Router();

    const productService = new ProductService();
    const errorHandler = new ErrorHandler();
    const productWebController = new ProductWebController(
      productService,
      errorHandler
    );

    router.get('/', (req: Request, res: Response) => {
      res.redirect('/home');
    });

    router.get('/home', productWebController.listProducts);

    return router;
  }
}
