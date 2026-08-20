import React from 'react';
import {
  Flame,
  Mic,
  Pause,
  Play,
  Radio,
  Share2,
  Sparkles,
  Volume2,
  VolumeX,
  Wifi,
  X
} from 'lucide-react';

interface RadioPelotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  volume?: number;
  onVolumeChange?: (val: number) => void;
}

export const RadioPelotaModal: React.FC<RadioPelotaModalProps> = ({
  isOpen,
  onClose,
  isPlaying,
  onTogglePlay,
  isMuted = false,
  onToggleMute,
  volume = 0.8,
  onVolumeChange,
}) => {
  if (!isOpen) return null;

  const episodes = [
    {
      title: 'Emisora Oficial: Antenne Live MP3 (192 kbps Stream)',
      show: 'Glovall Radio Live Streaming',
      duration: 'En Directo',
      host: 'Ernesto Jerez & Carlos Rosario',
      tag: 'Señal en Vivo',
    },
    {
      title: 'Ep. 42: Julio 2 y la Nueva Generación de Campocortos Dominicanos',
      show: 'Glovall Radio Show',
      duration: '28:40',
      host: 'Ernesto Jerez & Carlos Rosario',
      tag: 'Scouting MLB',
    },
    {
      title: 'Ep. 41: ¿Cómo medir el Baseball IQ en prospectos de 16 años?',
      show: 'Glovall SportsTech Podcast',
      duration: '34:15',
      host: 'Dr. Manuel Peña (Biomecánica)',
      tag: 'EdTech & Biomecánica',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl text-white shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md transition-colors ${
                isPlaying
                  ? 'bg-emerald-600 shadow-emerald-600/30'
                  : 'bg-rose-600 shadow-rose-600/30'
              }`}
            >
              <Radio className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">Radio Pelota • Glovall Live</h3>
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isPlaying ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      isPlaying ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                </span>
                <span
                  className={`text-[10px] uppercase font-black tracking-wider ${
                    isPlaying ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPlaying ? 'EN VIVO • REPRODUCIENDO' : 'PAUSADO'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transmisión en vivo de pelota profesional, academias y análisis de scouts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Banner */}
        <div className="p-6 space-y-6 bg-gradient-to-b from-slate-950 to-slate-900">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shrink-0 ${
                isPlaying ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-blue-600'
              }`}
            >
              📻
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Stream Live Directo
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 text-[9px] font-bold flex items-center gap-1">
                  <Wifi className="w-2.5 h-2.5" /> 192 kbps
                </span>
              </div>
              <h4 className="text-sm font-black text-white truncate mt-0.5">
                Hitradio Antenne Live • Radio Pelota Feed
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Fuente: https://stream.antenne.com/antenne-nds/mp3-192
              </p>
            </div>
          </div>

          {/* Audio Visualizer Waves Simulator */}
          <div className="space-y-2">
            <div className="flex items-end justify-center gap-1.5 h-12 py-2">
              {[40, 70, 90, 45, 80, 100, 60, 85, 50, 95, 75, 60, 80, 100, 65, 45, 90, 70].map(
                (height, i) => (
                  <div
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-150 ${
                      isPlaying ? 'bg-emerald-400' : 'bg-slate-700'
                    }`}
                    style={{
                      height: isPlaying ? `${height}%` : '20%',
                      opacity: isPlaying ? 1 : 0.3,
                    }}
                  />
                )
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span className={isPlaying ? 'text-emerald-400' : 'text-slate-500'}>
                {isPlaying ? '● Transmitiendo Audio en Vivo' : '○ Audio en Espera'}
              </span>
              <span>Señal Digital HD</span>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex items-center justify-center gap-6">
            {onToggleMute && (
              <button
                type="button"
                onClick={onToggleMute}
                className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
                title={isMuted ? 'Activar Sonido' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}

            <button
              type="button"
              onClick={onTogglePlay}
              className={`w-16 h-16 rounded-full text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer ${
                isPlaying
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
              }`}
              title={isPlaying ? 'Pausar Transmisión' : 'Iniciar Stream'}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7" />
              ) : (
                <Play className="w-7 h-7 ml-1 fill-white" />
              )}
            </button>

            {onVolumeChange && (
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="w-20 accent-emerald-500 cursor-pointer"
                  title="Ajustar Volumen"
                />
              </div>
            )}
          </div>
        </div>

        {/* Informative Stream Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500' : 'bg-slate-600'}`} />
            <span>Radio Pelota Global Network</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
          >
            Cerrar Ventana (Audio Sigue Activo)
          </button>
        </div>
      </div>
    </div>
  );
};
