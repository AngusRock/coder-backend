import express from 'express';
const router = express.Router();
import cartController from '../controllers/cartController.js';

// obtener todos los carritos
router.get('/', async (req, res) => {
    res.json(await cartController.getAllCarts())
})

// obtener carrito por id desde api
router.get('/:id/productos', async (req, res) => {
    const cartId = parseInt(req.params.id);
    let result = await cartController.getCartById(cartId)
    if(result != null && result != undefined) {
        res.json(result)
    } else {
        res.status(400).json({error: 'carrito con id '+cartId+' no encontrado'})
    }    
})

// insertar un carrito desde api
router.post('/', async (req, res) => {
    res.json({assigned_id: await cartController.insertCart()});
})

// insertar todos los productos en un carrito especifico desde api
router.post('/:id/productos', async (req, res) => {
    const cartId = parseInt(req.params.id);        
    let result = await cartController.insertProductByCartId(cartId);
    if(Object.keys(result) == 'error') {
        res.status(400).json(result);
    } else {
        res.json(result);
    }
})

// eliminar un carrito desde api
router.delete('/:id', async (req, res) => {    
    const cartId = parseInt(req.params.id);
    if(Number.isNaN(cartId)) {
        res.status(400).json({error: 'no se ha enviado un id numérico'});
    } else {
        let response = await cartController.deleteById(cartId);
        if(Object.keys(response) == 'error') {
            res.status(400).json(response);
        } else {            
            res.json(response);
        }
    }    
})

// eliminar un producto de un carrito desde api
router.delete('/:id/productos/:id_prod', async (req, res) => {    
    const cartId = parseInt(req.params.id);
    const prodId = parseInt(req.params.id_prod); 
    if(Number.isNaN(cartId)) {
        res.status(400).json({error: 'no se ha enviado un id numérico'});
    } else {
        let response = await cartController.deleteProductByCartIdAndProductId(cartId, prodId);
        if(Object.keys(response) == 'error') {
            res.status(400).json(response);
        } else {            
            res.json(response);
        }
    }    
})

//module.exports = router;
export default router;