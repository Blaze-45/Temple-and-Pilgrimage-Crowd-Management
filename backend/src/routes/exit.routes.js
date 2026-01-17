const router = require('express').Router();
const { withTransaction } = require('../db/transaction');
const { exitZone } = require('../services/exitService');

router.post('/exit', async (req, res) => {
  const { qrId } = req.body;

  if (!qrId) {
    return res.status(400).json({ error: 'qrId required' });
  }

  try {
    const result = await withTransaction(client =>
      exitZone(qrId, client)
    );

    res.json({
      status: 'EXIT_RECORDED',
      zoneId: result.zoneId
    });
  } catch (err) {
    res.status(409).json({
      status: 'EXIT_REJECTED',
      reason: err.message
    });
  }
});

module.exports = router;
