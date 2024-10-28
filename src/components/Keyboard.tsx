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
    <div className="keyboard" role="region" aria-label="Virtual keyboard">
      {notes.map(({ note, type }) => (
        <div
          key={note}
          role="button"
          aria-pressed={activeKeys.includes(note)}
          className={`key ${type} ${activeKeys.includes(note) ? 'active' : ''}`}
          onMouseDown={() => pressKey(note)}
          onMouseUp={() => releaseKey(note)}
          onMouseLeave={() => releaseKey(note)}
          tabIndex={0}
          aria-label={`Key ${note}`}
        >
          <span className="note-name">{note}</span>
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
