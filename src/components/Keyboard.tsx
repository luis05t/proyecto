import React from 'react';
import Key from './Key';

interface KeyboardProps {
  notes: string[]; 
  pressKey: (note: string) => void; 
  activeKeys: string[];
}

const Keyboard: React.FC<KeyboardProps> = ({ notes, pressKey, activeKeys }) => {
  return (
    <div className="keyboard"> {/* Container for the keyboard */}
      {notes.map((note) => (
        <Key
          key={note} 
          note={note} 
          pressKey={pressKey} 
          isActive={activeKeys.includes(note)} 
        />
      ))}
    </div>
  );
};

export default Keyboard; 