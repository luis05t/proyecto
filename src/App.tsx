import React, { useState } from 'react';
import Keyboard from './components/Keyboard';
import Recorder from './components/Recorder';
import './App.css';


const availableNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];

const Piano: React.FC = () => {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [recordedNotes, setRecordedNotes] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);

  const pressKey = (note: string) => {
    setActiveKeys([...activeKeys, note]);
    if (!playing) {
      setRecordedNotes([...recordedNotes, note]);
    }
  };

  return (
    <div className="piano">
      <Keyboard 
        notes={availableNotes} 
        pressKey={pressKey}
        activeKeys={activeKeys}
      />
      <Recorder 
        recordedNotes={recordedNotes}
        setRecordedNotes={setRecordedNotes}
        playing={playing}
        setPlaying={setPlaying}
      />
    </div>
  );
};

export default Piano;
