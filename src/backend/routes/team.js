import express from 'express';

export const router = express.Router();

// Team API endpoints
router.get('/team', (req, res) => {
  res.json({
    status: 'success',
    message: 'Team data endpoint',
    data: {
      pillars: ['Theory', 'Infrastructure', 'Cinema', 'Healing'],
      members: 4,
      established: '2024'
    }
  });
});

// Individual team member endpoints
router.get('/team/:pillar', (req, res) => {
  const { pillar } = req.params;
  const validPillars = ['theory', 'infrastructure', 'cinema', 'healing'];
  
  if (!validPillars.includes(pillar.toLowerCase())) {
    return res.status(404).json({
      status: 'error',
      message: 'Pillar not found'
    });
  }
  
  res.json({
    status: 'success',
    pillar: pillar,
    message: `${pillar} pillar data`
  });
});

// Health check for team routes
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    service: 'team-routes',
    timestamp: new Date().toISOString()
  });
});