"use client";

import React, {
  createContext,
  forwardRef,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/** Types de sources audio de l'application — une seule peut jouer à la fois. */
export type AudioSourceKind = "audiobook" | "webradio" | "other";

export type AudioTrack = {
  id: string;
  title: string;
  url: string;
  kind: AudioSourceKind;
};

export type AudioPlayerContextValue = {
  current: AudioTrack | null;
  isPlaying: boolean;
  /** Position courante en secondes */
  currentTime: number;
  /** Durée totale en secondes (0 si inconnue, ex. flux live) */
  duration: number;
  play: (track: AudioTrack) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seek: (time: number) => void;
};

const AudioPlayerContextInstance = createContext<AudioPlayerContextValue>({
  current: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  play: () => {},
  pause: () => {},
  resume: () => {},
  stop: () => {},
  seek: () => {},
});

function normalizeDuration(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

export const AudioPlayerContextProvider = ({ children }: PropsWithChildren) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentRef = useRef<AudioTrack | null>(null);
  const [current, setCurrent] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const setCurrentTrack = useCallback((track: AudioTrack | null) => {
    currentRef.current = track;
    setCurrent(track);
  }, []);

  const resetProgress = useCallback(() => {
    setCurrentTime(0);
    setDuration(0);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () =>
      setDuration(normalizeDuration(audio.duration));
    const onDurationChange = () =>
      setDuration(normalizeDuration(audio.duration));
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTrack(null);
      resetProgress();
      audio.removeAttribute("src");
      audio.load();
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
    };
  }, [setCurrentTrack, resetProgress]);

  const play = useCallback(
    (track: AudioTrack) => {
      const audio = audioRef.current;
      if (!audio) return;

      const previous = currentRef.current;
      const isSameTrack =
        previous?.id === track.id && previous?.kind === track.kind;

      if (isSameTrack) {
        if (audio.paused) {
          void audio.play().catch(() => setIsPlaying(false));
        }
        return;
      }

      audio.pause();
      audio.src = track.url;
      resetProgress();
      setCurrentTrack(track);
      void audio.play().catch(() => setIsPlaying(false));
    },
    [setCurrentTrack, resetProgress],
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentRef.current) return;
    void audio.play().catch(() => setIsPlaying(false));
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    setIsPlaying(false);
    setCurrentTrack(null);
    resetProgress();
  }, [setCurrentTrack, resetProgress]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio || !currentRef.current) return;

    const max = normalizeDuration(audio.duration);
    if (max <= 0) return;

    const next = Math.min(Math.max(0, time), max);
    audio.currentTime = next;
    setCurrentTime(next);
  }, []);

  return (
    <AudioPlayerContextInstance.Provider
      value={{
        current,
        isPlaying,
        currentTime,
        duration,
        play,
        pause,
        resume,
        stop,
        seek,
      }}
    >
      {children}
      <AudioNativePlayer ref={audioRef} />
    </AudioPlayerContextInstance.Provider>
  );
};

const AudioNativePlayer = React.memo(forwardRef<HTMLAudioElement, object>((_, ref) => {
  return <audio ref={ref} preload="none" className="sr-only" aria-hidden />;
}));
AudioNativePlayer.displayName = "AudioNativePlayer";

export const useAudioPlayer = (): AudioPlayerContextValue =>
  useContext(AudioPlayerContextInstance);
