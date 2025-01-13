export type TerrainType = 'tee' | 'water' | 'sand' | 'grass' | 'tree' | 'green';

export interface Position {
  x: number;
  y: number;
}

export interface Cell {
  type: TerrainType;
  position: Position;
}

export interface HoleConfig {
  teePosition: Position;
  flagPosition: Position;
  obstacles: Array<{
    type: TerrainType;
    size: number;
  }>;
  par: number;
}

export interface HoleScore {
  strokes: number;
  par: number;
}

export interface GameState {
  currentHole: number;
  ballPosition: Position;
  lastRoll: number | null;
  strokes: number;
  canAddOne: boolean;
  possibleMoves: Position[];
  isComplete: boolean;
  scores: HoleScore[];
}
