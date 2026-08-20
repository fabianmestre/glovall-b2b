import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Award,
  Calendar,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Edit3,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  Flame,
  Globe,
  HelpCircle,
  Info,
  Layers,
  ListPlus,
  Mail,
  MapPin,
  Plus,
  Radio,
  Search,
  Send,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  UserCheck,
  UserPlus,
  Users,
  Video,
  X,
  Zap
} from 'lucide-react';
import { INITIAL_ACADEMY_SHOWCASE_PLANS, SHOWCASE_EVENTS } from '../data/mockData';
import {
  AcademyProfile,
  AcademyShowcasePlan,
  CoachStaff,
  Player,
  PlayerOutcomeReport,
  PlayerShowcaseParticipation,
  ShowcaseEvent,
  UserRole
} from '../types';

interface ShowcaseViewProps {
  academy: AcademyProfile;
  players: Player[];
  coaches?: CoachStaff[];
  activeRole: UserRole;
  onNavigateTab: (tab: string) => void;
  onUpdatePlayer?: (player: Player) => void;
}

export const ShowcaseView: React.FC<ShowcaseViewProps> = ({
  academy,
  players,
  coaches = [],
  activeRole,
  onNavigateTab,
  onUpdatePlayer,
}) => {
  // Main View Tab: "events" (Vigentes) comes FIRST by default, followed by "plans" (Preparación & Bitácoras)
  const [mainTab, setMainTab] = useState<'events' | 'plans'>('events');

  // Official / Community Events State
  const [eventsList, setEventsList] = useState<ShowcaseEvent[]>(SHOWCASE_EVENTS);

  // Academy Preparation Plans (CRUD State)
  const [plansList, setPlansList] = useState<AcademyShowcasePlan[]>(INITIAL_ACADEMY_SHOWCASE_PLANS);

  // Filter for Plans
  const [planStatusFilter, setPlanStatusFilter] = useState<'ALL' | 'En Preparación' | 'Confirmado' | 'Finalizado'>('ALL');

  // Modals state
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<ShowcaseEvent | null>(null);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState<boolean>(false);

  // Plan Create/Edit Modal State
  const [isPlanModalOpen, setIsPlanModalOpen] = useState<boolean>(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planForm, setPlanForm] = useState<{
    eventId: string;
    eventTitle: string;
    category: string;
    date: string;
    time: string;
    location: string;
    city: string;
    country: string;
    status: 'En Preparación' | 'Confirmado' | 'Finalizado';
    assignedCoachIds: string[];
    assignedPlayerIds: string[];
    preparationGoals: string;
    drillsFocus: string[];
    notes: string;
  }>({
    eventId: '',
    eventTitle: '',
    category: 'Showcase Internacional',
    date: new Date().toISOString().split('T')[0],
    time: '08:00 AM',
    location: 'Complejo Caribe Baseball Academy',
    city: 'Boca Chica',
    country: 'República Dominicana',
    status: 'En Preparación',
    assignedCoachIds: [],
    assignedPlayerIds: [],
    preparationGoals: '',
    drillsFocus: [],
    notes: '',
  });

  const [newDrillInput, setNewDrillInput] = useState<string>('');

  // Performance Log / Bitácora Modal State
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [activePlanForLog, setActivePlanForLog] = useState<AcademyShowcasePlan | null>(null);
  const [selectedPlayerForLog, setSelectedPlayerForLog] = useState<Player | null>(null);
  const [logForm, setLogForm] = useState<{
    status: 'Evaluado Destacado' | 'Seguimiento Solicitado' | 'Participó' | 'Entrevista Realizada' | 'Reporte Favorable';
    sixtyYards: string;
    exitVelo: string;
    armSpeed: string;
    popTime: string;
    interestedOrgs: string;
    scoutInterviewsOrNotes: string;
    coachSummary: string;
  }>({
    status: 'Evaluado Destacado',
    sixtyYards: '',
    exitVelo: '',
    armSpeed: '',
    popTime: '',
    interestedOrgs: 'New York Yankees, Los Angeles Dodgers',
    scoutInterviewsOrNotes: '',
    coachSummary: '',
  });

  // Suggest Event Form (Proposal to Glovall)
  const [suggestForm, setSuggestForm] = useState({
    title: '',
    category: 'Showcase Internacional',
    organizer: '',
    date: '',
    time: '08:00 AM',
    location: '',
    city: 'Santo Domingo',
    country: 'República Dominicana',
    targetClasses: '2026, 2027',
    scoutsEstimated: '15',
    contactEmail: academy.directorEmail || '',
    contactPhone: academy.directorPhone || '',
    description: '',
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);
  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Staff coach list fallback
  const availableCoaches = coaches.length > 0 ? coaches : academy.staffList || [];

  // ==========================================
  // HANDLERS: PLAN CRUD
  // ==========================================

  const handleOpenNewPlanModal = (prefillEvent?: ShowcaseEvent) => {
    if (prefillEvent) {
      setPlanForm({
        eventId: prefillEvent.id,
        eventTitle: prefillEvent.title,
        category: prefillEvent.category,
        date: prefillEvent.date,
        time: prefillEvent.time,
        location: prefillEvent.location,
        city: prefillEvent.city || 'Santo Domingo',
        country: prefillEvent.country || 'República Dominicana',
        status: 'En Preparación',
        assignedCoachIds: availableCoaches.slice(0, 2).map((c) => c.id),
        assignedPlayerIds: (prefillEvent.registeredPlayersIds && prefillEvent.registeredPlayersIds.length > 0)
          ? prefillEvent.registeredPlayersIds
          : players.slice(0, 4).map((p) => p.id),
        preparationGoals: `Alineación de objetivos para ${prefillEvent.title}. Enfoque en sprint 60 yardas, Live BP con madero y bullpen controlado.`,
        drillsFocus: [
          'Salidas explosivas de 60 yardas',
          'Live BP con conteos cerrados',
          'Rutina defensiva y doble play'
        ],
        notes: `Evento programado para ${prefillEvent.date}.`,
      });
    } else {
      setPlanForm({
        eventId: '',
        eventTitle: '',
        category: 'Showcase Internacional',
        date: new Date().toISOString().split('T')[0],
        time: '08:00 AM',
        location: `Complejo ${academy.name}`,
        city: academy.city || 'Santo Domingo',
        country: academy.country || 'República Dominicana',
        status: 'En Preparación',
        assignedCoachIds: availableCoaches.slice(0, 2).map((c) => c.id),
        assignedPlayerIds: players.slice(0, 4).map((p) => p.id),
        preparationGoals: 'Preparación técnica y física enfocada en métricas láser de 60 yardas y consistencia de swing.',
        drillsFocus: [
          'Simulación de Live BP',
          'Sprint 60 yardas con cronómetro láser',
          'Sesión de bullpen con radar'
        ],
        notes: '',
      });
    }
    setEditingPlanId(null);
    setIsPlanModalOpen(true);
  };

  const handleOpenEditPlanModal = (plan: AcademyShowcasePlan) => {
    setEditingPlanId(plan.id);
    setPlanForm({
      eventId: plan.eventId || '',
      eventTitle: plan.eventTitle,
      category: plan.category,
      date: plan.date,
      time: plan.time || '08:00 AM',
      location: plan.location,
      city: plan.city || 'Santo Domingo',
      country: plan.country || 'República Dominicana',
      status: plan.status,
      assignedCoachIds: plan.assignedCoachIds || [],
      assignedPlayerIds: plan.assignedPlayerIds || [],
      preparationGoals: plan.preparationGoals || '',
      drillsFocus: plan.drillsFocus || [],
      notes: plan.notes || '',
    });
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.eventTitle || !planForm.date) {
      alert('Por favor indica el título y la fecha del evento.');
      return;
    }

    if (editingPlanId) {
      // Update existing
      setPlansList((prev) =>
        prev.map((p) =>
          p.id === editingPlanId
            ? {
                ...p,
                eventId: planForm.eventId || undefined,
                eventTitle: planForm.eventTitle,
                category: planForm.category,
                date: planForm.date,
                time: planForm.time,
                location: planForm.location,
                city: planForm.city,
                country: planForm.country,
                status: planForm.status,
                assignedCoachIds: planForm.assignedCoachIds,
                assignedPlayerIds: planForm.assignedPlayerIds,
                preparationGoals: planForm.preparationGoals,
                drillsFocus: planForm.drillsFocus,
                notes: planForm.notes,
                updatedAt: new Date().toISOString().split('T')[0],
              }
            : p
        )
      );
      showToast(`Plan de preparación para "${planForm.eventTitle}" actualizado correctamente.`);
    } else {
      // Create new
      const newPlan: AcademyShowcasePlan = {
        id: `plan-${Date.now()}`,
        eventId: planForm.eventId || undefined,
        eventTitle: planForm.eventTitle,
        category: planForm.category,
        date: planForm.date,
        time: planForm.time,
        location: planForm.location,
        city: planForm.city,
        country: planForm.country,
        status: planForm.status,
        assignedCoachIds: planForm.assignedCoachIds,
        assignedPlayerIds: planForm.assignedPlayerIds,
        preparationGoals: planForm.preparationGoals,
        drillsFocus: planForm.drillsFocus,
        notes: planForm.notes,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };

      setPlansList([newPlan, ...plansList]);
      showToast(`¡Nueva planificación creada para "${newPlan.eventTitle}"!`);
    }

    setIsPlanModalOpen(false);
  };

  const handleDeletePlan = (planId: string, title: string) => {
    if (confirm(`¿Estás seguro de eliminar la planificación del evento "${title}"?`)) {
      setPlansList((prev) => prev.filter((p) => p.id !== planId));
      showToast(`Planificación de "${title}" eliminada.`);
    }
  };

  const handleAddDrill = () => {
    if (newDrillInput.trim()) {
      setPlanForm({
        ...planForm,
        drillsFocus: [...planForm.drillsFocus, newDrillInput.trim()],
      });
      setNewDrillInput('');
    }
  };

  const handleRemoveDrill = (idxToRemove: number) => {
    setPlanForm({
      ...planForm,
      drillsFocus: planForm.drillsFocus.filter((_, idx) => idx !== idxToRemove),
    });
  };

  const toggleCoachInPlan = (coachId: string) => {
    const exists = planForm.assignedCoachIds.includes(coachId);
    setPlanForm({
      ...planForm,
      assignedCoachIds: exists
        ? planForm.assignedCoachIds.filter((id) => id !== coachId)
        : [...planForm.assignedCoachIds, coachId],
    });
  };

  const togglePlayerInPlan = (playerId: string) => {
    const exists = planForm.assignedPlayerIds.includes(playerId);
    setPlanForm({
      ...planForm,
      assignedPlayerIds: exists
        ? planForm.assignedPlayerIds.filter((id) => id !== playerId)
        : [...planForm.assignedPlayerIds, playerId],
    });
  };

  // ==========================================
  // HANDLERS: BITÁCORA / PERFORMANCE LOG
  // ==========================================

  const handleOpenLogModal = (plan: AcademyShowcasePlan, preselectedPlayerId?: string) => {
    setActivePlanForLog(plan);

    const enrolledPlayers = plan.assignedPlayerIds
      .map((id) => players.find((p) => p.id === id))
      .filter(Boolean) as Player[];

    const defaultPlayer = preselectedPlayerId
      ? players.find((p) => p.id === preselectedPlayerId) || enrolledPlayers[0] || players[0]
      : enrolledPlayers[0] || players[0];

    setSelectedPlayerForLog(defaultPlayer || null);

    // Preload outcome from plan or player showcaseHistory
    const existingPlanOutcome = plan.playerOutcomes?.[defaultPlayer?.id || ''];
    const existing360Record = (defaultPlayer?.showcaseHistory || []).find((s) => s.eventId === plan.eventId || s.eventTitle === plan.eventTitle);

    if (existingPlanOutcome) {
      setLogForm({
        status: existingPlanOutcome.status,
        sixtyYards: existingPlanOutcome.sixtyYards || '',
        exitVelo: existingPlanOutcome.exitVelo || '',
        armSpeed: existingPlanOutcome.armSpeed || '',
        popTime: existingPlanOutcome.popTime || '',
        interestedOrgs: existingPlanOutcome.interestedOrganizations.join(', '),
        scoutInterviewsOrNotes: existingPlanOutcome.scoutInterviewsOrNotes || '',
        coachSummary: existingPlanOutcome.coachSummary || '',
      });
    } else if (existing360Record) {
      const sixty = existing360Record.metricsRecorded.find((m) => m.metricName.includes('60'))?.value || '';
      const ev = existing360Record.metricsRecorded.find((m) => m.metricName.includes('Exit') || m.metricName.includes('Salida'))?.value || '';
      const arm = existing360Record.metricsRecorded.find((m) => m.metricName.includes('Fastball') || m.metricName.includes('Brazo'))?.value || '';
      const pop = existing360Record.metricsRecorded.find((m) => m.metricName.includes('Pop') || m.metricName.includes('Salto'))?.value || '';

      setLogForm({
        status: existing360Record.status,
        sixtyYards: sixty,
        exitVelo: ev,
        armSpeed: arm,
        popTime: pop,
        interestedOrgs: existing360Record.interestedOrganizations.join(', '),
        scoutInterviewsOrNotes: existing360Record.scoutInterviewsOrNotes || '',
        coachSummary: existing360Record.coachSummary || '',
      });
    } else {
      setLogForm({
        status: 'Evaluado Destacado',
        sixtyYards: defaultPlayer?.metrics.sixtyYardDashSec ? `${defaultPlayer.metrics.sixtyYardDashSec} seg` : '',
        exitVelo: defaultPlayer?.metrics.exitVelocityMph ? `${defaultPlayer.metrics.exitVelocityMph} MPH` : '',
        armSpeed: defaultPlayer?.metrics.armVelocityMph ? `${defaultPlayer.metrics.armVelocityMph} MPH` : '',
        popTime: '',
        interestedOrgs: 'New York Yankees, Los Angeles Dodgers, San Diego Padres',
        scoutInterviewsOrNotes: '',
        coachSummary: '',
      });
    }

    setIsLogModalOpen(true);
  };

  const handleSelectPlayerInLog = (player: Player) => {
    setSelectedPlayerForLog(player);
    if (!activePlanForLog) return;

    const existingPlanOutcome = activePlanForLog.playerOutcomes?.[player.id];
    const existing360Record = (player.showcaseHistory || []).find((s) => s.eventId === activePlanForLog.eventId || s.eventTitle === activePlanForLog.eventTitle);

    if (existingPlanOutcome) {
      setLogForm({
        status: existingPlanOutcome.status,
        sixtyYards: existingPlanOutcome.sixtyYards || '',
        exitVelo: existingPlanOutcome.exitVelo || '',
        armSpeed: existingPlanOutcome.armSpeed || '',
        popTime: existingPlanOutcome.popTime || '',
        interestedOrgs: existingPlanOutcome.interestedOrganizations.join(', '),
        scoutInterviewsOrNotes: existingPlanOutcome.scoutInterviewsOrNotes || '',
        coachSummary: existingPlanOutcome.coachSummary || '',
      });
    } else if (existing360Record) {
      const sixty = existing360Record.metricsRecorded.find((m) => m.metricName.includes('60'))?.value || '';
      const ev = existing360Record.metricsRecorded.find((m) => m.metricName.includes('Exit') || m.metricName.includes('Salida'))?.value || '';
      const arm = existing360Record.metricsRecorded.find((m) => m.metricName.includes('Fastball') || m.metricName.includes('Brazo'))?.value || '';
      const pop = existing360Record.metricsRecorded.find((m) => m.metricName.includes('Pop') || m.metricName.includes('Salto'))?.value || '';

      setLogForm({
        status: existing360Record.status,
        sixtyYards: sixty,
        exitVelo: ev,
        armSpeed: arm,
        popTime: pop,
        interestedOrgs: existing360Record.interestedOrganizations.join(', '),
        scoutInterviewsOrNotes: existing360Record.scoutInterviewsOrNotes || '',
        coachSummary: existing360Record.coachSummary || '',
      });
    } else {
      setLogForm({
        status: 'Evaluado Destacado',
        sixtyYards: player.metrics.sixtyYardDashSec ? `${player.metrics.sixtyYardDashSec} seg` : '',
        exitVelo: player.metrics.exitVelocityMph ? `${player.metrics.exitVelocityMph} MPH` : '',
        armSpeed: player.metrics.armVelocityMph ? `${player.metrics.armVelocityMph} MPH` : '',
        popTime: '',
        interestedOrgs: 'New York Yankees, Los Angeles Dodgers, San Diego Padres',
        scoutInterviewsOrNotes: '',
        coachSummary: '',
      });
    }
  };

  const handleSavePerformanceLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerForLog || !activePlanForLog) return;

    const interestedList = logForm.interestedOrgs
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean);

    // 1. Update Player Outcome inside Plan
    const outcomeReport: PlayerOutcomeReport = {
      playerId: selectedPlayerForLog.id,
      status: logForm.status,
      sixtyYards: logForm.sixtyYards,
      exitVelo: logForm.exitVelo,
      armSpeed: logForm.armSpeed,
      popTime: logForm.popTime,
      interestedOrganizations: interestedList,
      scoutInterviewsOrNotes: logForm.scoutInterviewsOrNotes,
      coachSummary: logForm.coachSummary,
    };

    setPlansList((prev) =>
      prev.map((p) => {
        if (p.id === activePlanForLog.id) {
          return {
            ...p,
            playerOutcomes: {
              ...(p.playerOutcomes || {}),
              [selectedPlayerForLog.id]: outcomeReport,
            },
          };
        }
        return p;
      })
    );

    // 2. Synchronize with Player 360 Showcase History
    const metricsRecorded = [];
    if (logForm.sixtyYards) {
      metricsRecorded.push({
        metricName: 'Sprint 60 Yardas Láser',
        value: logForm.sixtyYards,
        benchmarkRating: 'Oficial en Terreno',
      });
    }
    if (logForm.exitVelo) {
      metricsRecorded.push({
        metricName: 'Velocidad de Salida (Exit Velo)',
        value: logForm.exitVelo,
        benchmarkRating: 'TrackMan Stadium',
      });
    }
    if (logForm.armSpeed) {
      metricsRecorded.push({
        metricName: selectedPlayerForLog.position.includes('P') ? 'Fastball Máx' : 'Fuerza de Brazo',
        value: logForm.armSpeed,
        benchmarkRating: 'Radar Oficial Stalker',
      });
    }
    if (logForm.popTime) {
      metricsRecorded.push({
        metricName: selectedPlayerForLog.position === 'C' ? 'Pop Time a 2B' : 'Test Físico Complementario',
        value: logForm.popTime,
        benchmarkRating: 'Staff Certificado',
      });
    }

    const new360Record: PlayerShowcaseParticipation = {
      id: `sh-${activePlanForLog.id}-${selectedPlayerForLog.id}`,
      eventId: activePlanForLog.eventId || `ev-${activePlanForLog.id}`,
      eventTitle: activePlanForLog.eventTitle,
      eventCategory: activePlanForLog.category,
      date: activePlanForLog.date,
      location: activePlanForLog.location,
      city: activePlanForLog.city,
      country: activePlanForLog.country,
      source: 'glovall_official',
      status: logForm.status,
      metricsRecorded,
      interestedOrganizations: interestedList,
      scoutInterviewsOrNotes: logForm.scoutInterviewsOrNotes,
      coachSummary: logForm.coachSummary || `Evaluación técnica en ${activePlanForLog.eventTitle}.`,
      recordedByCoachName: selectedPlayerForLog.assignedCoachName || 'Staff Técnico',
      recordedDate: new Date().toISOString().split('T')[0],
    };

    const currentHistory = selectedPlayerForLog.showcaseHistory || [];
    const filteredHistory = currentHistory.filter(
      (s) => s.eventId !== new360Record.eventId && s.eventTitle !== new360Record.eventTitle
    );

    const updatedPlayer: Player = {
      ...selectedPlayerForLog,
      showcaseHistory: [new360Record, ...filteredHistory],
    };

    if (onUpdatePlayer) {
      onUpdatePlayer(updatedPlayer);
    }

    setIsLogModalOpen(false);
    showToast(`✓ Bitácora registrada para ${selectedPlayerForLog.fullName}. Sincronizada con su Vista 360°.`);
  };

  // ==========================================
  // HANDLER: PROPOSE EVENT TO GLOVALL
  // ==========================================

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestForm.title || !suggestForm.date || !suggestForm.location) {
      alert('Por favor completa los campos requeridos (Título, Fecha y Sede).');
      return;
    }

    const newEvent: ShowcaseEvent = {
      id: `ev-sug-${Date.now()}`,
      title: suggestForm.title,
      category: suggestForm.category,
      organizer: suggestForm.organizer || academy.name,
      date: suggestForm.date,
      time: suggestForm.time || '08:00 AM',
      location: suggestForm.location,
      city: suggestForm.city,
      country: suggestForm.country,
      source: 'community_suggested',
      approvalStatus: 'pending_review',
      suggestedByAcademyName: academy.name,
      suggestedByAcademyId: academy.id,
      suggestedDate: new Date().toISOString().split('T')[0],
      attendingScoutsCount: parseInt(suggestForm.scoutsEstimated) || 12,
      confirmedScoutsCount: parseInt(suggestForm.scoutsEstimated) || 12,
      organizationsCount: Math.max(1, Math.floor((parseInt(suggestForm.scoutsEstimated) || 12) * 0.8)),
      registeredPlayersIds: [],
      participatingPlayerIds: [],
      status: 'upcoming',
      description: suggestForm.description || `Propuesto por ${academy.name}. En revisión por Glovall.`,
      targetClasses: suggestForm.targetClasses.split(',').map((c) => c.trim()),
      contactEmail: suggestForm.contactEmail,
      contactPhone: suggestForm.contactPhone,
      scoutsAttending: [],
    };

    setEventsList([newEvent, ...eventsList]);
    setIsSuggestModalOpen(false);
    setSuggestForm({
      title: '',
      category: 'Showcase Internacional',
      organizer: '',
      date: '',
      time: '08:00 AM',
      location: '',
      city: 'Santo Domingo',
      country: 'República Dominicana',
      targetClasses: '2026, 2027',
      scoutsEstimated: '15',
      contactEmail: academy.directorEmail || '',
      contactPhone: academy.directorPhone || '',
      description: '',
    });

    showToast('¡Evento enviado a revisión de Glovall! Una vez validado, se publicará para toda la comunidad.', 'info');
  };

  // Filter plans list
  const filteredPlans = plansList.filter((p) => {
    if (planStatusFilter === 'ALL') return true;
    return p.status === planStatusFilter;
  });

  return (
    <div id="showcases-view-container" className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Principal con Selector de Pestañas */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 font-black text-2xl">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Showcases & Tryouts MLB
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Glovall SportsTech</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Gestión operativa de tryouts: consulta el calendario de eventos vigentes y administra la preparación interna de tu roster.
            </p>
          </div>
        </div>

        {/* Selector de Pestañas Principales: Eventos Vigentes PRIMERO */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl self-start md:self-auto">
          <button
            type="button"
            onClick={() => setMainTab('events')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              mainTab === 'events'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Eventos Vigentes ({eventsList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setMainTab('plans')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              mainTab === 'plans'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Preparación & Bitácoras ({plansList.length})</span>
          </button>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          className={`p-4 rounded-2xl font-bold text-xs flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-600 text-white shadow-emerald-500/20'
              : 'bg-indigo-600 text-white shadow-indigo-500/20'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <Info className="w-5 h-5 shrink-0" />
            )}
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

      {/* ========================================================================= */}
      {/* PESTAÑA 1: EVENTOS VIGENTES (SOLO VISUALIZACIÓN LIMPIA)                    */}
      {/* ========================================================================= */}
      {mainTab === 'events' && (
        <div className="space-y-6">
          {/* Header de Visualización */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-black text-slate-900">
                Calendario de Eventos & Tryouts Oficiales
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Datos cargados por Glovall y aprobados por la comunidad de béisbol
              </p>
            </div>

            {(activeRole === 'admin' || activeRole === 'staff') && (
              <button
                type="button"
                onClick={() => setIsSuggestModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Proponer Evento a Glovall</span>
              </button>
            )}
          </div>

          {/* Tabla Limpia de Eventos Vigentes */}
          <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Evento / Modalidad</th>
                    <th className="py-3.5 px-4">Fecha & Horario</th>
                    <th className="py-3.5 px-4">Sede & Ciudad</th>
                    <th className="py-3.5 px-4">Scouts MLB Confirmados</th>
                    <th className="py-3.5 px-4">Origen</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {eventsList.map((event) => {
                    const isOfficial = event.source === 'glovall_official';
                    const isPending = event.approvalStatus === 'pending_review';

                    return (
                      <tr key={event.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Evento & Categoría */}
                        <td className="py-3.5 px-4 min-w-[220px]">
                          <div className="flex items-start gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs ${
                                isPending
                                  ? 'bg-amber-500'
                                  : event.category.includes('TrackMan')
                                  ? 'bg-blue-600'
                                  : event.category.includes('Láser')
                                  ? 'bg-purple-600'
                                  : 'bg-emerald-600'
                              }`}
                            >
                              <Trophy className="w-4 h-4" />
                            </div>

                            <div className="space-y-0.5">
                              <p className="font-bold text-slate-900 leading-snug">
                                {event.title}
                              </p>
                              <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                                  {event.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Fecha & Horario */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                              <span>{event.date}</span>
                            </div>
                            <p className="text-[11px] text-slate-500">{event.time}</p>
                          </div>
                        </td>

                        {/* Sede & Ciudad */}
                        <td className="py-3.5 px-4 min-w-[180px]">
                          <div className="space-y-0.5">
                            <p className="font-semibold text-slate-900 truncate max-w-[200px]">
                              {event.location}
                            </p>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{event.city || 'Santo Domingo'}</span>
                            </p>
                          </div>
                        </td>

                        {/* Scouts MLB */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-900">
                              {event.confirmedScoutsCount || event.attendingScoutsCount || 10} Scouts
                            </span>
                            <p className="text-[10px] font-bold text-blue-700">
                              {event.organizationsCount || 12} Organizaciones
                            </p>
                          </div>
                        </td>

                        {/* Origen */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {isPending ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300">
                              <Clock className="w-3 h-3 text-amber-700 animate-spin" />
                              <span>En Revisión Glovall</span>
                            </span>
                          ) : isOfficial ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                              <ShieldCheck className="w-3 h-3 text-blue-600" />
                              <span>Oficial Glovall</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Comunidad</span>
                            </span>
                          )}
                        </td>

                        {/* Acciones */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedEventForDetail(event)}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-600" />
                              <span>Detalles</span>
                            </button>

                            {(activeRole === 'admin' || activeRole === 'staff') && !isPending && (
                              <button
                                type="button"
                                onClick={() => {
                                  handleOpenNewPlanModal(event);
                                  setMainTab('plans');
                                }}
                                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                                title="Crear un plan de preparación para este evento"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ Planificar</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 2: PREPARACIÓN & BITÁCORAS DE LA ACADEMIA (CRUD ELEGANTE & LIMPIO) */}
      {/* ========================================================================= */}
      {mainTab === 'plans' && (
        <div className="space-y-6">
          {/* Subheader & Acciones */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filtrar por Estado:</span>
              <div className="flex items-center gap-1.5">
                {(['ALL', 'En Preparación', 'Confirmado', 'Finalizado'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setPlanStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      planStatusFilter === st
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'ALL' ? 'Todos los Planes' : st}
                  </button>
                ))}
              </div>
            </div>

            {(activeRole === 'admin' || activeRole === 'staff') && (
              <button
                type="button"
                onClick={() => handleOpenNewPlanModal()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nueva Planificación de Evento</span>
              </button>
            )}
          </div>

          {/* Listado de Planes de Participación Limpio y Sofisticado */}
          {filteredPlans.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
              <ClipboardList className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">
                No hay planes de preparación registrados en esta vista
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Crea una nueva planificación para asignar entrenadores, peloteros y estructurar los drills antes de cada tryout o showcase.
              </p>
              <button
                type="button"
                onClick={() => handleOpenNewPlanModal()}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
              >
                + Crear Primer Plan de Evento
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {filteredPlans.map((plan) => {
                const assignedCoaches = plan.assignedCoachIds
                  .map((cId) => availableCoaches.find((c) => c.id === cId))
                  .filter(Boolean) as CoachStaff[];

                const assignedPlayersList = plan.assignedPlayerIds
                  .map((pId) => players.find((p) => p.id === pId))
                  .filter(Boolean) as Player[];

                const evaluatedCount = Object.keys(plan.playerOutcomes || {}).length;
                const totalPlayers = assignedPlayersList.length;
                const progressPct = totalPlayers > 0 ? Math.round((evaluatedCount / totalPlayers) * 100) : 0;

                return (
                  <div
                    key={plan.id}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all overflow-hidden"
                  >
                    {/* Header Principal de la Tarjeta */}
                    <div className="p-5 sm:p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-3 py-0.5 rounded-full text-xs font-black tracking-wide ${
                              plan.status === 'En Preparación'
                                ? 'bg-amber-100/90 text-amber-900 border border-amber-300/80'
                                : plan.status === 'Confirmado'
                                ? 'bg-blue-100/90 text-blue-900 border border-blue-300/80'
                                : 'bg-emerald-100/90 text-emerald-900 border border-emerald-300/80'
                            }`}
                          >
                            ● {plan.status}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-bold">
                            {plan.category}
                          </span>
                          {plan.eventId && (
                            <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200/60 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-indigo-600" />
                              <span>Oficial Glovall</span>
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-black text-slate-900 tracking-tight">
                          {plan.eventTitle}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5 font-bold text-slate-800">
                            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{plan.date}</span>
                            {plan.time && <span className="text-slate-400 font-normal">({plan.time})</span>}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{plan.location} {plan.city ? `(${plan.city})` : ''}</span>
                          </span>
                        </div>
                      </div>

                      {/* Botones de Acción */}
                      <div className="flex items-center gap-2 self-start md:self-auto">
                        <button
                          type="button"
                          onClick={() => handleOpenLogModal(plan)}
                          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                          title="Registrar o consultar el desempeño y métricas de los peloteros"
                        >
                          <ClipboardList className="w-4 h-4" />
                          <span>Bitácora 360° ({evaluatedCount}/{totalPlayers})</span>
                        </button>

                        {(activeRole === 'admin' || activeRole === 'staff') && (
                          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                            <button
                              type="button"
                              onClick={() => handleOpenEditPlanModal(plan)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
                              title="Editar planificación"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePlan(plan.id, plan.eventTitle)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                              title="Eliminar planificación"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cuerpo de la Tarjeta (2 Columnas Limpias) */}
                    <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                      {/* Columna Izquierda: Staff y Roster (7 de 12) */}
                      <div className="lg:col-span-7 space-y-4">
                        {/* Entrenadores */}
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                            Coaches Responsables ({assignedCoaches.length})
                          </span>
                          {assignedCoaches.length === 0 ? (
                            <p className="text-slate-400 italic">No hay coaches asignados a este evento.</p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {assignedCoaches.map((coach) => (
                                <div
                                  key={coach.id}
                                  className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80"
                                >
                                  <img
                                    src={coach.avatar}
                                    alt={coach.name}
                                    className="w-6 h-6 rounded-full object-cover border border-slate-200"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div>
                                    <p className="font-bold text-slate-900 leading-none text-[11px]">
                                      {coach.name}
                                    </p>
                                    <p className="text-[9px] text-indigo-600 font-semibold mt-0.5">
                                      {coach.roleTitle || coach.specialty}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Peloteros Inscritos */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                              Prospectos Inscritos ({assignedPlayersList.length})
                            </span>
                            <span className="text-[10px] font-bold text-amber-700">
                              {evaluatedCount} con bitácora lista
                            </span>
                          </div>

                          {assignedPlayersList.length === 0 ? (
                            <p className="text-slate-400 italic">No hay peloteros asignados.</p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {assignedPlayersList.map((player) => {
                                const outcome = plan.playerOutcomes?.[player.id];
                                return (
                                  <div
                                    key={player.id}
                                    onClick={() => handleOpenLogModal(plan, player.id)}
                                    className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                                      outcome
                                        ? 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/70'
                                        : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50'
                                    }`}
                                    title="Clic para registrar o consultar bitácora de desempeño"
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      <img
                                        src={player.avatar}
                                        alt={player.fullName}
                                        className="w-6 h-6 rounded-full object-cover shrink-0"
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="truncate">
                                        <p className="font-bold text-slate-900 truncate text-[11px]">
                                          {player.fullName}
                                        </p>
                                        <p className="text-[10px] text-slate-500">
                                          {player.position} • Clase {player.signingClass}
                                        </p>
                                      </div>
                                    </div>

                                    {outcome ? (
                                      <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[9px] shrink-0">
                                        ✓ Evaluado
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-100 text-slate-600 font-bold text-[9px] shrink-0">
                                        + Evaluar
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Columna Derecha: Objetivos y Drills (5 de 12) */}
                      <div className="lg:col-span-5 space-y-4 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-6 pt-4 lg:pt-0">
                        {/* Objetivos */}
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                            Objetivos de Preparación
                          </span>
                          <p className="text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                            {plan.preparationGoals || 'Alineación de rutinas y acondicionamiento previo al showcase.'}
                          </p>
                        </div>

                        {/* Drills Clave */}
                        {plan.drillsFocus && plan.drillsFocus.length > 0 && (
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                              Drills & Rutinas Programadas
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {plan.drillsFocus.map((drill, dIdx) => (
                                <span
                                  key={dIdx}
                                  className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/70 text-amber-900 text-[11px] font-semibold flex items-center gap-1"
                                >
                                  <Flame className="w-3 h-3 text-amber-600 shrink-0" />
                                  <span>{drill}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Barra de Progreso y Resumen Inferior */}
                    <div className="px-6 py-3 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-28 sm:w-36 h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-700 text-[11px]">
                          {evaluatedCount} de {totalPlayers} evaluados ({progressPct}%)
                        </span>
                      </div>

                      <span className="text-slate-400 text-[11px]">
                        Última actualización: {plan.updatedAt || plan.createdAt}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL CRUD: CREAR / EDITAR PLANIFICACIÓN DE LA ACADEMIA                   */}
      {/* ========================================================================= */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">
                    {editingPlanId ? 'Editar Planificación de Evento' : 'Nueva Planificación de Tryout / Showcase'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Asigna entrenadores, prospectos del roster y define los objetivos de preparación
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPlanModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Información General del Evento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Nombre o Título del Showcase / Evento *
                  </label>
                  <input
                    type="text"
                    required
                    value={planForm.eventTitle}
                    onChange={(e) => setPlanForm({ ...planForm, eventTitle: e.target.value })}
                    placeholder="Ej: Showcase Internacional Caribe 2026 / Tryout San Pedro"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Categoría</label>
                  <select
                    value={planForm.category}
                    onChange={(e) => setPlanForm({ ...planForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  >
                    <option>Showcase Internacional</option>
                    <option>Evaluación TrackMan</option>
                    <option>Combine Físico Láser</option>
                    <option>Torneo Invitacional</option>
                    <option>Tryout Privado MLB</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Estado del Plan</label>
                  <select
                    value={planForm.status}
                    onChange={(e) => setPlanForm({ ...planForm, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  >
                    <option>En Preparación</option>
                    <option>Confirmado</option>
                    <option>Finalizado</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Fecha del Evento *</label>
                  <input
                    type="date"
                    required
                    value={planForm.date}
                    onChange={(e) => setPlanForm({ ...planForm, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Sede o Complejo</label>
                  <input
                    type="text"
                    value={planForm.location}
                    onChange={(e) => setPlanForm({ ...planForm, location: e.target.value })}
                    placeholder="Estadio Quisqueya / Complejo Boca Chica"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Selección de Entrenadores del Staff */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <label className="font-black text-slate-900 block text-xs">
                  Entrenadores Responsables Asignados ({planForm.assignedCoachIds.length} seleccionados)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableCoaches.map((coach) => {
                    const isSelected = planForm.assignedCoachIds.includes(coach.id);
                    return (
                      <div
                        key={coach.id}
                        onClick={() => toggleCoachInPlan(coach.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-3.5 h-3.5 text-indigo-600 rounded"
                          />
                          <img
                            src={coach.avatar}
                            alt={coach.name}
                            className="w-6 h-6 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-bold text-slate-900">{coach.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {coach.roleTitle || coach.specialty}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selección de Peloteros del Roster */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-black text-slate-900 block text-xs">
                    Peloteros del Roster Participantes ({planForm.assignedPlayerIds.length} seleccionados)
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPlanForm({ ...planForm, assignedPlayerIds: players.map((p) => p.id) })}
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      Todos
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setPlanForm({ ...planForm, assignedPlayerIds: [] })}
                      className="text-slate-500 font-bold hover:underline"
                    >
                      Limpiar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
                  {players.map((player) => {
                    const isSelected = planForm.assignedPlayerIds.includes(player.id);
                    return (
                      <div
                        key={player.id}
                        onClick={() => togglePlayerInPlan(player.id)}
                        className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-3.5 h-3.5 text-indigo-600 rounded"
                          />
                          <img
                            src={player.avatar}
                            alt={player.fullName}
                            className="w-6 h-6 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-bold text-slate-900 truncate">
                            {player.fullName}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold shrink-0">
                          {player.position} • {player.signingClass}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Objetivos de Preparación */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  Objetivos & Enfoque de Preparación Técnica / Física
                </label>
                <textarea
                  rows={2}
                  value={planForm.preparationGoals}
                  onChange={(e) => setPlanForm({ ...planForm, preparationGoals: e.target.value })}
                  placeholder="Ej: Trabajar la consistencia en el Live BP ante pitcheos rompientes y pulir la técnica de salida en las 60 yardas..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              {/* Drills & Rutinas Programadas */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">
                  Drills & Rutinas Programadas
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newDrillInput}
                    onChange={(e) => setNewDrillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDrill();
                      }
                    }}
                    placeholder="Escribe un drill (Ej: 60 yardas con láser Vald, BP 90+ MPH) y pulsa Añadir"
                    className="flex-1 p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddDrill}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold cursor-pointer"
                  >
                    Añadir
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {planForm.drillsFocus.map((drill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200 text-[11px] font-bold flex items-center gap-1.5"
                    >
                      <span>{drill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDrill(idx)}
                        className="text-indigo-400 hover:text-indigo-800 font-bold"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Modal */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/20 cursor-pointer"
                >
                  {editingPlanId ? 'Actualizar Plan' : 'Guardar Planificación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL BITÁCORA: REGISTRO DE DESEMPEÑO EN VIVO & HOJA DE VIDA 360°        */}
      {/* ========================================================================= */}
      {isLogModalOpen && activePlanForLog && selectedPlayerForLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold shadow-md">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">
                    Bitácora de Desempeño & Trazabilidad 360°
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {activePlanForLog.eventTitle} • {activePlanForLog.date}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Selector de Prospecto Asignado */}
            <div className="p-4 bg-slate-100 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Pelotero a Evaluar:</span>
                <select
                  value={selectedPlayerForLog.id}
                  onChange={(e) => {
                    const p = players.find((ply) => ply.id === e.target.value);
                    if (p) handleSelectPlayerInLog(p);
                  }}
                  className="p-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                >
                  {activePlanForLog.assignedPlayerIds.map((pId) => {
                    const ply = players.find((p) => p.id === pId);
                    if (!ply) return null;
                    const hasOutcome = Boolean(activePlanForLog.playerOutcomes?.[ply.id]);
                    return (
                      <option key={ply.id} value={ply.id}>
                        {ply.fullName} ({ply.position} - Clase {ply.signingClass}) {hasOutcome ? '✓ Evaluado' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <img
                  src={selectedPlayerForLog.avatar}
                  alt={selectedPlayerForLog.fullName}
                  className="w-7 h-7 rounded-full object-cover border border-indigo-400"
                  referrerPolicy="no-referrer"
                />
                <span className="font-bold text-indigo-900 text-xs">
                  {selectedPlayerForLog.fullName}
                </span>
              </div>
            </div>

            {/* Formulario de Registro */}
            <form onSubmit={handleSavePerformanceLog} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Resultado / Desempeño
                  </label>
                  <select
                    value={logForm.status}
                    onChange={(e) => setLogForm({ ...logForm, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  >
                    <option>Evaluado Destacado</option>
                    <option>Seguimiento Solicitado</option>
                    <option>Participó</option>
                    <option>Entrevista Realizada</option>
                    <option>Reporte Favorable</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Coach Evaluador
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedPlayerForLog.assignedCoachName || 'Carlos Rosario'}
                    className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-200 font-semibold text-slate-600"
                  />
                </div>
              </div>

              {/* Métricas Oficiales en Terreno */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="font-black text-slate-900 text-xs block">
                  Métricas Oficiales Obtenidas en Este Evento
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-0.5">
                      60 Yardas Láser
                    </label>
                    <input
                      type="text"
                      value={logForm.sixtyYards}
                      onChange={(e) => setLogForm({ ...logForm, sixtyYards: e.target.value })}
                      placeholder="Ej: 6.38 seg"
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-0.5">
                      Exit Velo
                    </label>
                    <input
                      type="text"
                      value={logForm.exitVelo}
                      onChange={(e) => setLogForm({ ...logForm, exitVelo: e.target.value })}
                      placeholder="Ej: 104.2 MPH"
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-0.5">
                      Fastball / Brazo
                    </label>
                    <input
                      type="text"
                      value={logForm.armSpeed}
                      onChange={(e) => setLogForm({ ...logForm, armSpeed: e.target.value })}
                      placeholder="Ej: 92.5 MPH"
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-0.5">
                      Pop Time / Salto
                    </label>
                    <input
                      type="text"
                      value={logForm.popTime}
                      onChange={(e) => setLogForm({ ...logForm, popTime: e.target.value })}
                      placeholder="Ej: 1.88 seg"
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Organizaciones MLB con Interés */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  Organizaciones MLB con Interés Expreso o Solicitud de Seguimiento
                </label>
                <input
                  type="text"
                  value={logForm.interestedOrgs}
                  onChange={(e) => setLogForm({ ...logForm, interestedOrgs: e.target.value })}
                  placeholder="New York Yankees, Los Angeles Dodgers, San Diego Padres"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              {/* Notas de Scouts y Resumen */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  Interacción con Scouts MLB / Notas de Entrevista
                </label>
                <textarea
                  rows={2}
                  value={logForm.scoutInterviewsOrNotes}
                  onChange={(e) => setLogForm({ ...logForm, scoutInterviewsOrNotes: e.target.value })}
                  placeholder="Ej: Scout de Yankees solicitó video adicional de mecánica de swing..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  Informe Técnico del Coach de la Academia
                </label>
                <textarea
                  rows={2}
                  value={logForm.coachSummary}
                  onChange={(e) => setLogForm({ ...logForm, coachSummary: e.target.value })}
                  placeholder="Ej: Demostró una aceleración fulgurante y solvencia defensiva en el campocorto..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              {/* Botones */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Guardar en Hoja de Vida 360°</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PROPONER EVENTO A GLOVALL                                         */}
      {/* ========================================================================= */}
      {isSuggestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">
                    Proponer Evento a la Comunidad
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Glovall revisará y auditará tu propuesta antes de publicarla
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSuggestModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSuggestSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Título o Nombre del Evento *
                  </label>
                  <input
                    type="text"
                    required
                    value={suggestForm.title}
                    onChange={(e) => setSuggestForm({ ...suggestForm, title: e.target.value })}
                    placeholder="Ej: Showcase Regional San Pedro 2026"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Categoría</label>
                  <select
                    value={suggestForm.category}
                    onChange={(e) => setSuggestForm({ ...suggestForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                  >
                    <option>Showcase Internacional</option>
                    <option>Evaluación TrackMan</option>
                    <option>Combine Físico Láser</option>
                    <option>Torneo Invitacional</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Fecha del Evento *</label>
                  <input
                    type="date"
                    required
                    value={suggestForm.date}
                    onChange={(e) => setSuggestForm({ ...suggestForm, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700 block">Sede o Complejo Deportivo *</label>
                  <input
                    type="text"
                    required
                    value={suggestForm.location}
                    onChange={(e) => setSuggestForm({ ...suggestForm, location: e.target.value })}
                    placeholder="Ej: Estadio Tetelo Vargas / Boca Chica"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700 block">Descripción y Notas</label>
                  <textarea
                    rows={3}
                    value={suggestForm.description}
                    onChange={(e) => setSuggestForm({ ...suggestForm, description: e.target.value })}
                    placeholder="Detalles sobre el evento y scouts convocados..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSuggestModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar a Revisión</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DETALLES COMPLETOS DEL EVENTO VIGENTE                              */}
      {/* ========================================================================= */}
      {selectedEventForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-slate-900 text-white flex items-start justify-between shrink-0">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase">
                  {selectedEventForDetail.category}
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {selectedEventForDetail.title}
                </h3>
                <p className="text-xs text-slate-300">
                  {selectedEventForDetail.location} • {selectedEventForDetail.date} ({selectedEventForDetail.time})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEventForDetail(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-900 mb-1">Descripción:</p>
                <p className="text-slate-600 leading-relaxed">
                  {selectedEventForDetail.description}
                </p>
              </div>

              {/* Cronograma */}
              {selectedEventForDetail.schedule && selectedEventForDetail.schedule.length > 0 && (
                <div>
                  <h4 className="font-black uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>Cronograma de Pruebas</span>
                  </h4>
                  <div className="space-y-1.5">
                    {selectedEventForDetail.schedule.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-[10px]">
                            {item.time}
                          </span>
                          <span className="font-bold text-slate-800">{item.activity}</span>
                        </div>
                        <span className="text-slate-500 font-medium text-[11px]">
                          {item.responsible}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const ev = selectedEventForDetail;
                  setSelectedEventForDetail(null);
                  handleOpenNewPlanModal(ev);
                  setMainTab('plans');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer"
              >
                + Planificar Participación de la Academia
              </button>
              <button
                type="button"
                onClick={() => setSelectedEventForDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
