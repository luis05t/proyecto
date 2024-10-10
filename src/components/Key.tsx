import React, { useEffect } from 'react';
import * as Tone from 'tone'; // Importa Tone.js

interface KeyProps {
  note: string; 
  pressKey: (note: string) => void; 
  isActive: boolean;
}

const Key: React.FC<KeyProps> = ({ note, pressKey, isActive }) => {
  const synth = new Tone.Synth().toDestination();

  const playSound = (note: string) => {
    synth.triggerAttackRelease(note, '8n'); // 
  };

  const handleClick = () => {
    pressKey(note); 
    playSound(note); 
  };

  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyToNoteMap: { [key: string]: string } = {
        'a': 'C4',
        's': 'D4',
        'd': 'E4',
        'f': 'F4',
        'g': 'G4',
        'h': 'A4',
        'j': 'B4'
      };

      const note = keyToNoteMap[event.key];
      if (note) {
        pressKey(note);
        playSound(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown); 
    return () => {
      window.removeEventListener('keydown', handleKeyDown); 
    };
  }, [pressKey]); 

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
