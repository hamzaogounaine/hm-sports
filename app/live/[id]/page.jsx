"use client"

import { useParams } from 'next/navigation';
import { useEffect, useRef } from "react";
import React from 'react'
import Hls from "hls.js";

const Page = () => {
  const { id } = useParams();

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <M3U8Player src={`${process.env.NEXT_PUBLIC_STREAM_URL}/${id}/live.m3u8`} />
    </div>
  )
}

export default Page

function M3U8Player({ src }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls;

    // 1. Standard Browsers using Hls.js
    if (Hls.isSupported()) {
      // CRITICAL: You must pass these options to survive the RAM disk limitations
      const hlsOptions = {
        liveSyncDurationCount: 2,       // Stay glued to the live edge
        liveMaxLatencyDurationCount: 3, 
        maxBufferLength: 6,              // Do not try to buffer deleted segments
        maxMaxBufferLength: 10,
        manifestLoadingMaxRetry: 5,      // Stop DDoS-ing your own server on failure
        manifestLoadingRetryDelay: 1000,
        levelLoadingMaxRetry: 5,
        levelLoadingRetryDelay: 1000,
        fragLoadingMaxRetry: 6,
        fragLoadingRetryDelay: 1000,
        fragLoadingMaxRetryTimeout: 8000 
      };

      hls = new Hls(hlsOptions);
      hls.loadSource(src);
      hls.attachMedia(video);

      // CRITICAL: Handle the errors so the player recovers instead of freezing permanently
      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.warn("[!] Network error, attempting recovery...");
              hls.startLoad(); 
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn("[!] Media error, attempting stalling recovery...");
              hls.recoverMediaError(); 
              break;
            default:
              console.error("[X] Unrecoverable error. Destroying player.");
              hls.destroy();
              break;
          }
        }
      });
    } 
    // 2. Native HLS fallback (Safari / iOS)
    else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }

    // Cleanup function to kill the HLS instance when the user navigates away
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <video 
      ref={videoRef} 
      controls 
      autoPlay 
      muted // browsers WILL block autoPlay if the video isn't muted
      playsInline
      className="w-full aspect-video rounded-lg bg-black shadow-lg"
    />
  );
}