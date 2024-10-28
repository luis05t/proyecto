import React from 'react';

interface KeyboardProps {
  notes: { note: string; type: string }[];
  pressKey: (note: string) => void;
  releaseKey: (note: string) => void;
  activeKeys: string[];
  playSound: (note: string) => void;
}

const Keyboard: React.FC<KeyboardProps> = ({ notes, pressKey, releaseKey, activeKeys }) => {
  return (
    <div className="keyboard">
      {notes.map(({ note, type }) => (
        <div
          key={note}
          className={`key ${type} ${activeKeys.includes(note) ? 'active' : ''}`}
          onMouseDown={() => pressKey(note)}
          onMouseUp={() => releaseKey(note)}
          onMouseLeave={() => releaseKey(note)}
        >
          <span className="note-name">{note}</span>
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
