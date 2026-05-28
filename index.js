const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SSEMBLE_KEY = process.env.SSEMBLE_API_KEY;
const CLAUDE_KEY = process.env.CLAUDE_API_KEY || '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';
const SSEMBLE_BASE = 'https://aiclipping.ssemble.com/api/v1';

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    ssemble: SSEMBLE_KEY ? 'set' : 'missing', 
    claude: CLAUDE_KEY ? 'set' : 'missing',
    env_keys: Object.keys(process.env).filter(k => k.includes('CLAUDE'))
  });
});

app.post('/find-clips', async (req, res) => {
  const { podcast } = req.body;
  const podcastNames = {
    doac: 'Diary of a CEO with Steven Bartlett',
    ich: 'Iced Coffee Hour with Graham Stephan',
    srs: 'Shawn Ryan Show'
  };
  const podcastName = podcastNames[podcast] || podcast;

  const prompt = `You are a viral clip researcher for a short-form content channel called The Clip Drop. Find the latest episode of "${podcastName}" released in the last 48 hours and identify the best 3 viral clip moments.

Clipping framework — look for:
1. Gender/dating/relationship claim that sparks debate
2. Shocking medical stat or health claim
3. Political or economic prediction that feels urgent
4. Host pushback moment — host challenges the guest hard
5. Stat that triggers fear, anger, or disbelief

IMPORTANT: Avoid anything already posted by @TheDiaryOfACEOClips official channel.

Return ONLY a valid JSON object, no markdown, no backticks, no preamble:
{
  "episode_title": "Full episode title",
  "youtube_url": "https://www.youtube.com/watch?v=VIDEOID",
  "published": "date published",
  "clips": [
    {
      "title": "Short descriptive title",
      "start_seconds": 660,
      "end_seconds": 1260,
      "why": "One sentence: why this will go viral",
      "hook": "Hook text: shocking stat or claim in under 8 words"
    },
    {
      "title": "...",
      "start_seconds": 2280,
      "end_seconds": 2880,
      "why": "...",
      "hook": "..."
    },
    {
      "title": "...",
      "start_seconds": 3120,
      "end_seconds": 3720,
      "why": "...",
      "hook": "..."
    }
  ]
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || 'Claude API error' });
    }

    const textBlock = data.content?.find(b => b.type === 'text');
    const rawText = textBlock?.text || '';

    let parsed = null;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    } catch(e) {
      return res.status(500).json({ error: 'Failed to parse Claude response', raw: rawText });
    }

    if (!parsed) return res.status(500).json({ error: 'No JSON found', raw: rawText });
    res.json(parsed);

  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/create', async (req, res) => {
  try {
    const response = await fetch(`${SSEMBLE_BASE}/shorts/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': SSEMBLE_KEY },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch(err) {
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
  } catch(err) {
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
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
