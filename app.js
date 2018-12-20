const winston = require('winston')
const express = require('express');
require('express-async-errors');
const app = express();

require('./startup/logging')();
require('./startup/config')();
require('./startup/db')();
require('./startup/routes')(app);
require('./startup/views')(app);
require('./startup/resources')(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listen on port ${port}`))

module.exports = server