# Personal Budget API
## Student project using a mock DB

A barebones budgeting API using the envelope principle using express. No front end as yet, testing has been done using Postman.

---

Endpoints:

- /envelopes
    - accomodates GET requests for all envelopes
    - accomodates POST requests to create a new envelope (JSON body requires "name" and "saveamount" keys with respective values)
- /envelopes/:id
    - accomodates GET requests for a specific envelope
    - accomodates POST requests to spend money (JSON body requires "spend" key and an amount value)
    - accomodates PUT requests to update an envelopes properties (JSON body can include "name", "spent", and "saved" keys with respective values)
    - accomodates DELETE requests
- /envelopes/transfer/:to/:from
    - accomodates POST requests allowing transfer of save amount from one envelope to another, :to and :from being the respective envelope IDs. JSON body requires "amount" key with a value. Returns an object containing the names of the two envelopes and new save amounts.
  
