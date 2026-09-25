import React, { useEffect, useRef, useState } from 'react';
import {
  Music,
  Upload,
  Repeat,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  Trash2,
  Sliders,
  X,
  CheckCircle2,
} from 'lucide-react';
import {
  saveAudioToDB,
  getAudioFromDB,
  deleteAudioFromDB,
  StoredAudio,
} from '../utils/audioStorage';

const LOOP_STORAGE_KEY = 'pedro_duda_audio_loop';
const VOLUME_STORAGE_KEY = 'pedro_duda_audio_volume';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  // Loop is permanently enabled and locked as requested
  const isLoop = true;
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem(VOLUME_STORAGE_KEY);
    return saved !== null ? parseFloat(saved) : 0.6;
  });

  const [customAudio, setCustomAudio] = useState<StoredAudio | null>(null);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Audio elements & context
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<number | null>(null);
  const synthGainRef = useRef<GainNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load custom audio from IndexedDB on mount
  useEffect(() => {
    let active = true;
    getAudioFromDB().then((saved) => {
      if (active && saved) {
        setCustomAudio(saved);
        const url = URL.createObjectURL(saved.blob);
        setCustomAudioUrl(url);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  // Update HTML audio element loop and volume
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.loop = true;
      audioElementRef.current.volume = volume;
    }
    localStorage.setItem(LOOP_STORAGE_KEY, 'true');
    localStorage.setItem(VOLUME_STORAGE_KEY, String(volume));

    if (synthGainRef.current && audioCtxRef.current) {
      synthGainRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Clean up object URL
  useEffect(() => {
    return () => {
      if (customAudioUrl) {
        URL.revokeObjectURL(customAudioUrl);
      }
    };
  }, [customAudioUrl]);

  // Synthesis chords for default fallback melody (Veni Creator Spiritus reverent theme)
  const chords = [
    [261.63, 329.63, 392.0, 493.88], // C maj7
    [220.0, 261.63, 329.63, 392.0], // Am7
    [174.61, 220.0, 261.63, 329.63], // F maj7
    [196.0, 246.94, 293.66, 392.0], // G7
    [164.81, 196.0, 246.94, 329.63], // Em7
    [220.0, 293.66, 369.99, 440.0], // D9
  ];

  const playSynthChordNote = (freq: number, timeOffset: number, noteDuration: number) => {
    if (!audioCtxRef.current || !synthGainRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + timeOffset);

    const startTime = ctx.currentTime + timeOffset;
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(0.08 * volume, startTime + 0.12);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDuration);

    osc.connect(noteGain);
    noteGain.connect(synthGainRef.current);

    osc.start(startTime);
    osc.stop(startTime + noteDuration + 0.1);
  };

  const startSynthMelody = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    if (!synthGainRef.current && audioCtxRef.current) {
      const master = audioCtxRef.current.createGain();
      master.gain.value = volume;
      master.connect(audioCtxRef.current.destination);
      synthGainRef.current = master;
    }

    let chordIdx = 0;
    const playNextArpeggio = () => {
      const chord = chords[chordIdx % chords.length];
      chordIdx++;

      chord.forEach((note, i) => {
        playSynthChordNote(note, i * 0.45, 3.2);
      });
      playSynthChordNote(chord[0] * 2, 1.8, 2.8);
    };

    playNextArpeggio();
    synthTimerRef.current = window.setInterval(playNextArpeggio, 2600);
  };

  const stopSynthMelody = () => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
  };

  const playAudio = () => {
    if (customAudioUrl && audioElementRef.current) {
      stopSynthMelody();
      audioElementRef.current.loop = true;
      audioElementRef.current.volume = volume;
      audioElementRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.warn('Auto-play blocked or failed:', e);
          setIsPlaying(false);
        });
    } else {
      setIsPlaying(true);
      startSynthMelody();
    }
  };

  const stopAudio = () => {
    setIsPlaying(false);
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    stopSynthMelody();
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|aac|ogg|flac)$/i)) {
      alert('Por favor, selecione um arquivo de áudio válido (.mp3, .wav, .m4a, .ogg).');
      return;
    }

    try {
      setUploadLoading(true);
      stopAudio();

      const saved = await saveAudioToDB(file);
      setCustomAudio(saved);

      if (customAudioUrl) {
        URL.revokeObjectURL(customAudioUrl);
      }
      const newUrl = URL.createObjectURL(saved.blob);
      setCustomAudioUrl(newUrl);

      // Auto start newly uploaded track with loop
      setTimeout(() => {
        if (audioElementRef.current) {
          audioElementRef.current.currentTime = 0;
          audioElementRef.current.loop = true;
          audioElementRef.current.volume = volume;
          audioElementRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => {});
        }
      }, 200);
    } catch (err) {
      console.error('Falha ao salvar áudio:', err);
      alert('Não foi possível salvar o áudio. Tente novamente.');
    } finally {
      setUploadLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Teardown
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <>
      {/* Hidden HTML5 Audio Element for custom uploaded song */}
      {customAudioUrl && (
        <audio
          ref={audioElementRef}
          src={customAudioUrl}
          preload="auto"
          loop={isLoop}
          onTimeUpdate={() => {
            if (audioElementRef.current) {
              setCurrentTime(audioElementRef.current.currentTime);
            }
          }}
          onLoadedMetadata={() => {
            if (audioElementRef.current) {
              setDuration(audioElementRef.current.duration);
            }
          }}
          onEnded={() => {
            if (!isLoop) {
              setIsPlaying(false);
            }
          }}
        />
      )}

      {/* Main Header Audio Bar Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={togglePlay}
          className={`px-4 py-2 rounded-full font-medium transition flex items-center gap-2 text-xs sm:text-sm shadow-md border ${
            isPlaying
              ? 'bg-terracotta text-white border-red-400/50 shadow-terracotta/30 animate-pulse'
              : 'bg-wood-800/90 hover:bg-wood-700 text-amber-100 border-amber-500/30'
          }`}
          title={isPlaying ? 'Pausar música' : 'Tocar música romântica'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-white" />
          ) : (
            <Play className="w-4 h-4 fill-amber-100" />
          )}
          <span className="max-w-[140px] sm:max-w-[180px] truncate">
            {isPlaying
              ? customAudio
                ? `Tocando: ${customAudio.name}`
                : 'Música Ativa ✨'
              : customAudio
              ? customAudio.name
              : 'Música de Fundo'}
          </span>
          {isLoop && (
            <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full" title="Loop Ativo">
              🔁
            </span>
          )}
        </button>

        {/* Music Settings / Upload Modal Opener */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="p-2 rounded-full bg-wood-800/80 hover:bg-wood-700 text-amber-200 hover:text-white border border-amber-500/30 transition shadow"
          title="Configurar Música / Fazer Upload e Ativar Loop"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>

      {/* MODAL: CONFIGURAÇÃO DE MÚSICA & UPLOAD & LOOP */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none"
        >
          <div className="bg-wood-900 border-2 border-amber-600/40 rounded-2xl max-w-lg w-full p-6 sm:p-8 text-amber-50 shadow-2xl relative animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-amber-800/50 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-terracotta" />
                <h3 className="font-serif text-2xl font-bold text-amber-100">
                  Trilha Sonora do Casal
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-amber-300 hover:text-white p-1 rounded-lg hover:bg-wood-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Song Card */}
            <div className="bg-wood-950/80 rounded-xl p-4 border border-amber-700/40 mb-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-grow min-w-0">
                  <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold block mb-1">
                    {customAudio ? 'Trilha Sonora Oficial Carregada' : 'Trilha Sonora Dedicada'}
                  </span>
                  <p className="font-serif text-lg text-amber-100 font-bold truncate">
                    {customAudio ? customAudio.name : 'Veni Creator Spiritus • Trilha do Casamento'}
                  </p>
                  <p className="text-xs text-amber-300/70 mt-1">
                    🔒 Salva com segurança neste navegador, reproduzida em loop infinito e protegida contra exclusão.
                  </p>
                </div>
              </div>

              {/* Progress Scrubber for custom audio */}
              {customAudio && duration > 0 && (
                <div className="mt-4 pt-3 border-t border-amber-900/40">
                  <div className="flex justify-between text-[11px] text-amber-300/80 mb-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={duration || 1}
                    step="0.5"
                    value={currentTime}
                    onChange={(e) => {
                      const newTime = parseFloat(e.target.value);
                      setCurrentTime(newTime);
                      if (audioElementRef.current) {
                        audioElementRef.current.currentTime = newTime;
                      }
                    }}
                    className="w-full h-2 bg-wood-800 rounded-lg appearance-none cursor-pointer accent-terracotta"
                  />
                </div>
              )}
            </div>

            {/* Loop & Play Controls */}
            <div className="space-y-4 mb-6">
              {/* Loop Setting (Permanently Locked) */}
              <div className="flex items-center justify-between p-3.5 bg-wood-800/60 rounded-xl border border-amber-700/30">
                <div className="flex items-center gap-2.5">
                  <Repeat
                    className="w-5 h-5 text-terracotta animate-spin"
                    style={{ animationDuration: '10s' }}
                  />
                  <div>
                    <span className="text-sm font-semibold text-amber-100 block">
                      Repetição Contínua em Loop
                    </span>
                    <span className="text-xs text-amber-300/70">
                      Toca sem parar durante toda a visita ao site (Travado e permanente)
                    </span>
                  </div>
                </div>

                <span className="text-xs px-2.5 py-1 rounded-full bg-terracotta/30 border border-terracotta/50 text-amber-200 font-semibold flex items-center gap-1">
                  🔒 Loop Ativo
                </span>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center justify-between p-3.5 bg-wood-800/60 rounded-xl border border-amber-700/30 gap-4">
                <div className="flex items-center gap-2 text-amber-200">
                  {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  <span className="text-sm font-medium">Volume</span>
                </div>
                <div className="flex items-center gap-2 flex-grow max-w-[200px]">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-wood-900 rounded-lg appearance-none cursor-pointer accent-terracotta"
                  />
                  <span className="text-xs text-amber-300 font-mono w-8 text-right">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Upload & Play */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac"
                className="hidden"
                onChange={handleFileUpload}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadLoading}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-800/80 hover:bg-amber-700 text-amber-100 font-medium transition flex items-center justify-center gap-2 border border-amber-600/40 shadow text-sm"
              >
                <Upload className="w-4 h-4 text-amber-300" />
                <span>{uploadLoading ? 'Processando...' : 'Carregar Áudio (Veni Creator Spiritus)'}</span>
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className={`py-3 px-5 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow text-sm ${
                  isPlaying
                    ? 'bg-amber-700 hover:bg-amber-600 text-white'
                    : 'bg-terracotta hover:bg-red-800 text-white shadow-terracotta/40'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    <span>Pausar Música</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Tocar Agora</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-[11px] text-amber-300/80">
                🔒 A música fica salva permanentemente neste navegador, protegida contra exclusão e configurada para tocar em loop infinito.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
