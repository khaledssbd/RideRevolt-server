import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { authControllers } from './auth.controller';
import { authValidation } from './auth.validation';
import { upload } from '../../utils/sendImageToCloudinary';
import { USER_ROLE } from '../user/user.constant';
import { rateLimit, argsForForgotPassword, argsForLogin } from './auth.utils';

const router = express.Router();

// register new user
router.post(
  '/register',
  upload.single('file'),
  (req: Request, _res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(authValidation.registerUserValidationSchema),
  authControllers.registerUser,
);

// login user
router.post(
  '/login', // no auth() here as not logged in
  rateLimit(argsForLogin),
  validateRequest(authValidation.loginValidationSchema),
  authControllers.login,
);

// update profile
router.post(
  '/update-profile',
  auth(USER_ROLE.customer, USER_ROLE.admin), // logged in user
  upload.single('file'),
  (req: Request, _res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(authValidation.updateProfileValidationSchema),
  authControllers.updateProfile,
);

// change user password
router.post(
  '/change-password',
  auth(USER_ROLE.customer, USER_ROLE.admin), // logged in user
  validateRequest(authValidation.changePasswordValidationSchema),
  authControllers.changePassword,
);

// refresh user access token
router.post(
  '/refresh-token', // no auth() here as accessToken is expired
  validateRequest(authValidation.refreshTokenValidationSchema),
  authControllers.refreshToken,
);

// forget password - send email with reset link
router.post(
  '/forgot-password', // no auth() here as not logged in
  rateLimit(argsForForgotPassword),
  validateRequest(authValidation.forgotPasswordValidationSchema),
  authControllers.forgotPassword, // forget-password-STEP-1
);

// reset password - verify token and update password using reset link
router.post(
  '/reset-password', // no auth() here as not logged in
  validateRequest(authValidation.resetPasswordValidationSchema),
  authControllers.resetPassword, // forget-password-STEP-2
);

export const authRoutes = router;
