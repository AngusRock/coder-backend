const fs = require('fs');
//const express = require('express');
//const multer = require('multer');
let arrayOfProducts = [];
let productFileName = './src/productos.txt';

class Producto {
    constructor(nombre, descripcion, codigo, foto, precio, stock) {
        this.timestamp = Date.now();
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.codigo = codigo;
        this.foto = foto;
        this.precio = precio;
        this.stock = stock;
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
            arrayOfProducts = JSON.parse(await fs.promises.readFile(productFileName, 'utf-8'));
            return arrayOfProducts.find( item => item.id === id );            
        } catch (error) {
            return null;
        }
    }

    async getAll(){
        try {
            arrayOfProducts = JSON.parse(await fs.promises.readFile(productFileName, 'utf-8'));            
            return arrayOfProducts;
        } catch (error) {
            return null;
        }
    }

    async deleteById(id){
        try {
            arrayOfProducts = JSON.parse(await fs.promises.readFile(productFileName, 'utf-8'));
            const i = arrayOfProducts.findIndex(item => item.id === id);            
            if(i != -1) {
                arrayOfProducts.splice(i, 1); //elimina 1 elemento del indice obtenido
                await fs.promises.writeFile(productFileName, JSON.stringify(arrayOfProducts, null, 3))             
                console.log('id '+id+' eliminado');
                return {msg: 'producto con id '+id+' eliminado'};
            } else {
                console.log('el id '+id+' no pudo ser eliminado ya que no se encontró');
                return {error: 'producto con id '+id+' no encontrado'};
            }
            
        } catch (error) {
            console.log(error);
            return error;           
        }
        
    }

    async deleteAll(){
        try {            
            arrayOfProducts = [];            
            let fileContent = await fs.promises.readFile(this.fileName, 'utf-8');
            fileContent = '';
            await fs.promises.writeFile(this.fileName, fileContent)
            console.log('contenido archivo luego de eliminación: ',fileContent)            
        } catch (error) {
            console.log(error);            
        }
    }

     async updateById(id, object){
        try {            
            const i = arrayOfProducts.findIndex(item => item.id === id);            
            if(i != -1) {
                object.id = id;
                arrayOfProducts[i] = object;                
                await fs.promises.writeFile(productFileName, JSON.stringify(arrayOfProducts, null, 3))
                return {msg: 'producto con id '+id+ ' actualizado'};
            } else {
                return {error: 'producto con id '+id+' no encontrado'};
            }
            
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

async function updateFile(fileName, object, assignedId){
    // verificamos si el archivo existe y lo actualizamos
    try {
        arrayOfProducts = JSON.parse(await fs.promises.readFile(fileName, 'utf-8'));
        assignedId = getMaxId(arrayOfProducts)
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
        arrayOfProducts.push(object);
        await fs.promises.writeFile(fileName, JSON.stringify(arrayOfProducts, null, 3))
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

/*const server = http.createServer((peticion, respuesta) => {
    respuesta.end('Hola rock')
})

const connectedServer = server.listen(8080, () => {
    console.log(`Server escucha puerto ${connectedServer.address().port}`)
})*/

const contenedor = new Contenedor(productFileName);

// metodo a ejecutar
/*(async () => {
    console.log('id asignado: ',await contenedor.save(new Producto('disco 1',1500, 45)));
    console.log('id asignado: ',await contenedor.save(new Producto('disco 2',4400, 20)));
    console.log('id asignado: ',await contenedor.save(new Producto('disco test',5400, 10)));
    console.log('obtener por id',await contenedor.getById(3));
    console.log('obtener todos los productos',await contenedor.getAll());
    await contenedor.deleteById(2);
    //await contenedor.deleteAll();  //metodo comentado para que no borre el contenido. se puede descomentar para testear  
  })()*/

  async function createInitialProducts() { 
    await contenedor.save(new Producto('Black Album',1500, 'https://cdn3.iconfinder.com/data/icons/fantasy-and-role-play-game-adventure-quest/512/Destructive_Magic-48.png'));
    await contenedor.save(new Producto('Zeppelin IV',4400, 'https://cdn3.iconfinder.com/data/icons/fantasy-and-role-play-game-adventure-quest/512/Potion-48.png'));
    await contenedor.save(new Producto('Physical Graffiti',5400, 'https://cdn2.iconfinder.com/data/icons/party-new-years/128/Party_Newyears_Soda-48.png'));
    console.log('productos iniciales creados');
    //console.log('obtener por id',await contenedor.getById(3));
    //console.log('obtener todos los productos',await contenedor.getAll());
    //await contenedor.deleteById(2);
  }

  async function insertProduct(object){
      return await contenedor.save(new Producto(object.nombre, object.descripcion, object.codigo, object.foto, parseInt(object.precio), parseInt(object.stock)));
      nombre, descripcion, codigo, foto, precio, stock
  }

module.exports = {
    buildProductsFile: createInitialProducts,
    getProducts: contenedor.getAll,
    getProductId: contenedor.getById,
    insertProduct: insertProduct,
    updateById: contenedor.updateById,
    deleteById: contenedor.deleteById
};
