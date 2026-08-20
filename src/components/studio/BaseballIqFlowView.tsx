import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Lightbulb,
  Mic,
  MicOff,
  Camera,
  FileText,
  UploadCloud,
  CheckCircle2,
  Play,
  Square,
  Volume2,
  Clock,
  ChevronRight,
  Download,
  Share2,
  RotateCcw,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Check,
  Award,
  Zap,
  Info,
  Radio,
  BarChart3,
  Flame,
  VolumeX,
  RefreshCw,
  Eye,
  MessageSquare
} from 'lucide-react';
import { Player } from '../../types';

interface BaseballIqFlowViewProps {
  player?: Player;
  onUpdatePlayer?: (player: Player) => void;
}

type FlowStep = 'setup' | 'assessment' | 'report';

interface Challenge {
  id: string;
  code: string;
  category: string;
  question: string;
  playerResponseSample: string;
  aiEvaluation: string;
  isCompleted: boolean;
  isRecording?: boolean;
  recordedSeconds?: number;
  hasAudio?: boolean;
  isPlaying?: boolean;
}

const INITIAL_CHALLENGES: Challenge[] = [
  // 1. FUNDAMENTOS Y REGLAS
  {
    id: 'ch-1',
    code: 'RETO 01',
    category: '1. FUNDAMENTOS Y REGLAS',
    question: '¿Qué condiciones exactas definen legalmente un Infield Fly?',
    playerResponseSample: '"Se declara out automático con corredores en 1ra y 2da, o bases llenas, menos de 2 outs, ante un fly fácil de capturar por el cuadro..."',
    aiEvaluation: 'Dominio total de la regla. Identifica la no obligatoriedad de avance de los corredores y el criterio arbitral.',
    isCompleted: true,
    hasAudio: true,
  },
  {
    id: 'ch-2',
    code: 'RETO 02',
    category: '1. FUNDAMENTOS Y REGLAS',
    question: '¿Cuál es la diferencia entre obstrucción defensiva e interferencia del corredor?',
    playerResponseSample: '"La obstrucción es provocada por el jugador defensivo sin la pelota estorbando al corredor; la interferencia es provocada por el corredor estorbando una jugada legal..."',
    aiEvaluation: 'Explicación técnica clara. No hubo dudas en la diferenciación de conceptos y asignación de bases correspondientes.',
    isCompleted: true,
    hasAudio: true,
  },
  {
    id: 'ch-3',
    code: 'RETO 03',
    category: '1. FUNDAMENTOS Y REGLAS',
    question: '¿Cuál es el movimiento legal del lanzador para apelar a un corredor que no pisó una base?',
    playerResponseSample: '"El lanzador debe pisar la goma, pedir tiempo o lanzar directamente a la base apelada antes del siguiente lanzamiento oficial..."',
    aiEvaluation: 'Conoce el protocolo legal. Menciona correctamente el requerimiento de tiempo y lanzamiento en juego vivo.',
    isCompleted: true,
    hasAudio: true,
  },
  {
    id: 'ch-4',
    code: 'RETO 04',
    category: '1. FUNDAMENTOS Y REGLAS',
    question: '¿Puedes mencionar dos situaciones donde se declare bola muerta inmediata por el árbitro?',
    playerResponseSample: '"Cuando un pelotazo golpea al bateador dentro de la caja, o cuando un batazo de foul toca al bateador en la caja antes de tocar terreno bueno."',
    aiEvaluation: 'Respuestas reglamentarias exactas según el libro oficial MLB/WBSC.',
    isCompleted: true,
    hasAudio: true,
  },
  // 2. EJECUCIÓN BAJO PRESIÓN
  {
    id: 'ch-5',
    code: 'RETO 05',
    category: '2. EJECUCIÓN BAJO PRESIÓN',
    question: 'Hombre en 3ra base, 1 out, juego empatado en la 9na. Bateador zurdo de poder. ¿Cómo colocas el infield?',
    playerResponseSample: '"Infield adentro a nivel de grama para cortar la carrera en home, esquinas cerradas y comunicación inmediata con el receptor."',
    aiEvaluation: 'Priorización correcta del escenario de carrera definitoria. Buena gestión del ángulo de tiro.',
    isCompleted: true,
    hasAudio: true,
  },
  {
    id: 'ch-6',
    code: 'RETO 06',
    category: '2. EJECUCIÓN BAJO PRESIÓN',
    question: 'Conteo 3-2, 2 outs, corredor en 1ra sale con el pitch. Roletazo lento entre 3ra y SS. ¿A dónde tiras?',
    playerResponseSample: '"Si el tiro a 2da no es seguro debido al arranque del corredor, tiro con fuerza y balance a 1ra para asegurar el tercer out."',
    aiEvaluation: 'Excelente lectura de probabilidades y tiempos de carrera (4.1s en 90 pies).',
    isCompleted: true,
    hasAudio: true,
  },
  // 3. LECTURA DE SITUACIONES
  {
    id: 'ch-7',
    code: 'RETO 07',
    category: '3. LECTURA DE SITUACIONES',
    question: 'Corredores en 1ra y 2da, batazo profundo al callejón left-center. ¿Cuál es el relevo exacto del SS?',
    playerResponseSample: '"El SS toma posición de relevo en línea directa entre el jardinero y 3ra base, manteniendo comunicación con el 3B para el corte."',
    aiEvaluation: 'Geometría defensiva y posicionamiento espacial impecable.',
    isCompleted: true,
    hasAudio: true,
  },
  {
    id: 'ch-8',
    code: 'RETO 08',
    category: '3. LECTURA DE SITUACIONES',
    question: 'Pitcher rival mostrando tendencia a tirar curva en 1-1. ¿Cuál es tu enfoque en la caja de bateo?',
    playerResponseSample: '"Buscar la rompiente alta o esperar la recta en mi zona de contacto preferida sin perseguir envíos fuera de balance."',
    aiEvaluation: 'Madurez en el plan de juego y control de la zona de strike.',
    isCompleted: true,
    hasAudio: true,
  }
];

export function BaseballIqFlowView({ player, onUpdatePlayer }: BaseballIqFlowViewProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('setup');

  // Setup Form State
  const [fullName, setFullName] = useState(player?.fullName || 'Bryan Andres Granados');
  const [email, setEmail] = useState('b.granados@email.com');
  const [authCode, setAuthCode] = useState('812492');
  const [position, setPosition] = useState(player?.position ? `${player.position}` : 'Campo Corto (SS)');
  const [skillLevel, setSkillLevel] = useState('Intermedio');
  const [throwArm, setThrowArm] = useState(player?.throws === 'L' ? 'Izquierda (LHP)' : 'Derecha (RHP)');
  const [batSide, setBatSide] = useState(player?.bats === 'L' ? 'Izquierda' : player?.bats === 'S' ? 'Ambidiestro' : 'Derecha');

  // Device check states
  const [hasPdfUploaded, setHasPdfUploaded] = useState(true);
  const [hasFacialScan, setHasFacialScan] = useState(true);
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micTestSuccess, setMicTestSuccess] = useState(true);
  const [micTestProgress, setMicTestProgress] = useState(100);
  const [showIndicationsModal, setShowIndicationsModal] = useState(false);

  // Assessment State
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [timeRemaining, setTimeRemaining] = useState<number>(3578); // ~59 mins in seconds
  const [activeRecordingId, setActiveRecordingId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Timer effect
  useEffect(() => {
    if (currentStep !== 'assessment') return;
    const interval = setInterval(() => {
      setTimeRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStep]);

  // Mic test handler
  const handleTestMic = () => {
    setIsTestingMic(true);
    setMicTestProgress(0);
    setMicTestSuccess(false);

    let current = 0;
    const interval = setInterval(() => {
      current += 33;
      if (current >= 100) {
        clearInterval(interval);
        setMicTestProgress(100);
        setIsTestingMic(false);
        setMicTestSuccess(true);
      } else {
        setMicTestProgress(current);
      }
    }, 1000);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completedCount = challenges.filter(c => c.isCompleted).length;

  const toggleChallengeCheck = (id: string) => {
    setChallenges(prev =>
      prev.map(c => (c.id === id ? { ...c, isCompleted: !c.isCompleted } : c))
    );
  };

  const handleStartRecording = (id: string) => {
    if (activeRecordingId === id) {
      // Stop recording
      setActiveRecordingId(null);
      setChallenges(prev =>
        prev.map(c => (c.id === id ? { ...c, isCompleted: true, hasAudio: true, isRecording: false } : c))
      );
    } else {
      setActiveRecordingId(id);
      setChallenges(prev =>
        prev.map(c => (c.id === id ? { ...c, isRecording: true } : { ...c, isRecording: false }))
      );
    }
  };

  const handlePlayAudio = (id: string) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      setTimeout(() => {
        setPlayingAudioId(null);
      }, 3500);
    }
  };

  return (
    <div className="w-full space-y-6 max-w-7xl mx-auto pb-12">
      {/* Flow Switcher Navigation Strip */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            B-IQ
          </div>
          <span className="font-bold text-slate-800 text-sm">Flujo de Evaluación Baseball IQ</span>
        </div>

        {/* Step Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setCurrentStep('setup')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              currentStep === 'setup'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Inicio y Configuración
          </button>
          <button
            type="button"
            onClick={() => setCurrentStep('assessment')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              currentStep === 'assessment'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Desafíos de Juego ({completedCount}/8)
          </button>
          <button
            type="button"
            onClick={() => setCurrentStep('report')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              currentStep === 'report'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Reporte Scouting IA
          </button>
        </div>
      </div>

      {/* =========================================================================
          SCREEN 1: SETUP & ONBOARDING (Optimized Viewport Layout)
         ========================================================================= */}
      {currentStep === 'setup' && (
        <div className="flex flex-col items-center justify-center pt-2 sm:pt-4 px-2">
          {/* Main Form Card */}
          <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-slate-100 p-5 sm:p-7 shadow-xl shadow-slate-200/50">
            {/* Top-left lightbulb interactive button */}
            <button
              type="button"
              onClick={() => setShowIndicationsModal(true)}
              className="absolute -top-3.5 -left-3.5 sm:-top-4 sm:-left-4 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 hover:bg-blue-100/90 border border-blue-200/80 flex items-center justify-center shadow-md text-blue-600 hover:text-blue-700 transition-all cursor-pointer group hover:scale-105 active:scale-95"
              title="Ver indicaciones y recomendaciones para el test"
            >
              <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-bounce" />
              <span className="sr-only">Indicaciones del test</span>
            </button>

            <div className="space-y-4 sm:space-y-5">
              {/* SECTION 1: DATOS DEL JUGADOR */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    DATOS DEL JUGADOR
                  </span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3">
                  <div className="md:col-span-5 bg-slate-50/90 rounded-xl p-2.5 border border-slate-100">
                    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                      NOMBRE COMPLETO
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Ej. Garibaldi Russo"
                      className="w-full bg-transparent font-bold text-slate-800 text-xs sm:text-sm focus:outline-hidden"
                    />
                  </div>

                  <div className="md:col-span-5 bg-slate-50/90 rounded-xl p-2.5 border border-slate-100">
                    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                      CORREO ELECTRÓNICO
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="resultados@ejemplo.com"
                      className="w-full bg-transparent font-medium text-slate-800 text-xs sm:text-sm focus:outline-hidden"
                    />
                  </div>

                  <div className="md:col-span-2 bg-slate-50/90 rounded-xl p-2.5 border border-slate-100">
                    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                      CÓDIGO
                    </label>
                    <div className="font-mono font-bold text-slate-800 text-xs sm:text-sm">
                      {authCode}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: ESPECIFICACIONES TÉCNICAS */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    ESPECIFICACIONES TÉCNICAS
                  </span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5">
                  {/* Posición */}
                  <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-100">
                    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                      POSICIÓN
                    </label>
                    <select
                      value={position}
                      onChange={e => setPosition(e.target.value)}
                      className="w-full bg-transparent font-bold text-slate-800 text-xs sm:text-sm focus:outline-hidden cursor-pointer"
                    >
                      <option value="Campo Corto (SS)">Campo Corto (SS)</option>
                      <option value="Lanzador (RHP/LHP)">Lanzador</option>
                      <option value="Receptor (C)">Receptor (C)</option>
                      <option value="Segunda Base (2B)">Segunda Base (2B)</option>
                      <option value="Tercera Base (3B)">Tercera Base (3B)</option>
                      <option value="Jardinero (OF)">Jardinero (OF)</option>
                    </select>
                  </div>

                  {/* Nivel de Juego */}
                  <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-100">
                    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                      NIVEL DE JUEGO
                    </label>
                    <select
                      value={skillLevel}
                      onChange={e => setSkillLevel(e.target.value)}
                      className="w-full bg-transparent font-bold text-slate-800 text-xs sm:text-sm focus:outline-hidden cursor-pointer"
                    >
                      <option value="Intermedio">Intermedio</option>
                      <option value="Avanzado">Avanzado</option>
                      <option value="Prospecto Élite">Prospecto Élite</option>
                      <option value="Profesional">Profesional</option>
                    </select>
                  </div>

                  {/* Lanzar */}
                  <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-100">
                    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                      LANZAR
                    </label>
                    <select
                      value={throwArm}
                      onChange={e => setThrowArm(e.target.value)}
                      className="w-full bg-transparent font-bold text-slate-800 text-xs sm:text-sm focus:outline-hidden cursor-pointer"
                    >
                      <option value="Derecha (RHP)">Derecha (RHP)</option>
                      <option value="Izquierda (LHP)">Izquierda (LHP)</option>
                    </select>
                  </div>

                  {/* Batear */}
                  <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-100">
                    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                      BATEAR
                    </label>
                    <select
                      value={batSide}
                      onChange={e => setBatSide(e.target.value)}
                      className="w-full bg-transparent font-bold text-slate-800 text-xs sm:text-sm focus:outline-hidden cursor-pointer"
                    >
                      <option value="Derecha">Derecha</option>
                      <option value="Izquierda">Izquierda</option>
                      <option value="Ambidiestro">Ambidiestro</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: IDENTIDAD & ROSTRO */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                  {/* Identidad */}
                  <div>
                    <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      IDENTIDAD
                    </span>
                    <div
                      onClick={() => setHasPdfUploaded(!hasPdfUploaded)}
                      className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
                        hasPdfUploaded
                          ? 'border-emerald-300 bg-emerald-50/60 text-emerald-800'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2 text-xs font-semibold">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{hasPdfUploaded ? 'Documento PDF Validado' : 'Subir PDF'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rostro */}
                  <div>
                    <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      ROSTRO
                    </span>
                    <div
                      onClick={() => setHasFacialScan(!hasFacialScan)}
                      className={`border rounded-xl p-3 text-center cursor-pointer transition-all flex items-center justify-center gap-2 text-xs font-semibold ${
                        hasFacialScan
                          ? 'border-blue-300 bg-blue-50/70 text-blue-700'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{hasFacialScan ? 'Escaneo Facial Completado' : 'Escaneo Facial'}</span>
                    </div>
                  </div>
                </div>

                {/* Mic test bar */}
                <div className="mt-3 flex flex-col sm:flex-row items-center gap-2.5 bg-slate-50/70 p-2 sm:p-2.5 rounded-xl border border-slate-100">
                  <button
                    type="button"
                    onClick={handleTestMic}
                    disabled={isTestingMic}
                    className="px-4 py-2 rounded-full bg-[#2b4c9b] hover:bg-[#203a7a] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <Mic className={`w-3.5 h-3.5 ${isTestingMic ? 'animate-pulse text-amber-300' : ''}`} />
                    <span>{isTestingMic ? 'Validando...' : 'Probar Mic'}</span>
                  </button>

                  <div className="flex-1 w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        micTestSuccess ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${micTestProgress}%` }}
                    />
                  </div>

                  <span className="text-[11px] font-medium text-slate-500 shrink-0">
                    {micTestSuccess ? '✓ Audio validado' : 'Habla 3 seg. para validar audio.'}
                  </span>
                </div>
              </div>

              {/* Start Button */}
              <div className="pt-2 text-center space-y-1">
                <button
                  type="button"
                  onClick={() => setCurrentStep('assessment')}
                  className="w-full sm:w-72 py-3 px-6 rounded-full bg-[#2b4c9b] hover:bg-[#1e3a8a] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 mx-auto hover:scale-102 active:scale-98"
                >
                  <span>COMENZAR EVALUACIÓN</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-slate-400">
                  Al iniciar, confirmas tu entorno adecuado.
                </p>
              </div>
            </div>
          </div>

          {/* INDICACIONES DEL TEST MODAL */}
          {showIndicationsModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <h3 className="font-extrabold text-[#1e2e65] text-base tracking-tight uppercase">
                      INDICACIONES DEL TEST
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowIndicationsModal(false)}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Recommendations list matching image */}
                <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
                  {/* ID */}
                  <div className="flex items-start gap-3.5 p-2.5 rounded-2xl hover:bg-slate-50/80 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">ID:</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Sube el PDF de tu documento con foto legible.
                      </p>
                    </div>
                  </div>

                  {/* Cámara */}
                  <div className="flex items-start gap-3.5 p-2.5 rounded-2xl hover:bg-slate-50/80 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Cámara:</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Uso obligatorio para validación.
                      </p>
                    </div>
                  </div>

                  {/* Micrófono */}
                  <div className="flex items-start gap-3.5 p-2.5 rounded-2xl hover:bg-slate-50/80 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Micrófono:</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Hardware de calidad para respuestas.
                      </p>
                    </div>
                  </div>

                  {/* Silencio */}
                  <div className="flex items-start gap-3.5 p-2.5 rounded-2xl hover:bg-slate-50/80 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <VolumeX className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Silencio:</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Evita ruidos externos durante el test.
                      </p>
                    </div>
                  </div>

                  {/* Pronunciación */}
                  <div className="flex items-start gap-3.5 p-2.5 rounded-2xl hover:bg-slate-50/80 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Pronunciación:</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Habla claro para asegurar que la IA te entienda.
                      </p>
                    </div>
                  </div>

                  {/* Conexión */}
                  <div className="flex items-start gap-3.5 p-2.5 rounded-2xl hover:bg-slate-50/80 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Radio className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Conexión:</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Verifica tu señal antes de iniciar.
                      </p>
                    </div>
                  </div>

                  {/* Naturalidad */}
                  <div className="flex items-start gap-3.5 p-2.5 rounded-2xl hover:bg-emerald-50/50 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Naturalidad:</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Tenemos en cuenta tu espontaneidad y honestidad.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowIndicationsModal(false)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                  >
                    Entendido, continuar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SCREEN 2: ASSESSMENT / DESAFÍOS DE INTELIGENCIA TÁCTICA
         ========================================================================= */}
      {currentStep === 'assessment' && (
        <div className="space-y-6">
          {/* Top Bar Header */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-[#1e2e65] tracking-tight">
                Desafíos de Inteligencia Táctica
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Graba tus respuestas tácticas y usa el check para marcar tus avances. Escucha cada grabación antes de entregar.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{formatTimer(timeRemaining)}</span>
              </div>

              <div className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                Posición: {position.split(' ')[0]}
              </div>
            </div>
          </div>

          {/* Section Sub-header */}
          <div className="flex items-center gap-2 px-1">
            <FileText className="w-4 h-4 text-blue-600" />
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider">
              1. FUNDAMENTOS Y REGLAS (4 RETOS)
            </h3>
          </div>

          {/* Challenges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {challenges.slice(0, 4).map(challenge => (
              <div
                key={challenge.id}
                className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between space-y-4 shadow-sm ${
                  challenge.isCompleted
                    ? 'border-slate-200/90 shadow-slate-200/50'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider">
                      {challenge.code}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleChallengeCheck(challenge.id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                        challenge.isCompleted
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 hover:border-slate-400 bg-white'
                      }`}
                    >
                      {challenge.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  </div>

                  <p className="font-bold text-slate-800 text-xs leading-relaxed">
                    {challenge.question}
                  </p>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={() => handleStartRecording(challenge.id)}
                    className={`flex-1 py-2 px-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      challenge.isRecording
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{challenge.isRecording ? 'GRABANDO...' : 'GRABAR'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePlayAudio(challenge.id)}
                    disabled={!challenge.hasAudio}
                    className={`flex-1 py-2 px-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      playingAudioId === challenge.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : challenge.hasAudio
                        ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                        : 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100'
                    }`}
                  >
                    <Play className={`w-3 h-3 ${playingAudioId === challenge.id ? 'fill-current' : ''}`} />
                    <span>REVISAR</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Section 2 Sub-header */}
          <div className="flex items-center gap-2 px-1 pt-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider">
              2. ESCENARIOS SITUACIONALES Y PRESIÓN
            </h3>
          </div>

          {/* Challenges Grid 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {challenges.slice(4, 8).map(challenge => (
              <div
                key={challenge.id}
                className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between space-y-4 shadow-sm ${
                  challenge.isCompleted
                    ? 'border-slate-200/90 shadow-slate-200/50'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider">
                      {challenge.code}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleChallengeCheck(challenge.id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                        challenge.isCompleted
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 hover:border-slate-400 bg-white'
                      }`}
                    >
                      {challenge.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  </div>

                  <p className="font-bold text-slate-800 text-xs leading-relaxed">
                    {challenge.question}
                  </p>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={() => handleStartRecording(challenge.id)}
                    className={`flex-1 py-2 px-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      challenge.isRecording
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{challenge.isRecording ? 'GRABANDO...' : 'GRABAR'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePlayAudio(challenge.id)}
                    disabled={!challenge.hasAudio}
                    className={`flex-1 py-2 px-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      playingAudioId === challenge.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : challenge.hasAudio
                        ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                        : 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100'
                    }`}
                  >
                    <Play className={`w-3 h-3 ${playingAudioId === challenge.id ? 'fill-current' : ''}`} />
                    <span>REVISAR</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Floating Bar */}
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md px-6 py-3 rounded-full border border-blue-200/80 shadow-2xl flex items-center gap-6">
            <div className="text-left hidden sm:block">
              <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                PROGRESO SESIÓN
              </span>
              <span className="text-xs font-bold text-slate-800">
                {completedCount} de 20 completadas
              </span>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep('report')}
              className="px-6 py-2.5 rounded-full bg-[#2b4c9b] hover:bg-[#1f3873] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer hover:scale-105"
            >
              <span>FINALIZAR EVALUACIÓN</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-700/60 text-[10px] font-mono">
                {completedCount}/20
              </span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN 3, 4, 5, 6: SCOUTING & AI EVALUATION REPORT
         ========================================================================= */}
      {currentStep === 'report' && (
        <div className="space-y-6">
          {/* Header Card (Image 3) */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-[#1e2e65] tracking-tight">
                  {fullName}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Evaluación Scouting IA • 25 Feb 2026 • 10:04 AM
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-slate-600">
                  <span><strong>Posición:</strong> {position}</span>
                  <span><strong>Nivel:</strong> {skillLevel}</span>
                  <span><strong>Lanzar / Batear:</strong> R / R</span>
                  <span><strong>Email:</strong> {email}</span>
                </div>
              </div>

              <div className="text-right flex flex-col items-start sm:items-end gap-1">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-mono font-bold text-xs border border-blue-100">
                  ID: #GPT-2026-X4
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  VERIF: {authCode}
                </span>
              </div>
            </div>
          </div>

          {/* Radar & Competencies Row (Image 3) */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Radar Chart */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#1e2e65]">
                  Análisis radar de IQ táctico
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Balance de competencias técnicas detectadas durante la evaluación multimodal.
                </p>
              </div>

              {/* Custom SVG Radar Visualization */}
              <div className="my-6 flex items-center justify-center">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72">
                  <svg viewBox="0 0 300 300" className="w-full h-full">
                    {/* Background Polygons (5 layers) */}
                    {[0.2, 0.4, 0.6, 0.8, 1.0].map((ratio, idx) => (
                      <polygon
                        key={idx}
                        points="150,30 264,113 220,247 80,247 36,113"
                        transform={`scale(${ratio}) translate(${150 * (1 - ratio) / ratio}, ${150 * (1 - ratio) / ratio})`}
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Axis lines */}
                    <line x1="150" y1="150" x2="150" y2="30" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="150" y1="150" x2="264" y2="113" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="150" y1="150" x2="220" y2="247" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="150" y1="150" x2="80" y2="247" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="150" y1="150" x2="36" y2="113" stroke="#cbd5e1" strokeDasharray="3 3" />

                    {/* Data Polygon: [Fundamentos: 85%, Defensa: 88%, Ofensiva: 78%, Situacional: 90%, Presión: 72%] */}
                    <polygon
                      points="150,48 250,117 205,225 92,237 48,124"
                      fill="#3b82f6"
                      fillOpacity="0.2"
                      stroke="#2563eb"
                      strokeWidth="2.5"
                    />

                    {/* Data Points */}
                    <circle cx="150" cy="48" r="4" fill="#1d4ed8" />
                    <circle cx="250" cy="117" r="4" fill="#1d4ed8" />
                    <circle cx="205" cy="225" r="4" fill="#1d4ed8" />
                    <circle cx="92" cy="237" r="4" fill="#1d4ed8" />
                    <circle cx="48" cy="124" r="4" fill="#1d4ed8" />

                    {/* Axis Labels */}
                    <text x="150" y="20" textAnchor="middle" fill="#1e3a8a" fontSize="10" fontWeight="bold">FUNDAMENTOS</text>
                    <text x="270" y="115" textAnchor="start" fill="#1e3a8a" fontSize="10" fontWeight="bold">DEFENSA</text>
                    <text x="225" y="265" textAnchor="middle" fill="#1e3a8a" fontSize="10" fontWeight="bold">OFENSIVA</text>
                    <text x="75" y="265" textAnchor="middle" fill="#1e3a8a" fontSize="10" fontWeight="bold">SITUACIONAL</text>
                    <text x="30" y="115" textAnchor="end" fill="#1e3a8a" fontSize="10" fontWeight="bold">PRESIÓN</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Right: Distribution of Competencies & Observance Note */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-4">
                  DISTRIBUCIÓN DE COMPETENCIAS
                </span>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <span>Fundamentos y Reglas</span>
                      <span className="text-blue-600 font-mono">85%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#2b4c9b] h-full rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <span>Ejecución bajo Presión</span>
                      <span className="text-blue-600 font-mono">72%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#2b4c9b] h-full rounded-full" style={{ width: '72%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <span>Lectura de Situaciones</span>
                      <span className="text-blue-600 font-mono">90%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#2b4c9b] h-full rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Observance Note Card */}
              <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-xs">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Nota de Observancia</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  El jugador demuestra una madurez táctica superior para su nivel, especialmente en la lectura de situaciones defensivas complejas y la toma de decisiones bajo conteos desfavorables. Su perfil neuro-emocional revela una notable capacidad para procesar escenarios de alta carga cognitiva.
                </p>
              </div>
            </div>
          </div>

          {/* Neuro-Emotional Analysis (Image 4) */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-[#1e2e65]">
                  Análisis neuro-emocional
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mapeo profundo de micro-gestos, prosodia y semántica durante la evaluación.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-semibold self-start sm:self-auto">
                Motor: Hume AI v3.0
              </span>
            </div>

            {/* 6 Metric Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Determinación */}
              <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-800 text-sm">Determinación</span>
                    <span className="text-blue-600 font-mono font-bold text-sm">92%</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Detecta la fuerza de convicción en la voz y firmeza facial. Un nivel alto (como el 92% actual) sugiere un jugador con autoridad que no duda al ejecutar órdenes tácticas.
                  </p>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              {/* Compromiso */}
              <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-800 text-sm">Compromiso (Engagement)</span>
                    <span className="text-blue-600 font-mono font-bold text-sm">85%</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Mide la conexión emocional y el enfoque atencional. Bryan muestra una alta inmersión mental, lo que reduce la probabilidad de errores por distracción en el campo.
                  </p>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              {/* Liderazgo / Empatía */}
              <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-800 text-sm">Liderazgo/Empatía</span>
                    <span className="text-blue-600 font-mono font-bold text-sm">78%</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Evalúa la capacidad de entender dinámicas grupales a través del tono verbal. Indica un jugador capaz de comunicarse eficazmente con sus compañeros en el dugout.
                  </p>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '78%' }} />
                </div>
              </div>

              {/* Triunfo / Orgullo */}
              <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-800 text-sm">Triunfo / Orgullo</span>
                    <span className="text-blue-600 font-mono font-bold text-sm">65%</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Analiza la respuesta emocional tras el éxito. Un nivel equilibrado (65%) sugiere una autoconfianza saludable sin caer en la arrogancia competitiva o falta de autocrítica.
                  </p>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '65%' }} />
                </div>
              </div>

              {/* Resiliencia Táctica */}
              <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-800 text-sm">Resiliencia Táctica</span>
                    <span className="text-blue-600 font-mono font-bold text-sm">82%</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Mide la velocidad de recuperación emocional (retorno a estado 'Calm') tras un momento de alta tensión o duda técnica durante la prueba de scouting.
                  </p>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '82%' }} />
                </div>
              </div>

              {/* Seguridad general */}
              <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-800 text-sm">Seguridad general</span>
                    <span className="text-blue-600 font-mono font-bold text-sm">88%</span>
                  </div>

                  {/* Micro comparison bars */}
                  <div className="flex items-end gap-2 h-10 py-1 mb-2">
                    <div className="w-8 bg-blue-700 h-7 rounded-sm" title="Confianza Estable" />
                    <div className="w-8 bg-blue-700 h-9 rounded-sm" title="Foco" />
                    <div className="w-8 bg-blue-700 h-10 rounded-sm" title="Voz Firme" />
                    <div className="w-8 bg-blue-700 h-4 rounded-sm" title="Fluctuación" />
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-xs bg-blue-700" /> CONFIANZA ESTABLE
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-xs bg-slate-300" /> PUNTO DE ANÁLISIS
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-normal">
                    Integración multimodal de <strong>micro-expresiones</strong> y <strong>prosodia vocal</strong>. Monitoriza la fluctuación de la firmeza del jugador segundo a segundo.
                  </p>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis (Image 5) */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-[#1e2e65]">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-bold">Análisis de IA</h3>
            </div>

            {/* Resumen General Detallado */}
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1.5">
                Resumen General Detallado
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bryan demuestra una madurez táctica superior para su edad, lo cual es validado por la consistencia en su toma de decisiones durante los 24 desafíos técnicos. Sus respuestas reflejan un conocimiento sólido de las situaciones de relevo y posicionamiento defensivo avanzado. El análisis neuro-emocional confirma que su prosodia (voz) mantiene niveles de calma estables incluso en escenarios de máxima presión simulada, lo que garantiza una ejecución técnica limpia en momentos críticos del juego.
              </p>
            </div>

            {/* 2 Column Cards: Fortalezas vs Áreas de Optimización */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Fortalezas Técnicas y Mentales */}
              <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-100 space-y-4">
                <h4 className="font-bold text-blue-900 text-sm">
                  Fortalezas Técnicas y Mentales
                </h4>

                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">Lógica rápida:</strong> Capacidad de procesar variables de corredores y outs en menos de 1.5s.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">Estabilidad Emocional:</strong> Mantiene el enfoque táctico tras recibir feedback de error.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">Dominio de Reglas:</strong> Entendimiento profundo de situaciones complejas (Infield Fly, Regla de Bonos).
                    </div>
                  </li>
                </ul>
              </div>

              {/* Áreas de Optimización */}
              <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-100 space-y-4">
                <h4 className="font-bold text-blue-900 text-sm">
                  Áreas de Optimización
                </h4>

                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">Velocidad de Respuesta:</strong> Podría reducir el tiempo de verbalización en jugadas de doble play.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Volume2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">Comunicación Proactiva:</strong> Incrementar el mando verbal hacia los jardineros en flies divididos.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <RefreshCw className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">Recuperación Post-Error:</strong> Trabajar en la técnica de "Siguiente Pitcheo" para mitigar picos de tensión residual.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Technical Evaluation Detail Table (Image 6) */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-[#1e2e65]">
                  Detalle Técnico de Evaluación (24 Desafíos Completados)
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-mono font-bold text-xs border border-blue-100">
                  ID: #GPT-2026-X4
                </span>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar Datos</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold">
                    <th className="py-3 px-4 w-5/12">Escenario / Pregunta IA</th>
                    <th className="py-3 px-4 w-4/12">Respuesta del Jugador</th>
                    <th className="py-3 px-4 w-3/12">Evaluación de IA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {/* Category header */}
                  <tr className="bg-slate-50/50">
                    <td colSpan={3} className="py-2.5 px-4 font-black text-blue-700 uppercase tracking-wider text-[11px]">
                      1. FUNDAMENTOS Y REGLAS
                    </td>
                  </tr>

                  {challenges.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Column 1: Audio play + question */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(row.id)}
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                              playingAudioId === row.id
                                ? 'bg-blue-600 text-white animate-pulse'
                                : 'bg-[#2b4c9b] hover:bg-blue-700 text-white'
                            }`}
                            title="Reproducir pregunta"
                          >
                            <Play className="w-3 h-3 fill-current ml-0.5" />
                          </button>
                          <span className="font-semibold text-slate-800 leading-relaxed">
                            "{row.question}"
                          </span>
                        </div>
                      </td>

                      {/* Column 2: Player response audio + quote */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(row.id)}
                            className="w-7 h-7 rounded-full border border-blue-200 hover:bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer"
                            title="Reproducir audio del jugador"
                          >
                            <Play className="w-3 h-3 ml-0.5" />
                          </button>
                          <span className="text-slate-600 italic leading-relaxed">
                            {row.playerResponseSample}
                          </span>
                        </div>
                      </td>

                      {/* Column 3: AI Evaluation */}
                      <td className="py-4 px-4 align-top text-slate-700 leading-relaxed font-medium">
                        {row.aiEvaluation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Restart or New Assessment Button */}
            <div className="pt-4 flex justify-between items-center border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep('setup')}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Configurar Nueva Evaluación</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep('assessment')}
                className="px-5 py-2.5 rounded-xl bg-[#2b4c9b] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Volver a Desafíos</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
