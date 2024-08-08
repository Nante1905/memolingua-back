export class Paginated<T> {
  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.totalPage = Math.ceil(total / limit);
  }

  items: T[];
  total: number;
  page: number;
  totalPage: number;
}
