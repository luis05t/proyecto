<<<<<<< Updated upstream
import React, { useEffect, useRef, useCallback } from 'react';

const BUTTON_STATES = {
  RECORD: 'record',
  STOP: 'stop',
  PLAY: 'play'
} as const;

type ButtonState = typeof BUTTON_STATES[keyof typeof BUTTON_STATES];

interface RecordedNote {
  note: string;
=======
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Square, Mic, Trash2, Loader } from 'lucide-react';

interface Note {
  key: string;
>>>>>>> Stashed changes
  timestamp: number;
}

interface RecorderProps {
<<<<<<< Updated upstream
  recordedNotes: RecordedNote[];
  setRecordedNotes: (notes: RecordedNote[]) => void;
=======
  recordedNotes: Note[];
  setRecordedNotes: (notes: Note[]) => void;
>>>>>>> Stashed changes
  playing: boolean;
  setPlaying: (state: boolean) => void;
  recording: boolean;
  setRecording: (state: boolean) => void;
  onError?: (error: Error) => void;
}

<<<<<<< Updated upstream
const buttonConfigs: Record<ButtonState, { label: string; className: string }> = {
  [BUTTON_STATES.RECORD]: { label: 'Record', className: 'recorder-btn record-btn' },
  [BUTTON_STATES.STOP]: { label: 'Stop', className: 'recorder-btn stop-btn' },
  [BUTTON_STATES.PLAY]: { label: 'Play', className: 'recorder-btn play-btn' }
};

=======
>>>>>>> Stashed changes
const Recorder: React.FC<RecorderProps> = ({
  recordedNotes,
  setRecordedNotes,
  playing,
  setPlaying,
  recording,
  setRecording,
<<<<<<< Updated upstream
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
=======
}) => {
  const sequenceRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [tempo, setTempo] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const calculateTiming = useCallback((timestamp: number): number => {
    if (!startTimeRef.current) return 0;
    return timestamp - startTimeRef.current;
  }, []);

  const startRecording = useCallback(() => {
    setRecordedNotes([]);
    setRecording(true);
    startTimeRef.current = Date.now();
  }, [setRecordedNotes, setRecording]);

  const stopRecording = useCallback(() => {
    setRecording(false);
    startTimeRef.current = null;
  }, [setRecording]);

  const clearRecording = useCallback(() => {
    setRecordedNotes([]);
    setPlaying(false);
    sequenceRef.current = null;
  }, [setRecordedNotes, setPlaying]);

  const playRecording = useCallback(() => {
    if (recordedNotes.length === 0) return;

    setIsLoading(true);
    setPlaying(true);
    sequenceRef.current = 0;

    // Simular carga de audio
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [recordedNotes.length, setPlaying]);

  useEffect(() => {
    if (!playing || isLoading) return;

    if (sequenceRef.current !== null && sequenceRef.current < recordedNotes.length) {
      const currentNote = recordedNotes[sequenceRef.current];
      const nextNote = recordedNotes[sequenceRef.current + 1];
      
      const delay = nextNote 
        ? (nextNote.timestamp - currentNote.timestamp) / tempo
        : 500 / tempo;

      const timeoutId = setTimeout(() => {
        sequenceRef.current! += 1;
      }, delay);

      return () => clearTimeout(timeoutId);
    } else if (sequenceRef.current === recordedNotes.length) {
      setPlaying(false);
      sequenceRef.current = null;
    }
  }, [playing, recordedNotes, setPlaying, tempo, isLoading]);

  const getRecordingDuration = useCallback((): string => {
    if (recordedNotes.length === 0) return '0:00';
    const lastNote = recordedNotes[recordedNotes.length - 1];
    const duration = Math.floor(lastNote.timestamp / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [recordedNotes]);

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-800 rounded-lg shadow-xl">
      <div className="flex items-center gap-4">
        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={playing || isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
            ${recording 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {recording ? (
            <>
              <Square className="w-4 h-4" /> Stop
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" /> Record
            </>
          )}
        </button>

        <button
          onClick={playRecording}
          disabled={recordedNotes.length === 0 || playing || recording || isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 
            text-white rounded-lg font-medium transition-all
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          Play
        </button>

        <button
          onClick={clearRecording}
          disabled={recordedNotes.length === 0 || recording || playing || isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 
            text-white rounded-lg font-medium transition-all
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-300">
          Duration: {getRecordingDuration()}
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">Tempo:</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={tempo}
            onChange={(e) => setTempo(parseFloat(e.target.value))}
            className="w-32"
            disabled={playing || recording || isLoading}
          />
          <span className="text-sm text-gray-300">{tempo}x</span>
        </div>
      </div>

      {recordedNotes.length > 0 && (
        <div className="text-sm text-gray-400">
          Notes recorded: {recordedNotes.length}
        </div>
      )}
>>>>>>> Stashed changes
    </div>
  );
};

export default Recorder;
