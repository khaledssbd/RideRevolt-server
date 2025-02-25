import AppError from '../../errors/AppError';
import { User } from './user.model';
import httpStatus from 'http-status';

// get all users
const getAllUsersFromDB = async () => {
  const users = await User.find();
  return users;
};

// change user status
const blockUserIntoDB = async (id: string, payload: { status: string }) => {
  // checking if the user is exist
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This account is already deleted!',
    );
  }

  // checking if the user is blocked
  // const userStatus = user?.status;
  // if (userStatus === 'blocked') {
  //   throw new AppError(
  //     httpStatus.FORBIDDEN,
  //     'This account already is already blocked!',
  //   );
  // }

  const { status } = payload;
  const result = await User.findByIdAndUpdate(
    id,
    { status },
    {
      new: true, // returns the updated document, lest it returns the old document
    },
  );
  return result;
};

export const userService = { getAllUsersFromDB, blockUserIntoDB };
