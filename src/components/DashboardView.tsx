import React from 'react';
import {
  AlertTriangle,
  Award,
  BarChart3,
  Brain,
  CheckCircle,
  ChevronRight,
  Download,
  ExternalLink,
  Flame,
  Gauge,
  Layers,
  Lock,
  Play,
  Plus,
  Radio,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  Video,
  Zap
} from 'lucide-react';
import { MLB_BENCHMARKS } from '../data/mockData';
import { AcademyProfile, Player, UserRole } from '../types';

interface DashboardViewProps {
  academy: AcademyProfile;
  players: Player[];
  activeRole: UserRole;
  activePlayer: Player;
  onNavigateTab: (tab: string) => void;
  onSelectPlayer: (player: Player) => void;
  onOpenRadioPelota: () => void;
  onOpenRbacModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  academy,
  players,
  activeRole,
  activePlayer,
  onNavigateTab,
  onSelectPlayer,
  onOpenRadioPelota,
  onOpenRbacModal,
}) => {
  const [selectedMlbPlayerIndex, setSelectedMlbPlayerIndex] = React.useState(0);
  const [metricMode, setMetricMode] = React.useState<'academy' | 'sample'>('academy');
  const [showVideoModal, setShowVideoModal] = React.useState(false);

  const currentMlb = MLB_BENCHMARKS[selectedMlbPlayerIndex] || MLB_BENCHMARKS[0];

  // Top metrics calculated from the 25 simulated prospects
  const safePlayers = players && players.length > 0 ? players : [];
  const maxFastball = safePlayers.length > 0 ? Math.max(...safePlayers.map((p) => p?.metrics?.fastballVeloMaxMph || p?.metrics?.armVelocityMph || 90)) : 94.5;
  const maxExitVelo = safePlayers.length > 0 ? Math.max(...safePlayers.map((p) => p?.metrics?.exitVelocityMph || 95)) : 104.2;
  const minTimeToFirst = safePlayers.length > 0 ? Math.min(...safePlayers.map((p) => p?.metrics?.timeToFirstBaseSec || 4.2)) : 3.85;
  const minSixty = safePlayers.length > 0 ? Math.min(...safePlayers.map((p) => p?.metrics?.sixtyYardDashSec || 6.8)) : 6.35;
  const avgGlovallScore = safePlayers.length > 0
    ? Math.round(safePlayers.reduce((acc, p) => acc + (p?.glovallScore || 70), 0) / safePlayers.length)
    : 84;
  const verifiedCount = safePlayers.filter((p) => p?.verificationStatus === 'verified').length;

  const topProspects = [...safePlayers]
    .sort((a, b) => (b?.glovallScore || 0) - (a?.glovallScore || 0))
    .slice(0, 5);


  return (
    <div id="dashboard-view-container" className="space-y-8 animate-in fade-in duration-200">
      {/* 1. TOP NOTIFICATION / STATUS BANNER (EXACT STYLE FROM SCREENSHOT) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-100/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            {activeRole === 'player' && !activePlayer.tutorConsentVideoUploaded ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-xs shadow-xs">
                <Lock className="w-3.5 h-3.5" />
                <span>ESTADO</span>
                <span className="font-normal opacity-90">|</span>
                <span>Pendiente de visibilidad ante scouts</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ESTADO</span>
                <span className="font-normal opacity-90">|</span>
                <span>Academia Verificada MLB Partner</span>
              </span>
            )}

            <span className="text-xs font-bold text-slate-700">
              {activeRole === 'player'
                ? `Prospecto: ${activePlayer.fullName}`
                : `Caribe Baseball Academy • ${verifiedCount}/${players.length} Prospectos Certificados`}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-600 font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>
              {activeRole === 'player'
                ? 'Faltan requisitos para habilitar la visibilidad ante scouts: documento del tutor legal, video de consentimiento del tutor.'
                : '3 prospectos nuevos requieren auditoría de consentimiento de tutor para habilitar su Scout Card pública.'}
            </span>
          </div>
        </div>

        {/* Right action button: Radio Pelota pill */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenRadioPelota}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-900/10 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <Radio className="w-4 h-4" />
            <span>Radio Pelota</span>
          </button>
        </div>
      </div>

      {/* 2. HERO STAT CARDS (EXACT RECREATION OF SCREENSHOT: VELO RECTA, EXIT VELO, TIEMPO A 1B, VIDEO HIGHLIGHT) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Velo Recta (MAX) */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100/80 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Gauge className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              Pitcheo
            </span>
          </div>

          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              VELO RECTA (MAX)
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                {metricMode === 'academy' ? maxFastball.toFixed(1) : '120.0'}
              </span>
              <span className="text-sm font-black text-slate-600">MPH</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between">
            <span className="truncate">
              {metricMode === 'academy'
                ? 'Cristian Marte (RHP 2027)'
                : 'Crea registros de pitcheo para ver este dato'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          </div>
        </div>

        {/* Card 2: Exit Velo (MAX) */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100/80 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-sky-50 text-sky-700">
              Bateo
            </span>
          </div>

          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              EXIT VELO (MAX)
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                {metricMode === 'academy' ? maxExitVelo.toFixed(1) : '120.0'}
              </span>
              <span className="text-sm font-black text-slate-600">EV</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center justify-between">
            <span className="truncate">
              {metricMode === 'academy'
                ? 'Kelvin Alcántara (OF 2026)'
                : 'Sube métricas de bateo para activarlo'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          </div>
        </div>

        {/* Card 3: Tiempo a 1B (MAX / VELOCIDAD) */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100/80 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <Trophy className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              Velocidad
            </span>
          </div>

          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              TIEMPO A 1B (MAX)
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                {metricMode === 'academy' ? minTimeToFirst.toFixed(2) : '5.00'}
              </span>
              <span className="text-sm font-black text-slate-600">sec</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between">
            <span className="truncate">
              {metricMode === 'academy'
                ? `Maikol Guzmán (6.32s 60yd)`
                : 'Más rápido que MLB'}
            </span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded-sm">
              Élite
            </span>
          </div>
        </div>

        {/* Card 4: Video Spotlight (Matching screenshot frame Geraldo Perdomo / Bryan Grano) */}
        <div
          onClick={() => setShowVideoModal(true)}
          className="relative group rounded-3xl overflow-hidden shadow-md cursor-pointer border border-slate-900 bg-slate-950 aspect-4/3 sm:aspect-auto flex flex-col justify-end min-h-[170px]"
        >
          <img
            src="https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=600&q=80"
            alt="Video Highlight"
            className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 ml-0.5 fill-slate-900" />
            </div>
          </div>

          {/* Player Banner Badge on video (from screenshot) */}
          <div className="relative z-10 p-4">
            <div className="bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg inline-block border border-white/20">
              <p className="text-[10px] font-black tracking-wider uppercase text-slate-900">
                GERALDO PERDOMO
              </p>
              <p className="text-[8px] font-bold text-slate-600 uppercase">
                SHORTSTOP • CUSTOM A2000® 1787
              </p>
            </div>
            <p className="text-[10px] text-white/80 font-medium mt-1 italic">
              "When I play every day, I like to have fun."
            </p>
          </div>
        </div>
      </div>

      {/* 3. DARK NAVY METRICAS MLB CONTAINER (EXACT DESIGN FROM SCREENSHOT) */}
      <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 space-y-6">
        {/* Header with Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h3 className="text-xl font-black text-white tracking-tight">Métricas MLB</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Estadísticas avanzadas de jugadores profesionales para benchmark de prospectos
            </p>
          </div>

          {/* Selector */}
          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-400 hidden sm:inline">Comparar con:</label>
            <select
              value={selectedMlbPlayerIndex}
              onChange={(e) => setSelectedMlbPlayerIndex(Number(e.target.value))}
              className="bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {MLB_BENCHMARKS.map((mlb, idx) => (
                <option key={mlb.name} value={idx}>
                  {mlb.name} ({mlb.team} - {mlb.position})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3 Stats Columns Cards (wOBA, OPS, Sprint) with BATEO/VELOCIDAD badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Stat 1: wOBA */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  wOBA
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600/30 text-blue-400 border border-blue-500/30">
                  BATEO
                </span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                WOBA (OFENSIVA GLOBAL)
              </p>
              <div className="text-2xl font-black text-blue-400 mb-2">
                .{Math.round(currentMlb.wOBA * 1000)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mide tu valor total como bateador sumando hits, dobles, jonrones y BB en un solo número ponderado.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{currentMlb.name}</span>
              <span className="text-emerald-400 font-bold">Top 1% MLB</span>
            </div>
          </div>

          {/* Stat 2: OPS */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  OPS
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600/30 text-blue-400 border border-blue-500/30">
                  BATEO
                </span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                OPS (ON-BASE PLUS SLUGGING)
              </p>
              <div className="text-2xl font-black text-blue-400 mb-2">
                {currentMlb.ops.toFixed(3)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                La suma de tu habilidad para embasarte y tu poder. Es el número rápido que todos los scouts evalúan.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Hard Hit %</span>
              <span className="text-blue-400 font-bold">{currentMlb.hardHitPercent}%</span>
            </div>
          </div>

          {/* Stat 3: Sprint */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Sprint
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-600/30 text-purple-400 border border-purple-500/30">
                  VELOCIDAD
                </span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                SPRINT SPEED (VELOCIDAD)
              </p>
              <div className="text-2xl font-black text-purple-400 mb-2">
                {currentMlb.sprintSpeedFtSec} <span className="text-xs text-slate-400 font-normal">ft/sec</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pies por segundo en tu máxima velocidad. 27 es promedio; más de 30 es nivel élite como Elly De La Cruz.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Exit Velo Máximo</span>
              <span className="text-purple-400 font-bold">{currentMlb.maxExitVeloMph} MPH</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ACADEMY MANAGEMENT & B2B CONTROL SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Prospects Ranking */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xs border border-slate-100/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  Top Prospectos de la Academia (Glovall Score™)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                  Top 5
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculado mediante algoritmos biométricos, Baseball IQ y métricas TrackMan
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('roster')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Ver Roster Completo (25)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {topProspects.map((player, index) => (
              <div
                key={player.id}
                onClick={() => onSelectPlayer(player)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 p-2 rounded-xl cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="w-6 text-center font-black text-sm text-slate-400">
                    #{index + 1}
                  </span>
                  <img
                    src={player.avatar}
                    alt={player.fullName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {player.fullName}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-semibold px-1.5 py-0.2 rounded-xs bg-slate-100 text-slate-700">
                        {player.position}
                      </span>
                      <span>Clase {player.signingClass}</span>
                      <span>•</span>
                      <span>{player.hometown}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-[11px] text-slate-400 block">Exit Velo / Arm</span>
                    <span className="text-xs font-bold text-slate-800">
                      {player.metrics.exitVelocityMph} / {player.metrics.armVelocityMph} MPH
                    </span>
                  </div>

                  <div className="w-14 text-center py-1 px-2 rounded-xl bg-blue-50 border border-blue-100">
                    <span className="text-xs font-black text-blue-700 block">
                      {player.glovallScore}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-blue-600 block">
                      Score
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick B2B Action Center */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100/80 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 mb-1">Centro de Acciones B2B</h3>
            <p className="text-xs text-slate-500">
              Operaciones rápidas de la academia para entrenadores y directores
            </p>

            <div className="space-y-2.5 mt-4">
              <button
                onClick={() => onNavigateTab('roster')}
                className="w-full p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>Cargar Nueva Medición Trackman</span>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-500" />
              </button>

              <button
                onClick={() => onNavigateTab('scout-book')}
                className="w-full p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-indigo-600" />
                  <span>Generar Scout Book (PDF)</span>
                </div>
                <span className="text-[10px] bg-indigo-200 px-2 py-0.5 rounded-full font-bold">
                  PDF
                </span>
              </button>

              <button
                onClick={() => onNavigateTab('baseball-iq')}
                className="w-full p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Brain className="w-4 h-4 text-emerald-600" />
                  <span>Asignar Test de Baseball IQ</span>
                </div>
                <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  EdTech
                </span>
              </button>

              <button
                onClick={onOpenRbacModal}
                className="w-full p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Configurar Permisos RBAC</span>
                </div>
                <span className="text-[10px] bg-purple-200 px-2 py-0.5 rounded-full font-bold">
                  Admin
                </span>
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 text-white mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-300">Plan B2B Activo</span>
              <span className="text-[10px] uppercase font-bold text-emerald-400">Enterprise</span>
            </div>
            <p className="text-xs font-bold">{academy.subscriptionPlan}</p>
            <p className="text-[10px] text-slate-400 mt-1">
              Renovación: {academy.nextBillingDate} • 25/25 Licencias Activas
            </p>
          </div>
        </div>
      </div>

      {/* Video Modal Simulation */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 max-w-2xl w-full text-white shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-bold">Geraldo Perdomo / Bryan Andrés Grano - BP & Biomecánica</h4>
                <p className="text-xs text-slate-400">Análisis de rotación de caderas y ángulo de ataque</p>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video bg-black rounded-2xl overflow-hidden relative flex items-center justify-center border border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=800&q=80"
                alt="Video"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xl animate-pulse">
                  <Play className="w-8 h-8 ml-1 fill-white" />
                </div>
                <span className="text-xs font-bold text-white bg-slate-900/80 px-3 py-1 rounded-full">
                  Tracking Biomecánico 780°/s • 104.2 MPH EV
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Resolución: 4K 120 FPS TrackMan Cam</span>
              <button
                onClick={() => {
                  setShowVideoModal(false);
                  onNavigateTab('biomechanics');
                }}
                className="text-blue-400 font-bold hover:underline"
              >
                Abrir en Studio de Biomecánica →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
