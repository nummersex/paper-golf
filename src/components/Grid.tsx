import React from 'react';
import { Cell } from './Cell';
import { Cell as CellType, Position } from '../types';
import { isSamePosition } from '../utils/movement';

interface GridProps {
  cells: CellType[];
  ballPosition: Position;
  flagPosition: Position;
  width: number;
  height: number;
  possibleMoves: Position[];
  onCellClick: (position: Position) => void;
}

export const Grid: React.FC<GridProps> = ({ 
  cells, 
  ballPosition, 
  flagPosition, 
  width,
  possibleMoves,
  onCellClick
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${width}, 40px)`,
        gap: '1px',
      }}
    >
      {cells.map((cell, index) => {
        const isPossibleMove = possibleMoves.some(pos => 
          isSamePosition(pos, cell.position)
        );
        
        return (
          <Cell
            key={index}
            type={cell.type}
            hasBall={isSamePosition(cell.position, ballPosition)}
            hasFlag={isSamePosition(cell.position, flagPosition)}
            isPossibleMove={isPossibleMove}
            onClick={() => isPossibleMove ? onCellClick(cell.position) : undefined}
          />
        );
      })}
    </div>
  );
};
