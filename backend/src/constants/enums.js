// =====================
// BOOKING
// =====================
const BOOKING_STATUS = Object.freeze({
  BOOKED: 'BOOKED',
  CANCELLED: 'CANCELLED',
});

// =====================
// QR
// =====================
const QR_STATUS = Object.freeze({
  ISSUED: 'ISSUED',
  SCANNED: 'SCANNED',
  EXITED: 'EXITED',
  EXPIRED: 'EXPIRED',
});

// =====================
// EMERGENCY
// =====================
const EmergencyStatus = Object.freeze({
  REPORTED: 'REPORTED',
  DISPATCHED: 'DISPATCHED',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
});

const EmergencyTransitions = Object.freeze({
  REPORTED: ['DISPATCHED'],
  DISPATCHED: ['IN_PROGRESS'],
  IN_PROGRESS: ['RESOLVED'],
  RESOLVED: [],
});

// =====================
// DEVOTEE
// =====================
const DevoteeCategory = Object.freeze({
  NORMAL: 'NORMAL',
  VIP: 'VIP',
  ELDERLY: 'ELDERLY',
  STAFF: 'STAFF',
});

// =====================
// EXPORT (SINGLE EXPORT ONLY)
// =====================
module.exports = {
  BOOKING_STATUS,
  QR_STATUS,
  EmergencyStatus,
  EmergencyTransitions,
  DevoteeCategory,
};
