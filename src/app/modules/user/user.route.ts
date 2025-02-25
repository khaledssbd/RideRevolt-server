import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './user.constant';
import { userController } from './user.controller';
import { userValidation } from './user.validation';

const router = express.Router();

// change user status
router.post(
  '/block-user/:id',
  auth(USER_ROLE.admin),
  validateRequest(userValidation.blockUserValidationSchema),
  userController.blockUser,
);

// get all users
router.get('/', auth(USER_ROLE.admin), userController.getAllUsers);

export const userRoutes = router;
