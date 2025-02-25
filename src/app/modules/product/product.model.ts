import { model, Schema } from 'mongoose';
import { TProduct } from './product.interface';

// Product Schema
const productSchema = new Schema<TProduct>(
  {
    name: {
      type: String,
      required: [true, 'Bike name is required!'],
      trim: true,
    },

    brand: {
      type: String,
      required: [true, 'Bike brand is required!'],
      trim: true,
    },

    model: {
      type: String,
      required: [true, 'Bike brand is required!'],
      trim: true,
    },

    price: { type: Number, required: [true, 'Bike price is required!'] },

    imageUrl: {
      type: String,
      required: [true, 'Image is required!'],
      trim: true,
    },

    category: {
      type: String,
      enum: {
        values: ['Mountain', 'Road', 'Hybrid', 'Electric'],
        message:
          "{VALUE} is not a valid category. It must be of one of the followings: 'Mountain', 'Road', 'Hybrid', 'Electric'.",
      },
      required: [true, 'Bike category is required!'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Bike description is required!'],
      trim: true,
    },

    quantity: { type: Number, required: [true, 'Bike quantity is required!'] },

    inStock: { type: Boolean, required: [true, 'Bike inStock is required!'] },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

// Product Query middleware #1 (for find)
productSchema.pre('find', function (next) {
  // while we are getting all data by using find method we want to exclude the data that has isDeleted: true
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Product Query middleware #2 (for findOne)
productSchema.pre('findOne', function (next) {
  // while we are getting single data by using findOne method we want to exclude the data that has isDeleted: true
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Product Query middleware #3 (for aggregate)
productSchema.pre('aggregate', function (next) {
  // while we are getting all data by using aggregate(find) method we want to exclude the data that has isDeleted: true
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// product Model
export const Product = model<TProduct>('Product', productSchema);
