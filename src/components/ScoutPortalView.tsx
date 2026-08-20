import React from 'react';
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Flame,
  Lock,
  Mail,
  Phone,
  Search,
  Share2,
  Shield,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Video
} from 'lucide-react';
import { AcademyProfile, Player, UserRole } from '../types';

interface ScoutPortalViewProps {
  academy: AcademyProfile;
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  onNavigateTab: (tab: string) => void;
}

export const ScoutPortalView: React.FC<ScoutPortalViewProps> = ({
  academy,
  players,
  onSelectPlayer,
  onNavigateTab,
}) => {
  const [selectedClass, setSelectedClass] = React.useState('2026');
  const [selectedPos, setSelectedPos] = React.useState('ALL');
  const [comparePlayer1, setComparePlayer1] = React.useState<Player>(players[0]);
  const [comparePlayer2, setComparePlayer2] = React.useState<Player>(players[1]);
  const [showCompareTool, setShowCompareTool] = React.useState(false);

  const verifiedScoutCards = players.filter(
    (p) =>
      p.verificationStatus === 'verified' &&
      (selectedClass === 'ALL' || p.signingClass === selectedClass) &&
      (selectedPos === 'ALL' || p.position === selectedPos)
  );

  return (
    <div id="scout-portal-container" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner for Scouts */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-xs">
              Portal Oficial de Scouts MLB
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-600/30 text-emerald-400 font-bold text-xs border border-emerald-500/30">
              Datos Verificados con TrackMan™
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {academy.name} • Scout Cards & Evaluaciones
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Acceso exclusivo para directores de scouting y evaluadores de organizaciones MLB. Métricas biométricas certificadas por radar Doppler, tiempos láser de 60 yardas y Baseball IQ validado.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowCompareTool(!showCompareTool)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
          >
            {showCompareTool ? 'Ocultar Comparador' : 'Comparador Cara a Cara'}
          </button>

          <button
            onClick={() => onNavigateTab('scout-book')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Descargar Scout Book (PDF)</span>
          </button>
        </div>
      </div>

      {/* Head-to-Head Comparison Tool */}
      {showCompareTool && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-6 animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Comparador Cara a Cara de Prospectos (Head-to-Head)
            </h3>
            <span className="text-xs text-slate-500">Benchmark directo para draft / Julio 2</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Player 1 Picker */}
            <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Prospecto A</label>
                <select
                  value={comparePlayer1.id}
                  onChange={(e) => {
                    const p = players.find((pl) => pl.id === e.target.value);
                    if (p) setComparePlayer1(p);
                  }}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800"
                >
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.position} - Clase {p.signingClass})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={comparePlayer1.avatar}
                  alt={comparePlayer1.fullName}
                  className="w-14 h-14 rounded-2xl object-cover border"
                />
                <div>
                  <h4 className="text-sm font-black text-slate-900">{comparePlayer1.fullName}</h4>
                  <p className="text-xs text-slate-500">
                    {comparePlayer1.height} • {comparePlayer1.weight} lbs • Score: <strong>{comparePlayer1.glovallScore}</strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200 text-xs">
                <div className="bg-white p-2 rounded-xl border">
                  <span className="text-[10px] text-slate-400 block">Exit Velo</span>
                  <span className="font-black text-sky-700">{comparePlayer1.metrics.exitVelocityMph} MPH</span>
                </div>
                <div className="bg-white p-2 rounded-xl border">
                  <span className="text-[10px] text-slate-400 block">Arm Velo</span>
                  <span className="font-black text-indigo-700">{comparePlayer1.metrics.armVelocityMph} MPH</span>
                </div>
                <div className="bg-white p-2 rounded-xl border">
                  <span className="text-[10px] text-slate-400 block">60 Yardas</span>
                  <span className="font-black text-emerald-700">{comparePlayer1.metrics.sixtyYardDashSec}s</span>
                </div>
              </div>
            </div>

            {/* Player 2 Picker */}
            <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Prospecto B</label>
                <select
                  value={comparePlayer2.id}
                  onChange={(e) => {
                    const p = players.find((pl) => pl.id === e.target.value);
                    if (p) setComparePlayer2(p);
                  }}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800"
                >
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.position} - Clase {p.signingClass})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={comparePlayer2.avatar}
                  alt={comparePlayer2.fullName}
                  className="w-14 h-14 rounded-2xl object-cover border"
                />
                <div>
                  <h4 className="text-sm font-black text-slate-900">{comparePlayer2.fullName}</h4>
                  <p className="text-xs text-slate-500">
                    {comparePlayer2.height} • {comparePlayer2.weight} lbs • Score: <strong>{comparePlayer2.glovallScore}</strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200 text-xs">
                <div className="bg-white p-2 rounded-xl border">
                  <span className="text-[10px] text-slate-400 block">Exit Velo</span>
                  <span className="font-black text-sky-700">{comparePlayer2.metrics.exitVelocityMph} MPH</span>
                </div>
                <div className="bg-white p-2 rounded-xl border">
                  <span className="text-[10px] text-slate-400 block">Arm Velo</span>
                  <span className="font-black text-indigo-700">{comparePlayer2.metrics.armVelocityMph} MPH</span>
                </div>
                <div className="bg-white p-2 rounded-xl border">
                  <span className="text-[10px] text-slate-400 block">60 Yardas</span>
                  <span className="font-black text-emerald-700">{comparePlayer2.metrics.sixtyYardDashSec}s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Class Tabs */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Clase:</span>
          {['2026', '2027', '2028', 'ALL'].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedClass === cls
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cls === 'ALL' ? 'Todas las Clases' : `Clase ${cls}`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Posición:</span>
          <select
            value={selectedPos}
            onChange={(e) => setSelectedPos(e.target.value)}
            className="p-2 rounded-xl bg-slate-100 border-none text-xs font-bold text-slate-800"
          >
            <option value="ALL">Todas</option>
            <option value="OF">OF</option>
            <option value="SS">SS</option>
            <option value="RHP">RHP</option>
            <option value="LHP">LHP</option>
            <option value="C">C</option>
            <option value="3B">3B</option>
          </select>
        </div>
      </div>

      {/* Scout Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {verifiedScoutCards.map((player) => (
          <div
            key={player.id}
            onClick={() => onSelectPlayer(player)}
            className="bg-white rounded-3xl overflow-hidden shadow-xs border border-slate-100 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Card Header & Avatar */}
              <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={player.avatar}
                      alt={player.fullName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-400 shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-blue-500 text-white font-black text-[10px]">
                          {player.position}
                        </span>
                        <span className="text-xs font-bold text-slate-300">
                          Clase {player.signingClass}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-white mt-1 group-hover:text-blue-300 transition-colors">
                        {player.fullName}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {player.hometown} • {player.age} años
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-blue-300 block">Score</span>
                    <span className="text-2xl font-black text-white">{player.glovallScore}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-300 pt-2 border-t border-slate-700/80">
                  <span>{player.height} • {player.weight} lbs</span>
                  <span>B/T: {player.bats}/{player.throws}</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> TrackMan Verificado
                  </span>
                </div>
              </div>

              {/* Card Metrics 20-80 Mini Scale */}
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Exit Velo</span>
                    <span className="text-sm font-black text-sky-700">
                      {player.metrics.exitVelocityMph} MPH
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Velocidad 60</span>
                    <span className="text-sm font-black text-emerald-700">
                      {player.metrics.sixtyYardDashSec}s
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Arm Strength</span>
                    <span className="text-sm font-black text-indigo-700">
                      {player.metrics.armVelocityMph} MPH
                    </span>
                  </div>
                </div>

                {/* Scouting Quote */}
                <p className="text-xs text-slate-600 line-clamp-2 italic bg-blue-50/40 p-2.5 rounded-xl border border-blue-100">
                  "{player.scoutingNotes}"
                </p>

                {/* Pro comparison badge */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] text-slate-500">Proyección MLB:</span>
                  <span className="font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                    {player.comparableMlbPlayer}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer action */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-medium">
                {player.assignedCoachName}
              </span>
              <span className="font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Ver Scout Card Completa →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
