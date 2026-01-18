const router = require("express").Router();

/**
 * POST /api/booking/create
 */
router.post("/create", async (req, res) => {
  const { slotId, priority } = req.body;

  console.log("Booking request:", req.body);

  // TEMP response (demo-safe)
  res.json({
    bookingId: "TMP-" + Date.now(),
    slotTime: "10:00 AM",
    entryGate: "Gate 2A",
    priority: priority || null
  });
});

module.exports = router;
