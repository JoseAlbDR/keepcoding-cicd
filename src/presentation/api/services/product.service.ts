import { ProductModel } from '../../../data';
import { CustomError, PaginationDto } from '../../../domain';
import { ProductEntity } from '../../../domain';
import { CreateProductDto } from '../../../domain/dtos/products/create-product.dto';
import { QueryObject } from '../../../utils';

export class ProductService {
  constructor() {}

  public async getProducts(
    paginationDto: PaginationDto,
    queryObject: QueryObject
  ) {
    const { limit, page } = paginationDto;

    try {
      const [total, products] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find(queryObject)
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('createdBy', 'name email'),
      ]);

      const maxPages = Math.ceil(total / limit);

      const productEntities = products.map((product) => ({
        ...ProductEntity.fromObject({
          id: product.id,
          name: product.name,
          sale: product.sale,
          price: product.price,
          tags: product.tags,
          createdBy: product.createdBy,
          image: product.image?.startsWith('http')
            ? product.image
            : `products/${product.image}`,
        }),
      }));

      return {
        currentPage: page,
        maxPages,
        limit,
        total,
        next:
          page + 1 <= maxPages
            ? `/api/v1/products?page=${page + 1}&limit=${limit}`
            : null,
        prev:
          page - 1 > 0
            ? `/api/v1/products?page=${page - 1}&limit=${limit}`
            : null,
        products: productEntities,
      };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.log(error);
      throw CustomError.internalServer();
    }
  }

  public async createProduct(createProductDto: CreateProductDto) {
    try {
      const product = await ProductModel.create(createProductDto);

      const productEntity = ProductEntity.fromObject(product);

      return productEntity;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.log(error);
      throw CustomError.internalServer();
    }
  }
}
