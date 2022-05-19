import express from 'express';
const router = express.Router();
import routerProducts from './productsMongo.js';
import routerCart from './cartMongo.js';


router.get('/', (req, res) => {
    res.json({
        msg: "Router Principal Mongo"
    })
})

router.use('/products', routerProducts);
router.use('/carts', routerCart);

export default router;