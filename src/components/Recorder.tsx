import React, { useEffect, useRef, useCallback } from 'react';

const BUTTON_STATES = {
  RECORD: 'record',
  STOP: 'stop',
  PLAY: 'play'
} as const;

type ButtonState = typeof BUTTON_STATES[keyof typeof BUTTON_STATES];

interface RecordedNote {
  note: string;
  timestamp: number;
}

interface RecorderProps {
  recordedNotes: RecordedNote[];
  setRecordedNotes: (notes: RecordedNote[]) => void;
  playing: boolean;
  setPlaying: (state: boolean) => void;
  recording: boolean;
  setRecording: (state: boolean) => void;
  onError?: (error: Error) => void;
}

const buttonConfigs: Record<ButtonState, { label: string; className: string }> = {
  [BUTTON_STATES.RECORD]: { label: 'Record', className: 'recorder-btn record-btn' },
  [BUTTON_STATES.STOP]: { label: 'Stop', className: 'recorder-btn stop-btn' },
  [BUTTON_STATES.PLAY]: { label: 'Play', className: 'recorder-btn play-btn' }
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
  const startTimeRef = useRef<number | null>(null);

  const startRecording = useCallback(() => {
    try {
      setRecordedNotes([]);
      setRecording(true);
      startTimeRef.current = Date.now();
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Recording error'));
    }
  }, [setRecordedNotes, setRecording, onError]);

  const stopRecording = useCallback(() => {
    try {
      setRecording(false);
      startTimeRef.current = null;
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
    const { timestamp } = recordedNotes[sequenceRef.current];
    const delay = sequenceRef.current === 0 ? 0 : timestamp - recordedNotes[sequenceRef.current - 1].timestamp;
    timeoutRef.current = setTimeout(() => {
      try {
        sequenceRef.current! += 1;
      } catch (error) {
        cleanup();
        onError?.(new Error('Playback error'));
      }
    }, delay);
    return () => clearTimeout(timeoutRef.current);
  }, [playing, recordedNotes, cleanup, onError]);

  const renderButton = (type: ButtonState, onClick: () => void, disabled: boolean) => {
    const config = buttonConfigs[type];
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${config.className} ${disabled ? 'disabled' : ''}`}
        aria-label={config.label}
        aria-pressed={type === BUTTON_STATES.RECORD && recording}
      >
        {config.label}
      </button>
    );
  };

  return (
    <div className="recorder" role="region" aria-label="Recorder controls">
      {renderButton(BUTTON_STATES.RECORD, startRecording, recording)}
      {renderButton(BUTTON_STATES.STOP, stopRecording, !recording)}
      {renderButton(BUTTON_STATES.PLAY, playRecording, !recordedNotes.length || playing)}
      <div className="recorder-status" aria-live="polite">
        {recording && <span>Recording...</span>}
        {playing && <span>Playing...</span>}
      </div>
    </div>
  );
};

export default Recorder;
