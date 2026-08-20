import React from 'react';
import {
  AlertCircle,
  Award,
  BookOpen,
  Brain,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  FileCheck,
  Flame,
  HelpCircle,
  History,
  Layers,
  Lightbulb,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Trophy,
  Users,
  Video,
  X,
  Zap
} from 'lucide-react';
import { BASEBALL_IQ_QUESTIONS, COURSES_LIBRARY } from '../data/mockData';
import { CourseModule, Player, UserRole } from '../types';

interface StudioEdTechViewProps {
  players: Player[];
  activeRole: UserRole;
  activePlayer: Player;
  onUpdatePlayerScore?: (playerId: string, newScore: number) => void;
  subTab?: string;
}

export const StudioEdTechView: React.FC<StudioEdTechViewProps> = ({
  players,
  activeRole,
  activePlayer,
  onUpdatePlayerScore,
  subTab = 'baseball-iq',
}) => {
  const [activeStudioTab, setActiveStudioTab] = React.useState<'baseball-iq' | 'biomechanics' | 'library' | 'history'>(
    (subTab as any) || 'baseball-iq'
  );

  // Baseball IQ Quiz State
  const [quizStarted, setQuizStarted] = React.useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = React.useState(false);
  const [scoreCount, setScoreCount] = React.useState(0);
  const [quizFinished, setQuizFinished] = React.useState(false);
  const [assignedTarget, setAssignedTarget] = React.useState('ALL');
  const [assignNotification, setAssignNotification] = React.useState(false);

  // Biomechanics State
  const [selectedBiomechPlayerId, setSelectedBiomechPlayerId] = React.useState<string>(players[0]?.id || 'ply-001');
  const [overlayBatAngle, setOverlayBatAngle] = React.useState(true);
  const [overlayHipRotation, setOverlayHipRotation] = React.useState(true);
  const [overlayReleaseTunnel, setOverlayReleaseTunnel] = React.useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = React.useState(false);
  const [videoFrame, setVideoFrame] = React.useState(45);

  const selectedBiomechPlayer = players.find((p) => p.id === selectedBiomechPlayerId) || players[0];

  const currentQ = BASEBALL_IQ_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQ.correctAnswerIndex) {
      setScoreCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < BASEBALL_IQ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      const calculatedScore = Math.round(
        ((scoreCount + (selectedOption === currentQ.correctAnswerIndex ? 1 : 0)) /
          BASEBALL_IQ_QUESTIONS.length) *
          100
      );
      if (onUpdatePlayerScore) {
        onUpdatePlayerScore(activePlayer.id, calculatedScore);
      }
    }
  };

  const handleResetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScoreCount(0);
    setQuizFinished(false);
  };

  const handleAssignTest = () => {
    setAssignNotification(true);
    setTimeout(() => setAssignNotification(false), 4000);
  };

  return (
    <div id="studio-edtech-container" className="space-y-6 animate-in fade-in duration-200">
      {/* Studio Header & Navigation Pills */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Glovall Studio & Módulo EdTech
              </h2>
              <p className="text-xs text-slate-500">
                Test de Baseball IQ interactivo, videoanálisis biomecánico y biblioteca de desarrollo
              </p>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setActiveStudioTab('baseball-iq')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeStudioTab === 'baseball-iq'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Test de Baseball IQ</span>
          </button>

          <button
            onClick={() => setActiveStudioTab('biomechanics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeStudioTab === 'biomechanics'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Videoanálisis Biomecánico</span>
          </button>

          <button
            onClick={() => setActiveStudioTab('library')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeStudioTab === 'library'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Biblioteca de Cursos</span>
          </button>

          <button
            onClick={() => setActiveStudioTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeStudioTab === 'history'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Historial IQ</span>
          </button>
        </div>
      </div>

      {/* 1. TEST DE BASEBALL IQ MODULE */}
      {activeStudioTab === 'baseball-iq' && (
        <div className="space-y-6">
          {/* Notification when assigned */}
          {assignNotification && (
            <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-md flex items-center justify-between animate-in slide-in-from-top duration-300">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                <span className="text-xs font-bold">
                  ¡Test de Baseball IQ asignado exitosamente al Roster seleccionado ({assignedTarget})! Notificación enviada al app de los jugadores.
                </span>
              </div>
              <button onClick={() => setAssignNotification(false)}>✕</button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Interactive Quiz Engine */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col justify-between">
              {!quizStarted && !quizFinished ? (
                /* Welcome Screen */
                <div className="space-y-6 text-center py-8 max-w-lg mx-auto">
                  <div className="w-20 h-20 rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-md shadow-blue-500/10">
                    <Brain className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 uppercase tracking-wider">
                      Evaluación de Inteligencia Táctica
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 mt-2">
                      Test Oficial de Baseball IQ Glovall
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Evalúa la comprensión situacional del juego: conteos, corredores en base, posicionamiento defensivo y reglas avanzadas de MLB.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl text-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Preguntas</span>
                      <span className="text-sm font-black text-slate-800">5 Situaciones</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Tiempo Estimado</span>
                      <span className="text-sm font-black text-slate-800">5 - 8 Minutos</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Ponderación</span>
                      <span className="text-sm font-black text-blue-600">Score Glovall</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setQuizStarted(true)}
                    className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    Comenzar Evaluación de Baseball IQ →
                  </button>
                </div>
              ) : quizFinished ? (
                /* Results Screen */
                <div className="space-y-6 text-center py-8 max-w-lg mx-auto">
                  <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                    <Trophy className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 uppercase tracking-wider">
                      Evaluación Completada
                    </span>
                    <h3 className="text-3xl font-black text-slate-900 mt-2">
                      {Math.round((scoreCount / BASEBALL_IQ_QUESTIONS.length) * 100)}% de Aciertos
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {scoreCount} de {BASEBALL_IQ_QUESTIONS.length} situaciones tácticas resueltas con grado profesional.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-left">
                    <span className="text-xs font-black text-blue-900 uppercase block mb-1">
                      Veredicto de Scouting IQ
                    </span>
                    <p className="text-xs text-slate-700">
                      {scoreCount >= 4
                        ? 'Nivel Élite / Plus MLB. Excelente lectura y toma de decisiones tácticas bajo presión de juego.'
                        : 'Nivel Sólido. Recomendado repasar módulos de Infield Fly y lectura de corredores en la Biblioteca.'}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleResetQuiz}
                      className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reintentar Test</span>
                    </button>
                    <button
                      onClick={() => setActiveStudioTab('history')}
                      className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                    >
                      Ver en Historial
                    </button>
                  </div>
                </div>
              ) : (
                /* Active Question Screen */
                <div className="space-y-6">
                  {/* Progress Bar & Header */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                      <span>
                        SITUACIÓN {currentQuestionIndex + 1} DE {BASEBALL_IQ_QUESTIONS.length}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-black">
                        {currentQ.topic}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full transition-all duration-300"
                        style={{
                          width: `${((currentQuestionIndex + 1) / BASEBALL_IQ_QUESTIONS.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Situation Card */}
                  <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <span className="text-[10px] uppercase font-bold text-blue-400">
                        Contexto del Juego
                      </span>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <span>Conteo: <strong>{currentQ.count || 'N/A'}</strong></span>
                        <span>•</span>
                        <span>Bases: <strong>{currentQ.runners || 'Limpias'}</strong></span>
                        <span>•</span>
                        <span>Outs: <strong>{currentQ.outs ?? 0}</strong></span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {currentQ.situation}
                    </p>
                  </div>

                  {/* Question */}
                  <div className="space-y-3">
                    <h4 className="text-base font-black text-slate-900">{currentQ.question}</h4>

                    {/* Options list */}
                    <div className="space-y-2.5">
                      {currentQ.options.map((option, idx) => {
                        let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-blue-300';
                        if (selectedOption === idx) {
                          btnStyle = 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20';
                        }
                        if (isAnswerSubmitted) {
                          if (idx === currentQ.correctAnswerIndex) {
                            btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20 font-bold';
                          } else if (selectedOption === idx) {
                            btnStyle = 'bg-rose-50 border-rose-500 text-rose-900';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectOption(idx)}
                            className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all flex items-start gap-3 ${btnStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full bg-white border border-slate-300 text-slate-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="flex-1">{option}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Explanation feedback if submitted */}
                  {isAnswerSubmitted && (
                    <div
                      className={`p-4 rounded-2xl border animate-in fade-in duration-200 ${
                        selectedOption === currentQ.correctAnswerIndex
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {selectedOption === currentQ.correctAnswerIndex ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                        )}
                        <span className="text-xs font-black uppercase">
                          {selectedOption === currentQ.correctAnswerIndex ? '¡Respuesta Correcta!' : 'Explicación Táctica'}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed">{currentQ.explanation}</p>
                      {currentQ.mlbExample && (
                        <p className="text-[11px] font-semibold mt-1 opacity-80 italic">
                          Fundamento: {currentQ.mlbExample}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Footer actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={handleResetQuiz}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600"
                    >
                      Cancelar
                    </button>

                    {!isAnswerSubmitted ? (
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={selectedOption === null}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-bold text-xs transition-all shadow-xs"
                      >
                        Confirmar Decisión
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <span>Siguiente Situación</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel: Assign IQ Tests & Academy Leaderboard */}
            <div className="space-y-6">
              {/* Assign Module for Coaches/Admins */}
              {(activeRole === 'admin' || activeRole === 'staff') && (
                <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-4">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Asignar Test a Prospectos
                    </h4>
                  </div>

                  <p className="text-xs text-slate-500">
                    Envía evaluaciones periódicas a los teléfonos y perfiles de los atletas.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Grupo o Prospecto Objetivo
                      </label>
                      <select
                        value={assignedTarget}
                        onChange={(e) => setAssignedTarget(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                      >
                        <option value="ALL">Todo el Roster (25 Atletas)</option>
                        <option value="CLASE_2026">Clase 2026 (12 Atletas)</option>
                        <option value="CLASE_2027">Clase 2027 (7 Atletas)</option>
                        <option value="INFIELDERS">Grupo de Infielders (SS / 2B / 3B)</option>
                        <option value="PITCHERS">Cuerpo de Lanzadores (RHP / LHP)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Módulo de Evaluación
                      </label>
                      <select className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
                        <option>Test General de Situaciones B2B (5 preguntas)</option>
                        <option>Lectura Avanzada de Pitch Tunneling</option>
                        <option>Reglamento Oficial MLB & Infield Fly</option>
                      </select>
                    </div>

                    <button
                      onClick={handleAssignTest}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Asignar Evaluación Ahora</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Roster IQ Leaderboard */}
              <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Ranking IQ de la Academia
                  </h4>
                  <span className="text-[10px] font-bold text-blue-600">Top 5</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {[...players]
                    .sort((a, b) => b.edTech.baseballIqScore - a.edTech.baseballIqScore)
                    .slice(0, 5)
                    .map((p, idx) => (
                      <div key={p.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-xs font-black text-slate-400 w-4">#{idx + 1}</span>
                          <img
                            src={p.avatar}
                            alt={p.fullName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{p.fullName}</p>
                            <p className="text-[10px] text-slate-400">{p.position} • Clase {p.signingClass}</p>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-black text-xs">
                          {p.edTech.baseballIqScore}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BIOMECHANICS & VIDEO ANALYZER MODULE */}
      {activeStudioTab === 'biomechanics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Canvas Simulator */}
            <div className="lg:col-span-2 bg-slate-950 rounded-3xl p-6 text-white shadow-xl border border-slate-800 space-y-4">
              {/* Canvas Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-black text-white">
                    Videoanálisis Biomecánico & Trazo 3D
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedBiomechPlayer.fullName} ({selectedBiomechPlayer.position}) • Sesión BP TrackMan
                  </p>
                </div>

                {/* Overlays toggles */}
                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => setOverlayBatAngle(!overlayBatAngle)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      overlayBatAngle ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Ángulo Ataque ({selectedBiomechPlayer.metrics.launchAngleAvgDeg || 15.6}°)
                  </button>

                  <button
                    onClick={() => setOverlayHipRotation(!overlayHipRotation)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      overlayHipRotation ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Rotación Caderas (780°/s)
                  </button>
                </div>
              </div>

              {/* Simulated Interactive Video Screen with Vector Lines */}
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800 group">
                <img
                  src={
                    selectedBiomechPlayer.position.includes('HP')
                      ? 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=1000&q=80'
                      : 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80'
                  }
                  alt="Biomechanics Analysis"
                  className="w-full h-full object-cover opacity-70"
                />

                {/* Biomechanic Graphic Vector Overlays */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {overlayBatAngle && (
                    <g>
                      {/* Bat path trajectory arc */}
                      <path
                        d="M 180 260 Q 320 220 540 140"
                        fill="none"
                        stroke="#0ea5e9"
                        strokeWidth="4"
                        strokeDasharray="6 4"
                      />
                      {/* Launch angle line */}
                      <line x1="320" y1="220" x2="480" y2="100" stroke="#38bdf8" strokeWidth="3" />
                      <circle cx="320" cy="220" r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                      <text x="340" y="195" fill="#38bdf8" fontSize="13" fontWeight="bold">
                        Ángulo Salida: {selectedBiomechPlayer.metrics.launchAngleAvgDeg || 16.2}°
                      </text>
                      <text x="340" y="215" fill="#ffffff" fontSize="12">
                        EV: {selectedBiomechPlayer.metrics.exitVelocityMph} MPH
                      </text>
                    </g>
                  )}

                  {overlayHipRotation && (
                    <g>
                      {/* Hip rotational circle & velocity */}
                      <circle cx="280" cy="270" r="32" fill="none" stroke="#a855f7" strokeWidth="3" />
                      <line x1="280" y1="270" x2="310" y2="250" stroke="#c084fc" strokeWidth="3" markerEnd="url(#arrow)" />
                      <text x="220" y="325" fill="#c084fc" fontSize="12" fontWeight="bold">
                        Rotación Pélvica: 780°/sec (Élite)
                      </text>
                    </g>
                  )}
                </svg>

                {/* Center play state badge */}
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-emerald-400 border border-slate-700">
                  ● 120 FPS TrackMan Cam Sync
                </div>

                <button
                  onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                  className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform"
                >
                  {isPlayingVideo ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1 fill-white" />}
                </button>
              </div>

              {/* Scrubber & Controls */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Frame: {videoFrame} / 120 (Punto de Contacto / Release)</span>
                  <span>Velocidad de Bate: {selectedBiomechPlayer.metrics.batSpeedMph || 77.5} MPH</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  value={videoFrame}
                  onChange={(e) => setVideoFrame(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>

            {/* Right: Select Player & Biomechanical Breakdown */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-4">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Seleccionar Prospecto para Análisis
              </h4>

              <select
                value={selectedBiomechPlayerId}
                onChange={(e) => setSelectedBiomechPlayerId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
              >
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.position} - Clase {p.signingClass})
                  </option>
                ))}
              </select>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Velocidad Máxima de Bate (Bat Speed)
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    {selectedBiomechPlayer.metrics.batSpeedMph || 76.5} MPH
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Promedio MLB: 72.0 MPH | Élite: 77.0+ MPH
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Ángulo de Ataque Óptimo
                  </span>
                  <span className="text-lg font-black text-sky-600">
                    {selectedBiomechPlayer.metrics.launchAngleAvgDeg || 15.6}°
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Rango ideal de línea con poder: 12° a 22°
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Secuencia Cinemática
                  </span>
                  <span className="text-xs font-bold text-emerald-600 block mt-1">
                    ✓ Pelvis → Torso → Brazo → Bate (Sincronizado)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. BIBLIOTECA DE CURSOS MODULE */}
      {activeStudioTab === 'library' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COURSES_LIBRARY.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl overflow-hidden shadow-xs border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video bg-slate-900">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-white">
                      {course.lessonsCount} Lecciones • {course.durationMinutes} min
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                      {course.category}
                    </span>
                    <h4 className="text-sm font-black text-slate-900">{course.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Instructor: <strong className="text-slate-700">{course.instructor}</strong>
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-2">
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Iniciar Curso</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. HISTORIAL DE TESTS DE IQ */}
      {activeStudioTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Historial de Evaluaciones y Tests de Baseball IQ
              </h3>
              <p className="text-xs text-slate-500">
                Registros consolidados de la academia y evolución por prospecto
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
              25 Atletas Evaluados
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {players.slice(0, 10).map((player) => (
              <div key={player.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={player.avatar}
                    alt={player.fullName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{player.fullName}</p>
                    <p className="text-[11px] text-slate-500">
                      Último Test: {player.edTech.lastIqTestDate} • {player.position} Clase {player.signingClass}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs font-black text-blue-700 block">
                      {player.edTech.baseballIqScore}% Score
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {player.edTech.completedCoursesCount}/8 Cursos
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700">
                    Aprobado
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
