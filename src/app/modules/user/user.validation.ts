import { z } from 'zod';
import { userStatus } from './user.constant';

// blockUser validation using zod
const blockUserValidationSchema = z.object({
  body: z.object({
    status: z.enum([...userStatus] as [string, ...string[]], {
      errorMap: () => ({
        message: "Status must be one of 'in-progress' and 'blocked'!",
      }),
    }),
  }),
});

export const userValidation = {
  blockUserValidationSchema,
};
