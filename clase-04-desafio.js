const fs = require('fs');
let arrayOfProducts = [];

class Producto {
    constructor(name, price, stock) {
        this.name = name;
        this.price = price;
        this.stock = stock;
    }
}

class Contenedor {
    constructor(fileName) {
        this.fileName = fileName;
    }

    save(object){
        let fileObject;
        let assignedId = 0;
        assignedId = updateFile(this.fileName, object, assignedId);
        
        return assignedId;
    }

    async getById(id){
        try {
            arrayOfProducts = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'));
            return arrayOfProducts.find( item => item.id === id );
        } catch (error) {
            return null;
        }
    }

    getAll(){
        return arrayOfProducts;
    }

    async deleteById(id){
        try {
            arrayOfProducts = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'));
            const i = arrayOfProducts.findIndex(item => item.id === id);
            arrayOfProducts.splice(i, 1); //elimina 1 elemento del indice obtenido
            await fs.promises.writeFile(this.fileName, JSON.stringify(arrayOfProducts))
            if(i > 0) console.log('id '+id+' eliminado');
            else console.log('id '+id+' no pudo ser eliminado ya que no existe');
            
        } catch (error) {
            console.log(error);            
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
}

async function updateFile(fileName, object, assignedId){
    // verificamos si el archivo existe y lo actualizamos
    try {
        arrayOfProducts = JSON.parse(await fs.promises.readFile(fileName, 'utf-8'));
        assignedId = getMaxId(arrayOfProducts)
        assignedId = writeFile(fileName, object, assignedId);
    }
    catch (error) {
        // si archivo no existe, lo creamos
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
        await fs.promises.writeFile(fileName, JSON.stringify(arrayOfProducts))
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


const contenedor = new Contenedor('productos.txt');

// metodo a ejecutar
(async () => {
    console.log('id asignado: ',await contenedor.save(new Producto('disco 1',1500, 45)));
    console.log('id asignado: ',await contenedor.save(new Producto('disco 2',4400, 20)));
    console.log('id asignado: ',await contenedor.save(new Producto('disco test',5400, 10)));
    console.log('obtener por id',await contenedor.getById(3));
    await contenedor.deleteById(2);
    //await contenedor.deleteAll();  //metodo comentado para que no borre el contenido al final. se puede descomentar para testear  
  })()