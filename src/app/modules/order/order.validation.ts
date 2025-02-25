import { z } from 'zod';

// createOrder validation using zod
const createOrderValidationSchema = z.object({
  body: z.object({
    // user: z
    //   .string({
    //     required_error: 'User is required!',
    //     invalid_type_error: 'User must be string!',
    //   })
    //   .trim(),

    product: z
      .string({
        required_error: 'Product is required!',
        invalid_type_error: 'Product must be string!',
      })
      .trim()
      .min(1, { message: 'Product is required!' }),

    quantity: z
      .number({
        required_error: 'Quantity is required!',
        invalid_type_error: 'Quantity must be string!',
      })
      .int('Quantity must be an integer')
      .min(1, 'Price must be a positive number'),

    // totalPrice: z
    //   .number({
    //     required_error: 'Price is required!',
    //     invalid_type_error: 'Price must be string!',
    //   })
    //   .int('Price must be an integer')
    //   .min(1, 'Price must be a positive number'),
  }),
});

// update Order Validation Schema
const updateOrderValidationSchema = z.object({
  body: z.object({
    status: z.enum(['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled']),
  }),
});

// get Orders By User Email

// update Order Validation Schema
const verifyPaymentValidationSchema = z.object({
  body: z.object({
    order_id: z
      .string({
        required_error: 'order_id is required!',
        invalid_type_error: 'order_id must be string!',
      })
      .trim(),
  }),
});

export const orderValidation = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
  verifyPaymentValidationSchema,
};
