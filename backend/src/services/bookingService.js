const { v4: uuidv4 } = require('uuid');
const pool = require('../db/pool');
const { BOOKING_STATUS, QR_STATUS } = require('../constants/enums');
const { createNotification } = require('./notificationService');

async function createBooking(data) {
  const { slotId, devoteeId, devoteeCategory } = data;

  if (!slotId || !devoteeCategory) {
    throw new Error('Missing booking details');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1️⃣ Create booking
    const bookingId = uuidv4();

    await client.query(
      `
      INSERT INTO bookings (id, slot_id, devotee_id, devotee_category, status)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        bookingId,
        slotId,
        devoteeId || null,
        devoteeCategory,
        BOOKING_STATUS.BOOKED
      ]
    );

    // 2️⃣ Create QR
    const qrId = uuidv4();

    await client.query(
      `
      INSERT INTO qr_codes (id, booking_id, status, valid_from, valid_to)
      VALUES ($1, $2, $3, NOW(), NOW() + INTERVAL '1 hour')
      `,
      [qrId, bookingId, QR_STATUS.ISSUED]
    );

    // 3️⃣ 🔔 Create notification (THIS WAS THE BUG FIX)
    if (devoteeId) {
      await createNotification(
        client,
        devoteeId,
        'Your booking is confirmed. Please arrive on time.'
      );
    }

    await client.query('COMMIT');

    return {
      bookingId,
      qrId
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { createBooking };
