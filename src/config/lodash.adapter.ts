import { uniq } from 'lodash';
import { ProductEntity } from '../domain';

export class Lodash {
  static unique(products: ProductEntity[]) {
    return uniq(products.flatMap((item) => item.tags));
  }
}
