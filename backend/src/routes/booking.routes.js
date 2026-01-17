const express = require('express');
const router = express.Router();
const bookingService = require('../services/bookingService');

router.post('/create', async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
