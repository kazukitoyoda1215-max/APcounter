import React from 'react';

interface WalkingCatProps {
  isRunning: boolean;
}

const WalkingCat: React.FC<WalkingCatProps> = ({ isRunning }) => {
  return (
    <div className={`cat-animation-wrapper ${isRunning ? 'running' : ''}`}>
      <div className="cat-container">
        <div className="cat">
          <div className="body"></div>
          <div className="head">
            <div className="ear ear-left"></div>
            <div className="ear ear-right"></div>
            <div className="eye eye-left"></div>
            <div className="eye eye-right"></div>
          </div>
          <div className="tail"></div>
          <div className="leg leg-front-left"></div>
          <div className="leg leg-front-right"></div>
          <div className="leg leg-back-left"></div>
          <div className="leg leg-back-right"></div>
        </div>
      </div>
      <div className="ground"></div>
    </div>
  );
};

export default WalkingCat;
