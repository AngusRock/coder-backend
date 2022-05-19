//const fs = require('fs');
import fs from 'fs';

let arrayOfCarts = [];
let arrayOfProducts = [];
let cartFileName = './src/cartItems.txt';
let productFileName = './src/productos.txt';
let product;
let cart;

class Cart {
    constructor() {
        this.timestamp = Date.now();
        this.productos = [];
    }
}

class Contenedor {
    constructor(fileName) {
        this.fileName = fileName;
    }

    async save(object){
        let assignedId = 0; //inicia de 0, pero al primer archivo le suma 1 unidad
        assignedId = updateFile(this.fileName, object, assignedId);
        return assignedId;
    }

    async getById(id){
        try {
            arrayOfCarts = JSON.parse(await fs.promises.readFile(cartFileName, 'utf-8'));
            return arrayOfCarts.find( item => item.id === id );
        } catch (error) {
            if(error.code == 'ENOENT') return {error: 'por favor verifique haber insertado carritos'};
            else return {error: error.message}
        }
    }

    async insertProductByCartId(cartId){
        try {
            arrayOfProducts = JSON.parse(await fs.promises.readFile(productFileName, 'utf-8'));
            /*product = arrayOfProducts.find( item => item.id === productId );

            if(product == undefined) return {error: 'no existe un producto con id '+productId};
            */
            arrayOfCarts = JSON.parse(await fs.promises.readFile(cartFileName, 'utf-8'));
            cart = arrayOfCarts.find( item => item.id === cartId );

            if(cart == undefined) return {error: 'no existe un carrito con id '+cartId};

            //cart.productos.push(product);

            cart.productos = arrayOfProducts;
            await fs.promises.writeFile(cartFileName, JSON.stringify(arrayOfCarts, null, 3))

            return {msg: 'todos los productos fueron insertados en el carrito con id '+cartId}
        } catch (error) {
            console.log('error',error);
            if(error.code == 'ENOENT') return {error: 'por favor verifique haber insertado productos y carritos'};
            else return {error: error.message}
        }
    }

    async getAll(){
        try {
            arrayOfCarts = JSON.parse(await fs.promises.readFile(cartFileName, 'utf-8'));
            return arrayOfCarts;
        } catch (error) {
            if(error.code == 'ENOENT') return {error: 'por favor verifique haber insertado carritos'};
            else return {error: error.message}
        }
    }

    async deleteById(id){
        try {
            arrayOfCarts = JSON.parse(await fs.promises.readFile(cartFileName, 'utf-8'));
            const i = arrayOfCarts.findIndex(item => item.id === id);
            if(i != -1) {
                arrayOfCarts.splice(i, 1); //elimina 1 elemento del indice obtenido
                await fs.promises.writeFile(cartFileName, JSON.stringify(arrayOfCarts, null, 3))
                console.log('id '+id+' eliminado');
                return {msg: 'carrito con id '+id+' eliminado'};
            } else {
                console.log('el id '+id+' no pudo ser eliminado ya que no se encontró');
                return {error: 'carrito con id '+id+' no encontrado'};
            }

        } catch (error) {
            console.log(error);
            return {error: error.message}
        }
    }

    async deleteProductById(cartId, productId){
        try {
            arrayOfCarts = JSON.parse(await fs.promises.readFile(cartFileName, 'utf-8'));
            cart = arrayOfCarts.find( item => item.id === cartId );

            if(cart == undefined) return {error: 'no existe un carrito con id '+cartId};

            const i = cart.productos.findIndex(item => item.id === productId);
            if(i != -1) {
                cart.productos.splice(i, 1); //elimina 1 elemento del indice obtenido
                await fs.promises.writeFile(cartFileName, JSON.stringify(arrayOfCarts, null, 3))
                console.log('id '+productId+' eliminado');
                return {msg: 'producto con id '+productId+' eliminado'};
            } else {
                console.log('el productId '+productId+' no pudo ser eliminado ya que no se encontró');
                return {error: 'producto con id '+productId+' no encontrado'};
            }

        } catch (error) {
            console.log('error',error);
            if(error.code == 'ENOENT') return {error: 'por favor verifique haber insertado productos y carritos'};
            else return {error: error.message}
        }
    }
}

async function updateFile(fileName, object, assignedId){
    // verificamos si el archivo existe y lo actualizamos
    try {
        arrayOfCarts = JSON.parse(await fs.promises.readFile(fileName, 'utf-8'));
        assignedId = getMaxId(arrayOfCarts)
        assignedId = writeFile(fileName, object, assignedId);
    }
    catch (error) {
        // si archivo no existe (error 'ENOENT'), lo creamos
        if(error.code === 'ENOENT') {
            assignedId = writeFile(fileName, object, assignedId)

        } else {
            console.log('error:', error)
        }
     }
     return assignedId;
}

async function writeFile(fileName, object, assignedId){
    try {
        object.id = ++assignedId;
        arrayOfCarts.push(object);
        await fs.promises.writeFile(fileName, JSON.stringify(arrayOfCarts, null, 3))
    }
    catch (error) {
        console.log('error:', error)
    }

    return assignedId;
}

function getMaxId(products){
    const ids = products.map(object => {
        return object.id;
      });
      //console.log(ids);

      const max = Math.max(...ids);
      return max;
}

const contenedor = new Contenedor(cartFileName);

async function createInitialCart() {
    await contenedor.save(new Cart());
    console.log('carrito inicial creado');
  }

async function insertCart(){
      return await contenedor.save(new Cart());
  }

export default {
    buildCart: createInitialCart,
    getAllCarts: contenedor.getAll,
    getCartById: contenedor.getById,
    insertCart: insertCart,
    deleteById: contenedor.deleteById,
    insertProductByCartId: contenedor.insertProductByCartId,
    deleteProductByCartIdAndProductId: contenedor.deleteProductById
};