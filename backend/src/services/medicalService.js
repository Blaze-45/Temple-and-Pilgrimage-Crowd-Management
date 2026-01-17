const pool = require('../db/pool');
const { v4: uuidv4 } = require('uuid');

async function addMedicalResource({ name, type, status, zoneId }) {
  const result = await pool.query(
    `
    INSERT INTO medical_resources (id, name, type, status, zone_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [uuidv4(), name, type, status, zoneId]
  );
  return result.rows[0];
}

async function getAllMedicalResources() {
  const result = await pool.query(
    `
    SELECT
      m.id,
      m.name,
      m.type,
      m.status,
      z.name AS zone
    FROM medical_resources m
    LEFT JOIN zones z ON z.id = m.zone_id
    `
  );
  return result.rows;
}

async function updateMedicalStatus(id, status) {
  const result = await pool.query(
    `
    UPDATE medical_resources
    SET status = $1
    WHERE id = $2
    RETURNING *
    `,
    [status, id]
  );
  return result.rows[0];
}

module.exports = {
  addMedicalResource,
  getAllMedicalResources,
  updateMedicalStatus
};
