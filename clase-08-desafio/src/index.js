const express = require('express');
const mainRouter = require('./routes/index');
const products = require('./productsHandler');
//const multer = require('multer');

//const upload = multer({ dest: './uploads'});
/** inicializar api */
const app = express();
const puerto = 8080;
const server = app.listen(puerto, () => {
    console.log('server puerto', puerto)
});

server.on('error', (err) => {
    console.log('server error', err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

/*definicion routers*/
app.use('/api', mainRouter);
/*app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    //res.json({message: 'Welcome'}) //aca tendria que mostrar el html
})*/

/*carga de archivos*/
/*app.post('/single', upload.single('imagen'), (req, res) => {
    try {
        console.log(req.file);
        res.send(req.file);        
    } catch (error) {
        res.send(400);        
    }
});*/

/*create array of product data*/
products.buildProductsFile();