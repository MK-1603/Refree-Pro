import { Router } from 'express';

const router = Router();

// Pause timer
router.post('/:id/pause', async (req, res) => {
  const { id } = req.params;
  const { minute, elapsedMs } = req.body;
  // Logic to pause timer
  res.json({ success: true, state: 'paused' });
});

// Resume timer
router.post('/:id/resume', async (req, res) => {
  const { id } = req.params;
  // Logic to resume timer
  res.json({ success: true, state: 'live' });
});

// Add extra time
router.post('/:id/extra-time', async (req, res) => {
  const { id } = req.params;
  const { extraMinutes } = req.body;
  // Logic to add extra time
  res.json({ success: true });
});

export default router;
