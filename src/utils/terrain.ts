import { Cell, TerrainType, Position, HoleConfig } from '../types';

const createObstacle = (
  startX: number,
  startY: number,
  //type: TerrainType,
  size: number,
  gridWidth: number,
  gridHeight: number
): Position[] => {
  const positions: Position[] = [];
  const visited = new Set<string>();
  
  const isValidPosition = (x: number, y: number) => {
    return x >= 0 && x < gridWidth && y >= 0 && y < gridHeight;
  };

  const addPosition = (x: number, y: number) => {
    const key = `${x},${y}`;
    if (!visited.has(key) && isValidPosition(x, y)) {
      positions.push({ x, y });
      visited.add(key);
    }
  };

  addPosition(startX, startY);

  while (positions.length < size) {
    const randomIndex = Math.floor(Math.random() * positions.length);
    const { x, y } = positions[randomIndex];
    
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const shuffledDirections = directions.sort(() => Math.random() - 0.5);
    
    for (const [dx, dy] of shuffledDirections) {
      if (positions.length < size) {
        addPosition(x + dx, y + dy);
      }
    }
  }

  return positions;
};

export const HOLE_CONFIGURATIONS: HoleConfig[] = Array.from({ length: 18 }, (_, index) => {
  const isLongHole = Math.random() > 0.5;
  const teeX = Math.floor(Math.random() * 6) + 1;
  const flagX = Math.floor(Math.random() * 6) + 1;
  
  // Make later holes more challenging
  const difficulty = Math.min(1, (index + 5) / 18);
  const obstacleCount = Math.floor(2 + difficulty * 2);
  const obstacleSize = Math.floor(3 + difficulty * 3);

  return {
    teePosition: {
      x: teeX,
      y: 10
    },
    flagPosition: {
      x: flagX,
      y: isLongHole ? 1 : 2
    },
    obstacles: [
      { type: 'tree' as TerrainType, size: obstacleSize },
      { type: 'water' as TerrainType, size: obstacleSize - 1 },
      { type: 'sand' as TerrainType, size: obstacleSize }
    ].slice(0, obstacleCount),
    par: isLongHole ? 5 : 4
  };
});

// Override first few holes to be easier
HOLE_CONFIGURATIONS[0] = {
  teePosition: { x: 4, y: 10 },
  flagPosition: { x: 4, y: 2 },
  obstacles: [
    { type: 'sand' as TerrainType, size: 3 }
  ],
  par: 3
};

HOLE_CONFIGURATIONS[1] = {
  teePosition: { x: 2, y: 10 },
  flagPosition: { x: 6, y: 2 },
  obstacles: [
    { type: 'water' as TerrainType, size: 3 },
    { type: 'sand' as TerrainType, size: 3 }
  ],
  par: 3
};

HOLE_CONFIGURATIONS[2] = {
  teePosition: { x: 1, y: 10 },
  flagPosition: { x: 7, y: 2 },
  obstacles: [
    { type: 'tree' as TerrainType, size: 3 },
    { type: 'sand' as TerrainType, size: 4 }
  ],
  par: 4
};

export const generateCourse = (
  width: number, 
  height: number, 
  holeIndex: number
): Cell[] => {
  const cells: Cell[] = [];
  const config = HOLE_CONFIGURATIONS[holeIndex];

  // Initialize all cells as grass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      cells.push({
        type: 'grass',
        position: { x, y }
      });
    }
  }

  // Add tee and green
  const teeIndex = config.teePosition.y * width + config.teePosition.x;
  const flagIndex = config.flagPosition.y * width + config.flagPosition.x;
  cells[teeIndex].type = 'tee';
  cells[flagIndex].type = 'green';

  // Add obstacles
  config.obstacles.forEach(obstacle => {
    let attempts = 0;
    let validPosition = false;
    let obstaclePositions: Position[] = [];

    while (!validPosition && attempts < 10) {
      const startX = Math.floor(Math.random() * width);
      const startY = Math.floor(Math.random() * (height - 4)) + 2;

      // obstaclePositions = createObstacle(startX, startY, obstacle.type, obstacle.size, width, height);
      obstaclePositions = createObstacle(startX, startY, obstacle.size, width, height);
      
      // Check if obstacle overlaps with tee, green, or path between them
      const overlapsImportantAreas = obstaclePositions.some(pos => {
        const distanceToTee = Math.abs(pos.x - config.teePosition.x) + Math.abs(pos.y - config.teePosition.y);
        const distanceToFlag = Math.abs(pos.x - config.flagPosition.x) + Math.abs(pos.y - config.flagPosition.y);
        const isTooCloseToTee = distanceToTee < 2;
        const isTooCloseToFlag = distanceToFlag < 2;
        
        return isTooCloseToTee || isTooCloseToFlag;
      });

      if (!overlapsImportantAreas) {
        validPosition = true;
      }
      attempts++;
    }

    if (validPosition) {
      obstaclePositions.forEach(pos => {
        const index = pos.y * width + pos.x;
        cells[index].type = obstacle.type;
      });
    }
  });

  return cells;
};

export const isPathClear = (
  start: Position,
  end: Position,
  cells: Cell[],
  gridWidth: number
): boolean => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  
  if (steps === 0) return true;

  const xStep = dx / steps;
  const yStep = dy / steps;

  for (let i = 1; i < steps; i++) {
    const x = Math.round(start.x + xStep * i);
    const y = Math.round(start.y + yStep * i);
    const cell = cells[y * gridWidth + x];

    if (cell.type === 'tree') {
      return false;
    }
  }

  return true;
};

export const isNearFlag = (ballPos: Position, flagPos: Position): boolean => {
  const dx = Math.abs(ballPos.x - flagPos.x);
  const dy = Math.abs(ballPos.y - flagPos.y);
  return dx <= 1 && dy <= 1;
};
