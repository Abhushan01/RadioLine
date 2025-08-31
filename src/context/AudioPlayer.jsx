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
  const lastActionRef = useRef('');

  const audioContextRef = useRef(null); // [NEW]
  const analyserRef = useRef(null); // [NEW]
  const dataArrayRef = useRef(null); // [NEW]
  const sourceNodeRef = useRef(null); // <-- New

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    audioRef.current = audio;

    const onPause = () => {
      console.log('Audio paused. lastAction:', lastActionRef.current);
    };

    const onError = () => {
      console.error('[Audio] error state:', audio.error);
      setIsPlaying(false);
      setLoading(false);
    };

    const onWaiting = () => {
      console.log('Audio waiting (buffering)...');
      if (lastActionRef.current === 'play') {
        audio.play().catch(err => {
          console.error('Auto-resume during buffering failed:', err);
        });
      }
    };

    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);
    audio.addEventListener('waiting', onWaiting);

    return () => {
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('waiting', onWaiting);
      audio.pause();
      clearTimeout(retryTimeoutRef.current);
    };
  }, []);

  const isM3U8 = url => /\.m3u8($|\?)/i.test(url);

  const updateRecentlyPlayed = station => {
    try {
      const stored = JSON.parse(localStorage.getItem('recentlyPlayed')) || [];
      const filtered = stored.filter(s => s.stationuuid !== station.stationuuid);
      filtered.unshift(station);
      const recent = filtered.slice(0, 10);
      localStorage.setItem('recentlyPlayed', JSON.stringify(recent));
      window.dispatchEvent(new Event('recentlyPlayedUpdated'));
    } catch (e) {
      console.error('Failed to update recently played', e);
    }
  };

  const setupAnalyser = () => {
    if (!audioRef.current) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (!sourceNodeRef.current) {
      // ✅ Only create once
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
    }

    if (!analyserRef.current) {
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;

      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      // ✅ Connect only once
      sourceNodeRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  };

  const playStation = station => {
    if (!station?.url_resolved) return;

    setCurrentStation(station);
    setLoading(true);
    lastActionRef.current = 'play';

    updateRecentlyPlayed(station);

    const audio = audioRef.current;
    clearTimeout(retryTimeoutRef.current);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    audio.pause();
    audio.removeAttribute('src');

    if (isM3U8(station.url_resolved) && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(station.url_resolved);
      hls.attachMedia(audio);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        audio
          .play()
          .then(() => {
            setupAnalyser(); // [NEW]
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
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
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
          setupAnalyser(); // [NEW]
          setIsPlaying(true);
          setLoading(false);
        })
        .catch(err => {
          console.error('Audio playback error:', err);
          setIsPlaying(false);
          setLoading(false);
        });
    }

    retryTimeoutRef.current = setTimeout(() => {
      if (audio.paused || audio.readyState < 3) {
        playStation(station);
      }
    }, 90 * 1000);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;

    if (audio.paused) {
      lastActionRef.current = 'play';
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
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

  const muteVolume = value => {
    const audio = audioRef.current;
    audio.muted = value;
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
        muteVolume,
        analyserRef,
        dataArrayRef,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
