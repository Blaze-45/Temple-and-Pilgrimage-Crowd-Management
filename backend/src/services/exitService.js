async function exitZone(qrId, client) {
  // 1. Lock QR
  const qrRes = await client.query(
    `SELECT * FROM qr_codes
     WHERE id = $1
     FOR UPDATE`,
    [qrId]
  );

  if (qrRes.rowCount === 0) {
    throw new Error('QR_NOT_FOUND');
  }

  const qr = qrRes.rows[0];

  // 2. Validate that QR was actually used
  if (qr.status !== 'SCANNED') {
    throw new Error('QR_NOT_IN_ZONE');
  }

  if (!qr.last_scanned_zone) {
    throw new Error('NO_ACTIVE_ZONE');
  }

  const zoneId = qr.last_scanned_zone;

  // 3. Lock zone
  const zoneRes = await client.query(
    `SELECT * FROM zones
     WHERE id = $1
     FOR UPDATE`,
    [zoneId]
  );

  const zone = zoneRes.rows[0];

  if (zone.current_capacity <= 0) {
    throw new Error('ZONE_CAPACITY_CORRUPTED');
  }

  // 4. Apply exit
  await client.query(
    `UPDATE zones
     SET current_capacity = current_capacity - 1
     WHERE id = $1`,
    [zoneId]
  );

  await client.query(
    `INSERT INTO zone_events (id, zone_id, qr_id, event_type)
     VALUES (gen_random_uuid(), $1, $2, 'EXIT')`,
    [zoneId, qrId]
  );

  // 5. Reset QR state
  await client.query(
    `UPDATE qr_codes
     SET last_scanned_zone = NULL
     WHERE id = $1`,
    [qrId]
  );

  return { zoneId };
}

module.exports = { exitZone };
