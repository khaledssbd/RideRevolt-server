/* eslint-disable @typescript-eslint/no-explicit-any */
import { orderService } from './order.service';
import tryCatchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

// create Order
const createOrder = tryCatchAsync(async (req, res) => {
  const result = await orderService.createOrderIntoDB(
    req.body,
    req.user,
    req.ip!,
  );

  sendResponse<any>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order created successfully!',
    data: result,
  });
});

// Get total revenue for all orders
const getTotalRevenue = tryCatchAsync(async (req, res) => {
  const result = await orderService.getTotalRevenueFromDB();

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Revenue calculated successfully!',
    data: result,
  });
});

// Get all orders
const getAllOrders = tryCatchAsync(async (req, res) => {
  const result = await orderService.getAllOrders();

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully!',
    data: result,
  });
});

// Get order by ID
const getOrderById = tryCatchAsync(async (req, res) => {
  const result = await orderService.getOrderById(req.params.id);

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully!',
    data: result,
  });
});

// get orders by userId
const getOrdersByUserEmail = tryCatchAsync(async (req, res) => {
  const result = await orderService.getOrdersByUserEmail(req.params.email);

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully!',
    data: result,
  });
});

// Update order status
const updateOrderStatusManually = tryCatchAsync(async (req, res) => {
  const result = await orderService.updateOrderStatusManually(
    req.params.id,
    req.body.status,
  );

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order status updated successfully!',
    data: result,
  });
});

// verifyPayment
const verifyPayment = tryCatchAsync(async (req, res) => {
  const result = await orderService.verifyPayment(req.body.order_id);

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order verified successfully!',
    data: result,
  });
});

export const orderController = {
  createOrder,
  getTotalRevenue,
  getAllOrders,
  getOrderById,
  getOrdersByUserEmail,
  updateOrderStatusManually,
  verifyPayment,
};
