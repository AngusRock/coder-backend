const express = require('express');
const mainRouter = require('./routes/index');
const productsController = require('./controller/productsController');
const cartController = require('./controller/cartController');
const path = require('path');
//const multer = require('multer');

//const upload = multer({ dest: './uploads'});
/** inicializar api */
const app = express();
const puerto = 8080;
const server = app.listen(puerto, () => {
    console.log('server puerto', puerto)
});

const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

app.set('view engine', 'ejs');
const viewsPath = path.resolve(__dirname, '../vistas');
app.set('views', viewsPath);

server.on('error', (err) => {
    console.log('server error', err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

/*root config*/
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

/*definicion routers*/
app.use('/api', mainRouter);

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