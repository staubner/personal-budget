const express = require('express');
const apiRouter = express.Router();
const bodyParser = require('body-parser')

const {
    getAllEnvelopes,

} = require('../db/db')

apiRouter.use(bodyParser.json());

apiRouter.get('/', (req, res) => {
    res.send(getAllEnvelopes())
});

module.exports = apiRouter;