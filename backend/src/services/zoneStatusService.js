function calculateZoneStatus(zone) {
  if (zone.is_blocked) {
    return 'CRITICAL';
  }

  const ratio = zone.current_capacity / zone.max_capacity;

  if (ratio < 0.7) return 'NORMAL';
  if (ratio < 0.9) return 'CONGESTED';
  return 'CRITICAL';
}

module.exports = { calculateZoneStatus };
