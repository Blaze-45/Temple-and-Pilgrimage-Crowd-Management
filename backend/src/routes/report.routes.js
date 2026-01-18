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
/**
 * GET /reports/landing
 * Summary stats for landing page
 */
router.get('/landing', async (req, res) => {
  try {
    // TEMP values (can be replaced with real logic later)
    res.json({
      queueLength: 1180,
      slotsAvailable: 295,
      activeIncidents: 1,
      avgWaitTime: 22
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch landing stats' });
  }
});