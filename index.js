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
const CLAUDE_KEY = process.env.CLAUDE_API_KEY;
const SSEMBLE_BASE = 'https://aiclipping.ssemble.com/api/v1';

app.get('/health', (req, res) => {
  res.json({ status: 'ok', ssemble: SSEMBLE_KEY ? 'set' : 'missing', claude: CLAUDE_KEY ? 'set' : 'missing' });
});

app.post('/find-clips', async (req, res) => {
  const { podcast } = req.body;
  const podcastNames = {
    doac: 'Diary of a CEO with Steven Bartlett',
    ich: 'Iced Coffee Hour with Graham Stephan',
    srs: 'Shawn Ryan Show'
  };
  const p
