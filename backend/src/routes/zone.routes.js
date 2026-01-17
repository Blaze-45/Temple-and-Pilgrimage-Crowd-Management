const router = require('express').Router();
const pool = require('../db/pool');
const { calculateZoneStatus } = require('../services/zoneStatusService');

/**
 * Zone statistics (ENTRY / EXIT analytics)
 */
router.get('/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        z.id AS "zoneId",
        z.name AS "zoneName",
        z.current_capacity AS "currentCapacity",
        COUNT(e.id) FILTER (WHERE e.event_type = 'ENTRY') AS entries,
        COUNT(e.id) FILTER (WHERE e.event_type = 'EXIT') AS exits
      FROM zones z
      LEFT JOIN zone_events e ON e.zone_id = z.id
      GROUP BY z.id
      ORDER BY z.name
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * List all zones
 */
router.get('/', async (req, res) => {
  const result = await pool.query(`SELECT * FROM zones`);

  const zones = result.rows.map(zone => ({
    id: zone.id,
    name: zone.name,
    currentCapacity: zone.current_capacity,
    maxCapacity: zone.max_capacity,
    isBlocked: zone.is_blocked,
    status: calculateZoneStatus(zone)
  }));

  res.json(zones);
});

/**
 * Single zone by ID
 */
router.get('/:id', async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM zones WHERE id = $1`,
    [req.params.id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'ZONE_NOT_FOUND' });
  }

  const zone = result.rows[0];

  res.json({
    id: zone.id,
    name: zone.name,
    currentCapacity: zone.current_capacity,
    maxCapacity: zone.max_capacity,
    isBlocked: zone.is_blocked,
    status: calculateZoneStatus(zone)
  });
});

module.exports = router;
