import { Router } from 'express';
import { ErrorHandler } from '../../../domain';
import { FileUploadService } from '../services/file-upload.service';
import { FileUploadController } from './controller';
import { FileUploadMiddleware } from '../../middlewares/file-upload.middleware';

export class FileUploadRoutes {
  static get routes(): Router {
    const router = Router();

    const errorHandler = new ErrorHandler();
    const fileUploadService = new FileUploadService();
    const fileUploadController = new FileUploadController(
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

    router.post('/single/:destiny', fileUploadController.uploadSingleFile);
    router.post('/multiple/:destiny', fileUploadController.uploadMultipleFiles);

    return router;
  }
}
