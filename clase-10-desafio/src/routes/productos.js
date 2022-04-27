const express = require('express');
const router = express.Router();
const productsController = require('../controller/productsController')

// obtener todos los productos
router.get('/', async (req, res) => {
    res.json(await productsController.getProducts())
})

// obtener producto por id desde api
router.get('/:id', async (req, res) => {
    const prodId = parseInt(req.params.id);
    let result = await productsController.getProductId(prodId)
    if(result != null && result != undefined) {
        res.json(result)
    } else {
        res.status(400).json({error: 'producto no encontrado'})
    }    
})

// insertar un producto desde api
router.post('/', async (req, res) => {
    res.json({assigned_id: await productsController.insertProduct(req.body)});
})

// insertar un producto desde front-end
router.post('/guardar', async (req, res) => {
    const body = req.body;
    const newProduct = {
        title: body.title,
        price: body.price,
        thumbnail: body.thumbnail
    };
    console.log(newProduct);

    await productsController.insertProduct(newProduct);
    res.redirect('/');
})

// modificar un producto desde api
router.put('/:id', async (req, res) => {
    const prodId = parseInt(req.params.id);
    if(Number.isNaN(prodId)) {
        res.status(400).json({error: 'no se ha enviado un id numérico'});
    } else if(Object.keys(req.body).length === 0) {
        res.status(400).json({error: 'el body no puede estar vacio'});
    } else {
        let response = await productsController.updateById(prodId, req.body);
        if(Object.keys(response) == 'error') {
            res.status(400).json(response);            
        } else {            
            res.json(response);
        }
    }
})

// eliminar un producto desde api
router.delete('/:id', async (req, res) => {    
    const prodId = parseInt(req.params.id);
    if(Number.isNaN(prodId)) {
        res.status(400).json({error: 'no se ha enviado un id numérico'});
    } else {
        let response = await productsController.deleteById(prodId);
        if(Object.keys(response) == 'error') {
            res.status(400).json(response);
        } else {            
            res.json(response);
        }
    }    
})

module.exports = router;