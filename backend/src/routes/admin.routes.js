const router = require('express').Router();
const { withTransaction } = require('../db/transaction');
const { runDecay } = require('../services/decayService');

router.post('/run-decay', async (req, res) => {
  try {
    const exited = await withTransaction(client =>
      runDecay(client)
    );

    res.json({
      status: 'DECAY_EXECUTED',
      exitedCount: exited.length,
      exited
    });
  } catch (err) {
    res.status(500).json({
      status: 'DECAY_FAILED',
      error: err.message
    });
  }
});

const { getAdminDashboardData } = require('../services/adminService');

router.get('/dashboard', async (req, res) => {
  try {
    const data = await getAdminDashboardData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


module.exports = router;
