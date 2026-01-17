const DARSHAN_DURATION_MINUTES = 20;

async function runTimeDecay(client) {
  const res = await client.query(
    `
    SELECT q.id
    FROM qr_codes q
    JOIN zone_events e ON e.qr_id = q.id
    WHERE q.status = 'SCANNED'
      AND e.event_type = 'ENTRY'
      AND e.created_at < NOW() - INTERVAL '${DARSHAN_DURATION_MINUTES} minutes'
    `
  );

  for (const row of res.rows) {
    // reuse the SAME exit logic
    await client.query(
      `SELECT exit_zone($1)`, // pseudo, explained below
      [row.id]
    );
  }
}

module.exports = { runTimeDecay };

const { exitZone } = require('./exitService');

const DARSHAN_DURATION_MINUTES = 20;

async function runDecay(client) {
  // Find QRs that entered too long ago and never exited
  const res = await client.query(`
    SELECT q.id
    FROM qr_codes q
    JOIN zone_events e 
      ON q.id = e.qr_id
    WHERE q.status = 'SCANNED'
      AND e.event_type = 'ENTRY'
      AND e.created_at < NOW() - INTERVAL '${DARSHAN_DURATION_MINUTES} minutes'
  `);

  const exited = [];

  for (const row of res.rows) {
    try {
      const result = await exitZone(row.id, client);
      exited.push({ qrId: row.id, zoneId: result.zoneId });
    } catch (err) {
      // If exit fails, we skip but DO NOT crash decay
      // This protects demo stability
    }
  }

  return exited;
}

module.exports = { runDecay };
