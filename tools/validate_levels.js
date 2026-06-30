const fs = require("fs");
const vm = require("vm");

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync("board-core.js", "utf8"), sandbox);
vm.runInNewContext(fs.readFileSync("levels.js", "utf8"), sandbox);

const core = sandbox.window.PigEscapeBoardCore;
const levels = sandbox.window.PIG_ESCAPE_LEVELS;
const issues = [];

function countMap(value) {
  return Object.keys(value || {}).length;
}

function canEscape(animals, animal, playArea) {
  const dir = core.DIRS[animal.dir];
  const occupancy = core.buildCellOccupancy(animals, { excludeAnimal: animal });
  let head = { x: animal.x, y: animal.y };

  for (let step = 0; step < 40; step += 1) {
    head = { x: head.x + dir.dx, y: head.y + dir.dy };
    if (!core.isCellInsideArea(head.x, head.y, playArea)) return true;
    if (!core.isPlayableCell(head.x, head.y)) return true;
    if (occupancy.has(core.getCellKey(head.x, head.y))) return false;
  }

  return false;
}

function simulateClear(level) {
  let animals = level.animals.map((animal, index) => ({ ...animal, index }));
  let cleared = 0;

  for (let guard = 0; guard < 500; guard += 1) {
    const nextAnimal = animals.find((animal) => canEscape(animals, animal, level.playArea));
    if (!nextAnimal) break;
    animals = animals.filter((animal) => animal !== nextAnimal);
    cleared += 1;
  }

  return {
    cleared,
    remaining: animals.length,
    solvable: animals.length === 0,
  };
}

if (!core) issues.push("Missing PigEscapeBoardCore.");
if (!Array.isArray(levels)) issues.push("Missing PIG_ESCAPE_LEVELS.");

if (core && (core.BOARD.cols !== 10 || core.BOARD.rows !== 16)) {
  issues.push(`Board should be 10x16, got ${core.BOARD.cols}x${core.BOARD.rows}.`);
}

if (Array.isArray(levels) && levels.length !== 15) {
  issues.push(`Expected 15 levels, got ${levels.length}.`);
}

if (core && Array.isArray(levels)) {
  for (const level of levels) {
    const validation = core.validateLevelAnimals(level.animals, { playArea: level.playArea });
    const simulation = simulateClear(level);
    const thresholds = level.starThresholds;

    if (
      countMap(validation.invalidIds) ||
      countMap(validation.overlapIds) ||
      countMap(validation.collisionIds) ||
      countMap(validation.deadlockIds)
    ) {
      issues.push(
        `Level ${level.id}: invalid=${countMap(validation.invalidIds)}, overlap=${countMap(
          validation.overlapIds,
        )}, collision=${countMap(validation.collisionIds)}, deadlock=${countMap(validation.deadlockIds)}.`,
      );
    }

    if (!simulation.solvable) {
      issues.push(`Level ${level.id}: cannot be cleared, ${simulation.cleared}/${level.animals.length} escaped.`);
    }

    if (!thresholds || thresholds.length !== 3 || thresholds[0] !== 0 || thresholds[1] >= thresholds[2]) {
      issues.push(`Level ${level.id}: starThresholds should be [0, twoStar, threeStar].`);
    }

    if (level.playArea.cols !== 10 || level.playArea.rows !== 16) {
      issues.push(`Level ${level.id}: playArea should be 10x16.`);
    }
  }
}

if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}

console.log(`OK ${levels.length} levels on ${core.BOARD.cols}x${core.BOARD.rows}`);
console.log(levels.map((level) => `L${level.id}:${level.animals.length}`).join(" "));
