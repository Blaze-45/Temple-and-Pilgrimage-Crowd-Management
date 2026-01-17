const express = require('express');
const router = express.Router();

const { withTransaction } = require('../db/transaction');
const { scanQr, exitQr } = require('../services/qrService');

/**
 * =========================
 * ENTRY SCAN
 * POST /qr/scan
 * =========================
 */
router.post('/scan', async (req, res) => {
  const { qrId, zoneId } = req.body;

  if (!qrId || !zoneId) {
    return res.status(400).json({
      status: 'ENTRY_REJECTED',
      reason: 'qrId and zoneId are required'
    });
  }

  try {
    await withTransaction(client =>
      scanQr(qrId, zoneId, client)
    );

    return res.json({
      status: 'ENTRY_GRANTED',
      qrId,
      zoneId
    });
  } catch (err) {
    return res.status(409).json({
      status: 'ENTRY_REJECTED',
      reason: err.message
    });
  }
});

/**
 * =========================
 * EXIT SCAN
 * POST /qr/exit
 * =========================
 */
router.post('/exit', async (req, res) => {
  const { qrId, zoneId } = req.body;

  if (!qrId || !zoneId) {
    return res.status(400).json({
      status: 'EXIT_REJECTED',
      reason: 'qrId and zoneId are required'
    });
  }

  try {
    await withTransaction(client =>
      exitQr(qrId, zoneId, client)
    );

    return res.json({
      status: 'EXIT_SUCCESS',
      qrId,
      zoneId
    });
  } catch (err) {
    return res.status(409).json({
      status: 'EXIT_REJECTED',
      reason: err.message
    });
  }
});

module.exports = router;
