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

function updateEnvelope(id, spend, newName) {
    if (envelopes.length === 0) {
        return null;
    }
    if (typeof spend !== 'number' || spend <= 0) {
        return -1;
    }

    const envelopeIndex = envelopes.findIndex(env => env.id === id);
    if (envelopeIndex !== -1) {
        if (newName) {
            envelopes[envelopeIndex].name = newName;
        }
        envelopes[envelopeIndex].spent += spend;
    }

    return envelopes[envelopeIndex];
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