import { Request, Response } from 'express';
import { ProductService } from '../../api/services/product.service';
import {
  CustomError,
  ErrorHandler,
  FiltersDto,
  PaginationDto,
} from '../../../domain';
import { BuildFilterFromReq } from '../../../utils';

export class ProductWebController {
  constructor(
    private readonly productService: ProductService,
    private readonly errorHandler: ErrorHandler
  ) {}

  public listProducts = (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    const [paginationError, paginationDto] = PaginationDto.create(
      +page,
      +limit
    );
    const [filtersError, filtersDto] = FiltersDto.create({ ...req.query });

    if (paginationError)
      return this.errorHandler.handleError(
        CustomError.badRequest(paginationError),
        res
      );

    if (filtersError)
      return this.errorHandler.handleError(
        CustomError.badRequest(filtersError),
        res
      );

    const queryObject = BuildFilterFromReq.build(filtersDto!);

    this.productService
      .getProducts(paginationDto!, queryObject)
      .then(({ products }) => res.render('index', { products }))
      .catch((err) => this.errorHandler.handleError(err, res));
  };
}
