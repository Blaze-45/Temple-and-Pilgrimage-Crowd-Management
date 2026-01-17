const router = require('express').Router();
const {
  getDailyFootfall,
  getZoneWiseFootfall,
  getPeakHours
} = require('../services/reportService');

/**
 * GET /reports/daily?date=YYYY-MM-DD
 */
router.get('/daily', async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'date is required (YYYY-MM-DD)' });
  }

  const total = await getDailyFootfall(date);
  const zones = await getZoneWiseFootfall(date);
  const peakHours = await getPeakHours(date);

  res.json({
    date,
    totalFootfall: total.total_entries,
    zoneWise: zones,
    peakHours
  });
});

module.exports = router;
