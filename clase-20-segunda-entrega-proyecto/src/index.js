import express from 'express';
import mainRouter from './routes/index.js';
import productsController from './controllers/productsController.js';
import cartController from './controllers/cartController.js';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import mongoServer from './services/serverMongo.js';
import { initMongoDB } from './services/databaseMongo.js';

/** inicializar api mongo*/
const init = async () => {
  await initMongoDB();
  const puerto = process.env.PORT || 8081;

  mongoServer.listen(puerto, () => console.log('SERVER MONGO PUERTO', puerto));
};

init();
//--------------------------

const app = express();
const puerto = 8080;
const server = app.listen(puerto, () => {
    console.log('SERVER LOCAL PUERTO', puerto)
});

const publicPath = path.resolve(fileURLToPath(import.meta.url),'../../public');
app.use(express.static(publicPath));

app.set('view engine', 'ejs');
const viewsPath = path.resolve(fileURLToPath(import.meta.url),'../../vistas');
app.set('views', viewsPath);

server.on('error', (err) => {
    console.log('server error', err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

/*front end views config*/
app.get('/', async (req, res) => {
  let productos = await productsController.getProducts();
  if(productos == null) { productos = []; }
  res.render('index', { productos });
});

app.get('/productos', async (req, res) => {
  let productos = await productsController.getProducts();
  if(productos == null) { productos = []; }
  res.render('tabla', { productos });
});
/*--------------------------------------*/

/*definicion routers*/
app.use('/api', mainRouter);
//mainRouter de mongo se encuentra definido en ./services/serverMongo.js

// mensaje error para rutas indefinidas
app.use((req, res) => {  
      res.status(404).json(
        {
          error: -2,
          descripcion: 'ruta '+req.baseUrl + req.path+' (metodo '+req.method+') no implementada'
        });
  }    
);

/*create array of product data*/
//productsController.buildProductsFile();
//cartController.buildCart();