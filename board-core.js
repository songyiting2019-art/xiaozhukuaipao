(function () {
  const DIRS = {
    up: { dx: 0, dy: -1, rot: "0deg", label: "上" },
    right: { dx: 1, dy: 0, rot: "90deg", label: "右" },
    down: { dx: 0, dy: 1, rot: "180deg", label: "下" },
    left: { dx: -1, dy: 0, rot: "270deg", label: "左" },
  };

  const OPPOSITE_DIRS = {
    up: "down",
    right: "left",
    down: "up",
    left: "right",
  };

  const DIRECTIONS = Object.keys(DIRS);

  const BOARD = {
    cols: 10,
    rows: 16,
  };

  const CORNER_CUTOUT = {
    arcStartCell: 2,
  };

  function getDefaultPlayArea(board = BOARD) {
    return {
      x: 0,
      y: 0,
      cols: board.cols,
      rows: board.rows,
    };
  }

  function getFootprint(animal, dirs = DIRS) {
    const dir = dirs[animal.dir];
    if (!dir) return [];
    return [
      { x: animal.x, y: animal.y },
      { x: animal.x - dir.dx, y: animal.y - dir.dy },
    ];
  }

  function getAnimalCenter(animal, dirs = DIRS) {
    const cells = getFootprint(animal, dirs);
    return {
      x: cells.reduce((sum, cell) => sum + cell.x + 0.5, 0) / cells.length,
      y: cells.reduce((sum, cell) => sum + cell.y + 0.5, 0) / cells.length,
    };
  }

  function isCellInsideArea(x, y, area) {
    return x >= area.x && x < area.x + area.cols && y >= area.y && y < area.y + area.rows;
  }

  function isInsideBoardCell(x, y, board = BOARD) {
    return x >= 0 && x < board.cols && y >= 0 && y < board.rows;
  }

  function isCornerCutoutCell(x, y, board = BOARD, cornerCutout = CORNER_CUTOUT) {
    const arcStart = cornerCutout?.arcStartCell;
    if (!arcStart) return false;

    const left = x < arcStart;
    const right = x >= board.cols - arcStart;
    const top = y < arcStart;
    const bottom = y >= board.rows - arcStart;
    if (!(left || right) || !(top || bottom)) return false;

    const centerX = left ? arcStart : board.cols - arcStart;
    const centerY = top ? arcStart : board.rows - arcStart;
    const farthestX = left ? x : x + 1;
    const farthestY = top ? y : y + 1;
    return Math.hypot(farthestX - centerX, farthestY - centerY) > arcStart;
  }

  function isPlayableCell(x, y, board = BOARD, cornerCutout = CORNER_CUTOUT) {
    return isInsideBoardCell(x, y, board) && !isCornerCutoutCell(x, y, board, cornerCutout);
  }

  function isAnimalOnPlayableCells(animal, options = {}) {
    const board = options.board ?? BOARD;
    const cornerCutout = options.cornerCutout ?? CORNER_CUTOUT;
    return getFootprint(animal, options.dirs ?? DIRS).every((cell) =>
      isPlayableCell(cell.x, cell.y, board, cornerCutout),
    );
  }

  function isAnimalOnValidCells(animal, area, options = {}) {
    const board = options.board ?? BOARD;
    const cornerCutout = options.cornerCutout ?? CORNER_CUTOUT;
    return getFootprint(animal, options.dirs ?? DIRS).every((cell) =>
      isCellInsideArea(cell.x, cell.y, area) &&
      isPlayableCell(cell.x, cell.y, board, cornerCutout),
    );
  }

  function getPlayableCellCount(area, options = {}) {
    const board = options.board ?? BOARD;
    const cornerCutout = options.cornerCutout ?? CORNER_CUTOUT;
    let count = 0;
    for (let y = area.y; y < area.y + area.rows; y += 1) {
      for (let x = area.x; x < area.x + area.cols; x += 1) {
        if (isPlayableCell(x, y, board, cornerCutout)) count += 1;
      }
    }
    return count;
  }

  function getCellKey(cell) {
    return `${cell.x},${cell.y}`;
  }

  function buildCellOccupancy(animals, options = {}) {
    const occupancy = new Map();
    const excludedAnimal = options.excludedAnimal ?? null;
    animals.forEach((animal) => {
      if (options.activeOnly && animal.active === false) return;
      if (excludedAnimal && isSameAnimal(animal, excludedAnimal)) return;
      getFootprint(animal, options.dirs ?? DIRS).forEach((cell) => {
        const key = getCellKey(cell);
        if (!occupancy.has(key)) occupancy.set(key, []);
        occupancy.get(key).push(animal.id ?? animal.index ?? animal);
      });
    });
    return occupancy;
  }

  function validateLevelAnimals(animals, area, options = {}) {
    const activeAnimals = animals.filter((animal) => animal.active !== false);
    const invalidIds = new Set();
    const overlapIds = new Set();
    const cellOccupancy = new Map();

    activeAnimals.forEach((animal) => {
      if (!isAnimalOnValidCells(animal, area, options)) invalidIds.add(animal.id);
      getFootprint(animal, options.dirs ?? DIRS).forEach((cell) => {
        const key = getCellKey(cell);
        if (!cellOccupancy.has(key)) cellOccupancy.set(key, []);
        cellOccupancy.get(key).push(animal.id);
      });
    });

    cellOccupancy.forEach((ids) => {
      const uniqueIds = Array.from(new Set(ids));
      if (uniqueIds.length > 1) uniqueIds.forEach((id) => overlapIds.add(id));
    });

    const blockGraph = getImmediateBlockGraph(activeAnimals, area, cellOccupancy, options);
    const collisionPairs = getOpposingCollisionPairs(activeAnimals, blockGraph);
    const collisionIds = new Set(collisionPairs.flatMap((pair) => [pair.firstId, pair.secondId]));
    const deadlockCycles = getDeadlockCycles(blockGraph);
    const deadlockIds = new Set(deadlockCycles.flatMap((cycle) => cycle.ids));
    const openIds = activeAnimals
      .filter((animal) => blockGraph.get(animal.id)?.blockerId === null)
      .map((animal) => animal.id);
    const longestChain = getLongestBlockChain(blockGraph);

    return {
      total: activeAnimals.length,
      invalidIds,
      overlapIds,
      collisionIds,
      collisionPairs,
      deadlockIds,
      deadlockCycles,
      openIds,
      openCount: openIds.length,
      longestChain,
      blockGraph,
    };
  }

  function getImmediateBlockGraph(animals, area, cellOccupancy, options = {}) {
    const graph = new Map();
    animals.forEach((animal) => {
      const blocker = findImmediateBlocker(animals, animal, area, cellOccupancy, options);
      graph.set(animal.id, {
        blockerId: blocker?.id ?? null,
        openCells: blocker?.openCells ?? null,
      });
    });
    return graph;
  }

  function findImmediateBlocker(animals, animal, area, cellOccupancy, options = {}) {
    if (!isAnimalOnValidCells(animal, area, options)) return null;
    const dirs = options.dirs ?? DIRS;
    const dir = dirs[animal.dir];
    const board = options.board ?? BOARD;
    const maxSteps = board.cols + board.rows + 4;
    for (let step = 1; step <= maxSteps; step += 1) {
      const movedAnimal = {
        ...animal,
        x: animal.x + dir.dx * step,
        y: animal.y + dir.dy * step,
      };
      if (!isAnimalOnValidCells(movedAnimal, area, options)) return null;
      const headCell = {
        x: animal.x + dir.dx * step,
        y: animal.y + dir.dy * step,
      };
      const blockerId = (cellOccupancy.get(getCellKey(headCell)) ?? []).find((id) => id !== animal.id);
      if (blockerId) {
        const blocker = animals.find((item) => item.id === blockerId);
        return blocker ? { ...blocker, openCells: step - 1 } : null;
      }
    }
    return null;
  }

  function getOpposingCollisionPairs(animals, blockGraph) {
    const animalById = new Map(animals.map((animal) => [animal.id, animal]));
    const pairs = [];
    const seen = new Set();
    animals.forEach((animal) => {
      const blockerId = blockGraph.get(animal.id)?.blockerId;
      if (!blockerId) return;
      if (blockGraph.get(blockerId)?.blockerId !== animal.id) return;
      const blocker = animalById.get(blockerId);
      if (!blocker || !isOpposingLanePair(animal, blocker)) return;
      const key = [animal.id, blockerId].sort().join("|");
      if (seen.has(key)) return;
      seen.add(key);
      pairs.push({ firstId: animal.id, secondId: blockerId });
    });
    return pairs;
  }

  function getDeadlockCycles(blockGraph) {
    const cycles = [];
    const seenCycles = new Set();
    Array.from(blockGraph.keys()).forEach((startId) => {
      const path = [];
      const pathIndex = new Map();
      let currentId = startId;
      while (currentId && blockGraph.has(currentId)) {
        if (pathIndex.has(currentId)) {
          const cycleIds = path.slice(pathIndex.get(currentId));
          if (cycleIds.length > 1) {
            const key = [...cycleIds].sort().join("|");
            if (!seenCycles.has(key)) {
              seenCycles.add(key);
              cycles.push({ ids: cycleIds });
            }
          }
          break;
        }
        pathIndex.set(currentId, path.length);
        path.push(currentId);
        currentId = blockGraph.get(currentId)?.blockerId ?? null;
      }
    });
    return cycles;
  }

  function getLongestBlockChain(blockGraph) {
    let longest = 0;
    Array.from(blockGraph.keys()).forEach((startId) => {
      const seen = new Set();
      let currentId = startId;
      let length = 0;
      while (currentId && blockGraph.has(currentId) && !seen.has(currentId)) {
        seen.add(currentId);
        currentId = blockGraph.get(currentId)?.blockerId ?? null;
        if (currentId) length += 1;
      }
      longest = Math.max(longest, length);
    });
    return longest;
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

  function isSameAnimal(first, second) {
    if (!first || !second) return false;
    if (first.index !== undefined && second.index !== undefined) {
      return first.index === second.index;
    }
    if (first.id !== undefined && second.id !== undefined) return first.id === second.id;
    return first === second;
  }

  window.PigEscapeBoardCore = {
    DIRS,
    OPPOSITE_DIRS,
    DIRECTIONS,
    BOARD,
    CORNER_CUTOUT,
    getDefaultPlayArea,
    getFootprint,
    getAnimalCenter,
    isCellInsideArea,
    isInsideBoardCell,
    isCornerCutoutCell,
    isPlayableCell,
    isAnimalOnPlayableCells,
    isAnimalOnValidCells,
    getPlayableCellCount,
    getCellKey,
    buildCellOccupancy,
    validateLevelAnimals,
    getImmediateBlockGraph,
    findImmediateBlocker,
    getOpposingCollisionPairs,
    getDeadlockCycles,
    getLongestBlockChain,
    isOpposingLanePair,
    isSameAnimal,
  };
})();
