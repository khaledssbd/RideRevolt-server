import { model, Schema } from 'mongoose';
import { TOrder } from './order.interface';

// Order Schema
const orderSchema = new Schema<TOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // model name
      required: [true, 'User is required!'],
      trim: true,
    },

    product: {
      type: String,
      ref: 'Product', // model name
      required: [true, 'Product _id is required!'],
    },

    quantity: { type: Number, required: [true, 'Quantity is required!'] },

    totalPrice: {
      type: Number,
      required: [true, 'TotalPrice is required!'],
    },
    address: {
      type: String,
      required: [true, 'Address is required!'],
    },
    city: {
      type: String,
      required: [true, 'City is required!'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required!'],
    },

    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'],
      default: 'Pending',
    },

    estimatedDeliveryDate: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    },

    transaction: {
      id: String,
      transactionStatus: String,
      bank_status: String,
      sp_code: String,
      sp_message: String,
      method: String,
      date_time: String,
    },
  },

  { timestamps: true, versionKey: false },
);

// // Order update middleware for updateOne
// orderSchema.pre('updateOne', function (next) {
//   this.set({ updatedAt: new Date().toISOString() });
//   next();
// });

// order Model
export const Order = model<TOrder>('Order', orderSchema);
