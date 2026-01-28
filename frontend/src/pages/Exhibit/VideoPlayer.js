import React, { useEffect, useRef, useState, useCallback } from "react";
import { useArtwork } from "../../hooks/useSanityData";
import { useTranscriptPreferences } from "../../hooks/useTranscriptPreferences";
import TranscriptControls from "./TranscriptControls";

// Font size class mapping for transcript entries
const fontSizeClasses = {
  small: "text-xs",
  medium: "text-sm",
  large: "text-base",
};

function VideoPlayer({ id }) {
  const [artVideos, setArtVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(0);
  const [visibleTranscript, setVisibleTranscript] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [userScrolled, setUserScrolled] = useState(false);
  const iframeRef = useRef(null);
  const transcriptRef = useRef(null);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const entryRefs = useRef([]);
  const scrollTimeoutRef = useRef(null);

  // User preferences for transcript display
  const { prefs, updatePref } = useTranscriptPreferences();

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
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
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

  // Handle manual scroll - temporarily disable auto-scroll
  const handleTranscriptScroll = () => {
    setUserScrolled(true);
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    // Re-enable auto-scroll after 5 seconds of inactivity
    scrollTimeoutRef.current = setTimeout(() => {
      setUserScrolled(false);
    }, 5000);
  };

  const handleTranscriptKeyDown = (e) => {
    const transcript = artVideos[selectedVideo]?.transcript || [];
    if (transcript.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = Math.min(prev + 1, transcript.length - 1);
          entryRefs.current[next]?.focus();
          return next;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = Math.max(prev - 1, 0);
          entryRefs.current[next]?.focus();
          return next;
        });
        break;
      case "Home":
        e.preventDefault();
        setFocusedIndex(0);
        entryRefs.current[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        setFocusedIndex(transcript.length - 1);
        entryRefs.current[transcript.length - 1]?.focus();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (transcript[focusedIndex]) {
          handleTranscriptClick(transcript[focusedIndex].start);
        }
        break;
      default:
        break;
    }
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

  // Filter transcript entries by search query
  const getFilteredTranscript = useCallback(() => {
    const transcript = artVideos[selectedVideo]?.transcript || [];
    if (!searchQuery.trim()) {
      return transcript.map((entry, index) => ({ ...entry, originalIndex: index }));
    }
    const query = searchQuery.toLowerCase();
    return transcript
      .map((entry, index) => ({ ...entry, originalIndex: index }))
      .filter((entry) => entry.text.toLowerCase().includes(query));
  }, [artVideos, selectedVideo, searchQuery]);

  // Highlight matching search text in transcript entries
  const highlightSearchText = (text) => {
    if (!searchQuery.trim()) return text;
    const query = searchQuery.toLowerCase();
    const index = text.toLowerCase().indexOf(query);
    if (index === -1) return text;

    const before = text.slice(0, index);
    const match = text.slice(index, index + searchQuery.length);
    const after = text.slice(index + searchQuery.length);

    return (
      <>
        {before}
        <mark className="bg-yellow-300 text-black rounded px-0.5">{match}</mark>
        {after}
      </>
    );
  };

  // Auto-scroll to active transcript entry (respects user preferences and manual scroll)
  useEffect(() => {
    // Only auto-scroll if enabled in prefs and user hasn't manually scrolled recently
    if (visibleTranscript && transcriptRef.current && prefs.autoScroll && !userScrolled) {
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
  }, [currentTime, visibleTranscript, getActiveTranscriptIndex, prefs.autoScroll, userScrolled]);

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

        {/* Desktop: Transcript Panel */}
        {visibleTranscript && (
          <div className="hidden lg:block lg:min-w-[200px] lg:max-w-[350px] lg:w-1/4">
            <div
              className={`rounded-lg p-4 h-full max-h-[400px] lg:max-h-[calc(56.25vw*0.75)] overflow-hidden flex flex-col ${
                prefs.highContrast
                  ? "bg-black"
                  : "bg-[var(--background-color)]"
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h3
                  className={`font-semibold ${
                    prefs.highContrast ? "text-white" : "text-[var(--text-color)]"
                  }`}
                >
                  Transcript
                </h3>
                <button
                  className={`transition-colors ${
                    prefs.highContrast
                      ? "text-white/70 hover:text-white"
                      : "text-[var(--text-color)]/70 hover:text-[var(--text-color)]"
                  }`}
                  onClick={handleToggleTranscript}
                  aria-label="Hide transcript"
                >
                  ×
                </button>
              </div>

              {/* Transcript Controls */}
              <div className="mb-3">
                <TranscriptControls
                  prefs={prefs}
                  updatePref={updatePref}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </div>

              <div
                ref={transcriptRef}
                role="list"
                aria-label="Video transcript"
                onKeyDown={handleTranscriptKeyDown}
                onScroll={handleTranscriptScroll}
                className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-[var(--accent-color)] scrollbar-track-transparent"
              >
                {getFilteredTranscript().map((entry) => {
                  const isActive =
                    prefs.highlightActive &&
                    entry.originalIndex === getActiveTranscriptIndex();
                  return (
                    <button
                      key={entry.originalIndex}
                      ref={(el) => (entryRefs.current[entry.originalIndex] = el)}
                      role="listitem"
                      aria-label={`${ConvertToMins(entry.start)}: ${entry.text}`}
                      className={`transcript-entry w-full text-left p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        prefs.highContrast
                          ? isActive
                            ? "bg-yellow-400 text-black focus:ring-yellow-400"
                            : "bg-gray-800 text-white hover:bg-gray-700 focus:ring-white"
                          : isActive
                            ? "bg-[var(--foreground-color)]/40 text-[var(--text-color)] focus:ring-[var(--foreground-color)]"
                            : "bg-[var(--accent-color)]/20 text-[var(--text-color)]/80 hover:bg-[var(--accent-color)]/30 focus:ring-[var(--foreground-color)]"
                      }`}
                      onClick={() => handleTranscriptClick(entry.start)}
                      onFocus={() => setFocusedIndex(entry.originalIndex)}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <span
                        className={`text-xs font-mono mr-2 ${
                          prefs.highContrast
                            ? isActive
                              ? "text-black"
                              : "text-yellow-400"
                            : "text-[var(--foreground-color)]"
                        }`}
                      >
                        <span className="sr-only">Timestamp: </span>
                        {ConvertToMins(entry.start)}
                      </span>
                      <span className={`${fontSizeClasses[prefs.fontSize]} leading-relaxed`}>
                        {highlightSearchText(entry.text)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile: Bottom drawer */}
      <div className={`
        lg:hidden fixed bottom-0 left-0 right-0 z-50
        bg-[var(--background-color)] rounded-t-2xl
        transition-transform duration-300 ease-out
        ${visibleTranscript ? 'translate-y-0' : 'translate-y-full'}
        max-h-[60vh] overflow-hidden
        shadow-[0_-4px_20px_rgba(0,0,0,0.3)]
      `}>
        {/* Drag handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1.5 bg-[var(--text-color)]/30 rounded-full" />
        </div>
        {/* Header */}
        <div className="flex justify-between items-center px-4 pb-3">
          <h3 className="text-[var(--text-color)] font-semibold">
            Transcript
          </h3>
          <button
            className="text-[var(--text-color)]/70 hover:text-[var(--text-color)] transition-colors p-1"
            onClick={handleToggleTranscript}
            aria-label="Hide transcript"
          >
            ×
          </button>
        </div>
        {/* Transcript content */}
        <div className="overflow-y-auto px-4 pb-6 space-y-2 max-h-[calc(60vh-80px)]">
          {artVideos[selectedVideo]?.transcript &&
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
