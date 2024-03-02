import { Lodash } from '../../../config';
import { ProductModel } from '../../../data';
import { CustomError } from '../../../domain';
import { ProductEntity } from '../../../domain/entities/product.entity';

export class TagsService {
  constructor() {}

  public async getTags() {
    try {
      const products = await ProductModel.find();

      const productEntities = products.map((product) => ({
        ...ProductEntity.fromObject({
          id: product.id,
          name: product.name,
          sale: product.sale,
          price: product.price,
          tags: product.tags,
          createdBy: product.createdBy,
          image: product.image,
        }),
      }));

      const tags = Lodash.unique(productEntities);

      return tags;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.log(error);
      throw CustomError.internalServer();
    }
  }
}
