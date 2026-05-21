const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const SSEMBLE_KEY = process.env.SSEMBLE_API_KEY;
const SSEMBLE_BASE = 'https://aiclipping.ssemble.com/api/v1';

app.post('/create', async (req, res) => {
  try {
    const response = await fetch(`${SSEMBLE_BASE}/shorts/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': SSEMBLE_KEY
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/status/:id', async (req, res) => {
  try {
    const response = await fetch(`${SSEMBLE_BASE}/shorts/${req.params.id}/status`, {
      headers: { 'X-API-Key': SSEMBLE_KEY }
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/shorts/:id', async (req, res) => {
  try {
    const response = await fetch(`${SSEMBLE_BASE}/shorts/${req.params.id}`, {
      headers: { 'X-API-Key': SSEMBLE_KEY }
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
