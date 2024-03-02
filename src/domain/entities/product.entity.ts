import { ITags } from '../../data/seed/seed';
import { CustomError } from '../';

export class ProductEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly sale: boolean,
    public readonly price: number,
    public readonly tags: ITags[],
    public readonly createdBy: string,
    public readonly image?: string
  ) {}

  static fromObject(obj: { [key: string]: any }) {
    const { id, _id, name, sale, price, tags, createdBy, image } = obj;

    if (!_id && !id) {
      throw CustomError.badRequest('Missing id');
    }
    if (!name) throw CustomError.badRequest('Missing name');
    if (!price) throw CustomError.badRequest('Missing price');
    if (typeof price !== 'number')
      throw CustomError.badRequest('Price must be a number');
    if (!createdBy) throw CustomError.badRequest('Missing created by');
    if (!tags || tags.length === 0)
      throw CustomError.badRequest('Missing tags');

    return new ProductEntity(
      _id || id,
      name,
      sale,
      price,
      tags,
      createdBy,
      image || ''
    );
  }
}
