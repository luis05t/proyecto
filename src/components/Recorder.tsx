import React, { useEffect, useRef, useCallback } from 'react';

// Constants
const PLAYBACK_DELAY = 500;
const BUTTON_STATES = {
  RECORD: 'record',
  STOP: 'stop',
  PLAY: 'play',
} as const;

// Types
interface RecorderProps {
  recordedNotes: string[];
  setRecordedNotes: (notes: string[]) => void;
  playing: boolean;
  setPlaying: (state: boolean) => void;
  recording: boolean;
  setRecording: (state: boolean) => void;
  onError?: (error: Error) => void;
}

interface ButtonConfig {
  label: string;
  ariaLabel: string;
  className: string;
}

// Button configurations
const buttonConfigs: Record<typeof BUTTON_STATES[keyof typeof BUTTON_STATES], ButtonConfig> = {
  [BUTTON_STATES.RECORD]: {
    label: 'Record',
    ariaLabel: 'Start recording notes',
    className: 'recorder-btn record-btn'
  },
  [BUTTON_STATES.STOP]: {
    label: 'Stop',
    ariaLabel: 'Stop recording or playing',
    className: 'recorder-btn stop-btn'
  },
  [BUTTON_STATES.PLAY]: {
    label: 'Play',
    ariaLabel: 'Play recorded notes',
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

  // Memoized handlers
  const startRecording = useCallback(() => {
    try {
      setRecordedNotes([]);
      setRecording(true);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Failed to start recording'));
    }
  }, [setRecordedNotes, setRecording, onError]);

  const stopRecording = useCallback(() => {
    try {
      setRecording(false);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Failed to stop recording'));
    }
  }, [setRecording, onError]);

  const playRecording = useCallback(() => {
    try {
      if (recordedNotes.length === 0) {
        throw new Error('No notes to play');
      }
      setPlaying(true);
      sequenceRef.current = 0;
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Failed to play recording'));
    }
  }, [recordedNotes.length, setPlaying, onError]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    sequenceRef.current = null;
    setPlaying(false);
  }, [setPlaying]);

  useEffect(() => {
    if (!playing || sequenceRef.current === null) {
      return;
    }

    if (sequenceRef.current >= recordedNotes.length) {
      cleanup();
      return;
    }

    timeoutRef.current = setTimeout(() => {
      try {
        sequenceRef.current! += 1;
      } catch (error) {
        cleanup();
        onError?.(error instanceof Error ? error : new Error('Playback error'));
      }
    }, PLAYBACK_DELAY);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [playing, recordedNotes, cleanup, onError]);

  const renderButton = (
    type: typeof BUTTON_STATES[keyof typeof BUTTON_STATES],
    onClick: () => void,
    disabled: boolean
  ) => {
    const config = buttonConfigs[type];
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${config.className} ${disabled ? 'disabled' : ''}`}
        aria-label={config.ariaLabel}
        title={config.label}
      >
        {config.label}
      </button>
    );
  };

  return (
    <div 
      className="recorder"
      role="region"
      aria-label="Note recorder controls"
    >
      {renderButton(
        BUTTON_STATES.RECORD,
        startRecording,
        recording
      )}
      {renderButton(
        BUTTON_STATES.STOP,
        stopRecording,
        !recording
      )}
      {renderButton(
        BUTTON_STATES.PLAY,
        playRecording,
        recordedNotes.length === 0 || playing
      )}
      
      {/* Status indicators */}
      <div className="recorder-status" aria-live="polite">
        {recording && <span className="status-recording">Recording...</span>}
        {playing && <span className="status-playing">Playing...</span>}
      </div>
    </div>
  );
};

export default Recorder;