import express from 'express';
import mainRouterMongo from '../routes/indexMongo.js';
import http from 'http';
console.log('netro');
const app = express();

app.use(express.json());

app.use('/mongo', mainRouterMongo);

app.use(function (err, req, res, next) {
  return res.status('500').json({
    msg: 'There was an unexpected error',
    error: err.message,
  });
});

const httpServer = http.Server(app);

export default httpServer;