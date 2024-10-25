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
        const err = new Error('Envelope not found')
        err.status = 404;
        return next(err);
    }
})

//get all envelopes
apiRouter.get('/envelopes', (req, res, next) => {
    res.send(getAllEnvelopes())
});

//get envelope by id
apiRouter.get('/envelopes/:id', (req, res, next) => {
    const envelope = req.envelope;
    if (!envelope) {
        const err = new Error('No envelope found')
        err.status = 404
        return next(err);
    }
    res.status(200).send(envelope);
})

//create new envelope
apiRouter.post('/envelopes', (req, res, next) => {
    const { name, saveAmount } = req.body;

    const newEnvelope = addEnvelope(name, saveAmount);
    if (newEnvelope == null) {
        const err = new Error('Please double check the name and amount entered.')
        err.status = 400;
        return next(err);
    } else if (newEnvelope == false) {
        const err = new Error('This envelope already exists, please choose another name.')
        err.status = 400;
        return next(err);
    } else if (newEnvelope === -1) {
        const err = new Error("You've entered a negative amount for your amount to save! Please make sure to enter a valid number.")
        err.status = 400;
        return next(err);
    } else {
        res.status(201).send(newEnvelope);
    }
});

//spend money
apiRouter.post('/envelopes/:id', (req, res, next) => {
    const spendAmount = req.body.spend;
    const envelope = req.envelope;

    const updatedEnvelope = spendMoney(envelope, spendAmount)

    res.status(200).send(updatedEnvelope);
})

//transfer budget between envelopes
apiRouter.post('/envelopes/transfer/:to/:from', (req, res, next) => {
    const transferTo = req.params.to;
    const transferFrom = req.params.from;
    const amount = req.body.amount;

    const transfer = transferBudget(transferTo, transferFrom, amount);

    if (transfer == null) {
        const err = new Error('Please enter a valid transfer amount')
        err.status = 400
        return next(err)
    } else if (transfer === -1) {
        const err = new Error("You can't save less than $0, please enter a different amount")
        err.status = 400
        return next(err)
    } else {
        res.status(200).send(transfer);
    }
})

//update an envelope's properties
apiRouter.put('/envelopes/:id', (req, res, next) => {
    const envelope = req.envelope;
    const newName = req.body.newname;
    const newSaveAmount = req.body.newsaveamount;
    const newSpentAmount = req.body.newspentamount;

    const newEnvelope = updateEnvelope(envelope, newSpentAmount, newSaveAmount, newName)

    if (newEnvelope == null) {
        const err = new Error('You have entered a duplicate name! Please choose a different name.')
        err.status = 400;
        return next(err);
    } else if (newEnvelope === -1) {
        const err = new Error('You have entered an invalid amount; please enter a valid spend or save amount.')
        err.status = 400;
        return next(err);
    } else {
        res.status(200).send(newEnvelope);
    }
})

//delete an envelope
apiRouter.delete('/envelopes/:id', (req, res, next) => {
    const deleted = deleteEnvelope(req.envelope.id);
    if (deleted) {
        res.status(204);
    } else {
        res.status(500);
    }
    res.send();
})

//error handler
apiRouter.use((err, req, res, next) => {
    if (!err.status) {
        err.status = 500;
    }
    res.status(err.status).send(err.message);
});

module.exports = apiRouter;