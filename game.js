const DIRS = {
  up: { dx: 0, dy: -1, rot: "0deg", label: "上" },
  right: { dx: 1, dy: 0, rot: "90deg", label: "右" },
  down: { dx: 0, dy: 1, rot: "180deg", label: "下" },
  left: { dx: -1, dy: 0, rot: "270deg", label: "左" },
};

const ANIMAL_TYPES = {
  pig: {
    className: "animal-pig",
    moveMsPerCell: 115,
    crashMoveMsPerCell: 170,
    crashBumpMs: 160,
    stunMs: 620,
    trailColor: "rgba(241, 218, 178, 0.82)",
    burstColor: "rgba(255, 255, 255, 0.86)",
    stunColor: "#ffe76a",
    trailEveryCells: 0.55,
  },
};

const MOVE_EASING = {
  run: "cubic-bezier(0.16, 0.92, 0.24, 1)",
  crashTravel: "cubic-bezier(0.2, 0.78, 0.24, 1)",
  crashBump: "cubic-bezier(0.16, 0.88, 0.24, 1.12)",
  crashSettle: "cubic-bezier(0.34, 0, 0.22, 1)",
};

const BOARD = {
  cols: 12,
  rows: 19,
};

const CORNER_CUTOUT = {
  arcStartCell: 2,
};

const SCORE_RULES = {
  exitBase: 100,
  comboBonus: 50,
  removeScore: 0,
};

const STAR_RULES = {
  twoStarAverageCombo: 16,
  roundTo: 50,
};

const PROGRESS_STORAGE_KEY = "pigEscapeLevelProgressV1";
const DEFAULT_LEVEL_INDEX = 0;

const LEVELS = [
  {
    id: 1,
    name: "第1关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      {
        x: 5,
        y: 4,
        dir: "down"
      },
      {
        x: 3,
        y: 10,
        dir: "right"
      },
      {
        x: 5,
        y: 7,
        dir: "down"
      },
      {
        x: 8,
        y: 13,
        dir: "down"
      },
      {
        x: 5,
        y: 10,
        dir: "down"
      },
      {
        x: 7,
        y: 14,
        dir: "down"
      },
      {
        x: 6,
        y: 10,
        dir: "down"
      },
      {
        x: 4,
        y: 14,
        dir: "right"
      },
      {
        x: 3,
        y: 6,
        dir: "down"
      },
      {
        x: 9,
        y: 12,
        dir: "down"
      },
      {
        x: 7,
        y: 11,
        dir: "right"
      },
      {
        x: 4,
        y: 11,
        dir: "right"
      },
      {
        x: 4,
        y: 9,
        dir: "down"
      },
      {
        x: 3,
        y: 13,
        dir: "down"
      },
      {
        x: 7,
        y: 8,
        dir: "right"
      },
      {
        x: 4,
        y: 5,
        dir: "down"
      },
      {
        x: 6,
        y: 5,
        dir: "down"
      },
      {
        x: 2,
        y: 7,
        dir: "left"
      },
      {
        x: 9,
        y: 4,
        dir: "left"
      },
      {
        x: 9,
        y: 9,
        dir: "down"
      },
      {
        x: 5,
        y: 13,
        dir: "down"
      },
      {
        x: 10,
        y: 6,
        dir: "left"
      },
      {
        x: 8,
        y: 10,
        dir: "up"
      },
      {
        x: 3,
        y: 9,
        dir: "down"
      },
      {
        x: 4,
        y: 13,
        dir: "down"
      },
      {
        x: 8,
        y: 9,
        dir: "right"
      },
      {
        x: 9,
        y: 7,
        dir: "right"
      },
      {
        x: 7,
        y: 12,
        dir: "right"
      },
      {
        x: 6,
        y: 14,
        dir: "right"
      },
      {
        x: 2,
        y: 11,
        dir: "up"
      }
    ]
  },
  {
    id: 15,
    name: "第2关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      {
        x: 2,
        y: 11,
        dir: "up"
      },
      {
        x: 9,
        y: 8,
        dir: "left"
      },
      {
        x: 9,
        y: 12,
        dir: "left"
      },
      {
        x: 10,
        y: 15,
        dir: "left"
      },
      {
        x: 1,
        y: 13,
        dir: "up"
      },
      {
        x: 10,
        y: 6,
        dir: "up"
      },
      {
        x: 9,
        y: 2,
        dir: "up"
      },
      {
        x: 2,
        y: 7,
        dir: "left"
      },
      {
        x: 1,
        y: 4,
        dir: "left"
      },
      {
        x: 10,
        y: 16,
        dir: "up"
      },
      {
        x: 5,
        y: 5,
        dir: "up"
      },
      {
        x: 2,
        y: 2,
        dir: "left"
      },
      {
        x: 8,
        y: 9,
        dir: "left"
      },
      {
        x: 1,
        y: 8,
        dir: "left"
      },
      {
        x: 4,
        y: 2,
        dir: "left"
      },
      {
        x: 10,
        y: 5,
        dir: "left"
      },
      {
        x: 2,
        y: 6,
        dir: "left"
      },
      {
        x: 10,
        y: 10,
        dir: "left"
      },
      {
        x: 8,
        y: 15,
        dir: "left"
      },
      {
        x: 1,
        y: 9,
        dir: "up"
      },
      {
        x: 6,
        y: 13,
        dir: "left"
      },
      {
        x: 6,
        y: 9,
        dir: "up"
      },
      {
        x: 9,
        y: 13,
        dir: "up"
      },
      {
        x: 5,
        y: 16,
        dir: "up"
      },
      {
        x: 9,
        y: 6,
        dir: "up"
      },
      {
        x: 10,
        y: 11,
        dir: "right"
      },
      {
        x: 1,
        y: 3,
        dir: "right"
      },
      {
        x: 4,
        y: 15,
        dir: "up"
      },
      {
        x: 2,
        y: 15,
        dir: "left"
      },
      {
        x: 8,
        y: 10,
        dir: "left"
      },
      {
        x: 3,
        y: 8,
        dir: "up"
      },
      {
        x: 3,
        y: 14,
        dir: "left"
      },
      {
        x: 3,
        y: 10,
        dir: "left"
      },
      {
        x: 0,
        y: 15,
        dir: "down"
      },
      {
        x: 6,
        y: 6,
        dir: "left"
      },
      {
        x: 0,
        y: 6,
        dir: "down"
      },
      {
        x: 7,
        y: 15,
        dir: "up"
      },
      {
        x: 1,
        y: 11,
        dir: "up"
      },
      {
        x: 3,
        y: 12,
        dir: "down"
      },
      {
        x: 9,
        y: 18,
        dir: "right"
      }
    ]
  },
  {
    id: 12,
    name: "第3关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      {
        x: 2,
        y: 14,
        dir: "down"
      },
      {
        x: 0,
        y: 8,
        dir: "left"
      },
      {
        x: 0,
        y: 16,
        dir: "left"
      },
      {
        x: 6,
        y: 18,
        dir: "down"
      },
      {
        x: 0,
        y: 12,
        dir: "left"
      },
      {
        x: 3,
        y: 5,
        dir: "left"
      },
      {
        x: 11,
        y: 5,
        dir: "down"
      },
      {
        x: 9,
        y: 3,
        dir: "left"
      },
      {
        x: 2,
        y: 2,
        dir: "left"
      },
      {
        x: 7,
        y: 17,
        dir: "down"
      },
      {
        x: 1,
        y: 11,
        dir: "down"
      },
      {
        x: 7,
        y: 5,
        dir: "left"
      },
      {
        x: 3,
        y: 17,
        dir: "down"
      },
      {
        x: 10,
        y: 14,
        dir: "down"
      },
      {
        x: 9,
        y: 15,
        dir: "left"
      },
      {
        x: 6,
        y: 14,
        dir: "down"
      },
      {
        x: 8,
        y: 0,
        dir: "left"
      },
      {
        x: 4,
        y: 4,
        dir: "left"
      },
      {
        x: 10,
        y: 10,
        dir: "down"
      },
      {
        x: 2,
        y: 6,
        dir: "left"
      },
      {
        x: 5,
        y: 15,
        dir: "left"
      },
      {
        x: 2,
        y: 10,
        dir: "down"
      },
      {
        x: 8,
        y: 4,
        dir: "left"
      },
      {
        x: 1,
        y: 7,
        dir: "left"
      },
      {
        x: 3,
        y: 1,
        dir: "down"
      },
      {
        x: 1,
        y: 15,
        dir: "down"
      },
      {
        x: 10,
        y: 6,
        dir: "left"
      },
      {
        x: 9,
        y: 11,
        dir: "down"
      },
      {
        x: 9,
        y: 7,
        dir: "left"
      },
      {
        x: 6,
        y: 2,
        dir: "left"
      },
      {
        x: 3,
        y: 13,
        dir: "down"
      },
      {
        x: 7,
        y: 13,
        dir: "left"
      },
      {
        x: 7,
        y: 1,
        dir: "down"
      },
      {
        x: 4,
        y: 0,
        dir: "left"
      },
      {
        x: 0,
        y: 14,
        dir: "down"
      },
      {
        x: 9,
        y: 9,
        dir: "down"
      },
      {
        x: 3,
        y: 14,
        dir: "left"
      },
      {
        x: 7,
        y: 4,
        dir: "down"
      },
      {
        x: 0,
        y: 7,
        dir: "down"
      },
      {
        x: 10,
        y: 12,
        dir: "down"
      },
      {
        x: 5,
        y: 7,
        dir: "down"
      },
      {
        x: 0,
        y: 10,
        dir: "down"
      },
      {
        x: 5,
        y: 3,
        dir: "left"
      },
      {
        x: 4,
        y: 13,
        dir: "down"
      },
      {
        x: 2,
        y: 5,
        dir: "down"
      },
      {
        x: 8,
        y: 3,
        dir: "down"
      },
      {
        x: 5,
        y: 2,
        dir: "down"
      },
      {
        x: 5,
        y: 13,
        dir: "down"
      },
      {
        x: 4,
        y: 2,
        dir: "down"
      },
      {
        x: 9,
        y: 5,
        dir: "left"
      },
      {
        x: 9,
        y: 14,
        dir: "down"
      },
      {
        x: 3,
        y: 4,
        dir: "down"
      },
      {
        x: 7,
        y: 9,
        dir: "down"
      },
      {
        x: 6,
        y: 10,
        dir: "down"
      }
    ]
  },
  {
    id: 14,
    name: "第4关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      {
        x: 9,
        y: 15,
        dir: "right"
      },
      {
        x: 3,
        y: 14,
        dir: "right"
      },
      {
        x: 9,
        y: 16,
        dir: "right"
      },
      {
        x: 6,
        y: 16,
        dir: "up"
      },
      {
        x: 3,
        y: 8,
        dir: "up"
      },
      {
        x: 8,
        y: 9,
        dir: "right"
      },
      {
        x: 7,
        y: 13,
        dir: "right"
      },
      {
        x: 6,
        y: 5,
        dir: "right"
      },
      {
        x: 4,
        y: 10,
        dir: "up"
      },
      {
        x: 3,
        y: 5,
        dir: "right"
      },
      {
        x: 6,
        y: 4,
        dir: "right"
      },
      {
        x: 9,
        y: 9,
        dir: "up"
      },
      {
        x: 5,
        y: 10,
        dir: "up"
      },
      {
        x: 4,
        y: 4,
        dir: "right"
      },
      {
        x: 8,
        y: 10,
        dir: "up"
      },
      {
        x: 8,
        y: 5,
        dir: "right"
      },
      {
        x: 7,
        y: 10,
        dir: "up"
      },
      {
        x: 5,
        y: 16,
        dir: "right"
      },
      {
        x: 4,
        y: 13,
        dir: "right"
      },
      {
        x: 7,
        y: 3,
        dir: "up"
      },
      {
        x: 6,
        y: 8,
        dir: "right"
      },
      {
        x: 8,
        y: 13,
        dir: "up"
      },
      {
        x: 5,
        y: 3,
        dir: "right"
      },
      {
        x: 9,
        y: 3,
        dir: "up"
      },
      {
        x: 5,
        y: 9,
        dir: "right"
      },
      {
        x: 2,
        y: 2,
        dir: "up"
      },
      {
        x: 8,
        y: 3,
        dir: "up"
      },
      {
        x: 2,
        y: 10,
        dir: "right"
      },
      {
        x: 6,
        y: 10,
        dir: "up"
      },
      {
        x: 1,
        y: 15,
        dir: "right"
      },
      {
        x: 2,
        y: 9,
        dir: "right"
      },
      {
        x: 6,
        y: 14,
        dir: "right"
      },
      {
        x: 3,
        y: 16,
        dir: "right"
      },
      {
        x: 9,
        y: 2,
        dir: "right"
      },
      {
        x: 0,
        y: 3,
        dir: "up"
      },
      {
        x: 11,
        y: 5,
        dir: "up"
      },
      {
        x: 10,
        y: 15,
        dir: "up"
      },
      {
        x: 11,
        y: 13,
        dir: "right"
      },
      {
        x: 9,
        y: 5,
        dir: "up"
      },
      {
        x: 2,
        y: 4,
        dir: "right"
      },
      {
        x: 2,
        y: 8,
        dir: "down"
      },
      {
        x: 11,
        y: 8,
        dir: "up"
      },
      {
        x: 3,
        y: 11,
        dir: "up"
      },
      {
        x: 4,
        y: 15,
        dir: "down"
      },
      {
        x: 1,
        y: 3,
        dir: "down"
      },
      {
        x: 0,
        y: 9,
        dir: "up"
      },
      {
        x: 9,
        y: 7,
        dir: "up"
      },
      {
        x: 0,
        y: 13,
        dir: "down"
      },
      {
        x: 2,
        y: 6,
        dir: "right"
      },
      {
        x: 7,
        y: 16,
        dir: "up"
      },
      {
        x: 1,
        y: 5,
        dir: "right"
      },
      {
        x: 3,
        y: 17,
        dir: "up"
      },
      {
        x: 1,
        y: 8,
        dir: "down"
      },
      {
        x: 2,
        y: 13,
        dir: "right"
      }
    ]
  },
  {
    id: 11,
    name: "第5关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      {
        x: 9,
        y: 12,
        dir: "right"
      },
      {
        x: 1,
        y: 5,
        dir: "right"
      },
      {
        x: 1,
        y: 4,
        dir: "right"
      },
      {
        x: 9,
        y: 6,
        dir: "down"
      },
      {
        x: 1,
        y: 14,
        dir: "down"
      },
      {
        x: 9,
        y: 11,
        dir: "right"
      },
      {
        x: 2,
        y: 9,
        dir: "right"
      },
      {
        x: 2,
        y: 3,
        dir: "right"
      },
      {
        x: 11,
        y: 10,
        dir: "right"
      },
      {
        x: 0,
        y: 15,
        dir: "up"
      },
      {
        x: 2,
        y: 13,
        dir: "down"
      },
      {
        x: 0,
        y: 11,
        dir: "up"
      },
      {
        x: 10,
        y: 6,
        dir: "down"
      },
      {
        x: 0,
        y: 6,
        dir: "left"
      },
      {
        x: 1,
        y: 10,
        dir: "right"
      },
      {
        x: 11,
        y: 4,
        dir: "down"
      },
      {
        x: 11,
        y: 14,
        dir: "right"
      },
      {
        x: 9,
        y: 2,
        dir: "down"
      },
      {
        x: 7,
        y: 8,
        dir: "down"
      },
      {
        x: 6,
        y: 15,
        dir: "right"
      },
      {
        x: 9,
        y: 7,
        dir: "right"
      },
      {
        x: 9,
        y: 17,
        dir: "down"
      },
      {
        x: 11,
        y: 9,
        dir: "down"
      },
      {
        x: 10,
        y: 15,
        dir: "right"
      },
      {
        x: 2,
        y: 8,
        dir: "right"
      },
      {
        x: 6,
        y: 9,
        dir: "right"
      },
      {
        x: 7,
        y: 3,
        dir: "right"
      },
      {
        x: 3,
        y: 13,
        dir: "down"
      },
      {
        x: 7,
        y: 14,
        dir: "right"
      },
      {
        x: 5,
        y: 11,
        dir: "down"
      },
      {
        x: 6,
        y: 5,
        dir: "down"
      },
      {
        x: 4,
        y: 11,
        dir: "right"
      },
      {
        x: 2,
        y: 11,
        dir: "down"
      },
      {
        x: 11,
        y: 12,
        dir: "down"
      },
      {
        x: 3,
        y: 7,
        dir: "right"
      },
      {
        x: 2,
        y: 18,
        dir: "down"
      },
      {
        x: 5,
        y: 0,
        dir: "right"
      },
      {
        x: 4,
        y: 6,
        dir: "left"
      },
      {
        x: 10,
        y: 8,
        dir: "down"
      },
      {
        x: 10,
        y: 3,
        dir: "right"
      },
      {
        x: 10,
        y: 12,
        dir: "down"
      },
      {
        x: 3,
        y: 3,
        dir: "down"
      },
      {
        x: 8,
        y: 3,
        dir: "up"
      },
      {
        x: 10,
        y: 9,
        dir: "right"
      },
      {
        x: 8,
        y: 2,
        dir: "right"
      },
      {
        x: 2,
        y: 4,
        dir: "up"
      },
      {
        x: 7,
        y: 4,
        dir: "up"
      },
      {
        x: 5,
        y: 5,
        dir: "down"
      },
      {
        x: 4,
        y: 17,
        dir: "right"
      },
      {
        x: 8,
        y: 17,
        dir: "right"
      },
      {
        x: 1,
        y: 12,
        dir: "down"
      },
      {
        x: 5,
        y: 16,
        dir: "right"
      },
      {
        x: 10,
        y: 4,
        dir: "right"
      },
      {
        x: 5,
        y: 14,
        dir: "right"
      },
      {
        x: 4,
        y: 9,
        dir: "right"
      },
      {
        x: 1,
        y: 7,
        dir: "right"
      }
    ]
  },
  {
    id: 3,
    name: "第6关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      {
        x: 5,
        y: 0,
        dir: "up"
      },
      {
        x: 2,
        y: 1,
        dir: "right"
      },
      {
        x: 4,
        y: 1,
        dir: "right"
      },
      {
        x: 9,
        y: 1,
        dir: "right"
      },
      {
        x: 0,
        y: 2,
        dir: "left"
      },
      {
        x: 3,
        y: 2,
        dir: "up"
      },
      {
        x: 4,
        y: 2,
        dir: "up"
      },
      {
        x: 9,
        y: 2,
        dir: "left"
      },
      {
        x: 1,
        y: 3,
        dir: "up"
      },
      {
        x: 6,
        y: 3,
        dir: "left"
      },
      {
        x: 8,
        y: 3,
        dir: "left"
      },
      {
        x: 2,
        y: 4,
        dir: "down"
      },
      {
        x: 9,
        y: 4,
        dir: "up"
      },
      {
        x: 10,
        y: 4,
        dir: "up"
      },
      {
        x: 3,
        y: 5,
        dir: "left"
      },
      {
        x: 5,
        y: 5,
        dir: "up"
      },
      {
        x: 1,
        y: 6,
        dir: "right"
      },
      {
        x: 2,
        y: 7,
        dir: "down"
      },
      {
        x: 7,
        y: 7,
        dir: "right"
      },
      {
        x: 8,
        y: 7,
        dir: "down"
      },
      {
        x: 10,
        y: 7,
        dir: "right"
      },
      {
        x: 1,
        y: 8,
        dir: "up"
      },
      {
        x: 3,
        y: 8,
        dir: "up"
      },
      {
        x: 10,
        y: 8,
        dir: "up"
      },
      {
        x: 11,
        y: 8,
        dir: "up"
      },
      {
        x: 5,
        y: 9,
        dir: "left"
      },
      {
        x: 7,
        y: 9,
        dir: "up"
      },
      {
        x: 8,
        y: 9,
        dir: "down"
      },
      {
        x: 0,
        y: 10,
        dir: "down"
      },
      {
        x: 3,
        y: 10,
        dir: "right"
      },
      {
        x: 9,
        y: 10,
        dir: "right"
      },
      {
        x: 0,
        y: 11,
        dir: "left"
      },
      {
        x: 2,
        y: 11,
        dir: "left"
      },
      {
        x: 6,
        y: 11,
        dir: "left"
      },
      {
        x: 9,
        y: 11,
        dir: "up"
      },
      {
        x: 11,
        y: 11,
        dir: "up"
      },
      {
        x: 2,
        y: 12,
        dir: "right"
      },
      {
        x: 5,
        y: 12,
        dir: "right"
      },
      {
        x: 8,
        y: 12,
        dir: "down"
      },
      {
        x: 10,
        y: 12,
        dir: "up"
      },
      {
        x: 3,
        y: 13,
        dir: "right"
      },
      {
        x: 6,
        y: 13,
        dir: "right"
      },
      {
        x: 7,
        y: 13,
        dir: "up"
      },
      {
        x: 9,
        y: 13,
        dir: "right"
      },
      {
        x: 1,
        y: 14,
        dir: "left"
      },
      {
        x: 8,
        y: 14,
        dir: "left"
      },
      {
        x: 10,
        y: 14,
        dir: "up"
      },
      {
        x: 0,
        y: 15,
        dir: "down"
      },
      {
        x: 2,
        y: 15,
        dir: "left"
      },
      {
        x: 4,
        y: 15,
        dir: "up"
      },
      {
        x: 5,
        y: 15,
        dir: "left"
      },
      {
        x: 1,
        y: 16,
        dir: "right"
      },
      {
        x: 8,
        y: 16,
        dir: "right"
      },
      {
        x: 10,
        y: 16,
        dir: "up"
      },
      {
        x: 2,
        y: 17,
        dir: "left"
      },
      {
        x: 5,
        y: 17,
        dir: "up"
      },
      {
        x: 6,
        y: 17,
        dir: "left"
      },
      {
        x: 7,
        y: 18,
        dir: "left"
      }
    ]
  },
  {
    id: 13,
    name: "第7关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      {
        x: 2,
        y: 3,
        dir: "up"
      },
      {
        x: 2,
        y: 6,
        dir: "up"
      },
      {
        x: 2,
        y: 1,
        dir: "up"
      },
      {
        x: 9,
        y: 2,
        dir: "left"
      },
      {
        x: 9,
        y: 15,
        dir: "left"
      },
      {
        x: 9,
        y: 0,
        dir: "up"
      },
      {
        x: 9,
        y: 4,
        dir: "up"
      },
      {
        x: 1,
        y: 1,
        dir: "up"
      },
      {
        x: 8,
        y: 13,
        dir: "up"
      },
      {
        x: 1,
        y: 3,
        dir: "right"
      },
      {
        x: 5,
        y: 9,
        dir: "left"
      },
      {
        x: 3,
        y: 8,
        dir: "up"
      },
      {
        x: 7,
        y: 8,
        dir: "up"
      },
      {
        x: 9,
        y: 17,
        dir: "left"
      },
      {
        x: 6,
        y: 16,
        dir: "left"
      },
      {
        x: 8,
        y: 15,
        dir: "up"
      },
      {
        x: 8,
        y: 9,
        dir: "left"
      },
      {
        x: 4,
        y: 11,
        dir: "left"
      },
      {
        x: 5,
        y: 15,
        dir: "up"
      },
      {
        x: 3,
        y: 17,
        dir: "up"
      },
      {
        x: 7,
        y: 10,
        dir: "up"
      },
      {
        x: 4,
        y: 6,
        dir: "left"
      },
      {
        x: 2,
        y: 0,
        dir: "left"
      },
      {
        x: 8,
        y: 6,
        dir: "up"
      },
      {
        x: 7,
        y: 14,
        dir: "right"
      },
      {
        x: 2,
        y: 13,
        dir: "left"
      },
      {
        x: 7,
        y: 17,
        dir: "left"
      },
      {
        x: 4,
        y: 16,
        dir: "up"
      },
      {
        x: 6,
        y: 12,
        dir: "up"
      },
      {
        x: 9,
        y: 16,
        dir: "left"
      },
      {
        x: 7,
        y: 12,
        dir: "left"
      },
      {
        x: 5,
        y: 7,
        dir: "left"
      },
      {
        x: 3,
        y: 6,
        dir: "up"
      },
      {
        x: 6,
        y: 15,
        dir: "left"
      },
      {
        x: 4,
        y: 5,
        dir: "right"
      },
      {
        x: 5,
        y: 17,
        dir: "left"
      },
      {
        x: 3,
        y: 1,
        dir: "up"
      },
      {
        x: 4,
        y: 7,
        dir: "up"
      },
      {
        x: 10,
        y: 5,
        dir: "up"
      },
      {
        x: 5,
        y: 10,
        dir: "left"
      },
      {
        x: 10,
        y: 8,
        dir: "left"
      },
      {
        x: 0,
        y: 6,
        dir: "up"
      },
      {
        x: 2,
        y: 10,
        dir: "up"
      },
      {
        x: 10,
        y: 9,
        dir: "up"
      },
      {
        x: 2,
        y: 12,
        dir: "left"
      },
      {
        x: 5,
        y: 18,
        dir: "left"
      },
      {
        x: 8,
        y: 18,
        dir: "left"
      },
      {
        x: 9,
        y: 6,
        dir: "up"
      },
      {
        x: 1,
        y: 4,
        dir: "right"
      },
      {
        x: 2,
        y: 5,
        dir: "right"
      },
      {
        x: 2,
        y: 15,
        dir: "up"
      },
      {
        x: 8,
        y: 8,
        dir: "left"
      },
      {
        x: 11,
        y: 12,
        dir: "up"
      },
      {
        x: 9,
        y: 12,
        dir: "left"
      },
      {
        x: 10,
        y: 11,
        dir: "left"
      },
      {
        x: 2,
        y: 17,
        dir: "up"
      },
      {
        x: 0,
        y: 12,
        dir: "up"
      },
      {
        x: 11,
        y: 15,
        dir: "up"
      },
      {
        x: 9,
        y: 13,
        dir: "up"
      }
    ]
  },
  {
    id: 4,
    name: "第8关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      {
        x: 2,
        y: 1,
        dir: "right"
      },
      {
        x: 9,
        y: 1,
        dir: "up"
      },
      {
        x: 1,
        y: 2,
        dir: "right"
      },
      {
        x: 10,
        y: 2,
        dir: "down"
      },
      {
        x: 2,
        y: 3,
        dir: "down"
      },
      {
        x: 3,
        y: 3,
        dir: "down"
      },
      {
        x: 8,
        y: 3,
        dir: "down"
      },
      {
        x: 1,
        y: 4,
        dir: "down"
      },
      {
        x: 4,
        y: 4,
        dir: "left"
      },
      {
        x: 8,
        y: 4,
        dir: "left"
      },
      {
        x: 10,
        y: 4,
        dir: "down"
      },
      {
        x: 1,
        y: 5,
        dir: "right"
      },
      {
        x: 2,
        y: 5,
        dir: "down"
      },
      {
        x: 4,
        y: 5,
        dir: "right"
      },
      {
        x: 8,
        y: 5,
        dir: "right"
      },
      {
        x: 9,
        y: 5,
        dir: "up"
      },
      {
        x: 11,
        y: 5,
        dir: "up"
      },
      {
        x: 0,
        y: 6,
        dir: "left"
      },
      {
        x: 3,
        y: 6,
        dir: "left"
      },
      {
        x: 7,
        y: 6,
        dir: "left"
      },
      {
        x: 1,
        y: 7,
        dir: "right"
      },
      {
        x: 2,
        y: 7,
        dir: "down"
      },
      {
        x: 10,
        y: 7,
        dir: "down"
      },
      {
        x: 1,
        y: 8,
        dir: "left"
      },
      {
        x: 3,
        y: 8,
        dir: "down"
      },
      {
        x: 8,
        y: 8,
        dir: "down"
      },
      {
        x: 9,
        y: 8,
        dir: "left"
      },
      {
        x: 0,
        y: 9,
        dir: "down"
      },
      {
        x: 4,
        y: 9,
        dir: "right"
      },
      {
        x: 9,
        y: 9,
        dir: "right"
      },
      {
        x: 11,
        y: 9,
        dir: "up"
      },
      {
        x: 1,
        y: 10,
        dir: "down"
      },
      {
        x: 3,
        y: 10,
        dir: "left"
      },
      {
        x: 7,
        y: 10,
        dir: "left"
      },
      {
        x: 9,
        y: 10,
        dir: "up"
      },
      {
        x: 1,
        y: 11,
        dir: "left"
      },
      {
        x: 7,
        y: 11,
        dir: "left"
      },
      {
        x: 10,
        y: 11,
        dir: "down"
      },
      {
        x: 1,
        y: 12,
        dir: "right"
      },
      {
        x: 4,
        y: 12,
        dir: "right"
      },
      {
        x: 7,
        y: 12,
        dir: "up"
      },
      {
        x: 10,
        y: 12,
        dir: "right"
      },
      {
        x: 3,
        y: 13,
        dir: "right"
      },
      {
        x: 8,
        y: 13,
        dir: "down"
      },
      {
        x: 9,
        y: 13,
        dir: "up"
      },
      {
        x: 11,
        y: 13,
        dir: "right"
      },
      {
        x: 0,
        y: 14,
        dir: "down"
      },
      {
        x: 1,
        y: 14,
        dir: "down"
      },
      {
        x: 8,
        y: 14,
        dir: "right"
      },
      {
        x: 11,
        y: 14,
        dir: "up"
      },
      {
        x: 1,
        y: 15,
        dir: "right"
      },
      {
        x: 3,
        y: 15,
        dir: "right"
      },
      {
        x: 3,
        y: 16,
        dir: "left"
      },
      {
        x: 8,
        y: 16,
        dir: "down"
      },
      {
        x: 9,
        y: 16,
        dir: "left"
      },
      {
        x: 1,
        y: 17,
        dir: "down"
      },
      {
        x: 2,
        y: 17,
        dir: "down"
      },
      {
        x: 9,
        y: 17,
        dir: "left"
      },
      {
        x: 6,
        y: 18,
        dir: "left"
      },
      {
        x: 8,
        y: 18,
        dir: "down"
      }
    ]
  },
  {
    id: 5,
    name: "第9关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      {
        x: 4,
        y: 0,
        dir: "up"
      },
      {
        x: 6,
        y: 0,
        dir: "left"
      },
      {
        x: 3,
        y: 1,
        dir: "up"
      },
      {
        x: 6,
        y: 1,
        dir: "up"
      },
      {
        x: 9,
        y: 1,
        dir: "up"
      },
      {
        x: 4,
        y: 2,
        dir: "left"
      },
      {
        x: 8,
        y: 2,
        dir: "right"
      },
      {
        x: 10,
        y: 2,
        dir: "down"
      },
      {
        x: 2,
        y: 3,
        dir: "down"
      },
      {
        x: 3,
        y: 3,
        dir: "up"
      },
      {
        x: 5,
        y: 3,
        dir: "right"
      },
      {
        x: 7,
        y: 3,
        dir: "right"
      },
      {
        x: 9,
        y: 3,
        dir: "right"
      },
      {
        x: 11,
        y: 3,
        dir: "right"
      },
      {
        x: 4,
        y: 4,
        dir: "left"
      },
      {
        x: 1,
        y: 5,
        dir: "right"
      },
      {
        x: 4,
        y: 5,
        dir: "up"
      },
      {
        x: 6,
        y: 5,
        dir: "right"
      },
      {
        x: 8,
        y: 5,
        dir: "right"
      },
      {
        x: 10,
        y: 5,
        dir: "down"
      },
      {
        x: 2,
        y: 6,
        dir: "down"
      },
      {
        x: 8,
        y: 6,
        dir: "left"
      },
      {
        x: 3,
        y: 7,
        dir: "down"
      },
      {
        x: 4,
        y: 7,
        dir: "up"
      },
      {
        x: 5,
        y: 7,
        dir: "left"
      },
      {
        x: 8,
        y: 7,
        dir: "right"
      },
      {
        x: 0,
        y: 8,
        dir: "up"
      },
      {
        x: 1,
        y: 8,
        dir: "left"
      },
      {
        x: 6,
        y: 8,
        dir: "right"
      },
      {
        x: 10,
        y: 8,
        dir: "right"
      },
      {
        x: 11,
        y: 8,
        dir: "up"
      },
      {
        x: 3,
        y: 9,
        dir: "left"
      },
      {
        x: 5,
        y: 9,
        dir: "left"
      },
      {
        x: 9,
        y: 9,
        dir: "up"
      },
      {
        x: 0,
        y: 10,
        dir: "up"
      },
      {
        x: 2,
        y: 10,
        dir: "right"
      },
      {
        x: 6,
        y: 10,
        dir: "right"
      },
      {
        x: 5,
        y: 11,
        dir: "left"
      },
      {
        x: 8,
        y: 11,
        dir: "up"
      },
      {
        x: 9,
        y: 11,
        dir: "up"
      },
      {
        x: 4,
        y: 12,
        dir: "right"
      },
      {
        x: 5,
        y: 12,
        dir: "up"
      },
      {
        x: 6,
        y: 12,
        dir: "up"
      },
      {
        x: 7,
        y: 12,
        dir: "up"
      },
      {
        x: 10,
        y: 12,
        dir: "down"
      },
      {
        x: 0,
        y: 14,
        dir: "up"
      },
      {
        x: 1,
        y: 14,
        dir: "down"
      },
      {
        x: 3,
        y: 14,
        dir: "down"
      },
      {
        x: 4,
        y: 14,
        dir: "down"
      },
      {
        x: 5,
        y: 14,
        dir: "left"
      },
      {
        x: 8,
        y: 14,
        dir: "down"
      },
      {
        x: 4,
        y: 15,
        dir: "right"
      },
      {
        x: 8,
        y: 15,
        dir: "right"
      },
      {
        x: 9,
        y: 15,
        dir: "up"
      },
      {
        x: 10,
        y: 15,
        dir: "down"
      },
      {
        x: 11,
        y: 15,
        dir: "up"
      },
      {
        x: 6,
        y: 16,
        dir: "right"
      },
      {
        x: 8,
        y: 16,
        dir: "right"
      },
      {
        x: 5,
        y: 17,
        dir: "right"
      },
      {
        x: 9,
        y: 17,
        dir: "up"
      }
    ]
  },
  {
    id: 8,
    name: "第10关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      {
        x: 4,
        y: 0,
        dir: "left"
      },
      {
        x: 8,
        y: 0,
        dir: "left"
      },
      {
        x: 3,
        y: 1,
        dir: "down"
      },
      {
        x: 7,
        y: 1,
        dir: "right"
      },
      {
        x: 1,
        y: 2,
        dir: "down"
      },
      {
        x: 2,
        y: 2,
        dir: "left"
      },
      {
        x: 5,
        y: 2,
        dir: "up"
      },
      {
        x: 8,
        y: 2,
        dir: "down"
      },
      {
        x: 2,
        y: 3,
        dir: "up"
      },
      {
        x: 7,
        y: 3,
        dir: "down"
      },
      {
        x: 9,
        y: 3,
        dir: "left"
      },
      {
        x: 11,
        y: 3,
        dir: "up"
      },
      {
        x: 5,
        y: 4,
        dir: "up"
      },
      {
        x: 9,
        y: 4,
        dir: "right"
      },
      {
        x: 1,
        y: 5,
        dir: "down"
      },
      {
        x: 2,
        y: 5,
        dir: "left"
      },
      {
        x: 10,
        y: 5,
        dir: "left"
      },
      {
        x: 2,
        y: 6,
        dir: "right"
      },
      {
        x: 6,
        y: 6,
        dir: "up"
      },
      {
        x: 7,
        y: 6,
        dir: "down"
      },
      {
        x: 9,
        y: 6,
        dir: "up"
      },
      {
        x: 11,
        y: 6,
        dir: "up"
      },
      {
        x: 0,
        y: 7,
        dir: "down"
      },
      {
        x: 3,
        y: 7,
        dir: "right"
      },
      {
        x: 1,
        y: 8,
        dir: "left"
      },
      {
        x: 4,
        y: 8,
        dir: "up"
      },
      {
        x: 0,
        y: 9,
        dir: "left"
      },
      {
        x: 3,
        y: 9,
        dir: "right"
      },
      {
        x: 9,
        y: 9,
        dir: "right"
      },
      {
        x: 11,
        y: 9,
        dir: "down"
      },
      {
        x: 2,
        y: 10,
        dir: "up"
      },
      {
        x: 5,
        y: 10,
        dir: "up"
      },
      {
        x: 6,
        y: 10,
        dir: "up"
      },
      {
        x: 9,
        y: 10,
        dir: "up"
      },
      {
        x: 10,
        y: 10,
        dir: "up"
      },
      {
        x: 0,
        y: 11,
        dir: "down"
      },
      {
        x: 8,
        y: 11,
        dir: "right"
      },
      {
        x: 11,
        y: 11,
        dir: "down"
      },
      {
        x: 1,
        y: 12,
        dir: "down"
      },
      {
        x: 10,
        y: 12,
        dir: "left"
      },
      {
        x: 0,
        y: 13,
        dir: "down"
      },
      {
        x: 3,
        y: 13,
        dir: "right"
      },
      {
        x: 6,
        y: 13,
        dir: "down"
      },
      {
        x: 8,
        y: 13,
        dir: "down"
      },
      {
        x: 10,
        y: 13,
        dir: "right"
      },
      {
        x: 1,
        y: 14,
        dir: "right"
      },
      {
        x: 6,
        y: 14,
        dir: "right"
      },
      {
        x: 10,
        y: 14,
        dir: "right"
      },
      {
        x: 11,
        y: 14,
        dir: "down"
      },
      {
        x: 1,
        y: 15,
        dir: "right"
      },
      {
        x: 2,
        y: 15,
        dir: "up"
      },
      {
        x: 3,
        y: 16,
        dir: "down"
      },
      {
        x: 7,
        y: 16,
        dir: "right"
      },
      {
        x: 8,
        y: 16,
        dir: "down"
      },
      {
        x: 9,
        y: 16,
        dir: "down"
      },
      {
        x: 10,
        y: 16,
        dir: "up"
      },
      {
        x: 11,
        y: 16,
        dir: "down"
      },
      {
        x: 2,
        y: 17,
        dir: "right"
      },
      {
        x: 5,
        y: 17,
        dir: "down"
      },
      {
        x: 3,
        y: 18,
        dir: "right"
      },
      {
        x: 5,
        y: 18,
        dir: "right"
      },
      {
        x: 8,
        y: 18,
        dir: "right"
      }
    ]
  },
  {
    id: 7,
    name: "第11关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      {
        x: 4,
        y: 0,
        dir: "left"
      },
      {
        x: 7,
        y: 0,
        dir: "right"
      },
      {
        x: 3,
        y: 1,
        dir: "up"
      },
      {
        x: 7,
        y: 1,
        dir: "up"
      },
      {
        x: 8,
        y: 1,
        dir: "left"
      },
      {
        x: 1,
        y: 2,
        dir: "down"
      },
      {
        x: 2,
        y: 2,
        dir: "down"
      },
      {
        x: 5,
        y: 2,
        dir: "down"
      },
      {
        x: 6,
        y: 2,
        dir: "down"
      },
      {
        x: 10,
        y: 2,
        dir: "left"
      },
      {
        x: 3,
        y: 3,
        dir: "right"
      },
      {
        x: 6,
        y: 3,
        dir: "right"
      },
      {
        x: 7,
        y: 3,
        dir: "up"
      },
      {
        x: 10,
        y: 3,
        dir: "up"
      },
      {
        x: 1,
        y: 4,
        dir: "right"
      },
      {
        x: 3,
        y: 4,
        dir: "right"
      },
      {
        x: 0,
        y: 5,
        dir: "up"
      },
      {
        x: 6,
        y: 5,
        dir: "left"
      },
      {
        x: 10,
        y: 5,
        dir: "right"
      },
      {
        x: 11,
        y: 5,
        dir: "up"
      },
      {
        x: 1,
        y: 6,
        dir: "down"
      },
      {
        x: 2,
        y: 6,
        dir: "left"
      },
      {
        x: 8,
        y: 6,
        dir: "left"
      },
      {
        x: 2,
        y: 7,
        dir: "right"
      },
      {
        x: 10,
        y: 7,
        dir: "right"
      },
      {
        x: 0,
        y: 8,
        dir: "up"
      },
      {
        x: 4,
        y: 8,
        dir: "left"
      },
      {
        x: 6,
        y: 8,
        dir: "down"
      },
      {
        x: 7,
        y: 8,
        dir: "up"
      },
      {
        x: 9,
        y: 8,
        dir: "left"
      },
      {
        x: 11,
        y: 8,
        dir: "up"
      },
      {
        x: 1,
        y: 9,
        dir: "down"
      },
      {
        x: 3,
        y: 9,
        dir: "left"
      },
      {
        x: 10,
        y: 9,
        dir: "right"
      },
      {
        x: 2,
        y: 10,
        dir: "right"
      },
      {
        x: 8,
        y: 10,
        dir: "up"
      },
      {
        x: 10,
        y: 10,
        dir: "right"
      },
      {
        x: 11,
        y: 10,
        dir: "up"
      },
      {
        x: 0,
        y: 11,
        dir: "up"
      },
      {
        x: 2,
        y: 11,
        dir: "right"
      },
      {
        x: 4,
        y: 11,
        dir: "up"
      },
      {
        x: 10,
        y: 11,
        dir: "right"
      },
      {
        x: 3,
        y: 12,
        dir: "down"
      },
      {
        x: 8,
        y: 12,
        dir: "right"
      },
      {
        x: 9,
        y: 12,
        dir: "up"
      },
      {
        x: 10,
        y: 12,
        dir: "up"
      },
      {
        x: 0,
        y: 13,
        dir: "up"
      },
      {
        x: 2,
        y: 13,
        dir: "down"
      },
      {
        x: 3,
        y: 14,
        dir: "down"
      },
      {
        x: 9,
        y: 14,
        dir: "left"
      },
      {
        x: 2,
        y: 15,
        dir: "down"
      },
      {
        x: 10,
        y: 15,
        dir: "left"
      },
      {
        x: 0,
        y: 16,
        dir: "down"
      },
      {
        x: 1,
        y: 16,
        dir: "down"
      },
      {
        x: 3,
        y: 16,
        dir: "right"
      },
      {
        x: 4,
        y: 16,
        dir: "down"
      },
      {
        x: 9,
        y: 16,
        dir: "up"
      },
      {
        x: 2,
        y: 17,
        dir: "right"
      },
      {
        x: 5,
        y: 17,
        dir: "down"
      },
      {
        x: 6,
        y: 17,
        dir: "down"
      },
      {
        x: 8,
        y: 17,
        dir: "up"
      },
      {
        x: 10,
        y: 17,
        dir: "down"
      },
      {
        x: 3,
        y: 18,
        dir: "left"
      },
      {
        x: 5,
        y: 18,
        dir: "left"
      }
    ]
  },
  {
    id: 6,
    name: "第12关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      {
        x: 4,
        y: 0,
        dir: "right"
      },
      {
        x: 6,
        y: 0,
        dir: "right"
      },
      {
        x: 9,
        y: 0,
        dir: "right"
      },
      {
        x: 1,
        y: 1,
        dir: "left"
      },
      {
        x: 5,
        y: 1,
        dir: "up"
      },
      {
        x: 6,
        y: 1,
        dir: "up"
      },
      {
        x: 7,
        y: 1,
        dir: "down"
      },
      {
        x: 0,
        y: 2,
        dir: "up"
      },
      {
        x: 1,
        y: 2,
        dir: "up"
      },
      {
        x: 2,
        y: 2,
        dir: "up"
      },
      {
        x: 8,
        y: 2,
        dir: "left"
      },
      {
        x: 10,
        y: 2,
        dir: "left"
      },
      {
        x: 4,
        y: 3,
        dir: "right"
      },
      {
        x: 5,
        y: 3,
        dir: "up"
      },
      {
        x: 10,
        y: 3,
        dir: "up"
      },
      {
        x: 11,
        y: 3,
        dir: "up"
      },
      {
        x: 1,
        y: 4,
        dir: "right"
      },
      {
        x: 2,
        y: 4,
        dir: "up"
      },
      {
        x: 1,
        y: 5,
        dir: "right"
      },
      {
        x: 5,
        y: 5,
        dir: "right"
      },
      {
        x: 8,
        y: 5,
        dir: "up"
      },
      {
        x: 9,
        y: 5,
        dir: "up"
      },
      {
        x: 10,
        y: 5,
        dir: "up"
      },
      {
        x: 0,
        y: 6,
        dir: "up"
      },
      {
        x: 1,
        y: 6,
        dir: "left"
      },
      {
        x: 3,
        y: 6,
        dir: "up"
      },
      {
        x: 5,
        y: 6,
        dir: "left"
      },
      {
        x: 11,
        y: 6,
        dir: "up"
      },
      {
        x: 1,
        y: 7,
        dir: "left"
      },
      {
        x: 1,
        y: 8,
        dir: "right"
      },
      {
        x: 3,
        y: 8,
        dir: "right"
      },
      {
        x: 10,
        y: 8,
        dir: "down"
      },
      {
        x: 2,
        y: 9,
        dir: "right"
      },
      {
        x: 3,
        y: 9,
        dir: "up"
      },
      {
        x: 8,
        y: 9,
        dir: "up"
      },
      {
        x: 9,
        y: 10,
        dir: "up"
      },
      {
        x: 11,
        y: 10,
        dir: "down"
      },
      {
        x: 0,
        y: 11,
        dir: "up"
      },
      {
        x: 2,
        y: 11,
        dir: "down"
      },
      {
        x: 8,
        y: 11,
        dir: "up"
      },
      {
        x: 10,
        y: 11,
        dir: "left"
      },
      {
        x: 2,
        y: 12,
        dir: "right"
      },
      {
        x: 3,
        y: 12,
        dir: "up"
      },
      {
        x: 6,
        y: 12,
        dir: "down"
      },
      {
        x: 7,
        y: 12,
        dir: "down"
      },
      {
        x: 10,
        y: 12,
        dir: "right"
      },
      {
        x: 0,
        y: 13,
        dir: "up"
      },
      {
        x: 1,
        y: 13,
        dir: "up"
      },
      {
        x: 9,
        y: 13,
        dir: "up"
      },
      {
        x: 2,
        y: 14,
        dir: "down"
      },
      {
        x: 4,
        y: 14,
        dir: "left"
      },
      {
        x: 8,
        y: 14,
        dir: "down"
      },
      {
        x: 11,
        y: 14,
        dir: "down"
      },
      {
        x: 1,
        y: 15,
        dir: "right"
      },
      {
        x: 3,
        y: 15,
        dir: "up"
      },
      {
        x: 4,
        y: 15,
        dir: "up"
      },
      {
        x: 9,
        y: 15,
        dir: "up"
      },
      {
        x: 1,
        y: 16,
        dir: "right"
      },
      {
        x: 7,
        y: 16,
        dir: "right"
      },
      {
        x: 11,
        y: 16,
        dir: "right"
      },
      {
        x: 3,
        y: 17,
        dir: "up"
      },
      {
        x: 4,
        y: 17,
        dir: "left"
      },
      {
        x: 6,
        y: 17,
        dir: "left"
      },
      {
        x: 9,
        y: 17,
        dir: "up"
      },
      {
        x: 2,
        y: 18,
        dir: "down"
      },
      {
        x: 7,
        y: 18,
        dir: "right"
      }
    ]
  },
  {
    id: 9,
    name: "第13关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      {
        x: 3,
        y: 0,
        dir: "left"
      },
      {
        x: 7,
        y: 0,
        dir: "left"
      },
      {
        x: 2,
        y: 1,
        dir: "right"
      },
      {
        x: 3,
        y: 1,
        dir: "up"
      },
      {
        x: 6,
        y: 1,
        dir: "right"
      },
      {
        x: 8,
        y: 1,
        dir: "up"
      },
      {
        x: 1,
        y: 2,
        dir: "up"
      },
      {
        x: 6,
        y: 2,
        dir: "left"
      },
      {
        x: 10,
        y: 2,
        dir: "left"
      },
      {
        x: 5,
        y: 3,
        dir: "down"
      },
      {
        x: 10,
        y: 3,
        dir: "left"
      },
      {
        x: 1,
        y: 4,
        dir: "up"
      },
      {
        x: 2,
        y: 4,
        dir: "up"
      },
      {
        x: 6,
        y: 4,
        dir: "left"
      },
      {
        x: 10,
        y: 4,
        dir: "up"
      },
      {
        x: 5,
        y: 5,
        dir: "left"
      },
      {
        x: 8,
        y: 5,
        dir: "left"
      },
      {
        x: 11,
        y: 5,
        dir: "up"
      },
      {
        x: 0,
        y: 6,
        dir: "up"
      },
      {
        x: 1,
        y: 6,
        dir: "left"
      },
      {
        x: 5,
        y: 6,
        dir: "right"
      },
      {
        x: 6,
        y: 6,
        dir: "up"
      },
      {
        x: 8,
        y: 6,
        dir: "up"
      },
      {
        x: 3,
        y: 7,
        dir: "right"
      },
      {
        x: 7,
        y: 7,
        dir: "down"
      },
      {
        x: 10,
        y: 7,
        dir: "down"
      },
      {
        x: 2,
        y: 8,
        dir: "left"
      },
      {
        x: 8,
        y: 8,
        dir: "up"
      },
      {
        x: 9,
        y: 8,
        dir: "left"
      },
      {
        x: 11,
        y: 8,
        dir: "down"
      },
      {
        x: 0,
        y: 9,
        dir: "up"
      },
      {
        x: 1,
        y: 9,
        dir: "down"
      },
      {
        x: 2,
        y: 9,
        dir: "left"
      },
      {
        x: 9,
        y: 9,
        dir: "left"
      },
      {
        x: 2,
        y: 10,
        dir: "right"
      },
      {
        x: 4,
        y: 10,
        dir: "down"
      },
      {
        x: 8,
        y: 10,
        dir: "up"
      },
      {
        x: 11,
        y: 10,
        dir: "down"
      },
      {
        x: 1,
        y: 11,
        dir: "right"
      },
      {
        x: 3,
        y: 11,
        dir: "up"
      },
      {
        x: 7,
        y: 11,
        dir: "down"
      },
      {
        x: 10,
        y: 11,
        dir: "right"
      },
      {
        x: 1,
        y: 12,
        dir: "right"
      },
      {
        x: 8,
        y: 12,
        dir: "up"
      },
      {
        x: 0,
        y: 13,
        dir: "left"
      },
      {
        x: 3,
        y: 13,
        dir: "right"
      },
      {
        x: 4,
        y: 13,
        dir: "down"
      },
      {
        x: 7,
        y: 13,
        dir: "down"
      },
      {
        x: 10,
        y: 13,
        dir: "down"
      },
      {
        x: 11,
        y: 13,
        dir: "down"
      },
      {
        x: 3,
        y: 14,
        dir: "left"
      },
      {
        x: 10,
        y: 14,
        dir: "right"
      },
      {
        x: 0,
        y: 15,
        dir: "up"
      },
      {
        x: 1,
        y: 15,
        dir: "down"
      },
      {
        x: 2,
        y: 15,
        dir: "up"
      },
      {
        x: 3,
        y: 15,
        dir: "left"
      },
      {
        x: 6,
        y: 15,
        dir: "up"
      },
      {
        x: 10,
        y: 15,
        dir: "left"
      },
      {
        x: 4,
        y: 16,
        dir: "left"
      },
      {
        x: 9,
        y: 16,
        dir: "left"
      },
      {
        x: 2,
        y: 17,
        dir: "right"
      },
      {
        x: 3,
        y: 17,
        dir: "up"
      },
      {
        x: 5,
        y: 17,
        dir: "right"
      },
      {
        x: 6,
        y: 17,
        dir: "up"
      },
      {
        x: 9,
        y: 17,
        dir: "up"
      },
      {
        x: 5,
        y: 18,
        dir: "right"
      }
    ]
  },
  {
    id: 2,
    name: "第14关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      {
        x: 6,
        y: 0,
        dir: "up"
      },
      {
        x: 2,
        y: 1,
        dir: "left"
      },
      {
        x: 4,
        y: 1,
        dir: "down"
      },
      {
        x: 5,
        y: 1,
        dir: "down"
      },
      {
        x: 7,
        y: 1,
        dir: "left"
      },
      {
        x: 2,
        y: 2,
        dir: "left"
      },
      {
        x: 8,
        y: 2,
        dir: "left"
      },
      {
        x: 2,
        y: 3,
        dir: "right"
      },
      {
        x: 4,
        y: 3,
        dir: "right"
      },
      {
        x: 5,
        y: 3,
        dir: "down"
      },
      {
        x: 10,
        y: 3,
        dir: "down"
      },
      {
        x: 0,
        y: 4,
        dir: "down"
      },
      {
        x: 7,
        y: 4,
        dir: "down"
      },
      {
        x: 8,
        y: 4,
        dir: "down"
      },
      {
        x: 10,
        y: 4,
        dir: "right"
      },
      {
        x: 0,
        y: 5,
        dir: "left"
      },
      {
        x: 2,
        y: 5,
        dir: "left"
      },
      {
        x: 4,
        y: 5,
        dir: "down"
      },
      {
        x: 5,
        y: 5,
        dir: "down"
      },
      {
        x: 9,
        y: 5,
        dir: "left"
      },
      {
        x: 1,
        y: 6,
        dir: "up"
      },
      {
        x: 3,
        y: 6,
        dir: "right"
      },
      {
        x: 8,
        y: 6,
        dir: "down"
      },
      {
        x: 11,
        y: 6,
        dir: "right"
      },
      {
        x: 2,
        y: 7,
        dir: "up"
      },
      {
        x: 7,
        y: 7,
        dir: "left"
      },
      {
        x: 9,
        y: 7,
        dir: "left"
      },
      {
        x: 4,
        y: 8,
        dir: "down"
      },
      {
        x: 5,
        y: 8,
        dir: "down"
      },
      {
        x: 6,
        y: 8,
        dir: "up"
      },
      {
        x: 10,
        y: 8,
        dir: "right"
      },
      {
        x: 0,
        y: 9,
        dir: "down"
      },
      {
        x: 1,
        y: 9,
        dir: "left"
      },
      {
        x: 4,
        y: 9,
        dir: "left"
      },
      {
        x: 7,
        y: 9,
        dir: "down"
      },
      {
        x: 8,
        y: 9,
        dir: "left"
      },
      {
        x: 11,
        y: 9,
        dir: "up"
      },
      {
        x: 1,
        y: 10,
        dir: "up"
      },
      {
        x: 3,
        y: 10,
        dir: "up"
      },
      {
        x: 6,
        y: 10,
        dir: "left"
      },
      {
        x: 10,
        y: 10,
        dir: "down"
      },
      {
        x: 0,
        y: 11,
        dir: "down"
      },
      {
        x: 4,
        y: 11,
        dir: "down"
      },
      {
        x: 5,
        y: 11,
        dir: "down"
      },
      {
        x: 1,
        y: 12,
        dir: "left"
      },
      {
        x: 7,
        y: 12,
        dir: "left"
      },
      {
        x: 4,
        y: 13,
        dir: "right"
      },
      {
        x: 7,
        y: 13,
        dir: "right"
      },
      {
        x: 10,
        y: 13,
        dir: "down"
      },
      {
        x: 1,
        y: 14,
        dir: "right"
      },
      {
        x: 3,
        y: 14,
        dir: "right"
      },
      {
        x: 5,
        y: 14,
        dir: "right"
      },
      {
        x: 7,
        y: 14,
        dir: "right"
      },
      {
        x: 8,
        y: 14,
        dir: "down"
      },
      {
        x: 11,
        y: 14,
        dir: "right"
      },
      {
        x: 3,
        y: 15,
        dir: "right"
      },
      {
        x: 5,
        y: 15,
        dir: "right"
      },
      {
        x: 7,
        y: 15,
        dir: "right"
      },
      {
        x: 11,
        y: 15,
        dir: "right"
      },
      {
        x: 1,
        y: 16,
        dir: "up"
      },
      {
        x: 3,
        y: 16,
        dir: "left"
      },
      {
        x: 5,
        y: 16,
        dir: "left"
      },
      {
        x: 8,
        y: 16,
        dir: "left"
      },
      {
        x: 2,
        y: 17,
        dir: "up"
      },
      {
        x: 5,
        y: 17,
        dir: "right"
      },
      {
        x: 3,
        y: 18,
        dir: "left"
      },
      {
        x: 6,
        y: 18,
        dir: "left"
      },
      {
        x: 9,
        y: 18,
        dir: "down"
      }
    ]
  },
  {
    id: 10,
    name: "第15关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      {
        x: 3,
        y: 0,
        dir: "up"
      },
      {
        x: 7,
        y: 0,
        dir: "left"
      },
      {
        x: 9,
        y: 0,
        dir: "up"
      },
      {
        x: 4,
        y: 1,
        dir: "left"
      },
      {
        x: 6,
        y: 1,
        dir: "left"
      },
      {
        x: 0,
        y: 2,
        dir: "up"
      },
      {
        x: 1,
        y: 2,
        dir: "down"
      },
      {
        x: 3,
        y: 2,
        dir: "up"
      },
      {
        x: 4,
        y: 2,
        dir: "left"
      },
      {
        x: 6,
        y: 2,
        dir: "left"
      },
      {
        x: 10,
        y: 2,
        dir: "left"
      },
      {
        x: 5,
        y: 3,
        dir: "left"
      },
      {
        x: 10,
        y: 3,
        dir: "up"
      },
      {
        x: 0,
        y: 4,
        dir: "up"
      },
      {
        x: 1,
        y: 4,
        dir: "down"
      },
      {
        x: 2,
        y: 4,
        dir: "left"
      },
      {
        x: 11,
        y: 4,
        dir: "up"
      },
      {
        x: 3,
        y: 5,
        dir: "right"
      },
      {
        x: 4,
        y: 5,
        dir: "down"
      },
      {
        x: 7,
        y: 5,
        dir: "right"
      },
      {
        x: 10,
        y: 5,
        dir: "right"
      },
      {
        x: 1,
        y: 6,
        dir: "right"
      },
      {
        x: 5,
        y: 6,
        dir: "down"
      },
      {
        x: 6,
        y: 6,
        dir: "up"
      },
      {
        x: 8,
        y: 6,
        dir: "up"
      },
      {
        x: 9,
        y: 6,
        dir: "up"
      },
      {
        x: 10,
        y: 6,
        dir: "up"
      },
      {
        x: 0,
        y: 7,
        dir: "up"
      },
      {
        x: 1,
        y: 7,
        dir: "left"
      },
      {
        x: 3,
        y: 7,
        dir: "left"
      },
      {
        x: 3,
        y: 8,
        dir: "left"
      },
      {
        x: 8,
        y: 8,
        dir: "left"
      },
      {
        x: 10,
        y: 8,
        dir: "up"
      },
      {
        x: 11,
        y: 8,
        dir: "down"
      },
      {
        x: 0,
        y: 9,
        dir: "up"
      },
      {
        x: 1,
        y: 9,
        dir: "down"
      },
      {
        x: 2,
        y: 9,
        dir: "up"
      },
      {
        x: 3,
        y: 9,
        dir: "up"
      },
      {
        x: 9,
        y: 9,
        dir: "right"
      },
      {
        x: 0,
        y: 11,
        dir: "up"
      },
      {
        x: 1,
        y: 11,
        dir: "down"
      },
      {
        x: 5,
        y: 11,
        dir: "down"
      },
      {
        x: 7,
        y: 11,
        dir: "up"
      },
      {
        x: 8,
        y: 11,
        dir: "up"
      },
      {
        x: 9,
        y: 11,
        dir: "down"
      },
      {
        x: 10,
        y: 11,
        dir: "left"
      },
      {
        x: 3,
        y: 12,
        dir: "left"
      },
      {
        x: 10,
        y: 12,
        dir: "left"
      },
      {
        x: 0,
        y: 13,
        dir: "up"
      },
      {
        x: 2,
        y: 13,
        dir: "down"
      },
      {
        x: 4,
        y: 13,
        dir: "left"
      },
      {
        x: 9,
        y: 13,
        dir: "down"
      },
      {
        x: 2,
        y: 14,
        dir: "left"
      },
      {
        x: 9,
        y: 14,
        dir: "left"
      },
      {
        x: 11,
        y: 14,
        dir: "down"
      },
      {
        x: 0,
        y: 15,
        dir: "up"
      },
      {
        x: 2,
        y: 15,
        dir: "right"
      },
      {
        x: 3,
        y: 15,
        dir: "up"
      },
      {
        x: 11,
        y: 15,
        dir: "right"
      },
      {
        x: 6,
        y: 16,
        dir: "left"
      },
      {
        x: 8,
        y: 16,
        dir: "up"
      },
      {
        x: 9,
        y: 16,
        dir: "down"
      },
      {
        x: 10,
        y: 16,
        dir: "left"
      },
      {
        x: 2,
        y: 17,
        dir: "down"
      },
      {
        x: 9,
        y: 17,
        dir: "left"
      },
      {
        x: 2,
        y: 18,
        dir: "left"
      },
      {
        x: 5,
        y: 18,
        dir: "left"
      },
      {
        x: 8,
        y: 18,
        dir: "left"
      }
    ]
  }
];

const state = {
  levelIndex: 0,
  animals: [],
  animalById: new Map(),
  cleared: 0,
  combo: 0,
  score: 0,
  starThresholds: [0, 0, 0],
  bestByLevel: loadProgress(),
  locked: false,
  toolMode: null,
};

const PIG_MARKUP = `
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

const pasture = document.querySelector("#pasture");
const clearedCount = document.querySelector("#clearedCount");
const targetCount = document.querySelector("#targetCount");
const levelTitle = document.querySelector("#levelTitle");
const levelSelect = document.querySelector("#levelSelect");
const levelSelectLabel = document.querySelector("#levelSelectLabel");
const comboBurst = document.querySelector("#comboBurst");
const comboCount = document.querySelector("#comboCount");
const scoreCount = document.querySelector("#scoreCount");
const starTarget = document.querySelector("#starTarget");
const totalStarsCount = document.querySelector("#totalStarsCount");
const levelCompleteModal = document.querySelector("#levelCompleteModal");
const completeStars = document.querySelector("#completeStars");
const completeScore = document.querySelector("#completeScore");
const replayLevelBtn = document.querySelector("#replayLevelBtn");
const nextLevelBtn = document.querySelector("#nextLevelBtn");
const toast = document.querySelector("#toast");
const restartBtn = document.querySelector("#restartBtn");
const removeTool = document.querySelector("#removeTool");
const startGameBtn = document.querySelector("#startGameBtn");
const startTotalStars = document.querySelector("#startTotalStars");
const startClearedLevels = document.querySelector("#startClearedLevels");

function initLevel(index = 0) {
  const levelIndex = Math.max(0, Math.min(index, LEVELS.length - 1));
  const level = LEVELS[levelIndex];
  state.levelIndex = levelIndex;
  state.cleared = 0;
  state.combo = 0;
  state.score = 0;
  state.starThresholds = getStarThresholds(level);
  state.locked = false;
  state.toolMode = null;
  state.animals = level.animals.map((animal, animalIndex) => ({
    ...animal,
    type: animal.type ?? level.animalType ?? "pig",
    id: `pig-${levelIndex}-${animalIndex}`,
    active: true,
    busy: false,
    stunned: false,
  }));
  state.animalById = new Map(state.animals.map((animal) => [animal.id, animal]));

  document.documentElement.style.setProperty("--board-cols", BOARD.cols);
  document.documentElement.style.setProperty("--board-rows", BOARD.rows);
  pasture.style.setProperty("--board-cols", BOARD.cols);
  pasture.style.setProperty("--board-rows", BOARD.rows);
  setPlayArea(level.playArea);
  levelTitle.textContent = level.name;
  levelSelectLabel.textContent = level.name;
  renderLevelSelect();
  levelSelect.value = String(levelIndex);
  targetCount.textContent = `/ ${state.animals.length}`;
  render();
  updateHud();
  hideComboBurst();
  hideLevelCompleteModal();
  updateToolState();
  showToast("点击小猪，让它向前跑出草地");
}

function render() {
  pasture.innerHTML = "";
  renderPlayArea();
  const fragment = document.createDocumentFragment();

  state.animals
    .filter((animal) => animal.active)
    .forEach((animal) => {
      const pig = document.createElement("button");
      const animalType = getAnimalType(animal);
      pig.className = `pig ${animalType.className}${animal.stunned ? " is-stunned" : ""}`;
      pig.type = "button";
      pig.dataset.id = animal.id;
      pig.draggable = false;
      const center = getAnimalCenter(animal);
      pig.style.setProperty("--x", center.x);
      pig.style.setProperty("--y", center.y);
      pig.style.setProperty("--z", Math.round(center.y * 2 + 10));
      pig.style.setProperty("--rot", DIRS[animal.dir].rot);
      pig.style.setProperty("--move-ms", `${animalType.moveMsPerCell}ms`);
      pig.style.setProperty("--trail-color", animalType.trailColor);
      pig.style.setProperty("--burst-color", animalType.burstColor);
      pig.style.setProperty("--stun-color", animalType.stunColor);
      pig.setAttribute("aria-label", `小猪朝${DIRS[animal.dir].label}`);
      pig.innerHTML = PIG_MARKUP;
      bindAnimalInput(pig, animal.id);
      fragment.appendChild(pig);
    });
  pasture.appendChild(fragment);
}

function handleAnimalClick(id, element) {
  if (state.locked) return;

  const animal = state.animalById.get(id);
  if (!animal || !animal.active || animal.busy) return;

  playAnimalTapFeedback(element);

  if (state.toolMode === "remove") {
    removeAnimal(animal, element);
    setToolMode(null);
    showToast("已移除一只小猪");
    return;
  }

  tryMove(animal, element);
}

function bindAnimalInput(element, animalId) {
  element.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.isPrimary === false) return;
    if (state.locked) return;
    const animal = state.animalById.get(animalId);
    if (!animal || !animal.active || animal.busy) return;
    element.classList.add("is-pressing");
  });

  element.addEventListener("pointerup", () => {
    element.classList.remove("is-pressing");
  });

  element.addEventListener("pointercancel", () => {
    element.classList.remove("is-pressing");
  });

  element.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse") element.classList.remove("is-pressing");
  });

  element.addEventListener("click", () => handleAnimalClick(animalId, element));
}

function playAnimalTapFeedback(element) {
  element.classList.remove("is-pressing");
  element.classList.add("is-activated");
  window.setTimeout(() => {
    element.classList.remove("is-activated");
  }, 140);
}

function setPlayArea(area) {
  const playArea = area ?? { x: 0, y: 0, cols: BOARD.cols, rows: BOARD.rows };
  pasture.style.setProperty("--area-x", playArea.x);
  pasture.style.setProperty("--area-y", playArea.y);
  pasture.style.setProperty("--area-cols", playArea.cols);
  pasture.style.setProperty("--area-rows", playArea.rows);
}

function renderPlayArea() {
  const area = document.createElement("span");
  area.className = "play-area";
  pasture.appendChild(area);
}

function tryMove(animal, element) {
  const blocker = findBlocker(animal);
  if (blocker) {
    resetCombo();
    updateHud();
    crashAnimal(animal, element, blocker);
    showToast("撞到前面的小猪了");
    return;
  }

  exitAnimal(animal, element);
}

function findBlocker(animal) {
  return findBlockerInAnimals(
    state.animals,
    animal,
    getActiveCellOccupancy(state.animals, animal),
  );
}

function findBlockerInAnimals(animals, animal, occupancy = null) {
  const dir = DIRS[animal.dir];
  const occupiedCells = occupancy ?? getActiveCellOccupancy(animals, animal);
  for (let step = 1; ; step += 1) {
    const movedAnimal = {
      ...animal,
      x: animal.x + dir.dx * step,
      y: animal.y + dir.dy * step,
    };
    if (!isAnimalOnPlayableCells(movedAnimal)) return null;

    const x = animal.x + dir.dx * step;
    const y = animal.y + dir.dy * step;
    if (occupiedCells.has(getCellKey({ x, y }))) {
      return { x, y, openCells: step - 1 };
    }
  }
}

function getActiveCellOccupancy(animals, excludedAnimal = null) {
  const occupiedCells = new Set();
  animals.forEach((animal) => {
    if (!animal.active || isSameAnimal(animal, excludedAnimal)) return;
    getFootprint(animal).forEach((cell) => occupiedCells.add(getCellKey(cell)));
  });
  return occupiedCells;
}

function exitAnimal(animal, element) {
  const dir = DIRS[animal.dir];
  const animalType = getAnimalType(animal);
  const cellsToEdge = getExitTravelCells(animal);
  const moveMs = getMoveDuration(animalType, cellsToEdge);

  setMotion(element, moveMs, MOVE_EASING.run);
  setRunOffset(element, dir, cellsToEdge);
  element.classList.add("is-leaving", "is-running");
  const center = getAnimalCenter(animal);
  spawnRunTrail(center, dir, cellsToEdge, animalType);

  animal.active = false;
  state.cleared += 1;
  addExitScore();
  updateHud();

  window.setTimeout(() => {
    element.remove();
    checkLevelComplete();
  }, moveMs);
}

function removeAnimal(animal, element) {
  animal.busy = true;
  const animalType = getAnimalType(animal);
  const center = getAnimalCenter(animal);
  spawnBurst(center.x, center.y, animalType, "remove");
  element.classList.add("is-removed");
  animal.active = false;
  state.cleared += 1;
  state.score += SCORE_RULES.removeScore;
  updateHud();

  window.setTimeout(() => {
    element.remove();
    checkLevelComplete();
  }, 280);
}

function crashAnimal(animal, element, blocker) {
  animal.busy = true;
  const dir = DIRS[animal.dir];
  const animalType = getAnimalType(animal);
  const travelCells = blocker.openCells;
  const bumpCells = travelCells + 0.34;
  const center = getAnimalCenter(animal);
  const travelMs = getCrashMoveDuration(animalType, travelCells);
  const bumpMs = animalType.crashBumpMs;
  const settleMs = animalType.crashBumpMs;

  animal.x += dir.dx * travelCells;
  animal.y += dir.dy * travelCells;
  element.classList.add("is-crashing");
  spawnRunTrail(
    center,
    dir,
    Math.max(travelCells, 1),
    animalType,
    animalType.crashMoveMsPerCell,
  );
  setMotion(element, travelMs, MOVE_EASING.crashTravel);
  setRunOffset(element, dir, travelCells);

  window.setTimeout(() => {
    setMotion(element, bumpMs, MOVE_EASING.crashBump);
    setRunOffset(element, dir, bumpCells);
  }, travelMs);

  window.setTimeout(() => {
    setMotion(element, settleMs, MOVE_EASING.crashSettle);
    setRunOffset(element, dir, travelCells);
    const crashX = center.x + dir.dx * (travelCells + 0.62);
    const crashY = center.y + dir.dy * (travelCells + 0.62);
    spawnCrashStars(crashX, crashY, animalType);
  }, travelMs + bumpMs);

  window.setTimeout(() => {
    animal.stunned = true;
    animal.busy = false;
    settleCrashedAnimalElement(animal, element);

    window.setTimeout(() => {
      animal.stunned = false;
      if (!animal.busy && animal.active) {
        element.classList.remove("is-stunned");
      }
    }, animalType.stunMs);
  }, travelMs + bumpMs + settleMs);
}

function settleCrashedAnimalElement(animal, element) {
  const center = getAnimalCenter(animal);
  element.classList.remove("is-crashing", "is-pressing", "is-activated");
  element.classList.add("is-stunned");
  element.style.setProperty("--x", center.x);
  element.style.setProperty("--y", center.y);
  element.style.setProperty("--z", Math.round(center.y * 2 + 10));
  element.style.setProperty("--move-ms", "0ms");
  element.style.setProperty("--run-x", "0px");
  element.style.setProperty("--run-y", "0px");
}

function checkLevelComplete() {
  if (state.cleared === state.animals.length) {
    state.locked = true;
    state.toolMode = null;
    updateToolState();
    const earnedStars = getEarnedStars(state.score, state.starThresholds, true);
    saveLevelResult(state.levelIndex, state.score, earnedStars);
    updateHud();
    showLevelCompleteModal(earnedStars);
  }
}

function spawnBurst(x, y, animalType, kind) {
  const puff = document.createElement("span");
  puff.className = `effect-burst ${kind}`;
  puff.style.setProperty("--x", x);
  puff.style.setProperty("--y", y);
  puff.style.setProperty("--burst-color", animalType.burstColor);
  pasture.appendChild(puff);
  window.setTimeout(() => puff.remove(), 540);
}

function spawnRunTrail(center, dir, cells, animalType, msPerCell = animalType.moveMsPerCell) {
  const count = Math.max(1, Math.ceil(cells / animalType.trailEveryCells));
  const side = { x: -dir.dy, y: dir.dx };
  for (let index = 0; index < count; index += 1) {
    const step = Math.min(cells, index * animalType.trailEveryCells);
    const delay = getMoveDuration(animalType, step, msPerCell);
    window.setTimeout(() => {
      const trail = document.createElement("span");
      const sideOffset = index % 2 === 0 ? -0.16 : 0.16;
      trail.className = "effect-trail";
      trail.style.setProperty("--x", center.x + dir.dx * step + side.x * sideOffset);
      trail.style.setProperty("--y", center.y + dir.dy * step + side.y * sideOffset);
      trail.style.setProperty("--trail-color", animalType.trailColor);
      trail.style.setProperty("--dust-scale", index % 3 === 0 ? "0.52" : "0.38");
      pasture.appendChild(trail);
      window.setTimeout(() => trail.remove(), 520);
    }, delay);
  }
}

function spawnCrashStars(x, y, animalType) {
  const stars = document.createElement("span");
  stars.className = "effect-stars";
  stars.style.setProperty("--x", x);
  stars.style.setProperty("--y", y);
  stars.style.setProperty("--stun-color", animalType.stunColor);
  pasture.appendChild(stars);
  window.setTimeout(() => stars.remove(), 760);
}

function getFootprint(animal) {
  const dir = DIRS[animal.dir];
  return [
    { x: animal.x, y: animal.y },
    { x: animal.x - dir.dx, y: animal.y - dir.dy },
  ];
}

function isInsideBoardCell(x, y) {
  return x >= 0 && x < BOARD.cols && y >= 0 && y < BOARD.rows;
}

function isCornerCutoutCell(x, y) {
  const arcStart = CORNER_CUTOUT.arcStartCell;
  const left = x < arcStart;
  const right = x >= BOARD.cols - arcStart;
  const top = y < arcStart;
  const bottom = y >= BOARD.rows - arcStart;
  if (!(left || right) || !(top || bottom)) return false;

  const centerX = left ? arcStart : BOARD.cols - arcStart;
  const centerY = top ? arcStart : BOARD.rows - arcStart;
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

function getExitTravelCells(animal) {
  const dir = DIRS[animal.dir];
  for (let step = 1; ; step += 1) {
    const movedAnimal = {
      ...animal,
      x: animal.x + dir.dx * step,
      y: animal.y + dir.dy * step,
    };
    if (!isAnimalOnPlayableCells(movedAnimal)) return step + 1;
  }
}

function getAnimalCenter(animal) {
  const cells = getFootprint(animal);
  const x = cells.reduce((sum, cell) => sum + cell.x + 0.5, 0) / cells.length;
  const y = cells.reduce((sum, cell) => sum + cell.y + 0.5, 0) / cells.length;
  return { x, y };
}

function getAnimalType(animal) {
  return ANIMAL_TYPES[animal.type] ?? ANIMAL_TYPES.pig;
}

function getMoveDuration(animalType, cells, msPerCell = animalType.moveMsPerCell) {
  return Math.max(0, Math.round(cells * msPerCell));
}

function getCrashMoveDuration(animalType, cells) {
  return getMoveDuration(animalType, cells, animalType.crashMoveMsPerCell);
}

function setMotion(element, durationMs, easing) {
  element.style.setProperty("--move-ms", `${durationMs}ms`);
  element.style.setProperty("--move-ease", easing);
}

function setRunOffset(element, dir, cells) {
  element.style.setProperty("--run-x", `calc(${dir.dx * cells} * var(--cell))`);
  element.style.setProperty("--run-y", `calc(${dir.dy * cells} * var(--cell))`);
}

function updateHud() {
  clearedCount.textContent = state.cleared;
  scoreCount.textContent = state.score;
  starTarget.textContent = `3★${formatScoreShort(state.starThresholds[2])}`;
  totalStarsCount.textContent = getTotalStars();
}

function showLevelCompleteModal(stars) {
  const starTargets = [
    "通关",
    formatScoreShort(state.starThresholds[1]),
    formatScoreShort(state.starThresholds[2]),
  ];
  completeStars.innerHTML = [1, 2, 3].map((star) => `
    <span class="complete-star-item ${star <= stars ? "is-earned" : ""}">
      <span class="complete-star-icon">★</span>
      <span class="complete-star-target">${starTargets[star - 1]}</span>
    </span>
  `).join("");
  completeStars.style.setProperty("--star-progress", `${(stars - 1) * 36}%`);
  completeStars.setAttribute("aria-label", `本关获得${stars}星`);
  completeScore.textContent = `${state.score}分`;
  const hasNextLevel = state.levelIndex + 1 < LEVELS.length;
  nextLevelBtn.disabled = !hasNextLevel;
  levelCompleteModal.hidden = false;
}

function hideLevelCompleteModal() {
  levelCompleteModal.hidden = true;
}

function addExitScore() {
  state.combo += 1;
  state.score += getExitScoreForCombo(state.combo);
  showComboBurst(state.combo);
}

function getExitScoreForCombo(combo) {
  return SCORE_RULES.exitBase + Math.max(0, combo - 1) * SCORE_RULES.comboBonus;
}

function resetCombo() {
  const hadCombo = state.combo >= 5;
  state.combo = 0;
  if (hadCombo) {
    showComboBreak();
    return;
  }
  hideComboBurst();
}

function showComboBurst(combo) {
  comboCount.textContent = `x${combo}`;
  comboBurst.classList.toggle("is-visible", combo >= 5);
  comboBurst.classList.toggle("is-warm", combo >= 10);
  comboBurst.classList.toggle("is-hot", combo >= 8);
  comboBurst.classList.toggle("is-blazing", combo >= 16);
  comboBurst.classList.toggle("is-inferno", combo >= 30);
  comboBurst.classList.remove("is-breaking");
  comboBurst.classList.remove("is-popping");
  void comboBurst.offsetWidth;
  comboBurst.classList.add("is-popping");
}

function hideComboBurst() {
  comboBurst.classList.remove(
    "is-visible",
    "is-warm",
    "is-hot",
    "is-blazing",
    "is-inferno",
    "is-breaking",
    "is-popping",
  );
}

function showComboBreak() {
  comboCount.textContent = "连击断啦";
  comboBurst.classList.remove("is-warm", "is-hot", "is-blazing", "is-inferno", "is-popping");
  comboBurst.classList.add("is-visible", "is-breaking");
  window.setTimeout(() => {
    if (state.combo === 0) {
      hideComboBurst();
    }
  }, 600);
}

function getStarThresholds(level) {
  if (level.starThresholds) return level.starThresholds;
  return [
    0,
    roundScoreThreshold(
      level.animals.length * getAverageScorePerAnimal(
        STAR_RULES.twoStarAverageCombo,
      ),
    ),
    getPerfectScore(level.animals.length),
  ];
}

function getAverageScorePerAnimal(averageCombo) {
  return SCORE_RULES.exitBase + ((averageCombo - 1) * SCORE_RULES.comboBonus) / 2;
}

function roundScoreThreshold(score) {
  return Math.round(score / STAR_RULES.roundTo) * STAR_RULES.roundTo;
}

function getPerfectScore(animalCount) {
  return (
    animalCount * SCORE_RULES.exitBase +
    (SCORE_RULES.comboBonus * animalCount * (animalCount - 1)) / 2
  );
}

function getEarnedStars(score, thresholds, isComplete = false) {
  if (!isComplete) return 0;
  if (score >= thresholds[2]) return 3;
  if (score >= thresholds[1]) return 2;
  return 1;
}

function getStarText(stars) {
  return "★".repeat(stars) + "☆".repeat(3 - stars);
}

function formatScoreShort(score) {
  if (score < 10000) return String(score);
  const value = score / 10000;
  return `${Number(value.toFixed(value >= 10 ? 1 : 2))}万`;
}

function renderLevelSelect() {
  const firstUnclearedLevelIndex = getFirstUnclearedLevelIndex();
  const options = LEVELS.map((level, index) => ({ level, index })).filter(
    ({ index }) => isLevelVisible(index, firstUnclearedLevelIndex),
  );

  levelSelect.innerHTML = options.map(({ level, index }) => {
    const bestStars = state.bestByLevel[level.id]?.stars ?? 0;
    const starsText = bestStars > 0 ? ` ${getStarText(bestStars)}` : " ☆☆☆";
    return `<option value="${index}">${level.name}${starsText}</option>`;
  }).join("");
}

function isLevelVisible(index, firstUnclearedLevelIndex = getFirstUnclearedLevelIndex()) {
  if (index === state.levelIndex) return true;
  if (index === 0) return true;
  const level = LEVELS[index];
  if ((state.bestByLevel[level.id]?.stars ?? 0) > 0) return true;
  return isLevelUnlocked(index) && index === firstUnclearedLevelIndex;
}

function isLevelUnlocked(index) {
  if (index === 0) return true;
  return (state.bestByLevel[LEVELS[index - 1].id]?.stars ?? 0) > 0;
}

function getFirstUnclearedLevelIndex() {
  const index = LEVELS.findIndex(
    (level) => (state.bestByLevel[level.id]?.stars ?? 0) === 0,
  );
  return index === -1 ? LEVELS.length - 1 : index;
}

function loadProgress() {
  try {
    return JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function saveProgress() {
  try {
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify(state.bestByLevel),
    );
  } catch {
    showToast("本地记录暂时无法保存");
  }
}

function saveLevelResult(levelIndex, score, stars) {
  const level = LEVELS[levelIndex];
  const previous = state.bestByLevel[level.id] ?? { stars: 0, score: 0 };
  state.bestByLevel[level.id] = {
    stars: Math.max(previous.stars, stars),
    score: Math.max(previous.score, score),
  };
  saveProgress();
  renderLevelSelect();
  renderStartScreen();
  levelSelect.value = String(levelIndex);
}

function getTotalStars() {
  return Object.values(state.bestByLevel).reduce(
    (total, result) => total + (result.stars ?? 0),
    0,
  );
}

let toastTimer = 0;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1700);
}

restartBtn.addEventListener("click", () => {
  initLevel(state.levelIndex);
});

levelSelect.addEventListener("change", () => {
  initLevel(Number(levelSelect.value));
});

removeTool.addEventListener("click", () => {
  setToolMode(state.toolMode === "remove" ? null : "remove");
  showToast(state.toolMode === "remove" ? "选择一只小猪移除" : "已取消移除");
});

replayLevelBtn.addEventListener("click", () => {
  initLevel(state.levelIndex);
});

nextLevelBtn.addEventListener("click", () => {
  if (state.levelIndex + 1 >= LEVELS.length) return;
  initLevel(state.levelIndex + 1);
});

startGameBtn.addEventListener("click", () => {
  document.body.classList.remove("is-starting");
  initLevel(DEFAULT_LEVEL_INDEX);
});

function setToolMode(mode) {
  state.toolMode = mode;
  updateToolState();
}

function updateToolState() {
  pasture.classList.toggle("is-targeting", Boolean(state.toolMode));
  removeTool.classList.toggle("is-selected", state.toolMode === "remove");
  removeTool.setAttribute(
    "aria-pressed",
    state.toolMode === "remove" ? "true" : "false",
  );
}

function getCellKey(cell) {
  return `${cell.x},${cell.y}`;
}

function isSameAnimal(first, second) {
  if (!first || !second) return false;
  if (first.index !== undefined && second.index !== undefined) {
    return first.index === second.index;
  }
  if (first.id !== undefined && second.id !== undefined) return first.id === second.id;
  return first === second;
}

function renderStartScreen() {
  startTotalStars.textContent = getTotalStars();
  const clearedLevels = LEVELS.filter(
    (level) => (state.bestByLevel[level.id]?.stars ?? 0) > 0,
  ).length;
  startClearedLevels.textContent = clearedLevels;
}

renderStartScreen();
