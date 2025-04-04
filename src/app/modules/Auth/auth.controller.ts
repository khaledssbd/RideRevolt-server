/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import config from '../../config';
import tryCatchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authServices } from './auth.service';

// register User
const registerUser = tryCatchAsync(async (req, res) => {
  const userData = req.body;
  const result = await authServices.registerUserIntoDB(req.file, userData);

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Registration is successfull!',
    data: result,
  });
});

// login User
const login = tryCatchAsync(async (req, res) => {
  const result = await authServices.login(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 365, // one year
  });

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged in succesfully!',
    data: {
      accessToken,
    },
  });
});

// updateProfile
const updateProfile = tryCatchAsync(async (req, res) => {
  const userData = req.body;
  const result = await authServices.updateProfileIntoDB(
    req.file,
    req.user,
    userData,
  );

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile is updated successfully!',
    data: result,
  });
});

// change user Password
const changePassword = tryCatchAsync(async (req, res) => {
  const result = await authServices.changePassword(req.user, req.body);

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is updated succesfully!',
    data: result,
  });
});

// refresh user access token
const refreshToken = tryCatchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const { accessToken } = await authServices.refreshToken(refreshToken);

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved succesfully!',
    data: {
      accessToken,
    },
  });
});

// forget password - send email with reset link
const forgotPassword = tryCatchAsync(async (req, res) => {
  const userEmail = req.body.email;
  const result = await authServices.forgotPassword(userEmail);

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reset link is generated succesfully!',
    data: result,
  });
});

// reset password - verify token and update password using reset link
const resetPassword = tryCatchAsync(async (req, res) => {
  const result = await authServices.resetPassword(req.body);

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successful!',
    data: result,
  });
});

export const authControllers = {
  registerUser,
  login,
  updateProfile,
  changePassword,
  refreshToken,
  forgotPassword,
  resetPassword,
};
