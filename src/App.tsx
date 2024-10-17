import React, { useState, useCallback, useMemo, useEffect } from 'react';
import * as Tone from 'tone';
import Keyboard from './components/Keyboard';
import Recorder from './components/Recorder';
import './App.css';

const availableNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];

const Piano: React.FC = () => {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [recordedNotes, setRecordedNotes] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);

  
  const synth = useMemo(() => new Tone.Synth().toDestination(), []);

  
  const playSound = useCallback((note: string) => {
    synth.triggerAttackRelease(note, '8n');
  }, [synth]);

  const pressKey = (note: string) => {
    setActiveKeys((prevKeys) => {
      if (!prevKeys.includes(note)) {
        return [...prevKeys, note];
      }
      return prevKeys;
    });
    if (!playing && recording) {
      setRecordedNotes((prevNotes) => [...prevNotes, note]);
    }
    playSound(note);
  };

  const releaseKey = (note: string) => {
    setActiveKeys((prevKeys) => prevKeys.filter((key) => key !== note));
  };

  
  const playRecordedNotes = useCallback(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < recordedNotes.length) {
        playSound(recordedNotes[index]);
        index++;
      } else {
        clearInterval(intervalId);
        setPlaying(false);
      }
    }, 500); 
  }, [recordedNotes, playSound]);

 
  useEffect(() => {
    if (playing) {
      playRecordedNotes();
    }
  }, [playing, playRecordedNotes]);

  return (
    <div className="piano">
      <Keyboard
        notes={availableNotes}
        pressKey={pressKey}
        releaseKey={releaseKey}
        activeKeys={activeKeys}
        playSound={playSound}
      />
      <Recorder
        recordedNotes={recordedNotes}
        setRecordedNotes={setRecordedNotes}
        playing={playing}
        setPlaying={setPlaying}
        recording={recording}
        setRecording={setRecording}
      />
    </div>
  );
};

export default Piano;