import React, { useEffect, useRef, useState, useCallback } from "react";
import { useArtwork } from "../../hooks/useSanityData";

function VideoPlayer({ id }) {
  const [artVideos, setArtVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(0);
  const [visibleTranscript, setVisibleTranscript] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const iframeRef = useRef(null);
  const transcriptRef = useRef(null);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  // Fetch artwork from Sanity
  const { artwork: foundArtPiece, loading } = useArtwork(parseInt(id, 10));

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      if (iframeRef.current) {
        playerRef.current = new window.YT.Player(iframeRef.current, {
          events: {
            onStateChange: onPlayerStateChange,
            onReady: onPlayerReady,
          },
        });
      }
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      delete window.onYouTubeIframeAPIReady;
    };
  }, [selectedVideo]);

  const onPlayerReady = () => {
    intervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 500);
  };

  const onPlayerStateChange = () => {};

  // Safe JSON parse wrapper for transcript data
  const safeParseTranscript = (transcriptString) => {
    try {
      return JSON.parse(transcriptString);
    } catch (e) {
      console.error("Failed to parse transcript:", e);
      return [];
    }
  };

  useEffect(() => {
    if (loading) return;

    if (foundArtPiece && foundArtPiece.videoLink && foundArtPiece.transcript) {
      const combinedVideos = foundArtPiece.videoLink.map((video, index) => ({
        videoLink: video,
        transcript: safeParseTranscript(foundArtPiece.transcript[index]),
      }));
      setArtVideos(combinedVideos);
    }
  }, [foundArtPiece, loading]);

  const handleVideoSelection = (index) => {
    setSelectedVideo(index);
  };

  const handleTranscriptClick = (start) => {
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(start, true);
    }
  };

  const handleToggleTranscript = () => {
    setVisibleTranscript(!visibleTranscript);
  };

  const ConvertToMins = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${Math.floor(seconds)}`;
  };

  const getActiveTranscriptIndex = useCallback(() => {
    const transcript = artVideos[selectedVideo]?.transcript || [];
    for (let i = 0; i < transcript.length; i++) {
      if (
        currentTime >= transcript[i].start &&
        (i === transcript.length - 1 || currentTime < transcript[i + 1].start)
      ) {
        return i;
      }
    }
    return -1;
  }, [artVideos, selectedVideo, currentTime]);

  useEffect(() => {
    if (visibleTranscript && transcriptRef.current) {
      const activeIndex = getActiveTranscriptIndex();
      const transcriptElements =
        transcriptRef.current.querySelectorAll(".transcript-entry");
      if (activeIndex !== -1 && transcriptElements[activeIndex]) {
        transcriptElements[activeIndex].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [currentTime, visibleTranscript, getActiveTranscriptIndex]);

  if (artVideos.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Video Player */}
        <div className={`${visibleTranscript ? "lg:w-3/4" : "w-full"}`}>
          <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden bg-black">
            <iframe
              ref={iframeRef}
              key={selectedVideo}
              src={`${artVideos[selectedVideo].videoLink}?enablejsapi=1&modestbranding=1&rel=0`}
              allowFullScreen
              title={`Video ${selectedVideo + 1}`}
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
        </div>

        {/* Transcript Panel */}
        {visibleTranscript && (
          <div className="lg:w-1/4">
            <div className="bg-[var(--background-color)] rounded-lg p-4 h-full max-h-[400px] lg:max-h-[calc(56.25vw*0.75)] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[var(--text-color)] font-semibold">
                  Transcript
                </h3>
                <button
                  className="text-[var(--text-color)]/70 hover:text-[var(--text-color)] transition-colors"
                  onClick={handleToggleTranscript}
                  aria-label="Hide transcript"
                >
                  ×
                </button>
              </div>
              <div
                ref={transcriptRef}
                className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-[var(--accent-color)] scrollbar-track-transparent"
              >
                {artVideos[selectedVideo].transcript &&
                  artVideos[selectedVideo].transcript.map((entry, index) => {
                    const isActive = index === getActiveTranscriptIndex();
                    return (
                      <button
                        key={index}
                        className={`transcript-entry w-full text-left p-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-[var(--foreground-color)]/40 text-[var(--text-color)]"
                            : "bg-[var(--accent-color)]/20 text-[var(--text-color)]/80 hover:bg-[var(--accent-color)]/30"
                        }`}
                        onClick={() => handleTranscriptClick(entry.start)}
                        aria-current={isActive ? "true" : undefined}
                      >
                        <span className="text-xs font-mono text-[var(--foreground-color)] mr-2">
                          <span className="sr-only">Timestamp: </span>
                          {ConvertToMins(entry.start)}
                        </span>
                        <span className="text-sm">{entry.text}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center items-center gap-3 mt-4">
        {/* Transcript Toggle */}
        <button
          className="px-4 py-2 rounded-lg font-medium transition-all duration-200
                     bg-[var(--button-color)] hover:bg-[var(--accent-color)]
                     text-[var(--button-text-color)]
                     flex items-center gap-2"
          onClick={handleToggleTranscript}
          aria-pressed={visibleTranscript}
          aria-label={visibleTranscript ? "Hide video transcript" : "Show video transcript"}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {visibleTranscript ? "Hide Transcript" : "Show Transcript"}
        </button>

        {/* Video Selector */}
        {artVideos.length > 1 && (
          <div className="flex gap-2">
            {artVideos.map((_, index) => (
              <button
                key={index}
                onClick={() => handleVideoSelection(index)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  index === selectedVideo
                    ? "bg-[var(--button-color)] text-[var(--button-text-color)]"
                    : "bg-[var(--accent-color)]/30 text-[var(--text-color)] hover:bg-[var(--accent-color)]/50"
                }`}
              >
                Video {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;
