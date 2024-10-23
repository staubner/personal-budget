const crypto = require("crypto");

let totalBudget = 0;
let totalSpent = 0;

const envelopes = [
  {
    name: "groceries",
    id: crypto.randomUUID(),
    spent: 0,
    saveAmount: 500,
    _warning: false,
  },
  {
    name: "rent",
    id: crypto.randomUUID(),
    spent: 0,
    saveAmount: 500,
    _warning: false,
  },
  {
    name: "car",
    id: crypto.randomUUID(),
    spent: 0,
    saveAmount: 500,
    _warning: false,
  },
];

//totals spent from every envelope
function findTotalSpent() {
  envelopes.forEach((env) => (totalSpent += env.spent));
}

//use to check if spend is greater than save amount and toggle when appropriate
function toggleWarning(envelope) {
  if (envelope.spent > envelope.saveAmount) {
    envelope._warning = true;
  } else {
    envelope._warning = false;
  }
}

//checks for duplicate names
function dupeNameCheck(newName) {
  const dupe = envelopes.findIndex(
    (env) => env.name.toLowerCase() === newName.toLowerCase()
  );
  if (dupe !== -1) {
    return true;
  } else {
    return false;
  }
}

function getAllEnvelopes() {
  return envelopes;
}

function addEnvelope(name, saveAmount) {
  if (typeof name !== "string" || typeof saveAmount !== "number") {
    return null;
  }
  if (dupeNameCheck(name.toLowerCase())) {
    return false;
  }
  if (saveAmount < 0) {
    return -1;
  }

  const newEnvelope = {
    name,
    saveAmount,
    _warning: false,
    spent: 0,
    id: crypto.randomUUID(),
  };

  envelopes.push(newEnvelope);
  return newEnvelope;
}

function getEnvelopeById(id) {
  if (envelopes.length === 0) {
    return null;
  }
  const foundEnvelope = envelopes.find((env) => env.id === id);
  return foundEnvelope;
}

function getEnvelopeByName(name) {
  if (envelopes.length === 0) {
    return null;
  }
  const foundEnvelope = envelopes.find((env) => env.name === name);
  return foundEnvelope;
}

function spendMoney(envelope, spend) {
  const updatedEnvelope = envelope;

  updatedEnvelope.spent += spend;

  toggleWarning(updatedEnvelope);

  const envelopeToReplace = envelopes.findIndex(
    (env) => env.id === updatedEnvelope.id
  );

  envelopes.splice(envelopeToReplace, 1, updatedEnvelope);

  return updatedEnvelope;
}

function updateEnvelope(envelope, newSaveAmount, newName) {
  const updatedEnvelope = envelope;

  if (newName && dupeNameCheck(newName) === true) {
    return null;
  }

  if (newSaveAmount < 0) {
    return -1;
  }

  if (newSaveAmount) {
    updatedEnvelope.saveAmount = newSaveAmount;
    toggleWarning(updatedEnvelope);
  }
  if (newName) {
    updatedEnvelope.name = newName;
  }

  const envelopeToReplace = envelopes.findIndex(
    (env) => env.id === updatedEnvelope.id
  );

  envelopes.splice(envelopeToReplace, 1, updatedEnvelope);

  return updatedEnvelope;
}

function deleteEnvelope(id) {
  const deleteIndex = envelopes.findIndex((env) => env.id === id);
  if (deleteIndex !== -1) {
    envelopes.splice(deleteIndex, 1);
    return true;
  } else {
    return false;
  }
}

function transferBudget(envTo, envFrom, amount) {
  if (amount <= 0) {
    return null;
  }

  const envFromId = envelopes.findIndex((env) => env.id === envFrom);
  const envToId = envelopes.findIndex((env) => env.id === envTo);

  envelopes[envFromId].saveAmount -= amount;
  envelopes[envToId].saveAmount += amount;

  if (envelopes[envFromId].saveAmount < 0 || envelopes[envToId].saveAmount < 0) {
    return -1;
  } else {
    toggleWarning(envelopes[envToId]);
    toggleWarning(envelopes[envFromId]);

    return {
      [envelopes[envFromId].name]: envelopes[envFromId].saveAmount,
      [envelopes[envToId].name]: envelopes[envToId].saveAmount,
    };
  }
}

module.exports = {
  totalBudget,
  totalSpent,
  envelopes,
  findTotalSpent,
  getAllEnvelopes,
  addEnvelope,
  getEnvelopeById,
  getEnvelopeByName,
  spendMoney,
  updateEnvelope,
  deleteEnvelope,
  transferBudget,
};
