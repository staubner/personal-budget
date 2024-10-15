const express = require('express');
const apiRouter = express.Router();
const bodyParser = require('body-parser')

const {
    getAllEnvelopes,
    addEnvelope,
    getEnvelopeById,
    getEnvelopeByName,
    updateEnvelope,

} = require('../db/db')

apiRouter.use(bodyParser.json());

apiRouter.param('id', (req, res, next, id) => {
    const envelope = getEnvelopeById(id);
    if (envelope) {
        req.envelope = envelope;
        next();
    } else {
        res.status(404).send();
    }
})

apiRouter.get('/envelopes', (req, res) => {
    res.send(getAllEnvelopes())
});

apiRouter.get('/envelopes/:id', (req, res) => {
    const envelope = req.envelope;
    res.status(200).send(envelope);
})

apiRouter.post('/envelopes', (req, res) => {
    const { name, saveAmount } = req.body;
    const dupe = getEnvelopeByName(name);
    if (dupe) {
        res.status(400).send("You already have an envelope with this name. Please choose a different name.")
        return;
    }

    newEnvelope = addEnvelope(name, saveAmount);
    if (newEnvelope === null) {
        res.status(400).send("There's a problem with your new envelope! Please double check the name and amount entered.")
    }
    if (newEnvelope === -1) {
        res.status(400).send("You've entered a negative amount for your amount to save!")
    }

    res.status(201).send(newEnvelope);
});

apiRouter.put('/envelopes/:id', (req, res) => {
    envelopeId = req.params.id;
    amountSpent = Number(req.query.spent);
    newName = req.query.newname;

    const updatedEnvelope = updateEnvelope(envelopeId, amountSpent, newName)

    if (updatedEnvelope == null) {
        res.status(400).send('You have no envelopes to update!')
    }
    if (updatedEnvelope === -1) {
        res.status(400).send('There is a problem with the entered spend amount, please try again.')
    }

    res.status(200).send(updatedEnvelope);
})

module.exports = apiRouter;