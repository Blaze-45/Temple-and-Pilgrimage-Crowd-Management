const { DevoteeCategory } = require('../constants/enums.js');

const { v4: uuidv4 } = require('uuid');

async function generateQR(client, bookingId) {
  const qrId = uuidv4();
  const codeValue = uuidv4(); // QR payload
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await client.query(
    `INSERT INTO qr_codes (id, booking_id, code_value, expires_at, status)
     VALUES ($1, $2, $3, $4, 'UNUSED')`,
    [qrId, bookingId, codeValue, expiresAt]
  );

  return {
    qrId,
    codeValue,
    expiresAt
  };
}

module.exports.generateQR = generateQR;


async function scanQr(qrId, zoneId, client) {
  // 1. Lock QR
  const qrRes = await client.query(
    `SELECT q.*, d.category
     FROM qr_codes q
     JOIN devotees d ON q.devotee_id = d.id
     WHERE q.id = $1
     FOR UPDATE`,
    [qrId]
  );

  if (qrRes.rowCount === 0) throw new Error('QR_NOT_FOUND');

  const qr = qrRes.rows[0];

  // 2. Validate QR state
  if (qr.status !== 'ISSUED') throw new Error('QR_ALREADY_USED');

  const now = new Date();
  if (now < qr.valid_from || now > qr.valid_to)
    throw new Error('QR_EXPIRED');

  // 3. Check zone
  const zoneRes = await client.query(
    `SELECT * FROM zones WHERE id = $1 FOR UPDATE`,
    [zoneId]
  );

  const zone = zoneRes.rows[0];

  // 4. Emergency block logic
  if (zone.is_blocked && qr.category !== DevoteeCategory.STAFF) {
    throw new Error('ZONE_BLOCKED_DUE_TO_EMERGENCY');
  }

  // 5. Capacity logic
  const effectiveNormalLimit =
    zone.max_capacity - zone.reserved_priority_capacity;

  if (
    qr.category === DevoteeCategory.NORMAL &&
    zone.current_capacity >= effectiveNormalLimit
  ) {
    throw new Error('ZONE_CAPACITY_FULL');
  }

  if (zone.current_capacity >= zone.max_capacity) {
    throw new Error('ZONE_CAPACITY_FULL');
  }

  // 6. Apply entry
  await client.query(
    `UPDATE zones
     SET current_capacity = current_capacity + 1
     WHERE id = $1`,
    [zoneId]
  );

  await client.query(
    `UPDATE qr_codes
     SET status = 'SCANNED',
         last_scanned_zone = $1
     WHERE id = $2`,
    [zoneId, qrId]
  );

  await client.query(
    `INSERT INTO zone_events (id, zone_id, qr_id, event_type)
     VALUES (gen_random_uuid(), $1, $2, 'ENTRY')`,
    [zoneId, qrId]
  );
}

module.exports = { scanQr };
