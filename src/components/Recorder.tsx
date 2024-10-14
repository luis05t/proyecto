import React, { useEffect, useRef, useState } from 'react';

interface RecorderProps {
  recordedNotes: string[]; 
  setRecordedNotes: (notes: string[]) => void; 
  playing: boolean; 
  setPlaying: (state: boolean) => void; 
}

const Recorder: React.FC<RecorderProps> = ({ recordedNotes, setRecordedNotes, playing, setPlaying }) => {
  const [recording, setRecording] = useState(false); 
  const sequenceRef = useRef<number | null>(null); 

  const startRecording = () => {
    setRecordedNotes([]); 
    setRecording(true); 
  };

  const stopRecording = () => {
    setRecording(false);
  };

  const playRecording = () => {
    setPlaying(true); 
    sequenceRef.current = 0; 
  };

  useEffect(() => {
    if (playing && sequenceRef.current !== null && sequenceRef.current < recordedNotes.length) {
      setTimeout(() => {
        sequenceRef.current!++; 
      }, 500); 
    } else if (sequenceRef.current === recordedNotes.length) {
      setPlaying(false);
      sequenceRef.current = null; 
    }
  }, [playing, recordedNotes]); 

  return (
    <div className="recorder">
      {}
      <button onClick={startRecording} disabled={recording}>
        Record
      </button>
      {}
      <button onClick={stopRecording} disabled={!recording}>
        Stop
      </button>
      {}
      <button onClick={playRecording} disabled={recordedNotes.length === 0 || playing}>
        Play
      </button>
    </div>
  );
};

export default Recorder;
