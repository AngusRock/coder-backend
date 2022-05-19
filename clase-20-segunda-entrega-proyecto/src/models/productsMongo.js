import mongoose from 'mongoose';
import { categoryCollectionName } from './categoriesMongo.js';

export const productsCollectionName = 'product';

export const productsSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    codigo: { type: String, required: true },
    foto: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true }    
  },
  { timestamps: true, versionKey: false }
);

export const ProductsModel = mongoose.model(
  productsCollectionName,
  productsSchema
);