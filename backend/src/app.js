const express = require('express');
const app = express();

app.use(express.json());

app.use('/qr', require('./routes/qr.routes'));
app.use('/emergencies', require('./routes/emergency.routes'));
app.use('/zones', require('./routes/zone.routes')); 
app.use('/admin', require('./routes/admin.routes'));
app.use('/exit', require('./routes/exit.routes'));

module.exports = app;
