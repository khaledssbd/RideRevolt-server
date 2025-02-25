import express from 'express';
import { orderController } from './order.controller';
import { orderValidation } from './order.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// create Order
router.post(
  '/',
  auth(USER_ROLE.customer,),
  validateRequest(orderValidation.createOrderValidationSchema),
  orderController.createOrder,
);

// Get total revenue for all orders
router.get('/revenue', auth(USER_ROLE.admin), orderController.getTotalRevenue);

// Get all orders by admin
router.get('/', auth(USER_ROLE.admin), orderController.getAllOrders);

// get order by id
router.get('/:id', auth(USER_ROLE.admin), orderController.getOrderById);

// get orders by UserEmail
router.get(
  '/user/:email',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  orderController.getOrdersByUserEmail,
);

// update order status Manually by id
router.post(
  '/update/:id',
  auth(USER_ROLE.admin),
  validateRequest(orderValidation.updateOrderValidationSchema),
  orderController.updateOrderStatusManually,
);

// verifyPayment
router.post(
  '/verify',
  auth(USER_ROLE.admin),
  validateRequest(orderValidation.verifyPaymentValidationSchema),
  orderController.verifyPayment,
);

export const orderRoutes = router;
