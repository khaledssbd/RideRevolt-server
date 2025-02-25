import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query.searchTerm;

    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
              //  }) ,
            }) as FilterQuery<T>, // ei line comment kore uporerta uncomment dileo hoy
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query }; // copy

    // filtering
    const excludeFields = [
      'searchTerm',
      'sort',
      'page',
      'limit',
      'fields',
      'minPrice',
      'maxPrice',
    ];
    excludeFields.forEach((field) => delete queryObj[field]);

    // this.modelQuery = this.modelQuery.find(queryObj);
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>); // uporerta dileo hoy

    return this;
  }

  range() {
    const minPrice = Number(this?.query?.minPrice);
    const maxPrice = Number(this?.query?.maxPrice);

    const filter: { price?: { $gte?: number; $lte?: number } } = {};

    if (minPrice && maxPrice) {
      filter['price'] = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      filter['price'] = { $gte: minPrice };
    } else if (maxPrice) {
      filter['price'] = { $lte: maxPrice };
    }

    this.modelQuery = this.modelQuery.find(filter as FilterQuery<T>);

    return this;
  }

  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';

    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__V';

    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
