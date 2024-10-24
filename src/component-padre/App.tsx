import React, { useState, useCallback, useMemo, useEffect } from 'react';
import * as Tone from 'tone';
import Keyboard from './components/Keyboard';
import Recorder from './components/Recorder';
import './App.css';

const availableNotes = [
  { note: 'C4', type: 'white', key: 'a' },
  { note: 'C#4', type: 'black', key: 'w' },
  { note: 'D4', type: 'white', key: 's' },
  { note: 'D#4', type: 'black', key: 'e' },
  { note: 'E4', type: 'white', key: 'd' },
  { note: 'F4', type: 'white', key: 'f' },
  { note: 'F#4', type: 'black', key: 't' },
  { note: 'G4', type: 'white', key: 'g' },
  { note: 'G#4', type: 'black', key: 'y' },
  { note: 'A4', type: 'white', key: 'h' },
  { note: 'A#4', type: 'black', key: 'u' },
  { note: 'B4', type: 'white', key: 'j' },
];

const Piano: React.FC = () => {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [recordedNotes, setRecordedNotes] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);

  const synth = useMemo(() => new Tone.Synth().toDestination(), []);

  const playSound = useCallback((note: string) => {
    synth.triggerAttackRelease(note, '8n');
  }, [synth]);

  const pressKey = useCallback((note: string) => {
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
  }, [playing, recording, playSound]);

  const releaseKey = useCallback((note: string) => {
    setActiveKeys((prevKeys) => prevKeys.filter((key) => key !== note));
  }, []);

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const note = availableNotes.find((n) => n.key === event.key.toLowerCase())?.note;
      if (note) {
        pressKey(note);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const note = availableNotes.find((n) => n.key === event.key.toLowerCase())?.note;
      if (note) {
        releaseKey(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pressKey, releaseKey]);

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