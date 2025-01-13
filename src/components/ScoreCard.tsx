import React from 'react';
import { HoleScore } from '../types';

interface ScoreCardProps {
  scores: HoleScore[];
  onPlayAgain: () => void;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ scores, onPlayAgain }) => {
  const totalStrokes = scores.reduce((sum, hole) => sum + hole.strokes, 0);
  const totalPar = scores.reduce((sum, hole) => sum + hole.par, 0);
  const relativeToPar = totalStrokes - totalPar;

  // Split holes into front nine and back nine
  const frontNine = scores.slice(0, 9);
  const backNine = scores.slice(9, 18);

  const renderScoreSection = (holes: HoleScore[], startIndex: number) => (
    <div style={{ marginBottom: '20px' }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        textAlign: 'center',
        fontSize: '16px'
      }}>
        <thead>
          <tr>
            <th style={{ padding: '8px', borderBottom: '2px solid #333' }}>Hole</th>
            {holes.map((_, idx) => (
              <th key={idx} style={{ padding: '8px', borderBottom: '2px solid #333' }}>
                {startIndex + idx + 1}
              </th>
            ))}
            <th style={{ padding: '8px', borderBottom: '2px solid #333' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {/* Par Row */}
          <tr>
            <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>Par</td>
            {holes.map((hole, idx) => (
              <td key={idx} style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>
                {hole.par}
              </td>
            ))}
            <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>
              {holes.reduce((sum, hole) => sum + hole.par, 0)}
            </td>
          </tr>
          {/* Score Row */}
          <tr>
            <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>Score</td>
            {holes.map((hole, idx) => (
              <td key={idx} style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>
                {hole.strokes}
              </td>
            ))}
            <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>
              {holes.reduce((sum, hole) => sum + hole.strokes, 0)}
            </td>
          </tr>
          {/* Difference Row */}
          <tr>
            <td style={{ padding: '8px', fontWeight: 'bold' }}>+/-</td>
            {holes.map((hole, idx) => {
              const diff = hole.strokes - hole.par;
              const color = diff > 0 ? '#ff4444' : diff < 0 ? '#44aa44' : '#000000';
              return (
                <td 
                  key={idx} 
                  style={{ 
                    padding: '8px',
                    color: color,
                    fontWeight: 'bold'
                  }}
                >
                  {diff === 0 ? 'E' : diff > 0 ? `+${diff}` : diff}
                </td>
              );
            })}
            <td style={{ 
              padding: '8px', 
              fontWeight: 'bold',
              color: relativeToPar > 0 ? '#ff4444' : relativeToPar < 0 ? '#44aa44' : '#000000'
            }}>
              {relativeToPar === 0 ? 'E' : relativeToPar > 0 ? `+${relativeToPar}` : relativeToPar}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      maxWidth: '900px',
      margin: '0 auto',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Final Score Card</h2>
      
      <h3 style={{ marginBottom: '10px' }}>Front Nine</h3>
      {renderScoreSection(frontNine, 0)}
      
      <h3 style={{ marginBottom: '10px' }}>Back Nine</h3>
      {renderScoreSection(backNine, 9)}

      <div style={{ 
        textAlign: 'center',
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px'
      }}>
        <h3 style={{ marginBottom: '10px' }}>Final Score</h3>
        <div style={{ fontSize: '18px', marginBottom: '5px' }}>
          Total Strokes: {totalStrokes}
        </div>
        <div style={{ fontSize: '18px', marginBottom: '5px' }}>
          Course Par: {totalPar}
        </div>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: 'bold',
          color: relativeToPar > 0 ? '#ff4444' : relativeToPar < 0 ? '#44aa44' : '#000000'
        }}>
          {relativeToPar === 0 ? 'Even Par' : 
           relativeToPar > 0 ? `${relativeToPar} Over Par` : 
           `${Math.abs(relativeToPar)} Under Par`}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          onClick={onPlayAgain}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#45a049')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#4CAF50')}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};
