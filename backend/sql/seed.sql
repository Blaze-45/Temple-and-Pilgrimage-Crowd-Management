DELETE FROM zone_events;
DELETE FROM qr_codes;
DELETE FROM bookings;
DELETE FROM emergencies;
DELETE FROM devotees;
DELETE FROM zones;
INSERT INTO zones VALUES
(gen_random_uuid(), 'Sanctum Bottleneck', 100, 85, false, 20),
(gen_random_uuid(), 'Main Hall Wide', 500, 120, false, 50);
INSERT INTO devotees VALUES
(gen_random_uuid(), 'Normal Devotee', 'NORMAL'),
(gen_random_uuid(), 'Temple Staff', 'STAFF');
INSERT INTO bookings VALUES
(gen_random_uuid(), NOW(), NOW() + INTERVAL '1 hour', 'CONFIRMED'),
(gen_random_uuid(), NOW(), NOW() + INTERVAL '1 hour', 'CONFIRMED');
INSERT INTO qr_codes VALUES (
  gen_random_uuid(),
  (SELECT id FROM bookings LIMIT 1),
  (SELECT id FROM devotees WHERE category='NORMAL'),
  NOW(),
  NOW() + INTERVAL '1 hour',
  'ISSUED',
  NULL
);
INSERT INTO qr_codes VALUES (
  gen_random_uuid(),
  (SELECT id FROM bookings OFFSET 1 LIMIT 1),
  (SELECT id FROM devotees WHERE category='STAFF'),
  NOW(),
  NOW() + INTERVAL '1 hour',
  'ISSUED',
  NULL
);
SELECT * FROM zones;
SELECT * FROM devotees;
SELECT * FROM bookings;
SELECT * FROM qr_codes;
SELECT q.id, b.id
FROM qr_codes q
JOIN bookings b ON q.booking_id = b.id;
