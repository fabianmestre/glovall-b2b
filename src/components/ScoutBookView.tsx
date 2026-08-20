import React from 'react';
import {
  Building2,
  Check,
  CheckCircle2,
  Eye,
  FileText,
  Filter,
  History,
  MapPin,
  Medal,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  User,
  Users,
  X
} from 'lucide-react';
import { AcademyProfile, Player, UserRole } from '../types';

interface ScoutBookViewProps {
  academy: AcademyProfile;
  players: Player[];
  activeRole: UserRole;
}

interface SentReportLog {
  id: string;
  recipientEmail: string;
  recipientName?: string;
  recipientOrg: string;
  reportType: 'Masivo (Grupal)' | 'Individual (Ficha 360°)';
  targetSummary: string;
  playerIds?: string[];
  sentAt: string;
  status: 'Entregado' | 'Abierto' | 'Confirmado';
  pdfFileName: string;
}

const INITIAL_SENT_LOGS: SentReportLog[] = [
  {
    id: 'rep-1',
    recipientEmail: 'd.rowland@yankees.com',
    recipientName: 'Donny Rowland',
    recipientOrg: 'New York Yankees (International Scouting)',
    reportType: 'Masivo (Grupal)',
    targetSummary: 'Dossier Especial Clase 2026 (12 Prospectos)',
    sentAt: 'Hoy, 09:45 AM',
    status: 'Abierto',
    pdfFileName: 'Scout_Book_Caribe_Clase_2026.pdf',
  },
  {
    id: 'rep-2',
    recipientEmail: 'latam.evaluations@astros.com',
    recipientName: 'Carlos Subero',
    recipientOrg: 'Houston Astros',
    reportType: 'Individual (Ficha 360°)',
    targetSummary: 'Bryan Andrés Grano (SS • Clase 2026)',
    playerIds: ['p-001'],
    sentAt: 'Ayer, 16:30',
    status: 'Abierto',
    pdfFileName: 'Ficha_Tecnica_Bryan_Grano.pdf',
  },
  {
    id: 'rep-3',
    recipientEmail: 'scouting.caribbean@dodgers.com',
    recipientName: 'Raúl González',
    recipientOrg: 'Los Angeles Dodgers',
    reportType: 'Individual (Ficha 360°)',
    targetSummary: 'Kelvin Mateo Peña (RHP • Clase 2026 • 96 MPH)',
    playerIds: ['p-002'],
    sentAt: '17 Ago 2026',
    status: 'Confirmado',
    pdfFileName: 'Ficha_Tecnica_Kelvin_Mateo.pdf',
  },
  {
    id: 'rep-4',
    recipientEmail: 'evaluations@padres.com',
    recipientName: 'Luis Ortiz',
    recipientOrg: 'San Diego Padres',
    reportType: 'Masivo (Grupal)',
    targetSummary: 'Lanzadores Élite & Bullpen Select (8 Prospectos)',
    sentAt: '14 Ago 2026',
    status: 'Entregado',
    pdfFileName: 'Dossier_Lanzadores_Caribe_2026.pdf',
  },
];

export const ScoutBookView: React.FC<ScoutBookViewProps> = ({
  academy,
  players,
}) => {
  // Navigation Tabs: 'mass' | 'individual' | 'history'
  const [activeTab, setActiveTab] = React.useState<'mass' | 'individual' | 'history'>('mass');

  // ==========================================
  // STATE FOR TAB 1: REPORTE MASIVO
  // ==========================================
  const [massClassFilter, setMassClassFilter] = React.useState<string>('ALL');
  const [massPosFilter, setMassPosFilter] = React.useState<string>('all');
  const [massSearchQuery, setMassSearchQuery] = React.useState<string>('');

  // ==========================================
  // STATE FOR TAB 2: ENVÍO INDIVIDUAL
  // ==========================================
  const [indivSearchQuery, setIndivSearchQuery] = React.useState<string>('');
  const [indivClassFilter, setIndivClassFilter] = React.useState<string>('ALL');
  const [indivPosFilter, setIndivPosFilter] = React.useState<string>('all');
  const [inspectedPlayerForModal, setInspectedPlayerForModal] = React.useState<Player | null>(null);

  // ==========================================
  // STATE FOR EMAIL DISPATCH SIMULATION MODAL
  // ==========================================
  const [isEmailModalOpen, setIsEmailModalOpen] = React.useState<boolean>(false);
  const [modalMode, setModalMode] = React.useState<'mass' | 'individual'>('mass');
  const [modalTargetPlayer, setModalTargetPlayer] = React.useState<Player | null>(null);

  const [recipientEmail, setRecipientEmail] = React.useState<string>('scout.evaluator@mlb.com');
  const [recipientName, setRecipientName] = React.useState<string>('Donny Rowland');
  const [recipientOrg, setRecipientOrg] = React.useState<string>('New York Yankees');
  const [emailSubject, setEmailSubject] = React.useState<string>('');
  const [emailMessage, setEmailMessage] = React.useState<string>('');
  const [isSendingEmail, setIsSendingEmail] = React.useState<boolean>(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = React.useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Sent logs history
  const [sentLogs, setSentLogs] = React.useState<SentReportLog[]>(INITIAL_SENT_LOGS);

  // Show Toast Helper
  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // ==========================================
  // COMPUTED: FILTERED PLAYERS IN MASSIVE TAB (Dossier Table)
  // ==========================================
  const visibleMassPlayers = React.useMemo(() => {
    return players.filter((p) => {
      // Class filter
      const matchesClass = massClassFilter === 'ALL' || p.signingClass === massClassFilter;

      // Position filter
      let matchesPos = true;
      if (massPosFilter === 'P') {
        matchesPos = p.position === 'RHP' || p.position === 'LHP';
      } else if (massPosFilter === 'INF') {
        matchesPos = ['SS', '2B', '3B', '1B'].includes(p.position);
      } else if (massPosFilter === 'OF') {
        matchesPos = ['OF', 'CF', 'RF', 'LF'].includes(p.position);
      } else if (massPosFilter === 'C') {
        matchesPos = p.position === 'C';
      }

      // Search query
      const query = massSearchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        p.fullName.toLowerCase().includes(query) ||
        p.position.toLowerCase().includes(query) ||
        p.hometown.toLowerCase().includes(query) ||
        p.signingClass.includes(query);

      return matchesClass && matchesPos && matchesSearch;
    });
  }, [players, massClassFilter, massPosFilter, massSearchQuery]);

  // ==========================================
  // COMPUTED: FILTERED PLAYERS IN INDIVIDUAL TAB
  // ==========================================
  const visibleIndivPlayers = React.useMemo(() => {
    return players.filter((p) => {
      const matchesClass = indivClassFilter === 'ALL' || p.signingClass === indivClassFilter;
      let matchesPos = true;
      if (indivPosFilter === 'P') {
        matchesPos = p.position === 'RHP' || p.position === 'LHP';
      } else if (indivPosFilter === 'INF') {
        matchesPos = ['SS', '2B', '3B', '1B'].includes(p.position);
      } else if (indivPosFilter === 'OF') {
        matchesPos = ['OF', 'CF', 'RF', 'LF'].includes(p.position);
      } else if (indivPosFilter === 'C') {
        matchesPos = p.position === 'C';
      }
      const query = indivSearchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        p.fullName.toLowerCase().includes(query) ||
        p.position.toLowerCase().includes(query) ||
        p.hometown.toLowerCase().includes(query);

      return matchesClass && matchesPos && matchesSearch;
    });
  }, [players, indivClassFilter, indivPosFilter, indivSearchQuery]);

  // ==========================================
  // HANDLERS: EMAIL DISPATCH MODAL
  // ==========================================
  const handleOpenMassEmailModal = () => {
    if (visibleMassPlayers.length === 0) {
      showToast('No hay prospectos en el filtro actual para despachar.', 'info');
      return;
    }
    setModalMode('mass');
    setModalTargetPlayer(null);
    const filterDesc =
      massPosFilter === 'P'
        ? 'Lanzadores'
        : massPosFilter === 'INF'
        ? 'Infielders'
        : massPosFilter === 'OF'
        ? 'Outfielders'
        : massPosFilter === 'C'
        ? 'Receptores'
        : massClassFilter !== 'ALL'
        ? `Clase ${massClassFilter}`
        : 'Prospectos Destacados';

    setEmailSubject(
      `Scout Book Oficial • ${academy.name} - Dossier ${filterDesc} (${visibleMassPlayers.length} Atletas)`
    );
    setEmailMessage(
      `Estimado Director de Scouting / Evaluador MLB:\n\nLe compartimos el catálogo oficial y confidencial de prospectos de ${academy.name} con métricas TrackMan verificadas y evaluaciones 360° de ${visibleMassPlayers.length} atletas seleccionados.\n\nAdjuntamos el documento oficial en formato PDF para su respectiva evaluación.\n\nQuedamos a su disposición para coordinar visitas a nuestras instalaciones en ${academy.city} o enviar sesiones en video.`
    );
    setIsEmailModalOpen(true);
  };

  const handleOpenIndividualEmailModal = (player: Player) => {
    setModalMode('individual');
    setModalTargetPlayer(player);
    setEmailSubject(
      `Ficha Técnica 360°: ${player.fullName} (${player.position} • Clase ${player.signingClass}) - ${academy.name}`
    );
    setEmailMessage(
      `Estimado Scout:\n\nLe remitimos el expediente técnico individual de ${player.fullName} (${player.position}, Clase de Firma ${player.signingClass}).\n\nMétricas destacadas:\n- Velocidad de Salida (EV): ${player.metrics.exitVelocityMph} MPH\n- Brazo / Recta: ${player.metrics.fastballVeloMaxMph || player.metrics.armVelocityMph} MPH\n- Carrera 60 Yd: ${player.metrics.sixtyYardDashSec}s\n- Score Baseball IQ: ${player.edTech.baseballIqScore}%\n- Glovall Score: ${player.glovallScore}/100\n\nAdjuntamos el PDF oficial con videos de swing/bullpen y notas del Head Trainer.`
    );
    setIsEmailModalOpen(true);
  };

  const handleSendEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail) return;

    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      setIsEmailModalOpen(false);

      const targetText =
        modalMode === 'mass'
          ? `Dossier Masivo (${visibleMassPlayers.length} Prospectos)`
          : `${modalTargetPlayer?.fullName} (${modalTargetPlayer?.position} • Clase ${modalTargetPlayer?.signingClass})`;

      const fileName =
        modalMode === 'mass'
          ? `Scout_Book_${academy.name.replace(/\s+/g, '_')}_Dossier_${massPosFilter}_${massClassFilter}.pdf`
          : `Ficha_Tecnica_${modalTargetPlayer?.fullName.replace(/\s+/g, '_')}.pdf`;

      const newLog: SentReportLog = {
        id: `rep-${Date.now()}`,
        recipientEmail,
        recipientName: recipientName || 'Evaluador MLB',
        recipientOrg: recipientOrg || 'Organización MLB',
        reportType: modalMode === 'mass' ? 'Masivo (Grupal)' : 'Individual (Ficha 360°)',
        targetSummary: targetText,
        playerIds: modalMode === 'individual' && modalTargetPlayer ? [modalTargetPlayer.id] : visibleMassPlayers.map((p) => p.id),
        sentAt: 'Justo ahora',
        status: 'Entregado',
        pdfFileName: fileName,
      };

      setSentLogs([newLog, ...sentLogs]);
      showToast(`¡Reporte con PDF adjunto despachado exitosamente a ${recipientEmail}!`);
    }, 1100);
  };

  return (
    <div id="scoutbook-root-container" className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header principal de Scout Book (Sin botones innecesarios, todo se gestiona por correo con PDF adjunto) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-black text-2xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Scout Book</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Genera y despacha dossiers grupales y fichas técnicas individuales por correo electrónico con PDF oficial adjunto para organizaciones MLB
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200/70 text-xs text-slate-600 font-bold">
          <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>{academy.name}</span>
          <span className="text-slate-300">•</span>
          <span className="text-indigo-600">{players.length} Atletas Activos</span>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          className={`p-4 rounded-2xl font-bold text-xs flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-600 text-white shadow-emerald-500/20'
              : 'bg-blue-600 text-white shadow-blue-500/20'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white text-xs font-black uppercase px-2 py-0.5 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Selector de Pestañas: 3 Pestañas Claras */}
      <div className="bg-white p-1.5 sm:p-2 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('mass')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'mass'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Reporte Masivo (Grupal)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('individual')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'individual'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Envío Individual</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Historial de Envíos</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'history' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {sentLogs.length}
            </span>
          </button>
        </div>

        {/* Tab Context Indicator */}
        <div className="text-xs text-slate-500 px-3 hidden md:block">
          {activeTab === 'mass' && (
            <span>
              Dossier actual:{' '}
              <strong className="text-indigo-600">{visibleMassPlayers.length}</strong> de {players.length} prospectos filtrados
            </span>
          )}
          {activeTab === 'individual' && (
            <span>
              Catálogo de <strong className="text-indigo-600">{players.length}</strong> atletas con envío directo a scouts
            </span>
          )}
          {activeTab === 'history' && (
            <span>
              <strong className="text-emerald-600">{sentLogs.length}</strong> reportes despachados a organizaciones MLB
            </span>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PESTAÑA 1: REPORTE MASIVO (FILTROS DIRECTOS -> TABLA DOSSIER REACTIVA)    */}
      {/* ========================================================================= */}
      {activeTab === 'mass' && (
        <div className="space-y-6">
          {/* Barra de Filtros Optimizada y Compacta */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
            {/* Grupo de Filtros Izquierda / Centro */}
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              {/* Selector de Posición (Pills Rápidos) */}
              <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'P', label: 'Lanzadores' },
                  { id: 'INF', label: 'Infielders' },
                  { id: 'OF', label: 'Outfielders' },
                  { id: 'C', label: 'Receptores' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setMassPosFilter(pos.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      massPosFilter === pos.id
                        ? 'bg-white text-indigo-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>

              {/* Selector de Clase de Firma */}
              <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl">
                <span className="text-[11px] font-bold text-slate-400 pl-2 pr-1 hidden sm:inline">Clase:</span>
                {['ALL', '2026', '2027', '2028'].map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setMassClassFilter(cls)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      massClassFilter === cls
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {cls === 'ALL' ? 'Todas' : cls}
                  </button>
                ))}
              </div>

              {/* Buscador Rápido con Icono y Limpiar */}
              <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={massSearchQuery}
                  onChange={(e) => setMassSearchQuery(e.target.value)}
                  placeholder="Buscar prospecto o ciudad..."
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400"
                />
                {massSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setMassSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Reset rápido si hay algún filtro activo */}
              {(massPosFilter !== 'all' || massClassFilter !== 'ALL' || massSearchQuery !== '') && (
                <button
                  type="button"
                  onClick={() => {
                    setMassPosFilter('all');
                    setMassClassFilter('ALL');
                    setMassSearchQuery('');
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-indigo-600 underline cursor-pointer px-2 py-1"
                >
                  Restablecer
                </button>
              )}
            </div>

            {/* Acción Principal: Enviar Dossier Filtrado por Correo */}
            <div className="flex items-center gap-3 shrink-0 pt-2 xl:pt-0 border-t xl:border-t-0 border-slate-100 justify-between xl:justify-end">
              <span className="text-xs text-slate-500 font-medium">
                <strong className="text-indigo-600 font-bold">{visibleMassPlayers.length}</strong> de {players.length} atletas
              </span>

              <button
                type="button"
                onClick={handleOpenMassEmailModal}
                disabled={visibleMassPlayers.length === 0}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Dossier ({visibleMassPlayers.length}) por Correo</span>
              </button>
            </div>
          </div>

          {/* VISTA PREVIA DEL DOSSIER MASIVO (TABLA VINCULADA ESTRICTAMENTE A visibleMassPlayers) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 space-y-6">
            {/* Membrete Institucional Automático (Desde el Perfil de la Academia) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-900 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                  DOSSIER OFICIAL DE EVALUACIÓN MLB • CATÁLOGO MASIVO
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  {academy.name}
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  {academy.city}, {academy.country} • Director: {academy.directorName} • Tel: {academy.directorPhone} • {academy.directorEmail}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-black text-slate-900 block">
                    {visibleMassPlayers.length} Prospectos en Dossier
                  </span>
                  <span className="text-[10px] text-slate-400">TrackMan & Radar 20-80 Verificados</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
                  {academy.logo || '⚾'}
                </div>
              </div>
            </div>

            {/* TABLA DEL DOSSIER: SE ACTUALIZA DIRECTAMENTE SEGÚN LOS FILTROS */}
            {visibleMassPlayers.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 space-y-3">
                <Users className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">No hay prospectos que coincidan con estos filtros</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Ajusta la posición, clase o término de búsqueda para visualizar prospectos en este dossier.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMassPosFilter('all');
                    setMassClassFilter('ALL');
                    setMassSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700 transition-all cursor-pointer"
                >
                  Ver Todos los 25 Prospectos
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold text-[11px]">
                      <th className="py-3 px-3.5">#</th>
                      <th className="py-3 px-3">Prospecto</th>
                      <th className="py-3 px-2 text-center">Pos</th>
                      <th className="py-3 px-2 text-center">Clase</th>
                      <th className="py-3 px-2 text-center">Estatura / Peso</th>
                      <th className="py-3 px-2 text-center">B/L</th>
                      <th className="py-3 px-2 text-center">Exit Velo (EV)</th>
                      <th className="py-3 px-2 text-center">Fastball / Brazo</th>
                      <th className="py-3 px-2 text-center">60 Yd Dash</th>
                      <th className="py-3 px-2 text-center">Pop Time</th>
                      <th className="py-3 px-2 text-center">Baseball IQ</th>
                      <th className="py-3 px-2 text-center">Glovall Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visibleMassPlayers.map((player, idx) => (
                      <tr
                        key={player.id}
                        className={`hover:bg-indigo-50/40 transition-colors ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                        }`}
                      >
                        <td className="py-2.5 px-3.5 font-bold text-slate-400 text-[11px]">{idx + 1}</td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={player.avatar}
                              alt={player.fullName}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">{player.fullName}</span>
                              <span className="text-[10px] text-slate-400">{player.hometown}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px]">
                            {player.position}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center font-semibold text-slate-700">
                          {player.signingClass}
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-600">
                          {player.height} • {player.weight} lbs
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-[11px] text-slate-700">
                          {player.bats}/{player.throws}
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold text-blue-700 font-mono">
                          {player.metrics.exitVelocityMph} MPH
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold text-indigo-700 font-mono">
                          {player.metrics.fastballVeloMaxMph
                            ? `${player.metrics.fastballVeloMaxMph} MPH`
                            : `${player.metrics.armVelocityMph} MPH`}
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold text-slate-900 font-mono">
                          {player.metrics.sixtyYardDashSec}s
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-600 font-mono">
                          {player.metrics.popTimeSec ? `${player.metrics.popTimeSec}s` : '—'}
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold text-emerald-700">
                          {player.edTech.baseballIqScore}%
                        </td>
                        <td className="py-2.5 px-2 text-center font-black text-indigo-700 text-sm">
                          {player.glovallScore}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pie de Página del Dossier */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
              <span>{academy.name} © 2026 • Documento Oficial Confidencial para Scouts MLB</span>
              <span>
                Total en este dossier: <strong>{visibleMassPlayers.length}</strong> prospectos filtrados
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 2: ENVÍO INDIVIDUAL (TABLA TIPO ROSTER CON BOTÓN ENVIAR DIRECTO)  */}
      {/* ========================================================================= */}
      {activeTab === 'individual' && (
        <div className="space-y-6">
          {/* Barra de Filtros y Búsqueda para Envío Individual */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>Envío de Ficha Técnica Individual</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selecciona cualquier prospecto y haz clic en «Enviar a Scout» para remitir su ficha técnica 360° personalizada por correo con PDF adjunto
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500">
                  {visibleIndivPlayers.length} de {players.length} Atletas
                </span>
              </div>
            </div>

            {/* Filtros de la tabla tipo Roster */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
              {/* Posiciones */}
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase">Posición:</span>
                {[
                  { id: 'all', label: 'Todas' },
                  { id: 'P', label: 'Lanzadores' },
                  { id: 'INF', label: 'Infielders' },
                  { id: 'OF', label: 'Outfielders' },
                  { id: 'C', label: 'Receptores' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setIndivPosFilter(pos.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      indivPosFilter === pos.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>

              {/* Clase & Buscador */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={indivClassFilter}
                  onChange={(e) => setIndivClassFilter(e.target.value)}
                  className="p-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <option value="ALL">Todas las Clases</option>
                  <option value="2026">Clase 2026</option>
                  <option value="2027">Clase 2027</option>
                  <option value="2028">Clase 2028</option>
                </select>

                <div className="relative w-full sm:w-60">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={indivSearchQuery}
                    onChange={(e) => setIndivSearchQuery(e.target.value)}
                    placeholder="Buscar prospecto..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* TABLA ESTILO ROSTER BIEN PRESENTADA PARA ENVÍO INDIVIDUAL */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold text-[11px]">
                    <th className="py-3 px-3.5">Prospecto</th>
                    <th className="py-3 px-2 text-center">Posición</th>
                    <th className="py-3 px-2 text-center">Clase</th>
                    <th className="py-3 px-2 text-center">Físico</th>
                    <th className="py-3 px-2 text-center">B/L</th>
                    <th className="py-3 px-2 text-center">Exit Velo</th>
                    <th className="py-3 px-2 text-center">Brazo / FB</th>
                    <th className="py-3 px-2 text-center">60 Yd</th>
                    <th className="py-3 px-2 text-center">Baseball IQ</th>
                    <th className="py-3 px-2 text-center">Glovall Score</th>
                    <th className="py-3 px-3.5 text-center">Acciones de Envío</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleIndivPlayers.map((player, idx) => (
                    <tr
                      key={player.id}
                      className={`hover:bg-blue-50/30 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                      }`}
                    >
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={player.avatar}
                            alt={player.fullName}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block text-xs">{player.fullName}</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {player.hometown}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[11px]">
                          {player.position}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-slate-700">{player.signingClass}</td>
                      <td className="py-3 px-2 text-center text-slate-600">
                        {player.height} • {player.weight} lbs
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-slate-700">
                        {player.bats}/{player.throws}
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-blue-700 font-mono">
                        {player.metrics.exitVelocityMph} MPH
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-indigo-700 font-mono">
                        {player.metrics.fastballVeloMaxMph
                          ? `${player.metrics.fastballVeloMaxMph} MPH`
                          : `${player.metrics.armVelocityMph} MPH`}
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-slate-900 font-mono">
                        {player.metrics.sixtyYardDashSec}s
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-emerald-700">
                        {player.edTech.baseballIqScore}%
                      </td>
                      <td className="py-3 px-2 text-center font-black text-indigo-700 text-sm">
                        {player.glovallScore}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenIndividualEmailModal(player)}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs shadow-xs shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Enviar a Scout</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setInspectedPlayerForModal(player)}
                            title="Ver Ficha Técnica 360°"
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 px-1">
              <span>Mostrando {visibleIndivPlayers.length} prospectos en catálogo</span>
              <span>Todos los atletas cuentan con consentimiento legal y métricas verificadas</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 3: HISTORIAL DE REPORTES ENVIADOS (SECCIÓN DEDICADA)              */}
      {/* ========================================================================= */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Métricas Resumen de Envíos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Despachados</span>
                <Send className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{sentLogs.length}</p>
              <p className="text-[11px] text-slate-500">Reportes oficiales a scouts</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Organizaciones MLB</span>
                <Building2 className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-2xl font-black text-indigo-600">
                {new Set(sentLogs.map((l) => l.recipientOrg)).size}
              </p>
              <p className="text-[11px] text-slate-500">Clubes de Grandes Ligas alcanzados</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Tasa de Apertura</span>
                <Eye className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-emerald-600">85%</p>
              <p className="text-[11px] text-slate-500">Scouts revisaron los dossiers</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Atletas en Cartera</span>
                <Medal className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-black text-amber-600">{players.length}</p>
              <p className="text-[11px] text-slate-500">Prospectos 100% elegibles</p>
            </div>
          </div>

          {/* Tabla de Bitácora de Envíos */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-600" />
                  <span>Bitácora de Envíos Realizados a Organizaciones MLB</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Registro de entrega de reportes masivos y fichas individuales enviadas por {academy.name}
                </p>
              </div>

              <button
                type="button"
                onClick={() => showToast('Bitácora sincronizada con el servidor de correo Glovall.')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Actualizar</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold text-[11px]">
                    <th className="py-3 px-3.5">Destinatario & Organización</th>
                    <th className="py-3 px-3">Modalidad</th>
                    <th className="py-3 px-3">Contenido Despachado</th>
                    <th className="py-3 px-3">Documento PDF Adjunto</th>
                    <th className="py-3 px-3">Fecha y Hora</th>
                    <th className="py-3 px-3 text-center">Estado</th>
                    <th className="py-3 px-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sentLogs.map((log, idx) => (
                    <tr
                      key={log.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                    >
                      <td className="py-3 px-3.5">
                        <p className="font-bold text-slate-900">{log.recipientEmail}</p>
                        <p className="text-[10px] text-slate-500 font-semibold">
                          {log.recipientName ? `${log.recipientName} • ` : ''}
                          {log.recipientOrg}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                            log.reportType.includes('Masivo')
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                              : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                          }`}
                        >
                          {log.reportType}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{log.targetSummary}</td>
                      <td className="py-3 px-3">
                        <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                          <FileText className="w-3 h-3 text-red-500" />
                          {log.pdfFileName}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px]">{log.sentAt}</td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            log.status === 'Abierto'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : log.status === 'Confirmado'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            showToast(`Reenviando notificación de actualización a ${log.recipientEmail}...`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-all cursor-pointer"
                        >
                          Reenviar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ENVÍO SIMULADO POR CORREO ELECTRÓNICO A SCOUTS MLB                */}
      {/* ========================================================================= */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95">
            {/* Header del Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {modalMode === 'mass'
                      ? `Despachar Dossier Masivo (${visibleMassPlayers.length} Atletas)`
                      : `Enviar Ficha Técnica: ${modalTargetPlayer?.fullName}`}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Envío oficial desde el perfil de {academy.name} con PDF adjunto
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formulario de Envío */}
            <form onSubmit={handleSendEmailSubmit} className="space-y-3.5">
              {/* Correo y Nombre del Scout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Correo del Scout MLB</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="scout.evaluator@mlb.com"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nombre del Evaluador</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Ej: Donny Rowland"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              {/* Organización MLB con sugerencias */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Organización MLB o Universidad</label>
                <input
                  type="text"
                  value={recipientOrg}
                  onChange={(e) => setRecipientOrg(e.target.value)}
                  placeholder="Ej: New York Yankees / Houston Astros / D1 College"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                  required
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  {['Yankees', 'Astros', 'Dodgers', 'Padres', 'Red Sox'].map((org) => (
                    <button
                      key={org}
                      type="button"
                      onClick={() => setRecipientOrg(`${org} (International Scouting)`)}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-semibold transition-all cursor-pointer"
                    >
                      +{org}
                    </button>
                  ))}
                </div>
              </div>

              {/* Asunto */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Asunto del Correo</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white"
                  required
                />
              </div>

              {/* Mensaje */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Mensaje de Acompañamiento</label>
                <textarea
                  rows={3}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white resize-none"
                  required
                />
              </div>

              {/* Visualización del Adjunto PDF */}
              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-center justify-between text-xs text-indigo-950">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="font-bold truncate">
                    {modalMode === 'mass'
                      ? `Scout_Book_${academy.name.replace(/\s+/g, '_')}_Dossier_${massPosFilter}_${massClassFilter}.pdf`
                      : `Ficha_Tecnica_${modalTargetPlayer?.fullName.replace(/\s+/g, '_')}.pdf`}
                  </span>
                </div>
                <span className="text-[10px] text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded font-mono font-bold shrink-0">
                  PDF Adjunto Verificado
                </span>
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isSendingEmail ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Despachando Reporte...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Reporte Oficial</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL / DRAWER: INSPECCIÓN DE FICHA TÉCNICA 360° INDIVIDUAL               */}
      {/* ========================================================================= */}
      {inspectedPlayerForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Header de la Ficha */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={inspectedPlayerForModal.avatar}
                  alt={inspectedPlayerForModal.fullName}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">
                      {inspectedPlayerForModal.fullName}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                      {inspectedPlayerForModal.position}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Clase {inspectedPlayerForModal.signingClass} • {inspectedPlayerForModal.hometown} • {inspectedPlayerForModal.height}, {inspectedPlayerForModal.weight} lbs
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectedPlayerForModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Escala MLB 20-80 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Escala de Scouting MLB 20-80
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-white border border-slate-100 flex justify-between">
                  <span className="text-slate-500">Hit:</span>
                  <strong className="text-indigo-700">{inspectedPlayerForModal.scoutScale.hit}/80</strong>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-100 flex justify-between">
                  <span className="text-slate-500">Power:</span>
                  <strong className="text-indigo-700">{inspectedPlayerForModal.scoutScale.power}/80</strong>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-100 flex justify-between">
                  <span className="text-slate-500">Run (Vel):</span>
                  <strong className="text-indigo-700">{inspectedPlayerForModal.scoutScale.run}/80</strong>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-100 flex justify-between">
                  <span className="text-slate-500">Arm:</span>
                  <strong className="text-indigo-700">{inspectedPlayerForModal.scoutScale.arm}/80</strong>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-100 flex justify-between">
                  <span className="text-slate-500">Field:</span>
                  <strong className="text-indigo-700">{inspectedPlayerForModal.scoutScale.field}/80</strong>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-100 flex justify-between">
                  <span className="text-slate-500">IQ Score:</span>
                  <strong className="text-emerald-700">{inspectedPlayerForModal.edTech.baseballIqScore}%</strong>
                </div>
              </div>
            </div>

            {/* Métricas Físicas Verificadas */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <span className="text-slate-500 block text-[11px]">Exit Velocity (EV)</span>
                <span className="text-base font-black text-blue-700 font-mono">
                  {inspectedPlayerForModal.metrics.exitVelocityMph} MPH
                </span>
              </div>
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                <span className="text-slate-500 block text-[11px]">Fastball / Brazo</span>
                <span className="text-base font-black text-indigo-700 font-mono">
                  {inspectedPlayerForModal.metrics.fastballVeloMaxMph || inspectedPlayerForModal.metrics.armVelocityMph} MPH
                </span>
              </div>
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[11px]">60 Yard Dash</span>
                <span className="text-base font-black text-slate-900 font-mono">
                  {inspectedPlayerForModal.metrics.sixtyYardDashSec} seg
                </span>
              </div>
            </div>

            {/* Notas del Entrenador */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Reporte del Head Trainer ({inspectedPlayerForModal.assignedCoachName || 'Carlos Rosario'})
              </span>
              <p className="text-slate-800 leading-relaxed">
                {inspectedPlayerForModal.scoutingNotes ||
                  'Excelente disciplina en el plato, rotación explosiva de cadera y gran alcance en jugadas de línea hacia ambos perfiles.'}
              </p>
            </div>

            {/* Botones de Acción del Modal */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInspectedPlayerForModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = inspectedPlayerForModal;
                  setInspectedPlayerForModal(null);
                  handleOpenIndividualEmailModal(target);
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Esta Ficha a Scout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
