import { TErrorSources, TGenericErrorResponse } from '../interface/error';

// if mongoose schema gets already used email(set-as-unique) to craete new document, it will throw error with this message
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const statusCode = 400;

  // Extract value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/);

  // The extracted value will be in the first capturing group
  const extractedMessage = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${extractedMessage} is already exists!`,
    },
  ];

  return {
    statusCode,
    message: 'Duplicate Error!',
    errorSources,
  };
};

export default handleDuplicateError;
