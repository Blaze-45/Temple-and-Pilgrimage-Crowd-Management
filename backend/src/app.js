const express = require('express');
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/qr', require('./routes/qr.routes'));
app.use('/emergencies', require('./routes/emergency.routes'));
app.use('/zones', require('./routes/zone.routes'));
app.use('/admin', require('./routes/admin.routes'));

const bookingRoutes = require('./routes/booking.routes');
app.use('/booking', bookingRoutes);

// error handler (must be last)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
