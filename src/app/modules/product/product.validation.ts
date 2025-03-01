import { z } from 'zod';

// createProduct validation using zod
const createProductValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required!',
        invalid_type_error: 'Name must be string!',
      })
      .trim()
      .min(2, { message: 'Name must have minimum 2 characters!' })
      .max(80, { message: 'Name cannot exceed 80 characters' }),

    brand: z
      .string({
        required_error: 'Brand is required!',
        invalid_type_error: 'Brand must be string!',
      })
      .trim()
      .max(45, { message: 'Brand cannot exceed 45 characters' }),

    model: z
      .string({
        required_error: 'Model is required!',
        invalid_type_error: 'Model must be string!',
      })
      .trim()
      .max(75, { message: 'Model cannot exceed 75 characters' }),

    price: z
      .number({
        required_error: 'Price is required!',
        invalid_type_error: 'Price must be a number!',
      })
      .positive()
      .min(1, 'Price must be a positive number'),

    category: z.enum(['Mountain', 'Road', 'Hybrid', 'Electric'], {
      errorMap: () => ({
        message:
          "Category must be one of 'Mountain', 'Road', 'Hybrid', or 'Electric'",
      }),
    }),

    description: z
      .string({
        required_error: 'Description is required!',
        invalid_type_error: 'Description must be string!',
      })
      .min(20, { message: 'Description must have minimum 20 characters!' })
      .trim(),

    quantity: z
      .number({
        required_error: 'Quantity is required!',
        invalid_type_error: 'Quantity must be a number!',
      })
      .positive()
      .int('Quantity must be an integer'),

    inStock: z
      .boolean()
      .refine(
        (value) => typeof value === 'boolean',
        'inStock must be a boolean',
      ),
  }),
});

// updateProductById validation using zod
const updateProductValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required!',
        invalid_type_error: 'Name must be string!',
      })
      .trim()
      .max(80, { message: 'Name cannot exceed 80 characters' }),

    brand: z
      .string({
        required_error: 'Brand is required!',
        invalid_type_error: 'Brand must be string!',
      })
      .trim()
      .max(45, { message: 'Brand cannot exceed 45 characters' }),

    model: z
      .string({
        required_error: 'Model is required!',
        invalid_type_error: 'Model must be string!',
      })
      .trim()
      .max(75, { message: 'Model cannot exceed 75 characters' }),

    price: z
      .number({
        required_error: 'Price is required!',
        invalid_type_error: 'Price must be a number!',
      })
      .positive()
      .min(1, 'Price must be a positive number'),

    category: z.enum(['Mountain', 'Road', 'Hybrid', 'Electric'], {
      errorMap: () => ({
        message:
          "Category must be one of 'Mountain', 'Road', 'Hybrid', or 'Electric'",
      }),
    }),

    description: z
      .string({
        required_error: 'Description is required!',
        invalid_type_error: 'Description must be string!',
      })
      .min(1, { message: 'Description is required!' })
      .trim(),

    quantity: z
      .number({
        required_error: 'Quantity is required!',
        invalid_type_error: 'Quantity must be a number!',
      })
      // .positive(), // owner wants to set quantity 0, but it strikes validation
      .int('Quantity must be an integer'),
    // .min(1, { message: 'Quantity is required!' }), // owner wants to set quantity 0, but it strikes validation

    inStock: z
      .boolean()
      .refine(
        (value) => typeof value === 'boolean',
        'inStock must be a boolean',
      ),
  }),
});

export const productValidation = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
