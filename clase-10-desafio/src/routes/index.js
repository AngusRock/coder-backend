const express = require('express');
const router = express.Router();
const routerProductos = require('./productos');

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

module.exports = router;