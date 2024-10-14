import React from 'react';
import Key from './Key';

interface KeyboardProps {
  notes: string[]; 
  pressKey: (note: string) => void; 
  releaseKey: (note: string) => void; 
  activeKeys: string[];
}

const Keyboard: React.FC<KeyboardProps> = ({ notes, pressKey, releaseKey, activeKeys }) => {
  return (
    <div className="keyboard"> {}
      {notes.map((note) => (
        <Key
          key={note} 
          note={note} 
          pressKey={pressKey} 
          releaseKey={releaseKey}
          isActive={activeKeys.includes(note)} 
        />
      ))}
    </div>
  );
};

export default Keyboard;
