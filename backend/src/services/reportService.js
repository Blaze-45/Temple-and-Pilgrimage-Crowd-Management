const pool = require('../db/pool');

/**
 * Daily footfall (total entries per day)
 */
async function getDailyFootfall(date) {
  const result = await pool.query(
    `
    SELECT
      DATE(created_at) AS date,
      COUNT(*) AS total_entries
    FROM zone_events
    WHERE event_type = 'ENTRY'
      AND DATE(created_at) = $1
    GROUP BY DATE(created_at)
    `,
    [date]
  );

  return result.rows[0] || { date, total_entries: 0 };
}

/**
 * Zone-wise daily footfall
 */
async function getZoneWiseFootfall(date) {
  const result = await pool.query(
    `
    SELECT
      z.name AS zone,
      COUNT(e.id) AS entries
    FROM zone_events e
    JOIN zones z ON z.id = e.zone_id
    WHERE e.event_type = 'ENTRY'
      AND DATE(e.created_at) = $1
    GROUP BY z.name
    ORDER BY entries DESC
    `,
    [date]
  );

  return result.rows;
}

/**
 * Peak hours (hour-wise entry count)
 */
async function getPeakHours(date) {
  const result = await pool.query(
    `
    SELECT
      EXTRACT(HOUR FROM created_at) AS hour,
      COUNT(*) AS entries
    FROM zone_events
    WHERE event_type = 'ENTRY'
      AND DATE(created_at) = $1
    GROUP BY hour
    ORDER BY entries DESC
    `,
    [date]
  );

  return result.rows;
}

module.exports = {
  getDailyFootfall,
  getZoneWiseFootfall,
  getPeakHours
};
