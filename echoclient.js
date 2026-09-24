var WindowManager = {
  currentScreen: null,

  openWindow: function (screenName) {
    if (this.currentScreen && typeof this.currentScreen.hide === 'function') {
      this.currentScreen.hide();
    }
    switch (screenName) {
      case 'echoSettings':
      case 'settings':
        if (typeof echoSettings !== 'undefined') {
          echoSettings.show();
          this.currentScreen = echoSettings;
        } else {
          console.error('echoSettings is not loaded!');
        }
        break;
    }
  },

  closeCurrent: function () {
    if (this.currentScreen && typeof this.currentScreen.hide === 'function') {
      this.currentScreen.hide();
    }
    this.currentScreen = null;
  },
};

function EchoSettings() {
  if (!document.getElementById('echo-font')) {
    const link = document.createElement('link');
    link.id = 'echo-font';
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500&display=swap';
    document.head.appendChild(link);
  }

  const style = document.createElement('style');
  style.id = 'echo-gui-style';
  style.innerHTML = `
    :root {
      --eg-bg:       #0d0b14;
      --eg-surface:  #13101e;
      --eg-border:   #2a1f4a;
      --eg-accent:   #7c3aed;
      --eg-accent2:  #a855f7;
      --eg-text:     #c4b5fd;
      --eg-muted:    #6d5d8a;
      --eg-toggle-off: #2e2040;
    }

    #echo-gui * { box-sizing: border-box; margin: 0; padding: 0; }

    #echo-gui {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 260px;
      background: var(--eg-bg);
      border: 1px solid var(--eg-border);
      border-radius: 8px;
      color: var(--eg-text);
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      box-shadow: 0 0 0 1px #7c3aed22, 0 8px 32px #0007, inset 0 1px 0 #ffffff08;
      display: none;
      z-index: 999999;
      user-select: none;
      overflow: hidden;
    }

    #eg-titlebar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: var(--eg-surface);
      border-bottom: 1px solid var(--eg-border);
      cursor: move;
    }

    #eg-logo {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 2px;
      color: var(--eg-accent2);
      text-shadow: 0 0 12px #a855f766;
    }

    #eg-close {
      width: 16px;
      height: 16px;
      background: #3b2060;
      border: none;
      border-radius: 3px;
      color: var(--eg-text);
      cursor: pointer;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      transition: background .15s;
    }
    #eg-close:hover { background: var(--eg-accent); color: #fff; }

    #eg-tabs {
      display: flex;
      background: var(--eg-surface);
      border-bottom: 1px solid var(--eg-border);
    }

    .eg-tab {
      flex: 1;
      padding: 6px 0;
      text-align: center;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 11px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--eg-muted);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: color .15s, border-color .15s;
    }
    .eg-tab:hover { color: var(--eg-text); }
    .eg-tab.active {
      color: var(--eg-accent2);
      border-bottom: 2px solid var(--eg-accent);
    }

    #eg-content {
      padding: 10px 12px 12px;
    }

    .eg-panel { display: none; }
    .eg-panel.active { display: block; }

    .eg-section {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 9px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--eg-accent);
      margin: 10px 0 6px;
      padding-bottom: 3px;
      border-bottom: 1px solid var(--eg-border);
    }
    .eg-section:first-child { margin-top: 2px; }

    .eg-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 0;
    }

    .eg-label {
      font-size: 12px;
      color: #d8caff;
      font-weight: 400;
    }

    .eg-toggle-wrap {
      position: relative;
      width: 32px;
      height: 17px;
      flex-shrink: 0;
    }
    .eg-toggle-wrap input {
      opacity: 0;
      width: 0; height: 0;
      position: absolute;
    }
    .eg-toggle-track {
      position: absolute;
      inset: 0;
      background: var(--eg-toggle-off);
      border-radius: 17px;
      cursor: pointer;
      transition: background .2s;
      border: 1px solid #3d2d5e;
    }
    .eg-toggle-track::after {
      content: '';
      position: absolute;
      width: 11px;
      height: 11px;
      top: 2px;
      left: 2px;
      background: var(--eg-muted);
      border-radius: 50%;
      transition: transform .2s, background .2s;
    }
    .eg-toggle-wrap input:checked + .eg-toggle-track {
      background: var(--eg-accent);
      border-color: var(--eg-accent);
    }
    .eg-toggle-wrap input:checked + .eg-toggle-track::after {
      transform: translateX(15px);
      background: #fff;
    }

    /* ── slider ── */
    .eg-slider-wrap {
      display: flex;
      flex-direction: column;
      padding: 4px 0 6px;
      gap: 4px;
    }
    .eg-slider-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .eg-slider-val {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 11px;
      color: var(--eg-accent2);
    }
    .eg-slider {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 3px;
      border-radius: 3px;
      background: var(--eg-border);
      outline: none;
      cursor: pointer;
    }
    .eg-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--eg-accent2);
      cursor: pointer;
      box-shadow: 0 0 6px #a855f766;
    }
    .eg-slider:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .eg-slider:disabled::-webkit-slider-thumb { cursor: not-allowed; }

    /* ── micro buttons ── */
    .eg-btn-row {
      display: flex;
      gap: 6px;
      padding: 6px 0 2px;
      margin-top: 10px;
    }
    .eg-btn {
      flex: 1;
      padding: 5px 0;
      border: 1px solid var(--eg-border);
      border-radius: 4px;
      background: var(--eg-surface);
      color: var(--eg-text);
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 11px;
      letter-spacing: 1px;
      text-transform: uppercase;
      cursor: pointer;
      transition: background .15s, border-color .15s, color .15s;
    }
    .eg-btn:hover { background: var(--eg-border); }
    .eg-btn.active {
      background: var(--eg-accent);
      border-color: var(--eg-accent);
      color: #fff;
    }

    /* ── micro status ── */
    .eg-status {
      font-family: 'Rajdhani', sans-serif;
      font-size: 10px;
      letter-spacing: 1px;
      text-align: center;
      padding: 3px 0 0;
      color: var(--eg-muted);
    }
    .eg-status.on  { color: #4CAF50; }
    .eg-status.off { color: #f44336; }
  `;
  if (!document.getElementById('echo-gui-style')) {
    document.head.appendChild(style);
  }

  const toggle = (label, id) => `
    <div class="eg-row">
      <span class="eg-label">${label}</span>
      <label class="eg-toggle-wrap">
        <input type="checkbox" id="${id}">
        <span class="eg-toggle-track"></span>
      </label>
    </div>`;

  const slider = (label, id, min, max, val, unit) => `
    <div class="eg-slider-wrap">
      <div class="eg-slider-header">
        <span class="eg-label">${label}</span>
        <span class="eg-slider-val" id="${id}-val">${val}${unit}</span>
      </div>
      <input class="eg-slider" type="range" id="${id}" min="${min}" max="${max}" value="${val}">
    </div>`;

  this.gui = document.createElement('div');
  this.gui.id = 'echo-gui';
  this.gui.innerHTML = `
    <div id="eg-titlebar">
      <span id="eg-logo">ECHO</span>
      <button id="eg-close">✕</button>
    </div>

    <div id="eg-tabs">
      <div class="eg-tab active" data-tab="opening">Opening</div>
      <div class="eg-tab"        data-tab="visuals">Visuals</div>
      <div class="eg-tab"        data-tab="micro">Micro</div>
    </div>

    <div id="eg-content">

      <!-- Opening -->
      <div class="eg-panel active" id="panel-opening">
        <div class="eg-section">Opening</div>
        ${toggle('Auto Opening', 'opt-opening-open')}
      </div>

      <!-- Visuals -->
      <div class="eg-panel" id="panel-visuals">
        <div class="eg-section">Players</div>
        ${toggle('ESP', 'opt-esp')}
        <div class="eg-section">World</div>
        ${toggle('Fullbright', 'opt-fullbright')}
      </div>

      <!-- Micro -->
      <div class="eg-panel" id="panel-micro">
        <div class="eg-section">Auto Attack</div>
        ${toggle('Attack Formula', 'opt-attack-formula')}
        ${slider('Attack Percent', 'opt-attack-percent', 1, 30, 12, '%')}
        ${slider('Interval', 'opt-attack-interval', 1, 667, 400, 'ms')}
        <div class="eg-btn-row" style="margin-top: 14px;">
          <button class="eg-btn" id="micro-start-btn">Start (Q)</button>
          <button class="eg-btn" id="micro-stop-btn">Stop (E)</button>
        </div>
        <div class="eg-status off" id="micro-status">INACTIVE</div>

        <div class="eg-section">Legit Attack</div>
        ${toggle('Legit Mode', 'opt-legitmode')}
      </div>

    </div>
  `;

  const bindToggle = (id, fn) => {
    const el = this.gui.querySelector(`#${id}`);
    if (el) el.addEventListener('change', () => fn(el.checked));
  };

  const wireToggles = () => {
    bindToggle('opt-opening-open', onAutoOpenToggle);
    bindToggle('opt-esp', onESPToggle);
    bindToggle('opt-fullbright', onFullbrightToggle);
    bindToggle('opt-legitmode', onLegitModeToggle);

    bindToggle('opt-attack-formula', (enabled) => {
      microState.useFormula = enabled;
      const ps = this.gui.querySelector('#opt-attack-percent');
      if (ps) ps.disabled = enabled;
    });

    const pSlider = this.gui.querySelector('#opt-attack-percent');
    const pVal = this.gui.querySelector('#opt-attack-percent-val');
    if (pSlider)
      pSlider.addEventListener('input', () => {
        microState.attackPercent = parseInt(pSlider.value);
        if (pVal) pVal.textContent = microState.attackPercent + '%';
      });

    const iSlider = this.gui.querySelector('#opt-attack-interval');
    const iVal = this.gui.querySelector('#opt-attack-interval-val');
    if (iSlider)
      iSlider.addEventListener('input', () => {
        microState.intervalMs = parseInt(iSlider.value);
        if (iVal) iVal.textContent = microState.intervalMs + 'ms';
        if (microState.attackInterval !== null) {
          clearInterval(microState.attackInterval);
          microState.attackInterval = setInterval(
            startMicro,
            microState.intervalMs
          );
        }
      });

    const startBtn = this.gui.querySelector('#micro-start-btn');
    const stopBtn = this.gui.querySelector('#micro-stop-btn');
    if (startBtn) startBtn.addEventListener('click', startAutoAttack);
    if (stopBtn) stopBtn.addEventListener('click', stopAutoAttack);
  };

  const bindTabs = () => {
    this.gui.querySelectorAll('.eg-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        this.gui
          .querySelectorAll('.eg-tab')
          .forEach((t) => t.classList.remove('active'));
        this.gui
          .querySelectorAll('.eg-panel')
          .forEach((p) => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = this.gui.querySelector(`#panel-${tab.dataset.tab}`);
        if (panel) panel.classList.add('active');
      });
    });
  };

  const bindClose = () => {
    const btn = this.gui.querySelector('#eg-close');
    if (btn) btn.addEventListener('click', () => this.hide());
  };

  const bindDrag = () => {
    const bar = this.gui.querySelector('#eg-titlebar');
    let ox = 0,
      oy = 0,
      dragging = false;

    bar.addEventListener('mousedown', (e) => {
      if (e.target.id === 'eg-close') return;
      dragging = true;
      const r = this.gui.getBoundingClientRect();
      ox = e.clientX - r.left;
      oy = e.clientY - r.top;
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      this.gui.style.left = e.clientX - ox + 'px';
      this.gui.style.top = e.clientY - oy + 'px';
      this.gui.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
      dragging = false;
    });
  };

  this.ensureMounted = () => {
    if (!document.body.contains(this.gui)) {
      document.body.appendChild(this.gui);
      wireToggles();
      bindTabs();
      bindClose();
      bindDrag();
    }
  };

  this.show = () => {
    this.ensureMounted();
    this.gui.style.display = 'block';
  };
  this.hide = () => {
    this.gui.style.display = 'none';
  };
  this.toggle = () => {
    this.gui.style.display === 'block' ? this.hide() : this.show();
  };

  this.setMicroStatus = (active) => {
    const el = this.gui.querySelector('#micro-status');
    const sb = this.gui.querySelector('#micro-start-btn');
    if (!el) return;
    el.textContent = active ? 'ACTIVE' : 'INACTIVE';
    el.className = 'eg-status ' + (active ? 'on' : 'off');
    if (sb) sb.classList.toggle('active', active);
  };
}

var echoSettings = new EchoSettings();
echoSettings.show();

document.addEventListener('keydown', function (e) {
  if (
    e.target.tagName === 'TEXTAREA' ||
    (e.target.tagName === 'INPUT' && e.target.type === 'text')
  )
    return;

  const key = e.key;
  if (key === 'o' || key === 'O') echoSettings.toggle();
  if (key === 'q' || key === 'Q') {
    e.preventDefault();
    startAutoAttack();
  }
  if (key === 'e' || key === 'E') {
    e.preventDefault();
    stopAutoAttack();
  }
});

const microState = {
  attackPercent: 12,
  intervalMs: 400,
  useFormula: false,
  attackInterval: null,
  isAttacking: false,
  attackQueue: [],
  lastAttack: new Map(),
  activeTargets: new Set(),
};

const MICRO_MAX_DENSITY = 0.5;
const MICRO_MAX_ATTACKS_PER_CYCLE = 1;
const MICRO_DELAY_BETWEEN_ATTACKS_MS = 1;
const MICRO_MIN_ATTACK_INTERVAL_TARGET = 5000;

const percentToValue = (p) =>
  Math.max(0, Math.min(1023, Math.floor(1024 * (p / 100) + 0.5) - 1));

function getMyPlayerId() {
  try {
    const id = window?.gameManager?.OwnPlayerId;
    return id != null && id !== -1 ? id : null;
  } catch {
    return null;
  }
}

function findBorderingIds(myCells, allBorders, offsets, totalPlayers, myId) {
  const cellSet = new Set(myCells);
  const neighbors = new Map();
  for (let i = 0; i < totalPlayers; i++) {
    if (i === myId || !allBorders[i]) continue;
    let shared = 0;
    for (const c of allBorders[i]) {
      for (const o of offsets) {
        if (cellSet.has(c - o)) {
          shared++;
          break;
        }
      }
    }
    if (shared > 0) neighbors.set(i, shared);
  }
  return neighbors;
}

async function processMicroQueue(myTroops, troopData, landData) {
  if (microState.isAttacking || !microState.attackQueue.length) return;
  microState.isAttacking = true;
  let sent = 0;

  while (
    microState.attackQueue.length > 0 &&
    sent < MICRO_MAX_ATTACKS_PER_CYCLE
  ) {
    const enemy = microState.attackQueue.shift();
    if (!enemy) continue;

    const now = Date.now();
    const last = microState.lastAttack.get(enemy.id) || 0;
    if (now - last < MICRO_MIN_ATTACK_INTERVAL_TARGET) continue;

    let percent;
    if (microState.useFormula) {
      const needed = (enemy.troops + enemy.land) * 2.35;
      percent = Math.max(
        1,
        Math.min(100, Math.round((needed / Math.max(1, myTroops)) * 100))
      );
    } else {
      percent = microState.attackPercent;
    }

    attackTarget(percentToValue(percent), enemy.id);
    microState.lastAttack.set(enemy.id, now);
    microState.activeTargets.add(enemy.id);
    sent++;

    if (microState.attackQueue.length && sent < MICRO_MAX_ATTACKS_PER_CYCLE)
      await new Promise((r) => setTimeout(r, MICRO_DELAY_BETWEEN_ATTACKS_MS));
  }

  microState.isAttacking = false;
}

function startMicro() {
  const playerData = window.playerData;
  const mapData = window.mapData;
  if (!playerData || !mapData) return;

  const troopData = playerData.playerTroops;
  const landData = playerData.landOwned;
  const borders = playerData.playerTiles;
  const offsets = mapData.neighborOffsets;
  if (!troopData || !landData || !borders || !offsets) return;

  const myId = getMyPlayerId();
  if (myId == null || !borders[myId]) return;

  const myTroops = troopData[myId] || 1;

  for (const id of [...microState.activeTargets]) {
    if (!landData[id]) {
      microState.activeTargets.delete(id);
      microState.lastAttack.delete(id);
    }
  }

  const borderNeighbors = findBorderingIds(
    borders[myId],
    borders,
    offsets,
    borders.length,
    myId
  );

  const candidates = [];
  for (const [enemyId, shared] of borderNeighbors) {
    const troops = troopData[enemyId];
    const land = landData[enemyId];
    if (troops == null) continue;
    if (troops / land > MICRO_MAX_DENSITY) continue;
    candidates.push({ id: enemyId, troops, land, sharedBorderCount: shared });
  }

  candidates.sort((a, b) => b.sharedBorderCount - a.sharedBorderCount);
  microState.attackQueue = candidates.slice();

  if (microState.attackQueue.length && !microState.isAttacking)
    void processMicroQueue(myTroops, troopData, landData);
}

function startAutoAttack() {
  if (microState.attackInterval) return;
  startMicro();
  microState.attackInterval = setInterval(startMicro, microState.intervalMs);
  echoSettings.setMicroStatus(true);
}

function stopAutoAttack() {
  clearInterval(microState.attackInterval);
  microState.attackInterval = null;
  microState.attackQueue = [];
  microState.isAttacking = false;
  echoSettings.setMicroStatus(false);
}

const features = { autoOpen: false };

function getTicks() {
  return window.gameLoop?.getTick();
}
function getGameStarted() {
  return window.gameManager?.isGameStarted();
}
function attackTarget(unitRatio, targetPlayerId) {
  return window.protocolHandler?.gameCommandSender.attackTargetHandler(
    unitRatio,
    targetPlayerId
  );
}

function attackTargetSP(ownPlayerId, unitRatio, targetPlayer) {
  return window.protocolHandler?.localCommandProcessor.attackTargetHandler(ownPlayerId, unitRatio, targetPlayer)
}

function onAutoOpenToggle(enabled) {
  features.autoOpen = enabled;
}
function onESPToggle(enabled) { }
function onFullbrightToggle(enabled) { }
function onLegitModeToggle(enabled) { }

function startAutoOpen(ticks) {
  switch (ticks) {
    // Cycle 1: 144L, 799T
    case 60: attackTarget(percentToValue(20.800), 512); break;
    case 81: attackTarget(percentToValue(17.871), 512); break;

    // Cycle 2: 
    case 165: attackTarget(percentToValue(0.01), 512); break;
    case 172: attackTarget(percentToValue(37.597), 512); break;
   
    // Cycle 3: 
    case 249: attackTarget(percentToValue(16.40625), 512); break;
    case 263: attackTarget(percentToValue(16.69859), 512); break;
    case 270: attackTarget(percentToValue(32.42850), 512); break;
    case 284: attackTarget(percentToValue(33.6914), 512); break;

    // Cycle 4:
    case 354: attackTarget(percentToValue(0.0976), 512); break;
    case 361: attackTarget(percentToValue(41.503906), 512); break;
    case 375: attackTarget(percentToValue(29.19921), 512); break;
    case 382: attackTarget(percentToValue(62.6950), 512); break;

    // Cycle 5:
    case 452: attackTarget(percentToValue(41.606), 512); break;
    case 473: attackTarget(percentToValue(25.7821), 512); break;
    case 480: attackTarget(percentToValue(54.19921), 512); break;
  }
}

let lastTick = -1;

function clientLoop() {
  const ticks = getTicks();
  const gameStarted = getGameStarted();

  if (!gameStarted) {
    lastTick = -1;
    requestAnimationFrame(clientLoop);
    return;
  }

  if (features.autoOpen && ticks !== lastTick) {
    lastTick = ticks;
    startAutoOpen(ticks);
  }

  requestAnimationFrame(clientLoop);
}

requestAnimationFrame(clientLoop);