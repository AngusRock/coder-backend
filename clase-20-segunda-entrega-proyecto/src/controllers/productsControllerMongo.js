import { ProductsModel } from '../models/productsMongo.js';

export const checkBodyProduct = async (req, res, next) => {
  const { nombre, descripcion, codigo, foto, precio, stock } = req.body;  

  if (!nombre || !descripcion || !codigo || !foto || !precio || !stock)
    return res.status(400).json({
      msg: 'Missing Body fields',
    });

  next();
};

export const getAllProducts = async (req, res) => {
  try {
    const items = await ProductsModel.find();

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

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await ProductsModel.findById(id);

    if (!item)
      return res.status(404).json({
        msgs: 'Product not found!',
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

export const createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, codigo, foto, precio, stock } = req.body; 

    const newProduct = await ProductsModel.create({
      nombre,
      descripcion,
      codigo,
      foto,
      precio,
      stock      
    });

    res.json({
      data: newProduct,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, codigo, foto, precio, stock } = req.body;

    let item = await ProductsModel.findById(id);

    if (!item)
      return res.status(404).json({
        msgs: 'Product not found!',
      });

    const productUpdated = await ProductsModel.findByIdAndUpdate(
      id,
      { nombre, descripcion, codigo, foto, precio, stock },
      { new: true } //para retornar el documento actualizado en la respuesta
    );

    res.json({
      msg: 'Product updated',
      data: productUpdated,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await ProductsModel.findByIdAndDelete(id);    

    if (!item)
    return res.status(404).json({
      msg: 'Product not found!',
    });

    res.json({
      msg: 'Product deleted',
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
};