import React, { useState } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dumbbell,
  Edit3,
  ExternalLink,
  Eye,
  FileCheck,
  Film,
  Flame,
  Image as ImageIcon,
  Info,
  Maximize2,
  Play,
  Plus,
  Save,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  Video,
  X,
  Zap,
} from 'lucide-react';
import { CoachingSessionRecord, Player, SessionMediaEvidence, UserRole } from '../../types';

interface CoachingTabProps {
  player: Player;
  onUpdatePlayer: (updated: Player) => void;
  activeRole?: UserRole;
}

export const CoachingTab: React.FC<CoachingTabProps> = ({ player, onUpdatePlayer, activeRole }) => {
  const canDeleteHistory = activeRole !== 'admin' && activeRole !== 'scout';
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>('ALL');
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);

  // Active Media Viewer Modal State
  const [activeMediaSession, setActiveMediaSession] = useState<CoachingSessionRecord | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number>(0);

  // Active Session Detail Modal State
  const [detailModalSession, setDetailModalSession] = useState<CoachingSessionRecord | null>(null);

  // Form State for Session
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionTime, setSessionTime] = useState('08:30 AM');
  const [sessionCoachName, setSessionCoachName] = useState(player.assignedCoachName || 'Carlos Rosario');
  const [sessionCoachRole, setSessionCoachRole] = useState('Director de Bateo / Hitting Coach');
  const [sessionTrainingArea, setSessionTrainingArea] = useState<
    'Bateo & Swing' | 'Pitcheo & Bullpen' | 'Defensa & Infield/OF' | 'Fuerza, Velocidad & Físico' | 'Baseball IQ & Táctica' | 'Cuidado de Brazo & Biomecánica'
  >('Bateo & Swing');
  const [sessionDrills, setSessionDrills] = useState('');
  const [sessionDuration, setSessionDuration] = useState('60');
  const [sessionRating, setSessionRating] = useState<'Excelente' | 'Favorable' | 'En Progresión' | 'Requiere Ajuste'>('Excelente');
  const [sessionScore, setSessionScore] = useState('9.0');
  const [sessionFeedback, setSessionFeedback] = useState('');
  const [sessionNextGoal, setSessionNextGoal] = useState('');

  // Media Evidence form items in modal
  const [formMediaList, setFormMediaList] = useState<SessionMediaEvidence[]>([]);
  const [newMediaType, setNewMediaType] = useState<'video' | 'image'>('video');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaFormat, setNewMediaFormat] = useState('120 FPS Slow-Mo');
  const [newMediaNotes, setNewMediaNotes] = useState('');

  const handleOpenSessionModal = (record?: CoachingSessionRecord) => {
    if (record) {
      setEditingSessionId(record.id);
      setSessionDate(record.date);
      setSessionTime(record.time || '08:30 AM');
      setSessionCoachName(record.coachName);
      setSessionCoachRole(record.coachRole);
      setSessionTrainingArea(record.trainingArea);
      setSessionDrills(record.drillsCompleted);
      setSessionDuration(record.durationMinutes ? record.durationMinutes.toString() : '60');
      setSessionRating(record.evaluationRating);
      setSessionScore(record.performanceScore ? record.performanceScore.toString() : '9.0');
      setSessionFeedback(record.coachFeedback);
      setSessionNextGoal(record.nextStepGoal || '');
      setFormMediaList(record.mediaEvidence ? [...record.mediaEvidence] : []);
    } else {
      setEditingSessionId(null);
      setSessionDate(new Date().toISOString().split('T')[0]);
      setSessionTime('08:30 AM');
      setSessionCoachName(player.assignedCoachName || 'Carlos Rosario');
      setSessionCoachRole('Director de Bateo / Hitting Coach');
      setSessionTrainingArea('Bateo & Swing');
      setSessionDrills('Rutina de 60 contactos en jaula de bateo con máquina a 88-92 MPH. Drills con tee alto para corrección de plano de ataque.');
      setSessionDuration('60');
      setSessionRating('Excelente');
      setSessionScore('9.2');
      setSessionFeedback('Gran respuesta muscular y ajuste en la zona alta de strike.');
      setSessionNextGoal('Consolidar velocidad de swing en conteos desfavorables.');
      setFormMediaList([
        {
          id: `med-${Date.now()}`,
          type: 'video',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=600&q=80',
          title: 'Toma Lateral 120 FPS - Jaula de Bateo',
          fpsOrFormat: '120 FPS Slow-Mo',
          notes: 'Análisis biomecánico del plano de swing.',
        },
      ]);
    }
    // reset single media entry
    setNewMediaType('video');
    setNewMediaUrl('');
    setNewMediaTitle('');
    setNewMediaFormat('120 FPS Slow-Mo');
    setNewMediaNotes('');
    setShowSessionModal(true);
  };

  const handleAddMediaItem = () => {
    if (!newMediaUrl) return;
    const newItem: SessionMediaEvidence = {
      id: `med-${Date.now()}`,
      type: newMediaType,
      url: newMediaUrl,
      thumbnailUrl:
        newMediaType === 'image'
          ? newMediaUrl
          : 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=600&q=80',
      title: newMediaTitle || (newMediaType === 'video' ? 'Video Técnico de Sesión' : 'Foto Técnica de Mecánica'),
      fpsOrFormat: newMediaFormat || (newMediaType === 'video' ? '60 FPS HD' : 'Foto Técnica HD'),
      notes: newMediaNotes || undefined,
    };
    setFormMediaList([...formMediaList, newItem]);
    setNewMediaUrl('');
    setNewMediaTitle('');
    setNewMediaNotes('');
  };

  const handleRemoveMediaItem = (id: string) => {
    setFormMediaList(formMediaList.filter((m) => m.id !== id));
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    const currentList = player.coachingSessions || [];
    let updatedList: CoachingSessionRecord[];

    const recordData: Omit<CoachingSessionRecord, 'id'> = {
      date: sessionDate,
      time: sessionTime,
      coachName: sessionCoachName,
      coachRole: sessionCoachRole,
      trainingArea: sessionTrainingArea,
      drillsCompleted: sessionDrills,
      durationMinutes: Number(sessionDuration) || undefined,
      evaluationRating: sessionRating,
      performanceScore: Number(sessionScore) || undefined,
      coachFeedback: sessionFeedback,
      nextStepGoal: sessionNextGoal || undefined,
      mediaEvidence: formMediaList.length > 0 ? formMediaList : undefined,
    };

    if (editingSessionId) {
      updatedList = currentList.map((item) =>
        item.id === editingSessionId ? { ...item, ...recordData } : item
      );
    } else {
      const newItem: CoachingSessionRecord = {
        id: `cs-${Date.now()}`,
        ...recordData,
      };
      updatedList = [newItem, ...currentList];
    }

    onUpdatePlayer({
      ...player,
      coachingSessions: updatedList,
    });
    setShowSessionModal(false);
  };

  const handleDeleteSession = (id: string) => {
    if (confirm('¿Confirmas que deseas eliminar este registro de sesión de entrenamiento?')) {
      const updatedList = (player.coachingSessions || []).filter((item) => item.id !== id);
      onUpdatePlayer({
        ...player,
        coachingSessions: updatedList,
      });
    }
  };

  const handleOpenMediaViewer = (session: CoachingSessionRecord, initialIndex = 0) => {
    setActiveMediaSession(session);
    setSelectedMediaIndex(initialIndex);
  };

  const sessionsList = player.coachingSessions || [];

  const filteredSessions = sessionsList.filter((s) => {
    if (selectedAreaFilter === 'ALL') return true;
    return s.trainingArea === selectedAreaFilter;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            Bitácora de Sesiones de Entrenamiento & Acompañamiento de Coaches
          </h4>
          <p className="text-xs text-slate-500">
            Registro cronológico del trabajo diario con evidencia en video e imágenes para auditoría biomecánica y seguimiento
          </p>
        </div>

        <button
          onClick={() => handleOpenSessionModal()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Registrar Sesión de Trabajo
        </button>
      </div>

      {/* Filter by Technical Area */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
          {[
            { key: 'ALL', label: 'Todas las Áreas' },
            { key: 'Bateo & Swing', label: '🏏 Bateo' },
            { key: 'Defensa & Infield/OF', label: '🧤 Defensa' },
            { key: 'Fuerza, Velocidad & Físico', label: '🏋️‍♂️ Físico' },
            { key: 'Baseball IQ & Táctica', label: '🧠 IQ & Video' },
            { key: 'Pitcheo & Bullpen', label: '⚾ Pitcheo' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setSelectedAreaFilter(item.key)}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedAreaFilter === item.key
                  ? 'bg-white text-blue-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-semibold">
          {filteredSessions.length} de {sessionsList.length} sesiones registradas
        </span>
      </div>

      {/* Main Executive Table - 100% Width without Horizontal Scrolling */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
          <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">Sin sesiones de trabajo registradas en este filtro</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Registra el trabajo técnico y las evidencias en video o fotos que los entrenadores realizan con el atleta.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-2.5 px-3 font-extrabold uppercase text-[10px] tracking-wider w-[24%]">
                  Fecha & Coach
                </th>
                <th className="py-2.5 px-3 font-extrabold uppercase text-[10px] tracking-wider w-[18%]">
                  Área & Evidencia
                </th>
                <th className="py-2.5 px-3 font-extrabold uppercase text-[10px] tracking-wider w-[16%]">
                  Evaluación
                </th>
                <th className="py-2.5 px-3 font-extrabold uppercase text-[10px] tracking-wider w-[34%]">
                  Trabajo & Feedback
                </th>
                <th className="py-2.5 px-3 font-extrabold uppercase text-[10px] tracking-wider text-right w-[8%]">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSessions.map((session) => {
                const mediaCount = session.mediaEvidence?.length || 0;
                const firstMedia = session.mediaEvidence?.[0];

                return (
                  <tr key={session.id} className="hover:bg-slate-50/80 transition-colors align-top">
                    {/* 1. Date & Coach Info */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{session.date}</span>
                        {session.durationMinutes && (
                          <span className="text-[10px] text-slate-500 font-normal">({session.durationMinutes}m)</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-700 font-semibold mt-0.5 truncate">
                        <UserCheck className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{session.coachName}</span>
                      </div>
                      <div className="text-[9px] text-blue-700 font-medium truncate max-w-[170px]">
                        {session.coachRole}
                      </div>
                    </td>

                    {/* 2. Area & Media Badge */}
                    <td className="py-2.5 px-3">
                      <div className="mb-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200 inline-block truncate max-w-full">
                          {session.trainingArea}
                        </span>
                      </div>
                      {mediaCount > 0 && session.mediaEvidence ? (
                        <button
                          onClick={() => handleOpenMediaViewer(session, 0)}
                          className="group inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-md transition-all text-[10px] font-bold shadow-2xs hover:scale-102 cursor-pointer"
                          title="Ver evidencia en video o imagen"
                        >
                          {firstMedia?.type === 'video' ? (
                            <Film className="w-3 h-3 text-blue-600 shrink-0" />
                          ) : (
                            <Camera className="w-3 h-3 text-indigo-600 shrink-0" />
                          )}
                          <span>
                            {mediaCount === 1
                              ? firstMedia?.type === 'video'
                                ? '🎬 1 Video'
                                : '📸 1 Foto'
                              : `📁 ${mediaCount} Archivos`}
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenSessionModal(session)}
                          className="px-1.5 py-0.5 text-[9px] text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-dashed border-slate-200 hover:border-blue-300 rounded transition-all inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5" /> Evidencia
                        </button>
                      )}
                    </td>

                    {/* 3. Evaluation & Score */}
                    <td className="py-2.5 px-3">
                      <div className="mb-0.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1 ${
                            session.evaluationRating === 'Excelente'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : session.evaluationRating === 'Favorable'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : session.evaluationRating === 'En Progresión'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {session.evaluationRating}
                        </span>
                      </div>
                      {session.performanceScore && (
                        <div className="text-[10px] font-mono font-bold text-slate-700">
                          Score: <span className="text-blue-700">{session.performanceScore.toFixed(1)}</span>/10
                        </div>
                      )}
                    </td>

                    {/* 4. Drills, Feedback & "Ver más..." */}
                    <td className="py-2.5 px-3">
                      <p className="text-[11px] text-slate-700 line-clamp-1 font-medium leading-tight">
                        {session.drillsCompleted}
                      </p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-500 line-clamp-1 italic truncate">
                          "{session.coachFeedback}"
                        </span>
                        <button
                          onClick={() => setDetailModalSession(session)}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-800 hover:underline shrink-0 flex items-center gap-0.5 cursor-pointer bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded"
                          title="Ver detalle completo de la sesión"
                        >
                          Ver más...
                        </button>
                      </div>
                    </td>

                    {/* 5. Actions */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setDetailModalSession(session)}
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all cursor-pointer"
                          title="Ver detalle completo"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenSessionModal(session)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-all cursor-pointer"
                          title="Modificar sesión"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {canDeleteHistory && (
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer"
                            title="Eliminar sesión"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL PEQUEÑO: DETALLE COMPLETO DE LA SESIÓN DE COACHING */}
      {/* ------------------------------------------------------------- */}
      {detailModalSession && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    Detalle de Sesión de Coaching
                  </h4>
                  <p className="text-xs text-slate-500">
                    {detailModalSession.trainingArea} • {detailModalSession.date} {detailModalSession.time && `(${detailModalSession.time})`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDetailModalSession(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Coach & Evaluation Info Card */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Coach Responsable</span>
                <div className="font-bold text-slate-900">{detailModalSession.coachName}</div>
                <div className="text-[10px] text-blue-700 font-medium">{detailModalSession.coachRole}</div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Evaluación & Duración</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1 ${
                      detailModalSession.evaluationRating === 'Excelente'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : detailModalSession.evaluationRating === 'Favorable'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : detailModalSession.evaluationRating === 'En Progresión'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {detailModalSession.evaluationRating}
                  </span>
                  {detailModalSession.performanceScore && (
                    <span className="text-[11px] font-mono font-bold text-blue-700">
                      ({detailModalSession.performanceScore.toFixed(1)}/10)
                    </span>
                  )}
                </div>
                {detailModalSession.durationMinutes && (
                  <div className="text-[10px] text-slate-500 mt-0.5 font-semibold">
                    Duración: {detailModalSession.durationMinutes} minutos
                  </div>
                )}
              </div>
            </div>

            {/* Drills Section */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1">
                <Dumbbell className="w-3.5 h-3.5 text-blue-600" />
                Drills y Trabajo Específico Realizado
              </span>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium leading-relaxed">
                {detailModalSession.drillsCompleted}
              </div>
            </div>

            {/* Coach Feedback Section */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Feedback Técnico del Coach
              </span>
              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-slate-800 leading-relaxed font-medium">
                {detailModalSession.coachFeedback}
              </div>
            </div>

            {/* Next Goal */}
            {detailModalSession.nextStepGoal && (
              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-start gap-2">
                <Target className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-[11px]">Próxima Meta / Objetivo:</span>
                  <span className="font-medium">{detailModalSession.nextStepGoal}</span>
                </div>
              </div>
            )}

            {/* Media Evidence Quick Launcher */}
            {detailModalSession.mediaEvidence && detailModalSession.mediaEvidence.length > 0 && (
              <div className="p-3 bg-slate-900 text-white rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-600/30 text-blue-400">
                    <Film className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">
                      {detailModalSession.mediaEvidence.length === 1
                        ? '1 Evidencia Multimedia Adjunta'
                        : `${detailModalSession.mediaEvidence.length} Evidencias Multimedia`}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {detailModalSession.mediaEvidence[0].title}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const sess = detailModalSession;
                    setDetailModalSession(null);
                    handleOpenMediaViewer(sess, 0);
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Ver Evidencia
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  const sess = detailModalSession;
                  setDetailModalSession(null);
                  handleOpenSessionModal(sess);
                }}
                className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Editar Esta Sesión
              </button>

              <button
                onClick={() => setDetailModalSession(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: MEDIA VIEWER (VIDEOS & TECHNICAL PHOTOS) */}
      {/* ------------------------------------------------------------- */}
      {activeMediaSession && activeMediaSession.mediaEvidence && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 text-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-800 space-y-0 animate-in zoom-in-95 flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  {activeMediaSession.mediaEvidence[selectedMediaIndex]?.type === 'video' ? (
                    <Film className="w-5 h-5" />
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    {activeMediaSession.mediaEvidence[selectedMediaIndex]?.title || 'Evidencia de Entrenamiento'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Sesión de {activeMediaSession.trainingArea} • {activeMediaSession.date} • Coach: {activeMediaSession.coachName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveMediaSession(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Content Body */}
            <div className="bg-black relative aspect-video flex items-center justify-center overflow-hidden shrink-0">
              {activeMediaSession.mediaEvidence[selectedMediaIndex]?.type === 'video' ? (
                <video
                  key={activeMediaSession.mediaEvidence[selectedMediaIndex]?.url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  src={activeMediaSession.mediaEvidence[selectedMediaIndex]?.url}
                  poster={activeMediaSession.mediaEvidence[selectedMediaIndex]?.thumbnailUrl}
                >
                  Tu navegador no soporta reproducción de video.
                </video>
              ) : (
                <img
                  src={activeMediaSession.mediaEvidence[selectedMediaIndex]?.url}
                  alt="Evidencia técnica"
                  className="w-full h-full object-contain"
                />
              )}

              {/* Tag overlay */}
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur-xs rounded-lg text-[10px] font-bold text-white border border-white/10 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>{activeMediaSession.mediaEvidence[selectedMediaIndex]?.fpsOrFormat || 'Evidencia HD'}</span>
              </div>
            </div>

            {/* Multiple media selector bar */}
            {activeMediaSession.mediaEvidence.length > 1 && (
              <div className="px-5 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                  Archivos ({activeMediaSession.mediaEvidence.length}):
                </span>
                {activeMediaSession.mediaEvidence.map((media, idx) => (
                  <button
                    key={media.id}
                    onClick={() => setSelectedMediaIndex(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectedMediaIndex === idx
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {media.type === 'video' ? <Film className="w-3 h-3" /> : <Camera className="w-3 h-3" />}
                    <span>{media.title || `Archivo ${idx + 1}`}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Feedback & Notes Section */}
            <div className="p-4 sm:p-5 bg-slate-900 space-y-2 text-xs overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                    Drills y Trabajo Ejecutado
                  </span>
                  <p className="text-slate-200 text-xs font-medium">
                    {activeMediaSession.drillsCompleted}
                  </p>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                    Feedback del Coach ({activeMediaSession.coachName})
                  </span>
                  <p className="text-slate-200 text-xs font-medium">
                    {activeMediaSession.coachFeedback}
                  </p>
                </div>
              </div>

              {activeMediaSession.mediaEvidence[selectedMediaIndex]?.notes && (
                <div className="p-2.5 bg-blue-950/40 border border-blue-800/40 rounded-xl text-blue-200 text-[11px] flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Nota técnica de la toma: {activeMediaSession.mediaEvidence[selectedMediaIndex].notes}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setActiveMediaSession(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT COACHING SESSION WITH MEDIA EVIDENCE */}
      {/* ------------------------------------------------------------- */}
      {showSessionModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                {editingSessionId ? 'Editar Sesión de Trabajo con Coach' : 'Registrar Nueva Sesión de Entrenamiento'}
              </h4>
              <button
                onClick={() => setShowSessionModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-4 text-xs">
              {/* Basic Details */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Horario</label>
                  <input
                    type="text"
                    required
                    placeholder="08:30 AM"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duración (minutos)</label>
                  <input
                    type="number"
                    placeholder="60"
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Coach Responsable</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Carlos Rosario"
                    value={sessionCoachName}
                    onChange={(e) => setSessionCoachName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Especialidad / Rol del Coach</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Director de Bateo / Hitting Coach"
                    value={sessionCoachRole}
                    onChange={(e) => setSessionCoachRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Área Técnica de Trabajo</label>
                  <select
                    value={sessionTrainingArea}
                    onChange={(e) => setSessionTrainingArea(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800"
                  >
                    <option value="Bateo & Swing">🏏 Bateo & Swing</option>
                    <option value="Defensa & Infield/OF">🧤 Defensa & Infield/OF</option>
                    <option value="Fuerza, Velocidad & Físico">🏋️‍♂️ Fuerza, Velocidad & Físico</option>
                    <option value="Baseball IQ & Táctica">🧠 Baseball IQ & Táctica</option>
                    <option value="Pitcheo & Bullpen">⚾ Pitcheo & Bullpen</option>
                    <option value="Cuidado de Brazo & Biomecánica">🩺 Cuidado de Brazo & Biomecánica</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Calificación de Desempeño</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={sessionRating}
                      onChange={(e) => setSessionRating(e.target.value as any)}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800"
                    >
                      <option value="Excelente">Excelente</option>
                      <option value="Favorable">Favorable</option>
                      <option value="En Progresión">En Progresión</option>
                      <option value="Requiere Ajuste">Requiere Ajuste</option>
                    </select>

                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="10"
                      placeholder="9.0"
                      value={sessionScore}
                      onChange={(e) => setSessionScore(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-700 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Drills y Trabajo Específico Realizado</label>
                <textarea
                  rows={2}
                  required
                  placeholder="ej. 60 swings en jaula a 90 MPH. Drills de cadera y extensión de brazos..."
                  value={sessionDrills}
                  onChange={(e) => setSessionDrills(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Feedback Técnico del Coach</label>
                <textarea
                  rows={2}
                  required
                  placeholder="ej. Gran fluidez y potencia de salida. Mantuvo la cabeza fija..."
                  value={sessionFeedback}
                  onChange={(e) => setSessionFeedback(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Próxima Meta / Objetivo del Siguiente Entrenamiento</label>
                <input
                  type="text"
                  placeholder="ej. Seguir trabajando la disciplina en zona alta de strike"
                  value={sessionNextGoal}
                  onChange={(e) => setSessionNextGoal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              {/* SECTION: EVIDENCIA MULTIMEDIA (VIDEOS / FOTOS) */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-blue-600" />
                    Evidencia Multimedia (Videos & Fotos Técnicas)
                  </h5>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {formMediaList.length} archivos adjuntos
                  </span>
                </div>

                {/* List of current media items */}
                {formMediaList.length > 0 && (
                  <div className="space-y-2">
                    {formMediaList.map((media) => (
                      <div
                        key={media.id}
                        className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 gap-2"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                            {media.type === 'video' ? <Film className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                          </div>
                          <div className="truncate">
                            <div className="font-bold text-slate-900 text-xs truncate">{media.title}</div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-2">
                              <span>{media.fpsOrFormat || media.type.toUpperCase()}</span>
                              <span className="font-mono truncate max-w-[200px]">{media.url}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveMediaItem(media.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sub-form to add new media item */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2.5">
                  <span className="text-[11px] font-bold text-slate-800 block">
                    + Adjuntar Nuevo Video o Fotografía
                  </span>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-0.5 text-[10px]">Tipo</label>
                      <select
                        value={newMediaType}
                        onChange={(e) => setNewMediaType(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-bold text-slate-800 text-xs"
                      >
                        <option value="video">🎬 Video</option>
                        <option value="image">📸 Imagen / Foto</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="font-semibold text-slate-600 block mb-0.5 text-[10px]">Título de la Toma / Ángulo</label>
                      <input
                        type="text"
                        placeholder="ej. Toma Lateral 120 FPS Jaula"
                        value={newMediaTitle}
                        onChange={(e) => setNewMediaTitle(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="font-semibold text-slate-600 block mb-0.5 text-[10px]">URL del Video / Imagen (MP4 o HTTPS)</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newMediaUrl}
                        onChange={(e) => setNewMediaUrl(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-600 block mb-0.5 text-[10px]">Formato / FPS</label>
                      <input
                        type="text"
                        placeholder="120 FPS Slow-Mo"
                        value={newMediaFormat}
                        onChange={(e) => setNewMediaFormat(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={!newMediaUrl}
                      onClick={handleAddMediaItem}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Agregar Archivo
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Guardar Sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
