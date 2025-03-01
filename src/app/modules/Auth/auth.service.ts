/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { TLoginUser, TUser } from '../user/user.interface';
import { createToken, verifyToken } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { User } from '../user/user.model';

type TUserData = Pick<
  TUser,
  'name' | 'gender' | 'email' | 'password' | 'role' | 'image'
>;

// register User
const registerUserIntoDB = async (file: any, payload: TUserData) => {
  // checking user email is either user
  const user = await User.findOne({ email: payload.email });
  if (user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Email already used!');
  } // no need to use this as I set email:unique in User model (will remove later)

  // set user role as user
  payload.role = 'customer';
  payload.email = payload.email.toLowerCase();

  // sending image is optional
  if (file) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e3);
    const imageName = `${uniqueSuffix}-${payload?.name.replace(/ /g, '-')}`;
    const path = file?.buffer;

    // send image buffer to cloudinary
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    payload.image = secure_url as string;
  }

  const newUser = await User.create(payload);
  return newUser;
};

// login User
const login = async (payload: TLoginUser) => {
  const userEmail = payload.email.toLowerCase();

  // checking if the user is exist
  const user = await User.isUserExistsByEmail(userEmail);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is deleted!');
  }

  // checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is blocked!');
  }

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password is not matched!');

  // create token and send to the client
  const jwtPayload = {
    email: user.email,
    name: user.name,
    image: user.image,
    gender: user.gender,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt.jwt_access_secret as string,
    config.jwt.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt.jwt_refresh_secret as string,
    config.jwt.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

// updateProfile
const updateProfileIntoDB = async (
  file: any,
  userData: JwtPayload,
  payload: TUser,
) => {
  const {
    email,
    password,
    passwordChangedAt,
    role,
    status,
    isDeleted,
    ...updateData
  } = payload;

  if (file) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e3);
    const imageName = `${uniqueSuffix}-${updateData?.name.replace(/ /g, '-')}`;
    const path = file?.buffer;

    // send image buffer to cloudinary
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    updateData.image = secure_url as string;
  }

  const newdata = await User.findOneAndUpdate(
    { email: userData.email, role: userData.role },
    updateData,
    {
      new: true,
    },
  );
  return newdata;
};

// change user Password
const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist - deleted - blocked already handled by auth() middleware
  const user = await User.isUserExistsByEmail(userData.email);

  // checking if the password is correct
  if (
    !(await User.isPasswordMatched(
      payload.oldPassword,
      user?.password as string,
    ))
  )
    throw new AppError(httpStatus.FORBIDDEN, 'Password is not matched!');

  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

// refresh user access token
const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt.jwt_refresh_secret as string);

  const { email, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByEmail(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is deleted!');
  }

  // checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is blocked!');
  }

  // checking if the any hacker using a token even-after the user changed the password
  if (
    user.passwordChangedAt &&
    (await User.isJWTIssuedBeforePasswordChanged(
      user.passwordChangedAt,
      iat as number,
    ))
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

  const jwtPayload = {
    email: user.email,
    name: user.name,
    image: user.image,
    gender: user.gender,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt.jwt_access_secret as string,
    config.jwt.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

// forget password - send email with reset link
const forgotPassword = async (userEmail: string) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(userEmail.toLowerCase());
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is deleted!');
  }

  // checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is blocked!');
  }

  const jwtPayload = {
    email: user.email,
    name: user.name,
    image: user.image,
    gender: user.gender,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt.jwt_access_secret as string,
    '10m',
  );

  const resetUILink = `${config.reset_pass_ui_page_link}?email=${user.email}&token=${resetToken}`;

  sendEmail(user.email, resetUILink);

  return null;
};

// reset password - verify token and update password using reset link
const resetPassword = async (payload: {
  email: string;
  newPassword: string;
  token: string;
}) => {
  // checking if the given token is valid(not empty string)
  if (!payload.token) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Token is required for resetting password!',
    );
  }

  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload?.email.toLowerCase());
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is deleted!');
  }

  // checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is blocked!');
  }

  const decoded = verifyToken(
    payload.token,
    config.jwt.jwt_access_secret as string,
  );

  if (payload.email !== decoded.email) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      email: decoded.email,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

export const authServices = {
  registerUserIntoDB,
  login,
  updateProfileIntoDB,
  changePassword,
  refreshToken,
  forgotPassword,
  resetPassword,
};
