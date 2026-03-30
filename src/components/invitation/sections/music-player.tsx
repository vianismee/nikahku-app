"use client";

import { useRef, useEffect } from "react";

export default function MusicPlayer({
  src,
  playing,
  onToggle,
}: {
  src: string;
  playing: boolean;
  onToggle: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !src) return;

    if (playing) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [playing, src]);

  if (!src) return null;

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        className={`h-music-btn ${playing ? "h-music-btn--playing" : ""}`}
        onClick={onToggle}
        aria-label={playing ? "Pause music" : "Play music"}
        type="button"
      >
        <i className={`fas ${playing ? "fa-music" : "fa-play"}`} />
      </button>
    </>
  );
}
