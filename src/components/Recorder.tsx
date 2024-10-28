import React, { useEffect, useRef, useCallback } from 'react';

const PLAYBACK_DELAY = 500;
const BUTTON_STATES = {
  RECORD: 'record',
  STOP: 'stop',
  PLAY: 'play'
} as const;

interface RecorderProps {
  recordedNotes: string[];
  setRecordedNotes: (notes: string[]) => void;
  playing: boolean;
  setPlaying: (state: boolean) => void;
  recording: boolean;
  setRecording: (state: boolean) => void;
  onError?: (error: Error) => void;
}

const buttonConfigs = {
  record: {
    label: 'Record',
    className: 'recorder-btn record-btn'
  },
  stop: {
    label: 'Stop',
    className: 'recorder-btn stop-btn'
  },
  play: {
    label: 'Play',
    className: 'recorder-btn play-btn'
  }
};

const Recorder: React.FC<RecorderProps> = ({ 
  recordedNotes, 
  setRecordedNotes, 
  playing, 
  setPlaying,
  recording,
  setRecording,
  onError
}) => {
  const sequenceRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const startRecording = useCallback(() => {
    try {
      setRecordedNotes([]);
      setRecording(true);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Recording error'));
    }
  }, [setRecordedNotes, setRecording, onError]);

  const stopRecording = useCallback(() => {
    try {
      setRecording(false);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Stop error'));
    }
  }, [setRecording, onError]);

  const playRecording = useCallback(() => {
    try {
      if (recordedNotes.length === 0) return;
      setPlaying(true);
      sequenceRef.current = 0;
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Playback error'));
    }
  }, [recordedNotes.length, setPlaying, onError]);

  const cleanup = useCallback(() => {
    clearTimeout(timeoutRef.current);
    sequenceRef.current = null;
    setPlaying(false);
  }, [setPlaying]);

  useEffect(() => {
    if (!playing || sequenceRef.current === null) return;
    
    if (sequenceRef.current >= recordedNotes.length) {
      cleanup();
      return;
    }

    timeoutRef.current = setTimeout(() => {
      try {
        sequenceRef.current! += 1;
      } catch (error) {
        cleanup();
        onError?.(new Error('Playback error'));
      }
    }, PLAYBACK_DELAY);

    return () => clearTimeout(timeoutRef.current);
  }, [playing, recordedNotes, cleanup, onError]);

  const renderButton = (type: keyof typeof buttonConfigs, onClick: () => void, disabled: boolean) => {
    const config = buttonConfigs[type];
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${config.className} ${disabled ? 'disabled' : ''}`}
      >
        {config.label}
      </button>
    );
  };

  return (
    <div className="recorder">
      {renderButton('record', startRecording, recording)}
      {renderButton('stop', stopRecording, !recording)}
      {renderButton('play', playRecording, !recordedNotes.length || playing)}
      
      <div className="recorder-status">
        {recording && <span>Recording...</span>}
        {playing && <span>Playing...</span>}
      </div>
    </div>
  );
};

export default Recorder;