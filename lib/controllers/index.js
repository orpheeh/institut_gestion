const { v4: uuidv4 } = require('uuid');
const FormData = require("form-data");
const axios = require('axios');
const xml2js = require('xml2js');
const redis = require("../database/redis");

const users = require("../auth");

function saveOnce(uid, ref) {
    const array = JSON.stringify([ref]);
    redis.insert(uid, array);
}

async function save(uid, ref) {
    const data = await redis.get(uid);
    if (data) {
        try {
            const refs = JSON.parse(data);
            if (refs[0]) {
                refs.push(ref);
                console.log(refs);
                redis.insert(uid, JSON.stringify(refs));
            } else {
                saveOnce(uid, ref);
            }
        } catch (err) {
            saveOnce(uid, ref);
        }
    } else {
        saveOnce(uid, ref);
    }
}

async function getUser(ref) {
    for (let i = 0; i < users.length; i++) {
        const v = await find(users[i].uid, ref);
        if (v) {
            return users[i];
        }
    }
    return null;
}

async function find(uid, ref) {
    const data = await redis.get(uid);
    try {
        const refs = JSON.parse(data);
        return refs && refs.find(r => r == ref);
    } catch (err) {
        console.log(err);
        return null;
    }
}

module.exports = {

    async callack(req, res, next) {
        try {
            const xmlResponse = req.rawBody;
            const data = await xml2js.parseStringPromise(xmlResponse);
            const status = data.REPONSE.STATUT[0];
            const token = data.REPONSE.TOKEN[0];
            const ref = data.REPONSE.REF[0];
            const client = data.REPONSE.TEL_CLIENT[0];
            const user = await getUser(ref);
            if (user) {
                await axios.post(user.callback_url, {
                    status, ref, client, token
                }, {
                    headers: { "content-type": "application/json" }
                });
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    },

    async initTransactionParams(req, res, next){
      await initTransaction(req, res,next, req.params);  
    },
    
    async initTransactionBody(req, res, next){
      await initTransaction(req, res,next, req.body);  
    },
    
    async initTransaction(req, res, next, data) {
        try {
            const formData = new FormData();
            const reference = uuidv4().toString().substring(0, 13);
            const user = users.find(u => u.uid == data.uid);

            if (user) {
                formData.append("tel_marchand", user.tel);
                formData.append("montant", data.montant);
                formData.append("ref", reference);
                formData.append("tel_client", data.tel);
                formData.append("token", data.token);
                formData.append("action", "1");
                formData.append("service", "REST");
                formData.append("operateur", "AM");
                const httpResponse = await axios.post('https://mypvit.com/pvit-secure-full-api.kk', formData, {
                    headers: formData.getHeaders()
                });
                const xmlResponse = httpResponse.data;
                const data = await xml2js.parseStringPromise(xmlResponse);
                const status = data.REPONSE.STATUT[0];
                const ref = data.REPONSE.REF[0];
                const client = data.REPONSE.TEL_CLIENT[0];
                await save(user.uid, ref);
                res.send({ status, ref, client });
            } else {
                res.sendStatus(401);
            }
        } catch (err) {
            console.log(err);
            res.statusCode(500);
        }
    }

}
