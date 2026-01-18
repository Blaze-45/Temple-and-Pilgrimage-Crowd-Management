const router = require("express").Router();
const { getNotificationsByDevotee } = require("../services/notificationService");
const pool = require("../db"); // or however you get client

/**
 * GET /api/notifications/:devoteeId
 */
router.get("/:devoteeId", async (req, res) => {
  const { devoteeId } = req.params;

  try {
    const client = await pool.connect();
    const notifications = await getNotificationsByDevotee(client, devoteeId);
    client.release();

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

module.exports = router;
