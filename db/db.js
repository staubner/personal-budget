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

module.exports = {
    totalBudget,
    envelopes,
    getAllEnvelopes,

}