import express from 'express';
const router = express.Router();
import routerProductos from './products.js';
import routerCarrito from './cart.js';

const middleWare = (req, res, next) => {
    console.log('test middleware');
    next();
}

router.get('/', middleWare, (req, res) => {
    res.json({
        msg: "Router principal"
    })
})

router.use('/productos', routerProductos);
router.use('/carrito', routerCarrito);

//module.exports = router;
export default router;