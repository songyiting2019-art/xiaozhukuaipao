const editorState = {
  dirs: null,
  board: null,
  cornerCutout: null,
  flowRules: null,
  levels: [],
  levelIndex: 0,
  animals: [],
  dir: "up",
  selectedAnimalId: null,
  lastAdjustedAnimalId: null,
  activeInspection: null,
  drag: null,
  suppressClick: false,
};

const DEFAULT_FLOW_RULES = {
  maxInitialOpen: 6,
  maxInitialOpenRatio: 0.16,
  maxOpenPerDirection: 3,
  maxExitChain: 2,
  maxOpenAfterRemoval: 7,
  maxNewOpenAfterRemoval: 3,
  maxExitChainAfterRemoval: 3,
};

const DEPLOYED_LEVELS_STORAGE_KEY = "pigEscapeEditorDeployedLevelsV1";

const boardEl = document.querySelector("#editorBoard");
const levelSelect = document.querySelector("#editorLevelSelect");
const rotateBtn = document.querySelector("#editorRotate");
const eraseBtn = document.querySelector("#editorErase");
const generateBtn = document.querySelector("#editorGenerate");
const addLevelBtn = document.querySelector("#editorAddLevel");
const deployBtn = document.querySelector("#editorDeploy");
const statusEl = document.querySelector("#editorStatus");
const pigCountEl = document.querySelector("#editorPigCount");
const generateCountInput = document.querySelector("#editorGenerateCount");
const outputEl = document.querySelector("#editorOutput");

bootEditor();

async function bootEditor() {
  try {
    const data = await loadGameData();
    data.levels = readDeployedLevels(data.levels);
    Object.assign(editorState, data);
    boardEl.style.setProperty("--board-cols", editorState.board.cols);
    boardEl.style.setProperty("--board-rows", editorState.board.rows);
    renderLevelOptions();
    loadLevel(0);
    bindEditorEvents();
  } catch (error) {
    if (pigCountEl) pigCountEl.textContent = "加载失败";
    if (statusEl) statusEl.textContent = `加载失败：${error.message}`;
  }
}

async function loadGameData() {
  const source = await readTextFile("./game.js");
  const constantsSource = source.slice(0, source.indexOf("const state ="));
  return Function(
    `${constantsSource}\nreturn { dirs: DIRS, board: BOARD, cornerCutout: typeof CORNER_CUTOUT === "undefined" ? null : CORNER_CUTOUT, flowRules: typeof FLOW_RULES === "undefined" ? null : FLOW_RULES, levels: LEVELS };`,
  )();
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
  levelSelect.addEventListener("change", () => {
    saveCurrentLevelDraft();
    loadLevel(Number(levelSelect.value));
  });

  eraseBtn.addEventListener("click", deleteSelectedAnimal);
  rotateBtn.addEventListener("click", () => rotateSelectedAnimal(1));
  generateBtn.addEventListener("click", () => runGenerateTask(generateCurrentLevel, generateBtn));
  addLevelBtn.addEventListener("click", () => runGenerateTask(addGeneratedLevel, addLevelBtn));
  deployBtn.addEventListener("click", deployLevelsToGame);

  boardEl.addEventListener("pointerdown", handleBoardPointerDown);
  boardEl.addEventListener("pointermove", handleBoardPointerMove);
  boardEl.addEventListener("pointerup", handleBoardPointerUp);
  boardEl.addEventListener("pointercancel", cancelBoardDrag);
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
  editorState.selectedAnimalId = editorState.animals[0]?.id ?? null;
  editorState.lastAdjustedAnimalId = editorState.selectedAnimalId;
  if (editorState.selectedAnimalId) {
    editorState.dir = findAnimalById(editorState.selectedAnimalId).dir;
  }
  syncGenerateCount(getGenerateTargetCount());
  editorState.drag = null;
  clearActiveInspection();
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
      if (!isCellInsideArea(x, y, area) || !isPlayableCell(x, y)) {
        cell.classList.add("is-outside");
        cell.tabIndex = -1;
      }
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
    pig.className = `pig animal-pig${getPigInspectionClass(animal)}${animal.id === editorState.selectedAnimalId ? " is-selected" : ""}`;
    pig.type = "button";
    pig.dataset.id = animal.id;
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
  if (editorState.suppressClick) {
    editorState.suppressClick = false;
    return;
  }

  const hit = findAnimalAtCell(x, y);
  if (hit) {
    selectAnimal(hit.id);
    renderEditor();
    return;
  }

  createAnimalAt(x, y);
}

function createAnimalAt(x, y, dir = editorState.dir) {
  const animal = {
    x,
    y,
    dir,
    id: `edit-${Date.now()}-${editorState.animals.length}`,
    active: true,
  };
  if (!canPlace(animal)) return null;
  editorState.animals.push(animal);
  editorState.selectedAnimalId = animal.id;
  editorState.lastAdjustedAnimalId = animal.id;
  editorState.dir = animal.dir;
  setActiveInspection(animal);
  renderEditor();
  return animal;
}

function handleBoardPointerDown(event) {
  if (event.button !== 0 || event.isPrimary === false) return;
  const cell = getCellFromPointer(event);
  if (!cell) return;
  const hit = findAnimalAtCell(cell.x, cell.y);
  if (!hit) return;

  selectAnimal(hit.id);
  editorState.drag = {
    animalId: hit.id,
    pointerId: event.pointerId,
    from: { x: hit.x, y: hit.y },
    pending: { x: hit.x, y: hit.y },
    moved: false,
    valid: true,
  };
  boardEl.setPointerCapture?.(event.pointerId);
  updateRenderedSelection();
  updateStatus();
  event.preventDefault();
}

function handleBoardPointerMove(event) {
  const drag = editorState.drag;
  if (!drag || drag.pointerId !== event.pointerId) return;
  const animal = findAnimalById(drag.animalId);
  const cell = getCellFromPointer(event);
  if (!animal || !cell) return;

  drag.pending = cell;
  drag.moved = drag.moved || cell.x !== drag.from.x || cell.y !== drag.from.y;
  const movedAnimal = { ...animal, x: cell.x, y: cell.y };
  drag.valid = canPlace(movedAnimal, animal.id);
  previewDraggedAnimal(movedAnimal, drag.valid);
  event.preventDefault();
}

function handleBoardPointerUp(event) {
  const drag = editorState.drag;
  if (!drag || drag.pointerId !== event.pointerId) return;
  const animal = findAnimalById(drag.animalId);
  boardEl.releasePointerCapture?.(event.pointerId);

  if (animal && drag.moved) {
    if (drag.valid) {
      Object.assign(animal, drag.pending);
      editorState.lastAdjustedAnimalId = animal.id;
      setActiveInspection(animal);
    } else {
      editorState.lastAdjustedAnimalId = animal.id;
      setInvalidActionInspection(animal, "拖动后的位置不可用：越过编辑区域或与其他小猪重叠");
    }
  }

  editorState.suppressClick = drag.moved;
  editorState.drag = null;
  renderEditor();
  event.preventDefault();
}

function cancelBoardDrag(event) {
  if (!editorState.drag) return;
  if (event && editorState.drag.pointerId !== event.pointerId) return;
  editorState.drag = null;
  renderEditor();
}

function getCellFromPointer(event) {
  const rect = boardEl.getBoundingClientRect();
  const cellSize = rect.width / editorState.board.cols;
  const x = Math.floor((event.clientX - rect.left) / cellSize);
  const y = Math.floor((event.clientY - rect.top) / cellSize);
  if (x < 0 || x >= editorState.board.cols || y < 0 || y >= editorState.board.rows) {
    return null;
  }
  return { x, y };
}

function previewDraggedAnimal(animal, isValid) {
  const element = boardEl.querySelector(getAnimalSelector(animal.id));
  if (!element) return;
  const center = getAnimalCenter(animal);
  element.style.setProperty("--x", center.x);
  element.style.setProperty("--y", center.y);
  element.style.setProperty("--z", Math.round(center.y * 2 + 120));
  element.classList.toggle("is-invalid", !isValid);
}

function selectAnimal(id) {
  editorState.selectedAnimalId = id;
  editorState.lastAdjustedAnimalId = id;
  const animal = findAnimalById(id);
  if (animal) editorState.dir = animal.dir;
  if (animal) setActiveInspection(animal);
}

function updateRenderedSelection() {
  boardEl.querySelectorAll(".pig").forEach((pig) => {
    pig.classList.toggle("is-selected", pig.dataset.id === editorState.selectedAnimalId);
  });
}

function rotateSelectedAnimal(step) {
  const animal = getSelectedAnimal();
  if (!animal) return;
  const rotated = getRotatedAnimal(animal, step);
  Object.assign(animal, rotated);
  editorState.dir = animal.dir;
  editorState.lastAdjustedAnimalId = animal.id;
  clearActiveInspection();
  renderEditor();
}

function getRotatedAnimal(animal, step) {
  const order = ["up", "right", "down", "left"];
  const index = order.indexOf(animal.dir);
  const nextIndex = (index + step + order.length) % order.length;
  return { ...animal, dir: order[nextIndex] };
}

function deleteSelectedAnimal() {
  const animal = getSelectedAnimal();
  if (!animal) return false;
  editorState.animals = editorState.animals.filter((item) => item.id !== animal.id);
  editorState.selectedAnimalId = editorState.animals[0]?.id ?? null;
  editorState.lastAdjustedAnimalId = editorState.selectedAnimalId;
  if (editorState.selectedAnimalId) {
    editorState.dir = findAnimalById(editorState.selectedAnimalId).dir;
  }
  if (editorState.selectedAnimalId) {
    setActiveInspection(findAnimalById(editorState.selectedAnimalId));
  } else {
    clearActiveInspection();
  }
  renderEditor();
  return true;
}

function updateControls() {
  const hasSelection = Boolean(getSelectedAnimal());
  eraseBtn.disabled = !hasSelection;
  rotateBtn.disabled = !hasSelection;
}

function updateStatus() {
  const level = getEditorLevel();
  if (pigCountEl) pigCountEl.textContent = String(level.animals.length);
  if (outputEl) outputEl.value = formatLevel(level);
  updateControls();
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

function saveCurrentLevelDraft() {
  const source = editorState.levels[editorState.levelIndex];
  if (!source) return;
  const level = getEditorLevel();
  Object.assign(source, {
    name: source.name,
    animalType: level.animalType,
    playArea: level.playArea,
    flowRules: level.flowRules,
    animals: level.animals,
  });
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

async function runGenerateTask(action, button) {
  if (editorState.generating) return;
  editorState.generating = true;
  const label = button.textContent;
  setGenerationControlsDisabled(true);
  button.textContent = "生成中";
  await new Promise((resolve) => window.setTimeout(resolve, 20));
  try {
    action();
  } finally {
    button.textContent = label;
    setGenerationControlsDisabled(false);
    editorState.generating = false;
  }
}

function setGenerationControlsDisabled(disabled) {
  generateBtn.disabled = disabled;
  addLevelBtn.disabled = disabled;
  deployBtn.disabled = disabled;
  eraseBtn.disabled = disabled || !getSelectedAnimal();
  rotateBtn.disabled = disabled || !getSelectedAnimal();
  generateCountInput.disabled = disabled;
  levelSelect.disabled = disabled;
}

function generateCurrentLevel() {
  const source = editorState.levels[editorState.levelIndex];
  const targetCount = getGenerateTargetCount();
  const animals = generateLevelAnimals(source, targetCount);
  editorState.animals = animals.map((animal, index) => ({ ...animal, id: `edit-${index}` }));
  editorState.selectedAnimalId = editorState.animals[0]?.id ?? null;
  editorState.lastAdjustedAnimalId = editorState.selectedAnimalId;
  if (editorState.selectedAnimalId) {
    setActiveInspection(findAnimalById(editorState.selectedAnimalId));
  } else {
    clearActiveInspection();
  }
  saveCurrentLevelDraft();
  syncGenerateCount(targetCount);
  renderEditor();
}

function addGeneratedLevel() {
  saveCurrentLevelDraft();
  const source = editorState.levels[editorState.levelIndex];
  const targetCount = getGenerateTargetCount();
  const animals = generateLevelAnimals(source, targetCount);
  const nextLevelNumber = editorState.levels.length + 1;
  const nextId = Math.max(0, ...editorState.levels.map((level) => Number(level.id) || 0)) + 1;
  const generatedLevel = {
    id: nextId,
    name: `新关卡${nextLevelNumber}`,
    animalType: source.animalType ?? "pig",
    playArea: source.playArea,
    flowRules: source.flowRules,
    animals: animals.map((animal) => ({
      x: animal.x,
      y: animal.y,
      dir: animal.dir,
    })),
  };

  editorState.levels.push(generatedLevel);
  renderLevelOptions();
  loadLevel(editorState.levels.length - 1);
  syncGenerateCount(targetCount);
}

function deployLevelsToGame() {
  saveCurrentLevelDraft();
  const levels = editorState.levels.map(normalizeLevelForDeploy);
  window.localStorage.setItem(DEPLOYED_LEVELS_STORAGE_KEY, JSON.stringify(levels));
  deployBtn.textContent = "已部署";
  window.setTimeout(() => {
    deployBtn.textContent = "部署";
  }, 1200);
}

function readDeployedLevels(fallbackLevels) {
  try {
    const raw = window.localStorage.getItem(DEPLOYED_LEVELS_STORAGE_KEY);
    if (!raw) return fallbackLevels;
    const levels = JSON.parse(raw);
    return Array.isArray(levels) && levels.length > 0 ? levels : fallbackLevels;
  } catch (error) {
    return fallbackLevels;
  }
}

function normalizeLevelForDeploy(level) {
  return {
    id: level.id,
    name: level.name,
    animalType: level.animalType ?? "pig",
    playArea: level.playArea,
    ...(level.flowRules ? { flowRules: level.flowRules } : {}),
    animals: level.animals.map((animal) => ({
      x: animal.x,
      y: animal.y,
      dir: animal.dir,
      ...(animal.type ? { type: animal.type } : {}),
    })),
  };
}

function generateLevelAnimals(source, targetCount) {
  const area = getCurrentPlayArea();
  let best = [];
  let bestScore = Infinity;

  const profiles = getDesignProfiles(area);
  const profileCells = profiles.map((profile) => ({
    profile,
    cells: getWeightedPlayableCells(area, profile),
  }));
  const attemptCount = getGenerateAttemptCount(targetCount);
  const missLimit = Math.min(900, Math.max(260, targetCount * 26));

  for (let attempt = 0; attempt < attemptCount; attempt += 1) {
    const { profile, cells } = profileCells[attempt % profileCells.length];
    const animals = [];
    let misses = 0;
    while (animals.length < targetCount && misses < missLimit) {
      const cell = pickWeightedCell(cells);
      const animal = {
        x: cell.x,
        y: cell.y,
        dir: pickDesignedDirection(cell, profile, area),
        id: `gen-${attempt}-${animals.length}`,
        active: true,
      };
      if (
        canPlaceInList(animal, animals, area) &&
        !hasSameDirectionLaneConflict(animal, animals)
      ) {
        animals.push(animal);
        misses = 0;
      } else {
        misses += 1;
      }
    }
    const score = scoreAnimals(animals, source, targetCount, profile);
    if (score < bestScore) {
      bestScore = score;
      best = animals;
    }
  }

  return best;
}

function getGenerateAttemptCount(targetCount) {
  if (targetCount <= 24) return 44;
  if (targetCount <= 45) return 32;
  return 18;
}

function getGenerateTargetCount() {
  const value = Number(generateCountInput?.value);
  const max = getMaxGenerateCount();
  const fallback = 30;
  return Math.max(1, Math.min(max, Number.isFinite(value) && value > 0 ? Math.round(value) : fallback));
}

function syncGenerateCount(count) {
  if (!generateCountInput) return;
  const max = getMaxGenerateCount();
  generateCountInput.max = String(max);
  generateCountInput.value = String(Math.max(1, Math.min(max, Math.round(count))));
}

function getMaxGenerateCount() {
  const area = getCurrentPlayArea();
  let playableCells = 0;
  for (let y = area.y; y < area.y + area.rows; y += 1) {
    for (let x = area.x; x < area.x + area.cols; x += 1) {
      if (isPlayableCell(x, y)) playableCells += 1;
    }
  }
  return Math.max(1, Math.floor(playableCells / 2));
}

function scoreAnimals(animals, source, targetCount, profile) {
  if (animals.length < targetCount) {
    return (
      Math.abs(targetCount - animals.length) * 5000 +
      getDesignedShapeScore(animals, getCurrentPlayArea(), profile)
    );
  }

  const level = {
    ...source,
    animals: animals.map((animal) => ({ x: animal.x, y: animal.y, dir: animal.dir })),
  };
  const rules = getEditorFlowRules(level);
  const analysis = getFastFlowAnalysis(level);
  const opposingCount = findOpposingLanePairs(level.animals).length;
  const sameDirectionCount = findSameDirectionLanePairs(level.animals).length;
  const deadlockCycleCount = getTightDeadlockCycleCount(animals);
  const longestChain = analysis.exitLaneChains[0]?.count ?? 0;
  const crowdedDirectionCount = analysis.openByDirection.filter(
    (group) => group.count > rules.maxOpenPerDirection,
  ).length;
  return (
    Math.abs(targetCount - animals.length) * 5000 +
    opposingCount * 1400 +
    sameDirectionCount * 1200 +
    deadlockCycleCount * 1800 +
    Math.max(0, analysis.initialOpenCount - rules.maxInitialOpen) * 260 +
    Math.max(0, longestChain - rules.maxExitChain) * 520 +
    crowdedDirectionCount * 180 +
    getDesignedShapeScore(animals, getCurrentPlayArea(), profile) +
    analysis.initialOpenCount
  );
}

function getFastFlowAnalysis(level) {
  const animals = level.animals.map((animal, index) => ({
    ...animal,
    id: `level-${level.id}-${index}`,
    active: true,
  }));
  const initialOpen = getOpenAnimals(animals);
  return {
    initialOpenCount: initialOpen.length,
    openByDirection: groupOpenAnimalsByDirection(initialOpen),
    exitLaneChains: getExitLaneChains(animals),
  };
}

function getDesignProfiles(area) {
  return [
    {
      id: "wings",
      weightCell: (cell) => {
        const nx = getNormalized(cell.x, area.x, area.cols);
        const ny = getNormalized(cell.y, area.y, area.rows);
        const side = Math.abs(nx - 0.5) * 2;
        const waist = Math.abs(ny - 0.5) < 0.26 ? 0.55 : 1;
        return 0.18 + side * 2.8 * waist;
      },
    },
    {
      id: "diagonal",
      weightCell: (cell) => {
        const nx = getNormalized(cell.x, area.x, area.cols);
        const ny = getNormalized(cell.y, area.y, area.rows);
        const first = Math.abs(nx - ny);
        const second = Math.abs(nx + ny - 1);
        return 0.25 + 1.9 / (1 + Math.min(first, second) * 7);
      },
    },
    {
      id: "islands",
      weightCell: (cell) => {
        const nx = getNormalized(cell.x, area.x, area.cols);
        const ny = getNormalized(cell.y, area.y, area.rows);
        const anchors = [
          { x: 0.24, y: 0.22 },
          { x: 0.74, y: 0.31 },
          { x: 0.34, y: 0.69 },
          { x: 0.76, y: 0.78 },
        ];
        const nearest = anchors.reduce(
          (best, anchor) => Math.min(best, Math.hypot(nx - anchor.x, ny - anchor.y)),
          Infinity,
        );
        return 0.2 + 2.4 / (1 + nearest * 8);
      },
    },
    {
      id: "frame",
      weightCell: (cell) => {
        const nx = getNormalized(cell.x, area.x, area.cols);
        const ny = getNormalized(cell.y, area.y, area.rows);
        const edge = Math.min(nx, 1 - nx, ny, 1 - ny);
        return 0.2 + Math.max(0, 0.48 - edge) * 4;
      },
    },
  ];
}

function getWeightedPlayableCells(area, profile) {
  const cells = [];
  for (let y = area.y; y < area.y + area.rows; y += 1) {
    for (let x = area.x; x < area.x + area.cols; x += 1) {
      if (!isPlayableCell(x, y)) continue;
      cells.push({ x, y, weight: Math.max(0.05, profile.weightCell({ x, y })) });
    }
  }
  return cells;
}

function pickWeightedCell(cells) {
  const total = cells.reduce((sum, cell) => sum + cell.weight, 0);
  let cursor = Math.random() * total;
  for (const cell of cells) {
    cursor -= cell.weight;
    if (cursor <= 0) return cell;
  }
  return cells[cells.length - 1];
}

function pickDesignedDirection(cell, profile, area) {
  const midX = area.x + area.cols / 2;
  const midY = area.y + area.rows / 2;
  if (profile.id === "wings") {
    return cell.x < midX ? randomItem(["right", "up", "down"]) : randomItem(["left", "up", "down"]);
  }
  if (profile.id === "diagonal") {
    return cell.x + cell.y < midX + midY ? randomItem(["right", "down"]) : randomItem(["left", "up"]);
  }
  if (profile.id === "frame") {
    if (cell.x <= area.x + 2) return randomItem(["right", "up", "down"]);
    if (cell.x >= area.x + area.cols - 3) return randomItem(["left", "up", "down"]);
    if (cell.y <= area.y + 2) return randomItem(["down", "left", "right"]);
    return randomItem(["up", "left", "right"]);
  }
  return randomItem(Object.keys(editorState.dirs));
}

function getDesignedShapeScore(animals, area, profile) {
  if (animals.length === 0) return 9999;
  const mismatch = animals.reduce((sum, animal) => {
    const center = getAnimalCenter(animal);
    const weight = Math.max(0.05, profile.weightCell(center));
    return sum + 1 / weight;
  }, 0);
  const isolatedCount = animals.filter((animal) => !hasNearbyAnimal(animal, animals)).length;
  const overloadedLaneCount = getOverloadedVisualLaneCount(animals);
  return mismatch * 18 + isolatedCount * 55 + overloadedLaneCount * 24;
}

function hasNearbyAnimal(animal, animals) {
  const center = getAnimalCenter(animal);
  return animals.some((other) => {
    if (other.id === animal.id) return false;
    const otherCenter = getAnimalCenter(other);
    return Math.hypot(center.x - otherCenter.x, center.y - otherCenter.y) <= 3.2;
  });
}

function getOverloadedVisualLaneCount(animals) {
  const rows = new Map();
  const cols = new Map();
  animals.forEach((animal) => {
    rows.set(animal.y, (rows.get(animal.y) ?? 0) + 1);
    cols.set(animal.x, (cols.get(animal.x) ?? 0) + 1);
  });
  return [...rows.values(), ...cols.values()].filter((count) => count > 8).length;
}

function getNormalized(value, start, size) {
  if (size <= 1) return 0.5;
  return (value - start) / (size - 1);
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
  const insidePlayArea = footprint.every(
    (cell) =>
      cell.x >= area.x &&
      cell.x < area.x + area.cols &&
      cell.y >= area.y &&
      cell.y < area.y + area.rows,
  );
  if (!insidePlayArea || !isAnimalOnPlayableCells(animal)) return false;
  return animals.every((item) => {
    const occupied = getFootprint(item);
    return !footprint.some((cell) =>
      occupied.some((other) => other.x === cell.x && other.y === cell.y),
    );
  });
}

function getLocalInspection(animal) {
  const opposingAnimals = getOpposingLaneAnimals(animal);
  const sameDirectionAnimals = getSameDirectionLaneAnimals(animal);
  const collisionIds = Array.from(
    new Set([...opposingAnimals, ...sameDirectionAnimals].map((item) => item.id)),
  );
  const deadlockCycleIds = getDeadlockCycleIds(animal);
  const deadzoneIds =
    deadlockCycleIds.length > 2 && isTightDeadlockCycle(deadlockCycleIds)
      ? deadlockCycleIds.filter((id) => id !== animal.id)
      : [];
  const risks = [];

  if (opposingAnimals.length > 0) {
    risks.push({
      level: "danger",
      text: `生成规避：同线对向 ${opposingAnimals.length} 只，会形成天然死锁`,
    });
  }

  if (sameDirectionAnimals.length > 0) {
    risks.push({
      level: "danger",
      text: `生成规避：同向追尾 ${sameDirectionAnimals.length} 只，会形成必然死局`,
    });
  }

  if (deadzoneIds.length > 0) {
    risks.push({
      level: "danger",
      text: `死局闭环：${deadlockCycleIds.length} 只小猪互相挡住`,
    });
  }

  if (!canPlace(animal, animal.id)) {
    risks.unshift({
      level: "danger",
      text: "当前位置不可用：越过可通行区域或与其他小猪重叠",
    });
  }

  return {
    targetId: animal.id,
    neighborIds: deadzoneIds,
    collisionIds,
    deadzoneIds: Array.from(new Set(deadzoneIds)),
    blockedSides: deadzoneIds.length,
    risks,
  };
}

function getOpposingLaneAnimals(animal) {
  return editorState.animals.filter((item) => {
    if (item.id === animal.id || !item.active) return false;
    return isOpposingLanePair(animal, item);
  });
}

function getSameDirectionLaneAnimals(animal) {
  return editorState.animals.filter((item) => {
    if (item.id === animal.id || item.active === false) return false;
    return isSameDirectionLanePair(animal, item);
  });
}

function getDeadlockCycleIds(animal) {
  const chain = [animal.id];
  const visited = new Set(chain);
  let current = animal;

  for (let depth = 0; depth < editorState.animals.length; depth += 1) {
    const blocker = findFirstBlockingAnimal(current);
    if (!blocker) return [];
    if (blocker.id === animal.id) return chain;
    if (visited.has(blocker.id)) return [];
    chain.push(blocker.id);
    visited.add(blocker.id);
    current = blocker;
  }

  return [];
}

function findFirstBlockingAnimal(animal) {
  const blocker = findBlockerInAnimals(editorState.animals, animal);
  if (!blocker) return null;
  return findAnimalAtCell(blocker.x, blocker.y) ?? null;
}

function isTightDeadlockCycle(ids) {
  return ids.every((id) => {
    const animal = findAnimalById(id);
    const blocker = animal ? findBlockerInAnimals(editorState.animals, animal) : null;
    return Boolean(blocker && blocker.openCells <= 1);
  });
}

function getTightDeadlockCycleCount(animals) {
  const cycles = new Set();
  animals.forEach((animal) => {
    const ids = getDeadlockCycleIdsInList(animals, animal);
    if (ids.length <= 2 || !isTightDeadlockCycleInList(animals, ids)) return;
    cycles.add([...ids].sort().join("|"));
  });
  return cycles.size;
}

function getDeadlockCycleIdsInList(animals, animal) {
  const chain = [animal.id];
  const visited = new Set(chain);
  let current = animal;

  for (let depth = 0; depth < animals.length; depth += 1) {
    const blocker = findFirstBlockingAnimalInList(animals, current);
    if (!blocker) return [];
    if (blocker.id === animal.id) return chain;
    if (visited.has(blocker.id)) return [];
    chain.push(blocker.id);
    visited.add(blocker.id);
    current = blocker;
  }

  return [];
}

function findFirstBlockingAnimalInList(animals, animal) {
  const blocker = findBlockerInAnimals(animals, animal);
  if (!blocker) return null;
  return (
    animals.find(
      (item) =>
        item.active &&
        item.id !== animal.id &&
        getFootprint(item).some((cell) => cell.x === blocker.x && cell.y === blocker.y),
    ) ?? null
  );
}

function isTightDeadlockCycleInList(animals, ids) {
  return ids.every((id) => {
    const animal = animals.find((item) => item.id === id);
    const blocker = animal ? findBlockerInAnimals(animals, animal) : null;
    return Boolean(blocker && blocker.openCells <= 1);
  });
}

function getSelectedAnimal() {
  return findAnimalById(editorState.selectedAnimalId);
}

function findAnimalById(id) {
  if (!id) return null;
  return editorState.animals.find((animal) => animal.id === id) ?? null;
}

function formatAnimalPosition(animal) {
  return `${animal.x},${animal.y}`;
}

function getCellKey(cell) {
  return `${cell.x}:${cell.y}`;
}

function getAnimalSelector(id) {
  return `[data-id="${String(id).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"]`;
}

function setActiveInspection(animal) {
  editorState.activeInspection = animal ? getLocalInspection(animal) : null;
}

function setInvalidActionInspection(animal, message) {
  editorState.activeInspection = {
    targetId: animal.id,
    neighborIds: [],
    collisionIds: [],
    deadzoneIds: [],
    blockedSides: 0,
    risks: [{ level: "danger", text: message }],
  };
}

function clearActiveInspection() {
  editorState.activeInspection = null;
}

function getPigInspectionClass(animal) {
  const inspection = editorState.activeInspection;
  if (!inspection) return "";
  const classes = [];
  if (inspection.targetId === animal.id) classes.push("is-inspection-target");
  if (inspection.collisionIds.includes(animal.id)) classes.push("is-collision-risk");
  if (inspection.deadzoneIds.includes(animal.id)) classes.push("is-deadzone-risk");
  return classes.length ? ` ${classes.join(" ")}` : "";
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

function isInsideBoardCell(x, y) {
  return x >= 0 && x < editorState.board.cols && y >= 0 && y < editorState.board.rows;
}

function isCornerCutoutCell(x, y) {
  const arcStart = editorState.cornerCutout?.arcStartCell;
  if (!arcStart) return false;

  const left = x < arcStart;
  const right = x >= editorState.board.cols - arcStart;
  const top = y < arcStart;
  const bottom = y >= editorState.board.rows - arcStart;
  if (!(left || right) || !(top || bottom)) return false;

  const centerX = left ? arcStart : editorState.board.cols - arcStart;
  const centerY = top ? arcStart : editorState.board.rows - arcStart;
  const farthestX = left ? x : x + 1;
  const farthestY = top ? y : y + 1;
  return Math.hypot(farthestX - centerX, farthestY - centerY) > arcStart;
}

function isPlayableCell(x, y) {
  return isInsideBoardCell(x, y) && !isCornerCutoutCell(x, y);
}

function isAnimalOnPlayableCells(animal) {
  return getFootprint(animal).every((cell) => isPlayableCell(cell.x, cell.y));
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
  for (let step = 1; ; step += 1) {
    const movedAnimal = {
      ...animal,
      x: animal.x + dir.dx * step,
      y: animal.y + dir.dy * step,
    };
    if (!isAnimalOnPlayableCells(movedAnimal)) return null;

    const x = animal.x + dir.dx * step;
    const y = animal.y + dir.dy * step;
    const occupied = animals.some((item) => {
      if (!item.active || item.id === animal.id) return false;
      return getFootprint(item).some((cell) => cell.x === x && cell.y === y);
    });
    if (occupied) return { x, y, openCells: step - 1 };
  }
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
    ...DEFAULT_FLOW_RULES,
    ...(editorState.flowRules ?? {}),
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

function findSameDirectionLanePairs(animals) {
  const pairs = [];
  for (let first = 0; first < animals.length; first += 1) {
    for (let second = first + 1; second < animals.length; second += 1) {
      if (isSameDirectionLanePair(animals[first], animals[second])) {
        pairs.push({ first, second });
      }
    }
  }
  return pairs;
}

function hasSameDirectionLaneConflict(animal, animals) {
  return animals.some((other) => isSameDirectionLanePair(animal, other));
}

function isSameDirectionLanePair(first, second) {
  if (first.active === false || second.active === false || first.dir !== second.dir) return false;
  return isFirstBlockerInFront(first, second) || isFirstBlockerInFront(second, first);
}

function isFirstBlockerInFront(animal, blocker) {
  const dir = editorState.dirs[animal.dir];
  for (let step = 1; ; step += 1) {
    const movedAnimal = {
      ...animal,
      x: animal.x + dir.dx * step,
      y: animal.y + dir.dy * step,
    };
    if (!isAnimalOnPlayableCells(movedAnimal)) return false;

    const x = animal.x + dir.dx * step;
    const y = animal.y + dir.dy * step;
    if (getFootprint(blocker).some((cell) => cell.x === x && cell.y === y)) {
      return true;
    }
  }
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
