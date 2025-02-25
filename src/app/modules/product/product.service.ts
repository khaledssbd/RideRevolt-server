/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from './product.model';
import { TProduct } from './product.interface';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import QueryBuilder from '../../builder/QueryBuilder';
import { ProductSearchableFields } from './product.constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

// create product
const postProductIntoDB = async (file: any, productData: TProduct) => {
  const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e3);
  const imageName = `${uniqueSuffix}-${productData?.name.replace(/ /g, '-')}`;
  const path = file?.buffer;

  // send image buffer to cloudinary
  const { secure_url } = await sendImageToCloudinary(imageName, path);
  productData.imageUrl = secure_url as string;

  const result = Product.create(productData);
  return result;
};

// get all products
const getAllProductsFromDB = async (query: Record<string, unknown>) => {
  const allProductQuery = new QueryBuilder(Product.find(), query)
    .search(ProductSearchableFields)
    .filter()
    .range()
    .sort()
    .paginate()
    .fields();

  const result = await allProductQuery.modelQuery;
  const meta = await allProductQuery.countTotal();

  return {
    meta,
    result,
  };
};

// get product by id
const getSingleProductFromDB = async (productID: string) => {
  // checking the _id validation for aggregate
  // if (!Types.ObjectId.isValid(productID)) {
  //   throw new AppError(httpStatus.BAD_REQUEST, 'Invalid ID!'); // match with handleCastError
  // }
  // const result = await productModel.aggregate([
  //   { $match: { _id: new Types.ObjectId(productID) } },
  // ]);
  //  return result[0] || null;

  // checking if the Product is exist
  const product = await Product.findById(productID);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
  }

  // checking if the Product is already deleted
  const isDeleted = product?.isDeleted;
  if (isDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This product is already deleted!',
    );
  }

  const result = await Product.findById(productID);
  return result;
};

// update product by id
const updateProductInDB = async (
  productID: string,
  file: any,
  updatedDoc: TProduct,
) => {
  // checking if the Product is exist
  const product = await Product.findById(productID);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
  }

  // checking if the Product is already deleted
  const isDeleted = product?.isDeleted;
  if (isDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This product is already deleted!',
    );
  }

  if (file) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e3);
    const imageName = `${uniqueSuffix}-${updatedDoc?.name.replace(/ /g, '-')}}`;
    const path = file?.buffer;

    // send image buffer to cloudinary
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    updatedDoc.imageUrl = secure_url as string;
  }

  const result = await Product.findByIdAndUpdate(productID, updatedDoc, {
    new: true, // returns the updated document, lest it returns the old document
  });
  return result;
};

// delete product by id
const deleteProductFromDB = async (productID: string) => {
  // checking if the Product is exist
  const product = await Product.findById(productID);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
  }

  // checking if the Product is already deleted
  const isDeleted = product?.isDeleted;
  if (isDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This product is already deleted!',
    );
  }

  // soft delete - update the isDeleted field to true
  await Product.findByIdAndUpdate(productID, { isDeleted: true });
  return null;
};

export const productService = {
  postProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  updateProductInDB,
  deleteProductFromDB,
};
