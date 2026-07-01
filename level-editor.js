const {
  DIRS,
  DIRECTIONS,
  CORNER_CUTOUT,
  getFootprint,
  getAnimalCenter,
  isCellInsideArea,
  isPlayableCell,
  isAnimalOnValidCells,
  getPlayableCellCount,
  getCellKey,
  validateLevelAnimals: validateBoardLevelAnimals,
} = window.PigEscapeBoardCore;

const EDITOR_BOARD = {
  cols: 10,
  rows: 16,
};

const editorState = {
  dirs: DIRS,
  board: EDITOR_BOARD,
  cornerCutout: CORNER_CUTOUT,
  officialLevels: [],
  levels: [],
  levelIndex: 0,
  animals: [],
  selectedAnimalId: null,
  dir: "up",
  validation: null,
  dirty: false,
  drag: null,
  source: "official",
  demo: false,
};

const DRAFT_STORAGE_KEY = "pigEscapeLevelEditorDraftsV4Official10x16";
const DEPLOYED_LEVELS_STORAGE_KEY = "pigEscapeEditorDeployedLevelsV2Board10x16";
const SELECTED_LEVEL_STORAGE_KEY = "pigEscapeLevelEditorSelectedLevelV1";
const GENERATOR_ATTEMPTS = 360;
const GENERATOR_REPAIR_PASSES = 90;

const boardEl = document.querySelector("#editorBoard");
const levelSelect = document.querySelector("#editorLevelSelect");
const generateCountInput = document.querySelector("#editorGenerateCount");
const generateOpenCountInput = document.querySelector("#editorGenerateOpenCount");
const statusEl = document.querySelector("#editorLevelStatus");
const sourceStatusEl = document.querySelector("#editorSourceStatus");
const generateCurrentBtn = document.querySelector("#editorGenerateCurrent");
const newLevelBtn = document.querySelector("#editorNewLevel");
const saveDraftBtn = document.querySelector("#editorSaveDraft");
const reloadOfficialBtn = document.querySelector("#editorReloadOfficial");
const playtestBtn = document.querySelector("#editorPlaytest");
const deployOfficialBtn = document.querySelector("#editorDeployOfficial");
const clearLevelBtn = document.querySelector("#editorClearLevel");
const exportBtn = document.querySelector("#editorExport");
const copyExportBtn = document.querySelector("#editorCopyExport");
const boardSizeEl = document.querySelector("#editorBoardSize");
const selectedInfoEl = document.querySelector("#editorSelectedInfo");
const validationStateEl = document.querySelector("#editorValidationState");
const metricsEl = document.querySelector("#editorMetrics");
const issuesEl = document.querySelector("#editorIssues");
const exportTextEl = document.querySelector("#editorExportText");

bootEditor();

async function bootEditor() {
  try {
    const data = await loadGameData();
    Object.assign(editorState, data);
    editorState.officialLevels = data.levels.map(normalizeLevel);
    if (isDeadlockDemoMode()) {
      editorState.demo = true;
      editorState.source = "demo";
      editorState.levels = [createDeadlockDemoLevel()];
      editorState.officialLevels = [createDeadlockDemoLevel()];
    } else {
      editorState.levels = loadInitialLevels(editorState.officialLevels);
    }
    boardEl.style.setProperty("--board-cols", editorState.board.cols);
    boardEl.style.setProperty("--board-rows", editorState.board.rows);
    renderLevelOptions();
    loadLevel(editorState.demo ? 0 : getSavedLevelIndex());
    bindEditorEvents();
    updateDemoControls();
  } catch (error) {
    statusEl.textContent = `加载失败：${error.message}`;
  }
}

async function loadGameData() {
  return {
    dirs: DIRS,
    board: EDITOR_BOARD,
    cornerCutout: CORNER_CUTOUT,
    levels: window.PIG_ESCAPE_LEVELS ?? [],
  };
}

function bindEditorEvents() {
  levelSelect.addEventListener("change", () => {
    saveCurrentLevelDraft();
    loadLevel(Number(levelSelect.value));
  });
  generateCurrentBtn.addEventListener("click", generateCurrentLevel);
  newLevelBtn.addEventListener("click", createNewLevel);
  saveDraftBtn.addEventListener("click", saveAllDrafts);
  reloadOfficialBtn.addEventListener("click", reloadOfficialLevels);
  playtestBtn.addEventListener("click", playtestCurrentLevels);
  deployOfficialBtn.addEventListener("click", deployOfficialLevels);
  clearLevelBtn.addEventListener("click", clearCurrentLevel);
  exportBtn.addEventListener("click", exportForController);
  copyExportBtn.addEventListener("click", copyExportText);
  window.addEventListener("pointermove", handleDragMove);
  window.addEventListener("pointerup", finishDrag);
}

function renderLevelOptions() {
  levelSelect.innerHTML = editorState.levels
    .map((level, index) => `<option value="${index}">${level.name ?? `第${index + 1}关`}</option>`)
    .join("");
}

function loadLevel(index) {
  editorState.levelIndex = Math.max(0, Math.min(index, editorState.levels.length - 1));
  levelSelect.value = String(editorState.levelIndex);
  saveSelectedLevelIndex(editorState.levelIndex);
  const level = editorState.levels[editorState.levelIndex];
  editorState.animals = level.animals.map((animal, animalIndex) => ({
    ...animal,
    id: `edit-${animalIndex}`,
    active: true,
  }));
  generateCountInput.value = String(editorState.animals.length || Number(generateCountInput.value) || 30);
  const validation = validateEditorLevelAnimals(editorState.animals, getCurrentPlayArea());
  generateOpenCountInput.value = String(Number.isFinite(validation.openCount) ? validation.openCount : 3);
  editorState.selectedAnimalId = editorState.animals[0]?.id ?? null;
  if (editorState.selectedAnimalId) {
    editorState.dir = findAnimalById(editorState.selectedAnimalId).dir;
  }
  setDirty(false);
  renderEditor();
}

function renderEditor() {
  editorState.validation = validateEditorLevelAnimals(editorState.animals, getCurrentPlayArea());
  boardEl.innerHTML = "";
  renderPlayArea();
  renderCells();
  renderAnimals();
  renderRotateHandle();
  renderControls();
  renderStats();
}

function renderPlayArea() {
  const area = getCurrentPlayArea();
  const playArea = document.createElement("span");
  playArea.className = "play-area";
  playArea.style.setProperty("--area-x", area.x);
  playArea.style.setProperty("--area-y", area.y);
  playArea.style.setProperty("--area-cols", area.cols);
  playArea.style.setProperty("--area-rows", area.rows);
  boardEl.appendChild(playArea);
}

function renderCells() {
  const area = getCurrentPlayArea();
  for (let y = 0; y < editorState.board.rows; y += 1) {
    for (let x = 0; x < editorState.board.cols; x += 1) {
      const cell = document.createElement("button");
      cell.className = "editor-grid-cell";
      if (!isCellInsideArea(x, y, area) || !isPlayableCell(x, y, editorState.board, editorState.cornerCutout)) {
        cell.classList.add("is-outside");
      }
      cell.type = "button";
      cell.dataset.x = String(x);
      cell.dataset.y = String(y);
      cell.style.setProperty("--x", x);
      cell.style.setProperty("--y", y);
      cell.setAttribute("aria-label", `格子 ${x},${y}`);
      cell.addEventListener("click", () => handleBoardCell(x, y));
      cell.addEventListener("dblclick", () => handleBoardDoubleClick(x, y));
      cell.addEventListener("pointerdown", (event) => startDrag(event, x, y));
      boardEl.appendChild(cell);
    }
  }
}

function renderAnimals() {
  editorState.animals.forEach((animal) => {
    const pig = document.createElement("button");
    const center = getAnimalCenter(animal);
    pig.className = `pig animal-pig${getPigRiskClass(animal)}${animal.id === editorState.selectedAnimalId ? " is-selected" : ""}`;
    pig.type = "button";
    pig.dataset.id = animal.id;
    pig.style.setProperty("--x", center.x);
    pig.style.setProperty("--y", center.y);
    pig.style.setProperty("--z", Math.round(center.y * 2 + 10));
    pig.style.setProperty("--rot", editorState.dirs[animal.dir].rot);
    pig.setAttribute("aria-label", `小猪朝${editorState.dirs[animal.dir].label}`);
    pig.title = `小猪 ${animal.x},${animal.y} 朝${editorState.dirs[animal.dir].label}`;
    pig.innerHTML = `<span class="pig-shape" aria-hidden="true"></span>`;
    boardEl.appendChild(pig);
  });
}

function renderRotateHandle() {
  const selected = findAnimalById(editorState.selectedAnimalId);
  if (!selected) return;
  const center = getAnimalCenter(selected);
  const rotateButton = document.createElement("button");
  rotateButton.className = "editor-floating-rotate";
  rotateButton.type = "button";
  rotateButton.style.setProperty("--x", center.x);
  rotateButton.style.setProperty("--y", center.y);
  rotateButton.setAttribute("aria-label", "旋转小猪");
  rotateButton.title = "旋转";
  rotateButton.textContent = "↻";
  rotateButton.addEventListener("click", (event) => {
    event.stopPropagation();
    rotateSelectedDirection();
  });
  boardEl.appendChild(rotateButton);
}

function handleBoardCell(x, y) {
  const hit = findAnimalAtCell(x, y);
  if (hit) {
    selectAnimal(hit.id);
    return;
  }
}

function handleBoardDoubleClick(x, y) {
  if (findAnimalAtCell(x, y)) return;
  createAnimalAt(x, y);
}

function startDrag(event, x, y) {
  const hit = findAnimalAtCell(x, y);
  if (!hit) return;
  event.preventDefault();
  editorState.selectedAnimalId = hit.id;
  editorState.dir = hit.dir;
  editorState.drag = {
    id: hit.id,
    startX: event.clientX,
    startY: event.clientY,
    moved: false,
  };
  boardEl.setPointerCapture?.(event.pointerId);
  renderEditor();
  updateDragPreview(event);
}

function handleDragMove(event) {
  if (!editorState.drag) return;
  const dx = event.clientX - editorState.drag.startX;
  const dy = event.clientY - editorState.drag.startY;
  if (Math.hypot(dx, dy) > 4) editorState.drag.moved = true;
  updateDragPreview(event);
}

function finishDrag(event) {
  const drag = editorState.drag;
  if (!drag) return;
  editorState.drag = null;
  removeDragPreview();
  if (!drag.moved) return;

  const targetCell = getCellFromPoint(event.clientX, event.clientY);
  if (!targetCell) {
    deleteAnimal(drag.id);
    setTemporaryStatus("已删除");
    return;
  }
  moveAnimalTo(drag.id, targetCell.x, targetCell.y);
}

function updateDragPreview(event) {
  const drag = editorState.drag;
  const animal = drag ? findAnimalById(drag.id) : null;
  if (!animal) return;

  const rect = boardEl.getBoundingClientRect();
  const localX = event.clientX - rect.left;
  const localY = event.clientY - rect.top;
  const label = `小猪朝${editorState.dirs[animal.dir].label}`;
  let preview = boardEl.querySelector(".editor-drag-preview");
  if (!preview) {
    preview = document.createElement("span");
    preview.className = "pig animal-pig editor-drag-preview";
    preview.innerHTML = `<span class="pig-shape" aria-hidden="true"></span>`;
    boardEl.appendChild(preview);
  }
  preview.setAttribute("aria-label", label);
  preview.style.left = `${localX}px`;
  preview.style.top = `${localY}px`;
  preview.style.setProperty("--z", 220);

  let target = boardEl.querySelector(".editor-drag-target");
  if (!target) {
    target = document.createElement("span");
    target.className = "editor-drag-target";
    boardEl.appendChild(target);
  }

  const targetCell = getCellFromPoint(event.clientX, event.clientY);
  if (!targetCell) {
    target.className = "editor-drag-target is-delete";
    target.textContent = "松手删除";
    clearDragTargetFootprint(target);
    target.style.left = `${Math.min(Math.max(localX, 42), rect.width - 42)}px`;
    target.style.top = `${Math.min(Math.max(localY, 24), rect.height - 24)}px`;
    return;
  }

  const movedAnimal = { ...animal, x: targetCell.x, y: targetCell.y };
  target.className = `editor-drag-target${canPlace(movedAnimal, animal.id) ? "" : " is-invalid"}`;
  target.textContent = "";
  target.style.removeProperty("left");
  target.style.removeProperty("top");
  setDragTargetFootprint(target, movedAnimal);
}

function removeDragPreview() {
  boardEl.querySelector(".editor-drag-preview")?.remove();
  boardEl.querySelector(".editor-drag-target")?.remove();
}

function setDragTargetFootprint(target, animal) {
  const cells = getFootprint(animal);
  const minX = Math.min(...cells.map((cell) => cell.x));
  const maxX = Math.max(...cells.map((cell) => cell.x));
  const minY = Math.min(...cells.map((cell) => cell.y));
  const maxY = Math.max(...cells.map((cell) => cell.y));
  target.style.setProperty("--target-x", minX);
  target.style.setProperty("--target-y", minY);
  target.style.setProperty("--target-cols", maxX - minX + 1);
  target.style.setProperty("--target-rows", maxY - minY + 1);
}

function clearDragTargetFootprint(target) {
  target.style.removeProperty("--target-x");
  target.style.removeProperty("--target-y");
  target.style.removeProperty("--target-cols");
  target.style.removeProperty("--target-rows");
}

function createAnimalAt(x, y) {
  const animal = {
    x,
    y,
    dir: editorState.dir,
    id: `edit-${Date.now()}-${editorState.animals.length}`,
    active: true,
  };
  if (!canPlace(animal)) {
    setTemporaryStatus("这里放不下");
    return;
  }
  editorState.animals.push(animal);
  editorState.selectedAnimalId = animal.id;
  setDirty(true);
  renderEditor();
}

function moveSelectedAnimal(x, y) {
  moveAnimalTo(editorState.selectedAnimalId, x, y);
}

function moveAnimalTo(id, x, y) {
  const animal = findAnimalById(id);
  if (!animal) return;
  const movedAnimal = { ...animal, x, y };
  if (!canPlace(movedAnimal, animal.id)) {
    setTemporaryStatus("目标位置不可用");
    return;
  }
  Object.assign(animal, { x, y });
  editorState.selectedAnimalId = animal.id;
  editorState.dir = animal.dir;
  setDirty(true);
  renderEditor();
}

function getCellFromPoint(clientX, clientY) {
  const rect = boardEl.getBoundingClientRect();
  if (
    clientX < rect.left ||
    clientX >= rect.right ||
    clientY < rect.top ||
    clientY >= rect.bottom
  ) {
    return null;
  }
  const cellWidth = rect.width / editorState.board.cols;
  const cellHeight = rect.height / editorState.board.rows;
  return {
    x: Math.floor((clientX - rect.left) / cellWidth),
    y: Math.floor((clientY - rect.top) / cellHeight),
  };
}

function selectAnimal(id) {
  const animal = findAnimalById(id);
  if (!animal) return;
  editorState.selectedAnimalId = id;
  editorState.dir = animal.dir;
  renderEditor();
}

function deleteAnimal(id) {
  editorState.animals = editorState.animals.filter((animal) => animal.id !== id);
  if (editorState.selectedAnimalId === id) {
    editorState.selectedAnimalId = null;
  }
  setDirty(true);
  renderEditor();
}

function rotateSelectedDirection() {
  const currentIndex = DIRECTIONS.indexOf(editorState.dir);
  const nextDir = DIRECTIONS[(Math.max(0, currentIndex) + 1) % DIRECTIONS.length];
  setDirection(nextDir);
}

function setDirection(dir) {
  editorState.dir = dir;
  const selected = findAnimalById(editorState.selectedAnimalId);
  if (selected) {
    selected.dir = dir;
    setDirty(true);
  }
  renderEditor();
}

function renderControls() {
  const selected = findAnimalById(editorState.selectedAnimalId);
  selectedInfoEl.textContent = selected
    ? `选中：${selected.x},${selected.y}，朝${editorState.dirs[selected.dir].label}`
    : "未选中小猪";
}

function renderStats() {
  const validation = editorState.validation;
  const density = getDensityPercent(validation.total);
  const directionCounts = getDirectionCounts(editorState.animals);
  const hardRiskCount =
    validation.invalidIds.size +
    validation.overlapIds.size +
    validation.collisionPairs.length +
    validation.compactDeadlockCycles.length;
  const statusText = hardRiskCount === 0 ? "通过" : `${hardRiskCount} 项风险`;

  boardSizeEl.textContent = `${editorState.board.cols}×${editorState.board.rows}`;
  validationStateEl.textContent = statusText;
  validationStateEl.classList.toggle("is-ok", hardRiskCount === 0);
  validationStateEl.classList.toggle("is-danger", hardRiskCount > 0);

  const metrics = [
    ["小猪", validation.total],
    ["可逃", validation.openCount],
    ["密度", `${density}%`],
    ["最长链", validation.longestChain],
    ["风险", hardRiskCount],
    ["朝向", `上${directionCounts.up} 右${directionCounts.right} 下${directionCounts.down} 左${directionCounts.left}`],
    ["提示", getDifficultyHint(validation, density)],
  ];

  metricsEl.innerHTML = metrics
    .map(
      ([label, value]) => `
        <div class="editor-metric">
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `,
    )
    .join("");

  const issues = getValidationIssues(validation, density);
  issuesEl.innerHTML = issues.length
    ? issues.map((issue) => `<div class="editor-issue is-${issue.level}">${issue.text}</div>`).join("")
    : `<div class="editor-empty-note">当前没有明显问题。</div>`;
}

function generateCurrentLevel() {
  if (editorState.demo) {
    setTemporaryStatus("示例模式不会生成");
    return;
  }
  const targetCount = getRequestedPigCount();
  const targetOpenCount = getRequestedOpenCount(targetCount);
  const generatedAnimals = generateLevelAnimals(targetCount, getCurrentPlayArea(), targetOpenCount);
  if (!generatedAnimals) {
    setTemporaryStatus("生成失败，请调整数量或可逃");
    return;
  }
  setCurrentAnimals(generatedAnimals);
  saveCurrentLevelDraft();
  setDirty(true);
  renderEditor();
  setTemporaryStatus(`本关已生成 ${targetCount} 只，可逃 ${targetOpenCount}`);
}

function createNewLevel() {
  if (editorState.demo) {
    setTemporaryStatus("示例模式不会新增");
    return;
  }
  saveCurrentLevelDraft();
  const nextId = Math.max(0, ...editorState.levels.map((level) => Number(level.id) || 0)) + 1;
  const source = editorState.levels[editorState.levelIndex] ?? {};
  const targetCount = getRequestedPigCount();
  const targetOpenCount = getRequestedOpenCount(targetCount);
  const area = getDefaultPlayArea();
  const generatedAnimals = generateLevelAnimals(targetCount, area, targetOpenCount);
  if (!generatedAnimals) {
    setTemporaryStatus("生成失败，请调整数量或可逃");
    return;
  }
  editorState.levels.push({
    id: nextId,
    name: `第${nextId}关`,
    animalType: source.animalType ?? "pig",
    playArea: area,
    animals: generatedAnimals,
  });
  renderLevelOptions();
  loadLevel(editorState.levels.length - 1);
  setDirty(true);
  setTemporaryStatus(`已新增 ${targetCount} 只，可逃 ${targetOpenCount}`);
}

function setCurrentAnimals(animals) {
  const stamp = Date.now();
  editorState.animals = animals.map((animal, animalIndex) => ({
    ...animal,
    id: `edit-${stamp}-${animalIndex}`,
    active: true,
  }));
  editorState.selectedAnimalId = editorState.animals[0]?.id ?? null;
  if (editorState.selectedAnimalId) {
    editorState.dir = findAnimalById(editorState.selectedAnimalId).dir;
  }
}

function clearCurrentLevel() {
  if (editorState.demo) {
    setTemporaryStatus("示例模式不会清空");
    return;
  }
  editorState.animals = [];
  editorState.selectedAnimalId = null;
  setDirty(true);
  renderEditor();
}

function getRequestedPigCount() {
  const fallback = editorState.animals.length || 30;
  const maxCount = Math.floor(getPlayableCellCount(getCurrentPlayArea(), getBoardOptions()) / 2);
  const value = Math.round(Number(generateCountInput.value) || fallback);
  const count = Math.max(1, Math.min(value, Math.min(90, maxCount)));
  generateCountInput.value = String(count);
  return count;
}

function getRequestedOpenCount(targetCount) {
  const fallback = Math.min(3, targetCount);
  const inputValue = Number(generateOpenCountInput.value);
  const value = Math.round(Number.isFinite(inputValue) ? inputValue : fallback);
  const count = Math.max(0, Math.min(value, targetCount));
  generateOpenCountInput.value = String(count);
  return count;
}

function generateLevelAnimals(targetCount, area, targetOpenCount = null) {
  let best = null;
  for (let attempt = 0; attempt < GENERATOR_ATTEMPTS; attempt += 1) {
    const animals = seedGeneratedAnimals(targetCount, area);
    if (animals.length !== targetCount) continue;
    repairGeneratedAnimals(animals, area, targetOpenCount);
    const validation = validateEditorLevelAnimals(animals, area);
    const score = getGenerationScore(validation, targetCount, targetOpenCount);
    if (!best || score < best.score) best = { animals: animals.map(stripAnimal), score, validation };
    if (isGenerationGood(validation, targetCount, targetOpenCount)) return animals.map(stripAnimal);
  }
  if (best && isGenerationGood(best.validation, targetCount, targetOpenCount)) return best.animals;
  return null;
}

function seedGeneratedAnimals(targetCount, area) {
  const animals = [];
  const center = {
    x: area.x + area.cols / 2,
    y: area.y + area.rows / 2,
  };
  const candidates = buildPlacementCandidates(area).sort((first, second) => {
    const firstDistance = getNormalizedCenterDistance(first, center, area);
    const secondDistance = getNormalizedCenterDistance(second, center, area);
    return firstDistance + Math.random() * 0.55 - (secondDistance + Math.random() * 0.55);
  });

  let misses = 0;
  while (animals.length < targetCount && misses < candidates.length * 8) {
    const candidate = weightedPickCandidate(candidates, animals.length, targetCount, center, area);
    const animal = {
      ...candidate,
      id: `gen-${animals.length}-${Date.now()}-${Math.round(Math.random() * 100000)}`,
      active: true,
    };
    if (canPlaceInList(animal, animals, null, area)) {
      animals.push(animal);
      misses = 0;
    } else {
      misses += 1;
    }
  }
  return animals;
}

function buildPlacementCandidates(area) {
  const candidates = [];
  for (let y = area.y; y < area.y + area.rows; y += 1) {
    for (let x = area.x; x < area.x + area.cols; x += 1) {
      DIRECTIONS.forEach((dir) => {
        const animal = { x, y, dir, id: "candidate", active: true };
        if (isAnimalOnValidCells(animal, area, getBoardOptions())) candidates.push({ x, y, dir });
      });
    }
  }
  return candidates;
}

function weightedPickCandidate(candidates, placedCount, targetCount, center, area) {
  const density = placedCount / Math.max(1, targetCount);
  let best = candidates[Math.floor(Math.random() * candidates.length)];
  let bestScore = -Infinity;
  const sampleCount = Math.min(38, candidates.length);
  for (let i = 0; i < sampleCount; i += 1) {
    const candidate = candidates[Math.floor(Math.random() * candidates.length)];
    const centerDistance = getNormalizedCenterDistance(candidate, center, area);
    const centerBias = getGenerationCenterBias(targetCount);
    const edgeBias = getGenerationEdgeBias(targetCount, density, centerDistance);
    const score = Math.random() + (1 - centerDistance) * centerBias + edgeBias;
    if (score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }
  return best;
}

function getGenerationCenterBias(targetCount) {
  if (targetCount <= 20) return 0.52;
  if (targetCount <= 28) return 0.44;
  if (targetCount <= 35) return 0.34;
  return 0.26;
}

function getGenerationEdgeBias(targetCount, density, centerDistance) {
  if (targetCount < 30 || density < 0.55) return 0;
  const strength = targetCount >= 38 ? 0.18 : 0.1;
  return centerDistance * strength;
}

function getNormalizedCenterDistance(candidate, center, area) {
  const dx = (candidate.x + 0.5 - center.x) / Math.max(1, area.cols / 2);
  const dy = (candidate.y + 0.5 - center.y) / Math.max(1, area.rows / 2);
  return Math.min(1, Math.hypot(dx, dy));
}

function repairGeneratedAnimals(animals, area, targetOpenCount = null) {
  for (let pass = 0; pass < GENERATOR_REPAIR_PASSES; pass += 1) {
    const validation = validateEditorLevelAnimals(animals, area);
    if (isGenerationGood(validation, animals.length, targetOpenCount)) return;

    const riskIds = getGenerationRiskIds(validation);
    if (riskIds.length === 0) {
      adjustOpenCount(animals, area, validation, targetOpenCount);
      continue;
    }

    const riskId = riskIds[Math.floor(Math.random() * riskIds.length)];
    improveGeneratedAnimal(animals, riskId, area, validation, targetOpenCount);
  }
}

function improveGeneratedAnimal(animals, animalId, area, currentValidation, targetOpenCount = null) {
  const animal = animals.find((item) => item.id === animalId);
  if (!animal) return false;
  const currentScore = getGenerationScore(currentValidation, animals.length, targetOpenCount);
  const options = getLocalGenerationOptions(animal, area).sort(() => Math.random() - 0.5);

  for (const option of options) {
    if (!canPlaceInList(option, animals, animal.id, area)) continue;
    const original = { x: animal.x, y: animal.y, dir: animal.dir };
    Object.assign(animal, { x: option.x, y: option.y, dir: option.dir });
    const score = getGenerationScore(validateEditorLevelAnimals(animals, area), animals.length, targetOpenCount);
    if (score <= currentScore) return true;
    Object.assign(animal, original);
  }
  return false;
}

function getLocalGenerationOptions(animal, area) {
  const options = [];
  DIRECTIONS.forEach((dir) => options.push({ ...animal, dir }));
  for (let radius = 1; radius <= 3; radius += 1) {
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
        DIRECTIONS.forEach((dir) => {
          options.push({ ...animal, x: animal.x + dx, y: animal.y + dy, dir });
        });
      }
    }
  }
  return options;
}

function adjustOpenCount(animals, area, validation, targetOpenCount = null) {
  const range = getTargetOpenRange(animals.length, targetOpenCount);
  if (validation.openCount >= range.min && validation.openCount <= range.max) return;
  const sourceIds =
    validation.openCount > range.max
      ? validation.openIds
      : animals.filter((animal) => !validation.openIds.includes(animal.id)).map((animal) => animal.id);
  const ids = sourceIds.length ? sourceIds : animals.map((animal) => animal.id);
  const targetId = ids[Math.floor(Math.random() * ids.length)];
  improveGeneratedAnimal(animals, targetId, area, validation, targetOpenCount);
}

function getGenerationRiskIds(validation) {
  return Array.from(new Set([
    ...validation.invalidIds,
    ...validation.overlapIds,
    ...validation.collisionIds,
    ...validation.compactDeadlockIds,
  ]));
}

function hasNoHardGenerationRisk(validation) {
  return (
    validation.invalidIds.size === 0 &&
    validation.overlapIds.size === 0 &&
    validation.collisionPairs.length === 0 &&
    validation.compactDeadlockCycles.length === 0
  );
}

function isGenerationGood(validation, targetCount, targetOpenCount = null) {
  if (!hasNoHardGenerationRisk(validation)) return false;
  const range = getTargetOpenRange(targetCount, targetOpenCount);
  if (validation.openCount < range.min || validation.openCount > range.max) return false;
  if (targetCount >= 24 && validation.longestChain < 3) return false;
  if (targetCount >= 55 && validation.longestChain < 4) return false;
  return true;
}

function getGenerationScore(validation, targetCount, targetOpenCount = null) {
  const range = getTargetOpenRange(targetCount, targetOpenCount);
  const hardRisk =
    validation.invalidIds.size +
    validation.overlapIds.size +
    validation.collisionPairs.length * 2 +
    validation.compactDeadlockCycles.length * 3;
  const openPenalty =
    validation.openCount < range.min
      ? range.min - validation.openCount
      : Math.max(0, validation.openCount - range.max);
  const chainTarget = targetCount >= 55 ? 4 : targetCount >= 24 ? 3 : 1;
  const chainPenalty = Math.max(0, chainTarget - validation.longestChain);
  return hardRisk * 1000 + openPenalty * 24 + chainPenalty * 18;
}

function getTargetOpenRange(targetCount, targetOpenCount = null) {
  if (Number.isFinite(targetOpenCount)) {
    const exact = Math.max(0, Math.min(Math.round(targetOpenCount), targetCount));
    return { min: exact, max: exact };
  }
  if (targetCount <= 8) return { min: 1, max: Math.max(2, targetCount) };
  return {
    min: Math.max(2, Math.floor(targetCount * 0.04)),
    max: Math.max(4, Math.ceil(targetCount * 0.18)),
  };
}

function saveCurrentLevelDraft() {
  if (editorState.demo) return;
  const level = editorState.levels[editorState.levelIndex];
  if (!level) return;
  Object.assign(level, {
    animalType: level.animalType ?? "pig",
    playArea: getCurrentPlayArea(),
    animals: editorState.animals.map(stripAnimal),
  });
}

function saveAllDrafts() {
  if (editorState.demo) {
    setTemporaryStatus("示例模式不会保存");
    return;
  }
  saveCurrentLevelDraft();
  window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(getNormalizedLevels()));
  editorState.source = "draft";
  setDirty(false);
  setTemporaryStatus("草稿已保存");
  updateSourceStatus();
}

function loadInitialLevels(fallbackLevels) {
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) {
      editorState.source = "official";
      return fallbackLevels.map(normalizeLevel);
    }
    const levels = JSON.parse(raw);
    if (Array.isArray(levels) && levels.length > 0) {
      editorState.source = "draft";
      return mergeDraftWithOfficialLevels(levels, fallbackLevels);
    }
    editorState.source = "official";
    return fallbackLevels.map(normalizeLevel);
  } catch (error) {
    editorState.source = "official";
    return fallbackLevels.map(normalizeLevel);
  }
}

function mergeDraftWithOfficialLevels(draftLevels, officialLevels) {
  const mergedLevels = draftLevels.map(normalizeLevel);
  if (mergedLevels.length >= officialLevels.length) return mergedLevels;

  const draftIds = new Set(mergedLevels.map((level) => level.id));
  officialLevels.forEach((level, index) => {
    if (index < mergedLevels.length || draftIds.has(level.id)) return;
    mergedLevels.push(normalizeLevel(level));
  });
  return mergedLevels;
}

function getSavedLevelIndex() {
  try {
    const savedIndex = Number(window.localStorage.getItem(SELECTED_LEVEL_STORAGE_KEY));
    if (Number.isInteger(savedIndex)) return savedIndex;
  } catch (error) {
    // 读取失败时回到第一关。
  }
  return 0;
}

function saveSelectedLevelIndex(index) {
  try {
    window.localStorage.setItem(SELECTED_LEVEL_STORAGE_KEY, String(index));
  } catch (error) {
    // 关卡位置记忆失败不影响编辑。
  }
}

function reloadOfficialLevels() {
  if (editorState.demo) {
    setTemporaryStatus("示例模式请关闭演示参数");
    return;
  }
  if (editorState.dirty && !window.confirm("当前关卡还没保存，确定重载正式关卡吗？")) return;
  window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  window.localStorage.removeItem(DEPLOYED_LEVELS_STORAGE_KEY);
  editorState.levels = editorState.officialLevels.map(normalizeLevel);
  editorState.source = "official";
  renderLevelOptions();
  loadLevel(Math.min(editorState.levelIndex, editorState.levels.length - 1));
  setTemporaryStatus("已重载正式关卡");
  updateSourceStatus();
}

function playtestCurrentLevels() {
  if (editorState.demo) {
    setTemporaryStatus("示例模式不会试玩");
    return;
  }
  saveCurrentLevelDraft();
  const levels = getNormalizedLevels();
  window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(levels));
  window.localStorage.setItem(DEPLOYED_LEVELS_STORAGE_KEY, JSON.stringify(levels));
  editorState.source = "draft";
  setDirty(false);
  setTemporaryStatus("已准备试玩");
  updateSourceStatus();
  saveSelectedLevelIndex(editorState.levelIndex);
  window.open(`./index.html?from=level-editor-preview&previewLevel=${editorState.levelIndex + 1}`, "_blank");
}

async function deployOfficialLevels() {
  if (editorState.demo) {
    setTemporaryStatus("示例模式不会部署");
    return;
  }
  saveCurrentLevelDraft();
  const levels = getNormalizedLevels();

  const deployed = await deployLevelsToLocalFile(levels);
  if (!deployed) return;

  window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  window.localStorage.removeItem(DEPLOYED_LEVELS_STORAGE_KEY);
  editorState.officialLevels = levels.map(normalizeLevel);
  editorState.levels = levels.map(normalizeLevel);
  editorState.source = "official";
  setDirty(false);
  setTemporaryStatus("已写入 levels.js");
  updateSourceStatus();
}

async function deployLevelsToLocalFile(levels) {
  try {
    const response = await fetch("./api/deploy-levels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ levels }),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.error || "部署失败");
    }
    return true;
  } catch (error) {
    setTemporaryStatus("部署失败：请用 8033 编辑器地址打开");
    return false;
  }
}

function exportForController() {
  saveCurrentLevelDraft();
  const level = normalizeLevel(editorState.levels[editorState.levelIndex]);
  const payload = {
    kind: "xiaozhukuaipao-level-export",
    exportedAt: new Date().toISOString(),
    level: {
      id: level.id,
      name: level.name,
      animalType: level.animalType,
      playArea: level.playArea,
      pigCount: level.animals.length,
      animals: level.animals,
    },
    check: getExportCheck(editorState.validation),
  };
  exportTextEl.value = JSON.stringify(payload, null, 2);
  exportTextEl.focus();
  exportTextEl.select();
}

async function copyExportText() {
  if (!exportTextEl.value.trim()) exportForController();
  try {
    await navigator.clipboard.writeText(exportTextEl.value);
    setTemporaryStatus("已复制");
  } catch (error) {
    exportTextEl.focus();
    exportTextEl.select();
    setTemporaryStatus("请手动复制");
  }
}

function normalizeLevel(level) {
  return {
    id: level.id,
    name: level.name,
    animalType: level.animalType ?? "pig",
    playArea: normalizePlayArea(level.playArea),
    animals: (level.animals ?? []).map(stripAnimal),
    ...(Array.isArray(level.starThresholds) ? { starThresholds: level.starThresholds } : {}),
  };
}

function isDeadlockDemoMode() {
  return new URLSearchParams(window.location.search).get("demo") === "deadlock";
}

function createDeadlockDemoLevel() {
  return normalizeLevel({
    id: "demo-deadlock",
    name: "闭环死局示例",
    animalType: "pig",
    playArea: getDefaultPlayArea(),
    animals: [
      { x: 3, y: 4, dir: "right" },
      { x: 5, y: 4, dir: "down" },
      { x: 5, y: 6, dir: "left" },
      { x: 3, y: 6, dir: "up" },
    ],
    starThresholds: [0, 1, 2],
  });
}

function updateDemoControls() {
  if (!editorState.demo) return;
  [
    generateCurrentBtn,
    newLevelBtn,
    saveDraftBtn,
    reloadOfficialBtn,
    playtestBtn,
    deployOfficialBtn,
    clearLevelBtn,
  ].forEach((button) => {
    button.disabled = true;
  });
}

function createBlankEditorLevels(sourceLevels) {
  const levels = sourceLevels.length > 0 ? sourceLevels : [{ id: 1, name: "第1关" }];
  return levels.map((level, index) => ({
    id: level.id ?? index + 1,
    name: level.name ?? `第${index + 1}关`,
    animalType: level.animalType ?? "pig",
    playArea: getDefaultPlayArea(),
    animals: [],
  }));
}

function normalizePlayArea(area) {
  if (!area) return getDefaultPlayArea();
  if (area.cols !== editorState.board.cols || area.rows !== editorState.board.rows) {
    return getDefaultPlayArea();
  }
  return {
    x: area.x ?? 0,
    y: area.y ?? 0,
    cols: area.cols,
    rows: area.rows,
  };
}

function getNormalizedLevels() {
  return editorState.levels.map(normalizeLevel);
}

function stripAnimal(animal) {
  return {
    x: animal.x,
    y: animal.y,
    dir: animal.dir,
    ...(animal.type ? { type: animal.type } : {}),
  };
}

function validateEditorLevelAnimals(animals, area) {
  const validation = validateBoardLevelAnimals(animals, area, getBoardOptions());
  const compactDeadlockCycles = getCompactDeadlockCycles(validation, animals);
  validation.compactDeadlockCycles = compactDeadlockCycles;
  validation.compactDeadlockIds = new Set(compactDeadlockCycles.flatMap((cycle) => cycle.ids));
  return validation;
}

function getCompactDeadlockCycles(validation, animals) {
  const animalById = new Map(animals.map((animal) => [animal.id, animal]));
  return validation.deadlockCycles.filter((cycle) => {
    if (cycle.ids.length !== 4) return false;
    const cycleAnimals = cycle.ids.map((id) => animalById.get(id));
    if (cycleAnimals.some((animal) => !animal)) return false;
    const dirs = new Set(cycleAnimals.map((animal) => animal.dir));
    if (!DIRECTIONS.every((dir) => dirs.has(dir))) return false;
    const cycleIds = new Set(cycle.ids);
    return cycle.ids.every((id) => {
      const edge = validation.blockGraph.get(id);
      return edge && cycleIds.has(edge.blockerId) && edge.openCells <= 1;
    });
  });
}

function getValidationIssues(validation, density) {
  const issues = [];
  if (validation.invalidIds.size > 0) {
    issues.push({ level: "danger", text: `非法格：${validation.invalidIds.size} 只占到不可用格或棋盘外` });
  }
  if (validation.overlapIds.size > 0) {
    issues.push({ level: "danger", text: `重叠：${validation.overlapIds.size} 只脚印重叠` });
  }
  if (validation.collisionPairs.length > 0) {
    issues.push({ level: "danger", text: `对撞风险：${validation.collisionPairs.length} 组面对面互堵` });
  }
  if (validation.compactDeadlockCycles.length > 0) {
    issues.push({ level: "danger", text: `环形死局：${validation.compactDeadlockCycles.length} 个四猪闭环` });
  }
  if (validation.total > 8 && validation.openCount > Math.max(5, Math.ceil(validation.total * 0.22))) {
    issues.push({ level: "warning", text: "开局可逃数量偏多，可能太松" });
  }
  if (validation.total > 8 && validation.openCount <= 1) {
    issues.push({ level: "warning", text: "开局可操作空间偏少，可能太堵" });
  }
  if (density > 78) {
    issues.push({ level: "warning", text: "密度很高，手机编辑时注意重叠风险" });
  }
  return issues;
}

function getExportCheck(validation) {
  return {
    pigCount: validation.total,
    initialOpenCount: validation.openCount,
    invalidCount: validation.invalidIds.size,
    overlapCount: validation.overlapIds.size,
    collisionRiskCount: validation.collisionPairs.length,
    opposingRiskCount: validation.collisionPairs.length,
    compactDeadlockCount: validation.compactDeadlockCycles.length,
    longestChain: validation.longestChain,
  };
}

function getDifficultyHint(validation, density) {
  const hardRiskCount =
    validation.invalidIds.size +
    validation.overlapIds.size +
    validation.collisionPairs.length +
    validation.compactDeadlockCycles.length;
  if (hardRiskCount > 0) return "风险较高";
  if (validation.total > 8 && validation.openCount <= 1) return "偏堵";
  if (validation.total > 8 && validation.openCount > Math.ceil(validation.total * 0.22)) return "偏简单";
  if (density > 72) return "偏密";
  return "正常";
}

function getDensityPercent(total) {
  const playable = getPlayableCellCount(getCurrentPlayArea(), getBoardOptions());
  if (playable === 0) return 0;
  return Math.round((total * 2 * 100) / playable);
}

function getDirectionCounts(animals) {
  return animals.reduce(
    (counts, animal) => {
      counts[animal.dir] += 1;
      return counts;
    },
    { up: 0, right: 0, down: 0, left: 0 },
  );
}

function canPlace(animal, ignoreId = null) {
  const area = getCurrentPlayArea();
  if (!isAnimalOnValidCells(animal, area, getBoardOptions())) return false;
  return editorState.animals
    .filter((item) => item.id !== ignoreId)
    .every((item) => !getFootprint(animal).some((cell) =>
      getFootprint(item).some((other) => other.x === cell.x && other.y === cell.y),
    ));
}

function canPlaceInList(animal, animals, ignoreId, area) {
  if (!isAnimalOnValidCells(animal, area, getBoardOptions())) return false;
  const cells = getFootprint(animal);
  return animals
    .filter((item) => item.id !== ignoreId)
    .every((item) => !cells.some((cell) =>
      getFootprint(item).some((other) => other.x === cell.x && other.y === cell.y),
    ));
}

function getPigRiskClass(animal) {
  const validation = editorState.validation;
  const classes = [];
  if (validation?.invalidIds.has(animal.id)) classes.push("is-invalid-risk");
  if (validation?.overlapIds.has(animal.id)) classes.push("is-overlap-risk");
  if (validation?.collisionIds.has(animal.id)) classes.push("is-collision-risk");
  if (validation?.compactDeadlockIds.has(animal.id)) classes.push("is-compact-deadlock-risk");
  return classes.length ? ` ${classes.join(" ")}` : "";
}

function setDirty(isDirty) {
  editorState.dirty = isDirty;
  statusEl.textContent = isDirty ? "未保存" : "已同步";
  statusEl.classList.toggle("is-dirty", isDirty);
  statusEl.classList.toggle("is-saved", !isDirty);
  updateSourceStatus();
}

function setTemporaryStatus(message) {
  const previous = editorState.dirty ? "未保存" : "已同步";
  statusEl.textContent = message;
  window.setTimeout(() => {
    statusEl.textContent = previous;
  }, 1200);
}

function updateSourceStatus() {
  const sourceText = {
    draft: "本机草稿",
    official: "本机正式",
    template: "10×16 空白模板",
    demo: "闭环死局示例",
  }[editorState.source] ?? "正式关卡";
  sourceStatusEl.textContent = `来源：${sourceText}`;
  sourceStatusEl.classList.toggle("is-draft", editorState.source === "draft");
  sourceStatusEl.classList.toggle("is-deployed", editorState.source !== "draft");
}

function findAnimalById(id) {
  if (!id) return null;
  return editorState.animals.find((animal) => animal.id === id) ?? null;
}

function findAnimalAtCell(x, y) {
  return editorState.animals.find((animal) =>
    getFootprint(animal).some((cell) => cell.x === x && cell.y === y),
  );
}

function getCurrentPlayArea() {
  return editorState.levels[editorState.levelIndex]?.playArea ?? getDefaultPlayArea();
}

function getDefaultPlayArea() {
  return {
    x: 0,
    y: 0,
    cols: editorState.board.cols,
    rows: editorState.board.rows,
  };
}

function getBoardOptions() {
  return {
    board: editorState.board,
    cornerCutout: editorState.cornerCutout,
    dirs: editorState.dirs,
  };
}
