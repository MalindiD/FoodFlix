const express = require('express');
const axios = require('axios');
const router = express.Router();

const LOCATIONIQ_API_KEY = process.env.LOCATIONIQ_API_KEY;

router.get('/api/location-autocomplete', async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(
      `https://api.locationiq.com/v1/autocomplete.php?key=${LOCATIONIQ_API_KEY}&q=${query}&format=json`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching LocationIQ:', error.message);
    res.status(500).json({ error: 'Failed to fetch location autocomplete' });
  }
});

module.exports = router;
