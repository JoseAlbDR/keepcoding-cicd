import { Request, Response } from 'express';
import { CustomError, ErrorHandler, PaginationDto } from '../../../domain';
import { TagsService } from '../services/tags.service';

export class TagsController {
  constructor(
    private readonly tagsService: TagsService,
    private readonly errorHandler: ErrorHandler
  ) {}

  public getTags = (req: Request, res: Response) => {
    this.tagsService
      .getTags()
      .then((tags) => res.json(tags))
      .catch((err) => this.errorHandler.handleError(err, res));
  };
}
