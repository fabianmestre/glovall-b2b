import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Bot,
  Brain,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Filter,
  Flame,
  Globe,
  Headphones,
  HelpCircle,
  Info,
  Layers,
  Lightbulb,
  Maximize2,
  MessageSquare,
  Mic,
  Pause,
  Play,
  Radio,
  RotateCcw,
  Search,
  Send,
  Share2,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  User,
  UserCheck,
  Video,
  Volume2,
  X,
  Zap
} from 'lucide-react';
import {
  LIBRARY_COURSES,
  LIBRARY_DOCUMENTS,
  LIBRARY_PODCASTS,
  LibraryCourse,
  LibraryDocument,
  LibraryPodcast,
  MLB_PLAY_ANALYSES,
  MlbPlayAnalysis,
  TECH_PARTNERS,
  TechPartner
} from '../../data/libraryData';
import { Player } from '../../types';

interface BibliotecaViewProps {
  player?: Player;
  onOpenRadioPelota?: () => void;
  onUpdatePlayer?: (updated: Player) => void;
}

export function BibliotecaView({
  player,
  onOpenRadioPelota,
  onUpdatePlayer,
}: BibliotecaViewProps) {
  // Main Tab State
  const [activeMainTab, setActiveMainTab] = useState<'podcast' | 'documentos' | 'video-analisis' | 'cursos' | 'aliados'>('podcast');

  // ==========================================
  // 0. STATE FOR "VIDEO ANÁLISIS MLB" TAB
  // ==========================================
  const [mlbPlayFilter, setMlbPlayFilter] = useState<string>('Todos');
  const [selectedMlbPlayModal, setSelectedMlbPlayModal] = useState<MlbPlayAnalysis | null>(null);
  const [isPlayingMlbVideo, setIsPlayingMlbVideo] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [videoTimelineSec, setVideoTimelineSec] = useState<number>(45);

  // ==========================================
  // 1. STATE FOR "DOCUMENTOS" TAB
  // ==========================================
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    Scouting: true,
    Académico: false,
    Biomecánica: false,
    'Salud & Nutrición': false,
    Psicología: false,
  });
  const [selectedDocId, setSelectedDocId] = useState<string>('doc-scout-01');

  // AI Chat Assistant for Documents
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Analizando Reporte Bateo.pdf. ¿Preguntas?',
      time: '09:30 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // ==========================================
  // 2. STATE FOR "PODCAST" TAB
  // ==========================================
  const [podcastFilterCategory, setPodcastFilterCategory] = useState<string>('Todos');
  const [currentPlayingPodcastId, setCurrentPlayingPodcastId] = useState<string | null>(null);
  const [isPodcastPlaying, setIsPodcastPlaying] = useState<boolean>(false);
  const [selectedPodcastModal, setSelectedPodcastModal] = useState<LibraryPodcast | null>(null);

  // ==========================================
  // 3. STATE FOR "CURSOS" TAB
  // ==========================================
  const [courseCategoryFilter, setCourseCategoryFilter] = useState<string>('Todas las Categorías');
  const [selectedCourseModal, setSelectedCourseModal] = useState<LibraryCourse | null>(null);

  // ==========================================
  // 4. STATE FOR "ALIADOS" TAB
  // ==========================================
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('partner-trackman');
  const [selectedVideoModal, setSelectedVideoModal] = useState<{
    partner: TechPartner;
    video: TechPartner['videos'][0];
  } | null>(null);

  // Helpers
  const selectedDoc = LIBRARY_DOCUMENTS.find((d) => d.id === selectedDocId) || LIBRARY_DOCUMENTS[0];
  const activePartner = TECH_PARTNERS.find((p) => p.id === selectedPartnerId) || TECH_PARTNERS[0];

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  // Handle Document Selection
  const handleSelectDocument = (doc: LibraryDocument) => {
    setSelectedDocId(doc.id);
    setChatMessages([
      {
        sender: 'ai',
        text: `Analizando **${doc.name}**. ¿Preguntas?`,
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // AI Chat Submit Handler
  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || chatInput).trim();
    if (!query) return;

    const userMsg = {
      sender: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput('');
    setIsAiTyping(true);

    setTimeout(() => {
      let aiResponseText = '';
      const lowerQ = query.toLowerCase();

      if (lowerQ.includes('exit velo') || lowerQ.includes('velocidad')) {
        aiResponseText = `Según el reporte, tu velocidad máxima es de **${selectedDoc.metricsAnalysis?.exitVeloMax || 98.4} MPH** con un promedio de ${selectedDoc.metricsAnalysis?.exitVeloAvg || 90.2} MPH. Para maximizar el poder hacia la banda contraria, enfócate en retrasar la rotación de los hombros y golpear la bola en la mitad interna.`;
      } else if (lowerQ.includes('spray') || lowerQ.includes('campo') || lowerQ.includes('banda')) {
        aiResponseText = `Tu Spray Chart indica que el **52% de tus conexiones sólidas van al Pull**. Los scouts valoran la habilidad de batear hacia el Right-Center; te recomendamos drills de 'inside-out' y dejar viajar los pitcheos en la zona externa.`;
      } else if (lowerQ.includes('slider') || lowerQ.includes('rompiente') || lowerQ.includes('zona')) {
        aiResponseText = `En conteos de 2 strikes tu Chase Rate sube a 28% ante lanzamientos rompientes afuera. Trabaja en la lectura temprana del punto de rotación ("Red Dot") y mantén el peso en la pierna trasera.`;
      } else {
        aiResponseText = `Excelente consulta sobre **${selectedDoc.name}**. El análisis técnico de Glovall EdTech sugiere enfocar la siguiente sesión en repeticiones de alta velocidad en el tee y lectura de video en cámara lenta (60fps) para perfeccionar la secuencia cinemática.`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai' as const,
          text: aiResponseText,
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsAiTyping(false);
    }, 900);
  };

  // Filtered Courses
  const filteredCourses = LIBRARY_COURSES.filter((course) => {
    if (courseCategoryFilter === 'Todas las Categorías') return true;
    return course.categoryFilter.toLowerCase() === courseCategoryFilter.toLowerCase();
  });

  // Filtered MLB Play Analyses
  const filteredMlbPlays = MLB_PLAY_ANALYSES.filter((play) => {
    if (mlbPlayFilter === 'Todos') return true;
    return play.playType.toLowerCase().includes(mlbPlayFilter.toLowerCase());
  });

  // Filtered Podcasts
  const filteredPodcasts = LIBRARY_PODCASTS.filter((pod) => {
    if (podcastFilterCategory === 'Todos') return true;
    return pod.category === podcastFilterCategory;
  });

  const handleTogglePlayPodcast = (pod: LibraryPodcast) => {
    if (currentPlayingPodcastId === pod.id) {
      setIsPodcastPlaying(!isPodcastPlaying);
    } else {
      setCurrentPlayingPodcastId(pod.id);
      setIsPodcastPlaying(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP NAVBAR / HEADER */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs px-6 py-0 flex items-center justify-between overflow-x-auto">
        <nav className="flex space-x-8 min-w-max">
          {/* 1. PODCAST */}
          <button
            type="button"
            onClick={() => setActiveMainTab('podcast')}
            className={`py-4 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === 'podcast'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Podcast</span>
          </button>

          {/* 2. DOCUMENTOS */}
          <button
            type="button"
            onClick={() => setActiveMainTab('documentos')}
            className={`py-4 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === 'documentos'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Documentos</span>
          </button>

          {/* 3. VIDEO ANÁLISIS */}
          <button
            type="button"
            onClick={() => setActiveMainTab('video-analisis')}
            className={`py-4 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === 'video-analisis'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Análisis</span>
          </button>

          {/* 4. CURSOS */}
          <button
            type="button"
            onClick={() => setActiveMainTab('cursos')}
            className={`py-4 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === 'cursos'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Cursos</span>
          </button>

          {/* 5. ALIADOS */}
          <button
            type="button"
            onClick={() => setActiveMainTab('aliados')}
            className={`py-4 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === 'aliados'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <span>Aliados</span>
          </button>
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">
            {player?.fullName || 'Yoan Mendoza'} • Baseball IQ: <strong className="text-blue-600">{player?.edTech?.baseballIqScore || 88}%</strong>
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 0: VIDEO ANÁLISIS MLB (Simulador & Desglose Táctico Glovall) */}
      {/* ========================================================================= */}
      {activeMainTab === 'video-analisis' && (
        <div className="space-y-6">
          {/* Header Banner & Filters */}
          <div className="p-6 rounded-3xl bg-linear-to-r from-[#111e48] via-[#1b2c68] to-[#1e3a8a] text-white shadow-lg relative overflow-hidden">
            {/* Background graphic accents */}
            <div className="absolute right-0 top-0 w-96 h-full opacity-10 pointer-events-none flex items-center justify-end pr-10">
              <Video className="w-80 h-80 text-white" />
            </div>

            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                <span>Exclusivo para Atletas Glovall • Banco Táctico MLB</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Video Análisis de Jugadas MLB
              </h1>

              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                Estudio táctico y biomecánico de las mejores jugadas de Grandes Ligas realizado por el staff técnico de Glovall. Analiza la toma de decisiones, telemetría de Statcast y patrones de movimiento de las estrellas mundiales.
              </p>

              {/* Tag filters bar */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {['Todos', 'Bateo', 'Defensa Infield', 'Fildeo Outfield', 'Pitcheo & Túnel', 'Corrido de Bases', 'Baseball IQ'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setMlbPlayFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      mlbPlayFilter === cat
                        ? 'bg-white text-blue-900 shadow-md scale-102'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Video Plays Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMlbPlays.map((play) => (
              <div
                key={play.id}
                onClick={() => setSelectedMlbPlayModal(play)}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer hover:-translate-y-1"
              >
                {/* Video Preview Thumbnail with Telemetry HUD Overlay */}
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={play.thumbnail}
                    alt={play.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Play Button Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-13 h-13 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-115 group-hover:bg-blue-600 transition-all">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-600/90 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                      {play.playType}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                      {play.teamBadge}
                    </span>
                  </div>

                  {/* Top Right IQ Score */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-emerald-500/90 backdrop-blur-xs text-white text-xs font-black shadow-xs flex items-center gap-1">
                    <Brain className="w-3.5 h-3.5" />
                    <span>{play.glovallIqScore} IQ</span>
                  </div>

                  {/* Bottom Strip: Duration & Matchup */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-bold text-[11px] truncate text-slate-200 max-w-[70%]">
                      {play.mlbStar}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/80 font-mono text-[10px] font-bold">
                      {play.duration}
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {play.gameMatchup}
                    </span>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                      {play.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {play.analysisSummary}
                    </p>
                  </div>

                  {/* Telemetry Metrics Pill Grid */}
                  <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <div>
                      <span className="text-[9px] font-bold uppercase text-slate-400 block truncate">
                        {play.telemetryMetrics.label1}
                      </span>
                      <span className="text-xs font-black text-slate-800">
                        {play.telemetryMetrics.val1}
                      </span>
                    </div>

                    <div className="border-x border-slate-200/60">
                      <span className="text-[9px] font-bold uppercase text-slate-400 block truncate">
                        {play.telemetryMetrics.label2}
                      </span>
                      <span className="text-xs font-black text-blue-600">
                        {play.telemetryMetrics.val2}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] font-bold uppercase text-slate-400 block truncate">
                        {play.telemetryMetrics.label3}
                      </span>
                      <span className="text-xs font-black text-emerald-600">
                        {play.telemetryMetrics.val3}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer: Glovall Analyst Badge & Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] truncate max-w-[65%]">
                      <Bot className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">Por <strong>{play.analyst.split('&')[0]}</strong></span>
                    </div>

                    <span className="font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 text-xs">
                      Ver Video <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: DOCUMENTOS (Visor + Asistente de IA Interactivo) */}
      {/* ========================================================================= */}
      {activeMainTab === 'documentos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: File Explorer Tree (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-xs">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar archivo..."
                value={docSearchQuery}
                onChange={(e) => setDocSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Folder Categories */}
            <div className="space-y-2">
              {['Scouting', 'Académico', 'Biomecánica', 'Salud & Nutrición', 'Psicología'].map((folder) => {
                const isExpanded = expandedFolders[folder];
                const folderDocs = LIBRARY_DOCUMENTS.filter(
                  (d) =>
                    d.category === folder &&
                    (docSearchQuery === '' || d.name.toLowerCase().includes(docSearchQuery.toLowerCase()))
                );

                return (
                  <div key={folder} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => toggleFolder(folder)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">📁</span>
                        <span>{folder}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({folderDocs.length})</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="pl-3 space-y-1">
                        {folderDocs.map((doc) => {
                          const isSelected = selectedDoc.id === doc.id;
                          return (
                            <button
                              key={doc.id}
                              type="button"
                              onClick={() => handleSelectDocument(doc)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`} />
                                <span className="truncate">{doc.name}</span>
                              </div>
                              {doc.assignedByAcademy && !isSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" title="Asignado por academia" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center Column: Document Viewer (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col min-h-[600px] overflow-hidden">
            {/* Top Bar of Viewer */}
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold truncate max-w-[260px] sm:max-w-md">{selectedDoc.name}</span>
                <span className="text-[10px] text-slate-400">({selectedDoc.size})</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Descargando ${selectedDoc.name} de forma segura...`)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Descargar documento"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Content Canvas */}
            <div className="p-6 sm:p-8 flex-1 bg-slate-50/50 space-y-6 overflow-y-auto max-h-[700px]">
              <div className="border-b border-slate-200 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">{selectedDoc.name}</h1>
                  <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                    {selectedDoc.category}
                  </span>
                </div>
                <p className="text-xs text-blue-600 font-semibold mt-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Análisis de IA & Datos Trackman sincronizados</span>
                </p>
              </div>

              {/* Metrics Summary Strip */}
              {selectedDoc.metricsAnalysis && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Exit Velo Máx</span>
                    <span className="text-xl font-black text-slate-900">{selectedDoc.metricsAnalysis.exitVeloMax}</span>
                    <span className="text-[10px] text-emerald-600 font-bold ml-0.5">MPH</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Hard Hit %</span>
                    <span className="text-xl font-black text-slate-900">{selectedDoc.metricsAnalysis.hardHitRate}%</span>
                    <span className="text-[10px] text-blue-600 font-bold block">Percentil 88</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Sweet Spot</span>
                    <span className="text-xl font-black text-slate-900">{selectedDoc.metricsAnalysis.launchAngleSweetSpot}%</span>
                    <span className="text-[10px] text-slate-500 font-medium block">8° - 32° LA</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Scout Grade</span>
                    <span className="text-xl font-black text-blue-600">{selectedDoc.metricsAnalysis.overallGrade}</span>
                    <span className="text-[10px] text-slate-500 font-medium block">Escala 20-80</span>
                  </div>
                </div>
              )}

              {/* Spray Chart Representation */}
              {selectedDoc.metricsAnalysis && (
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span>Distribución de Contacto (Spray Breakdown)</span>
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium">Temporada 2026</span>
                  </div>

                  {/* Visual Baseball Diamond / Spray Graph */}
                  <div className="relative bg-slate-900 rounded-xl p-4 text-white text-center overflow-hidden">
                    <div className="grid grid-cols-3 gap-2 py-4">
                      <div className="p-3 rounded-lg bg-blue-950/80 border border-blue-800/60">
                        <span className="text-[10px] uppercase text-blue-300 font-bold block">Pull (LF)</span>
                        <span className="text-lg font-black text-white">{selectedDoc.metricsAnalysis.pullPct}%</span>
                        <span className="text-[10px] text-emerald-400 block">98.4 Max EV</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                        <span className="text-[10px] uppercase text-slate-300 font-bold block">Center (CF)</span>
                        <span className="text-lg font-black text-white">{selectedDoc.metricsAnalysis.centerPct}%</span>
                        <span className="text-[10px] text-blue-300 block">.650 xBA</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                        <span className="text-[10px] uppercase text-slate-300 font-bold block">Oppo (RF)</span>
                        <span className="text-lg font-black text-white">{selectedDoc.metricsAnalysis.oppoPct}%</span>
                        <span className="text-[10px] text-amber-300 block">Área a potenciar</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Findings */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Hallazgos Clave del Análisis</span>
                </h3>

                <ul className="space-y-2 text-xs text-slate-700">
                  {selectedDoc.metricsAnalysis?.keyFindings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                      <span>{finding}</span>
                    </li>
                  )) || (
                    <li className="text-slate-500">{selectedDoc.previewSummary}</li>
                  )}
                </ul>

                {selectedDoc.metricsAnalysis?.coachAdvice && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs">
                    <strong>Recomendación del Staff:</strong> {selectedDoc.metricsAnalysis.coachAdvice}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: AI Assistant Chat Panel (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[600px] overflow-hidden">
            {/* AI Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Glovall Baseball IQ AI</h3>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    En línea • Tutor Activo
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Conversation Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}

              {isAiTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400 italic p-2 bg-white rounded-xl border border-slate-100 w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                  <span>Analizando métricas del reporte...</span>
                </div>
              )}
            </div>

            {/* Suggested Prompts */}
            <div className="p-3 border-t border-slate-100 bg-white space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Preguntas Sugeridas
              </span>
              <div className="flex flex-col gap-1">
                {selectedDoc.aiSuggestedQuestions.slice(0, 2).map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    className="text-left text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50/80 p-1.5 rounded-lg truncate transition-all cursor-pointer"
                  >
                    💡 {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-slate-200 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Pregunta..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-all cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PODCAST (Recomendados + Reproductor) */}
      {/* ========================================================================= */}
      {activeMainTab === 'podcast' && (
        <div className="space-y-6">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Podcast Recomendados</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Episodios técnicos, entrevistas con scouts y análisis de béisbol moderno para escuchar mientras entrenas.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {['Todos', 'Técnica', 'Mentalidad'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setPodcastFilterCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    podcastFilterCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}

              <button
                type="button"
                onClick={() => alert('Filtro avanzado de podcasts abierto')}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span>Filtrar</span>
              </button>
            </div>
          </div>

          {/* Podcast Episodes List (Numbered: 01, 02, 03... as in screenshot) */}
          <div className="space-y-3">
            {filteredPodcasts.map((pod) => {
              const isPlaying = currentPlayingPodcastId === pod.id && isPodcastPlaying;

              return (
                <div
                  key={pod.id}
                  className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isPlaying ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    {/* Number index */}
                    <span className="text-sm font-black text-blue-500 font-mono shrink-0 w-6">
                      {pod.orderNumber}
                    </span>

                    {/* Thumbnail */}
                    <img
                      src={pod.thumbnail}
                      alt={pod.title}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100"
                    />

                    {/* Title & Metadata */}
                    <div className="space-y-1 min-w-0">
                      <h3
                        onClick={() => setSelectedPodcastModal(pod)}
                        className="text-sm font-bold text-slate-900 truncate hover:text-blue-600 cursor-pointer"
                      >
                        {pod.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold text-[10px]">
                          {pod.category}
                        </span>
                        <span className="text-slate-600 flex items-center gap-1 font-medium">
                          <User className="w-3 h-3 text-slate-400" /> {pod.speaker}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed max-w-2xl">
                        {pod.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Duration */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {pod.duration}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleTogglePlayPodcast(pod)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all shadow-md cursor-pointer ${
                        isPlaying
                          ? 'bg-blue-600 scale-105 ring-4 ring-blue-200'
                          : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                      }`}
                      title={isPlaying ? 'Pausar episodio' : 'Reproducir episodio'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CURSOS (Catálogo con Selector de Categoría + 16 cursos) */}
      {/* ========================================================================= */}
      {activeMainTab === 'cursos' && (
        <div className="space-y-6">
          {/* Top Filter Bar (Exact match to screenshot) */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Categoría:</span>
              </span>

              <select
                value={courseCategoryFilter}
                onChange={(e) => setCourseCategoryFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                <option>Todas las Categorías</option>
                <option>Técnica</option>
                <option>Pitcheo</option>
                <option>Físico</option>
                <option>Mentalidad</option>
                <option>Defensa</option>
                <option>Salud</option>
                <option>Scouting</option>
                <option>Coaching</option>
              </select>
            </div>

            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              {filteredCourses.length} cursos
            </span>
          </div>

          {/* 4-Columns Course Grid (Exact match to screenshots 1 & 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Course Thumbnail Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {course.isAssignedByAcademy && (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black shadow-xs">
                      Asignado
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-600">
                      {course.category}
                    </span>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Card Footer: Level Badge & Classes Pill Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-500">
                        {course.level}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedCourseModal(course)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{course.classesCount} clases</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ALIADOS (Tecnológicos - Trackman, Rapsodo, etc.) */}
      {/* ========================================================================= */}
      {activeMainTab === 'aliados' && (
        <div className="space-y-6">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Aliados Tecnológicos</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Capacitaciones oficiales sobre herramientas de analítica y medición usadas en MLB.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => alert('Filtrar aliados tecnológicos')}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span>Filtrar</span>
              </button>
            </div>
          </div>

          {/* Featured Partner Hero Box (Exact match to screenshot 5) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Big Blue Letter Icon */}
                <div className="w-14 h-14 rounded-2xl bg-blue-700 flex items-center justify-center text-white font-black text-2xl shadow-md shrink-0">
                  {activePartner.logoLetter}
                </div>

                <div className="space-y-1">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">{activePartner.name}</h2>
                  <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                    {activePartner.description}
                  </p>
                </div>
              </div>

              <span className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{activePartner.videos.length} videos</span>
              </span>
            </div>

            {/* Feature Checkmark Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              {activePartner.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold flex items-center gap-1.5 border border-blue-100"
                >
                  <Check className="w-3 h-3 text-blue-600" />
                  <span>{feat}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Masterclass Video Grid (4 Columns, matching screenshot 5) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {activePartner.videos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => setSelectedVideoModal({ partner: activePartner, video: vid })}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group cursor-pointer"
              >
                {/* Video Thumbnail with Centered Play Button & Duration */}
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />

                  {/* Play circle overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 ml-0.5 fill-current" />
                    </div>
                  </div>

                  {/* Tag badge */}
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                    {vid.categoryTag}
                  </span>

                  {/* Duration badge */}
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-mono font-bold">
                    {vid.duration}
                  </span>
                </div>

                {/* Card Info */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                      {vid.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {vid.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GLOBAL MODALS: MLB VIDEO PLAY ANALYSIS, COURSE DETAIL & VIDEO PLAYER */}
      {/* ========================================================================= */}

      {/* MLB Play Analysis Interactive Modal */}
      {selectedMlbPlayModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 space-y-5 shadow-2xl border border-slate-700/80 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                    {selectedMlbPlayModal.playType}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-blue-300 text-[10px] font-bold">
                    {selectedMlbPlayModal.gameMatchup}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black">
                    GLOVALL B-IQ {selectedMlbPlayModal.glovallIqScore}/100
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  {selectedMlbPlayModal.title}
                </h2>
                <p className="text-xs text-slate-400">
                  Jugador: <strong className="text-white">{selectedMlbPlayModal.mlbStar}</strong> ({selectedMlbPlayModal.teamBadge}) • Fecha: {selectedMlbPlayModal.date}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMlbPlayModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive Video Player & Telemetry HUD */}
            <div className="relative rounded-2xl bg-black border border-slate-800 overflow-hidden group">
              <div className="relative h-64 sm:h-80 w-full flex items-center justify-center overflow-hidden">
                <img
                  src={selectedMlbPlayModal.thumbnail}
                  alt={selectedMlbPlayModal.title}
                  className="w-full h-full object-cover opacity-60"
                />

                {/* Animated HUD Overlay Vector lines */}
                <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-blue-500/40 text-[10px] font-mono text-blue-300 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span className="font-bold text-white uppercase">TRACKING 3D BIO-MOTION</span>
                      </div>
                      <div>FPS: 240 fps • Sensor Synced</div>
                    </div>

                    <div className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono text-right text-emerald-300 space-y-0.5">
                      <div className="font-bold text-white">STATCAST SIMULATOR</div>
                      <div>LATENCY: 0.02ms</div>
                    </div>
                  </div>

                  {/* Center Action Overlay Icon */}
                  <div className="self-center">
                    <button
                      type="button"
                      onClick={() => setIsPlayingMlbVideo(!isPlayingMlbVideo)}
                      className="w-16 h-16 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer"
                    >
                      {isPlayingMlbVideo ? (
                        <Pause className="w-6 h-6 fill-current" />
                      ) : (
                        <Play className="w-6 h-6 ml-1 fill-current" />
                      )}
                    </button>
                  </div>

                  {/* Telemetry bottom bar inside player */}
                  <div className="grid grid-cols-3 gap-2 px-3 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-slate-700/80 text-center">
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block">{selectedMlbPlayModal.telemetryMetrics.label1}</span>
                      <span className="text-xs font-black font-mono text-white">{selectedMlbPlayModal.telemetryMetrics.val1}</span>
                    </div>
                    <div className="border-x border-slate-700">
                      <span className="text-[9px] font-mono text-slate-400 block">{selectedMlbPlayModal.telemetryMetrics.label2}</span>
                      <span className="text-xs font-black font-mono text-blue-400">{selectedMlbPlayModal.telemetryMetrics.val2}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block">{selectedMlbPlayModal.telemetryMetrics.label3}</span>
                      <span className="text-xs font-black font-mono text-emerald-400">{selectedMlbPlayModal.telemetryMetrics.val3}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Playback Controls Bar */}
              <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlayingMlbVideo(!isPlayingMlbVideo)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                  >
                    {isPlayingMlbVideo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                    <span className="text-white">00:{videoTimelineSec < 10 ? `0${videoTimelineSec}` : videoTimelineSec}</span>
                    <span>/</span>
                    <span>{selectedMlbPlayModal.duration}</span>
                  </div>
                </div>

                {/* Timeline slider */}
                <div className="flex-1 max-w-xs mx-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={videoTimelineSec}
                    onChange={(e) => setVideoTimelineSec(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Speed selector */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-slate-400 mr-1">Velocidad:</span>
                  {[0.25, 0.5, 1, 1.5].map((speed) => (
                    <button
                      key={speed}
                      type="button"
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-all ${
                        playbackSpeed === speed
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tactical Breakdown Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="md:col-span-2 space-y-3 bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60">
                <div className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-wider">
                  <Eye className="w-4 h-4" />
                  <span>Desglose Técnico & Claves del Análisis</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedMlbPlayModal.analysisSummary}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-700/60">
                  <span className="text-[11px] font-bold text-slate-200 block">Puntos Clave para tu Desarrollo:</span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedMlbPlayModal.keyTacticalTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Analyst Bio & B-IQ Integration */}
              <div className="space-y-3 bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Evaluación Realizada Por
                  </span>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 font-black text-xs">
                      GLV
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{selectedMlbPlayModal.analyst}</h4>
                      <p className="text-[10px] text-slate-400">{selectedMlbPlayModal.analystRole}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-950/50 border border-blue-800/50 space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-300 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Conexión con tu B-IQ</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Esta jugada se asocia al módulo de <strong>Toma de Decisiones Rápidas</strong> de tu evaluación.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedMlbPlayModal(null)}
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all cursor-pointer text-center"
                >
                  Cerrar Análisis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
                  {selectedCourseModal.category} • {selectedCourseModal.level}
                </span>
                <h2 className="text-xl font-bold text-slate-900">{selectedCourseModal.title}</h2>
                <p className="text-xs text-slate-500">Instructor: <strong>{selectedCourseModal.instructor}</strong></p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCourseModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">{selectedCourseModal.description}</p>

            {/* Modules List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Temario del Curso ({selectedCourseModal.classesCount} Clases)</h3>
              <div className="space-y-2">
                {selectedCourseModal.modules.map((mod, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>{mod.title}</span>
                      <span className="text-slate-500 text-[11px]">{mod.duration}</span>
                    </div>
                    <ul className="pl-4 space-y-1 text-xs text-slate-600 list-disc">
                      {mod.lessons.map((lesson, lIdx) => (
                        <li key={lIdx}>{lesson}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedCourseModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cerrar
              </button>

              <button
                type="button"
                onClick={() => {
                  alert(`¡Iniciando clase del curso ${selectedCourseModal.title}!`);
                  setSelectedCourseModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Continuar Estudiando</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Masterclass Modal */}
      {selectedVideoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold">
                  {selectedVideoModal.video.categoryTag}
                </span>
                <span className="text-xs font-bold text-slate-600">{selectedVideoModal.partner.name}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedVideoModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Simulator */}
            <div className="relative h-64 rounded-2xl bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={selectedVideoModal.video.thumbnail}
                alt={selectedVideoModal.video.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-3">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-xl animate-pulse">
                  <Play className="w-6 h-6 ml-1 fill-current" />
                </div>
                <span className="text-xs font-bold bg-black/60 px-3 py-1 rounded-full">
                  Reproduciendo Masterclass ({selectedVideoModal.video.duration})
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-900">{selectedVideoModal.video.title}</h2>
              <p className="text-xs text-slate-600">{selectedVideoModal.video.description}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedVideoModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
