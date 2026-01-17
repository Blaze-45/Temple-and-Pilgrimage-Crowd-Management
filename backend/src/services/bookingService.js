const { v4: uuidv4 } = require('uuid');
const pool = require('../db/pool');
const { BOOKING_STATUS, QR_STATUS } = require('../constants/enums');

/**
 * Creates a booking and issues a QR code
 * @param {Object} data
 * @param {string} data.slotId
 * @param {string} data.devoteeId
 * @param {string} data.devoteeCategory
 */
async function createBooking(data) {
  const { slotId, devoteeId, devoteeCategory } = data;

  // 🔐 Validation (must match route body)
  if (!slotId || !devoteeId || !devoteeCategory) {
    throw new Error('Missing booking details');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1️⃣ Create booking
    const bookingId = uuidv4();

    await client.query(
      `
      INSERT INTO bookings (
        id,
        slot_id,
        devotee_id,
        devotee_category,
        status
      )
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        bookingId,
        slotId,
        devoteeId,
        devoteeCategory,
        BOOKING_STATUS.BOOKED
      ]
    );

    // 2️⃣ Issue QR code
    const qrId = uuidv4();

    await client.query(
      `
      INSERT INTO qr_codes (
        id,
        booking_id,
        devotee_id,
        valid_from,
        valid_to,
        status
      )
      VALUES (
        $1,
        $2,
        $3,
        NOW(),
        NOW() + INTERVAL '1 hour',
        $4
      )
      `,
      [
        qrId,
        bookingId,
        devoteeId,
        QR_STATUS.ISSUED
      ]
    );

    await client.query('COMMIT');

    return {
      bookingId,
      qrId,
      status: 'BOOKING_CONFIRMED'
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

await createNotification(
  client,
  devoteeId,
  'Your booking is confirmed. Please arrive on time.'
);


module.exports = {
  createBooking,
};
