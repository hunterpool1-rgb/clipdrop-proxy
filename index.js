<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The Clip Drop — Daily Workflow</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --black: #0a0a0a; --white: #fafafa;
    --gray-100: #f4f4f4; --gray-200: #e8e8e8;
    --gray-400: #aaa; --gray-600: #666;
    --green: #16a34a; --green-bg: #dcfce7;
    --red: #dc2626; --red-bg: #fee2e2;
    --amber: #b45309; --amber-bg: #fef3c7;
    --radius: 10px; --radius-sm: 6px;
    --font: 'DM Sans', sans-serif; --mono: 'DM Mono', monospace;
  }
  body { font-family: var(--font); background: var(--white); color: var(--black); min-height: 100vh; line-height: 1.5; }
  .app { max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }

  .header { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--gray-200); }
  .logo { width: 40px; height: 40px; background: var(--black); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .logo-text { color: white; font-size: 7px; font-weight: 500; letter-spacing: 0.05em; text-align: center; line-height: 1.4; text-transform: uppercase; }
  .header-info { flex: 1; }
  .header-title { font-size: 17px; font-weight: 500; }
  .header-sub { font-size: 12px; color: var(--gray-600); margin-top: 2px; }
  .proxy-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-family: var(--mono); padding: 3px 9px; background: var(--green-bg); color: var(--green); border-radius: 20px; margin-top: 6px; }
  .proxy-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .section { margin-bottom: 1.75rem; }
  .section-label { font-size: 10px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray-400); margin-bottom: 10px; }
  .card { background: var(--white); border: 1px solid var(--gray-200); border-radius: var(--radius); padding: 1rem 1.25rem; }

  .podcast-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .podcast-btn { background: var(--white); border: 1px solid var(--gray-200); border-radius: var(--radius); padding: 11px 13px; cursor: pointer; text-align: left; transition: border-color 0.15s, background 0.15s; font-family: var(--font); }
  .podcast-btn:hover { border-color: var(--gray-400); background: var(--gray-100); }
  .podcast-btn.active { border: 1.5px solid var(--black); background: var(--gray-100); }
  .p-name { font-size: 13px; font-weight: 500; color: var(--black); }
  .p-desc { font-size: 11px; color: var(--gray-600); margin-top: 2px; }

  .find-card { background: var(--black); border-radius: var(--radius); padding: 1.25rem; margin-bottom: 1.75rem; }
  .find-card-title { font-size: 14px; font-weight: 500; color: white; margin-bottom: 4px; }
  .find-card-desc { font-size: 12px; color: rgba(255,255,255,0.55); margin-bottom: 14px; line-height: 1.5; }
  .find-main-btn { width: 100%; padding: 11px; background: white; color: var(--black); border: none; border-radius: var(--radius-sm); font-size: 14px; font-weight: 500; font-family: var(--font); cursor: pointer; transition: opacity 0.15s; }
  .find-main-btn:hover { opacity: 0.9; }
  .find-main-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .ai-result { display: none; background: var(--gray-100); border: 1px solid var(--gray-200); border-radius: var(--radius); padding: 1rem 1.25rem; margin-top: 10px; }
  .ai-result.visible { display: block; }
  .ai-result-title { font-size: 11px; font-weight: 500; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
  .ai-thinking { font-size: 12px; color: var(--gray-600); font-family: var(--mono); line-height: 1.6; }
  .clip-suggestions { margin-top: 10px; display: flex; flex-direction: column; gap: 6px; }
  .clip-suggestion { display: flex; align-items: flex-start; justify-content: space-between; padding: 10px 12px; background: white; border: 1px solid var(--gray-200); border-radius: var(--radius-sm); gap: 12px; }
  .clip-suggestion.selected { border: 1.5px solid var(--black); }
  .suggestion-info { flex: 1; }
  .suggestion-title { font-size: 13px; font-weight: 500; color: var(--black); }
  .suggestion-time { font-size: 11px; font-family: var(--mono); color: var(--gray-600); margin-top: 2px; }
  .suggestion-why { font-size: 11px; color: var(--gray-600); margin-top: 3px; }
  .suggestion-hook { font-size: 11px; color: var(--black); font-weight: 500; margin-top: 4px; font-style: italic; }
  .use-btn { font-size: 11px; font-weight: 500; padding: 5px 11px; background: var(--black); color: white; border: none; border-radius: 4px; cursor: pointer; font-family: var(--font); white-space: nowrap; flex-shrink: 0; margin-top: 2px; }

  input[type="text"], input[type="number"], select {
    font-family: var(--font); font-size: 13px; color: var(--black); background: var(--white);
    border: 1px solid var(--gray-200); border-radius: var(--radius-sm); padding: 8px 11px;
    outline: none; transition: border-color 0.15s; width: 100%;
  }
  input[type="text"]:focus, input[type="number"]:focus, select:focus { border-color: var(--black); }
  input[type="number"] { font-family: var(--mono); }
  .url-row { display: flex; gap: 8px; }
  .time-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
  .field-label { font-size: 11px; color: var(--gray-600); margin-bottom: 5px; display: block; }
  .hint { font-size: 11px; color: var(--gray-400); margin-top: 8px; font-family: var(--mono); }
  .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .divider { height: 1px; background: var(--gray-200); margin: 12px 0; }

  .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid var(--gray-100); }
  .toggle-row:last-child { border-bottom: none; }
  .toggle-label { font-size: 13px; color: var(--black); }
  .toggle-desc { font-size: 11px; color: var(--gray-600); margin-top: 1px; }
  .toggle { position: relative; width: 36px; height: 20px; flex-shrink: 0; }
  .toggle input { opacity: 0; width: 0; height: 0; }
  .toggle-slider { position: absolute; inset: 0; background: var(--gray-200); border-radius: 20px; cursor: pointer; transition: background 0.2s; }
  .toggle input:checked + .toggle-slider { background: var(--black); }
  .toggle-slider::before { content: ''; position: absolute; width: 14px; height: 14px; left: 3px; top: 3px; background: white; border-radius: 50%; transition: transform 0.2s; }
  .toggle input:checked + .toggle-slider::before { transform: translateX(16px); }

  .submit-btn { width: 100%; padding: 12px; background: var(--black); color: white; border: none; border-radius: var(--radius); font-size: 14px; font-weight: 500; font-family: var(--font); cursor: pointer; margin-top: 14px; transition: opacity 0.15s; }
  .submit-btn:hover { opacity: 0.85; }
  .submit-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .error-msg { display: none; font-size: 13px; color: var(--red); background: var(--red-bg); padding: 10px 13px; border-radius: var(--radius-sm); margin-top: 10px; font-family: var(--mono); word-break: break-all; }
  .error-msg.visible { display: block; }

  .status-box { display: none; margin-top: 1.75rem; }
  .status-box.visible { display: block; }
  .status-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--gray-400); flex-shrink: 0; }
  .status-dot.processing { background: #f59e0b; animation: blink 1s infinite; }
  .status-dot.completed { background: var(--green); animation: none; }
  .status-dot.failed { background: var(--red); animation: none; }
  .status-text { font-size: 13px; color: var(--gray-600); }
  .status-id { font-size: 11px; font-family: var(--mono); color: var(--gray-400); margin-top: 2px; }
  .progress-bg { height: 3px; background: var(--gray-200); border-radius: 2px; overflow: hidden; }
  .progress-fill { height: 100%; background: var(--black); border-radius: 2px; transition: width 0.6s ease; width: 0%; }

  .clips-section { display: none; margin-top: 1.75rem; }
  .clips-section.visible { display: block; }
  .clip-card { background: var(--gray-100); border: 1px solid var(--gray-200); border-radius: var(--radius); padding: 13px 15px; margin-bottom: 10px; }
  .clip-card.top { border-color: var(--black); background: white; }
  .top-badge { font-size: 10px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--black); margin-bottom: 8px; }
  .clip-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
  .clip-title { font-size: 13px; font-weight: 500; color: var(--black); flex: 1; }
  .score-badge { font-size: 11px; font-weight: 500; font-family: var(--mono); padding: 3px 8px; border-radius: 4px; flex-shrink: 0; }
  .score-high { background: var(--green-bg); color: var(--green); }
  .score-mid { background: var(--amber-bg); color: var(--amber); }
  .score-low { background: var(--gray-100); color: var(--gray-600); }
  .clip-meta { font-size: 11px; font-family: var(--mono); color: var(--gray-400); margin-top: 5px; }
  .clip-actions { display: flex; gap: 6px; margin-top: 11px; }
  .clip-btn { flex: 1; padding: 7px; border: 1px solid var(--gray-200); border-radius: var(--radius-sm); background: white; color: var(--black); font-size: 12px; font-family: var(--font); cursor: pointer; transition: background 0.1s; }
  .clip-btn:hover { background: var(--gray-100); }
  .clip-btn.primary { background: var(--black); color: white; border-color: var(--black); }
  .clip-btn.primary:hover { opacity: 0.85; }

  .hooks-section { display: none; margin-top: 1.75rem; }
  .hooks-section.visible { display: block; }
  .hook-option { display: flex; align-items: flex-start; gap: 12px; padding: 11px 13px; border: 1px solid var(--gray-200); border-radius: var(--radius); margin-bottom: 8px; cursor: pointer; background: white; transition: border-color 0.15s; }
  .hook-option:hover { border-color: var(--gray-400); }
  .hook-option.selected { border: 1.5px solid var(--black); }
  .hook-num { font-size: 11px; font-family: var(--mono); color: var(--gray-400); min-width: 16px; margin-top: 1px; }
  .hook-text { font-size: 13px; font-weight: 500; color: var(--black); line-height: 1.5; }
  .hook-formula { font-size: 11px; color: var(--gray-400); margin-top: 3px; font-style: italic; }
  .open-btn { width: 100%; padding: 12px; background: white; color: var(--black); border: 1.5px solid var(--black); border-radius: var(--radius); font-size: 14px; font-weight: 500; font-family: var(--font); cursor: pointer; margin-top: 12px; transition: background 0.15s; }
  .open-btn:hover { background: var(--gray-100); }
</style>
</head>
<body>
<div class="app">

  <div class="header">
    <div class="logo"><div class="logo-text">THE<br>CLIP<br>DROP</div></div>
    <div class="header-info">
      <div class="header-title">Daily Clip Workflow</div>
      <div class="header-sub">Find → Clip → Hook → Schedule</div>
      <div class="proxy-pill"><span class="proxy-dot"></span>web-production-ce03b.up.railway.app</div>
    </div>
  </div>

  <!-- Step 1 -->
  <div class="section">
    <div class="section-label">Step 1 — Podcast source</div>
    <div class="podcast-grid">
      <button class="podcast-btn active" onclick="selectPodcast(this,'doac')">
        <div class="p-name">Diary of a CEO</div>
        <div class="p-desc">Primary — edgy & controversial</div>
      </button>
      <button class="podcast-btn" onclick="selectPodcast(this,'ich')">
        <div class="p-name">Iced Coffee Hour</div>
        <div class="p-desc">Finance & founder moments</div>
      </button>
      <button class="podcast-btn" onclick="selectPodcast(this,'srs')">
        <div class="p-name">Shawn Ryan Show</div>
        <div class="p-desc">Military & emotional stories</div>
      </button>
    </div>
  </div>

  <!-- Step 2 — AI Find -->
  <div class="find-card">
    <div class="find-card-title">Step 2 — Find today's viral clips</div>
    <div class="find-card-desc">Claude searches for the latest episode, identifies the best viral moments using your clipping framework, and auto-fills the timestamps below.</div>
    <button class="find-main-btn" id="find-btn" onclick="findEpisode()">&#9889; Find viral clips now</button>
  </div>
  <div class="ai-result" id="ai-result">
    <div class="ai-result-title">Claude's analysis</div>
    <div class="ai-thinking" id="ai-thinking"></div>
    <div class="clip-suggestions" id="clip-suggestions"></div>
  </div>

  <!-- Step 3 -->
  <div class="section">
    <div class="section-label">Step 3 — YouTube URL & timestamps</div>
    <div class="card">
      <input type="text" id="yt-url" placeholder="Auto-filled above, or paste manually..." />
      <div class="time-row">
        <div>
          <label class="field-label">Start (seconds)</label>
          <input type="number" id="start-time" value="0" min="0" />
        </div>
        <div>
          <label class="field-label">End (seconds)</label>
          <input type="number" id="end-time" value="600" min="60" />
        </div>
      </div>
      <div class="hint">mm:ss → multiply mins × 60 &nbsp;|&nbsp; min 60s, max 1200s</div>
    </div>
  </div>

  <!-- Step 4 -->
  <div class="section">
    <div class="section-label">Step 4 — Clip settings</div>
    <div class="card">
      <div class="settings-grid">
        <div>
          <label class="field-label">Clip length</label>
          <select id="pref-length">
            <option value="under60sec" selected>Under 60 sec</option>
            <option value="under30sec">Under 30 sec</option>
            <option value="under90sec">Under 90 sec</option>
            <option value="under3min">Under 3 min</option>
          </select>
        </div>
        <div>
          <label class="field-label">Layout</label>
          <select id="layout">
            <option value="fill" selected>Fill (talking head)</option>
            <option value="auto">Auto</option>
            <option value="fit">Fit (letterbox)</option>
          </select>
        </div>
      </div>
      <div class="divider"></div>
      <div class="toggle-row">
        <div><div class="toggle-label">Hook title overlay</div><div class="toggle-desc">Animated hook at clip start</div></div>
        <label class="toggle"><input type="checkbox" id="hook-title" checked /><span class="toggle-slider"></span></label>
      </div>
      <div class="toggle-row">
        <div><div class="toggle-label">Background music</div><div class="toggle-desc">Ambient mix at vol 12</div></div>
        <label class="toggle"><input type="checkbox" id="music-toggle" /><span class="toggle-slider"></span></label>
      </div>
      <div class="toggle-row">
        <div><div class="toggle-label">Subscribe CTA</div><div class="toggle-desc">End-card follow overlay</div></div>
        <label class="toggle"><input type="checkbox" id="cta-toggle" /><span class="toggle-slider"></span></label>
      </div>
    </div>
  </div>

  <button class="submit-btn" id="submit-btn" onclick="submitClip()">Submit to Ssemble</button>
  <div class="error-msg" id="error-msg"></div>

  <!-- Status -->
  <div class="status-box" id="status-box">
    <div class="section-label">Processing</div>
    <div class="card">
      <div class="status-header">
        <div class="status-dot processing" id="status-dot"></div>
        <div>
          <div class="status-text" id="status-text">Submitting...</div>
          <div class="status-id" id="status-id"></div>
        </div>
      </div>
      <div class="progress-bg"><div class="progress-fill" id="progress-fill"></div></div>
    </div>
  </div>

  <!-- Clips -->
  <div class="clips-section" id="clips-section">
    <div class="section-label">Clips ready</div>
    <div id="clips-grid"></div>
  </div>

  <!-- Hooks -->
  <div class="hooks-section" id="hooks-section">
    <div class="section-label">Hook options for top clip</div>
    <div id="hooks-container"></div>
    <button class="open-btn" onclick="window.open('https://app.ssemble.com','_blank')">Open Ssemble to apply hook & schedule ↗</button>
  </div>

</div>
<script>
const PROXY = 'https://web-production-ce03b.up.railway.app';
const TEMPLATE_ID = '66e386d23b11d1a71b755e44';
let pollInterval = null;
let selectedPodcast = 'doac';

function selectPodcast(el, id) {
  document.querySelectorAll('.podcast-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  selectedPodcast = id;
}

function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 12000);
}

async function findEpisode() {
  const btn = document.getElementById('find-btn');
  btn.disabled = true;
  btn.textContent = 'Searching...';
  const result = document.getElementById('ai-result');
  const thinking = document.getElementById('ai-thinking');
  const suggestions = document.getElementById('clip-suggestions');
  result.classList.add('visible');
  thinking.textContent = 'Searching for latest episode and identifying viral moments...';
  suggestions.innerHTML = '';

  try {
    const res = await fetch(`${PROXY}/find-clips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ podcast: selectedPodcast })
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      thinking.textContent = 'Error: ' + (data.error || 'Unknown error');
      btn.disabled = false; btn.textContent = '⚡ Find viral clips now'; return;
    }

    thinking.textContent = `Found: "${data.episode_title}" (${data.published})`;
    if (data.youtube_url) document.getElementById('yt-url').value = data.youtube_url;

    suggestions.innerHTML = '';
    data.clips.forEach((clip, i) => {
      const div = document.createElement('div');
      div.className = 'clip-suggestion' + (i === 0 ? ' selected' : '');
      div.innerHTML = `
        <div class="suggestion-info">
          <div class="suggestion-title">${clip.title}</div>
          <div class="suggestion-time">${fmtTime(clip.start_seconds)} → ${fmtTime(clip.end_seconds)} · ${Math.round((clip.end_seconds-clip.start_seconds)/60)}min window</div>
          <div class="suggestion-why">${clip.why}</div>
          <div class="suggestion-hook">"${clip.hook}"</div>
        </div>
        <button class="use-btn" onclick="useClip(${clip.start_seconds},${clip.end_seconds},this)">Use</button>`;
      if (i === 0) {
        document.getElementById('start-time').value = clip.start_seconds;
        document.getElementById('end-time').value = clip.end_seconds;
      }
      suggestions.appendChild(div);
    });
  } catch(e) {
    thinking.textContent = 'Network error: ' + e.message;
  }
  btn.disabled = false;
  btn.textContent = '⚡ Find viral clips now';
}

function useClip(start, end, btn) {
  document.getElementById('start-time').value = start;
  document.getElementById('end-time').value = end;
  document.querySelectorAll('.clip-suggestion').forEach(el => el.classList.remove('selected'));
  btn.closest('.clip-suggestion').classList.add('selected');
}

async function submitClip() {
  const url = document.getElementById('yt-url').value.trim();
  if (!url || !url.includes('youtube.com/watch')) { showError('Please enter a valid YouTube URL.'); return; }
  const start = parseInt(document.getElementById('start-time').value) || 0;
  const end = parseInt(document.getElementById('end-time').value) || 0;
  if (end - start < 60) { showError('Window must be at least 60 seconds.'); return; }
  if (end - start > 1200) { showError('Window cannot exceed 1200 seconds.'); return; }

  const btn = document.getElementById('submit-btn');
  btn.disabled = true; btn.textContent = 'Submitting...';
  document.getElementById('error-msg').classList.remove('visible');
  document.getElementById('clips-section').classList.remove('visible');
  document.getElementById('hooks-section').classList.remove('visible');

  const body = {
    url, start, end,
    preferredLength: document.getElementById('pref-length').value,
    language: 'en', templateId: TEMPLATE_ID,
    layout: document.getElementById('layout').value,
    hookTitle: document.getElementById('hook-title').checked
  };
  if (document.getElementById('music-toggle').checked) { body.music = true; body.musicVolume = 12; }
  if (document.getElementById('cta-toggle').checked) { body.ctaEnabled = true; body.ctaText = 'Follow The Clip Drop for more'; }

  try {
    const res = await fetch(`${PROXY}/create`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const json = await res.json();
    if (!res.ok) { showError('API error ' + res.status + ': ' + JSON.stringify(json)); btn.disabled = false; btn.textContent = 'Submit to Ssemble'; return; }
    const requestId = json.data?.requestId || json.requestId;
    if (!requestId) { showError('No request ID: ' + JSON.stringify(json)); btn.disabled = false; btn.textContent = 'Submit to Ssemble'; return; }
    showStatus(requestId);
    startPolling(requestId);
  } catch(e) {
    showError('Network error: ' + e.message);
    btn.disabled = false; btn.textContent = 'Submit to Ssemble';
  }
}

function showStatus(id) {
  const box = document.getElementById('status-box');
  box.classList.add('visible');
  document.getElementById('status-id').textContent = 'ID: ' + id;
  document.getElementById('status-text').textContent = 'Processing... (5–30 min typical)';
  document.getElementById('status-dot').className = 'status-dot processing';
  document.getElementById('progress-fill').style.width = '5%';
}

function startPolling(id) {
  let fake = 5;
  if (pollInterval) clearInterval(pollInterval);
  pollInterval = setInterval(async () => {
    try {
      const res = await fetch(`${PROXY}/status/${id}`);
      const json = await res.json();
      if (!res.ok) return;
      const status = json.data?.status || json.status;
      const progress = json.data?.progress || json.progress || fake;
      fake = Math.min(fake + 2, 90);
      document.getElementById('progress-fill').style.width = Math.round(progress) + '%';
      document.getElementById('status-text').textContent = statusLabel(status, progress);
      if (status === 'completed') {
        clearInterval(pollInterval);
        document.getElementById('progress-fill').style.width = '100%';
        document.getElementById('status-dot').className = 'status-dot completed';
        document.getElementById('status-text').textContent = '✓ Clips ready';
        fetchClips(id);
      } else if (status === 'failed') {
        clearInterval(pollInterval);
        document.getElementById('status-dot').className = 'status-dot failed';
        document.getElementById('status-text').textContent = 'Failed — try again';
        document.getElementById('submit-btn').disabled = false;
        document.getElementById('submit-btn').textContent = 'Submit to Ssemble';
      }
    } catch(e) {}
  }, 10000);
}

function statusLabel(s, p) {
  const pct = p ? ' ' + Math.round(p) + '%' : '';
  if (s === 'queued') return 'Queued...';
  if (s === 'processing') return 'Processing' + pct;
  if (s === 'transcribing') return 'Transcribing audio...';
  if (s === 'clipping') return 'AI finding best moments...';
  if (s === 'rendering') return 'Rendering clips...';
  return 'Status: ' + s;
}

async function fetchClips(id) {
  try {
    const res = await fetch(`${PROXY}/shorts/${id}`);
    const json = await res.json();
    if (!res.ok) return;
    renderClips(json.data?.shorts || json.shorts || []);
  } catch(e) {}
}

function renderClips(clips) {
  const section = document.getElementById('clips-section');
  const grid = document.getElementById('clips-grid');
  grid.innerHTML = '';
  if (!clips.length) {
    grid.innerHTML = '<p style="font-size:13px;color:#666;padding:10px 0;">No clips returned. Try a wider time window.</p>';
    section.classList.add('visible'); return;
  }
  const sorted = [...clips].sort((a,b) => (b.viral_score||0)-(a.viral_score||0));
  sorted.forEach((clip, i) => {
    const score = clip.viral_score || 0;
    const sc = score >= 80 ? 'score-high' : score >= 60 ? 'score-mid' : 'score-low';
    const isTop = i === 0;
    const div = document.createElement('div');
    div.className = 'clip-card' + (isTop ? ' top' : '');
    div.innerHTML = `
      ${isTop ? '<div class="top-badge">⭐ Top clip</div>' : ''}
      <div class="clip-top">
        <div class="clip-title">${clip.title || 'Clip '+(i+1)}</div>
        <span class="score-badge ${sc}">${Math.round(score)}</span>
      </div>
      <div class="clip-meta">${clip.start_time != null ? fmtTime(clip.start_time)+' → '+fmtTime(clip.end_time) : ''}${clip.duration ? ' · '+Math.round(clip.duration)+'s' : ''}</div>
      <div class="clip-actions">
        ${clip.video_url ? `<button class="clip-btn" onclick="window.open('${clip.video_url}','_blank')">Preview</button><button class="clip-btn" onclick="window.open('${clip.video_url}','_blank')">Download</button>` : ''}
        ${isTop ? '<button class="clip-btn primary" onclick="document.getElementById(\'hooks-section\').scrollIntoView({behavior:\'smooth\'})">Write hook ↓</button>' : ''}
      </div>`;
    grid.appendChild(div);
  });
  section.classList.add('visible');
  generateHooks(sorted[0]);
  document.getElementById('submit-btn').disabled = false;
  document.getElementById('submit-btn').textContent = 'Submit another clip';
}

function generateHooks(clip) {
  const t = (clip?.title || '').toLowerCase();
  let hooks = [];
  if (t.includes('sugar')||t.includes('liver')||t.includes('diabetes')||t.includes('cancer')||t.includes('glucose')||t.includes('insulin')||t.includes('fatty')) {
    hooks = [{text:'1 in 3 people have this — and don\'t know it',formula:'[Stat] + [hidden threat]'},{text:'Your breakfast has 8x more sugar than your blood can handle',formula:'[Shocking comparison]'},{text:'Sugar feeds 8 types of cancer. Doctors stay silent.',formula:'[Forbidden medical claim]'}];
  } else if (t.includes('steroid')||t.includes('testosterone')||t.includes('cardiac')||t.includes('heart')||t.includes('peptide')) {
    hooks = [{text:'122x more risk of cardiac death',formula:'[Shocking stat] + [worst consequence]'},{text:'Doctors are hiding this from you',formula:'[Authority betrayal]'},{text:'This is destroying men\'s hearts silently',formula:'[Silent threat]'}];
  } else if (t.includes('money')||t.includes('wealth')||t.includes('million')||t.includes('debt')||t.includes('retirement')||t.includes('rich')) {
    hooks = [{text:'97% of people never learn this about money',formula:'[Stat] + [exclusive knowledge]'},{text:'The wealth gap starts here — not in school',formula:'[Controversial origin]'},{text:'Most Americans will run out of money before they die',formula:'[Retirement fear]'}];
  } else if (t.includes('women')||t.includes('men')||t.includes('gender')||t.includes('dating')||t.includes('birth')||t.includes('relationship')) {
    hooks = [{text:'Nobody wants to say this out loud',formula:'[Forbidden truth]'},{text:'The data on this will make you angry',formula:'[Emotional data]'},{text:'This is why the birth rate is collapsing',formula:'[Big cause + scary effect]'}];
  } else if (t.includes('war')||t.includes('military')||t.includes('soldier')||t.includes('combat')||t.includes('veteran')) {
    hooks = [{text:'He saw things that will haunt you',formula:'[Emotional transfer]'},{text:'The government lied about what happened',formula:'[Authority betrayal]'},{text:'Most soldiers never talk about this',formula:'[Forbidden silence]'}];
  } else if (t.includes('ai')||t.includes('trump')||t.includes('economy')||t.includes('job')||t.includes('ramsey')||t.includes('millionaire')) {
    hooks = [{text:'Only 10% of people can do this. Don\'t try.',formula:'[Contrarian stat hook]'},{text:'The financial advice ruining your 20s',formula:'[Influencer takedown]'},{text:'Dave Ramsey would never allow this',formula:'[Authority conflict]'}];
  } else {
    hooks = [{text:'Nobody is talking about this',formula:'[Forbidden knowledge]'},{text:'The data on this is genuinely terrifying',formula:'[Emotional data]'},{text:'This will change how you see everything',formula:'[Worldview shift]'}];
  }
  const container = document.getElementById('hooks-container');
  container.innerHTML = '';
  hooks.forEach((h, i) => {
    const div = document.createElement('div');
    div.className = 'hook-option' + (i===0?' selected':'');
    div.onclick = () => { document.querySelectorAll('.hook-option').forEach(x=>x.classList.remove('selected')); div.classList.add('selected'); };
    div.innerHTML = `<div class="hook-num">0${i+1}</div><div><div class="hook-text">${h.text}</div><div class="hook-formula">${h.formula}</div></div>`;
    container.appendChild(div);
  });
  document.getElementById('hooks-section').classList.add('visible');
}

function fmtTime(s) {
  if (s==null) return '';
  return Math.floor(s/60)+':'+String(Math.round(s%60)).padStart(2,'0');
}
</script>
</body>
</html>
