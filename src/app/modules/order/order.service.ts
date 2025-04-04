import { Product } from '../product/product.model';
import { Order } from './order.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../user/user.model';
import { orderUtils } from './order.utils';
import { Types } from 'mongoose';

type TOrderPayload = {
  product: string;
  quantity: number;
  address: string;
  city: string;
  phone: string;
};

// create Order
const createOrderIntoDB = async (
  payload: TOrderPayload,
  userData: JwtPayload,
  client_ip: string,
) => {
  // const product = await Product.findOne({
  //   _id: new Types.ObjectId(payload.product),
  // });

  if (!Types.ObjectId.isValid(payload.product)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Product ID!');
  }

  // Find the product to check the available quantity
  const product = await Product.findById(payload.product);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
  }

  if (product.quantity < payload.quantity || product.quantity === 0) {
    throw new AppError(httpStatus.INSUFFICIENT_STORAGE, 'Insufficient stock!');
  }

  // getting user for user _id
  const user = await User.findOne({ email: userData.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // decrease the ordered quantity from the product's quantity
  await product.updateOne({
    $inc: { quantity: -payload.quantity },
    $set: { inStock: product.quantity - payload.quantity > 0 },
  });

  // giving user an address!, city!, phone! in first order
  if (user.address === 'N/A' || user.city === 'N/A' || user.phone === 'N/A') {
    await user.updateOne({
      address: payload.address,
      city: payload.city,
      phone: payload.phone,
    });
  }
  const totalPrice = payload.quantity * product.price;

  const orderData = {
    user: user?._id,
    product: payload.product,
    quantity: payload.quantity,
    totalPrice,
    address: payload.address,
    city: payload.city,
    phone: payload.phone,
    status: 'Pending',
  };

  // creating order initialy
  let order = await Order.create(orderData);

  // payment integration starts here
  const shurjopayPayload = {
    amount: totalPrice,
    order_id: order._id,
    currency: 'BDT',
    customer_name: user.name,
    customer_email: user.email,
    customer_address: payload.address,
    customer_city: payload.city,
    customer_phone: payload.phone,
    client_ip,
  };

  const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

  // updating order status based on shurjopay payment status
  if (payment?.transactionStatus) {
    order = await order.updateOne({
      transaction: {
        id: payment.sp_order_id,
        transactionStatus: payment.transactionStatus,
      },
    });
  }

  return payment.checkout_url;
};

// Get total revenue for all orders
const getTotalRevenueFromDB = async () => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
      },
    },
  ]);

  return result;
};

// get all orders
const getAllOrders = async () => {
  const data = await Order.find().populate('product').populate('user');
  return data;
};

// get order by id
const getOrderById = async (orderId: string) => {
  const data = await Order.findById(orderId);

  if (!data) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found!');
  }

  return data;
};

// get orders by user id
const getOrdersByUserEmail = async (userEmail: string) => {
  // Find the user to check the existence
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const orders = await Order.find({ user: user._id }).populate('product');
  return orders;
};

// update order status
const updateOrderStatusManually = async (orderId: string, status: string) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found!');
  }

  // Prevent invalid state transitions
  if (
    (status === 'Pending' && order.status !== 'Pending') ||
    (status === 'Paid' && order.status !== 'Pending') ||
    (status === 'Shipped' && order.status !== 'Paid') ||
    (status === 'Completed' && order.status !== 'Shipped') ||
    order.status === 'Cancelled'
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `Invalid status transition from '${order.status}' to '${status}'!`,
    );
  }

  // update order status in database
  const result = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true },
  );
  return result;
};

// verifyPayment
const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await Order.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'Failed'
              : verifiedPayment[0].bank_status == 'Cancel'
                ? 'Cancelled'
                : 'No-Res',
      },
    );
  }

  return verifiedPayment;
};

export const orderService = {
  createOrderIntoDB,
  getTotalRevenueFromDB,
  getAllOrders,
  getOrderById,
  getOrdersByUserEmail,
  updateOrderStatusManually,
  verifyPayment,
};
