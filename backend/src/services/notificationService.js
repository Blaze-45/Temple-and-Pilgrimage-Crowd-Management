const { v4: uuidv4 } = require('uuid');

async function createNotification(client, devoteeId, message) {
  await client.query(
    `
    INSERT INTO notifications (id, devotee_id, message)
    VALUES ($1, $2, $3)
    `,
    [uuidv4(), devoteeId, message]
  );
}

module.exports = { createNotification };
async function getNotificationsByDevotee(client, devoteeId) {
  const { rows } = await client.query(
    `
    SELECT id, message, created_at
    FROM notifications
    WHERE devotee_id = $1
    ORDER BY created_at DESC
    LIMIT 20
    `,
    [devoteeId]
  );

  return rows;
}

module.exports = {
  createNotification,
  getNotificationsByDevotee,
};
