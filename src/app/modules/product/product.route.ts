import express, { NextFunction, Request, Response } from 'express';
import { productController } from './product.controller';
import auth from '../../middlewares/auth';
import { upload } from '../../utils/sendImageToCloudinary';
import validateRequest from '../../middlewares/validateRequest';
import { productValidation } from './product.validation';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// create Product
router.post(
  '/',
  auth(USER_ROLE.admin),
  upload.single('file'),
  (req: Request, _res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(productValidation.createProductValidationSchema),
  productController.createProduct,
);

// get all Products
router.get('/', productController.getAllProducts);

// get Product by id
router.get('/:productId', productController.getProductById);

// update Product by id
router.post(
  '/update/:productId',
  auth(USER_ROLE.admin),
  upload.single('file'),
  (req: Request, _res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(productValidation.updateProductValidationSchema),
  productController.updateProductById,
);

// delete Product by id
router.delete(
  '/:productId',
  auth(USER_ROLE.admin),
  productController.deleteProductById,
);

export const productRoutes = router;
