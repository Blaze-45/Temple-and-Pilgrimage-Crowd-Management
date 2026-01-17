const express = require('express');
const router = express.Router();
const { withTransaction } = require('../db/transaction');
const { scanQr } = require('../services/qrService');

router.post('/scan', async (req, res) => {
  const { qrId, zoneId } = req.body;

  if (!qrId || !zoneId) {
    return res.status(400).json({ error: 'qrId and zoneId are required' });
  }

  try {
    await withTransaction(client =>
      scanQr(qrId, zoneId, client)
    );

    res.json({
      status: 'ENTRY_GRANTED',
      qrId,
      zoneId
    });
  } catch (err) {
    res.status(409).json({
      status: 'ENTRY_REJECTED',
      reason: err.message
    });
  }
});

module.exports = router;
 