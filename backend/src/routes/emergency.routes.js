const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const pool = require('../db/pool');
const { withTransaction } = require('../db/transaction');
const { transitionEmergency } = require('../services/emergencyService');

/**
 * SOS trigger
 * Creates emergency + blocks zone
 */
router.post('/sos', async (req, res) => {
  const { zoneId } = req.body;

  if (!zoneId) {
    return res.status(400).json({ error: 'zoneId required' });
  }

  try {
    const emergencyId = uuidv4();

    await pool.query(
      `
      INSERT INTO emergencies (id, zone_id, status)
      VALUES ($1, $2, 'REPORTED')
      `,
      [emergencyId, zoneId]
    );

    await pool.query(
      `
      UPDATE zones
      SET is_blocked = true
      WHERE id = $1
      `,
      [zoneId]
    );

    res.json({
      status: 'SOS_REPORTED',
      emergencyId,
      zoneId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Emergency transitions
 */
router.post('/:id/dispatch', async (req, res) => {
  try {
    const result = await withTransaction(client =>
      transitionEmergency(req.params.id, 'DISPATCHED', client)
    );
    res.json(result);
  } catch (e) {
    res.status(409).json({ error: e.message });
  }
});

router.post('/:id/start', async (req, res) => {
  try {
    const result = await withTransaction(client =>
      transitionEmergency(req.params.id, 'IN_PROGRESS', client)
    );
    res.json(result);
  } catch (e) {
    res.status(409).json({ error: e.message });
  }
});

router.post('/:id/resolve', async (req, res) => {
  try {
    const result = await withTransaction(client =>
      transitionEmergency(req.params.id, 'RESOLVED', client)
    );
    res.json(result);
  } catch (e) {
    res.status(409).json({ error: e.message });
  }
});

module.exports = router;
