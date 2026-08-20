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
import { BASEBALL_IQ_QUESTIONS, MLB_BENCHMARKS, SHOWCASE_EVENTS } from '../data/mockData';
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
  const [showUploadVideoModal, setShowUploadVideoModal] = useState(false);
  const [activeVideoToPlay, setActiveVideoToPlay] = useState<VideoClip | null>(null);
  const [showQuickQuizModal, setShowQuickQuizModal] = useState(false);

  // Video Filter
  const [videoFilter, setVideoFilter] = useState<'all' | 'verified' | 'player'>('all');

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

  // Next upcoming showcase
  const nextEvent = SHOWCASE_EVENTS.find((e) => e.status === 'upcoming') || SHOWCASE_EVENTS[0];

  // Upload video handler
  const handleUploadVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle.trim()) return;

    setIsUploading(true);
    setTimeout(() => {
      const newClip: VideoClip = {
        id: `vid-${Date.now()}`,
        title: newVideoTitle,
        category: newVideoCategory,
        date: new Date().toISOString().split('T')[0],
        videoUrl: newVideoUrl,
        thumbnail: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=600&q=80',
        uploadedBy: 'player',
        biomechanicsVerified: false,
        duration: '0:32',
        notes: newVideoNotes || 'Subido directamente por el atleta para análisis técnico.',
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
    }, 600);
  };

  // Quick Quiz Handlers
  const currentQuestion = BASEBALL_IQ_QUESTIONS[quizQuestionIndex] || BASEBALL_IQ_QUESTIONS[0];

  const handleSelectQuizOption = (optIdx: number) => {
    if (quizAnswerSubmitted) return;
    setQuizSelectedOption(optIdx);
  };

  const handleSubmitQuizAnswer = () => {
    if (quizSelectedOption === null) return;
    setQuizAnswerSubmitted(true);
    if (quizSelectedOption === currentQuestion.correctAnswerIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizQuestionIndex + 1 < BASEBALL_IQ_QUESTIONS.length) {
      setQuizQuestionIndex((prev) => prev + 1);
      setQuizSelectedOption(null);
      setQuizAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleResetQuiz = () => {
    setQuizQuestionIndex(0);
    setQuizSelectedOption(null);
    setQuizAnswerSubmitted(false);
    setQuizScore(0);
    setQuizCompleted(false);
    setShowQuickQuizModal(false);
  };

  // Filter video clips
  const filteredVideos = (player.videoClips || []).filter((v) => {
    if (videoFilter === 'all') return true;
    if (videoFilter === 'verified') return v.biomechanicsVerified;
    if (videoFilter === 'player') return v.uploadedBy === 'player';
    return true;
  });

  return (
    <div id="player-dashboard-view" className="space-y-6 sm:space-y-8 animate-in fade-in duration-200 pb-16">
      {/* ========================================================================= */}
      {/* 1. HERO CARD DEL ATLETA & PERFIL 360° BUTTON */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/80 flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative overflow-hidden">
        {/* Left Side: Avatar & Meta */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 min-w-0">
          <div className="relative shrink-0">
            <img
              src={player.avatar}
              alt={player.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-3 border-blue-500/20 shadow-md"
            />
            <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-blue-600 text-white font-mono font-black text-xs flex items-center justify-center border-2 border-white shadow-xs">
              #{player.jerseyNumber || '12'}
            </span>
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {player.fullName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 font-mono font-black text-xs">
                {player.position}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs">
                Clase {player.signingClass}
              </span>
              {player.verificationStatus === 'verified' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verificado Glovall</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {isAffiliatedWithAcademy ? (
                    <strong className="text-slate-900">{academy.name}</strong>
                  ) : (
                    <strong className="text-amber-700">Agente Libre Internacional</strong>
                  )}
                </span>
              </span>
              <span className="text-slate-300">•</span>
              <span>
                Coach Asignado: <strong className="text-slate-900">{player.assignedCoachName || 'Carlos Rosario'}</strong>
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{player.hometown}</span>
              </span>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                B/T: <strong>{player.bats}/{player.throws}</strong>
              </span>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                Físico: <strong>{player.height} • {player.weight} lbs</strong>
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Elegible MLB Julio 2</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Score & Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 pt-3 xl:pt-0 border-t xl:border-t-0 border-slate-100">
          {/* Glovall Score Badge */}
          <div className="flex items-center gap-3 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-3 sm:p-4 rounded-2xl shadow-md border border-indigo-500/20">
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-blue-300 block">
                Glovall Score™
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {player.glovallScore}
                </span>
                <span className="text-[10px] text-blue-200 font-bold">/ 100</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIs360Open(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ver Mi Perfil 360°</span>
            </button>

            <button
              onClick={() => setShowNewMetricModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Métrica</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LOS 4 PILARES DE RENDIMIENTO (METRICS CARDS) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Pilar 1: Baseball IQ & Studio */}
        <div
          onClick={() => onNavigateTab('studio-test')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black">
              Élite MLB
            </span>
          </div>

          <div className="mt-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Baseball IQ Studio
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-purple-950 font-mono">
                {player.edTech?.baseballIqScore || 92}%
              </span>
              <span className="text-xs text-purple-600 font-bold">Acierto</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1 group-hover:text-purple-600 transition-colors">
              <span>{player.edTech?.completedCoursesCount || 4} Cursos • Ver Studio</span>
              <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </div>

        {/* Pilar 2: Exit Velocity */}
        <div
          onClick={() => onNavigateTab('metrics')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Gauge className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black">
              TrackMan
            </span>
          </div>

          <div className="mt-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Exit Velocity Máx.
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {player.metrics.exitVelocityMph}
              </span>
              <span className="text-xs font-bold text-blue-600">MPH</span>
            </div>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
              Percentil 95% en Clase {player.signingClass}
            </p>
          </div>
        </div>

        {/* Pilar 3: 60 Yard Dash */}
        <div
          onClick={() => onNavigateTab('metrics')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
              Velocidad
            </span>
          </div>

          <div className="mt-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Carrera 60 Yardas
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {player.metrics.sixtyYardDashSec}
              </span>
              <span className="text-xs font-bold text-emerald-600">Seg</span>
            </div>
            <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
              Grado Plus MLB (6.52s)
            </p>
          </div>
        </div>

        {/* Pilar 4: Videoanálisis & Biomecánica */}
        <div
          onClick={() => onNavigateTab('biomechanics')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black">
              240 FPS
            </span>
          </div>

          <div className="mt-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Clips de Mecánica
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {player.videoClips?.length || 5}
              </span>
              <span className="text-xs font-bold text-indigo-600">Videos HD</span>
            </div>
            <p className="text-[10px] text-indigo-600 font-bold mt-0.5 flex items-center gap-1">
              <span>Batting & Fielding • Ver</span>
              <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. STUDIO & ASIGNACIONES DE LA ACADEMIA + QUICK CHALLENGE */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Studio Deportivo & Asignaciones de la Academia
              </h3>
              <p className="text-xs text-slate-500">
                Tus accesos habilitados por la academia a Biblioteca, Savant y Tests de Baseball IQ.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('biblioteca')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Biblioteca</span>
            </button>

            <button
              onClick={() => onNavigateTab('savant')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-indigo-600" />
              <span>Savant</span>
            </button>

            <button
              onClick={() => onNavigateTab('studio-test')}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Tomar Test B-IQ</span>
            </button>
          </div>
        </div>

        {/* Status Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Próximo Test IQ */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                <span>Test Oficial Asignado</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-200/80 text-indigo-900 text-[10px] font-black">
                Programado
              </span>
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-xs">
                Evaluación Situacional: Conteo 3-2 & Hombre en 2B
              </h4>
              <p className="text-[11px] text-slate-600 mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>24 Ago 2026 • 09:00 AM (45 min)</span>
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('studio-test')}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Ir a la Sala de Examen
            </button>
          </div>

          {/* Card 2: Biblioteca de Estudio */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Biblioteca & Cursos</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-200/80 text-emerald-900 text-[10px] font-black">
                ✓ Habilitado
              </span>
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-xs">
                Curso: Lectura de Trayectorias y Quiebre de Curvas
              </h4>
              <p className="text-[11px] text-slate-600 mt-1">
                Progreso: <strong>Módulo 2 de 4 (50%)</strong>
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('biblioteca')}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Continuar Aprendizaje
            </button>
          </div>

          {/* Card 3: Savant & Telemetría */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Savant & TrackMan</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-200/80 text-blue-900 text-[10px] font-black">
                ✓ Habilitado
              </span>
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-xs">
                Sesión Sensorizada B1: Velocidad de Salida
              </h4>
              <p className="text-[11px] text-slate-600 mt-1">
                Último registro: <strong>Exit Velo 98.2 MPH (Launch Angle 24°)</strong>
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('savant')}
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Ver Telemetría Savant
            </button>
          </div>
        </div>

        {/* Quick Quiz Interactive Widget */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black tracking-wider text-purple-400 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              <span>Desafío Mental Baseball IQ del Día</span>
            </span>
            <p className="text-xs text-slate-300 max-w-xl">
              "Hombre en 2B sin outs, perdiendo por 1 en el 8vo inning. ¿Cuál es la prioridad mental del bateador frente a slider 2-1?"
            </p>
          </div>

          <button
            onClick={() => setShowQuickQuizModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 transition-all cursor-pointer shadow-md shadow-purple-500/20"
          >
            Responder Desafío Rápido →
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. COMPARADOR FÍSICO CONTRA ESTRELLAS MLB */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span>Comparativa Head-to-Head vs. Estrellas MLB</span>
            </h3>
            <p className="text-xs text-slate-500">
              Contrasta tus métricas actuales con los números de bateadores y lanzadores consagrados de Grandes Ligas.
            </p>
          </div>

          {/* Selector de Estrella MLB */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto">
            {MLB_BENCHMARKS.map((mlb, idx) => (
              <button
                key={mlb.name}
                onClick={() => setSelectedMlbIndex(idx)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedMlbIndex === idx
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mlb.name}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
          {/* Métrica 1: Exit Velo */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              Exit Velocity
            </span>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Tú:</span>
                <span className="text-lg font-black text-blue-600 font-mono">
                  {player.metrics.exitVelocityMph} MPH
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">{currentMlb.name}:</span>
                <span className="text-lg font-black text-slate-900 font-mono">
                  {currentMlb.maxExitVeloMph} MPH
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, (player.metrics.exitVelocityMph / currentMlb.maxExitVeloMph) * 100)}%` }}
              />
            </div>
          </div>

          {/* Métrica 2: 60 Yard Dash */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              60 Yard Dash / Sprint
            </span>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Tú (60 Yds):</span>
                <span className="text-lg font-black text-emerald-600 font-mono">
                  {player.metrics.sixtyYardDashSec}s
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">{currentMlb.name}:</span>
                <span className="text-lg font-black text-slate-900 font-mono">
                  {currentMlb.sprintSpeedFtSec} ft/s
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, (currentMlb.sprintSpeedFtSec / 30.5) * 100)}%` }}
              />
            </div>
          </div>

          {/* Métrica 3: Arm Strength */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              Potencia de Brazo
            </span>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Tú:</span>
                <span className="text-lg font-black text-purple-600 font-mono">
                  {player.metrics.armVelocityMph} MPH
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Hard Hit%:</span>
                <span className="text-lg font-black text-slate-900 font-mono">
                  {currentMlb.hardHitPercent}%
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-purple-600 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, (player.metrics.armVelocityMph / 100) * 100)}%` }}
              />
            </div>
          </div>

          {/* Métrica 4: Proyección MLB */}
          <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">
              Proyección MLB
            </span>
            <div className="text-xs font-black text-slate-900 leading-snug">
              Comparativa con perfil {currentMlb.position} ({currentMlb.team})
            </div>
            <p className="text-[11px] text-indigo-800 leading-tight">
              {currentMlb.description || 'Potencial de bateador de impacto con velocidad plus en las bases.'}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. VIDEO ROOM & MECÁNICAS + PRÓXIMO SHOWCASE */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Room Column (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-600" />
                <span>Video Room & Análisis Biomecánico</span>
              </h3>
              <p className="text-xs text-slate-500">
                Clips de bateo, fildeo y bullpen certificados por la academia.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowUploadVideoModal(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Subir Video</span>
              </button>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {filteredVideos.slice(0, 4).map((clip) => (
              <div
                key={clip.id}
                onClick={() => setActiveVideoToPlay(clip)}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 cursor-pointer shadow-xs hover:shadow-md transition-all"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={clip.thumbnail}
                    alt={clip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-white/90 group-hover:bg-white text-blue-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-black text-[10px]">
                      {clip.category}
                    </span>
                    {clip.biomechanicsVerified && (
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[9px] font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Verificado</span>
                      </span>
                    )}
                  </div>

                  <span className="absolute bottom-2.5 right-2.5 text-[10px] font-mono font-bold text-white bg-black/60 px-1.5 py-0.5 rounded-md">
                    {clip.duration}
                  </span>
                </div>

                <div className="p-3 bg-white space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs truncate group-hover:text-blue-600 transition-colors">
                    {clip.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 truncate">
                    {clip.notes || 'Subido para revisión técnica de coach.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Next Showcase & Coach Feedback */}
        <div className="space-y-6">
          {/* Próximo Showcase */}
          {nextEvent && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Próximo Tryout MLB
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700">
                  {nextEvent.date}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                <p className="text-xs font-black text-slate-900 leading-snug">
                  {nextEvent.title}
                </p>
                <p className="text-[11px] text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{nextEvent.location} • {nextEvent.city}</span>
                </p>
                <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Scouts Convocados:</span>
                  <span className="font-black text-emerald-800">{nextEvent.confirmedScoutsCount || 18} Franquicias</span>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('showcases')}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Ver Detalles de la Convocatoria</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Coach Notes */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Plan del Entrenador
              </h3>
              <span className="text-[10px] text-blue-600 font-bold">Carlos Rosario</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
              <p className="text-slate-700 font-medium leading-relaxed">
                "Excelente progreso en velocidad de salida alcanzando 99.4 MPH. En las sesiones de esta semana nos enfocaremos en la zona alta de strike y el reconocimiento de sliders con 2 strikes."
              </p>
              <div className="text-[10px] text-slate-400 font-medium pt-1">
                Actualizado ayer a las 18:30 PM
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. Modal Player 360 */}
      {is360Open && (
        <Player360Modal
          player={player}
          onClose={() => setIs360Open(false)}
          onUpdatePlayer={onUpdatePlayer}
          onNavigateTab={onNavigateTab}
          activeRole="player"
        />
      )}

      {/* 2. Modal Metric Registration */}
      {showNewMetricModal && (
        <MetricRegistrationModal
          player={player}
          onClose={() => setShowNewMetricModal(false)}
          onSave={(_, updated) => {
            onUpdatePlayer(updated);
            setShowNewMetricModal(false);
          }}
          activeRole="player"
        />
      )}

      {/* 3. Modal Video Player */}
      {activeVideoToPlay && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-800">
            <div className="p-4 flex items-center justify-between border-b border-slate-800 text-white">
              <div>
                <h4 className="font-bold text-sm">{activeVideoToPlay.title}</h4>
                <p className="text-xs text-slate-400">{activeVideoToPlay.category} • {activeVideoToPlay.date}</p>
              </div>
              <button
                onClick={() => setActiveVideoToPlay(null)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              <video
                src={activeVideoToPlay.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 bg-slate-900 text-xs text-slate-300">
              <strong className="text-white">Anotaciones técnicas:</strong> {activeVideoToPlay.notes}
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Upload Video */}
      {showUploadVideoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Subir Video de Mecánica</h3>
              <button
                onClick={() => setShowUploadVideoModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadVideo} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Título del Video</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Sesión Bateo BP - Enfoque Slider Exterior"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Categoría</label>
                <select
                  value={newVideoCategory}
                  onChange={(e) => setNewVideoCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
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
                <label className="font-bold text-slate-700 block mb-1">URL del Video (MP4 / Stream)</label>
                <input
                  type="url"
                  required
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notas u Observaciones</label>
                <textarea
                  rows={2}
                  placeholder="Detalles de la sesión, velocidad registrada, etc."
                  value={newVideoNotes}
                  onChange={(e) => setNewVideoNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadVideoModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all"
                >
                  {isUploading ? 'Subiendo...' : 'Guardar Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal Quick Quiz Challenge */}
      {showQuickQuizModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-black text-slate-900">
                  Desafío Rápido Baseball IQ
                </h3>
              </div>
              <button onClick={handleResetQuiz} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!quizCompleted ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold">Pregunta {quizQuestionIndex + 1} de {BASEBALL_IQ_QUESTIONS.length}</span>
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-700 font-bold rounded-md">
                    {currentQuestion.topic}
                  </span>
                </div>

                <h4 className="text-sm font-black text-slate-900 leading-snug">
                  {currentQuestion.situation}
                </h4>

                <p className="text-xs text-slate-700 font-semibold">
                  {currentQuestion.question}
                </p>

                <div className="space-y-2">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = quizSelectedOption === idx;
                    const isCorrect = idx === currentQuestion.correctAnswerIndex;
                    let btnStyle = 'border-slate-200 hover:bg-slate-50 text-slate-700';

                    if (quizAnswerSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'border-red-500 bg-red-50 text-red-900';
                      }
                    } else if (isSelected) {
                      btnStyle = 'border-purple-600 bg-purple-50 text-purple-900 font-bold';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectQuizOption(idx)}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizAnswerSubmitted && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                    <strong className="text-slate-900 block mb-0.5">Explicación Técnica:</strong>
                    {currentQuestion.explanation}
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  {!quizAnswerSubmitted ? (
                    <button
                      type="button"
                      disabled={quizSelectedOption === null}
                      onClick={handleSubmitQuizAnswer}
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs disabled:opacity-50 cursor-pointer"
                    >
                      Confirmar Respuesta
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNextQuizQuestion}
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer"
                    >
                      {quizQuestionIndex + 1 < BASEBALL_IQ_QUESTIONS.length ? 'Siguiente Pregunta' : 'Ver Resultados'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 mx-auto flex items-center justify-center text-2xl font-black">
                  🎯
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900">¡Desafío Completado!</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Obtuviste <strong>{quizScore} de {BASEBALL_IQ_QUESTIONS.length}</strong> aciertos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
