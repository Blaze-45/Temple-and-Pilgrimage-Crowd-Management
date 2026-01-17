const router = require('express').Router();
const pool = require('../db/pool');
const { calculateZoneStatus } = require('../services/zoneStatusService');

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
