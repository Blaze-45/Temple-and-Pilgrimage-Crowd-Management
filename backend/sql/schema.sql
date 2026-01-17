-- =========================
-- ENUM TYPES
-- =========================

CREATE TYPE devotee_category AS ENUM (
  'NORMAL',
  'VIP',
  'ELDERLY',
  'STAFF'
);

CREATE TYPE qr_status AS ENUM (
  'ISSUED',
  'SCANNED',
  'EXITED',
  'EXPIRED'
);

CREATE TYPE emergency_status AS ENUM (
  'REPORTED',
  'DISPATCHED',
  'IN_PROGRESS',
  'RESOLVED'
);

-- =========================
-- CORE TABLES
-- =========================

CREATE TABLE zones (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  max_capacity INT NOT NULL,
  current_capacity INT NOT NULL DEFAULT 0,
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  reserved_priority_capacity INT NOT NULL
);

CREATE TABLE devotees (
  id UUID PRIMARY KEY,
  name TEXT,
  category devotee_category NOT NULL
);

-- =========================
-- SLOTS (TIME WINDOWS)
-- =========================

CREATE TABLE slots (
  id UUID PRIMARY KEY,
  slot_start TIMESTAMP NOT NULL,
  slot_end TIMESTAMP NOT NULL,
  status TEXT NOT NULL
);

-- =========================
-- BOOKINGS (WHO BOOKED WHICH SLOT)
-- =========================

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  slot_id UUID NOT NULL
    REFERENCES slots(id)
    ON DELETE CASCADE,

  devotee_id UUID
    REFERENCES devotees(id)
    ON DELETE SET NULL,

  devotee_category devotee_category NOT NULL,

  status TEXT NOT NULL
    CHECK (status IN ('BOOKED', 'CANCELLED')),

  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- QR CODES
-- =========================

CREATE TABLE qr_codes (
  id UUID PRIMARY KEY,

  booking_id UUID NOT NULL
    REFERENCES bookings(id)
    ON DELETE CASCADE,

  devotee_id UUID
    REFERENCES devotees(id),

  valid_from TIMESTAMP NOT NULL,
  valid_to TIMESTAMP NOT NULL,

  status qr_status NOT NULL,

  last_scanned_zone UUID
    REFERENCES zones(id)
);

-- =========================
-- ZONE EVENTS (AUDIT LOG)
-- =========================

CREATE TABLE zone_events (
  id UUID PRIMARY KEY,
  zone_id UUID REFERENCES zones(id),
  qr_id UUID REFERENCES qr_codes(id),
  event_type TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- EMERGENCIES
-- =========================

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
