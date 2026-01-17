const { EmergencyTransitions } = require('../constants/enums');

async function transitionEmergency(emergencyId, nextStatus, client) {
  const res = await client.query(
    `SELECT * FROM emergencies
     WHERE id = $1
     FOR UPDATE`,
    [emergencyId]
  );

  if (res.rowCount === 0) throw new Error('EMERGENCY_NOT_FOUND');

  const emergency = res.rows[0];
  const currentStatus = emergency.status;

  const allowed = EmergencyTransitions[currentStatus];
  if (!allowed.includes(nextStatus)) {
    throw new Error(`INVALID_TRANSITION_${currentStatus}_TO_${nextStatus}`);
  }

  const zoneId = emergency.zone_id;

  // Apply zone side‑effects
  if (nextStatus === 'IN_PROGRESS') {
    await client.query(
      `UPDATE zones SET is_blocked = true WHERE id = $1`,
      [zoneId]
    );
  }

  if (nextStatus === 'RESOLVED') {
    await client.query(
      `UPDATE zones SET is_blocked = false WHERE id = $1`,
      [zoneId]
    );
  }

  await client.query(
    `UPDATE emergencies
     SET status = $1, updated_at = NOW()
     WHERE id = $2`,
    [nextStatus, emergencyId]
  );

  return { emergencyId, from: currentStatus, to: nextStatus };
}

module.exports = { transitionEmergency };
