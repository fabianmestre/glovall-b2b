import React, { useState } from 'react';
import {
  Brain,
  BookOpen,
  Video,
  Activity,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Search,
  Plus,
  Send,
  X,
  FileText,
  Bell,
  CheckSquare,
  Square,
  GraduationCap,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Mic,
  BarChart3,
  Timer,
  PlayCircle,
  TrendingUp,
  Eye,
  Info,
  Laptop,
  Smartphone,
  Tablet,
  Award,
  Filter
} from 'lucide-react';
import { Player, AcademyProfile, UserRole } from '../../types';

export interface StudyActivityLog {
  id: string;
  type: 'podcast' | 'curso' | 'video_analisis' | 'test_iq' | 'savant';
  title: string;
  exactDateTime: string; // e.g. "20 Ago 2026 • 08:15 AM"
  detail: string;
  duration: string; // e.g. "38 min"
  scoreOrMetric: string; // e.g. "94% Score", "100% Visto", "Max 98.5 MPH"
  device: string; // e.g. "iPad Pro Studio #2", "PC Aula Studio", "App Móvil iOS"
  verified: boolean;
}

export interface PlayerStudioTracking {
  id: string;
  playerId: string;
  // Module 1: Baseball IQ Test (Strict schedule & time window)
  iqTest: {
    enabled: boolean;
    scheduledDate: string; // YYYY-MM-DD
    startTime: string; // HH:mm
    durationMinutes: number; // e.g. 45
    testTopic: string;
    status: 'programado' | 'en_curso' | 'completado' | 'no_asignado';
    score?: number; // 0 - 100
    completedAt?: string;
  };
  // Module 2: Biblioteca (Simple active/inactive check)
  libraryEnabled: boolean;
  // Module 3: Savant (Simple active/inactive check)
  savantEnabled: boolean;
  // 360 Tracking Metrics
  trackingData: {
    totalHoursStudied: number;
    podcastsListened: number;
    coursesCompleted: number;
    coursesInProgress: number;
    videoAnalysesWatched: number;
    iqTestsTaken: number;
    averageIqScore: number;
    iqLevel: 'Élite MLB' | 'Avanzado' | 'En Desarrollo';
    savantSessionsCount: number;
    topSavantMetric: string;
    lastActiveDateTime: string;
    activityLogs: StudyActivityLog[];
  };
  lastNotificationSent?: string;
  updatedAt: string;
}

interface StudioAssignmentsViewProps {
  academy: AcademyProfile;
  players: Player[];
  activeRole: UserRole;
  currentTab?: string;
  onUpdatePlayer?: (player: Player) => void;
  onNavigateTab?: (tab: string) => void;
}

export const StudioAssignmentsView: React.FC<StudioAssignmentsViewProps> = ({
  academy,
  players,
  activeRole,
  currentTab,
  onUpdatePlayer,
  onNavigateTab
}) => {
  // Navigation internal mode: 'assignments' vs 'tracking360'
  const [activeSubTab, setActiveSubTab] = useState<'assignments' | 'tracking360'>(() => {
    return currentTab === 'studio-tracking' ? 'tracking360' : 'assignments';
  });

  // Sync when currentTab prop changes from sidebar
  React.useEffect(() => {
    if (currentTab === 'studio-tracking') {
      setActiveSubTab('tracking360');
    } else if (currentTab === 'studio-assignments' || currentTab === 'assignments') {
      setActiveSubTab('assignments');
    }
  }, [currentTab]);

  // Selected player for detail modal in 360 view
  const [selectedModalPlayerId, setSelectedModalPlayerId] = useState<string | null>(null);

  // Filter for bitácora modal table
  const [modalBitacoraFilter, setModalBitacoraFilter] = useState<'ALL' | 'test_iq' | 'video_analisis' | 'podcast' | 'curso' | 'savant'>('ALL');

  // Main State for Studio Player Tracking & Assignments
  const [playerRecords, setPlayerRecords] = useState<PlayerStudioTracking[]>(() => {
    return players.map((p, idx) => {
      const isEven = idx % 2 === 0;
      const isFirst = idx === 0;
      const avgScore = isFirst ? 95 : Math.max(74, 92 - (idx * 2));
      const iqLvl = avgScore >= 90 ? 'Élite MLB' : avgScore >= 80 ? 'Avanzado' : 'En Desarrollo';

      const customActivities: StudyActivityLog[] = [
        {
          id: `log-1-${p.id}`,
          type: 'test_iq',
          title: 'Evaluación Situacional: Conteo 3-2 & Hombre en 2B',
          exactDateTime: '20 Ago 2026 • 08:15 AM',
          detail: '20 preguntas situacionales de alta presión (Baseball IQ Flow)',
          duration: '38 min',
          scoreOrMetric: `${avgScore}% Score`,
          device: 'iPad Pro Studio #2',
          verified: true
        },
        {
          id: `log-2-${p.id}`,
          type: 'video_analisis',
          title: 'MLB Breakdown: Fernando Tatis Jr. — Timing en Lanzamientos Quebrados',
          exactDateTime: '19 Ago 2026 • 16:40 PM',
          detail: 'Análisis visual en cámara lenta 240fps con anotaciones técnicas',
          duration: '18 min',
          scoreOrMetric: '100% Visto',
          device: 'App Móvil iOS',
          verified: true
        },
        {
          id: `log-3-${p.id}`,
          type: 'podcast',
          title: 'Podcast Pro Talk #14: Rutinas de Enfoque Mental en el Círculo de Espera',
          exactDateTime: '18 Ago 2026 • 11:20 AM',
          detail: 'Episodio especial con psicólogo deportivo de Grandes Ligas',
          duration: '34 min',
          scoreOrMetric: 'Audio Completo',
          device: 'App Móvil iOS',
          verified: true
        },
        {
          id: `log-4-${p.id}`,
          type: 'curso',
          title: 'Curso Fundamentos MLB: Lectura de Trayectorias y Quiebre de Curvas',
          exactDateTime: '16 Ago 2026 • 14:10 PM',
          detail: 'Módulo 2: Reconocimiento Temprano del Punto de Salida del Pitcher',
          duration: '45 min',
          scoreOrMetric: 'Módulo Aprobado',
          device: 'PC Aula Studio',
          verified: true
        },
        {
          id: `log-5-${p.id}`,
          type: 'savant',
          title: 'Sesión Savant & TrackMan: Análisis de Velocidad de Salida & Launch Angle',
          exactDateTime: '15 Ago 2026 • 09:30 AM',
          detail: 'Medición de 25 swings en jaula sensorizada',
          duration: '50 min',
          scoreOrMetric: p.position === 'RHP' || p.position === 'LHP' ? 'Fastball 93.4 MPH' : 'Exit Velo 98.2 MPH',
          device: 'Sensor TrackMan B1',
          verified: true
        },
        {
          id: `log-6-${p.id}`,
          type: 'podcast',
          title: 'Podcast Élite #08: Nutrición e Hidratación en Días de Tryout y Torneos',
          exactDateTime: '13 Ago 2026 • 19:15 PM',
          detail: 'Guía de recuperación muscular y energía pre-competencia',
          duration: '26 min',
          scoreOrMetric: 'Audio Completo',
          device: 'Móvil Android',
          verified: true
        }
      ];

      return {
        id: `trk-${p.id}`,
        playerId: p.id,
        iqTest: {
          enabled: idx < 5,
          scheduledDate: isEven ? '2026-08-22' : '2026-08-23',
          startTime: isEven ? '09:00' : '15:30',
          durationMinutes: 45,
          testTopic: p.position === 'RHP' || p.position === 'LHP'
            ? 'Baseball IQ: Pitch Tunneling & Situacional 3-2'
            : 'Baseball IQ: Lectura de Batazos & Corredores en Posición Anotadora',
          status: isFirst ? 'completado' : idx === 1 ? 'en_curso' : idx < 5 ? 'programado' : 'no_asignado',
          score: avgScore,
          completedAt: isFirst ? '2026-08-20 09:42' : undefined
        },
        libraryEnabled: idx < 6,
        savantEnabled: idx < 5,
        trackingData: {
          totalHoursStudied: Number((16.5 + (idx * 3.2)).toFixed(1)),
          podcastsListened: 4 + (idx % 3),
          coursesCompleted: 2 + (idx % 3),
          coursesInProgress: 1,
          videoAnalysesWatched: 6 + (idx * 2),
          iqTestsTaken: isFirst ? 4 : 2 + (idx % 3),
          averageIqScore: avgScore,
          iqLevel: iqLvl,
          savantSessionsCount: 5 + idx,
          topSavantMetric: p.position === 'RHP' || p.position === 'LHP' ? '94.2 MPH • 2480 RPM' : '98.5 MPH Exit Velo',
          lastActiveDateTime: idx === 0 ? '20 Ago 2026 • 08:15 AM' : idx === 1 ? '19 Ago 2026 • 16:40 PM' : '18 Ago 2026 • 11:20 AM',
          activityLogs: customActivities
        },
        lastNotificationSent: idx < 3 ? 'Hoy 07:30 AM' : undefined,
        updatedAt: '2026-08-20'
      };
    });
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL');

  // Modal State for Schedule IQ Test
  const [scheduleModalRecord, setScheduleModalRecord] = useState<PlayerStudioTracking | null>(null);
  const [scheduledDateInput, setScheduledDateInput] = useState('2026-08-24');
  const [startTimeInput, setStartTimeInput] = useState('09:00');
  const [durationMinutesInput, setDurationMinutesInput] = useState(45);
  const [testTopicInput, setTestTopicInput] = useState('Evaluación Oficial Baseball IQ - Módulo Situacional');

  // Toast Alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Biblioteca directly with single check
  const handleToggleLibrary = (playerId: string) => {
    setPlayerRecords((prev) =>
      prev.map((rec) => {
        if (rec.playerId === playerId) {
          const nextState = !rec.libraryEnabled;
          showToast(
            `Biblioteca ${nextState ? 'Habilitada' : 'Deshabilitada'} para ${
              players.find((p) => p.id === playerId)?.fullName
            }`
          );
          return { ...rec, libraryEnabled: nextState };
        }
        return rec;
      })
    );
  };

  // Toggle Savant directly with single check
  const handleToggleSavant = (playerId: string) => {
    setPlayerRecords((prev) =>
      prev.map((rec) => {
        if (rec.playerId === playerId) {
          const nextState = !rec.savantEnabled;
          showToast(
            `Savant ${nextState ? 'Habilitado' : 'Deshabilitado'} para ${
              players.find((p) => p.id === playerId)?.fullName
            }`
          );
          return { ...rec, savantEnabled: nextState };
        }
        return rec;
      })
    );
  };

  // Open Schedule IQ Modal for a Player
  const handleOpenScheduleModal = (record: PlayerStudioTracking) => {
    setScheduleModalRecord(record);
    setScheduledDateInput(record.iqTest.scheduledDate || '2026-08-24');
    setStartTimeInput(record.iqTest.startTime || '09:00');
    setDurationMinutesInput(record.iqTest.durationMinutes || 45);
    setTestTopicInput(record.iqTest.testTopic || 'Evaluación Oficial Baseball IQ - Módulo Situacional');
  };

  // Save IQ Schedule
  const handleSaveIqSchedule = () => {
    if (!scheduleModalRecord) return;
    const pName = players.find((p) => p.id === scheduleModalRecord.playerId)?.fullName || 'Jugador';

    setPlayerRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === scheduleModalRecord.id) {
          return {
            ...rec,
            iqTest: {
              ...rec.iqTest,
              enabled: true,
              scheduledDate: scheduledDateInput,
              startTime: startTimeInput,
              durationMinutes: Number(durationMinutesInput),
              testTopic: testTopicInput,
              status: 'programado'
            },
            lastNotificationSent: 'Hace un momento'
          };
        }
        return rec;
      })
    );

    setScheduleModalRecord(null);
    showToast(`Test IQ programado para ${pName} el ${scheduledDateInput} a las ${startTimeInput} (${durationMinutesInput} min).`);
  };

  // Calculate end time string helper
  const calculateEndTime = (startTime: string, durationMin: number) => {
    if (!startTime) return '--:--';
    const [h, m] = startTime.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return startTime;
    const totalMin = h * 60 + m + durationMin;
    const endH = Math.floor(totalMin / 60) % 24;
    const endM = totalMin % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  };

  // Filtered players list
  const filteredPlayers = players.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.signingClass.includes(searchQuery);
    const matchesPos = positionFilter === 'ALL' || p.position === positionFilter;
    return matchesSearch && matchesPos;
  });

  // Modal active player & record
  const modalPlayer = players.find((p) => p.id === selectedModalPlayerId);
  const modalRecord = playerRecords.find((r) => r.playerId === selectedModalPlayerId);

  // Filtered activities inside modal
  const modalFilteredActivities = (modalRecord?.trackingData.activityLogs || []).filter((act) => {
    if (modalBitacoraFilter === 'ALL') return true;
    return act.type === modalBitacoraFilter;
  });

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-blue-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* CLEAN TOP BAR: TITLE + VIEW SELECTOR + FILTERS */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & View Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 leading-tight">
              {activeSubTab === 'assignments' ? 'Asignaciones de Studio' : 'Mirada 360° del Estudio'}
            </h2>
            <p className="text-xs text-slate-500">
              {activeSubTab === 'assignments'
                ? 'Habilita Biblioteca, Savant y programa los Tests de Baseball IQ por prospecto.'
                : 'Métricas de aprendizaje, horas estudiadas y bitácora cronológica por atleta.'}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveSubTab('assignments')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'assignments'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Asignaciones</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('tracking360')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'tracking360'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Mirada 360°</span>
            </button>
          </div>
        </div>

        {/* Search & Position Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar prospecto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 font-medium"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {['ALL', 'SS', 'OF', 'RHP', 'LHP', 'C'].map((pos) => (
              <button
                key={pos}
                type="button"
                onClick={() => setPositionFilter(pos)}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  positionFilter === pos ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {pos === 'ALL' ? 'Todos' : pos}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: TABLA DE ASIGNACIONES (CHECKS DIRECTOS & PROGRAMADOR IQ) */}
      {/* ========================================================================= */}
      {activeSubTab === 'assignments' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Jugador</th>
                  <th className="py-3.5 px-5 text-center min-w-[130px]">
                    <div className="inline-flex items-center gap-1.5 text-slate-700">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Biblioteca</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-5 text-center min-w-[130px]">
                    <div className="inline-flex items-center gap-1.5 text-slate-700">
                      <Activity className="w-3.5 h-3.5 text-blue-600" />
                      <span>Savant</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-5 min-w-[340px]">
                    <div className="flex items-center gap-1.5 text-indigo-700">
                      <Brain className="w-3.5 h-3.5" />
                      <span>Test Baseball IQ (Día, Hora de Inicio & Duración)</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-5 text-right">Mirada 360°</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPlayers.map((player) => {
                  const record = playerRecords.find((r) => r.playerId === player.id);
                  if (!record) return null;

                  return (
                    <tr key={player.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* 1. Player info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={player.avatar}
                            alt={player.fullName}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-slate-900 leading-tight">
                              {player.fullName}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 font-mono text-[10px] font-black">
                                {player.position}
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium">
                                Clase {player.signingClass}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Biblioteca Checkbox */}
                      <td className="py-4 px-5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleLibrary(player.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                            record.libraryEnabled
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
                          }`}
                          title="Haz clic para activar o desactivar la biblioteca"
                        >
                          {record.libraryEnabled ? (
                            <>
                              <CheckSquare className="w-4 h-4 text-emerald-600" />
                              <span>Activo</span>
                            </>
                          ) : (
                            <>
                              <Square className="w-4 h-4 text-slate-400" />
                              <span>Inactivo</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* 3. Savant Checkbox */}
                      <td className="py-4 px-5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSavant(player.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                            record.savantEnabled
                              ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
                              : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
                          }`}
                          title="Haz clic para activar o desactivar Savant"
                        >
                          {record.savantEnabled ? (
                            <>
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                              <span>Activo</span>
                            </>
                          ) : (
                            <>
                              <Square className="w-4 h-4 text-slate-400" />
                              <span>Inactivo</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* 4. Test Baseball IQ Scheduler */}
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                          {record.iqTest.enabled ? (
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                                <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                                  <Calendar className="w-3 h-3 text-indigo-600" />
                                  <span>{record.iqTest.scheduledDate}</span>
                                </span>

                                <span className="inline-flex items-center gap-1 font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                                  <Clock className="w-3 h-3 text-indigo-600" />
                                  <span>
                                    {record.iqTest.startTime} ({record.iqTest.durationMinutes} min)
                                  </span>
                                </span>

                                {record.iqTest.status === 'completado' && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                    Score: {record.iqTest.score}%
                                  </span>
                                )}
                              </div>

                              <p className="text-[10px] text-slate-500 font-medium truncate max-w-[220px]">
                                {record.iqTest.testTopic}
                              </p>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              Sin prueba programada
                            </span>
                          )}

                          {/* Programar Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenScheduleModal(record)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Programar</span>
                          </button>
                        </div>
                      </td>

                      {/* 5. Actions / Open 360 Modal */}
                      <td className="py-4 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedModalPlayerId(player.id);
                            setModalBitacoraFilter('ALL');
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-bold text-xs transition-colors cursor-pointer border border-slate-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver 360°</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: MIRADA 360° (TABLA GENERAL + MODAL DE DETALLE AUDITABLE) */}
      {/* ========================================================================= */}
      {activeSubTab === 'tracking360' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Matriz General de Rendimiento Académico 360°</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              {filteredPlayers.length} Atletas Evaluados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Jugador</th>
                  <th className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-indigo-700">
                      <Brain className="w-3.5 h-3.5" />
                      <span>Baseball IQ</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Cursos & Clases</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-purple-700">
                      <Video className="w-3.5 h-3.5" />
                      <span>Video Análisis MLB</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-blue-700">
                      <Mic className="w-3.5 h-3.5" />
                      <span>Podcasts & Savant</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Última Actividad</th>
                  <th className="py-3.5 px-4 text-right">Bitácora Detallada</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPlayers.map((player) => {
                  const record = playerRecords.find((r) => r.playerId === player.id);
                  if (!record) return null;

                  return (
                    <tr
                      key={player.id}
                      onClick={() => {
                        setSelectedModalPlayerId(player.id);
                        setModalBitacoraFilter('ALL');
                      }}
                      className="hover:bg-blue-50/60 transition-colors cursor-pointer"
                    >
                      {/* 1. Player Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={player.avatar}
                            alt={player.fullName}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-slate-900 leading-tight">
                              {player.fullName}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 font-mono text-[10px] font-black">
                                {player.position}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                Clase {player.signingClass}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Baseball IQ */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-slate-900 text-sm">
                              {record.trackingData.averageIqScore}%
                            </span>
                            <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded-md ${
                              record.trackingData.iqLevel === 'Élite MLB'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-indigo-100 text-indigo-700'
                            }`}>
                              {record.trackingData.iqLevel}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 block">
                            {record.trackingData.iqTestsTaken} Evaluaciones
                          </span>
                        </div>
                      </td>

                      {/* 3. Cursos & Clases */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-xs">
                              {record.trackingData.coursesCompleted} Cursos
                            </span>
                            <span className="text-[10px] text-slate-400">
                              ({record.trackingData.coursesInProgress} en curso)
                            </span>
                          </div>
                          <span className="font-mono text-[11px] text-emerald-700 font-bold block">
                            {record.trackingData.totalHoursStudied} hrs totales
                          </span>
                        </div>
                      </td>

                      {/* 4. Video Análisis MLB */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 text-xs block">
                            {record.trackingData.videoAnalysesWatched} Jugadas MLB
                          </span>
                          <span className="text-[10px] text-purple-700 font-medium truncate block max-w-[160px]">
                            Tatis Jr. & Ohtani 240fps
                          </span>
                        </div>
                      </td>

                      {/* 5. Podcasts & Savant */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-slate-900 text-xs">
                              {record.trackingData.podcastsListened} Podcasts
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="font-bold text-blue-600 text-xs">
                              {record.trackingData.savantSessionsCount} Savant
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            {record.trackingData.topSavantMetric}
                          </span>
                        </div>
                      </td>

                      {/* 6. Última Actividad con Fecha y Hora */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-mono text-[11px] font-bold text-slate-800 block">
                            {record.trackingData.lastActiveDateTime}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Sincronizado</span>
                          </span>
                        </div>
                      </td>

                      {/* 7. Action Button */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedModalPlayerId(player.id);
                            setModalBitacoraFilter('ALL');
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition-all cursor-pointer border border-slate-200/80"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Bitácora</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: BITÁCORA DETALLADA 360° DEL JUGADOR (CON MÉTRICAS, FECHAS & HORAS) */}
      {/* ========================================================================= */}
      {modalPlayer && modalRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={modalPlayer.avatar}
                  alt={modalPlayer.fullName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/30 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">
                      {modalPlayer.fullName}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-mono text-xs font-black">
                      {modalPlayer.position}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
                      Clase {modalPlayer.signingClass}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Bitácora de estudio y actividades académicas en tiempo real • Última sincronización: <strong className="text-slate-700">{modalRecord.trackingData.lastActiveDateTime}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedModalPlayerId(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4 SUMMARY METRIC CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700">
                    Baseball IQ Score
                  </span>
                  <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
                    {modalRecord.trackingData.averageIqScore}%
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {modalRecord.trackingData.iqTestsTaken} exámenes completados
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-xs">
                  <Brain className="w-5 h-5" />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    Horas de Estudio
                  </span>
                  <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
                    {modalRecord.trackingData.totalHoursStudied} hrs
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {modalRecord.trackingData.coursesCompleted} cursos finalizados
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-xs">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">
                    Videos MLB 240fps
                  </span>
                  <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
                    {modalRecord.trackingData.videoAnalysesWatched}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Mecánicas & jugadas
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-white text-purple-600 flex items-center justify-center shadow-xs">
                  <Video className="w-5 h-5" />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">
                    Podcasts & Savant
                  </span>
                  <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
                    {modalRecord.trackingData.podcastsListened} / {modalRecord.trackingData.savantSessionsCount}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {modalRecord.trackingData.topSavantMetric}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-xs">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* CATEGORY FILTER BUTTONS */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Registro de Actividades ({modalFilteredActivities.length})</span>
              </span>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
                {[
                  { id: 'ALL', label: 'Todo' },
                  { id: 'test_iq', label: 'IQ Tests' },
                  { id: 'video_analisis', label: 'Videos MLB' },
                  { id: 'podcast', label: 'Podcasts' },
                  { id: 'curso', label: 'Cursos' },
                  { id: 'savant', label: 'Savant' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setModalBitacoraFilter(tab.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      modalBitacoraFilter === tab.id
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TABLA DE BITÁCORA REALISTA CON FECHAS Y HORAS */}
            <div className="border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[780px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-4 min-w-[160px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>Fecha & Hora</span>
                        </div>
                      </th>
                      <th className="py-3 px-4 min-w-[130px]">Herramienta</th>
                      <th className="py-3 px-4 min-w-[260px]">Actividad / Contenido</th>
                      <th className="py-3 px-4 min-w-[100px]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Duración</span>
                        </div>
                      </th>
                      <th className="py-3 px-4 min-w-[130px]">Rendimiento</th>
                      <th className="py-3 px-4 text-right">Dispositivo</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-xs">
                    {modalFilteredActivities.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                          No hay registros de actividad para la categoría seleccionada.
                        </td>
                      </tr>
                    ) : (
                      modalFilteredActivities.map((act) => (
                        <tr key={act.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* 1. Fecha & Hora Exacta */}
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-slate-800 text-xs">
                              {act.exactDateTime}
                            </span>
                          </td>

                          {/* 2. Herramienta / Badge */}
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                              act.type === 'test_iq'
                                ? 'bg-indigo-100 text-indigo-800'
                                : act.type === 'video_analisis'
                                ? 'bg-purple-100 text-purple-800'
                                : act.type === 'podcast'
                                ? 'bg-amber-100 text-amber-800'
                                : act.type === 'curso'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {act.type === 'test_iq' && <Brain className="w-3.5 h-3.5" />}
                              {act.type === 'video_analisis' && <Video className="w-3.5 h-3.5" />}
                              {act.type === 'podcast' && <Mic className="w-3.5 h-3.5" />}
                              {act.type === 'curso' && <BookOpen className="w-3.5 h-3.5" />}
                              {act.type === 'savant' && <Activity className="w-3.5 h-3.5" />}
                              <span>
                                {act.type === 'test_iq'
                                  ? 'Test IQ'
                                  : act.type === 'video_analisis'
                                  ? 'Video MLB'
                                  : act.type === 'podcast'
                                  ? 'Podcast'
                                  : act.type === 'curso'
                                  ? 'Curso'
                                  : 'Savant'}
                              </span>
                            </span>
                          </td>

                          {/* 3. Título & Detalle */}
                          <td className="py-3 px-4">
                            <div className="space-y-0.5">
                              <h4 className="font-bold text-slate-900 leading-tight">
                                {act.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 font-medium">
                                {act.detail}
                              </p>
                            </div>
                          </td>

                          {/* 4. Duración */}
                          <td className="py-3 px-4">
                            <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                              {act.duration}
                            </span>
                          </td>

                          {/* 5. Rendimiento / Métrica */}
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                              {act.scoreOrMetric}
                            </span>
                          </td>

                          {/* 6. Dispositivo Verificado */}
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                              <Laptop className="w-3.5 h-3.5 text-slate-400" />
                              <span>{act.device}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedModalPlayerId(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-md"
              >
                Cerrar Bitácora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PROGRAMAR TEST BASEBALL IQ (DÍA, HORA INICIO Y DURACIÓN) */}
      {/* ========================================================================= */}
      {scheduleModalRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3.5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                  Programación de Evaluación
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Test Baseball IQ • {players.find((p) => p.id === scheduleModalRecord.playerId)?.fullName}
                </h3>
              </div>
              <button
                onClick={() => setScheduleModalRecord(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Day, Start Time & Duration */}
            <div className="space-y-4 text-xs">
              {/* Day */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Día del Test
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={scheduledDateInput}
                    onChange={(e) => setScheduledDateInput(e.target.value)}
                    className="w-full pl-9.5 pr-4 py-2.5 rounded-xl border border-slate-300 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Start Time & Duration Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Hora de Inicio
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="time"
                      value={startTimeInput}
                      onChange={(e) => setStartTimeInput(e.target.value)}
                      className="w-full pl-9.5 pr-4 py-2.5 rounded-xl border border-slate-300 font-mono font-bold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Duración del Examen
                  </label>
                  <div className="relative">
                    <Timer className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={durationMinutesInput}
                      onChange={(e) => setDurationMinutesInput(Number(e.target.value))}
                      className="w-full pl-9.5 pr-4 py-2.5 rounded-xl border border-slate-300 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value={30}>30 Minutos</option>
                      <option value={45}>45 Minutos</option>
                      <option value={60}>60 Minutos</option>
                      <option value={90}>90 Minutos</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Summary of window */}
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-indigo-900">
                <span className="font-semibold text-[11px]">Ventana de Acceso:</span>
                <span className="font-mono font-bold text-xs">
                  {startTimeInput} a {calculateEndTime(startTimeInput, durationMinutesInput)} ({durationMinutesInput} min)
                </span>
              </div>

              {/* Test Topic */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Módulo o Tema a Evaluar
                </label>
                <input
                  type="text"
                  value={testTopicInput}
                  onChange={(e) => setTestTopicInput(e.target.value)}
                  placeholder="Ej: Situacional de Infield & Conteo 3-2"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setScheduleModalRecord(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveIqSchedule}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Confirmar Programación</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
