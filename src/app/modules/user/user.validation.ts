import { z } from 'zod';
import { userStatus } from './user.constant';

// blockUser validation using zod
const blockUserValidationSchema = z.object({
  body: z.object({
    status: z.enum([...userStatus] as [string, ...string[]]),
  }),
});

export const userValidation = {
  blockUserValidationSchema,
};
