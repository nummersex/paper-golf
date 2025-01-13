import { Position } from '../types';

export const calculatePossibleMoves = (
  currentPosition: Position,
  distance: number,
  gridWidth: number,
  gridHeight: number
): Position[] => {
  const moves: Position[] = [];
  const directions = [
    [-1, 0],  // left
    [1, 0],   // right
    [0, -1],  // up
    [0, 1],   // down
    [-1, -1], // diagonal up-left
    [1, -1],  // diagonal up-right
    [-1, 1],  // diagonal down-left
    [1, 1],   // diagonal down-right
  ];

  directions.forEach(([dx, dy]) => {
    const newX = currentPosition.x + (dx * distance);
    const newY = currentPosition.y + (dy * distance);

    if (
      newX >= 0 && 
      newX < gridWidth && 
      newY >= 0 && 
      newY < gridHeight
    ) {
      moves.push({ x: newX, y: newY });
    }
  });

  return moves;
};

export const isSamePosition = (pos1: Position, pos2: Position): boolean => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};
