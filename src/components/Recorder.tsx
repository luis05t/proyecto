import React, { useEffect, useRef } from 'react';

interface RecorderProps {
  recordedNotes: string[];
  setRecordedNotes: (notes: string[]) => void;
  playing: boolean;
  setPlaying: (state: boolean) => void;
  recording: boolean;
  setRecording: (state: boolean) => void;
}

const Recorder: React.FC<RecorderProps> = ({ 
  recordedNotes, 
  setRecordedNotes, 
  playing, 
  setPlaying,
  recording,
  setRecording
}) => {
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
  }, [playing, recordedNotes, setPlaying]);

  return (
    <div className="recorder">
      <button onClick={startRecording} disabled={recording}>
        Record
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop
      </button>
      <button onClick={playRecording} disabled={recordedNotes.length === 0 || playing}>
        Play
      </button>
    </div>
  );
};

export default Recorder;