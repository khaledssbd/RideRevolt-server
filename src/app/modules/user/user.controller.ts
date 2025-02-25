/* eslint-disable @typescript-eslint/no-explicit-any */
import tryCatchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { userService } from './user.service';

// get all users
const getAllUsers = tryCatchAsync(async (req, res) => {
  const result = await userService.getAllUsersFromDB();

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully!',
    data: result,
  });
});

// change user status
const blockUser = tryCatchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await userService.blockUserIntoDB(id, req.body);

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status is updated successfully!',
    data: result,
  });
});

export const userController = { getAllUsers, blockUser };
