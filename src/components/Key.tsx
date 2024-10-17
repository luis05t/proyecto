import React, { useEffect, useCallback } from 'react';

interface KeyProps {
  note: string;
  pressKey: (note: string) => void;
  releaseKey: (note: string) => void;
  isActive: boolean;
  keyboardKey?: string;
  playSound: (note: string) => void;
}

const Key: React.FC<KeyProps> = ({ note, pressKey, releaseKey, isActive, keyboardKey, playSound }) => {
  const handleClick = useCallback(() => {
    pressKey(note);
    playSound(note);
  }, [note, pressKey, playSound]);

  useEffect(() => {
    const keyToNoteMap: { [key: string]: string } = {
      'a': 'C4', 
      's': 'D4', 
      'd': 'E4', 
      'f': 'F4', 
      'g': 'G4', 
      'h': 'A4', 
      'j': 'B4'
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const noteToPlay = keyToNoteMap[event.key];
      if (noteToPlay) {
        pressKey(noteToPlay);
        playSound(noteToPlay);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const noteToRelease = keyToNoteMap[event.key];
      if (noteToRelease) {
        releaseKey(noteToRelease);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pressKey, playSound, releaseKey]);

  return (
    <div
      className={`key ${note.includes('#') ? 'black' : 'white'} ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <span className="note-name">{note}</span>
      {keyboardKey && <span className="keyboard-key">{keyboardKey}</span>}
    </div>
  );
};

export default React.memo(Key);