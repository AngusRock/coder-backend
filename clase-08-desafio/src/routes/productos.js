const express = require('express');
const router = express.Router();
const products = require('../productsHandler')

// obtener todos los productos
router.get('/', async (req, res) => {
    res.json(await products.getProducts())
})

// obtener producto por id
router.get('/:id', async (req, res) => {
    const prodId = parseInt(req.params.id);
    let result = await products.getProductId(prodId)
    if(result != null && result != undefined) {
        res.json(result)
    } else {
        res.status(400).json({error: 'producto no encontrado'})
    }    
})

// insertar un producto
router.post('/', async (req, res) => {
    res.json({assigned_id: await products.insertProduct(req.body)});
})

// modificar un producto
router.put('/:id', async (req, res) => {
    const prodId = parseInt(req.params.id);
    if(Number.isNaN(prodId)) {
        res.status(400).json({error: 'no se ha enviado un id numérico'});
    } else if(Object.keys(req.body).length === 0) {
        res.status(400).json({error: 'el body no puede estar vacio'});
    } else {
        let response = await products.updateById(prodId, req.body);
        if(Object.keys(response) == 'error') {
            res.status(400).json(response);            
        } else {            
            res.json(response);
        }
    }
})

// eliminar un producto
router.delete('/:id', async (req, res) => {    
    const prodId = parseInt(req.params.id);
    if(Number.isNaN(prodId)) {
        res.status(400).json({error: 'no se ha enviado un id numérico'});
    } else {
        let response = await products.deleteById(prodId);
        if(Object.keys(response) == 'error') {
            res.status(400).json(response);
        } else {            
            res.json(response);
        }
    }    
})

module.exports = router;