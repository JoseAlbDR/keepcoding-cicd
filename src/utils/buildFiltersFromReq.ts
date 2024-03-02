import { ITags } from '../data/seed/seed';
import { FiltersDto } from '../domain';

export interface QueryObject {
  name?: { $regex: string; $options: 'i' };
  price?: string | { [x: string]: string };
  sale?: boolean;
  tags?: { $in: ITags[] };
}

export class BuildFilterFromReq {
  static build(filtersDto: FiltersDto) {
    const { name, tags, sale, price } = filtersDto;

    let queryObject: QueryObject = {};

    // Filter by name
    if (name && typeof name === 'string') {
      queryObject.name = {
        $regex: name,
        $options: 'i',
      };
    }

    // Filter by tag
    if (tags) {
      queryObject.tags = {
        $in: tags,
      };
    }

    // Filter by sale type
    if (sale) {
      queryObject.sale = sale === 'onSale';
    }

    // Filter by price
    if (price && typeof price === 'string') {
      const [min, max] = price.split('-');
      if (min && max) queryObject.price = { $gte: min, $lte: max };
      if (price.startsWith('-')) queryObject.price = { $lte: max };
      if (price.endsWith('-')) queryObject.price = { $gte: min };
      if (max === undefined) queryObject.price = { $eq: min };
    }

    return queryObject;
  }
}
