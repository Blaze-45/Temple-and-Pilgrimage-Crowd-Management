function calculateHeatmapLevel(zone) {
  if (zone.is_blocked) {
    return {
      level: 'BLOCKED',
      percentage: 100
    };
  }

  const percentage =
    (zone.current_capacity / zone.max_capacity) * 100;

  if (percentage < 50) {
    return { level: 'LOW', percentage };
  }

  if (percentage < 75) {
    return { level: 'MEDIUM', percentage };
  }

  if (percentage < 90) {
    return { level: 'HIGH', percentage };
  }

  return { level: 'CRITICAL', percentage };
}

module.exports = { calculateHeatmapLevel };
