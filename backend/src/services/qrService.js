const { DevoteeCategory } = require('../constants/enums');

/**
 * =========================
 * ENTRY FLOW
 * scanQr()
 * =========================
 */
async function scanQr(qrId, zoneId, client) {

  // 1️⃣ Lock QR row
  const qrRes = await client.query(
    `
    SELECT *
    FROM qr_codes
    WHERE id = $1
    FOR UPDATE
    `,
    [qrId]
  );

  if (qrRes.rowCount === 0) {
    throw new Error('QR_NOT_FOUND');
  }

  const qr = qrRes.rows[0];

  // 2️⃣ Validate QR state
  if (qr.status !== 'ISSUED') {
    throw new Error('QR_ALREADY_USED');
  }

  const now = new Date();
  if (now < qr.valid_from || now > qr.valid_to) {
    throw new Error('QR_EXPIRED');
  }

  // 3️⃣ Fetch devotee category (nullable‑safe)
  let category = null;

  if (qr.devotee_id) {
    const devRes = await client.query(
      `SELECT category FROM devotees WHERE id = $1`,
      [qr.devotee_id]
    );

    if (devRes.rowCount === 0) {
      throw new Error('DEVOTEE_NOT_FOUND');
    }

    category = devRes.rows[0].category;
  }

  // 4️⃣ Lock zone
  const zoneRes = await client.query(
    `
    SELECT *
    FROM zones
    WHERE id = $1
    FOR UPDATE
    `,
    [zoneId]
  );

  if (zoneRes.rowCount === 0) {
    throw new Error('ZONE_NOT_FOUND');
  }

  const zone = zoneRes.rows[0];

  // 5️⃣ Emergency logic
  if (zone.is_blocked && category !== DevoteeCategory.STAFF) {
    throw new Error('ZONE_BLOCKED_DUE_TO_EMERGENCY');
  }

  // 6️⃣ Capacity checks
  const effectiveNormalLimit =
    zone.max_capacity - zone.reserved_priority_capacity;

  if (
    category === DevoteeCategory.NORMAL &&
    zone.current_capacity >= effectiveNormalLimit
  ) {
    throw new Error('ZONE_CAPACITY_FULL');
  }

  if (zone.current_capacity >= zone.max_capacity) {
    throw new Error('ZONE_CAPACITY_FULL');
  }

  // 7️⃣ Apply ENTRY
  await client.query(
    `
    UPDATE zones
    SET current_capacity = current_capacity + 1
    WHERE id = $1
    `,
    [zoneId]
  );

  await client.query(
    `
    UPDATE qr_codes
    SET status = 'SCANNED',
        last_scanned_zone = $1
    WHERE id = $2
    `,
    [zoneId, qrId]
  );

  await client.query(
    `
    INSERT INTO zone_events (id, zone_id, qr_id, event_type)
    VALUES (gen_random_uuid(), $1, $2, 'ENTRY')
    `,
    [zoneId, qrId]
  );
}

/**
 * =========================
 * EXIT FLOW
 * exitQr()
 * =========================
 */
async function exitQr(qrId, zoneId, client) {

  // 1️⃣ Lock QR
  const qrRes = await client.query(
    `
    SELECT *
    FROM qr_codes
    WHERE id = $1
    FOR UPDATE
    `,
    [qrId]
  );

  if (qrRes.rowCount === 0) {
    throw new Error('QR_NOT_FOUND');
  }

  const qr = qrRes.rows[0];

  // 2️⃣ Validate QR state
  if (qr.status !== 'SCANNED') {
    throw new Error('QR_NOT_IN_ZONE');
  }

  if (qr.last_scanned_zone !== zoneId) {
    throw new Error('WRONG_EXIT_ZONE');
  }

  // 3️⃣ Lock zone
  const zoneRes = await client.query(
    `
    SELECT *
    FROM zones
    WHERE id = $1
    FOR UPDATE
    `,
    [zoneId]
  );

  if (zoneRes.rowCount === 0) {
    throw new Error('ZONE_NOT_FOUND');
  }

  const zone = zoneRes.rows[0];

  if (zone.current_capacity <= 0) {
    throw new Error('ZONE_CAPACITY_UNDERFLOW');
  }

  // 4️⃣ Apply EXIT
  await client.query(
    `
    UPDATE zones
    SET current_capacity = current_capacity - 1
    WHERE id = $1
    `,
    [zoneId]
  );

  await client.query(
    `
    UPDATE qr_codes
    SET status = 'EXITED'
    WHERE id = $1
    `,
    [qrId]
  );

  await client.query(
    `
    INSERT INTO zone_events (id, zone_id, qr_id, event_type)
    VALUES (gen_random_uuid(), $1, $2, 'EXIT')
    `,
    [zoneId, qrId]
  );
}

module.exports = {
  scanQr,
  exitQr
};
