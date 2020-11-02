const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const FormData = require("form-data");
const axios = require('axios');
var xml2js = require('xml2js');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/', (req, res, next) => {
    
});

app.get('/:tel/:montant', async (req, res, next) => {
    
    try {
        const formData = new FormData();
    
        const reference = uuidv4().toString().substring(0, 13);
        
        formData.append("tel_marchand", '077574309');
        formData.append("montant", req.params.montant);
        formData.append("ref", reference);
        formData.append("tel_client", req.params.tel);
        formData.append("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..PUEWaqv1JR/O1Bu2IAR64Wmg7U61h01gQo8fvhXwDFE=");
        formData.append("action", "1");
        formData.append("service", "REST");
        formData.append("operateur", "AM");
    
        const httpResponse = await axios.post('https://mypvit.com/pvit-secure-full-api.kk', formData, {
            headers: formData.getHeaders()
        });
        const xmlResponse =  httpResponse.data;
        const data = await xml2js.parseStringPromise(xmlResponse);
        const status = data.REPONSE.STATUT[0];
        const ref = data.REPONSE.REF[0];
        const client = data.REPONSE.TEL_CLIENT[0];
        res.send({
            status,
            ref,
            client
        });
    } catch(err){
        console.log(err);
        res.statusCode(500);
    }
});

const port = 3000;

app.listen(port, () => console.log('Institut de gestion start at port ' + port));