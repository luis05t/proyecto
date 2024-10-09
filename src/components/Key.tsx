import React from 'react';

interface KeyProps {
  note: string; 
  pressKey: (note: string) => void; 
  isActive: boolean;
}

const Key: React.FC<KeyProps> = ({ note, pressKey, isActive }) => {
  const playSound = (note: string) => {
    const audio = new Audio(`/sounds/${note}.mp3`); 
    audio.play();
  };

  const handleClick = () => {
    pressKey(note); 
    playSound(note); 
  };

  return (
    <div
      className={`key white ${isActive ? 'active' : ''}`} 
      onClick={handleClick} 
    >
      {note} 
    </div>
  );
};

export default Key;
