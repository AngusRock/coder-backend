import mongoose from 'mongoose';

export const cartCollectionName = 'cart';

const cartSchema = new mongoose.Schema(
  {
    productos : []
  },
  { timestamps: true, versionKey: false }
);

export const CartModel = mongoose.model(
  cartCollectionName,
  cartSchema
);