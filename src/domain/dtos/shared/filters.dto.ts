import { TAGS, Validators } from '../../../config';
import { ITags } from '../../../data/seed/seed';

export class FiltersDto {
  private constructor(
    public readonly name?: string,
    public readonly sale?: string,
    public readonly price?: string,
    public readonly tags?: ITags[]
  ) {}

  static create(props: { [key: string]: any }): [string?, FiltersDto?] {
    const { name, price, sale, tags } = props;

    if (price) {
      if (!Validators.isValidPrice(price))
        return [
          `Price: ${price} is not a valid filter, allowed price filter are: number-, -number, number-number`,
        ];
      const [min, max] = price.split('-');
      if (isNaN(+min) && isNaN(+max))
        return ['Min and max prices must be numbers'];
      else if (+min < 0) return ['Min price must be greater than zero'];
      else if (+max < 0) return ['Min price must be greater than zero'];
    }

    if (sale && sale !== 'onSale' && sale !== 'onSearch')
      return [`Sale: ${sale} not allowed, alowed values: 'onSale', 'onSearch`];

    let arrayTag;
    if (tags) {
      arrayTag = tags.split(',');
      if (!Validators.isValidTag(arrayTag))
        return [`Tag must be a valid tag, allowed values: ${TAGS.join(', ')} `];
    }

    return [undefined, new FiltersDto(name, sale, price, arrayTag)];
  }
}
