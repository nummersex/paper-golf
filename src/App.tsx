import React, { useState } from 'react';
import { Grid } from './components/Grid';
import { Controls } from './components/Controls';
import { ScoreCard } from './components/ScoreCard';
import { Cell, GameState, Position } from './types';
import { calculatePossibleMoves } from './utils/movement';
import { generateCourse, isPathClear, isNearFlag, HOLE_CONFIGURATIONS } from './utils/terrain';

const GRID_WIDTH = 8;
const GRID_HEIGHT = 12;

const createInitialState = (): GameState => ({
  currentHole: 0,
  ballPosition: HOLE_CONFIGURATIONS[0].teePosition,
  lastRoll: null,
  strokes: 0,
  canAddOne: true,
  possibleMoves: [],
  isComplete: false,
  scores: []
});

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [cells, setCells] = useState<Cell[]>(() => 
    generateCourse(GRID_WIDTH, GRID_HEIGHT, 0)
  );

  const currentHoleConfig = HOLE_CONFIGURATIONS[gameState.currentHole];

  const startNextHole = () => {
    const nextHole = gameState.currentHole + 1;
    if (nextHole < HOLE_CONFIGURATIONS.length) {
      setCells(generateCourse(GRID_WIDTH, GRID_HEIGHT, nextHole));
      setGameState(prev => ({
        ...prev,
        currentHole: nextHole,
        ballPosition: HOLE_CONFIGURATIONS[nextHole].teePosition,
        lastRoll: null,
        strokes: 0,
        canAddOne: true,
        possibleMoves: [],
        isComplete: false
      }));
    }
  };

  const resetGame = () => {
    setCells(generateCourse(GRID_WIDTH, GRID_HEIGHT, 0));
    setGameState(createInitialState());
  };

  const rollDice = () => {
    if (gameState.isComplete) return;

    const roll = Math.floor(Math.random() * 6) + 1;
    setGameState(prev => {
      const currentCell = cells.find(c => 
        c.position.x === prev.ballPosition.x && 
        c.position.y === prev.ballPosition.y
      );
      
      let possibleMoves = calculatePossibleMoves(
        prev.ballPosition,
        roll,
        GRID_WIDTH,
        GRID_HEIGHT
      );

      possibleMoves = possibleMoves.filter(move => 
        isPathClear(prev.ballPosition, move, cells, GRID_WIDTH)
      );

      return {
        ...prev,
        lastRoll: roll,
        canAddOne: currentCell ? ['tee', 'grass'].includes(currentCell.type) : false,
        possibleMoves
      };
    });
  };

  const addOne = () => {
    if (gameState.lastRoll && gameState.canAddOne) {
      setGameState(prev => {
        const newRoll = prev.lastRoll! + 1;
        let possibleMoves = calculatePossibleMoves(
          prev.ballPosition,
          newRoll,
          GRID_WIDTH,
          GRID_HEIGHT
        );

        possibleMoves = possibleMoves.filter(move => 
          isPathClear(prev.ballPosition, move, cells, GRID_WIDTH)
        );

        return {
          ...prev,
          lastRoll: newRoll,
          canAddOne: false,
          possibleMoves
        };
      });
    }
  };

  const handleCellClick = (position: Position) => {
    setGameState(prev => {
      const newStrokes = prev.strokes + 1;
      const newState = {
        ...prev,
        ballPosition: position,
        lastRoll: null,
        strokes: newStrokes,
        possibleMoves: [],
        canAddOne: true
      };

      if (isNearFlag(position, currentHoleConfig.flagPosition)) {
        newState.isComplete = true;
        const newScores = [
          ...prev.scores,
          { strokes: newStrokes, par: currentHoleConfig.par }
        ];
        newState.scores = newScores;

        // Check if this was the last hole
        if (prev.currentHole === HOLE_CONFIGURATIONS.length - 1) {
          // This was the final hole, don't allow moving to next hole
          return {
            ...newState,
            scores: newScores
          };
        }
      }

      return newState;
    });
  };

  // Show score card if we've completed the last hole
  if (gameState.isComplete && gameState.currentHole === HOLE_CONFIGURATIONS.length - 1) {
    return <ScoreCard scores={gameState.scores} onPlayAgain={resetGame} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 10px 0' }}>Paper Golf - Hole {gameState.currentHole + 1}</h1>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px',
          fontSize: '1.2em'
        }}>
          <div>Par: {currentHoleConfig.par}</div>
          <div>Strokes: {gameState.strokes}</div>
        </div>
      </div>

      {gameState.isComplete && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            color: 'green', 
            fontWeight: 'bold', 
            marginBottom: '10px' 
          }}>
            Hole Complete! Strokes taken: {gameState.strokes}
          </div>
          <button 
            onClick={startNextHole}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '10px 20px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Next Hole
          </button>
        </div>
      )}

      <Grid
        cells={cells}
        ballPosition={gameState.ballPosition}
        flagPosition={currentHoleConfig.flagPosition}
        width={GRID_WIDTH}
        height={GRID_HEIGHT}
        possibleMoves={gameState.possibleMoves}
        onCellClick={handleCellClick}
      />

      <Controls
        onRoll={rollDice}
        lastRoll={gameState.lastRoll}
        canAddOne={gameState.canAddOne}
        onAddOne={addOne}
      />
    </div>
  );
};

export default App;
