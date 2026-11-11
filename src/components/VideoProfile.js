"use client";
import { useState } from "react";

// Isi salah satu:
// - YOUTUBE_ID: ID video YouTube (contoh "dQw4w9WgXcQ"), atau
// - taruh file di public/videos/mentify-profile.mp4
const YOUTUBE_ID = "";
const VIDEO_SRC = "/videos/mentify-profile.mp4";

export default function VideoProfile() {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="video-wrap">
      {!playing ? (
        <button className="video-poster" onClick={() => setPlaying(true)} aria-label="Putar video profil Mentify">
          <span className="video-play">▶</span>
          <span className="video-caption">Kenali Mentify dalam 2 menit</span>
        </button>
      ) : YOUTUBE_ID ? (
        <iframe
          src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1`}
          title="Video profil Mentify"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : error ? (
        <div className="video-poster">
          <span className="video-caption">Video belum tersedia. Taruh file di public/videos/mentify-profile.mp4</span>
        </div>
      ) : (
        <video src={VIDEO_SRC} controls autoPlay playsInline onError={() => setError(true)} />
      )}
    </div>
  );
}