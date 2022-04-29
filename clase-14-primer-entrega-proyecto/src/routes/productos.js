const express = require('express');
const router = express.Router();
const productsController = require('../controller/productsController')

const validateIsAdmin = (req, res, next) => {
    //const isAdmin = req.query.admin;
    const isAdmin = true //modificar boolean para cambiar permitir/restringir el acceso a ciertas path de la api
    if(isAdmin) 
       next();
    else {
        res.status(401).json(
            {
                error: -1,
                descripcion: 'ruta '+req.baseUrl+' (metodo '+req.method+') no autorizado'
            });             
    }        
}

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
router.post('/', validateIsAdmin, async (req, res) => {
    res.json({assigned_id: await productsController.insertProduct(req.body)});
})

// insertar un producto desde front-end
router.post('/guardar', async (req, res) => {
    const body = req.body;
    const newProduct = {
        nombre: body.nombre,
        descripcion: body.descripcion,
        codigo: body.codigo,
        foto: body.foto,
        precio: body.precio,
        stock: body.stock
    };
    console.log(newProduct);

    await productsController.insertProduct(newProduct);
    res.redirect('/');
})

// modificar un producto desde api
router.put('/:id', validateIsAdmin ,async (req, res) => {
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
router.delete('/:id', validateIsAdmin ,async (req, res) => {    
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