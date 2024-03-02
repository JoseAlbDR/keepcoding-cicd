import { Router } from 'express';
import { TagsService } from '../services/tags.service';
import { ProductService } from '../services/product.service';
import { ErrorHandler } from '../../../domain';
import { TagsController } from './controller';

export class TagsRoutes {
  static get routes(): Router {
    const router = Router();
    const tagsService = new TagsService();
    const errorHandler = new ErrorHandler();
    const tagsController = new TagsController(tagsService, errorHandler);

    router.get('/', tagsController.getTags);

    return router;
  }
}
