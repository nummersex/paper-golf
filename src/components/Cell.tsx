import React from 'react';
import { TerrainType } from '../types';

interface CellProps {
  type: TerrainType;
  hasBall: boolean;
  hasFlag: boolean;
  isPossibleMove: boolean;
  onClick?: () => void;
}

const terrainColors: Record<TerrainType, string> = {
  tee: '#a0d8ef',
  water: '#0077be',
  sand: '#f7e39c',
  grass: '#90ee90',
  tree: '#228b22',
  green: '#32cd32'
};

export const Cell: React.FC<CellProps> = ({ 
  type, 
  hasBall, 
  hasFlag, 
  isPossibleMove,
  onClick 
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: '40px',
        height: '40px',
        backgroundColor: terrainColors[type],
        border: isPossibleMove ? '2px solid yellow' : '1px solid #666',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        cursor: isPossibleMove ? 'pointer' : 'default'
      }}
    >
      {hasBall && (
        <div
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: 'white',
            borderRadius: '50%'
          }}
        />
      )}
      {hasFlag && (
        <div
          style={{
            width: '4px',
            height: '30px',
            backgroundColor: 'red',
            position: 'relative'
          }}
        >
          <div
            style={{
              width: '15px',
              height: '10px',
              backgroundColor: 'red',
              position: 'absolute',
              top: 0,
              right: 0
            }}
          />
        </div>
      )}
    </div>
  );
};
