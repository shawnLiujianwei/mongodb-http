/**
 * Created by shawn-liu on 2018/5/4.
 */
const morgan = require('morgan');
const logger = require('./components/getLogger')('mongodb-http-server');
const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const app = express();
const runMongo = require('./components/runMongoCommand');

const port = process.env.PORT || 3000;

app.use(morgan('short', {
  stream: {
    write(str) {
      logger.trace(str);
    }
  }
}));

app.use(compression({
  threshold: 10240// 10 kb
}));
app.use(bodyParser.json());
app.use(async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  return next();
});

app.post('/collection/:collection', async (req, res, next) => {
  try {
    const body = req.body;
    const col = req.params.collection;
    const {credentials, operation, args} = body;
    const results = await runMongo(credentials, col, operation, args);
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// app.post('/collection/:collection', async (req, res, next) => {
//   try {
//     const {credentials, operation, args} = body;
//     const col = req.params.collection;
//     const results = await runMongo(credentials, col, operation, args);
//     res.json(results);
//   } catch (err) {
//     next(err);
//   }
// });

app.use(async (err, req, res, next) => {
  if (err.url && err.url.indexOf('/favicon') !== -1) {
    next();
  } else {
    logger.error(err);
    if (err.code) {
      res.status(err.code).send(err.message);
    } else {
      res.status(500).send(err.message);
    }
  }
});

app.listen(port, () => {
  logger.info(`MongoDB http server listening on port ${port}`);
});
