const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rawBody = require('./my_module/rawdata_middleware');
const controller = require('./lib/controllers');
const app = express();

const options = {
  inflate: true,
  limit: '100kb',
  type: 'application/octet-stream'
};
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.raw(options));
app.use(rawBody.raw);

app.post('/paiement', controller.callack);
app.get('/paiement/:uid/:tel/:montant/:token', controller.initTransactionParams);
app.post('/paiement/secure', controller.initTransactionBody);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('PVIT paiement start at port ' + port));
