import React, { useEffect, useCallback, useMemo } from 'react';
import * as Tone from 'tone';

interface KeyProps {
  note: string; 
  pressKey: (note: string) => void; 
  isActive: boolean; 
  keyboardKey?: string;
}

const Key: React.FC<KeyProps> = ({ note, pressKey, isActive, keyboardKey }) => {
  const synth = useMemo(() => new Tone.Synth().toDestination(), []);

  const playSound = useCallback((noteToPlay: string) => {
    synth.triggerAttackRelease(noteToPlay, '8n');
  }, [synth]);

  const handleClick = useCallback(() => {
    pressKey(note); 
    playSound(note); 
  }, [note, pressKey, playSound]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return; 
      if (event.key === keyboardKey) {
        pressKey(note); 
        playSound(note); 
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === keyboardKey) {
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keyboardKey, note, pressKey, playSound]);

  const isBlackKey = note.includes('#');

  return (
    <div
      className={`key ${isBlackKey ? 'black' : 'white'} ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <span className="note-name">{note}</span> {}
      {keyboardKey && <span className="keyboard-key">{keyboardKey}</span>} {}
    </div>
  );
};

export default React.memo(Key); 
