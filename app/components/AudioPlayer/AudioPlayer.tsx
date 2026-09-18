"use client";

import { ChangeEvent, CSSProperties, useId } from "react";
import { useAudioPlayer } from "@/app/context/audioPlayerContext";
import "./AudioPlayer.css";

const SOURCE_LABEL: Record<string, string> = {
  audiobook: "Audiobook",
  webradio: "Radio",
  other: "Audio",
};

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Lecteur global unique — utilisé pour audiobooks, webradio, etc.
 * Visible uniquement lorsqu'une piste est chargée.
 */
const AudioPlayer = () => {
  const progressId = useId();
  const {
    current,
    isPlaying,
    currentTime,
    duration,
    pause,
    resume,
    stop,
    seek,
  } = useAudioPlayer();

  if (!current) {
    return <></>;
  }

  console.log("current", current);

  const canSeek = duration > 0;
  const progressValue = canSeek ? Math.min(currentTime, duration) : 0;
  const progressPercent = canSeek ? (progressValue / duration) * 100 : 0;

  const onSeek = (event: ChangeEvent<HTMLInputElement>) => {
    seek(Number(event.target.value));
  };

  return (
    <div className="audio-player__main">
      <div className="audio-player__row">
        <div className="audio-player__info">
          <span className="audio-player__kind">
            {SOURCE_LABEL[current.kind] ?? SOURCE_LABEL.other}
          </span>
          <p className="audio-player__title" title={current.title}>
            {current.title}
            <span className="audio-player__author">{current.author}</span>
          </p>
        </div>

        <div className="audio-player__controls">
          <button
            type="button"
            className="audio-player__btn"
            aria-label={isPlaying ? "Pause" : "Lecture"}
            onClick={() => (isPlaying ? pause() : resume())}
          >
            {isPlaying ? (
              <span aria-hidden className="audio-player__icon-pause" />
            ) : (
              <span aria-hidden className="audio-player__icon-play" />
            )}
          </button>
          <button
            type="button"
            className="audio-player__btn"
            aria-label="Stop"
            onClick={stop}
          >
            <span aria-hidden className="audio-player__icon-stop" />
          </button>
        </div>
      </div>

      <div className="audio-player__progress">
        <label htmlFor={progressId} className="sr-only">
          Progression
        </label>
        <input
          id={progressId}
          type="range"
          className="audio-player__slider"
          min={0}
          max={canSeek ? duration : 1}
          step={0.1}
          value={progressValue}
          disabled={!canSeek}
          aria-valuetext={
            canSeek
              ? `${formatTime(progressValue)} sur ${formatTime(duration)}`
              : "Durée indisponible"
          }
          style={
            {
              "--progress": `${progressPercent}%`,
            } as CSSProperties
          }
          onChange={onSeek}
        />
        <div className="audio-player__times" aria-hidden={!canSeek}>
          <span>{formatTime(progressValue)}</span>
          <span>{canSeek ? formatTime(duration) : "—"}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
