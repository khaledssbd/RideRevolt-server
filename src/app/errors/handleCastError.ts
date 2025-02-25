import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

// if provided _id is invalid, mongoose will throw a CastError
const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const statusCode = 400;

  const errorSources: TErrorSources = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  return {
    statusCode,
    message: 'Invalid ID!',
    errorSources,
  };
};

export default handleCastError;
