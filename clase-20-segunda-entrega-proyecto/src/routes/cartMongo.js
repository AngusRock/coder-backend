import { Router } from 'express';
import {
  getAllCarts,
  getCartById,
  createCart,
  deleteCart,
  addAllProductsToCart,
  deleteProductFromCart,
} from '../controllers/cartControllerMongo.js';
const router = Router();

router.get('/', getAllCarts);

router.get('/:id', getCartById);

router.post('/', createCart);

router.delete('/:id', deleteCart);

router.post('/:id/products', addAllProductsToCart);

router.delete('/:id/products/:prodId', deleteProductFromCart);

export default router;