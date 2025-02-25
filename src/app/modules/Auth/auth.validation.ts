import { z } from 'zod';
// in zod by default every field is required.. for optional must use .optional()

// registerUser validation using zod
const registerUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Name must be string!',
        required_error: 'Name is required!',
      })
      .trim()
      .min(5, { message: 'Name must have minimum 5 characters!' })
      .max(30, { message: "Name can't exceed 30 characters!" }),

    // gender: z.enum(['male', 'female', 'other'], {
    //   errorMap: () => ({
    //     message: "Gender must be one of 'male', 'female', or 'other'!",
    //   }),
    // }), // later will uncomment the upper part

    email: z
      .string({
        required_error: 'Email is required!',
        invalid_type_error: 'Email must be string!',
      })
      .trim()
      .email({ message: 'Invalid email address!' }),

    password: z
      .string({
        required_error: 'Password is required!',
        invalid_type_error: 'Password must be a string!',
      })
      .min(8, { message: "Password can't be less then 8 characters!" })
      .max(20, { message: "Password can't be more then 20 characters!" }),
  }),
});

// login validation using zod
const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required!',
        invalid_type_error: 'Email must be string!',
      })
      .trim()
      .email({ message: 'Invalid email address!' }),

    password: z
      .string({
        required_error: 'Password is required!',
        invalid_type_error: 'Password must be a string!',
      })
      .min(8, { message: "Password can't be less then 8 characters!" })
      .max(20, { message: "Password can't be more then 20 characters!" }),
  }),
});

// updateProfile validation using zod
const updateProfileValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Name must be string!',
        required_error: 'Name is required!',
      })
      .trim()
      .min(5, { message: 'Name must have minimum 5 characters!' })
      .max(30, { message: "Name can't exceed 30 characters!" }),

    gender: z.enum(['male', 'female', 'other'], {
      errorMap: () => ({
        message: "Gender must be one of 'male', 'female', or 'other'!",
      }),
    }),
  }),
});

// changePassword validation using zod
const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required!',
      invalid_type_error: 'Old password must be string!',
    }),

    newPassword: z
      .string({
        required_error: 'New Password is required!',
        invalid_type_error: 'New password must be string!',
      })
      .min(8, { message: "New password can't be less then 8 characters!" })
      .max(20, { message: "New password can't be more then 20 characters!" }),
  }),
});

// refreshToken validation using zod
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
      invalid_type_error: 'Refresh token must be string!',
    }),
  }),
});

// forgotPassword validation using zod
const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required!',
        invalid_type_error: 'Email must be string!',
      })
      .trim()
      .email({ message: 'Invalid email address!' }),
  }),
});

// resetPassword validation using zod
const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required!',
        invalid_type_error: 'Email must be string!',
      })
      .trim()
      .email({ message: 'Invalid email address!' }),

    newPassword: z
      .string({
        required_error: 'New Password is required!',
        invalid_type_error: 'New password must be string!',
      })
      .min(8, { message: "New password can't be less then 8 characters!" })
      .max(20, { message: "New password can't be more then 20 characters!" }),
  }),
});

export const authValidation = {
  registerUserValidationSchema,
  loginValidationSchema,
  updateProfileValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
};
