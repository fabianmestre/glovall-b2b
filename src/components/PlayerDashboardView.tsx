import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Award,
  BookOpen,
  Brain,
  Building2,
  Calendar,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Flame,
  Gauge,
  GraduationCap,
  HelpCircle,
  Layers,
  Link2,
  Link2Off,
  Lock,
  MapPin,
  Play,
  Plus,
  Radio,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Upload,
  UserCheck,
  Users,
  Video,
  X,
  Zap,
} from 'lucide-react';
import { BASEBALL_IQ_QUESTIONS, MLB_BENCHMARKS } from '../data/mockData';
import { AcademyProfile, Player, VideoClip } from '../types';
import { Player360Modal } from './Player360Modal';
import { MetricRegistrationModal } from './player360/MetricRegistrationModal';

interface PlayerDashboardViewProps {
  academy: AcademyProfile;
  player: Player;
  onUpdatePlayer: (updatedPlayer: Player) => void;
  onNavigateTab: (tab: string) => void;
  onOpenRadioPelota: () => void;
}

export const PlayerDashboardView: React.FC<PlayerDashboardViewProps> = ({
  academy,
  player,
  onUpdatePlayer,
  onNavigateTab,
  onOpenRadioPelota,
}) => {
  // Modal states
  const [is360Open, setIs360Open] = useState(false);
  const [showNewMetricModal, setShowNewMetricModal] = useState(false);
  const [showDesvincularModal, setShowDesvincularModal] = useState(false);
  const [showVincularModal, setShowVincularModal] = useState(false);
  const [invitationCodeInput, setInvitationCodeInput] = useState('');
  const [showUploadVideoModal, setShowUploadVideoModal] = useState(false);
  const [activeVideoToPlay, setActiveVideoToPlay] = useState<VideoClip | null>(null);
  const [showQuickQuizModal, setShowQuickQuizModal] = useState(false);

  // Video Filter
  const [videoFilter, setVideoFilter] = useState<'all' | 'academy' | 'player'>('all');

  // Video Upload Form State
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoCategory, setNewVideoCategory] = useState<VideoClip['category']>('Bateo (BP)');
  const [newVideoUrl, setNewVideoUrl] = useState(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );
  const [newVideoNotes, setNewVideoNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Quick Quiz State
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizAnswerSubmitted, setQuizAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Benchmark Switcher
  const [selectedMlbIndex, setSelectedMlbIndex] = useState(0);
  const currentMlb = MLB_BENCHMARKS[selectedMlbIndex] || MLB_BENCHMARKS[0];

  const isAffiliatedWithAcademy = player.availabilityStatus !== 'disponible_agente_libre';
  const academyLocationStr = `${academy.city || 'Boca Chica'}, ${academy.country || 'República Dominicana'}`;

  // Handler for desvincularse
  const handleConfirmDesvinculacion = () => {
    const historicalRecord = {
      id: `acad-hist-${Date.now()}`,
      academyName: academy.name,
      categoryOrRole: 'Programa de Desarrollo Oficial',
      period: `2024 - ${new Date().getFullYear()}`,
      headCoach: player.assignedCoachName || 'Carlos Rosario',
      location: academyLocationStr,
      status: 'historical' as const,
      transitionReason: 'Desvinculación voluntaria de atleta hacia estatus Agente Libre',
      highlights: `Historial certificado con Glovall Score de ${player.glovallScore} pts y TrackMan verificado`,
    };

    const updatedHistory = [historicalRecord, ...(player.academyHistory || [])];

    const updatedPlayer: Player = {
      ...player,
      availabilityStatus: 'disponible_agente_libre',
      currentAffiliations: [],
      academyHistory: updatedHistory,
    };

    onUpdatePlayer(updatedPlayer);
    setShowDesvincularModal(false);
  };

  // Handler for vincularse
  const handleConfirmVinculacion = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPlayer: Player = {
      ...player,
      availabilityStatus: 'en_desarrollo',
      currentAffiliations: [
        {
          academyId: academy.id,
          academyName: academy.name,
          programType: 'matriz_principal',
          programTypeName: 'Programa Integral de Desarrollo',
          roleOrCategory: `Prospecto Oficial #${player.jerseyNumber || 12}`,
          isPrimary: true,
          startDate: new Date().toISOString().split('T')[0],
          status: 'active',
          headCoachName: player.assignedCoachName || 'Carlos Rosario',
          location: academyLocationStr,
        },
      ],
    };

    onUpdatePlayer(updatedPlayer);
    setShowVincularModal(false);
    setInvitationCodeInput('');
  };

  // Handler for uploading player video
  const handleSavePlayerVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle.trim()) return;

    setIsUploading(true);
    setTimeout(() => {
      const newClip: VideoClip = {
        id: `vid-player-${Date.now()}`,
        title: newVideoTitle.trim(),
        category: newVideoCategory,
        thumbnail:
          'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=600&q=80',
        videoUrl: newVideoUrl,
        duration: '1:15',
        date: new Date().toISOString().split('T')[0],
        biomechanicsVerified: false,
        notes:
          newVideoNotes.trim() || 'Video autónomo subido por el atleta para su vitrina de scouts.',
        source: 'player_upload',
        uploadedBy: player.fullName,
      };

      const updatedClips = [newClip, ...(player.videoClips || [])];
      onUpdatePlayer({
        ...player,
        videoClips: updatedClips,
      });

      setIsUploading(false);
      setShowUploadVideoModal(false);
      setNewVideoTitle('');
      setNewVideoNotes('');
    }, 500);
  };

  // Filter video clips
  const allClips: VideoClip[] = player.videoClips || [];
  const filteredClips = allClips.filter((clip) => {
    if (videoFilter === 'academy') return clip.source !== 'player_upload';
    if (videoFilter === 'player') return clip.source === 'player_upload';
    return true;
  });

  // Quick Quiz Handlers
  const handleQuizAnswer = (optionIdx: number) => {
    if (quizAnswerSubmitted) return;
    setQuizSelectedOption(optionIdx);
  };

  const handleQuizSubmit = () => {
    if (quizSelectedOption === null) return;
    setQuizAnswerSubmitted(true);
    const currQ = BASEBALL_IQ_QUESTIONS[quizQuestionIndex];
    if (quizSelectedOption === currQ.correctAnswerIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleQuizNext = () => {
    if (quizQuestionIndex < Math.min(2, BASEBALL_IQ_QUESTIONS.length - 1)) {
      setQuizQuestionIndex((prev) => prev + 1);
      setQuizSelectedOption(null);
      setQuizAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
      const newScore = Math.min(100, (player.edTech?.baseballIqScore || 85) + 3);
      onUpdatePlayer({
        ...player,
        edTech: {
          ...player.edTech,
          baseballIqScore: newScore,
          lastIqTestDate: new Date().toISOString().split('T')[0],
        },
      });
    }
  };

  const handleResetQuizModal = () => {
    setShowQuickQuizModal(false);
    setQuizQuestionIndex(0);
    setQuizSelectedOption(null);
    setQuizAnswerSubmitted(false);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  return (
    <div id="player-dashboard-portal" className="space-y-6 animate-in fade-in duration-200">
      {/* 1. ATHLETE IDENTITY & PASAPORTE HEADER */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={player.avatar}
              alt={player.fullName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-black uppercase">
              {player.position}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {player.fullName}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                Clase {player.signingClass}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verificado MLB
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              {player.hometown} • {player.age} años • {player.height} • {player.weight} lbs • B/T:{' '}
              {player.bats}/{player.throws}
            </p>

            <div className="flex items-center gap-2 pt-0.5 text-xs">
              <span className="text-slate-600">
                Pasaporte Digital:{' '}
                <strong className="text-slate-900 font-mono">
                  {player.glovallPassportId || `GLV-${player.id.toUpperCase()}`}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls & Radio */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setShowNewMetricModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Activity className="w-4 h-4 text-emerald-100" />
            <span>Registrar Métrica</span>
          </button>

          <button
            onClick={() => setIs360Open(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>Mi Pasaporte 360°</span>
          </button>

          <button
            onClick={onOpenRadioPelota}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            title="Sintonizar Radio Pelota"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Radio Pelota</span>
          </button>
        </div>
      </div>

      {/* 2. SOBERANÍA Y ESTADO DE AFILIACIÓN INSTITUCIONAL */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
              isAffiliatedWithAcademy ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
            }`}
          >
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Afiliación Institucional
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isAffiliatedWithAcademy
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {isAffiliatedWithAcademy ? 'Roster Oficial Activo' : 'Agente Libre / Independiente'}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-800">
              {isAffiliatedWithAcademy
                ? `${academy.name} • Sede Principal (${academyLocationStr})`
                : 'Prospecto Independiente (Historial deportivo preservado)'}
            </p>
          </div>
        </div>

        <div>
          {isAffiliatedWithAcademy ? (
            <button
              onClick={() => setShowDesvincularModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50/70 hover:bg-rose-100/80 border border-rose-200/60 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Link2Off className="w-3.5 h-3.5" />
              <span>Desvincularme de la Academia</span>
            </button>
          ) : (
            <button
              onClick={() => setShowVincularModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Vincularme a una Academia</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. HERO STATS (VERIFIED RADAR & LASER METRICS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Velo Brazo / Recta
            </span>
            <Gauge className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl font-black text-slate-900">
              {(player.metrics.fastballVeloMaxMph || player.metrics.armVelocityMph).toFixed(1)}
            </span>
            <span className="text-xs font-bold text-slate-400">MPH</span>
          </div>
          <div className="text-[11px] font-semibold text-indigo-600 flex items-center justify-between pt-2 border-t border-slate-50">
            <span>TrackMan Certificado</span>
            <span>Top 5%</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Exit Velocity Máx
            </span>
            <Flame className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl font-black text-slate-900">
              {player.metrics.exitVelocityMph.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-slate-400">MPH</span>
          </div>
          <div className="text-[11px] font-semibold text-blue-600 flex items-center justify-between pt-2 border-t border-slate-50">
            <span>Bat Speed: {player.metrics.batSpeedMph || 76.5} MPH</span>
            <span>Élite</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              60 Yardas Láser
            </span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl font-black text-slate-900">
              {player.metrics.sixtyYardDashSec.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-slate-400">SEG</span>
          </div>
          <div className="text-[11px] font-semibold text-amber-600 flex items-center justify-between pt-2 border-t border-slate-50">
            <span>Tiempo 1B: {player.metrics.timeToFirstBaseSec}s</span>
            <span>Plus Runner</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Glovall Score™
            </span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl font-black text-slate-900">{player.glovallScore}</span>
            <span className="text-xs font-bold text-slate-400">/100</span>
          </div>
          <div className="text-[11px] font-semibold text-emerald-600 flex items-center justify-between pt-2 border-t border-slate-50">
            <span>Baseball IQ: {player.edTech?.baseballIqScore || 85}%</span>
            <span>Grado 70</span>
          </div>
        </div>
      </div>

      {/* 4. BASEBALL IQ & BIBLIOTECA (PLAN FORMATIVO ASIGNADO POR LA ACADEMIA) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  Baseball IQ & Plan Formativo
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-black">
                  Asignado por tu Academia
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Módulos tácticos y evaluaciones de toma de decisiones en video
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQuickQuizModal(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Presentar Test IQ</span>
            </button>
            <button
              onClick={() => onNavigateTab('baseball-iq')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Biblioteca</span>
            </button>
          </div>
        </div>

        {/* IQ Progress & Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-purple-700 block">
                Nivel Actual de IQ
              </span>
              <span className="text-2xl font-black text-purple-900">
                {player.edTech?.baseballIqScore || 85}%
              </span>
            </div>
            <div className="text-right text-xs text-purple-700 font-semibold">
              <span>Último test:</span>
              <p className="font-bold">{player.edTech?.lastIqTestDate || 'Reciente'}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-500 block">
                Módulos Completados
              </span>
              <span className="text-2xl font-black text-slate-800">
                {player.edTech?.completedCoursesCount || 3} / {player.edTech?.totalCoursesCount || 4}
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              En progreso
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-500 block">
                Suscripción Formativa
              </span>
              <span className="text-sm font-bold text-slate-800">Plan B2B Activo</span>
            </div>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* 4b. SESIONES DE COACHING & TRYOUTS / SHOWCASES DE TRAYECTORIA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coaching & Training Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    Sesiones & Coaching
                  </h3>
                  <p className="text-xs text-slate-500">
                    Plan de trabajo, drills y evaluaciones del staff
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                {player.coachingSessions?.length || player.coachingHistory?.length || 0} Registradas
              </span>
            </div>

            {/* Latest Session Preview */}
            {(player.coachingSessions && player.coachingSessions.length > 0) ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    {player.coachingSessions[0].trainingArea}
                  </span>
                  <span className="text-slate-500">{player.coachingSessions[0].date}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {player.coachingSessions[0].drillsCompleted}
                </p>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-slate-500 font-medium">
                    Coach: <strong className="text-slate-700">{player.coachingSessions[0].coachName}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">
                    Nota: {player.coachingSessions[0].performanceScore || 9.2} / 10
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-3 text-center bg-slate-50 rounded-xl">
                No hay sesiones recientes registradas
              </p>
            )}
          </div>

          <button
            onClick={() => onNavigateTab('coaching')}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer mt-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Acceder a Sesiones & Coaching</span>
            <ChevronRight className="w-3.5 h-3.5 ml-auto" />
          </button>
        </div>

        {/* Tryouts & Showcases Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    Tryouts & Showcases
                  </h3>
                  <p className="text-xs text-slate-500">
                    Historial de scouting, radares y notas oficiales
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                {player.showcaseHistory?.length || 0} Eventos
              </span>
            </div>

            {/* Latest Showcase Preview */}
            {(player.showcaseHistory && player.showcaseHistory.length > 0) ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 truncate max-w-[200px]">
                    {player.showcaseHistory[0].eventTitle}
                  </span>
                  <span className="text-slate-500 shrink-0">{player.showcaseHistory[0].date}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {player.showcaseHistory[0].metricsRecorded.slice(0, 2).map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700"
                    >
                      {m.metricName.split(' ')[0]}: {m.value}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    {player.showcaseHistory[0].status}
                  </span>
                  <span className="text-slate-500">
                    {player.showcaseHistory[0].city || 'Santo Domingo'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-3 text-center bg-slate-50 rounded-xl">
                No hay eventos registrados aún
              </p>
            )}
          </div>

          <button
            onClick={() => onNavigateTab('showcase-history')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer mt-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Acceder a Tryouts & Showcases</span>
            <ChevronRight className="w-3.5 h-3.5 ml-auto" />
          </button>
        </div>
      </div>

      {/* 5. MIS VIDEOS & HIGHLIGHTS (SUBIDA DE VIDEOS PROPIOS Y OFICIALES) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Mis Videos & Highlights
              </h3>
              <p className="text-xs text-slate-500">
                Portafolio audiovisual certificado y clips personales para scouts
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs">
              <button
                onClick={() => setVideoFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  videoFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Todos ({allClips.length})
              </button>
              <button
                onClick={() => setVideoFilter('academy')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  videoFilter === 'academy' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Academia
              </button>
              <button
                onClick={() => setVideoFilter('player')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  videoFilter === 'player' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Mis Videos
              </button>
            </div>

            <button
              onClick={() => setShowUploadVideoModal(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Subir Video Propio</span>
            </button>
          </div>
        </div>

        {/* Video Grid */}
        {filteredClips.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Video className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">No hay videos en este filtro</p>
            <button
              onClick={() => setShowUploadVideoModal(true)}
              className="mt-3 px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold"
            >
              Subir mi primer video
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClips.map((clip) => {
              const isPlayerUpload = clip.source === 'player_upload';
              return (
                <div
                  key={clip.id}
                  className="group rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-900 text-white flex flex-col justify-between hover:shadow-md transition-all relative"
                >
                  <div className="relative aspect-video overflow-hidden bg-black">
                    <img
                      src={
                        clip.thumbnail ||
                        'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={clip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Source Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex gap-1.5">
                      {isPlayerUpload ? (
                        <span className="px-2 py-0.5 rounded-md bg-blue-600/90 text-white text-[10px] font-black border border-blue-400/40">
                          Subido por Atleta
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-[10px] font-black border border-emerald-400/40 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Validado Academia
                        </span>
                      )}
                    </div>

                    <span className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-md bg-black/60 text-slate-300 text-[10px] font-bold">
                      {clip.duration || '1:15'}
                    </span>

                    {/* Play Button Overlay */}
                    <button
                      onClick={() => setActiveVideoToPlay(clip)}
                      className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 cursor-pointer z-10"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  </div>

                  <div className="p-3.5 bg-slate-950 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold">{clip.category}</span>
                      <span>{clip.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{clip.title}</h4>
                    {clip.notes && (
                      <p className="text-[11px] text-slate-400 line-clamp-1">{clip.notes}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. COMPARADOR STATCAST MLB */}
      <div className="bg-slate-950 rounded-3xl p-6 text-white border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={currentMlb.photo}
              alt={currentMlb.name}
              className="w-12 h-12 rounded-xl object-cover border border-blue-500/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-black text-white">{currentMlb.name}</h4>
                <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-400 text-[10px] font-bold">
                  {currentMlb.team}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Posición: {currentMlb.position} • Proyección MLB Statcast™
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {MLB_BENCHMARKS.map((mlb, idx) => (
              <button
                key={mlb.name || idx}
                onClick={() => setSelectedMlbIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedMlbIndex === idx
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {mlb.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Exit Velo Máx</span>
            <p className="text-xl font-black text-white mt-0.5">
              {(currentMlb.exitVelocityMaxMph || currentMlb.maxExitVeloMph || 115.4).toFixed(1)} MPH
            </p>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Bat Speed</span>
            <p className="text-xl font-black text-white mt-0.5">
              {(currentMlb.batSpeedMph || 78.4).toFixed(1)} MPH
            </p>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Sprint Speed</span>
            <p className="text-xl font-black text-white mt-0.5">
              {currentMlb.sprintSpeedFtSec.toFixed(1)} ft/s
            </p>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase">OPS Proyectado</span>
            <p className="text-xl font-black text-white mt-0.5">{currentMlb.ops.toFixed(3)}</p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: DESVINCULARSE DE LA ACADEMIA */}
      {/* ========================================================= */}
      {showDesvincularModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Link2Off className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">
                ¿Desvincularte de {academy.name}?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tu perfil pasará a <strong>Agente Libre / Atleta Independiente</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-blue-800">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Garantía de Soberanía del Pasaporte Digital</span>
              </div>
              <p className="text-[11px] text-blue-800/90 leading-relaxed">
                Todo tu historial técnico, mediciones TrackMan y evaluaciones previas permanecerán
                <strong> 100% intactas en tu expediente</strong> con el sello y certificación de la
                academia.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDesvincularModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDesvinculacion}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
              >
                Confirmar Desvinculación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: VINCULARSE A UNA ACADEMIA */}
      {/* ========================================================= */}
      {showVincularModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmVinculacion}
            className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-black text-slate-900">Vincularme a una Academia</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVincularModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Academia Seleccionada
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${academy.name} (${academyLocationStr})`}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Código de Invitación o Matrícula (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: CBA-2026-INV"
                  value={invitationCodeInput}
                  onChange={(e) => setInvitationCodeInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-blue-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowVincularModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
              >
                Vincular a Mi Perfil
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: SUBIDA DE VIDEO PROPIO */}
      {/* ========================================================= */}
      {showUploadVideoModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSavePlayerVideo}
            className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-black text-slate-900">Subir Video a Mi Portafolio</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadVideoModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título del Video *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: BP en jaula - Contacto sólido 98 MPH"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={newVideoCategory}
                    onChange={(e) => setNewVideoCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-blue-600 bg-white"
                  >
                    <option value="Bateo (BP)">Bateo (BP)</option>
                    <option value="Juego Real">Juego Real</option>
                    <option value="Bullpen">Bullpen</option>
                    <option value="Defensa & Tiro">Defensa & Tiro</option>
                    <option value="60 Yardas">60 Yardas</option>
                    <option value="Preparación Física">Preparación Física</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Insignia de Origen</label>
                  <input
                    type="text"
                    readOnly
                    value="Subido por Atleta"
                    className="w-full px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 text-xs font-bold text-blue-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Enlace de Video (MP4 / YouTube / Cloud)
                </label>
                <input
                  type="text"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notas / Contexto</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre lanzador enfrentado, velocidad medida o rutina..."
                  value={newVideoNotes}
                  onChange={(e) => setNewVideoNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-blue-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowUploadVideoModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                {isUploading ? (
                  <span>Guardando...</span>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Publicar en mi Portafolio</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: REPRODUCTOR DE VIDEO */}
      {/* ========================================================= */}
      {activeVideoToPlay && (
        <div
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveVideoToPlay(null)}
        >
          <div
            className="bg-slate-900 rounded-3xl overflow-hidden max-w-3xl w-full border border-slate-800 shadow-2xl p-5 space-y-3 text-white animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-400">
                  {activeVideoToPlay.source === 'player_upload'
                    ? 'Subido por Atleta'
                    : 'Validado por Academia'}{' '}
                  • {activeVideoToPlay.category}
                </span>
                <h3 className="text-sm font-black">{activeVideoToPlay.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideoToPlay(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-video bg-black rounded-2xl overflow-hidden relative flex items-center justify-center">
              <video
                src={
                  activeVideoToPlay.videoUrl ||
                  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
                }
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Fecha: {activeVideoToPlay.date}</span>
              {activeVideoToPlay.notes && <span className="italic">{activeVideoToPlay.notes}</span>}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: TEST RÁPIDO DE BASEBALL IQ */}
      {/* ========================================================= */}
      {showQuickQuizModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Test de Situaciones de Juego (Baseball IQ)
                </h3>
              </div>
              <button
                onClick={handleResetQuizModal}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!quizCompleted ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Pregunta {quizQuestionIndex + 1} de 3</span>
                  <span className="font-bold text-purple-600">
                    Nivel: {BASEBALL_IQ_QUESTIONS[quizQuestionIndex]?.difficulty || 'Intermedio'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
                  <h4 className="text-sm font-bold text-slate-900">
                    {BASEBALL_IQ_QUESTIONS[quizQuestionIndex]?.question}
                  </h4>
                </div>

                <div className="space-y-2">
                  {BASEBALL_IQ_QUESTIONS[quizQuestionIndex]?.options.map((opt, idx) => {
                    const isSelected = quizSelectedOption === idx;
                    const isCorrect =
                      idx === BASEBALL_IQ_QUESTIONS[quizQuestionIndex]?.correctAnswerIndex;
                    let optionStyle =
                      'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200';

                    if (quizAnswerSubmitted) {
                      if (isCorrect)
                        optionStyle =
                          'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
                      else if (isSelected)
                        optionStyle = 'bg-rose-50 text-rose-800 border-rose-300';
                    } else if (isSelected) {
                      optionStyle = 'bg-purple-50 text-purple-800 border-purple-300 font-bold';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuizAnswer(idx)}
                        className={`w-full p-3 rounded-xl text-xs text-left border transition-all cursor-pointer flex items-center justify-between ${optionStyle}`}
                      >
                        <span>{opt}</span>
                        {quizAnswerSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  {!quizAnswerSubmitted ? (
                    <button
                      type="button"
                      disabled={quizSelectedOption === null}
                      onClick={handleQuizSubmit}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs transition-all cursor-pointer"
                    >
                      Confirmar Respuesta
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleQuizNext}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Siguiente</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900">¡Evaluación Completada!</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Tu Baseball IQ se ha actualizado a{' '}
                    <strong className="text-purple-700 font-black">
                      {Math.min(100, (player.edTech?.baseballIqScore || 85) + 3)}%
                    </strong>{' '}
                    en tu Pasaporte Digital.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetQuizModal}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-all cursor-pointer"
                >
                  Cerrar y Ver Mi Score
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 360 MODAL (OPENED DIRECTLY AS ATHLETE) */}
      {/* ========================================================= */}
      {is360Open && (
        <Player360Modal
          player={player}
          onClose={() => setIs360Open(false)}
          onUpdatePlayer={onUpdatePlayer}
          onNavigateTab={onNavigateTab}
          activeRole="player"
        />
      )}

      {/* METRIC REGISTRATION MODAL */}
      {showNewMetricModal && (
        <MetricRegistrationModal
          player={player}
          activeRole="player"
          onClose={() => setShowNewMetricModal(false)}
          onSave={(_newRecord, updatedPlayer) => {
            onUpdatePlayer(updatedPlayer);
          }}
        />
      )}
    </div>
  );
};
