const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/hello', (req, res, next) => {
   res.send('Hello World'); 
});

app.post('/', (req, res, next) => {
    console.log(req.body);
    
    const bac = req.body.bac;
    const concour = req.body.concour;
    const frais = req.body.frais;
    
    let message = '';
    if(bac && concour && frais){
        message = "Vous pouvez etudier a l' Institut de gestion";
    } else {
        message = "Vous ne pouvez pas etudier a l' Institut de gestion";
    }
    res.json({ message });
})

const port = 3000;

app.listen(port, () => console.log('Institut de gestion start at port ' + port));