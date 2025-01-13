import React from 'react';

interface ControlsProps {
  onRoll: () => void;
  lastRoll: number | null;
  canAddOne: boolean;
  onAddOne: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ onRoll, lastRoll, canAddOne, onAddOne }) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <button onClick={onRoll}>Roll Dice</button>
      {lastRoll && (
        <div>
          <p>You rolled: {lastRoll}</p>
          {canAddOne && (
            <button onClick={onAddOne}>Add +1 to roll</button>
          )}
        </div>
      )}
    </div>
  );
};
