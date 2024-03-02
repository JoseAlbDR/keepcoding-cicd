import { Router } from 'express';
import { ProductController } from './controller';
import { ProductService } from '../services/product.service';
import { ErrorHandler } from '../../../domain';
import { CoteAdapter, JWTAdapter, envs } from '../../../config';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { FileUploadMiddleware } from '../../middlewares/file-upload.middleware';
import { FileUploadService } from '../services/file-upload.service';

export class ProductRoutes {
  static get routes(): Router {
    const router = Router();

    const jwtAdapter = new JWTAdapter(envs.JWT_SEED);
    const authMiddleware = new AuthMiddleware(jwtAdapter);
    const productService = new ProductService();
    const fileUploadService = new FileUploadService();
    const errorHandler = new ErrorHandler();
    const productController = new ProductController(
      productService,
      fileUploadService,
      errorHandler
    );

    router.use([
      FileUploadMiddleware.containFiles(),
      FileUploadMiddleware.validateType(['users', 'products']),
      FileUploadMiddleware.validateExtension([
        'png',
        'jpg',
        'jpeg',
        'gif',
        'webp',
      ]),
    ]);

    router.get(
      '/',
      authMiddleware.authenticateUser,
      productController.getProducts
    );

    router.post(
      '/',
      authMiddleware.authenticateUser,
      productController.createProduct
    );

    return router;
  }
}
