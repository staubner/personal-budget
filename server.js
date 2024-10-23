const express = require('express');
const app = express();
const PORT = 3000;
const morgan = require('morgan');
const errorHandler = require('errorhandler');

// app.use(express.static('public'));

module.exports = app;

app.use(morgan('tiny'));

//router mounted at root
const apiRouter = require('./server/api');
app.use('/', apiRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})