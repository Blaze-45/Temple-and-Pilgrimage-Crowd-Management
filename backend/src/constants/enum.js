const EmergencyStatus = Object.freeze({
  REPORTED: 'REPORTED',
  DISPATCHED: 'DISPATCHED',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED'
});

const EmergencyTransitions = Object.freeze({
  REPORTED: ['DISPATCHED'],
  DISPATCHED: ['IN_PROGRESS'],
  IN_PROGRESS: ['RESOLVED'],
  RESOLVED: []
});

const DevoteeCategory = Object.freeze({
  NORMAL: 'NORMAL',
  VIP: 'VIP',
  ELDERLY: 'ELDERLY',
  STAFF: 'STAFF'
});

module.exports = {
  EmergencyStatus,
  EmergencyTransitions,
  DevoteeCategory
};
