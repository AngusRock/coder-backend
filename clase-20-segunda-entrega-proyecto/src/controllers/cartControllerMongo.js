import { CartModel } from '../models/cartMongo.js';
import { ProductsModel } from '../models/productsMongo.js';
import mongoose from 'mongoose';

export const getAllCarts = async (req, res) => {
  try {
    const items = await CartModel.find();

    res.json({
      data: items,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
};

export const addAllProductsToCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await CartModel.findById(id);

    const allProducts = await ProductsModel.find();

    if (!cart)
      return res.status(404).json({
        msgs: 'Cart not found!',
      });
    if (!allProducts)
      return res.status(404).json({
        msgs: 'Products not found!',
      });

    const productos = allProducts;

    const cartUpdated = await CartModel.findByIdAndUpdate(
      id,
      { productos },
      { new: true } //para retornar el documento actualizado en la respuesta
    );

    res.json({
      msg: 'Products added to Cart with Id '+id,
      data: cartUpdated,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
};

export const getCartById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await CartModel.findById(id);

    if (!item)
      return res.status(404).json({
        msgs: 'Cart not found!',
      });

    res.json({
      data: item,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
};

// create new cart. no body needed
export const createCart = async (req, res) => {
  try {
    const productos  = [];

    const newCart = await CartModel.create({
      productos
    });

    res.json({
      data: newCart,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await CartModel.findByIdAndDelete(id);

    if (!item)
    return res.status(404).json({
      msg: 'Cart not found!',
    });

    res.json({
      msg: 'Cart deleted',
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { id, prodId } = req.params;
    const ObjectId = mongoose.Types.ObjectId;

    const cartUpdated = await CartModel.findByIdAndUpdate(
      id,
      { $pull : { productos : { _id : ObjectId(prodId) } } },
      { new: true } //para retornar el documento actualizado en la respuesta
    );
    res.json({
      msg: 'Product with Id '+prodId+' was deleted from Cart with Id '+id,
      data: cartUpdated
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
};