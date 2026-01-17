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
