import React, { useState, useCallback, useMemo, useEffect } from 'react';
import * as Tone from 'tone';
import Keyboard from './components/Keyboard';
import Recorder from './components/Recorder';
import './App.css';

interface Note {
  note: string;
  type: 'white' | 'black';
  key: string;
}

interface RecordedNote {
  note: string;
  timestamp: number;
  duration?: number;  
  gap?: number;       
}

const availableNotes: Note[] = [
  { note: 'C4', type: 'white', key: 'a' },
  { note: 'C#4', type: 'black', key: 'w' },
  { note: 'D4', type: 'white', key: 's' },
  { note: 'D#4', type: 'black', key: 'e' },
  { note: 'E4', type: 'white', key: 'd' },
  { note: 'R#4', type: 'black', key: 'r' },
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
  const [recordedNotes, setRecordedNotes] = useState<RecordedNote[]>([]);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  const pressedKeysRef = React.useRef<Map<string, number>>(new Map());
  
  const synth = useMemo(() => new Tone.Synth().toDestination(), []);

  const playSound = useCallback((note: string) => {
    synth.triggerAttackRelease(note, '8n');
  }, [synth]);

  const pressKey = useCallback((note: string) => {
    const currentTime = Date.now();
    
    setActiveKeys((prevKeys) => {
      if (!prevKeys.includes(note)) {
        return [...prevKeys, note];
      }
      return prevKeys;
    });

    if (!playing && recording) {
      pressedKeysRef.current.set(note, currentTime);
      
      if (recordedNotes.length > 0) {
        const lastNote = recordedNotes[recordedNotes.length - 1];
        const gap = currentTime - (lastNote.timestamp + (lastNote.duration || 0));
        
        setRecordedNotes(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...lastNote, gap };
          return updated;
        });
      }
    }
    
    playSound(note);
  }, [playing, recording, recordedNotes, playSound]);

  const releaseKey = useCallback((note: string) => {
    const currentTime = Date.now();
    
    setActiveKeys((prevKeys) => prevKeys.filter((key) => key !== note));
    
    if (!playing && recording && pressedKeysRef.current.has(note)) {
      const pressTime = pressedKeysRef.current.get(note)!;
      const duration = currentTime - pressTime;
      
      setRecordedNotes(prev => [...prev, {
        note,
        timestamp: pressTime - (startTime || pressTime),
        duration,
      }]);
      
      pressedKeysRef.current.delete(note);
    }
  }, [playing, recording, startTime]);

  const playRecordedNotes = useCallback(() => {
    setPlaying(true);
    let index = 0;

    const playNextNote = () => {
      if (index < recordedNotes.length) {
        const currentNote = recordedNotes[index];
        const delay = index === 0 ? 0 : 
          (currentNote.timestamp - recordedNotes[index - 1].timestamp);

        setTimeout(() => {
          playSound(currentNote.note);
          setActiveKeys(prev => [...prev, currentNote.note]);
          
          if (currentNote.duration) {
            setTimeout(() => {
              setActiveKeys(prev => prev.filter(key => key !== currentNote.note));
            }, currentNote.duration);
          }
          
          index++;
          playNextNote();
        }, delay);
      } else {
        setPlaying(false);
      }
    };

    playNextNote();
  }, [recordedNotes, playSound]);

  useEffect(() => {
    if (playing) {
      playRecordedNotes();
    }
  }, [playing, playRecordedNotes]);

  useEffect(() => {
    if (recording) {
      setStartTime(Date.now());
      setRecordedNotes([]);
      pressedKeysRef.current.clear();
    } else {
      setStartTime(null);
    }
  }, [recording]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const note = availableNotes.find((n) => n.key === event.key.toLowerCase())?.note;
      if (note && !event.repeat) {
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