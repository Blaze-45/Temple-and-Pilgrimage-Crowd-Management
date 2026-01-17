const pool = require('../db/pool');
const { calculateZoneStatus } = require('./zoneStatusService');
const { calculateHeatmapLevel } = require('./heatmapService');

async function getAdminDashboardData() {
  // 1. Zones base data
  const zonesRes = await pool.query(`SELECT * FROM zones`);
  const zones = zonesRes.rows;

  // 2. Entry/Exit stats
  const statsRes = await pool.query(`
    SELECT
      zone_id,
      COUNT(*) FILTER (WHERE event_type='ENTRY') AS entries,
      COUNT(*) FILTER (WHERE event_type='EXIT') AS exits
    FROM zone_events
    GROUP BY zone_id
  `);

  const statsMap = {};
  statsRes.rows.forEach(row => {
    statsMap[row.zone_id] = row;
  });

  // 3. Active emergencies
  const emergenciesRes = await pool.query(`
    SELECT e.id, e.zone_id, z.name AS zone_name, e.status
    FROM emergencies e
    JOIN zones z ON z.id = e.zone_id
    WHERE e.status IN ('REPORTED','DISPATCHED','IN_PROGRESS')
  `);

  // 4. Combine everything
  const dashboardZones = zones.map(zone => {
    const stat = statsMap[zone.id] || { entries: 0, exits: 0 };
    const heat = calculateHeatmapLevel(zone);

    return {
      zoneId: zone.id,
      zoneName: zone.name,
      currentCapacity: zone.current_capacity,
      maxCapacity: zone.max_capacity,
      isBlocked: zone.is_blocked,
      status: calculateZoneStatus(zone),
      heatLevel: heat.level,
      occupancyPercent: Math.round(heat.percentage),
      entries: Number(stat.entries),
      exits: Number(stat.exits)
    };
  });

  return {
    zones: dashboardZones,
    activeEmergencies: emergenciesRes.rows
  };
}

module.exports = { getAdminDashboardData };
