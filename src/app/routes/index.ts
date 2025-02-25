import { Router } from 'express';
import { productRoutes } from '../modules/product/product.route';
import { orderRoutes } from '../modules/order/order.route';
import { authRoutes } from '../modules/Auth/auth.route';
import { userRoutes } from '../modules/user/user.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/products',
    route: productRoutes,
  },
  {
    path: '/orders',
    route: orderRoutes,
  },
];

// router.use('/auth', AuthRoutes);
// router.use('/users', UserRoutes);
// router.use('/products', ProductRoutes);
// router.use('/orders', OrderRoutes)

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
