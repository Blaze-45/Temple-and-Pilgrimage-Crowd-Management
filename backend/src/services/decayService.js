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
