import { TAGS, Validators } from '../../../config';
import { ITags } from '../../../data/seed/seed';

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly onSale: boolean,
    public readonly price: number,
    public readonly tags: ITags[],
    public readonly createdBy: string,
    public readonly image?: string
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateProductDto?] {
    const { name, onSale = true, price, tags, createdBy, image = '' } = props;

    if (!name || name === '') return ['Missing name'];

    let onSaleBoolean = onSale;
    if (typeof onSale !== 'boolean') onSaleBoolean = onSale === 'true';

    if (!price) return ['Price is required'];
    if (isNaN(price)) return ['Price is not a number'];
    if (price <= 0) return ['Price must be greater than zero'];

    if (!tags || tags.length === 0) return ['Tags are required'];
    if (!Validators.isValidTag(tags))
      return [`Not allowed tags used, allowed tags: ${TAGS.join(', ')}`];

    if (!createdBy) return ['Created by is required'];
    if (!Validators.isMongoID(createdBy))
      return ['Created by is not a valid MongoID'];

    return [
      undefined,
      new CreateProductDto(name, onSaleBoolean, price, tags, createdBy, image),
    ];
  }
}
