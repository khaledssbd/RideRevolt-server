/* eslint-disable @typescript-eslint/no-explicit-any */
import { productService } from './product.service';
import tryCatchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

// create product
const createProduct = tryCatchAsync(async (req, res) => {
  const productData = req.body;
  const result = await productService.postProductIntoDB(req.file, productData);

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product added successfully!',
    data: result,
  });
});

// get all products
const getAllProducts = tryCatchAsync(async (req, res) => {
  const result = await productService.getAllProductsFromDB(req.query);

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully!',
    data: result,
  });
});

// get e product by id
const getProductById = tryCatchAsync(async (req, res) => {
  const productId = req.params.productId;

  const result = await productService.getSingleProductFromDB(productId);

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully!',
    data: result,
  });
});

// update product by id
const updateProductById = tryCatchAsync(async (req, res) => {
  const { productId } = req.params;
  const productData = req.body;

  const result = await productService.updateProductInDB(
    productId,
    req.file,
    productData,
  );

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully!',
    data: result,
  });
});

// delete product by id
const deleteProductById = tryCatchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await productService.deleteProductFromDB(productId);

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully!',
    data: result,
  });
});

export const productController = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
