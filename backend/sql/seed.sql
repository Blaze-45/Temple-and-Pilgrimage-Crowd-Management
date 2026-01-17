-- =========================
-- ZONES
-- =========================

INSERT INTO zones VALUES
(gen_random_uuid(), 'Entry Gate', 500, 0, false, 50),
(gen_random_uuid(), 'Main Hall', 300, 0, false, 30),
(gen_random_uuid(), 'Sanctum Queue', 150, 0, false, 20);

-- =========================
-- SLOTS
-- =========================

INSERT INTO slots VALUES
(gen_random_uuid(), NOW(), NOW() + INTERVAL '1 hour', 'ACTIVE'),
(gen_random_uuid(), NOW() + INTERVAL '1 hour', NOW() + INTERVAL '2 hours', 'ACTIVE');

-- =========================
-- DEVOTEES
-- =========================

INSERT INTO devotees VALUES
(gen_random_uuid(), 'Normal Devotee', 'NORMAL'),
(gen_random_uuid(), 'Elder Devotee', 'ELDERLY'),
(gen_random_uuid(), 'Temple Staff', 'STAFF');

-- =========================
-- BOOKINGS
-- =========================

INSERT INTO bookings (
  id,
  slot_id,
  devotee_id,
  devotee_category,
  status,
  created_at
)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM slots LIMIT 1),
  (SELECT id FROM devotees LIMIT 1),
  'NORMAL',
  'BOOKED',
  NOW()
);

-- =========================
-- QR CODES
-- =========================

INSERT INTO qr_codes (
  id,
  booking_id,
  devotee_id,
  valid_from,
  valid_to,
  status,
  last_scanned_zone
)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM bookings LIMIT 1),
  (SELECT id FROM devotees LIMIT 1),
  NOW(),
  NOW() + INTERVAL '1 hour',
  'ISSUED',
  NULL
);
