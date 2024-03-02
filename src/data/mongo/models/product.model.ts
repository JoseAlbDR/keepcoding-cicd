import mongoose from 'mongoose';
import { TAGS } from '../../../config';

// Define the schema for the Product collection
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      index: true,
    },
    sale: {
      type: Boolean,
      default: false,
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      index: true,
    },
    image: {
      type: String,
    },
    tags: {
      type: [String],
      index: true,
      required: [true, 'Tag is required'],
      validate: {
        // Validate that all tags in the array are included in the TAGS constant
        validator: (tags: string[]) => {
          return tags.every((tag) => TAGS.includes(tag));
        },
      },
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Create the Product model based on the schema
export const ProductModel = mongoose.model('Product', ProductSchema);
