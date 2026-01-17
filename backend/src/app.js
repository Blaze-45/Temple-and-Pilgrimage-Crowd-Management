const express = require('express');
const app = express();

app.use(express.json());

app.use('/qr', require('./routes/qr.routes'));
app.use('/emergencies', require('./routes/emergency.routes'));

module.exports = app;
