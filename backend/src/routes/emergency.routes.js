const router = require('express').Router();
const { withTransaction } = require('../db/transaction');
const { transitionEmergency } = require('../services/emergencyService');

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
