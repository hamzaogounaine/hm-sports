"use client"
import { useParams } from 'next/navigation';
import { useEffect, useRef } from "react";
import React from 'react'
import Hls from "hls.js";

const Page = () => {
  const  {id} =useParams();

  return (
    <div>
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

    // 1. Native HLS support (Safari / iOS)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } 
    // 2. Standard Browsers (Chrome, Firefox, Edge) using Hls.js
    else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);

      return () => {
        hls.destroy(); // Cleanup on unmount to prevent memory leaks
      };
    }
  }, [src]);

  return (
    <video 
      ref={videoRef} 
      controls 
      autoPlay
      className="w-full aspect-video rounded-lg bg-black"
    />
  );
}