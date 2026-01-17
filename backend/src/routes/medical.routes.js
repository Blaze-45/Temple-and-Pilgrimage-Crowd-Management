const router = require('express').Router();
const {
  addMedicalResource,
  getAllMedicalResources,
  updateMedicalStatus
} = require('../services/medicalService');

/**
 * Add a medical resource
 */
router.post('/', async (req, res) => {
  const resource = await addMedicalResource(req.body);
  res.json(resource);
});

/**
 * Get all medical resources
 */
router.get('/', async (req, res) => {
  const resources = await getAllMedicalResources();
  res.json(resources);
});

/**
 * Update resource status
 */
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const resource = await updateMedicalStatus(req.params.id, status);
  res.json(resource);
});

module.exports = router;
