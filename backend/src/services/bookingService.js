const pool = require('../db/pool');
const { v4: uuidv4 } = require('uuid');
const qrService = require('./qrService');

async function createBooking(data) {
  const { devoteeName, devoteeCategory, slotTime } = data;

  if (!devoteeName || !slotTime || !devoteeCategory) {
    const err = new Error('Missing booking details');
    err.status = 400;
    throw err;
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const bookingId = uuidv4();

    await client.query(
      `INSERT INTO bookings (id, devotee_name, devotee_category, slot_time, status)
       VALUES ($1, $2, $3, $4, 'BOOKED')`,
      [bookingId, devoteeName, devoteeCategory, slotTime]
    );

    const qr = await qrService.generateQR(client, bookingId);

    await client.query('COMMIT');

    return {
      bookingId,
      qrCode: qr.codeValue,
      expiresAt: qr.expiresAt
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { createBooking };
