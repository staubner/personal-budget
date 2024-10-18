const crypto = require('crypto')

let totalBudget = 0;

const envelopes = [
    {
        name: 'groceries',
        id: crypto.randomUUID(),
        spent: 0,
        saveAmount: 0,
    },
    {
        name: 'rent',
        id: crypto.randomUUID(),
        spent: 0,
        saveAmount: 0,
    },
    {
        name: 'car',
        id: crypto.randomUUID(),
        spent: 0,
        saveAmount: 0,
    }
]

function dupeNameCheck(newName) {
    const dupe = envelopes.findIndex(env => env.name === newName);
    if (dupe !== -1) {
        return true;
    } else {
        return false;
    }
}

function getAllEnvelopes() {
    return envelopes
}

function addEnvelope(name, saveAmount) {
    if (typeof name !== 'string' || typeof saveAmount !== 'number') {
        return null;
    }
    if (saveAmount < 0) {
        return -1;
    }

    const newEnvelope = {
        name,
        saveAmount
    }

    newEnvelope.id = crypto.randomUUID();
    newEnvelope.spent = 0;
    envelopes.push(newEnvelope)
    return newEnvelope;
}

function getEnvelopeById(id) {
    if (envelopes.length === 0) {
        return null;
    }
    const foundEnvelope = envelopes.find(env => env.id === id);
    return foundEnvelope;
}

function getEnvelopeByName(name) {
    if (envelopes.length === 0) {
        return null;
    }
    const foundEnvelope = envelopes.find(env => env.name === name);
    return foundEnvelope;
}

function updateEnvelope(envelope, spend, newSaveAmount, newName) {
    const updatedEnvelope = envelope;

    if (newName && dupeNameCheck(newName) === true) {
        return null;
    }

    if ((spend && newSaveAmount) && spend <= 0 || newSaveAmount < 0) {
        return -1;
    }

    if (spend) {
        updatedEnvelope.spent += spend;
    }
    if (newSaveAmount) {
        updatedEnvelope.saveAmount = newSaveAmount;
    }
    if (newName) {
        updatedEnvelope.name = newName;
    }

    const envelopeToReplace = envelopes.findIndex(env => env.id === envelope.id);

    envelopes.splice(envelopeToReplace, 1, updatedEnvelope)

    return updatedEnvelope;
}

module.exports = {
    totalBudget,
    envelopes,
    getAllEnvelopes,
    addEnvelope,
    getEnvelopeById,
    getEnvelopeByName,
    updateEnvelope,

}