const DIRS = {
  up: { dx: 0, dy: -1, rot: "0deg", label: "上" },
  right: { dx: 1, dy: 0, rot: "90deg", label: "右" },
  down: { dx: 0, dy: 1, rot: "180deg", label: "下" },
  left: { dx: -1, dy: 0, rot: "270deg", label: "左" },
};

const ANIMAL_TYPES = {
  pig: {
    className: "animal-pig",
    moveMsPerCell: 105,
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

const PATH_EXIT = {
  roadOffsetCells: 0.85,
  gateYCells: -0.85,
  gateExitYCells: -2.35,
  turnPauseMs: 36,
  fadeMs: 220,
};

const BOARD = {
  cols: 12,
  rows: 19,
};

const CORNER_CUTOUT = {
  arcStartCell: 2,
};

const SCORE_RULES = {
  comboScoreEarly: 5,
  comboScoreMid: 10,
  comboScoreLate: 15,
  removeScore: -1000,
  undoScore: -500,
};

const TOOL_LIMITS = {
  remove: 2,
};

const COLLECTION_UNLOCK_STEP = 5;

const COLLECTION_ITEMS = {
  remove: {
    name: "移除",
    type: "tool",
    typeName: "道具",
    description: "选择一只小猪直接移除。",
    guide: "点击移除任意一只小猪。",
    costText: "每关2次",
    requiredStars: 0,
    icon: "●",
    starter: true,
  },
  firecracker: {
    name: "炮仗",
    type: "ability",
    typeName: "能力",
    description: "让可直接出栏的小猪批量逃离。",
    guide: "使用炮仗后，当前界面上前方没有阻挡的小猪会自动逃离。本次只判断点击时已经能逃离的小猪，不触发连锁反应。",
    costText: "当前可逃",
    requiredStars: 5,
    icon: "!",
    image: "./assets/optimized/firecracker-prop-96.png",
  },
  mysteryTool10: {
    name: "神秘道具",
    type: "tool",
    typeName: "道具",
    description: "后续配置新道具。",
    guide: "这里会放后续新增的道具规则。",
    costText: "待配置",
    requiredStars: 10,
    icon: "?",
    placeholder: true,
  },
  mysteryTool15: {
    name: "神秘道具",
    type: "tool",
    typeName: "道具",
    description: "后续配置新道具。",
    guide: "这里会放后续新增的道具规则。",
    costText: "待配置",
    requiredStars: 15,
    icon: "?",
    placeholder: true,
  },
  mysteryTool20: {
    name: "神秘道具",
    type: "tool",
    typeName: "道具",
    description: "后续配置新道具。",
    guide: "这里会放后续新增的道具规则。",
    costText: "待配置",
    requiredStars: 20,
    icon: "?",
    placeholder: true,
  },
  mysteryTool25: {
    name: "神秘道具",
    type: "tool",
    typeName: "道具",
    description: "后续配置新道具。",
    guide: "这里会放后续新增的道具规则。",
    costText: "待配置",
    requiredStars: 25,
    icon: "?",
    placeholder: true,
  },
  mysteryTool30: {
    name: "神秘道具",
    type: "tool",
    typeName: "道具",
    description: "后续配置新道具。",
    guide: "这里会放后续新增的道具规则。",
    costText: "待配置",
    requiredStars: 30,
    icon: "?",
    placeholder: true,
  },
  mysteryTool35: {
    name: "神秘道具",
    type: "tool",
    typeName: "道具",
    description: "后续配置新道具。",
    guide: "这里会放后续新增的道具规则。",
    costText: "待配置",
    requiredStars: 35,
    icon: "?",
    placeholder: true,
  },
  mysteryTool40: {
    name: "神秘道具",
    type: "tool",
    typeName: "道具",
    description: "后续配置新道具。",
    guide: "这里会放后续新增的道具规则。",
    costText: "待配置",
    requiredStars: 40,
    icon: "?",
    placeholder: true,
  },
};

const TOOL_UNLOCKS = COLLECTION_ITEMS;
const TOOL_UNLOCK_GRID_SIZE = 9;

const STAR_RULES = {
  twoStarRatio: 0.68,
  threeStarAverageComboByLevel: [
    9, 11, 13, 15, 17,
    18, 19, 20, 22, 23,
    24, 25, 26, 27, 28,
  ],
  fallbackThreeStarAverageCombo: 28,
  roundTo: 50,
};

const PROGRESS_STORAGE_KEY = "pigEscapeLevelProgressV1";
const FIRECRACKER_POSITION_KEY = "pigEscapeFirecrackerPositionV1";
const EQUIPPED_SKIN_STORAGE_KEY = "pigEscapeEquippedSkinV1";
const UNLOCKED_COLLECTION_STORAGE_KEY = "pigEscapeUnlockedCollectionV1";
const ENABLED_ABILITIES_STORAGE_KEY = "pigEscapeEnabledAbilitiesV1";
const EQUIPPED_TOOLS_STORAGE_KEY = "pigEscapeEquippedToolsV1";
const DEFAULT_LEVEL_INDEX = 0;
const MAX_EQUIPPED_TOOLS = 2;

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
      { x: 6, y: 9, dir: "up" },
      { x: 7, y: 8, dir: "right" },
      { x: 5, y: 8, dir: "right" },
      { x: 5, y: 9, dir: "up" },
      { x: 7, y: 10, dir: "left" },
      { x: 4, y: 9, dir: "up" },
      { x: 4, y: 11, dir: "left" },
      { x: 5, y: 7, dir: "left" },
      { x: 3, y: 7, dir: "left" },
      { x: 3, y: 10, dir: "up" },
      { x: 4, y: 12, dir: "up" },
      { x: 5, y: 12, dir: "left" },
      { x: 7, y: 7, dir: "left" },
      { x: 3, y: 9, dir: "right" },
      { x: 8, y: 9, dir: "right" },
      { x: 7, y: 11, dir: "up" },
      { x: 9, y: 8, dir: "right" },
      { x: 5, y: 13, dir: "left" },
      { x: 9, y: 10, dir: "down" },
      { x: 7, y: 13, dir: "left" },
      { x: 7, y: 6, dir: "right" },
      { x: 3, y: 8, dir: "right" },
      { x: 9, y: 6, dir: "right" },
      { x: 5, y: 5, dir: "up" },
      { x: 8, y: 11, dir: "up" },
      { x: 2, y: 10, dir: "up" },
      { x: 6, y: 4, dir: "right" },
      { x: 7, y: 4, dir: "up" },
      { x: 5, y: 14, dir: "up" },
      { x: 6, y: 14, dir: "left" },
    ]
  },
  {
    id: 2,
    name: "第2关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      { x: 6, y: 11, dir: "down" },
      { x: 4, y: 10, dir: "right" },
      { x: 3, y: 9, dir: "down" },
      { x: 1, y: 8, dir: "left" },
      { x: 1, y: 7, dir: "down" },
      { x: 5, y: 6, dir: "left" },
      { x: 5, y: 10, dir: "up" },
      { x: 4, y: 7, dir: "left" },
      { x: 8, y: 6, dir: "left" },
      { x: 3, y: 6, dir: "down" },
      { x: 8, y: 16, dir: "up" },
      { x: 7, y: 16, dir: "right" },
      { x: 7, y: 11, dir: "down" },
      { x: 6, y: 14, dir: "down" },
      { x: 7, y: 13, dir: "down" },
      { x: 8, y: 14, dir: "up" },
      { x: 6, y: 9, dir: "down" },
      { x: 4, y: 12, dir: "left" },
      { x: 8, y: 12, dir: "up" },
      { x: 8, y: 9, dir: "up" },
      { x: 8, y: 4, dir: "up" },
      { x: 3, y: 13, dir: "left" },
      { x: 8, y: 7, dir: "up" },
      { x: 5, y: 3, dir: "right" },
      { x: 9, y: 12, dir: "left" },
      { x: 9, y: 8, dir: "down" },
      { x: 4, y: 15, dir: "up" },
      { x: 5, y: 17, dir: "right" },
      { x: 7, y: 5, dir: "down" },
      { x: 3, y: 4, dir: "right" },
      { x: 4, y: 14, dir: "right" },
      { x: 5, y: 2, dir: "left" },
      { x: 2, y: 2, dir: "down" },
      { x: 9, y: 15, dir: "down" },
      { x: 8, y: 2, dir: "left" },
      { x: 10, y: 15, dir: "down" },
      { x: 3, y: 16, dir: "right" },
      { x: 2, y: 11, dir: "down" },
      { x: 2, y: 15, dir: "right" },
      { x: 9, y: 5, dir: "left" },
    ]
  },
  {
    id: 3,
    name: "第3关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      { x: 7, y: 10, dir: "right" },
      { x: 5, y: 10, dir: "right" },
      { x: 4, y: 13, dir: "up" },
      { x: 4, y: 15, dir: "up" },
      { x: 10, y: 9, dir: "up" },
      { x: 10, y: 4, dir: "up" },
      { x: 1, y: 16, dir: "right" },
      { x: 10, y: 3, dir: "right" },
      { x: 1, y: 6, dir: "down" },
      { x: 10, y: 6, dir: "left" },
      { x: 6, y: 6, dir: "left" },
      { x: 11, y: 4, dir: "down" },
      { x: 3, y: 6, dir: "left" },
      { x: 7, y: 4, dir: "right" },
      { x: 9, y: 9, dir: "up" },
      { x: 9, y: 7, dir: "up" },
      { x: 1, y: 13, dir: "down" },
      { x: 3, y: 16, dir: "right" },
      { x: 1, y: 10, dir: "down" },
      { x: 6, y: 5, dir: "right" },
      { x: 1, y: 15, dir: "down" },
      { x: 1, y: 8, dir: "down" },
      { x: 9, y: 5, dir: "right" },
      { x: 4, y: 5, dir: "right" },
      { x: 4, y: 11, dir: "up" },
      { x: 6, y: 8, dir: "up" },
      { x: 5, y: 8, dir: "up" },
      { x: 3, y: 9, dir: "right" },
      { x: 7, y: 11, dir: "left" },
      { x: 9, y: 11, dir: "up" },
      { x: 2, y: 8, dir: "down" },
      { x: 6, y: 15, dir: "right" },
      { x: 5, y: 17, dir: "left" },
      { x: 10, y: 1, dir: "up" },
      { x: 7, y: 16, dir: "right" },
      { x: 5, y: 13, dir: "up" },
      { x: 2, y: 3, dir: "down" },
      { x: 5, y: 3, dir: "right" },
      { x: 7, y: 12, dir: "right" },
      { x: 1, y: 3, dir: "right" },
      { x: 7, y: 13, dir: "up" },
      { x: 0, y: 13, dir: "up" },
      { x: 7, y: 2, dir: "left" },
      { x: 0, y: 4, dir: "up" },
      { x: 3, y: 2, dir: "left" },
      { x: 3, y: 11, dir: "up" },
      { x: 7, y: 7, dir: "left" },
      { x: 9, y: 13, dir: "right" },
      { x: 10, y: 11, dir: "up" },
      { x: 0, y: 8, dir: "up" },
    ]
  },
  {
    id: 4,
    name: "第4关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      { x: 2, y: 13, dir: "right" },
      { x: 2, y: 11, dir: "down" },
      { x: 9, y: 13, dir: "right" },
      { x: 5, y: 10, dir: "left" },
      { x: 5, y: 13, dir: "up" },
      { x: 8, y: 11, dir: "left" },
      { x: 8, y: 4, dir: "down" },
      { x: 8, y: 7, dir: "down" },
      { x: 6, y: 11, dir: "up" },
      { x: 4, y: 13, dir: "right" },
      { x: 1, y: 12, dir: "right" },
      { x: 4, y: 3, dir: "right" },
      { x: 3, y: 9, dir: "up" },
      { x: 4, y: 9, dir: "down" },
      { x: 3, y: 6, dir: "up" },
      { x: 8, y: 10, dir: "down" },
      { x: 2, y: 5, dir: "down" },
      { x: 4, y: 5, dir: "down" },
      { x: 2, y: 2, dir: "down" },
      { x: 4, y: 2, dir: "left" },
      { x: 5, y: 6, dir: "up" },
      { x: 6, y: 6, dir: "left" },
      { x: 7, y: 13, dir: "up" },
      { x: 7, y: 11, dir: "up" },
      { x: 0, y: 3, dir: "down" },
      { x: 2, y: 7, dir: "down" },
      { x: 0, y: 9, dir: "down" },
      { x: 0, y: 6, dir: "down" },
      { x: 9, y: 7, dir: "down" },
      { x: 2, y: 14, dir: "right" },
      { x: 9, y: 4, dir: "down" },
      { x: 10, y: 3, dir: "up" },
      { x: 3, y: 15, dir: "right" },
      { x: 5, y: 1, dir: "left" },
      { x: 7, y: 2, dir: "left" },
      { x: 10, y: 5, dir: "left" },
      { x: 11, y: 3, dir: "down" },
      { x: 9, y: 1, dir: "left" },
      { x: 2, y: 16, dir: "right" },
      { x: 5, y: 16, dir: "up" },
      { x: 10, y: 7, dir: "up" },
      { x: 10, y: 14, dir: "up" },
      { x: 10, y: 9, dir: "up" },
      { x: 9, y: 15, dir: "right" },
      { x: 9, y: 16, dir: "right" },
      { x: 11, y: 12, dir: "down" },
      { x: 1, y: 2, dir: "down" },
      { x: 9, y: 17, dir: "left" },
      { x: 3, y: 17, dir: "up" },
      { x: 8, y: 18, dir: "left" },
      { x: 0, y: 16, dir: "down" },
      { x: 4, y: 18, dir: "left" },
      { x: 11, y: 8, dir: "down" },
      { x: 4, y: 0, dir: "left" },
      { x: 1, y: 8, dir: "down" },
      { x: 6, y: 17, dir: "up" },
      { x: 8, y: 0, dir: "left" },
      { x: 6, y: 5, dir: "left" },
      { x: 11, y: 15, dir: "down" },
      { x: 0, y: 11, dir: "down" },
    ]
  },
  {
    id: 5,
    name: "第5关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      { x: 5, y: 14, dir: "down" },
      { x: 5, y: 11, dir: "down" },
      { x: 3, y: 10, dir: "right" },
      { x: 5, y: 18, dir: "down" },
      { x: 3, y: 12, dir: "up" },
      { x: 2, y: 13, dir: "right" },
      { x: 2, y: 15, dir: "up" },
      { x: 3, y: 16, dir: "up" },
      { x: 4, y: 16, dir: "left" },
      { x: 9, y: 15, dir: "left" },
      { x: 6, y: 15, dir: "left" },
      { x: 10, y: 7, dir: "down" },
      { x: 5, y: 7, dir: "right" },
      { x: 5, y: 2, dir: "down" },
      { x: 4, y: 10, dir: "up" },
      { x: 9, y: 7, dir: "right" },
      { x: 8, y: 14, dir: "left" },
      { x: 10, y: 14, dir: "down" },
      { x: 9, y: 11, dir: "left" },
      { x: 7, y: 11, dir: "left" },
      { x: 6, y: 10, dir: "down" },
      { x: 10, y: 10, dir: "down" },
      { x: 3, y: 9, dir: "right" },
      { x: 6, y: 2, dir: "down" },
      { x: 8, y: 2, dir: "down" },
      { x: 1, y: 16, dir: "up" },
      { x: 7, y: 4, dir: "down" },
      { x: 6, y: 6, dir: "right" },
      { x: 9, y: 5, dir: "down" },
      { x: 6, y: 5, dir: "right" },
      { x: 9, y: 2, dir: "down" },
      { x: 7, y: 13, dir: "right" },
      { x: 9, y: 16, dir: "left" },
      { x: 10, y: 3, dir: "down" },
      { x: 4, y: 4, dir: "right" },
      { x: 7, y: 9, dir: "down" },
      { x: 1, y: 12, dir: "right" },
      { x: 3, y: 5, dir: "right" },
      { x: 0, y: 10, dir: "down" },
      { x: 9, y: 17, dir: "left" },
      { x: 0, y: 6, dir: "down" },
      { x: 3, y: 3, dir: "right" },
      { x: 2, y: 7, dir: "right" },
      { x: 11, y: 14, dir: "down" },
      { x: 3, y: 1, dir: "right" },
      { x: 0, y: 4, dir: "down" },
      { x: 1, y: 8, dir: "right" },
      { x: 1, y: 2, dir: "right" },
      { x: 11, y: 3, dir: "down" },
      { x: 3, y: 15, dir: "left" },
      { x: 7, y: 18, dir: "right" },
      { x: 11, y: 10, dir: "down" },
      { x: 3, y: 0, dir: "right" },
      { x: 0, y: 16, dir: "down" },
      { x: 11, y: 5, dir: "down" },
      { x: 5, y: 0, dir: "right" },
      { x: 3, y: 18, dir: "right" },
      { x: 7, y: 1, dir: "down" },
      { x: 11, y: 12, dir: "right" },
      { x: 11, y: 7, dir: "down" },
      { x: 8, y: 12, dir: "right" },
      { x: 6, y: 8, dir: "down" },
      { x: 11, y: 16, dir: "down" },
      { x: 3, y: 7, dir: "up" },
      { x: 7, y: 17, dir: "left" },
      { x: 0, y: 11, dir: "left" },
      { x: 8, y: 4, dir: "down" },
      { x: 2, y: 4, dir: "right" },
      { x: 9, y: 18, dir: "right" },
      { x: 4, y: 2, dir: "up" },
    ]
  },
  {
    id: 6,
    name: "第6关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      { x: 6, y: 7, dir: "left" },
      { x: 6, y: 11, dir: "up" },
      { x: 6, y: 16, dir: "up" },
      { x: 4, y: 16, dir: "right" },
      { x: 2, y: 7, dir: "up" },
      { x: 3, y: 5, dir: "right" },
      { x: 7, y: 6, dir: "down" },
      { x: 4, y: 8, dir: "down" },
      { x: 2, y: 15, dir: "up" },
      { x: 3, y: 15, dir: "left" },
      { x: 4, y: 13, dir: "down" },
      { x: 2, y: 12, dir: "up" },
      { x: 6, y: 8, dir: "up" },
      { x: 3, y: 7, dir: "up" },
      { x: 3, y: 17, dir: "right" },
      { x: 4, y: 10, dir: "down" },
      { x: 6, y: 5, dir: "right" },
      { x: 7, y: 10, dir: "left" },
      { x: 9, y: 6, dir: "left" },
      { x: 8, y: 13, dir: "up" },
      { x: 8, y: 17, dir: "up" },
      { x: 7, y: 15, dir: "left" },
      { x: 9, y: 9, dir: "up" },
      { x: 10, y: 14, dir: "left" },
      { x: 6, y: 18, dir: "right" },
      { x: 6, y: 13, dir: "right" },
      { x: 7, y: 11, dir: "left" },
      { x: 9, y: 15, dir: "up" },
      { x: 3, y: 18, dir: "right" },
      { x: 10, y: 11, dir: "left" },
      { x: 10, y: 3, dir: "down" },
      { x: 7, y: 3, dir: "right" },
      { x: 5, y: 2, dir: "right" },
      { x: 4, y: 3, dir: "right" },
      { x: 10, y: 9, dir: "down" },
      { x: 11, y: 7, dir: "down" },
      { x: 7, y: 2, dir: "right" },
      { x: 2, y: 2, dir: "right" },
      { x: 1, y: 7, dir: "up" },
      { x: 0, y: 9, dir: "left" },
      { x: 11, y: 4, dir: "down" },
      { x: 1, y: 11, dir: "up" },
      { x: 4, y: 1, dir: "down" },
      { x: 11, y: 13, dir: "down" },
      { x: 2, y: 4, dir: "right" },
      { x: 7, y: 1, dir: "left" },
      { x: 1, y: 16, dir: "up" },
      { x: 0, y: 14, dir: "up" },
      { x: 0, y: 4, dir: "up" },
      { x: 8, y: 0, dir: "left" },
      { x: 3, y: 0, dir: "up" },
      { x: 1, y: 13, dir: "right" },
      { x: 9, y: 4, dir: "up" },
      { x: 0, y: 11, dir: "up" },
      { x: 10, y: 17, dir: "right" },
      { x: 10, y: 15, dir: "left" },
      { x: 1, y: 14, dir: "left" },
      { x: 6, y: 0, dir: "left" },
      { x: 0, y: 2, dir: "up" },
      { x: 2, y: 0, dir: "up" },
      { x: 5, y: 11, dir: "down" },
      { x: 9, y: 1, dir: "left" },
      { x: 10, y: 13, dir: "down" },
      { x: 0, y: 6, dir: "up" },
      { x: 11, y: 10, dir: "down" },
      { x: 7, y: 4, dir: "right" },
      { x: 10, y: 5, dir: "down" },
      { x: 8, y: 8, dir: "up" },
      { x: 3, y: 10, dir: "up" },
      { x: 7, y: 18, dir: "down" },
    ]
  },
  {
    id: 7,
    name: "第7关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      { x: 0, y: 10, dir: "up" },
      { x: 2, y: 10, dir: "left" },
      { x: 0, y: 4, dir: "left" },
      { x: 2, y: 12, dir: "up" },
      { x: 0, y: 13, dir: "up" },
      { x: 9, y: 13, dir: "left" },
      { x: 0, y: 5, dir: "up" },
      { x: 9, y: 17, dir: "up" },
      { x: 2, y: 14, dir: "left" },
      { x: 10, y: 16, dir: "up" },
      { x: 6, y: 17, dir: "right" },
      { x: 9, y: 14, dir: "left" },
      { x: 5, y: 14, dir: "left" },
      { x: 9, y: 16, dir: "right" },
      { x: 5, y: 16, dir: "right" },
      { x: 3, y: 17, dir: "right" },
      { x: 4, y: 13, dir: "left" },
      { x: 4, y: 10, dir: "down" },
      { x: 6, y: 10, dir: "left" },
      { x: 7, y: 18, dir: "right" },
      { x: 9, y: 10, dir: "left" },
      { x: 6, y: 9, dir: "left" },
      { x: 8, y: 9, dir: "down" },
      { x: 5, y: 8, dir: "down" },
      { x: 7, y: 13, dir: "up" },
      { x: 1, y: 8, dir: "right" },
      { x: 3, y: 18, dir: "right" },
      { x: 8, y: 7, dir: "left" },
      { x: 4, y: 8, dir: "right" },
      { x: 6, y: 7, dir: "down" },
      { x: 2, y: 5, dir: "left" },
      { x: 10, y: 11, dir: "up" },
      { x: 10, y: 6, dir: "left" },
      { x: 11, y: 10, dir: "up" },
      { x: 4, y: 4, dir: "left" },
      { x: 1, y: 16, dir: "up" },
      { x: 8, y: 5, dir: "down" },
      { x: 7, y: 12, dir: "right" },
      { x: 6, y: 1, dir: "down" },
      { x: 11, y: 15, dir: "up" },
      { x: 6, y: 4, dir: "down" },
      { x: 1, y: 15, dir: "right" },
      { x: 1, y: 3, dir: "right" },
      { x: 3, y: 1, dir: "right" },
      { x: 6, y: 11, dir: "right" },
      { x: 9, y: 3, dir: "up" },
      { x: 10, y: 9, dir: "left" },
      { x: 7, y: 0, dir: "left" },
      { x: 10, y: 5, dir: "left" },
      { x: 1, y: 6, dir: "up" },
      { x: 9, y: 2, dir: "left" },
      { x: 11, y: 2, dir: "up" },
      { x: 3, y: 2, dir: "left" },
      { x: 7, y: 1, dir: "up" },
      { x: 3, y: 13, dir: "down" },
      { x: 1, y: 1, dir: "up" },
      { x: 11, y: 12, dir: "up" },
      { x: 3, y: 0, dir: "left" },
      { x: 1, y: 9, dir: "left" },
      { x: 6, y: 15, dir: "right" },
      { x: 10, y: 7, dir: "left" },
      { x: 4, y: 6, dir: "down" },
      { x: 7, y: 7, dir: "up" },
      { x: 1, y: 12, dir: "up" },
      { x: 7, y: 4, dir: "up" },
      { x: 2, y: 6, dir: "left" },
      { x: 8, y: 2, dir: "down" },
      { x: 9, y: 0, dir: "up" },
      { x: 9, y: 8, dir: "up" },
      { x: 9, y: 15, dir: "right" },
    ]
  },
  {
    id: 8,
    name: "第8关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      { x: 6, y: 9, dir: "right" },
      { x: 5, y: 11, dir: "up" },
      { x: 7, y: 10, dir: "down" },
      { x: 7, y: 12, dir: "right" },
      { x: 5, y: 17, dir: "up" },
      { x: 11, y: 13, dir: "down" },
      { x: 7, y: 18, dir: "left" },
      { x: 8, y: 13, dir: "down" },
      { x: 8, y: 16, dir: "down" },
      { x: 5, y: 13, dir: "up" },
      { x: 10, y: 16, dir: "left" },
      { x: 11, y: 10, dir: "down" },
      { x: 3, y: 11, dir: "right" },
      { x: 10, y: 12, dir: "down" },
      { x: 9, y: 9, dir: "right" },
      { x: 10, y: 15, dir: "left" },
      { x: 9, y: 17, dir: "up" },
      { x: 7, y: 6, dir: "down" },
      { x: 10, y: 8, dir: "down" },
      { x: 5, y: 8, dir: "right" },
      { x: 3, y: 9, dir: "down" },
      { x: 1, y: 8, dir: "right" },
      { x: 4, y: 11, dir: "up" },
      { x: 1, y: 13, dir: "up" },
      { x: 5, y: 7, dir: "right" },
      { x: 4, y: 15, dir: "up" },
      { x: 0, y: 11, dir: "up" },
      { x: 2, y: 7, dir: "right" },
      { x: 3, y: 6, dir: "down" },
      { x: 6, y: 6, dir: "down" },
      { x: 3, y: 3, dir: "down" },
      { x: 1, y: 2, dir: "right" },
      { x: 5, y: 3, dir: "left" },
      { x: 10, y: 3, dir: "left" },
      { x: 2, y: 13, dir: "up" },
      { x: 3, y: 17, dir: "right" },
      { x: 1, y: 9, dir: "right" },
      { x: 6, y: 1, dir: "down" },
      { x: 1, y: 6, dir: "right" },
      { x: 9, y: 1, dir: "left" },
      { x: 11, y: 5, dir: "down" },
      { x: 3, y: 0, dir: "right" },
      { x: 9, y: 4, dir: "up" },
      { x: 1, y: 4, dir: "right" },
      { x: 0, y: 16, dir: "left" },
      { x: 3, y: 18, dir: "left" },
      { x: 0, y: 14, dir: "up" },
      { x: 7, y: 4, dir: "right" },
      { x: 5, y: 1, dir: "up" },
      { x: 8, y: 0, dir: "right" },
      { x: 6, y: 15, dir: "left" },
      { x: 8, y: 8, dir: "down" },
      { x: 1, y: 5, dir: "right" },
      { x: 8, y: 14, dir: "left" },
      { x: 11, y: 7, dir: "down" },
      { x: 9, y: 7, dir: "up" },
      { x: 8, y: 3, dir: "down" },
      { x: 2, y: 10, dir: "right" },
      { x: 7, y: 17, dir: "right" },
      { x: 3, y: 16, dir: "down" },
      { x: 2, y: 1, dir: "up" },
      { x: 6, y: 14, dir: "down" },
      { x: 3, y: 14, dir: "left" },
      { x: 9, y: 10, dir: "right" },
      { x: 10, y: 5, dir: "down" },
      { x: 0, y: 3, dir: "left" },
      { x: 7, y: 3, dir: "down" },
      { x: 10, y: 13, dir: "right" },
      { x: 4, y: 9, dir: "up" },
      { x: 5, y: 4, dir: "up" },
    ]
  },
  {
    id: 9,
    name: "第9关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      { x: 3, y: 8, dir: "left" },
      { x: 1, y: 9, dir: "down" },
      { x: 4, y: 15, dir: "up" },
      { x: 1, y: 12, dir: "down" },
      { x: 1, y: 15, dir: "right" },
      { x: 2, y: 9, dir: "left" },
      { x: 3, y: 14, dir: "up" },
      { x: 1, y: 14, dir: "right" },
      { x: 7, y: 8, dir: "left" },
      { x: 7, y: 4, dir: "down" },
      { x: 4, y: 12, dir: "up" },
      { x: 0, y: 9, dir: "down" },
      { x: 3, y: 12, dir: "right" },
      { x: 5, y: 9, dir: "left" },
      { x: 5, y: 13, dir: "up" },
      { x: 5, y: 3, dir: "right" },
      { x: 8, y: 9, dir: "left" },
      { x: 6, y: 13, dir: "up" },
      { x: 5, y: 16, dir: "up" },
      { x: 8, y: 6, dir: "down" },
      { x: 5, y: 4, dir: "right" },
      { x: 8, y: 11, dir: "left" },
      { x: 3, y: 17, dir: "right" },
      { x: 9, y: 5, dir: "down" },
      { x: 10, y: 8, dir: "left" },
      { x: 10, y: 6, dir: "left" },
      { x: 5, y: 10, dir: "up" },
      { x: 8, y: 3, dir: "down" },
      { x: 5, y: 6, dir: "up" },
      { x: 4, y: 5, dir: "right" },
      { x: 11, y: 3, dir: "down" },
      { x: 8, y: 13, dir: "left" },
      { x: 10, y: 7, dir: "left" },
      { x: 9, y: 2, dir: "down" },
      { x: 10, y: 10, dir: "left" },
      { x: 0, y: 6, dir: "down" },
      { x: 7, y: 1, dir: "right" },
      { x: 2, y: 4, dir: "right" },
      { x: 5, y: 2, dir: "right" },
      { x: 6, y: 16, dir: "up" },
      { x: 2, y: 7, dir: "up" },
      { x: 6, y: 4, dir: "up" },
      { x: 2, y: 1, dir: "right" },
      { x: 8, y: 16, dir: "left" },
      { x: 2, y: 2, dir: "right" },
      { x: 10, y: 12, dir: "up" },
      { x: 10, y: 15, dir: "right" },
      { x: 0, y: 13, dir: "down" },
      { x: 0, y: 4, dir: "down" },
      { x: 10, y: 16, dir: "left" },
      { x: 11, y: 12, dir: "down" },
      { x: 7, y: 18, dir: "right" },
      { x: 6, y: 0, dir: "right" },
      { x: 7, y: 12, dir: "right" },
      { x: 11, y: 14, dir: "down" },
      { x: 9, y: 0, dir: "right" },
      { x: 4, y: 18, dir: "right" },
      { x: 1, y: 17, dir: "down" },
      { x: 7, y: 7, dir: "left" },
      { x: 10, y: 1, dir: "up" },
      { x: 2, y: 11, dir: "left" },
      { x: 9, y: 18, dir: "right" },
      { x: 1, y: 6, dir: "down" },
      { x: 10, y: 17, dir: "right" },
      { x: 6, y: 10, dir: "up" },
      { x: 5, y: 1, dir: "right" },
      { x: 7, y: 14, dir: "down" },
      { x: 4, y: 0, dir: "right" },
      { x: 3, y: 6, dir: "left" },
      { x: 11, y: 5, dir: "down" },
      { x: 1, y: 13, dir: "left" },
      { x: 0, y: 11, dir: "down" },
      { x: 9, y: 12, dir: "right" },
      { x: 10, y: 9, dir: "left" },
      { x: 3, y: 7, dir: "left" },
      { x: 6, y: 6, dir: "left" },
      { x: 8, y: 17, dir: "right" },
      { x: 10, y: 14, dir: "right" },
      { x: 2, y: 3, dir: "right" },
      { x: 4, y: 10, dir: "up" },
    ]
  },
  {
    id: 10,
    name: "第10关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      { x: 7, y: 5, dir: "left" },
      { x: 7, y: 13, dir: "up" },
      { x: 1, y: 5, dir: "left" },
      { x: 4, y: 14, dir: "right" },
      { x: 4, y: 5, dir: "left" },
      { x: 8, y: 3, dir: "down" },
      { x: 4, y: 7, dir: "down" },
      { x: 3, y: 5, dir: "down" },
      { x: 7, y: 6, dir: "left" },
      { x: 2, y: 2, dir: "right" },
      { x: 2, y: 3, dir: "right" },
      { x: 7, y: 9, dir: "up" },
      { x: 3, y: 10, dir: "down" },
      { x: 6, y: 3, dir: "right" },
      { x: 5, y: 8, dir: "up" },
      { x: 5, y: 10, dir: "right" },
      { x: 6, y: 10, dir: "up" },
      { x: 5, y: 16, dir: "up" },
      { x: 6, y: 2, dir: "right" },
      { x: 1, y: 9, dir: "right" },
      { x: 9, y: 11, dir: "left" },
      { x: 9, y: 6, dir: "down" },
      { x: 0, y: 3, dir: "down" },
      { x: 8, y: 8, dir: "left" },
      { x: 1, y: 11, dir: "up" },
      { x: 10, y: 4, dir: "down" },
      { x: 10, y: 8, dir: "down" },
      { x: 4, y: 12, dir: "left" },
      { x: 1, y: 7, dir: "left" },
      { x: 6, y: 15, dir: "up" },
      { x: 11, y: 7, dir: "up" },
      { x: 9, y: 13, dir: "left" },
      { x: 9, y: 15, dir: "right" },
      { x: 1, y: 14, dir: "right" },
      { x: 10, y: 12, dir: "left" },
      { x: 4, y: 1, dir: "down" },
      { x: 6, y: 0, dir: "up" },
      { x: 2, y: 15, dir: "right" },
      { x: 11, y: 3, dir: "up" },
      { x: 1, y: 16, dir: "right" },
      { x: 3, y: 17, dir: "right" },
      { x: 8, y: 1, dir: "down" },
      { x: 0, y: 13, dir: "down" },
      { x: 3, y: 1, dir: "down" },
      { x: 7, y: 17, dir: "up" },
      { x: 3, y: 13, dir: "left" },
      { x: 3, y: 18, dir: "left" },
      { x: 11, y: 15, dir: "up" },
      { x: 10, y: 16, dir: "right" },
      { x: 8, y: 18, dir: "down" },
      { x: 8, y: 14, dir: "down" },
      { x: 1, y: 8, dir: "left" },
      { x: 6, y: 7, dir: "up" },
      { x: 9, y: 2, dir: "down" },
      { x: 11, y: 9, dir: "up" },
      { x: 5, y: 18, dir: "left" },
      { x: 2, y: 1, dir: "right" },
      { x: 2, y: 12, dir: "down" },
      { x: 0, y: 6, dir: "down" },
      { x: 5, y: 4, dir: "right" },
      { x: 9, y: 9, dir: "right" },
      { x: 0, y: 11, dir: "down" },
      { x: 11, y: 2, dir: "right" },
      { x: 3, y: 16, dir: "right" },
      { x: 7, y: 0, dir: "up" },
      { x: 10, y: 6, dir: "left" },
      { x: 10, y: 10, dir: "right" },
      { x: 7, y: 11, dir: "up" },
      { x: 3, y: 8, dir: "down" },
      { x: 10, y: 17, dir: "right" },
      { x: 10, y: 15, dir: "down" },
      { x: 10, y: 5, dir: "left" },
      { x: 4, y: 9, dir: "down" },
      { x: 2, y: 6, dir: "left" },
      { x: 1, y: 4, dir: "right" },
      { x: 5, y: 0, dir: "up" },
      { x: 7, y: 7, dir: "up" },
      { x: 3, y: 12, dir: "down" },
      { x: 11, y: 13, dir: "up" },
      { x: 5, y: 15, dir: "right" },
    ]
  },
    {
    id: 11,
    name: "第11关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      { x: 8, y: 7, dir: "right" },
      { x: 8, y: 14, dir: "up" },
      { x: 9, y: 6, dir: "up" },
      { x: 5, y: 14, dir: "right" },
      { x: 5, y: 17, dir: "up" },
      { x: 9, y: 5, dir: "right" },
      { x: 8, y: 18, dir: "left" },
      { x: 10, y: 13, dir: "left" },
      { x: 8, y: 8, dir: "up" },
      { x: 11, y: 6, dir: "down" },
      { x: 11, y: 8, dir: "down" },
      { x: 4, y: 16, dir: "up" },
      { x: 6, y: 16, dir: "left" },
      { x: 6, y: 8, dir: "down" },
      { x: 11, y: 10, dir: "down" },
      { x: 7, y: 17, dir: "left" },
      { x: 8, y: 10, dir: "up" },
      { x: 6, y: 10, dir: "down" },
      { x: 2, y: 7, dir: "right" },
      { x: 2, y: 4, dir: "down" },
      { x: 3, y: 8, dir: "right" },
      { x: 2, y: 1, dir: "down" },
      { x: 7, y: 13, dir: "up" },
      { x: 8, y: 4, dir: "left" },
      { x: 2, y: 9, dir: "right" },
      { x: 4, y: 0, dir: "left" },
      { x: 5, y: 8, dir: "up" },
      { x: 9, y: 16, dir: "left" },
      { x: 3, y: 11, dir: "up" },
      { x: 6, y: 3, dir: "left" },
      { x: 9, y: 12, dir: "left" },
      { x: 10, y: 5, dir: "down" },
      { x: 1, y: 5, dir: "down" },
      { x: 5, y: 2, dir: "up" },
      { x: 4, y: 12, dir: "left" },
      { x: 4, y: 4, dir: "up" },
      { x: 2, y: 13, dir: "left" },
      { x: 7, y: 2, dir: "left" },
      { x: 10, y: 9, dir: "down" },
      { x: 11, y: 4, dir: "down" },
      { x: 1, y: 12, dir: "left" },
      { x: 1, y: 11, dir: "right" },
      { x: 2, y: 16, dir: "left" },
      { x: 0, y: 9, dir: "down" },
      { x: 1, y: 2, dir: "down" },
      { x: 5, y: 5, dir: "up" },
      { x: 11, y: 15, dir: "right" },
      { x: 7, y: 0, dir: "up" },
      { x: 9, y: 1, dir: "left" },
      { x: 0, y: 3, dir: "down" },
      { x: 1, y: 15, dir: "down" },
      { x: 7, y: 10, dir: "up" },
      { x: 2, y: 2, dir: "left" },
      { x: 0, y: 14, dir: "down" },
      { x: 2, y: 18, dir: "down" },
      { x: 0, y: 6, dir: "down" },
      { x: 3, y: 6, dir: "left" },
      { x: 3, y: 17, dir: "up" },
      { x: 1, y: 10, dir: "right" },
      { x: 10, y: 2, dir: "left" },
      { x: 11, y: 12, dir: "down" },
      { x: 5, y: 1, dir: "left" },
      { x: 9, y: 17, dir: "left" },
      { x: 1, y: 17, dir: "down" },
      { x: 0, y: 16, dir: "down" },
      { x: 4, y: 13, dir: "left" },
      { x: 5, y: 11, dir: "right" },
      { x: 9, y: 10, dir: "up" },
      { x: 8, y: 0, dir: "up" },
      { x: 11, y: 14, dir: "right" },
      { x: 3, y: 4, dir: "up" },
      { x: 7, y: 5, dir: "right" },
      { x: 10, y: 7, dir: "down" },
      { x: 10, y: 11, dir: "down" },
      { x: 7, y: 6, dir: "left" },
      { x: 3, y: 1, dir: "left" },
      { x: 4, y: 9, dir: "right" },
      { x: 5, y: 10, dir: "right" },
      { x: 4, y: 7, dir: "right" },
    ]
  },
  {
    id: 12,
    name: "第12关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      { x: 6, y: 9, dir: "up" },
      { x: 6, y: 7, dir: "left" },
      { x: 4, y: 10, dir: "right" },
      { x: 3, y: 7, dir: "down" },
      { x: 7, y: 9, dir: "up" },
      { x: 2, y: 9, dir: "right" },
      { x: 1, y: 3, dir: "down" },
      { x: 2, y: 13, dir: "up" },
      { x: 5, y: 13, dir: "left" },
      { x: 10, y: 13, dir: "left" },
      { x: 6, y: 14, dir: "left" },
      { x: 5, y: 8, dir: "down" },
      { x: 5, y: 12, dir: "down" },
      { x: 1, y: 11, dir: "right" },
      { x: 1, y: 8, dir: "right" },
      { x: 3, y: 4, dir: "down" },
      { x: 4, y: 6, dir: "up" },
      { x: 1, y: 4, dir: "right" },
      { x: 9, y: 12, dir: "right" },
      { x: 6, y: 15, dir: "left" },
      { x: 0, y: 15, dir: "up" },
      { x: 6, y: 5, dir: "right" },
      { x: 4, y: 3, dir: "up" },
      { x: 10, y: 11, dir: "down" },
      { x: 3, y: 2, dir: "left" },
      { x: 8, y: 6, dir: "left" },
      { x: 9, y: 8, dir: "up" },
      { x: 1, y: 5, dir: "right" },
      { x: 4, y: 14, dir: "up" },
      { x: 5, y: 17, dir: "down" },
      { x: 6, y: 17, dir: "up" },
      { x: 10, y: 7, dir: "down" },
      { x: 8, y: 5, dir: "down" },
      { x: 7, y: 17, dir: "up" },
      { x: 5, y: 1, dir: "down" },
      { x: 9, y: 15, dir: "left" },
      { x: 4, y: 17, dir: "up" },
      { x: 7, y: 3, dir: "left" },
      { x: 9, y: 17, dir: "up" },
      { x: 1, y: 16, dir: "down" },
      { x: 11, y: 5, dir: "down" },
      { x: 2, y: 1, dir: "right" },
      { x: 7, y: 0, dir: "up" },
      { x: 4, y: 8, dir: "up" },
      { x: 1, y: 12, dir: "right" },
      { x: 8, y: 1, dir: "down" },
      { x: 9, y: 2, dir: "left" },
      { x: 2, y: 17, dir: "up" },
      { x: 11, y: 16, dir: "right" },
      { x: 10, y: 1, dir: "right" },
      { x: 11, y: 9, dir: "down" },
      { x: 11, y: 15, dir: "down" },
      { x: 6, y: 0, dir: "up" },
      { x: 10, y: 5, dir: "right" },
      { x: 11, y: 11, dir: "down" },
      { x: 2, y: 10, dir: "up" },
      { x: 2, y: 6, dir: "up" },
      { x: 8, y: 13, dir: "left" },
      { x: 0, y: 9, dir: "up" },
      { x: 3, y: 15, dir: "down" },
      { x: 7, y: 4, dir: "right" },
      { x: 8, y: 10, dir: "down" },
      { x: 10, y: 3, dir: "left" },
      { x: 4, y: 0, dir: "right" },
      { x: 4, y: 12, dir: "right" },
      { x: 5, y: 4, dir: "down" },
      { x: 0, y: 13, dir: "up" },
      { x: 7, y: 11, dir: "right" },
      { x: 1, y: 7, dir: "down" },
      { x: 0, y: 6, dir: "up" },
      { x: 3, y: 18, dir: "down" },
      { x: 8, y: 14, dir: "left" },
      { x: 3, y: 13, dir: "left" },
      { x: 8, y: 8, dir: "down" },
      { x: 6, y: 6, dir: "left" },
      { x: 8, y: 18, dir: "down" },
      { x: 10, y: 4, dir: "right" },
      { x: 9, y: 10, dir: "up" },
      { x: 0, y: 2, dir: "up" },
      { x: 7, y: 16, dir: "right" },
    ]
  },
  {
    id: 13,
    name: "第13关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      { x: 1, y: 14, dir: "down" },
      { x: 1, y: 2, dir: "down" },
      { x: 7, y: 1, dir: "left" },
      { x: 1, y: 10, dir: "down" },
      { x: 1, y: 16, dir: "right" },
      { x: 3, y: 1, dir: "left" },
      { x: 8, y: 15, dir: "up" },
      { x: 0, y: 3, dir: "down" },
      { x: 8, y: 6, dir: "up" },
      { x: 8, y: 9, dir: "up" },
      { x: 6, y: 16, dir: "right" },
      { x: 0, y: 13, dir: "down" },
      { x: 1, y: 5, dir: "down" },
      { x: 8, y: 3, dir: "up" },
      { x: 6, y: 2, dir: "left" },
      { x: 3, y: 16, dir: "right" },
      { x: 1, y: 8, dir: "down" },
      { x: 0, y: 6, dir: "down" },
      { x: 1, y: 12, dir: "left" },
      { x: 8, y: 11, dir: "up" },
      { x: 6, y: 5, dir: "up" },
      { x: 5, y: 3, dir: "left" },
      { x: 3, y: 4, dir: "left" },
      { x: 3, y: 9, dir: "right" },
      { x: 3, y: 7, dir: "left" },
      { x: 7, y: 8, dir: "up" },
      { x: 5, y: 10, dir: "left" },
      { x: 2, y: 14, dir: "up" },
      { x: 0, y: 9, dir: "down" },
      { x: 5, y: 6, dir: "right" },
      { x: 6, y: 12, dir: "up" },
      { x: 10, y: 5, dir: "left" },
      { x: 2, y: 6, dir: "right" },
      { x: 4, y: 15, dir: "left" },
      { x: 10, y: 3, dir: "down" },
      { x: 8, y: 0, dir: "right" },
      { x: 11, y: 9, dir: "up" },
      { x: 4, y: 11, dir: "right" },
      { x: 7, y: 14, dir: "up" },
      { x: 5, y: 0, dir: "right" },
      { x: 2, y: 3, dir: "left" },
      { x: 9, y: 6, dir: "up" },
      { x: 7, y: 17, dir: "left" },
      { x: 10, y: 13, dir: "left" },
      { x: 9, y: 16, dir: "up" },
      { x: 4, y: 18, dir: "right" },
      { x: 10, y: 14, dir: "left" },
      { x: 9, y: 1, dir: "left" },
      { x: 11, y: 6, dir: "up" },
      { x: 9, y: 18, dir: "right" },
      { x: 4, y: 12, dir: "left" },
      { x: 10, y: 15, dir: "left" },
      { x: 10, y: 9, dir: "down" },
      { x: 9, y: 11, dir: "up" },
      { x: 3, y: 17, dir: "left" },
      { x: 11, y: 11, dir: "up" },
      { x: 0, y: 15, dir: "down" },
      { x: 10, y: 4, dir: "left" },
      { x: 4, y: 13, dir: "left" },
      { x: 2, y: 10, dir: "up" },
      { x: 5, y: 8, dir: "right" },
      { x: 7, y: 3, dir: "up" },
      { x: 7, y: 13, dir: "left" },
      { x: 11, y: 2, dir: "up" },
      { x: 10, y: 17, dir: "down" },
      { x: 1, y: 17, dir: "left" },
      { x: 5, y: 18, dir: "down" },
      { x: 6, y: 17, dir: "up" },
      { x: 10, y: 12, dir: "down" },
      { x: 3, y: 0, dir: "right" },
      { x: 2, y: 4, dir: "up" },
      { x: 5, y: 1, dir: "left" },
      { x: 3, y: 2, dir: "left" },
      { x: 8, y: 14, dir: "left" },
      { x: 0, y: 11, dir: "down" },
      { x: 4, y: 5, dir: "left" },
      { x: 9, y: 8, dir: "up" },
      { x: 3, y: 14, dir: "up" },
      { x: 10, y: 7, dir: "down" },
      { x: 5, y: 7, dir: "left" },
    ]
  },
  {
    id: 14,
    name: "第14关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      { x: 5, y: 10, dir: "right" },
      { x: 2, y: 6, dir: "up" },
      { x: 9, y: 8, dir: "down" },
      { x: 4, y: 5, dir: "down" },
      { x: 4, y: 8, dir: "left" },
      { x: 5, y: 7, dir: "down" },
      { x: 8, y: 14, dir: "right" },
      { x: 3, y: 11, dir: "up" },
      { x: 4, y: 12, dir: "left" },
      { x: 6, y: 13, dir: "left" },
      { x: 6, y: 9, dir: "right" },
      { x: 1, y: 12, dir: "down" },
      { x: 7, y: 11, dir: "right" },
      { x: 11, y: 11, dir: "down" },
      { x: 9, y: 9, dir: "right" },
      { x: 4, y: 9, dir: "right" },
      { x: 2, y: 13, dir: "up" },
      { x: 5, y: 11, dir: "right" },
      { x: 6, y: 12, dir: "left" },
      { x: 10, y: 11, dir: "right" },
      { x: 10, y: 13, dir: "down" },
      { x: 7, y: 8, dir: "left" },
      { x: 6, y: 8, dir: "down" },
      { x: 8, y: 13, dir: "left" },
      { x: 2, y: 10, dir: "right" },
      { x: 3, y: 13, dir: "left" },
      { x: 9, y: 10, dir: "right" },
      { x: 10, y: 10, dir: "down" },
      { x: 7, y: 3, dir: "left" },
      { x: 1, y: 9, dir: "right" },
      { x: 6, y: 4, dir: "right" },
      { x: 4, y: 3, dir: "left" },
      { x: 8, y: 4, dir: "up" },
      { x: 3, y: 3, dir: "up" },
      { x: 9, y: 6, dir: "down" },
      { x: 2, y: 8, dir: "left" },
      { x: 0, y: 7, dir: "left" },
      { x: 3, y: 7, dir: "left" },
      { x: 1, y: 4, dir: "down" },
      { x: 2, y: 4, dir: "up" },
      { x: 11, y: 7, dir: "down" },
      { x: 7, y: 6, dir: "right" },
      { x: 4, y: 6, dir: "right" },
      { x: 10, y: 8, dir: "left" },
      { x: 1, y: 6, dir: "right" },
      { x: 10, y: 6, dir: "down" },
      { x: 8, y: 6, dir: "up" },
      { x: 7, y: 5, dir: "right" },
      { x: 0, y: 13, dir: "down" },
      { x: 0, y: 4, dir: "down" },
      { x: 1, y: 14, dir: "down" },
      { x: 4, y: 2, dir: "left" },
      { x: 7, y: 0, dir: "right" },
      { x: 3, y: 0, dir: "up" },
      { x: 5, y: 1, dir: "right" },
      { x: 5, y: 14, dir: "down" },
      { x: 6, y: 16, dir: "down" },
      { x: 7, y: 15, dir: "up" },
      { x: 4, y: 15, dir: "right" },
      { x: 8, y: 2, dir: "left" },
      { x: 3, y: 16, dir: "right" },
      { x: 9, y: 15, dir: "right" },
      { x: 6, y: 18, dir: "left" },
      { x: 10, y: 2, dir: "left" },
      { x: 9, y: 0, dir: "right" },
      { x: 11, y: 4, dir: "down" },
      { x: 1, y: 15, dir: "right" },
      { x: 11, y: 14, dir: "down" },
      { x: 9, y: 4, dir: "down" },
      { x: 10, y: 14, dir: "right" },
      { x: 8, y: 1, dir: "right" },
      { x: 10, y: 16, dir: "down" },
      { x: 1, y: 2, dir: "down" },
      { x: 4, y: 14, dir: "right" },
      { x: 8, y: 17, dir: "left" },
      { x: 10, y: 4, dir: "down" },
      { x: 4, y: 17, dir: "down" },
      { x: 5, y: 17, dir: "left" },
      { x: 2, y: 17, dir: "up" },
      { x: 2, y: 2, dir: "up" },
    ]
  },
  {
    id: 15,
    name: "第15关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      { x: 3, y: 4, dir: "down" },
      { x: 6, y: 9, dir: "down" },
      { x: 9, y: 8, dir: "right" },
      { x: 7, y: 9, dir: "up" },
      { x: 4, y: 9, dir: "up" },
      { x: 7, y: 12, dir: "right" },
      { x: 3, y: 9, dir: "down" },
      { x: 9, y: 9, dir: "right" },
      { x: 6, y: 11, dir: "right" },
      { x: 6, y: 7, dir: "down" },
      { x: 5, y: 9, dir: "down" },
      { x: 9, y: 7, dir: "left" },
      { x: 8, y: 13, dir: "down" },
      { x: 4, y: 7, dir: "left" },
      { x: 4, y: 6, dir: "right" },
      { x: 9, y: 5, dir: "down" },
      { x: 11, y: 9, dir: "right" },
      { x: 5, y: 10, dir: "left" },
      { x: 2, y: 6, dir: "down" },
      { x: 11, y: 11, dir: "down" },
      { x: 4, y: 5, dir: "right" },
      { x: 11, y: 13, dir: "down" },
      { x: 8, y: 5, dir: "down" },
      { x: 11, y: 8, dir: "down" },
      { x: 3, y: 11, dir: "right" },
      { x: 8, y: 7, dir: "down" },
      { x: 2, y: 8, dir: "right" },
      { x: 9, y: 13, dir: "down" },
      { x: 10, y: 12, dir: "up" },
      { x: 8, y: 10, dir: "left" },
      { x: 6, y: 4, dir: "down" },
      { x: 1, y: 14, dir: "right" },
      { x: 0, y: 12, dir: "down" },
      { x: 9, y: 11, dir: "right" },
      { x: 1, y: 9, dir: "right" },
      { x: 4, y: 11, dir: "up" },
      { x: 10, y: 5, dir: "up" },
      { x: 3, y: 12, dir: "right" },
      { x: 5, y: 13, dir: "down" },
      { x: 2, y: 7, dir: "left" },
      { x: 7, y: 5, dir: "right" },
      { x: 5, y: 6, dir: "down" },
      { x: 2, y: 2, dir: "down" },
      { x: 6, y: 13, dir: "left" },
      { x: 5, y: 0, dir: "right" },
      { x: 8, y: 1, dir: "left" },
      { x: 6, y: 1, dir: "down" },
      { x: 11, y: 5, dir: "down" },
      { x: 7, y: 6, dir: "up" },
      { x: 2, y: 10, dir: "left" },
      { x: 4, y: 2, dir: "right" },
      { x: 6, y: 2, dir: "right" },
      { x: 4, y: 4, dir: "left" },
      { x: 8, y: 16, dir: "left" },
      { x: 7, y: 14, dir: "up" },
      { x: 10, y: 10, dir: "up" },
      { x: 10, y: 1, dir: "up" },
      { x: 8, y: 2, dir: "right" },
      { x: 1, y: 2, dir: "right" },
      { x: 8, y: 15, dir: "down" },
      { x: 5, y: 15, dir: "down" },
      { x: 10, y: 14, dir: "up" },
      { x: 5, y: 3, dir: "right" },
      { x: 4, y: 15, dir: "right" },
      { x: 1, y: 6, dir: "right" },
      { x: 4, y: 14, dir: "right" },
      { x: 2, y: 16, dir: "down" },
      { x: 10, y: 3, dir: "up" },
      { x: 5, y: 17, dir: "right" },
      { x: 6, y: 16, dir: "down" },
      { x: 0, y: 7, dir: "left" },
      { x: 3, y: 16, dir: "left" },
      { x: 4, y: 1, dir: "left" },
      { x: 1, y: 3, dir: "right" },
      { x: 2, y: 4, dir: "down" },
      { x: 9, y: 17, dir: "right" },
      { x: 10, y: 16, dir: "left" },
      { x: 7, y: 17, dir: "right" },
      { x: 0, y: 4, dir: "left" },
      { x: 9, y: 15, dir: "down" },
    ]
  },
  {
    id: 16,
    name: "第16关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      { x: 7, y: 1, dir: "up" },
      { x: 3, y: 16, dir: "left" },
      { x: 2, y: 2, dir: "down" },
      { x: 4, y: 0, dir: "up" },
      { x: 8, y: 1, dir: "left" },
      { x: 11, y: 2, dir: "right" },
      { x: 8, y: 0, dir: "right" },
      { x: 7, y: 8, dir: "right" },
      { x: 6, y: 9, dir: "right" },
      { x: 6, y: 1, dir: "down" },
      { x: 10, y: 8, dir: "right" },
      { x: 3, y: 2, dir: "down" },
      { x: 6, y: 7, dir: "left" },
      { x: 9, y: 7, dir: "left" },
      { x: 3, y: 4, dir: "left" },
      { x: 5, y: 2, dir: "down" },
      { x: 3, y: 0, dir: "right" },
      { x: 1, y: 2, dir: "right" },
      { x: 6, y: 16, dir: "down" },
      { x: 9, y: 2, dir: "right" },
      { x: 11, y: 16, dir: "down" },
      { x: 4, y: 17, dir: "right" },
      { x: 7, y: 16, dir: "left" },
      { x: 9, y: 16, dir: "down" },
      { x: 9, y: 17, dir: "right" },
      { x: 7, y: 17, dir: "right" },
      { x: 9, y: 3, dir: "right" },
      { x: 5, y: 16, dir: "down" },
      { x: 8, y: 18, dir: "right" },
      { x: 4, y: 2, dir: "up" },
      { x: 3, y: 18, dir: "right" },
      { x: 5, y: 18, dir: "down" },
      { x: 10, y: 16, dir: "up" },
      { x: 10, y: 9, dir: "up" },
      { x: 8, y: 13, dir: "left" },
      { x: 9, y: 12, dir: "right" },
      { x: 9, y: 9, dir: "right" },
      { x: 0, y: 5, dir: "down" },
      { x: 2, y: 5, dir: "down" },
      { x: 8, y: 4, dir: "left" },
      { x: 7, y: 11, dir: "up" },
      { x: 6, y: 11, dir: "right" },
      { x: 6, y: 13, dir: "left" },
      { x: 2, y: 3, dir: "right" },
      { x: 11, y: 13, dir: "down" },
      { x: 10, y: 4, dir: "up" },
      { x: 5, y: 4, dir: "down" },
      { x: 8, y: 11, dir: "down" },
      { x: 7, y: 3, dir: "right" },
      { x: 6, y: 10, dir: "left" },
      { x: 1, y: 11, dir: "right" },
      { x: 4, y: 10, dir: "up" },
      { x: 10, y: 11, dir: "up" },
      { x: 7, y: 4, dir: "up" },
      { x: 2, y: 17, dir: "right" },
      { x: 11, y: 4, dir: "down" },
      { x: 1, y: 5, dir: "up" },
      { x: 4, y: 6, dir: "right" },
      { x: 3, y: 9, dir: "down" },
      { x: 4, y: 7, dir: "up" },
      { x: 5, y: 8, dir: "down" },
      { x: 1, y: 16, dir: "left" },
      { x: 8, y: 15, dir: "down" },
      { x: 1, y: 8, dir: "right" },
      { x: 11, y: 11, dir: "down" },
      { x: 2, y: 15, dir: "down" },
      { x: 0, y: 16, dir: "down" },
      { x: 3, y: 14, dir: "down" },
      { x: 8, y: 7, dir: "down" },
      { x: 1, y: 9, dir: "up" },
      { x: 5, y: 14, dir: "right" },
      { x: 6, y: 5, dir: "right" },
      { x: 6, y: 6, dir: "right" },
      { x: 9, y: 11, dir: "down" },
      { x: 2, y: 8, dir: "down" },
    ]
  },
  {
    id: 17,
    name: "第17关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      { x: 10, y: 16, dir: "left" },
      { x: 7, y: 0, dir: "up" },
      { x: 4, y: 1, dir: "up" },
      { x: 5, y: 2, dir: "down" },
      { x: 7, y: 2, dir: "up" },
      { x: 1, y: 2, dir: "up" },
      { x: 3, y: 2, dir: "right" },
      { x: 4, y: 18, dir: "right" },
      { x: 9, y: 2, dir: "right" },
      { x: 6, y: 16, dir: "down" },
      { x: 9, y: 18, dir: "down" },
      { x: 7, y: 16, dir: "up" },
      { x: 8, y: 18, dir: "down" },
      { x: 8, y: 16, dir: "down" },
      { x: 3, y: 16, dir: "left" },
      { x: 7, y: 18, dir: "right" },
      { x: 9, y: 16, dir: "down" },
      { x: 6, y: 12, dir: "right" },
      { x: 8, y: 10, dir: "left" },
      { x: 7, y: 11, dir: "right" },
      { x: 5, y: 17, dir: "right" },
      { x: 3, y: 17, dir: "right" },
      { x: 10, y: 9, dir: "up" },
      { x: 7, y: 12, dir: "up" },
      { x: 9, y: 13, dir: "down" },
      { x: 11, y: 11, dir: "right" },
      { x: 9, y: 9, dir: "down" },
      { x: 5, y: 10, dir: "left" },
      { x: 2, y: 13, dir: "left" },
      { x: 10, y: 13, dir: "left" },
      { x: 8, y: 13, dir: "down" },
      { x: 2, y: 10, dir: "left" },
      { x: 5, y: 13, dir: "left" },
      { x: 11, y: 9, dir: "down" },
      { x: 2, y: 11, dir: "right" },
      { x: 0, y: 12, dir: "down" },
      { x: 5, y: 16, dir: "down" },
      { x: 4, y: 11, dir: "up" },
      { x: 1, y: 13, dir: "up" },
      { x: 9, y: 11, dir: "right" },
      { x: 0, y: 10, dir: "left" },
      { x: 2, y: 1, dir: "down" },
      { x: 6, y: 2, dir: "down" },
      { x: 9, y: 0, dir: "right" },
      { x: 5, y: 0, dir: "right" },
      { x: 9, y: 1, dir: "left" },
      { x: 3, y: 1, dir: "down" },
      { x: 10, y: 2, dir: "up" },
      { x: 9, y: 4, dir: "left" },
      { x: 3, y: 3, dir: "right" },
      { x: 0, y: 3, dir: "down" },
      { x: 7, y: 5, dir: "up" },
      { x: 5, y: 4, dir: "down" },
      { x: 4, y: 3, dir: "up" },
      { x: 5, y: 8, dir: "right" },
      { x: 8, y: 9, dir: "right" },
      { x: 6, y: 9, dir: "down" },
      { x: 2, y: 4, dir: "left" },
      { x: 7, y: 7, dir: "up" },
      { x: 6, y: 7, dir: "down" },
      { x: 8, y: 4, dir: "down" },
      { x: 9, y: 7, dir: "down" },
      { x: 11, y: 7, dir: "down" },
      { x: 1, y: 4, dir: "up" },
      { x: 2, y: 8, dir: "down" },
      { x: 5, y: 9, dir: "right" },
      { x: 10, y: 7, dir: "up" },
      { x: 3, y: 7, dir: "left" },
      { x: 6, y: 5, dir: "down" },
      { x: 5, y: 7, dir: "down" },
      { x: 3, y: 5, dir: "right" },
      { x: 11, y: 5, dir: "down" },
      { x: 10, y: 5, dir: "right" },
      { x: 1, y: 15, dir: "right" },
      { x: 11, y: 15, dir: "down" },
      { x: 5, y: 14, dir: "right" },
    ]
  },
  {
    id: 18,
    name: "第18关",
    animalType: "pig",
    playArea: {
      x: 0,
      y: 0,
      cols: 12,
      rows: 19
    },
    animals: [
      { x: 4, y: 6, dir: "down" },
      { x: 2, y: 11, dir: "up" },
      { x: 5, y: 7, dir: "up" },
      { x: 0, y: 3, dir: "left" },
      { x: 11, y: 2, dir: "right" },
      { x: 1, y: 6, dir: "right" },
      { x: 6, y: 9, dir: "right" },
      { x: 5, y: 14, dir: "right" },
      { x: 10, y: 11, dir: "right" },
      { x: 8, y: 4, dir: "right" },
      { x: 7, y: 12, dir: "up" },
      { x: 5, y: 2, dir: "down" },
      { x: 8, y: 7, dir: "right" },
      { x: 1, y: 15, dir: "right" },
      { x: 6, y: 13, dir: "up" },
      { x: 4, y: 7, dir: "right" },
      { x: 10, y: 6, dir: "left" },
      { x: 7, y: 5, dir: "up" },
      { x: 3, y: 3, dir: "up" },
      { x: 10, y: 5, dir: "left" },
      { x: 2, y: 15, dir: "up" },
      { x: 6, y: 11, dir: "left" },
      { x: 10, y: 8, dir: "left" },
      { x: 8, y: 16, dir: "up" },
      { x: 9, y: 13, dir: "down" },
      { x: 7, y: 15, dir: "up" },
      { x: 1, y: 12, dir: "right" },
      { x: 4, y: 16, dir: "left" },
      { x: 8, y: 2, dir: "down" },
      { x: 3, y: 12, dir: "up" },
      { x: 4, y: 15, dir: "left" },
      { x: 2, y: 4, dir: "right" },
      { x: 3, y: 2, dir: "left" },
      { x: 8, y: 14, dir: "left" },
      { x: 10, y: 7, dir: "right" },
      { x: 3, y: 9, dir: "up" },
      { x: 1, y: 10, dir: "down" },
      { x: 10, y: 3, dir: "up" },
      { x: 9, y: 9, dir: "down" },
      { x: 8, y: 10, dir: "up" },
      { x: 7, y: 1, dir: "down" },
      { x: 8, y: 8, dir: "up" },
      { x: 1, y: 16, dir: "right" },
      { x: 0, y: 13, dir: "left" },
      { x: 4, y: 1, dir: "down" },
      { x: 1, y: 8, dir: "right" },
      { x: 6, y: 17, dir: "up" },
      { x: 8, y: 3, dir: "right" },
      { x: 1, y: 14, dir: "right" },
      { x: 8, y: 5, dir: "left" },
      { x: 6, y: 0, dir: "up" },
      { x: 10, y: 10, dir: "right" },
      { x: 4, y: 17, dir: "left" },
      { x: 8, y: 0, dir: "left" },
      { x: 3, y: 18, dir: "right" },
      { x: 7, y: 17, dir: "up" },
      { x: 4, y: 10, dir: "left" },
      { x: 9, y: 18, dir: "right" },
      { x: 10, y: 17, dir: "right" },
      { x: 7, y: 2, dir: "right" },
      { x: 3, y: 1, dir: "right" },
      { x: 10, y: 12, dir: "left" },
      { x: 8, y: 13, dir: "down" },
      { x: 6, y: 6, dir: "right" },
      { x: 5, y: 13, dir: "right" },
      { x: 0, y: 11, dir: "left" },
      { x: 6, y: 5, dir: "right" },
      { x: 3, y: 16, dir: "up" },
      { x: 8, y: 6, dir: "left" },
      { x: 2, y: 0, dir: "left" },
      { x: 2, y: 5, dir: "right" },
      { x: 2, y: 13, dir: "up" },
      { x: 5, y: 4, dir: "down" },
      { x: 4, y: 4, dir: "down" },
      { x: 10, y: 15, dir: "left" },
    ]
  }
];

const EDITOR_LEVELS_STORAGE_KEY = "pigEscapeEditorDeployedLevelsV1";

function getGameLevels() {
  try {
    const raw = window.localStorage.getItem(EDITOR_LEVELS_STORAGE_KEY);
    if (!raw) return LEVELS;
    const levels = JSON.parse(raw);
    return Array.isArray(levels) && levels.length > 0 ? levels : LEVELS;
  } catch (error) {
    return LEVELS;
  }
}

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
  runToken: 0,
  toolMode: null,
  undoSnapshot: null,
  firecrackerRunning: false,
  collectionFilter: "all",
  selectedCollectionItem: "remove",
  equippedSkin: loadEquippedSkin(),
  unlockedCollection: loadUnlockedCollection(),
  equippedTools: loadEquippedTools(),
  enabledAbilities: loadEnabledAbilities(),
  toolUses: {
    remove: 0,
    undo: 0,
  },
  scoreBurstToken: 0,
};

const PIG_MARKUP = `
  <span class="pig-shape" aria-hidden="true"></span>
`;

const pasture = document.querySelector("#pasture");
const clearedCount = document.querySelector("#clearedCount");
const targetCount = document.querySelector("#targetCount");
const levelTitle = document.querySelector("#levelTitle");
const levelSelect = document.querySelector("#levelSelect");
const levelSelectLabel = document.querySelector("#levelSelectLabel");
const comboBurst = document.querySelector("#comboBurst");
const comboCount = document.querySelector("#comboCount");
const scorePill = document.querySelector(".score-pill");
const scoreCount = document.querySelector("#scoreCount");
const starTarget = document.querySelector("#starTarget");
const totalStarsCount = document.querySelector("#totalStarsCount");
const levelCompleteModal = document.querySelector("#levelCompleteModal");
const completeStars = document.querySelector("#completeStars");
const completeScore = document.querySelector("#completeScore");
const replayLevelBtn = document.querySelector("#replayLevelBtn");
const nextLevelBtn = document.querySelector("#nextLevelBtn");
const toast = document.querySelector("#toast");
const homeBtn = document.querySelector("#homeBtn");
const restartBtn = document.querySelector("#restartBtn");
const removeTool = document.querySelector("#removeTool");
const firecrackerTool = document.querySelector("#firecrackerTool");
const firecrackerEffect = document.querySelector("#firecrackerEffect");
const undoTool = document.querySelector("#undoTool");
const startGameBtn = document.querySelector("#startGameBtn");
const startStarsButton = document.querySelector("#startStarsButton");
const startTotalStars = document.querySelector("#startTotalStars");
const startClearedLevels = document.querySelector("#startClearedLevels");
const totalStarsButton = document.querySelector("#totalStarsButton");
const toolUnlockModal = document.querySelector("#toolUnlockModal");
const toolUnlockStarCount = document.querySelector("#toolUnlockStarCount");
const toolUnlockList = document.querySelector("#toolUnlockList");
const collectionTabs = document.querySelectorAll(".collection-tab");
const toolGuideTitle = document.querySelector("#toolGuideTitle");
const toolGuideMeta = document.querySelector("#toolGuideMeta");
const toolGuideText = document.querySelector("#toolGuideText");
const collectionActionBtn = document.querySelector("#collectionActionBtn");
const collectionReveal = document.querySelector("#collectionReveal");
const collectionRevealIcon = document.querySelector("#collectionRevealIcon");
const collectionRevealName = document.querySelector("#collectionRevealName");
const collectionRevealClose = document.querySelector("#collectionRevealClose");
const closeToolUnlockBtn = document.querySelector("#closeToolUnlockBtn");

function initLevel(index = 0) {
  const levels = getGameLevels();
  const levelIndex = Math.max(0, Math.min(index, levels.length - 1));
  const level = levels[levelIndex];
  state.levelIndex = levelIndex;
  state.cleared = 0;
  state.combo = 0;
  state.score = 0;
  state.starThresholds = getStarThresholds(level);
  state.locked = false;
  state.runToken += 1;
  state.toolMode = null;
  state.undoSnapshot = null;
  state.firecrackerRunning = false;
  state.toolUses = {
    remove: 0,
    undo: 0,
  };
  state.animals = level.animals.map((animal, animalIndex) => ({
    ...animal,
    type: animal.type ?? level.animalType ?? "pig",
    variant: animal.variant ?? getDecorativeAnimalVariant(levelIndex, animalIndex, animal),
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
  clearPathRunners();
  render();
  updateHud();
  hideComboBurst();
  hideLevelCompleteModal();
  updateToolState();
  restoreFirecrackerPosition();
  showToast("点击小猪，让它向前跑出草地");
}

function render() {
  pasture.innerHTML = "";
  renderPlayArea();
  const fragment = document.createDocumentFragment();

  state.animals
    .filter((animal) => animal.active)
    .forEach((animal, activeIndex) => {
      const pig = document.createElement("button");
      const animalType = getAnimalType(animal);
      pig.className = `pig ${animalType.className} pig-variant-${animal.variant}${animal.stunned ? " is-stunned" : ""}`;
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
      pig.style.setProperty("--breath-delay", `${-((activeIndex % 9) * 0.18)}s`);
      pig.setAttribute("aria-label", `小猪朝${DIRS[animal.dir].label}`);
      pig.innerHTML = PIG_MARKUP;
      bindAnimalInput(pig, animal.id);
      fragment.appendChild(pig);
    });
  pasture.appendChild(fragment);
}

function getDecorativeAnimalVariant(levelIndex, animalIndex, animal) {
  if (levelIndex < 14) return "pink";

  const designSeed = (animal.x * 17 + animal.y * 29 + animalIndex * 7 + levelIndex * 11) % 100;
  const isOuterFrame = animal.x <= 1 || animal.x >= BOARD.cols - 2 || animal.y <= 1 || animal.y >= BOARD.rows - 2;
  const isAccent = (animal.x + animal.y * 3 + levelIndex + animalIndex) % 11 === 0;

  if (isOuterFrame && isAccent) return "black";
  if (designSeed < 12) return "black";
  return "pink";
}

function handleAnimalClick(id, element) {
  if (state.locked) return;

  const animal = state.animalById.get(id);
  if (!animal || !animal.active || animal.busy) return;

  playAnimalTapFeedback(element);

  if (state.toolMode === "remove") {
    if (!canUseTool("remove")) {
      setToolMode(null);
      showToast("移除次数已用完");
      return;
    }
    saveUndoSnapshot();
    state.toolUses.remove += 1;
    removeAnimal(animal, element);
    setToolMode(null);
    showToast(`已移除，剩余${getToolUsesLeft("remove")}次`);
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
  saveUndoSnapshot();
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
  const center = getAnimalCenter(animal);
  const pathStart = {
    x: center.x + dir.dx * cellsToEdge,
    y: center.y + dir.dy * cellsToEdge,
  };
  const pathEntry = getPathEntryPoint(pathStart, animal.dir);
  const runToken = state.runToken;

  setMotion(element, moveMs, MOVE_EASING.run);
  setRunOffset(element, dir, cellsToEdge);
  element.classList.add("is-leaving", "is-running");
  spawnRunTrail(center, dir, cellsToEdge, animalType);

  animal.active = false;
  state.cleared += 1;
  addExitScore(center);
  updateHud();

  window.setTimeout(() => {
    if (runToken !== state.runToken) return;
    const runner = createPathRunner(element, pathEntry, animal.dir);
    element.remove();
    runPathToGate(runner, pathEntry, animal.dir, animalType, runToken);
  }, moveMs);
}

function clearPathRunners() {
  document.querySelectorAll(".path-runner").forEach((runner) => runner.remove());
}

function createPathRunner(sourceElement, start, dirKey) {
  const runner = sourceElement.cloneNode(true);
  runner.classList.remove(
    "is-leaving",
    "is-crashing",
    "is-stunned",
    "is-removed",
    "is-blocked",
    "is-pressing",
    "is-activated",
  );
  runner.classList.add("path-runner", "is-running");
  runner.type = "button";
  runner.disabled = true;
  runner.removeAttribute("data-id");
  runner.setAttribute("aria-label", `小猪朝${DIRS[dirKey].label}`);
  setPathRunnerPoint(runner, start, 0);
  document.body.appendChild(runner);
  return runner;
}

async function runPathToGate(runner, start, dirKey, animalType, runToken) {
  const route = getPathExitRoute(start, dirKey);
  let current = route[0];

  for (let index = 1; index < route.length; index += 1) {
    if (runToken !== state.runToken || !runner.isConnected) return;
    const next = route[index];
    await movePathRunner(runner, current, next, animalType);
    current = next;
    if (PATH_EXIT.turnPauseMs > 0) {
      await wait(PATH_EXIT.turnPauseMs);
    }
  }

  if (runToken !== state.runToken || !runner.isConnected) return;
  runner.classList.add("is-path-disappearing");
  window.setTimeout(() => {
    if (runToken !== state.runToken) return;
    runner.remove();
    checkLevelComplete();
  }, PATH_EXIT.fadeMs);
}

async function movePathRunner(runner, from, to, animalType) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const cells = Math.hypot(dx, dy);
  const durationMs = Math.max(80, getMoveDuration(animalType, cells));
  const segmentDir = getPathSegmentDir(dx, dy);

  runner.setAttribute("aria-label", `小猪朝${DIRS[segmentDir].label}`);
  setMotion(runner, durationMs, MOVE_EASING.run);
  spawnPathRunTrail(from, DIRS[segmentDir], cells, animalType);
  await waitForNextFrame();
  setPathRunnerPoint(runner, to, durationMs);
  await wait(durationMs);
}

function getPathExitRoute(start, dirKey) {
  const offset = PATH_EXIT.roadOffsetCells;
  const topY = PATH_EXIT.gateYCells;
  const bottomY = BOARD.rows + offset;
  const leftX = -offset;
  const rightX = BOARD.cols + offset;
  const gate = { x: BOARD.cols / 2, y: topY };
  const outsideGate = { x: gate.x, y: PATH_EXIT.gateExitYCells };
  const route = [start];

  if (dirKey === "up") {
    pushRoutePoint(route, { x: start.x, y: topY });
  } else if (dirKey === "left") {
    pushRoutePoint(route, { x: leftX, y: start.y });
    pushRoutePoint(route, { x: leftX, y: topY });
  } else if (dirKey === "right") {
    pushRoutePoint(route, { x: rightX, y: start.y });
    pushRoutePoint(route, { x: rightX, y: topY });
  } else {
    const sideX = start.x <= gate.x ? leftX : rightX;
    pushRoutePoint(route, { x: start.x, y: bottomY });
    pushRoutePoint(route, { x: sideX, y: bottomY });
    pushRoutePoint(route, { x: sideX, y: topY });
  }

  pushRoutePoint(route, gate);
  pushRoutePoint(route, outsideGate);
  return route;
}

function getPathEntryPoint(start, dirKey) {
  const offset = PATH_EXIT.roadOffsetCells;
  if (dirKey === "up") {
    return { x: start.x, y: PATH_EXIT.gateYCells };
  }
  if (dirKey === "down") {
    return { x: start.x, y: BOARD.rows + offset };
  }
  if (dirKey === "left") {
    return { x: -offset, y: start.y };
  }
  return { x: BOARD.cols + offset, y: start.y };
}

function pushRoutePoint(route, point) {
  const previous = route[route.length - 1];
  if (Math.hypot(point.x - previous.x, point.y - previous.y) < 0.05) return;
  route.push(point);
}

function getPathSegmentDir(dx, dy) {
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? "right" : "left";
  }
  return dy >= 0 ? "down" : "up";
}

function setPathRunnerPoint(runner, point, durationMs) {
  const screenPoint = getPastureScreenPoint(point);
  runner.style.setProperty("--path-left", `${screenPoint.x}px`);
  runner.style.setProperty("--path-top", `${screenPoint.y}px`);
  runner.style.setProperty("--move-ms", `${durationMs}ms`);
}

function getPastureScreenPoint(point) {
  const rect = pasture.getBoundingClientRect();
  return {
    x: rect.left + point.x * (rect.width / BOARD.cols),
    y: rect.top + point.y * (rect.height / BOARD.rows),
  };
}

function wait(durationMs) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, durationMs);
  });
}

function waitForNextFrame() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
  });
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

async function useFirecracker() {
  if (state.firecrackerRunning || state.locked) return;
  if (!isAbilityUsable("firecracker")) {
    showToolLockedToast("firecracker");
    return;
  }
  const escapeTargets = findFirecrackerEscapableAnimals();
  if (escapeTargets.length === 0) {
    showToast("暂时没有能直接逃离的小猪");
    return;
  }

  setToolMode(null);
  state.firecrackerRunning = true;
  updateToolState();
  playFirecrackerEffect();
  await wait(420);

  const runToken = state.runToken;
  let escaped = 0;

  try {
    for (const escapeTarget of escapeTargets) {
      if (runToken !== state.runToken || state.locked) break;
      const { animal, element } = escapeTarget;
      if (!animal.active || animal.busy || !element.isConnected) continue;

      const animalType = getAnimalType(animal);
      const travelCells = getExitTravelCells(animal);
      exitAnimal(animal, element);
      escaped += 1;
      await wait(getMoveDuration(animalType, travelCells) + 140);
    }
  } finally {
    state.firecrackerRunning = false;
    updateToolState();
    if (escaped > 0) {
      showToast(`炮仗响了，逃走${escaped}只`);
    }
  }
}

function findFirecrackerEscapableAnimals() {
  return state.animals
    .filter((candidate) => (
      candidate.active
      && !candidate.busy
      && !findBlocker(candidate)
      && getAnimalElement(candidate)
    ))
    .map((animal) => ({
      animal,
      element: getAnimalElement(animal),
    }));
}

function playFirecrackerEffect() {
  firecrackerEffect.hidden = false;
  firecrackerEffect.classList.remove("is-playing");
  void firecrackerEffect.offsetWidth;
  firecrackerEffect.classList.add("is-playing");
  window.setTimeout(() => {
    firecrackerEffect.hidden = true;
    firecrackerEffect.classList.remove("is-playing");
  }, 760);
}

function getAnimalElement(animal) {
  return pasture.querySelector(`.pig[data-id="${animal.id}"]`);
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

function spawnPathRunTrail(center, dir, cells, animalType) {
  const count = Math.max(1, Math.ceil(cells / animalType.trailEveryCells));
  const side = { x: -dir.dy, y: dir.dx };
  for (let index = 0; index < count; index += 1) {
    const step = Math.min(cells, index * animalType.trailEveryCells);
    const delay = getMoveDuration(animalType, step);
    window.setTimeout(() => {
      const trail = document.createElement("span");
      const sideOffset = index % 2 === 0 ? -0.18 : 0.18;
      const point = getPastureScreenPoint({
        x: center.x + dir.dx * step + side.x * sideOffset,
        y: center.y + dir.dy * step + side.y * sideOffset,
      });
      trail.className = "effect-trail effect-trail-path";
      trail.style.setProperty("--screen-x", `${point.x}px`);
      trail.style.setProperty("--screen-y", `${point.y}px`);
      trail.style.setProperty("--trail-color", animalType.trailColor);
      trail.style.setProperty("--dust-scale", index % 3 === 0 ? "0.5" : "0.36");
      document.body.appendChild(trail);
      window.setTimeout(() => trail.remove(), 620);
    }, delay);
  }
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
  updateUndoState();
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
  const hasNextLevel = state.levelIndex + 1 < getGameLevels().length;
  nextLevelBtn.disabled = !hasNextLevel;
  levelCompleteModal.hidden = false;
}

function hideLevelCompleteModal() {
  levelCompleteModal.hidden = true;
}

function addExitScore(scorePoint = null) {
  state.combo += 1;
  const gainedScore = getExitScoreForCombo(state.combo);
  state.score += gainedScore;
  showComboBurst(state.combo, gainedScore, scorePoint);
  bumpScorePill();
}

function getExitScoreForCombo(combo) {
  if (combo <= 5) return SCORE_RULES.comboScoreEarly;
  if (combo <= 15) return SCORE_RULES.comboScoreMid;
  return SCORE_RULES.comboScoreLate;
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

function showComboBurst(combo, gainedScore = getExitScoreForCombo(combo), scorePoint = null) {
  const burstToken = state.scoreBurstToken + 1;
  state.scoreBurstToken = burstToken;
  if (scorePoint) {
    comboBurst.style.setProperty("--score-x", scorePoint.x);
    comboBurst.style.setProperty("--score-y", scorePoint.y - 0.82);
  }
  comboCount.textContent = `+${gainedScore}`;
  comboBurst.classList.add("is-score-pop");
  comboBurst.classList.add("is-visible");
  comboBurst.classList.toggle("is-warm", combo >= 10);
  comboBurst.classList.toggle("is-hot", combo >= 8);
  comboBurst.classList.toggle("is-blazing", combo >= 16);
  comboBurst.classList.toggle("is-inferno", combo >= 30);
  comboBurst.classList.remove("is-breaking");
  comboBurst.classList.remove("is-popping");
  void comboBurst.offsetWidth;
  comboBurst.classList.add("is-popping");
  window.setTimeout(() => {
    if (state.scoreBurstToken === burstToken) {
      hideComboBurst();
    }
  }, 640);
}

function bumpScorePill() {
  scorePill.classList.remove("is-bumping");
  void scorePill.offsetWidth;
  scorePill.classList.add("is-bumping");
}

function hideComboBurst() {
  comboBurst.classList.remove(
    "is-visible",
    "is-score-pop",
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
  comboBurst.classList.remove("is-score-pop", "is-warm", "is-hot", "is-blazing", "is-inferno", "is-popping");
  comboBurst.classList.add("is-visible", "is-breaking");
  window.setTimeout(() => {
    if (state.combo === 0) {
      hideComboBurst();
    }
  }, 600);
}

function getStarThresholds(level) {
  if (level.starThresholds) return level.starThresholds;
  const threeStarScore = roundScoreThreshold(
    level.animals.length * getAverageScorePerAnimal(
      getThreeStarAverageCombo(level),
    ),
  );
  const twoStarScore = Math.min(
    roundScoreThreshold(threeStarScore * STAR_RULES.twoStarRatio),
    threeStarScore - STAR_RULES.roundTo,
  );
  return [
    0,
    twoStarScore,
    threeStarScore,
  ];
}

function getThreeStarAverageCombo(level) {
  const levels = getGameLevels();
  const levelIndex = levels.findIndex((item) => item === level);
  if (levelIndex >= 0) {
    return (
      STAR_RULES.threeStarAverageComboByLevel[levelIndex] ??
      STAR_RULES.fallbackThreeStarAverageCombo
    );
  }
  return STAR_RULES.fallbackThreeStarAverageCombo;
}

function getAverageScorePerAnimal(averageCombo) {
  let scoreTotal = 0;
  for (let combo = 1; combo <= averageCombo; combo += 1) {
    scoreTotal += getExitScoreForCombo(combo);
  }
  return scoreTotal / averageCombo;
}

function roundScoreThreshold(score) {
  return Math.round(score / STAR_RULES.roundTo) * STAR_RULES.roundTo;
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
  const levels = getGameLevels();
  const options = levels.map((level, index) => ({ level, index })).filter(
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
  const levels = getGameLevels();
  const level = levels[index];
  if ((state.bestByLevel[level.id]?.stars ?? 0) > 0) return true;
  return isLevelUnlocked(index) && index === firstUnclearedLevelIndex;
}

function isLevelUnlocked(index) {
  if (index === 0) return true;
  const levels = getGameLevels();
  return (state.bestByLevel[levels[index - 1].id]?.stars ?? 0) > 0;
}

function getFirstUnclearedLevelIndex() {
  const levels = getGameLevels();
  const index = levels.findIndex(
    (level) => (state.bestByLevel[level.id]?.stars ?? 0) === 0,
  );
  return index === -1 ? levels.length - 1 : index;
}

function getPreviewLevelIndexFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const levelNumber = Number(params.get("previewLevel") ?? params.get("level"));
  if (!Number.isInteger(levelNumber)) return null;
  const levels = getGameLevels();
  if (levelNumber < 1 || levelNumber > levels.length) return null;
  return levelNumber - 1;
}

function loadProgress() {
  try {
    return JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function loadEquippedSkin() {
  try {
    const key = window.localStorage.getItem(EQUIPPED_SKIN_STORAGE_KEY);
    return COLLECTION_ITEMS[key]?.type === "skin" ? key : null;
  } catch {
    return null;
  }
}

function getStarterCollectionKeys() {
  return Object.entries(COLLECTION_ITEMS)
    .filter(([, item]) => item.starter)
    .map(([key]) => key);
}

function loadUnlockedCollection() {
  const unlocked = new Set(getStarterCollectionKeys());
  try {
    const saved = JSON.parse(window.localStorage.getItem(UNLOCKED_COLLECTION_STORAGE_KEY));
    if (!Array.isArray(saved)) return unlocked;
    saved.forEach((key) => {
      if (COLLECTION_ITEMS[key]) unlocked.add(key);
    });
  } catch {
    // 收藏解锁记录读取失败时，保留默认初始道具。
  }
  return unlocked;
}

function saveUnlockedCollection() {
  try {
    window.localStorage.setItem(
      UNLOCKED_COLLECTION_STORAGE_KEY,
      JSON.stringify([...state.unlockedCollection]),
    );
  } catch {
    showToast("收藏记录暂时无法保存");
  }
}

function getStarterToolKeys() {
  return Object.entries(COLLECTION_ITEMS)
    .filter(([, item]) => item.starter && item.type === "tool")
    .map(([key]) => key);
}

function loadEquippedTools() {
  const fallback = new Set(getStarterToolKeys());
  try {
    const saved = JSON.parse(window.localStorage.getItem(EQUIPPED_TOOLS_STORAGE_KEY));
    if (!Array.isArray(saved)) return fallback;
    const unlocked = loadUnlockedCollection();
    const equipped = saved
      .filter((key) => COLLECTION_ITEMS[key]?.type === "tool" && unlocked.has(key))
      .slice(0, MAX_EQUIPPED_TOOLS);
    return new Set(equipped.length > 0 ? equipped : getStarterToolKeys());
  } catch {
    return fallback;
  }
}

function saveEquippedTools() {
  try {
    window.localStorage.setItem(
      EQUIPPED_TOOLS_STORAGE_KEY,
      JSON.stringify([...state.equippedTools]),
    );
  } catch {
    showToast("道具携带记录暂时无法保存");
  }
}

function loadEnabledAbilities() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(ENABLED_ABILITIES_STORAGE_KEY));
    if (Array.isArray(saved)) {
      return new Set(saved.filter((key) => COLLECTION_ITEMS[key]?.type === "ability"));
    }
  } catch {
    // 继续使用兼容默认值。
  }

  const unlocked = loadUnlockedCollection();
  return new Set(
    Object.entries(COLLECTION_ITEMS)
      .filter(([key, item]) => item.type === "ability" && unlocked.has(key))
      .map(([key]) => key),
  );
}

function saveEnabledAbilities() {
  try {
    window.localStorage.setItem(
      ENABLED_ABILITIES_STORAGE_KEY,
      JSON.stringify([...state.enabledAbilities]),
    );
  } catch {
    showToast("能力开关暂时无法保存");
  }
}

function saveEquippedSkin(key) {
  try {
    window.localStorage.setItem(EQUIPPED_SKIN_STORAGE_KEY, key);
  } catch {
    // 皮肤选择保存失败不影响游玩。
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
  const level = getGameLevels()[levelIndex];
  const previous = state.bestByLevel[level.id] ?? { stars: 0, score: 0 };
  state.bestByLevel[level.id] = {
    stars: Math.max(previous.stars, stars),
    score: Math.max(previous.score, score),
  };
  saveProgress();
  renderLevelSelect();
  renderStartScreen();
  updateToolState();
  levelSelect.value = String(levelIndex);
}

function loadFirecrackerPosition() {
  try {
    const position = JSON.parse(window.localStorage.getItem(FIRECRACKER_POSITION_KEY));
    if (
      !position
      || !Number.isFinite(position.x)
      || !Number.isFinite(position.y)
    ) {
      return null;
    }
    return {
      x: Math.max(0, Math.min(1, position.x)),
      y: Math.max(0, Math.min(1, position.y)),
    };
  } catch {
    return null;
  }
}

function saveFirecrackerPosition(position) {
  try {
    window.localStorage.setItem(FIRECRACKER_POSITION_KEY, JSON.stringify(position));
  } catch {
    // 位置记忆失败不影响道具使用。
  }
}

function restoreFirecrackerPosition() {
  const position = loadFirecrackerPosition();
  if (!position) return;
  window.requestAnimationFrame(() => {
    setFirecrackerPosition(position);
  });
}

function setFirecrackerPosition(position) {
  const wrapRect = document.querySelector(".pasture-wrap").getBoundingClientRect();
  const buttonRect = firecrackerTool.getBoundingClientRect();
  const width = buttonRect.width || 46;
  const height = buttonRect.height || 54;
  const left = Math.max(0, Math.min(wrapRect.width - width, position.x * wrapRect.width - width / 2));
  const top = Math.max(0, Math.min(wrapRect.height - height, position.y * wrapRect.height - height / 2));

  firecrackerTool.classList.add("is-custom-position");
  firecrackerTool.style.left = `${left}px`;
  firecrackerTool.style.top = `${top}px`;
  firecrackerTool.style.right = "auto";

  firecrackerEffect.classList.add("is-custom-position");
  firecrackerEffect.style.left = `${left + width / 2 - 38}px`;
  firecrackerEffect.style.top = `${top + height / 2 - 38}px`;
  firecrackerEffect.style.right = "auto";
}

function bindFirecrackerDrag() {
  let dragState = null;

  firecrackerTool.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.isPrimary === false) return;
    const wrapRect = document.querySelector(".pasture-wrap").getBoundingClientRect();
    const buttonRect = firecrackerTool.getBoundingClientRect();
    dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
      wrapRect,
      offsetX: event.clientX - buttonRect.left,
      offsetY: event.clientY - buttonRect.top,
      width: buttonRect.width,
      height: buttonRect.height,
    };
    firecrackerTool.setPointerCapture?.(event.pointerId);
  });

  firecrackerTool.addEventListener("pointermove", (event) => {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    const distance = Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY);
    if (distance < 5 && !dragState.moved) return;
    dragState.moved = true;
    firecrackerTool.dataset.dragged = "true";
    firecrackerTool.classList.add("is-dragging");

    const left = Math.max(
      0,
      Math.min(
        dragState.wrapRect.width - dragState.width,
        event.clientX - dragState.wrapRect.left - dragState.offsetX,
      ),
    );
    const top = Math.max(
      0,
      Math.min(
        dragState.wrapRect.height - dragState.height,
        event.clientY - dragState.wrapRect.top - dragState.offsetY,
      ),
    );

    const position = {
      x: (left + dragState.width / 2) / dragState.wrapRect.width,
      y: (top + dragState.height / 2) / dragState.wrapRect.height,
    };
    setFirecrackerPosition(position);
  });

  function endDrag(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    firecrackerTool.releasePointerCapture?.(event.pointerId);
    firecrackerTool.classList.remove("is-dragging");
    if (dragState.moved) {
      const buttonRect = firecrackerTool.getBoundingClientRect();
      saveFirecrackerPosition({
        x: (buttonRect.left - dragState.wrapRect.left + buttonRect.width / 2) / dragState.wrapRect.width,
        y: (buttonRect.top - dragState.wrapRect.top + buttonRect.height / 2) / dragState.wrapRect.height,
      });
      window.setTimeout(() => {
        firecrackerTool.dataset.dragged = "false";
      }, 160);
    }
    dragState = null;
  }

  firecrackerTool.addEventListener("pointerup", endDrag);
  firecrackerTool.addEventListener("pointercancel", endDrag);
}

function getTotalStars() {
  return Object.values(state.bestByLevel).reduce(
    (total, result) => total + (result.stars ?? 0),
    0,
  );
}

let toastTimer = 0;
function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.classList.remove("is-visible");
  return;
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

homeBtn.addEventListener("click", () => {
  returnToStartScreen();
});

levelSelect.addEventListener("change", () => {
  initLevel(Number(levelSelect.value));
});

removeTool.addEventListener("click", () => {
  if (state.locked) return;
  if (!isToolUsable("remove")) {
    showToolLockedToast("remove");
    return;
  }
  if (!hasToolUsesLeft("remove")) {
    showToast("移除次数已用完");
    setToolMode(null);
    return;
  }
  setToolMode(state.toolMode === "remove" ? null : "remove");
  showToast(state.toolMode === "remove" ? "选择一只小猪移除" : "已取消移除");
});

firecrackerTool.addEventListener("click", (event) => {
  if (firecrackerTool.dataset.dragged === "true") {
    event.preventDefault();
    firecrackerTool.dataset.dragged = "false";
    return;
  }
  useFirecracker();
});

bindFirecrackerDrag();

window.addEventListener("resize", () => {
  restoreFirecrackerPosition();
});

undoTool?.addEventListener("click", () => {
  if (!isToolUnlocked("undo")) {
    showToolLockedToast("undo");
    return;
  }
  undoLastAction();
});

replayLevelBtn.addEventListener("click", () => {
  initLevel(state.levelIndex);
});

nextLevelBtn.addEventListener("click", () => {
  if (state.levelIndex + 1 >= getGameLevels().length) return;
  initLevel(state.levelIndex + 1);
});

startGameBtn.addEventListener("click", () => {
  document.body.classList.remove("is-starting");
  initLevel(getFirstUnclearedLevelIndex());
});

startStarsButton.addEventListener("click", () => {
  openToolUnlockModal();
});

totalStarsButton.addEventListener("click", () => {
  openToolUnlockModal();
});

closeToolUnlockBtn.addEventListener("click", () => {
  hideToolUnlockModal();
});

collectionRevealClose.addEventListener("click", () => {
  hideCollectionReveal();
});

toolUnlockModal.addEventListener("click", (event) => {
  if (event.target === toolUnlockModal) {
    hideToolUnlockModal();
  }
});

toolUnlockList.addEventListener("click", (event) => {
  const item = event.target.closest(".tool-unlock-item");
  if (!item) return;
  const itemKey = item.dataset.tool;
  selectToolGuide(itemKey && COLLECTION_ITEMS[itemKey] ? itemKey : null, item);
});

collectionTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    state.collectionFilter = tab.dataset.filter ?? "all";
    state.selectedCollectionItem = getDefaultCollectionItemKey();
    renderToolUnlockModal();
  });
});

collectionActionBtn.addEventListener("click", () => {
  const itemKey = state.selectedCollectionItem;
  const item = COLLECTION_ITEMS[itemKey];
  if (!item) return;
  if (!isCollectionItemUnlocked(itemKey)) {
    if (canUnlockCollectionItem(itemKey)) {
      unlockCollectionItem(itemKey);
    }
    return;
  }
  if (item.placeholder) return;
  if (item.type === "tool") {
    toggleEquippedTool(itemKey);
    return;
  }
  if (item.type === "ability") {
    toggleAbility(itemKey);
    return;
  }
  if (item.type === "skin") {
    equipSkin(itemKey);
  }
});

function setToolMode(mode) {
  state.toolMode = mode;
  if (mode && !canUseTool(mode)) state.toolMode = null;
  updateToolState();
}

function updateToolState() {
  pasture.classList.toggle("is-targeting", Boolean(state.toolMode));
  removeTool.classList.toggle("is-selected", state.toolMode === "remove");
  removeTool.disabled =
    state.locked || !isToolUsable("remove") || !hasToolUsesLeft("remove");
  removeTool.classList.toggle(
    "is-locked",
    !isToolUsable("remove") || !hasToolUsesLeft("remove"),
  );
  removeTool.setAttribute(
    "aria-pressed",
    state.toolMode === "remove" ? "true" : "false",
  );
  removeTool.querySelector(".tool-count").textContent =
    `${getToolUsesLeft("remove")}次`;
  firecrackerTool.disabled =
    state.locked || !isAbilityUsable("firecracker") || state.firecrackerRunning;
  firecrackerTool.classList.toggle(
    "is-locked",
    !isAbilityUsable("firecracker"),
  );
  firecrackerTool.classList.toggle("is-running", state.firecrackerRunning);
  updateUndoState();
}

function saveUndoSnapshot() {
  state.undoSnapshot = {
    cleared: state.cleared,
    combo: state.combo,
    score: state.score,
    toolUses: { ...state.toolUses },
    animals: state.animals.map((animal) => ({
      ...animal,
      active: animal.active,
      busy: false,
      stunned: animal.stunned,
    })),
  };
  updateUndoState();
}

function undoLastAction() {
  if (state.locked || !state.undoSnapshot) {
    showToast("暂无可撤销操作");
    return;
  }

  const snapshot = state.undoSnapshot;
  const nextUndoUses = state.toolUses.undo + 1;
  state.cleared = snapshot.cleared;
  state.combo = snapshot.combo;
  state.score = snapshot.score + SCORE_RULES.undoScore;
  state.toolMode = null;
  state.undoSnapshot = null;
  state.toolUses = {
    ...snapshot.toolUses,
    undo: nextUndoUses,
  };
  state.animals = snapshot.animals.map((animal) => ({ ...animal, busy: false }));
  state.animalById = new Map(state.animals.map((animal) => [animal.id, animal]));
  state.runToken += 1;
  clearPathRunners();

  hideLevelCompleteModal();
  hideComboBurst();
  render();
  updateHud();
  updateToolState();
  showToast("已撤销，-500分");
}

function updateUndoState() {
  if (!undoTool) return;
  undoTool.disabled = state.locked || !state.undoSnapshot || !isToolUnlocked("undo");
  undoTool.classList.toggle("is-locked", !isToolUnlocked("undo"));
  undoTool.querySelector(".tool-count").textContent = `${SCORE_RULES.undoScore}分`;
}

function canUseTool(tool) {
  if (tool === "remove") return isToolUsable("remove") && hasToolUsesLeft("remove");
  if (tool === "undo") return isToolUnlocked("undo");
  return false;
}

function hasToolUsesLeft(tool) {
  return getToolUsesLeft(tool) > 0;
}

function getToolUsesLeft(tool) {
  const limit = TOOL_LIMITS[tool];
  if (!Number.isFinite(limit)) return Infinity;
  return Math.max(0, limit - (state.toolUses[tool] ?? 0));
}

function isToolUnlocked(tool) {
  return isCollectionItemUnlocked(tool);
}

function isToolUsable(tool) {
  return isCollectionItemUnlocked(tool) && state.equippedTools.has(tool);
}

function isAbilityUsable(key) {
  return isCollectionItemUnlocked(key) && state.enabledAbilities.has(key);
}

function getToolStarsLeft(tool) {
  const unlock = TOOL_UNLOCKS[tool];
  if (!unlock) return 0;
  return Math.max(0, unlock.requiredStars - getTotalStars());
}

function showToolLockedToast(tool) {
  const unlock = TOOL_UNLOCKS[tool];
  if (!unlock) return;
  if (isCollectionItemUnlocked(tool)) {
    if (unlock.type === "tool" && !state.equippedTools.has(tool)) {
      showToast(`${unlock.name}未携带`);
      return;
    }
    if (unlock.type === "ability" && !state.enabledAbilities.has(tool)) {
      showToast(`${unlock.name}已关闭`);
      return;
    }
  }
  if (canUnlockCollectionItem(tool)) {
    showToast(`${unlock.name}可在收藏馆解锁`);
    return;
  }
  showToast(`${unlock.name}还差${getToolStarsLeft(tool)}★解锁`);
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
  const clearedLevels = getGameLevels().filter(
    (level) => (state.bestByLevel[level.id]?.stars ?? 0) > 0,
  ).length;
  startClearedLevels.textContent = clearedLevels;
  if (!toolUnlockModal.hidden) {
    renderToolUnlockModal();
  }
}

function openToolUnlockModal() {
  renderToolUnlockModal();
  toolUnlockModal.hidden = false;
}

function hideToolUnlockModal() {
  toolUnlockModal.hidden = true;
  hideCollectionReveal();
}

function renderToolUnlockModal() {
  const totalStars = getTotalStars();
  toolUnlockStarCount.textContent = `${totalStars}★`;
  collectionTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.filter === state.collectionFilter);
  });

  const toolSlots = getFilteredCollectionItems();
  if (!toolSlots.some((slot) => slot.key === state.selectedCollectionItem)) {
    state.selectedCollectionItem = toolSlots[0]?.key ?? null;
  }
  while (state.collectionFilter === "all" && toolSlots.length < TOOL_UNLOCK_GRID_SIZE) {
    toolSlots.push(null);
  }

  if (toolSlots.length === 0) {
    toolUnlockList.innerHTML = `
      <div class="collection-empty">
        <strong>${getCollectionEmptyTitle()}</strong>
        <p>${getCollectionEmptyText()}</p>
      </div>
    `;
    selectToolGuide(null);
    return;
  }

  toolUnlockList.innerHTML = toolSlots.map((slot) => {
    if (!slot) {
      return `
        <button class="tool-unlock-item is-locked" type="button" aria-label="待解锁内容">
          <span class="tool-unlock-icon" aria-hidden="true">?</span>
          <div class="tool-unlock-copy">
            <h3>待解锁</h3>
          </div>
          <strong class="tool-unlock-state">待定</strong>
        </button>
      `;
    }

    const { key, tool } = slot;
    const unlocked = isCollectionItemUnlocked(key);
    const ready = !unlocked && canUnlockCollectionItem(key);
    const starsLeft = Math.max(0, tool.requiredStars - totalStars);
    const active = isCollectionItemActive(key);
    const stateText = getCollectionStateText(key, unlocked);
    const titleText = unlocked || ready ? tool.name : `${tool.requiredStars}★解锁`;
    const iconMarkup = unlocked ? getCollectionIconMarkup(tool) : ready ? "★" : "?";
    const lockedLabel = ready ? "可解锁" : `${tool.requiredStars}★解锁`;
    return `
      <button class="tool-unlock-item ${unlocked ? "is-unlocked" : ready ? "is-ready" : "is-locked"} ${active ? "is-equipped" : ""}" type="button" data-tool="${key}" aria-label="${unlocked ? tool.name : ready ? `${tool.name}可解锁` : `还差${starsLeft}星解锁`}">
        <span class="tool-unlock-icon" aria-hidden="true">${iconMarkup}</span>
        <div class="tool-unlock-copy">
          <h3>${titleText}</h3>
        </div>
        <strong class="tool-unlock-state">
          ${unlocked ? stateText : lockedLabel}
        </strong>
      </button>
    `;
  }).join("");
  selectToolGuide(state.selectedCollectionItem);
}

function selectToolGuide(toolKey, selectedItem = null) {
  state.selectedCollectionItem = toolKey;
  toolUnlockList.querySelectorAll(".tool-unlock-item").forEach((item) => {
    const selected = selectedItem
      ? item === selectedItem
      : item.dataset.tool === toolKey;
    item.classList.toggle("is-selected", selected);
  });

  const tool = toolKey ? COLLECTION_ITEMS[toolKey] : null;
  const unlocked = toolKey ? isToolUnlocked(toolKey) : false;
  const ready = toolKey ? canUnlockCollectionItem(toolKey) : false;
  toolGuideTitle.textContent = tool ? tool.name : "待解锁";
  toolGuideMeta.textContent = tool
    ? getCollectionGuideMeta(toolKey, tool, unlocked)
    : "未知分类 · 解锁条件待定";
  toolGuideText.textContent = getCollectionGuideText(toolKey, tool, unlocked, ready);
  renderCollectionAction(toolKey, tool, unlocked);
}

function getFilteredCollectionItems() {
  return Object.entries(COLLECTION_ITEMS)
    .filter(([key, item]) => {
      if (state.collectionFilter === "all") return true;
      return item.type === state.collectionFilter && isCollectionItemUnlocked(key);
    })
    .map(([key, tool]) => ({ key, tool }));
}

function getCollectionEmptyTitle() {
  if (state.collectionFilter === "tool") return "暂无已拥有道具";
  if (state.collectionFilter === "ability") return "暂无已拥有能力";
  if (state.collectionFilter === "skin") return "暂无已拥有皮肤";
  return "暂无内容";
}

function getCollectionEmptyText() {
  if (state.collectionFilter === "tool") return `道具解锁后会出现在这里。每关最多携带${MAX_EQUIPPED_TOOLS}个道具。`;
  if (state.collectionFilter === "ability") return "能力解锁后会出现在这里，可以在详情里启用或关闭。";
  if (state.collectionFilter === "skin") return "皮肤解锁后会出现在这里，可以在详情里选择使用。";
  return "先去全部页查看可解锁内容。";
}

function getDefaultCollectionItemKey() {
  return getFilteredCollectionItems()[0]?.key ?? null;
}

function getCollectionStateText(key, unlocked) {
  if (!unlocked) return "";
  const item = COLLECTION_ITEMS[key];
  if (item.type === "tool") return state.equippedTools.has(key) ? "已携带" : "已拥有";
  if (item.type === "ability") return state.enabledAbilities.has(key) ? "已启用" : "已关闭";
  if (item.type === "skin") return state.equippedSkin === key ? "使用中" : "已解锁";
  return "已解锁";
}

function getCollectionGuideMeta(key, item, unlocked) {
  if (!unlocked) return `${item.typeName} · ${item.requiredStars}★解锁`;
  if (item.type === "tool") {
    return `${item.typeName} · ${state.equippedTools.has(key) ? "已携带" : "未携带"}`;
  }
  if (item.type === "ability") {
    return `${item.typeName} · ${state.enabledAbilities.has(key) ? "已启用" : "已关闭"}`;
  }
  if (item.type === "skin") {
    return `${item.typeName} · ${state.equippedSkin === key ? "使用中" : "已解锁"}`;
  }
  return `${item.typeName} · 已解锁`;
}

function isCollectionItemActive(key) {
  const item = COLLECTION_ITEMS[key];
  if (!item) return false;
  if (item.type === "tool") return state.equippedTools.has(key);
  if (item.type === "ability") return state.enabledAbilities.has(key);
  if (item.type === "skin") return state.equippedSkin === key;
  return false;
}

function isCollectionItemUnlocked(key) {
  return Boolean(COLLECTION_ITEMS[key]) && state.unlockedCollection.has(key);
}

function canUnlockCollectionItem(key) {
  const item = COLLECTION_ITEMS[key];
  return Boolean(item)
    && !isCollectionItemUnlocked(key)
    && getTotalStars() >= item.requiredStars;
}

function getCollectionGuideText(key, item, unlocked, ready) {
  if (!item) return "这个格子还没有配置内容。";
  if (unlocked && item.placeholder) return "这个格子已解锁，具体道具规则后续配置。";
  if (unlocked && item.type === "tool") {
    return `${item.guide} 每关最多携带${MAX_EQUIPPED_TOOLS}个道具，当前已携带${state.equippedTools.size}个。`;
  }
  if (unlocked && item.type === "ability") {
    return `${item.guide} 你可以在这里启用或关闭这个能力。`;
  }
  if (unlocked) return item.guide;
  if (ready) return "星星数量已达标，点击下方按钮手动解锁。";
  return `${item.requiredStars}★解锁，当前还差${getToolStarsLeft(key)}★。`;
}

function renderCollectionAction(key, item, unlocked) {
  if (!item) {
    collectionActionBtn.hidden = true;
    return;
  }

  if (!unlocked) {
    collectionActionBtn.hidden = false;
    collectionActionBtn.disabled = !canUnlockCollectionItem(key);
    collectionActionBtn.textContent = canUnlockCollectionItem(key)
      ? "解锁"
      : `还差${getToolStarsLeft(key)}★`;
    return;
  }

  if (item.placeholder) {
    collectionActionBtn.hidden = true;
    return;
  }

  if (item.type === "tool") {
    const equipped = state.equippedTools.has(key);
    collectionActionBtn.hidden = false;
    collectionActionBtn.disabled = !equipped && state.equippedTools.size >= MAX_EQUIPPED_TOOLS;
    collectionActionBtn.textContent = equipped
      ? "卸下"
      : state.equippedTools.size >= MAX_EQUIPPED_TOOLS
        ? `已满${MAX_EQUIPPED_TOOLS}个`
        : "携带";
    return;
  }

  if (item.type === "ability") {
    collectionActionBtn.hidden = false;
    collectionActionBtn.disabled = false;
    collectionActionBtn.textContent = state.enabledAbilities.has(key) ? "关闭" : "启用";
    return;
  }

  if (item.type === "skin") {
    collectionActionBtn.hidden = false;
    collectionActionBtn.disabled = state.equippedSkin === key;
    collectionActionBtn.textContent = state.equippedSkin === key ? "使用中" : "使用";
    return;
  }

  collectionActionBtn.hidden = true;
}

function getCollectionIconMarkup(item) {
  if (item?.image) {
    return `<img src="${item.image}" alt="" />`;
  }
  return item?.icon ?? "?";
}

function unlockCollectionItem(key) {
  if (!canUnlockCollectionItem(key)) return;
  const item = COLLECTION_ITEMS[key];
  state.unlockedCollection.add(key);
  if (item?.type === "ability") {
    state.enabledAbilities.add(key);
    saveEnabledAbilities();
  }
  saveUnlockedCollection();
  renderToolUnlockModal();
  updateToolState();
  triggerCollectionUnlockAnimation(key);
  showCollectionReveal(key);
}

function toggleEquippedTool(key) {
  if (!isCollectionItemUnlocked(key) || COLLECTION_ITEMS[key]?.type !== "tool") return;
  if (state.equippedTools.has(key)) {
    state.equippedTools.delete(key);
  } else {
    if (state.equippedTools.size >= MAX_EQUIPPED_TOOLS) return;
    state.equippedTools.add(key);
  }
  saveEquippedTools();
  renderToolUnlockModal();
  updateToolState();
}

function toggleAbility(key) {
  if (!isCollectionItemUnlocked(key) || COLLECTION_ITEMS[key]?.type !== "ability") return;
  if (state.enabledAbilities.has(key)) {
    state.enabledAbilities.delete(key);
  } else {
    state.enabledAbilities.add(key);
  }
  saveEnabledAbilities();
  renderToolUnlockModal();
  updateToolState();
}

function triggerCollectionUnlockAnimation(key) {
  window.requestAnimationFrame(() => {
    const item = toolUnlockList.querySelector(`[data-tool="${key}"]`);
    if (!item) return;
    item.classList.add("is-unlock-pop");
    window.setTimeout(() => {
      item.classList.remove("is-unlock-pop");
    }, 760);
  });
}

function showCollectionReveal(key) {
  const item = COLLECTION_ITEMS[key];
  if (!item) return;
  collectionRevealIcon.innerHTML = getCollectionIconMarkup(item);
  collectionRevealIcon.classList.toggle("has-image", Boolean(item.image));
  collectionRevealName.textContent = item.name;
  collectionReveal.hidden = false;
  collectionReveal.classList.remove("is-playing");
  void collectionReveal.offsetWidth;
  collectionReveal.classList.add("is-playing");
}

function hideCollectionReveal() {
  collectionReveal.hidden = true;
  collectionReveal.classList.remove("is-playing");
}

function equipSkin(key) {
  state.equippedSkin = key;
  saveEquippedSkin(key);
  renderToolUnlockModal();
}

function returnToStartScreen() {
  state.locked = true;
  state.toolMode = null;
  state.firecrackerRunning = false;
  state.runToken += 1;
  clearPathRunners();
  hideComboBurst();
  hideLevelCompleteModal();
  hideToolUnlockModal();
  updateToolState();
  renderStartScreen();
  document.body.classList.add("is-starting");
}

renderStartScreen();

const previewLevelIndex = getPreviewLevelIndexFromUrl();
if (previewLevelIndex !== null) {
  document.body.classList.remove("is-starting");
  initLevel(previewLevelIndex);
}
