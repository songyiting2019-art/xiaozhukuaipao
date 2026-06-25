const editorState = {
  dirs: null,
  board: null,
  flowRules: null,
  levels: [],
  levelIndex: 0,
  animals: [],
  dir: "up",
  erase: false,
};

const boardEl = document.querySelector("#editorBoard");
const levelSelect = document.querySelector("#editorLevelSelect");
const dirRow = document.querySelector("#editorDirRow");
const eraseBtn = document.querySelector("#editorErase");
const generateBtn = document.querySelector("#editorGenerate");
const clearBtn = document.querySelector("#editorClear");
const copyBtn = document.querySelector("#editorCopy");
const statusEl = document.querySelector("#editorStatus");
const outputEl = document.querySelector("#editorOutput");

bootEditor();

async function bootEditor() {
  try {
    Object.assign(editorState, await loadGameData());
    boardEl.style.setProperty("--board-cols", editorState.board.cols);
    boardEl.style.setProperty("--board-rows", editorState.board.rows);
    renderLevelOptions();
    loadLevel(0);
    bindEditorEvents();
  } catch (error) {
    statusEl.textContent = `加载失败：${error.message}`;
  }
}

async function loadGameData() {
  const source = await readTextFile("./game.js");
  const constantsSource = source.slice(0, source.indexOf("const state ="));
  return Function(`${constantsSource}\nreturn { dirs: DIRS, board: BOARD, flowRules: FLOW_RULES, levels: LEVELS };`)();
}

async function readTextFile(path) {
  try {
    const response = await fetch(path);
    if (response.ok) return response.text();
  } catch (error) {
    // File URLs can reject fetch; XMLHttpRequest still works in some local setups.
  }

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("GET", path, true);
    request.onload = () => resolve(request.responseText);
    request.onerror = () => reject(new Error("无法读取 game.js"));
    request.send();
  });
}

function bindEditorEvents() {
  levelSelect.addEventListener("change", () => loadLevel(Number(levelSelect.value)));

  dirRow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-dir]");
    if (!button) return;
    editorState.dir = button.dataset.dir;
    editorState.erase = false;
    updateControls();
  });

  eraseBtn.addEventListener("click", () => {
    editorState.erase = !editorState.erase;
    updateControls();
  });

  generateBtn.addEventListener("click", generateLevel);
  clearBtn.addEventListener("click", () => {
    editorState.animals = [];
    renderEditor();
  });
  copyBtn.addEventListener("click", async () => {
    outputEl.select();
    await navigator.clipboard?.writeText(outputEl.value).catch(() => {});
  });
}

function renderLevelOptions() {
  levelSelect.innerHTML = editorState.levels
    .map((level, index) => `<option value="${index}">${level.name}</option>`)
    .join("");
}

function loadLevel(index) {
  editorState.levelIndex = Math.max(0, Math.min(index, editorState.levels.length - 1));
  levelSelect.value = String(editorState.levelIndex);
  const level = editorState.levels[editorState.levelIndex];
  editorState.animals = level.animals.map((animal, animalIndex) => ({
    ...animal,
    id: `edit-${animalIndex}`,
    active: true,
  }));
  renderEditor();
}

function renderEditor() {
  boardEl.innerHTML = "";
  renderEditorPlayArea();
  renderEditorCells();
  renderEditorAnimals();
  updateStatus();
}

function renderEditorPlayArea() {
  const area = getCurrentPlayArea();
  const playArea = document.createElement("span");
  playArea.className = "play-area";
  playArea.style.setProperty("--area-x", area.x);
  playArea.style.setProperty("--area-y", area.y);
  playArea.style.setProperty("--area-cols", area.cols);
  playArea.style.setProperty("--area-rows", area.rows);
  boardEl.appendChild(playArea);
}

function renderEditorCells() {
  const area = getCurrentPlayArea();
  for (let y = 0; y < editorState.board.rows; y += 1) {
    for (let x = 0; x < editorState.board.cols; x += 1) {
      const cell = document.createElement("button");
      cell.className = "editor-grid-cell";
      if (!isCellInsideArea(x, y, area)) cell.classList.add("is-outside");
      cell.type = "button";
      cell.style.setProperty("--x", x);
      cell.style.setProperty("--y", y);
      cell.addEventListener("click", () => handleCellClick(x, y));
      boardEl.appendChild(cell);
    }
  }
}

function renderEditorAnimals() {
  editorState.animals.forEach((animal) => {
    const pig = document.createElement("button");
    const center = getAnimalCenter(animal);
    pig.className = "pig animal-pig";
    pig.type = "button";
    pig.style.setProperty("--x", center.x);
    pig.style.setProperty("--y", center.y);
    pig.style.setProperty("--z", Math.round(center.y * 2 + 10));
    pig.style.setProperty("--rot", editorState.dirs[animal.dir].rot);
    pig.setAttribute("aria-label", `小猪朝${editorState.dirs[animal.dir].label}`);
    pig.innerHTML = `
      <span class="pig-shape">
        <span class="pig-body"></span>
        <span class="pig-head"></span>
        <span class="pig-ear left"></span>
        <span class="pig-ear right"></span>
        <span class="pig-eye left"></span>
        <span class="pig-eye right"></span>
        <span class="pig-snout"></span>
        <span class="pig-leg front-left"></span>
        <span class="pig-leg front-right"></span>
        <span class="pig-leg back-left"></span>
        <span class="pig-leg back-right"></span>
        <span class="pig-tail"></span>
      </span>
    `;
    boardEl.appendChild(pig);
  });
}

function handleCellClick(x, y) {
  const hit = findAnimalAtCell(x, y);
  if (editorState.erase) {
    if (hit) editorState.animals = editorState.animals.filter((animal) => animal.id !== hit.id);
    renderEditor();
    return;
  }

  if (hit) {
    const changed = { ...hit, dir: editorState.dir };
    if (!canPlace(changed, hit.id)) return;
    Object.assign(hit, { dir: editorState.dir });
    renderEditor();
    return;
  }

  const animal = {
    x,
    y,
    dir: editorState.dir,
    id: `edit-${Date.now()}-${editorState.animals.length}`,
    active: true,
  };
  if (!canPlace(animal)) return;
  editorState.animals.push(animal);
  renderEditor();
}

function updateControls() {
  dirRow.querySelectorAll("[data-dir]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.dir === editorState.dir);
  });
  eraseBtn.classList.toggle("is-selected", editorState.erase);
}

function updateStatus() {
  const level = getEditorLevel();
  const analysis = getLevelFlowAnalysis(level);
  const rules = getEditorFlowRules(level);
  const opposingPairs = findOpposingLanePairs(level.animals);
  const longestChain = analysis.exitLaneChains[0]?.count ?? 0;
  const crowdedDirections = analysis.openByDirection.filter(
    (group) => group.count > rules.maxOpenPerDirection,
  );
  const longChains = analysis.exitLaneChains.filter(
    (chain) => chain.count > rules.maxExitChain,
  );
  const risks = [];

  if (opposingPairs.length > 0) {
    risks.push({ level: "danger", text: `死锁风险：${opposingPairs.length} 组同线对向小猪` });
  }
  if (
    analysis.initialOpenCount > rules.maxInitialOpen ||
    analysis.initialOpenRatio > rules.maxInitialOpenRatio
  ) {
    risks.push({
      level: "warning",
      text: `初始流量偏高：${analysis.initialOpenCount} 只可直接出场`,
    });
  }
  crowdedDirections.forEach((group) => {
    risks.push({
      level: "warning",
      text: `${editorState.dirs[group.dir].label}向出口偏挤：${group.count} 只可直接出场`,
    });
  });
  if (longChains.length > 0) {
    risks.push({
      level: "warning",
      text: `出口长链偏高：最长连续 ${longestChain} 只`,
    });
  }
  if (analysis.worstRemoval && isRemovalTooOpening(analysis.worstRemoval, rules)) {
    risks.push({
      level: "warning",
      text: `移除后流量偏高：最多打开 ${analysis.worstRemoval.openAfterCount} 只`,
    });
  }

  const riskItems =
    risks.length > 0
      ? risks
          .map((risk) => `<li class="is-${risk.level}">${risk.text}</li>`)
          .join("")
      : `<li class="is-ok">结构正常：当前没有明显流量或死锁风险</li>`;

  statusEl.innerHTML = `
    <div class="editor-status-summary">
      <div class="editor-stat"><span>小猪</span><strong>${level.animals.length}</strong></div>
      <div class="editor-stat"><span>初始可出</span><strong>${analysis.initialOpenCount}</strong></div>
      <div class="editor-stat"><span>最长链</span><strong>${longestChain}</strong></div>
    </div>
    <ul class="editor-risk-list">${riskItems}</ul>
  `;
  outputEl.value = formatLevel(level);
}

function getEditorLevel() {
  const source = editorState.levels[editorState.levelIndex];
  return {
    id: source.id,
    name: `${source.name}编辑稿`,
    animalType: source.animalType ?? "pig",
    playArea: getCurrentPlayArea(),
    flowRules: source.flowRules,
    animals: editorState.animals.map((animal) => ({
      x: animal.x,
      y: animal.y,
      dir: animal.dir,
    })),
  };
}

function formatLevel(level) {
  const animals = level.animals
    .map((animal) => `      { x: ${animal.x}, y: ${animal.y}, dir: "${animal.dir}" },`)
    .join("\n");
  const flowRules = formatFlowRules(level.flowRules);
  const flowRulesBlock = flowRules ? `${flowRules}\n` : "";
  return `{
    id: ${level.id},
    name: "${level.name}",
    animalType: "${level.animalType}",
    playArea: { x: ${level.playArea.x}, y: ${level.playArea.y}, cols: ${level.playArea.cols}, rows: ${level.playArea.rows} },
${flowRulesBlock}    animals: [
${animals}
    ],
  },`;
}

function formatFlowRules(flowRules) {
  if (!flowRules) return "";
  const entries = Object.entries(flowRules)
    .map(([key, value]) => `      ${key}: ${value},`)
    .join("\n");
  return `    flowRules: {\n${entries}\n    },`;
}

function generateLevel() {
  const source = editorState.levels[editorState.levelIndex];
  const targetCount = source.animals.length;
  const area = getCurrentPlayArea();
  let best = [];
  let bestScore = Infinity;

  for (let attempt = 0; attempt < 120; attempt += 1) {
    const animals = [];
    let misses = 0;
    while (animals.length < targetCount && misses < 4000) {
      const animal = {
        x: randomInt(area.x, area.x + area.cols - 1),
        y: randomInt(area.y, area.y + area.rows - 1),
        dir: randomItem(Object.keys(editorState.dirs)),
        id: `gen-${attempt}-${animals.length}`,
        active: true,
      };
      if (canPlaceInList(animal, animals, area)) {
        animals.push(animal);
        misses = 0;
      } else {
        misses += 1;
      }
    }
    const score = scoreAnimals(animals, source);
    if (score < bestScore) {
      bestScore = score;
      best = animals;
    }
  }

  editorState.animals = best.map((animal, index) => ({ ...animal, id: `edit-${index}` }));
  renderEditor();
}

function scoreAnimals(animals, source) {
  const level = {
    ...source,
    animals: animals.map((animal) => ({ x: animal.x, y: animal.y, dir: animal.dir })),
  };
  const rules = getEditorFlowRules(level);
  const analysis = getLevelFlowAnalysis(level);
  const opposingCount = findOpposingLanePairs(level.animals).length;
  const longestChain = analysis.exitLaneChains[0]?.count ?? 0;
  const crowdedDirectionCount = analysis.openByDirection.filter(
    (group) => group.count > rules.maxOpenPerDirection,
  ).length;
  const removalRisk =
    analysis.worstRemoval && isRemovalTooOpening(analysis.worstRemoval, rules) ? 1 : 0;
  return (
    Math.abs(source.animals.length - animals.length) * 5000 +
    opposingCount * 1400 +
    Math.max(0, analysis.initialOpenCount - rules.maxInitialOpen) * 260 +
    Math.max(0, longestChain - rules.maxExitChain) * 520 +
    crowdedDirectionCount * 180 +
    removalRisk * 320 +
    analysis.initialOpenCount
  );
}

function canPlace(animal, ignoreId = null) {
  return canPlaceInList(
    animal,
    editorState.animals.filter((item) => item.id !== ignoreId),
    getCurrentPlayArea(),
  );
}

function canPlaceInList(animal, animals, area) {
  const footprint = getFootprint(animal);
  const inside = footprint.every(
    (cell) =>
      cell.x >= area.x &&
      cell.x < area.x + area.cols &&
      cell.y >= area.y &&
      cell.y < area.y + area.rows,
  );
  if (!inside) return false;
  return animals.every((item) => {
    const occupied = getFootprint(item);
    return !footprint.some((cell) =>
      occupied.some((other) => other.x === cell.x && other.y === cell.y),
    );
  });
}

function isCellInsideArea(x, y, area) {
  return (
    x >= area.x &&
    x < area.x + area.cols &&
    y >= area.y &&
    y < area.y + area.rows
  );
}

function getCurrentPlayArea() {
  return (
    editorState.levels[editorState.levelIndex].playArea ?? {
      x: 0,
      y: 0,
      cols: editorState.board.cols,
      rows: editorState.board.rows,
    }
  );
}

function findAnimalAtCell(x, y) {
  return editorState.animals.find((animal) =>
    getFootprint(animal).some((cell) => cell.x === x && cell.y === y),
  );
}

function getFootprint(animal) {
  const dir = editorState.dirs[animal.dir];
  return [
    { x: animal.x, y: animal.y },
    { x: animal.x - dir.dx, y: animal.y - dir.dy },
  ];
}

function getAnimalCenter(animal) {
  const cells = getFootprint(animal);
  return {
    x: cells.reduce((sum, cell) => sum + cell.x + 0.5, 0) / cells.length,
    y: cells.reduce((sum, cell) => sum + cell.y + 0.5, 0) / cells.length,
  };
}

function findBlockerInAnimals(animals, animal) {
  const dir = editorState.dirs[animal.dir];
  let x = animal.x + dir.dx;
  let y = animal.y + dir.dy;
  let openCells = 0;
  while (x >= 0 && x < editorState.board.cols && y >= 0 && y < editorState.board.rows) {
    const occupied = animals.some((item) => {
      if (!item.active || item.id === animal.id) return false;
      return getFootprint(item).some((cell) => cell.x === x && cell.y === y);
    });
    if (occupied) return { x, y, openCells };
    openCells += 1;
    x += dir.dx;
    y += dir.dy;
  }
  return null;
}

function getOpenAnimals(animals) {
  return animals.filter(
    (animal) => animal.active && !findBlockerInAnimals(animals, animal),
  );
}

function getLevelFlowAnalysis(level) {
  const animals = level.animals.map((animal, index) => ({
    ...animal,
    id: `level-${level.id}-${index}`,
    active: true,
  }));
  const initialOpen = getOpenAnimals(animals);
  const openByDirection = groupOpenAnimalsByDirection(initialOpen);
  const exitLaneChains = getExitLaneChains(animals);
  const removalImpacts = animals.map((animal) => getRemovalImpact(animals, animal));
  const worstRemoval = removalImpacts.reduce((worst, impact) => {
    if (!worst) return impact;
    return getRemovalImpactScore(impact) > getRemovalImpactScore(worst) ? impact : worst;
  }, null);
  return {
    total: animals.length,
    initialOpenCount: initialOpen.length,
    initialOpenRatio: animals.length > 0 ? initialOpen.length / animals.length : 0,
    initialOpenIds: initialOpen.map((animal) => animal.id),
    openByDirection,
    exitLaneChains,
    worstRemoval,
  };
}

function getEditorFlowRules(level) {
  return {
    ...editorState.flowRules,
    ...(level.flowRules ?? {}),
  };
}

function groupOpenAnimalsByDirection(animals) {
  const groups = new Map();
  animals.forEach((animal) => {
    if (!groups.has(animal.dir)) groups.set(animal.dir, []);
    groups.get(animal.dir).push(animal.id);
  });
  return Array.from(groups, ([dir, ids]) => ({ dir, count: ids.length, ids }));
}

function getRemovalImpact(animals, removedAnimal) {
  const activeAnimals = animals.filter((animal) => animal.active);
  const openBefore = getOpenAnimals(activeAnimals);
  const openBeforeIds = new Set(openBefore.map((animal) => animal.id));
  const afterRemoval = activeAnimals
    .filter((animal) => animal.id !== removedAnimal.id)
    .map((animal) => ({ ...animal }));
  const openAfter = getOpenAnimals(afterRemoval);
  const exitLaneChainsAfterRemoval = getExitLaneChains(afterRemoval);
  const maxExitChainAfterRemoval = exitLaneChainsAfterRemoval.reduce(
    (max, chain) => Math.max(max, chain.count),
    0,
  );

  return {
    removedId: removedAnimal.id,
    remainingAfter: afterRemoval.length,
    openAfterCount: openAfter.length,
    openAfterIds: openAfter.map((animal) => animal.id),
    newOpenCount: openAfter.filter((animal) => !openBeforeIds.has(animal.id)).length,
    newOpenIds: openAfter
      .filter((animal) => !openBeforeIds.has(animal.id))
      .map((animal) => animal.id),
    maxExitChainAfterRemoval,
    exitLaneChainsAfterRemoval,
  };
}

function getRemovalImpactScore(impact) {
  return (
    impact.openAfterCount * 10 +
    impact.newOpenCount * 7 +
    impact.maxExitChainAfterRemoval * 5
  );
}

function isRemovalTooOpening(impact, rules) {
  if (impact.remainingAfter <= rules.maxOpenAfterRemoval) return false;
  return (
    impact.openAfterCount > rules.maxOpenAfterRemoval ||
    impact.newOpenCount > rules.maxNewOpenAfterRemoval ||
    impact.maxExitChainAfterRemoval > rules.maxExitChainAfterRemoval
  );
}

function getExitLaneChains(animals) {
  const lanes = Array.from(new Set(animals.map(getExitLaneKey)));
  return lanes
    .map((laneKey) => getExitLaneChain(animals, laneKey))
    .filter((chain) => chain.count > 0)
    .sort((first, second) => second.count - first.count);
}

function getExitLaneChain(animals, laneKey) {
  const simulated = animals.map((animal) => ({ ...animal }));
  const ids = [];
  while (true) {
    const openAnimal = getOpenAnimals(simulated)
      .filter((animal) => getExitLaneKey(animal) === laneKey)
      .sort((first, second) => getExitDistance(first) - getExitDistance(second))[0];
    if (!openAnimal) break;
    ids.push(openAnimal.id);
    openAnimal.active = false;
  }
  return { laneKey, count: ids.length, ids };
}

function getExitLaneKey(animal) {
  const lane = animal.dir === "left" || animal.dir === "right" ? animal.y : animal.x;
  return `${animal.dir}:${lane}`;
}

function getExitDistance(animal) {
  if (animal.dir === "left") return animal.x;
  if (animal.dir === "right") return editorState.board.cols - animal.x - 1;
  if (animal.dir === "up") return animal.y;
  return editorState.board.rows - animal.y - 1;
}

function findOpposingLanePairs(animals) {
  const pairs = [];
  for (let first = 0; first < animals.length; first += 1) {
    for (let second = first + 1; second < animals.length; second += 1) {
      if (isOpposingLanePair(animals[first], animals[second])) {
        pairs.push({ first, second });
      }
    }
  }
  return pairs;
}

function isOpposingLanePair(first, second) {
  if (first.x === second.x) {
    return (
      (first.y < second.y && first.dir === "down" && second.dir === "up") ||
      (second.y < first.y && second.dir === "down" && first.dir === "up")
    );
  }
  if (first.y === second.y) {
    return (
      (first.x < second.x && first.dir === "right" && second.dir === "left") ||
      (second.x < first.x && second.dir === "right" && first.dir === "left")
    );
  }
  return false;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}
