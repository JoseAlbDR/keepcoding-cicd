export class PaginationDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number
  ) {}

  static create(
    page: number = 1,
    limit: number = 10
  ): [string?, PaginationDto?] {
    if (isNaN(page)) return ['Page  must be a number'];
    if (isNaN(limit)) return ['Limit  must be a number'];
    if (page <= 0) return ['Page must be greater than zero'];
    if (limit <= 0) return ['Limit must be greater than zero'];

    return [undefined, new PaginationDto(page, limit)];
  }
}
