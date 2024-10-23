const express = require('express');
const apiRouter = express.Router();
const bodyParser = require('body-parser')

const {
    getAllEnvelopes,
    addEnvelope,
    getEnvelopeById,
    getEnvelopeByName,
    spendMoney,
    updateEnvelope,
    deleteEnvelope,
    transferBudget,

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
    if (!envelope) {
        res.status(404).send('No envelope found!')
    }
    res.status(200).send(envelope);
})

apiRouter.post('/envelopes', (req, res) => {
    const { name, saveAmount } = req.body;
    const dupe = getEnvelopeByName(name);
    if (dupe) {
        res.status(400).send("You already have an envelope with this name. Please choose a different name.")
        return;
    }

    const newEnvelope = addEnvelope(name, saveAmount);
    if (newEnvelope === null) {
        res.status(400).send("There's a problem with your new envelope! Please double check the name and amount entered.")
    }
    if (newEnvelope === -1) {
        res.status(400).send("You've entered a negative amount for your amount to save!")
    }

    res.status(201).send(newEnvelope);
});

apiRouter.post('/envelopes/:id', (req, res) => {
    const spendAmount = Number(req.body.spent);
    const envelope = req.envelope;

    const updatedEnvelope = spendMoney(envelope, spendAmount)

    res.status(200).send(updatedEnvelope);
})

apiRouter.post('/envelopes/transfer/:to/:from', (req, res) => {
    const transferTo = req.params.to;
    const transferFrom = req.params.from;
    const amount = Number(req.body.amount);

    const transfer = transferBudget(transferTo, transferFrom, amount);

    if (transfer == null) {
        res.status(400).send('Please enter a valid transfer amount!')
    } else if (transfer == false) {
        res.status(404).send('One or more envelopes not found.')
    } else if (transfer === -1) {
        res.status(400).send("You can't have a save amount below $0, please enter a different amount.")
    } else {
        res.status(200).send(transfer);
    }
})

apiRouter.put('/envelopes/:id', (req, res) => {
    const envelope = req.envelope;
    const amountSpent = Number(req.body.spent);
    const newName = req.body.newname;
    const newSaveAmount = Number(req.body.newsaveamount);

    if (!envelope) {
        res.status(404).send('No envelope found!')
    }

    const newEnvelope = updateEnvelope(envelope, newSaveAmount, newName)

    if (newEnvelope == null) {
        res.status(400).send('You have entered a duplicate name! Please choose another name.')
    }
    if (newEnvelope === -1) {
        res.status(400).send('You have entered an invalid amount; please enter a valid spend or save amount.')
    }

    res.status(200).send(newEnvelope);
})

apiRouter.delete('/envelopes/:id', (req, res) => {
    const deleted = deleteEnvelope(req.envelope.id);
    if (deleted) {
        res.status(204);
    } else {
        res.status(500);
    }
    res.send();
})

module.exports = apiRouter;