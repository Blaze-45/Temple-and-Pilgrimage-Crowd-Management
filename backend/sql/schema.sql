CREATE TYPE devotee_category AS ENUM (
  'NORMAL',
  'VIP',
  'ELDERLY',
  'STAFF'
);

CREATE TYPE qr_status AS ENUM (
  'ISSUED',
  'SCANNED',
  'EXPIRED',
  'INVALIDATED'
);

CREATE TYPE emergency_status AS ENUM (
  'REPORTED',
  'DISPATCHED',
  'IN_PROGRESS',
  'RESOLVED'
);
DROP TABLE if EXISTS zones;
CREATE TABLE zones (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  max_capacity INT NOT NULL,
  current_capacity INT NOT NULL DEFAULT 0,
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  reserved_priority_capacity INT NOT NULL
);

DROP TABLE IF EXISTS devotees;
CREATE TABLE devotees (
  id UUID PRIMARY KEY,
  name TEXT,
  category devotee_category NOT NULL
);

DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  slot_start TIMESTAMP NOT NULL,
  slot_end TIMESTAMP NOT NULL,
  status TEXT NOT NULL
);

DROP TABLE IF EXISTS qr_codes;
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  devotee_id UUID REFERENCES devotees(id),
  valid_from TIMESTAMP NOT NULL,
  valid_to TIMESTAMP NOT NULL,
  status qr_status NOT NULL,
  last_scanned_zone UUID REFERENCES zones(id)
);

DROP TABLE IF EXISTS zone_events;
CREATE TABLE zone_events (
  id UUID PRIMARY KEY,
  zone_id UUID REFERENCES zones(id),
  qr_id UUID REFERENCES qr_codes(id),
  event_type TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS emergencies;
CREATE TABLE emergencies (
  id UUID PRIMARY KEY,
  zone_id UUID REFERENCES zones(id),
  status emergency_status NOT NULL,
  reported_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX one_active_emergency_per_zone
ON emergencies (zone_id)
WHERE status IN ('REPORTED', 'DISPATCHED', 'IN_PROGRESS');