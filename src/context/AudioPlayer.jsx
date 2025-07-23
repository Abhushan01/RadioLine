import { createContext, useContext, useRef, useState, useEffect } from 'react';
import Hls from 'hls.js';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [currentStation, setCurrentStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);
  const hlsRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  const lastActionRef = useRef(''); // 'play' or 'pause'

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    audioRef.current = audio;

    const onPause = () => {
      // Avoid resume if user explicitly paused
      if (audio.ended || audio.error) return;

      console.warn('Audio paused. Last action:', lastActionRef.current);
      if (lastActionRef.current !== 'pause') {
        // Attempt auto-resume
        console.log('Attempting auto-resume...');
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(err => {
            console.error('Auto-resume failed:', err);
          });
      } else {
        console.log('User-initiated pause; skipping auto-resume');
      }
    };

    const onError = () => {
      console.error('[Audio] error state:', audio.error);
      setIsPlaying(false);
      setLoading(false);
    };

    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audio.pause();
      clearTimeout(retryTimeoutRef.current);
    };
  }, []);

  const isM3U8 = url => /\.m3u8($|\?)/i.test(url);

  const playStation = station => {
    if (!station?.url_resolved) return;

    setCurrentStation(station);
    setLoading(true);
    lastActionRef.current = 'play';

    const audio = audioRef.current;
    clearTimeout(retryTimeoutRef.current);

    // Clean up HLS
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    audio.pause();
    audio.removeAttribute('src'); // force reload

    if (isM3U8(station.url_resolved) && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(station.url_resolved);
      hls.attachMedia(audio);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setLoading(false);
          })
          .catch(err => {
            console.error('HLS playback error:', err);
            setIsPlaying(false);
            setLoading(false);
          });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('[HLS] Error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.warn('Recovering from HLS network error');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn('Recovering from HLS media error');
              hls.recoverMediaError();
              break;
            default:
              console.warn('HLS fatal error; destroying instance');
              hls.destroy();
              break;
          }
        }
      });

      hlsRef.current = hls;
    } else {
      audio.src = station.url_resolved;
      audio.title = station.name;

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setLoading(false);
        })
        .catch(err => {
          console.error('Audio playback error:', err);
          setIsPlaying(false);
          setLoading(false);
        });
    }

    // Fallback retry if stuck
    retryTimeoutRef.current = setTimeout(() => {
      if (audio.paused || audio.readyState < 3) {
        console.warn('Stream appears stuck; retrying...');
        playStation(station);
      }
    }, 90 * 1000); // 90 seconds
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;

    if (audio.paused) {
      lastActionRef.current = 'play';
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error('Error resuming audio:', err);
        });
    } else {
      lastActionRef.current = 'pause';
      audio.pause();
      setIsPlaying(false);
    }
  };

  const setVolume = value => {
    const audio = audioRef.current;
    audio.volume = value;
  };

  return (
    <AudioContext.Provider
      value={{
        currentStation,
        playStation,
        togglePlayPause,
        isPlaying,
        loading,
        setVolume,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
