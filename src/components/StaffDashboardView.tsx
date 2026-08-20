import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Award,
  BookOpen,
  Brain,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Edit3,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Flame,
  Gauge,
  GraduationCap,
  MapPin,
  Medal,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  UserCheck,
  UserPlus,
  Users,
  Video,
  X,
  Zap,
} from 'lucide-react';
import { COACHES_STAFF } from '../data/mockData';
import {
  AcademyProfile,
  CoachAcademyExperience,
  CoachEventParticipation,
  CoachPlayerMentorship,
  CoachStaff,
  Player,
} from '../types';

interface StaffDashboardViewProps {
  academy: AcademyProfile;
  players: Player[];
  coach?: CoachStaff;
  coaches?: CoachStaff[];
  onNavigateTab: (tab: string) => void;
  onSelectPlayer: (player: Player) => void;
}

// Initial mock data for the coach's rich career profile
const INITIAL_MENTORSHIPS: CoachPlayerMentorship[] = [
  {
    id: 'ment-1',
    playerName: 'Maikol Orozco',
    playerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    position: 'SS / Shortstop',
    signingClass: '2026',
    trainingFocus: 'Mecánica de swing, ángulo de ataque (Launch Angle) y velocidad de salida',
    period: '2023 - Presente',
    status: 'En Desarrollo Activo',
    progressHighlight: 'De 88.0 MPH a 99.4 MPH Exit Velo (Incremento +11.4 MPH)',
  },
  {
    id: 'ment-2',
    playerName: 'Yadier Peña',
    playerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    position: 'OF / Jardinero Central',
    signingClass: '2027',
    trainingFocus: 'Aceleración en 60 yardas y transferencia rápida de swing en zona alta',
    period: '2024 - Presente',
    status: 'En Desarrollo Activo',
    progressHighlight: 'Bajó de 6.85s a 6.52s en 60 Yds • Bat Speed 78.4 MPH',
  },
  {
    id: 'ment-3',
    playerName: 'Rafael Devers Jr.',
    playerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    position: '3B / Tercera Base',
    signingClass: '2024',
    signingTeam: 'Boston Red Sox (Bono $1.85M)',
    trainingFocus: 'Potencia hacia la banda contraria y disciplina en zona de strike',
    period: '2021 - 2024',
    status: 'Firmado Pro',
    progressHighlight: 'Firmado como prospecto internacional top 10 de su clase',
  },
  {
    id: 'ment-4',
    playerName: 'Cristian ' + 'Almánzar',
    playerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    position: 'C / Receptor',
    signingClass: '2023',
    signingTeam: 'New York Yankees (Bono $950K)',
    trainingFocus: 'Pop time de 1.88s, bloqueo lateral y framing analítico',
    period: '2020 - 2023',
    status: 'Firmado Pro',
    progressHighlight: 'Pop time élite de 1.84s en Combine Internacional MLB',
  },
];

const INITIAL_ACADEMY_HISTORY: CoachAcademyExperience[] = [
  {
    id: 'acad-exp-1',
    academyName: 'Caribe Baseball Academy',
    roleTitle: 'Head Trainer & Director de Desarrollo de Bateo',
    period: '2020 - Presente (6 años)',
    location: 'Boca Chica, República Dominicana',
    achievements: 'Lideró el programa de desarrollo ofensivo que logró 8 firmas MLB directas y 100% de elegibilidad en combines internacionales.',
    status: 'actual',
  },
  {
    id: 'acad-exp-2',
    academyName: 'Academia Quisqueya Pro',
    roleTitle: 'Instructor Senior de Infield & Bateo Avanzado',
    period: '2016 - 2020 (4 años)',
    location: 'San Pedro de Macorís, RD',
    achievements: 'Diseñó el currículo de fundamentos defensivos para infielders de Clase 2018-2020.',
    status: 'anterior',
  },
  {
    id: 'acad-exp-3',
    academyName: 'San Pedro Talent Hub & Minor League Camps',
    roleTitle: 'Hitting Coach & Coordinador Físico',
    period: '2012 - 2016 (4 años)',
    location: 'San Pedro de Macorís, RD',
    achievements: 'Coordinó clínicas de pretemporada para más de 60 prospectos juveniles de la región este.',
    status: 'anterior',
  },
];

const INITIAL_EVENTS: CoachEventParticipation[] = [
  {
    id: 'ev-1',
    eventName: 'Showcase Internacional Prospectos del Caribe 2026',
    type: 'Showcase Internacional',
    date: '15 - 18 de Julio, 2026',
    location: 'Estadio Quisqueya Juan Marichal, Santo Domingo',
    roleInEvent: 'Evaluador Principal de Bateo & Coach de Campo',
    playersShowcasedCount: 12,
    highlightNotes: '30 organizaciones MLB presentes; 4 de sus prospectos superaron 98 MPH de Exit Velo.',
  },
  {
    id: 'ev-2',
    eventName: 'MLB International Prospect Combine Boca Chica',
    type: 'Tryout MLB',
    date: '10 - 12 de Marzo, 2026',
    location: 'Boca Chica Complex, RD',
    roleInEvent: 'Coach de Práctica de Bateo (BP) & Supervisor Biomecánico',
    playersShowcasedCount: 8,
    highlightNotes: 'Presentación oficial de la Clase 2026 ante Directores de Scouting Internacional.',
  },
  {
    id: 'ev-3',
    eventName: 'Torneo Nacional de Academias Élite U-16',
    type: 'Torneo Nacional',
    date: 'Noviembre 2025',
    location: 'Santiago de los Caballeros, RD',
    roleInEvent: 'Manager Principal & Coordinador Ofensivo',
    playersShowcasedCount: 18,
    highlightNotes: 'Equipo campeón con récord de 7-1 y promedio ofensivo colectivo de .318.',
  },
];

export const StaffDashboardView: React.FC<StaffDashboardViewProps> = ({
  academy,
  players,
  coach = COACHES_STAFF[0],
  coaches = COACHES_STAFF,
  onNavigateTab,
  onSelectPlayer,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'mentorships' | 'academies' | 'events' | 'athletes'>('profile');

  // State for coach mentorships, academy history and events
  const [mentorships, setMentorships] = useState<CoachPlayerMentorship[]>(INITIAL_MENTORSHIPS);
  const [academyHistory, setAcademyHistory] = useState<CoachAcademyExperience[]>(INITIAL_ACADEMY_HISTORY);
  const [eventParticipations, setEventParticipations] = useState<CoachEventParticipation[]>(INITIAL_EVENTS);

  // Modals
  const [showAddMentorshipModal, setShowAddMentorshipModal] = useState(false);
  const [showAddAcademyModal, setShowAddAcademyModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  // New Mentorship Form
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPosition, setNewPosition] = useState('SS');
  const [newSigningClass, setNewSigningClass] = useState('2026');
  const [newTrainingFocus, setNewTrainingFocus] = useState('');
  const [newStatus, setNewStatus] = useState<CoachPlayerMentorship['status']>('En Desarrollo Activo');
  const [newHighlight, setNewHighlight] = useState('');
  const [newSigningTeam, setNewSigningTeam] = useState('');

  // New Academy Form
  const [newAcadName, setNewAcadName] = useState('');
  const [newAcadRole, setNewAcadRole] = useState('');
  const [newAcadPeriod, setNewAcadPeriod] = useState('');
  const [newAcadLocation, setNewAcadLocation] = useState('');
  const [newAcadAchievements, setNewAcadAchievements] = useState('');

  // New Event Form
  const [newEventName, setNewEventName] = useState('');
  const [newEventType, setNewEventType] = useState<CoachEventParticipation['type']>('Tryout MLB');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventRole, setNewEventRole] = useState('');
  const [newEventPlayersCount, setNewEventPlayersCount] = useState(6);
  const [newEventNotes, setNewEventNotes] = useState('');

  // Assigned athletes to this coach
  const assignedPlayers = players.filter(
    (p) => p.assignedCoachId === coach.id || p.position === 'SS' || p.position === 'OF' || p.position === '3B' || p.position === '2B'
  );

  // Handlers
  const handleAddMentorship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    const newItem: CoachPlayerMentorship = {
      id: `ment-${Date.now()}`,
      playerName: newPlayerName,
      playerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      position: newPosition,
      signingClass: newSigningClass,
      trainingFocus: newTrainingFocus || 'Desarrollo de potencia y fundamentos biomecánicos',
      period: `${new Date().getFullYear()} - Presente`,
      status: newStatus,
      progressHighlight: newHighlight || 'Progreso continuo de métricas verificado',
      signingTeam: newStatus === 'Firmado Pro' ? newSigningTeam : undefined,
    };

    setMentorships([newItem, ...mentorships]);
    setShowAddMentorshipModal(false);
    setNewPlayerName('');
    setNewTrainingFocus('');
    setNewHighlight('');
    setNewSigningTeam('');
  };

  const handleAddAcademy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAcadName.trim()) return;

    const newItem: CoachAcademyExperience = {
      id: `acad-exp-${Date.now()}`,
      academyName: newAcadName,
      roleTitle: newAcadRole || 'Instructor Especialista',
      period: newAcadPeriod || `${new Date().getFullYear()}`,
      location: newAcadLocation || 'República Dominicana',
      achievements: newAcadAchievements || 'Desarrollo técnico y formación de prospectos de firma.',
      status: 'anterior',
    };

    setAcademyHistory([newItem, ...academyHistory]);
    setShowAddAcademyModal(false);
    setNewAcadName('');
    setNewAcadRole('');
    setNewAcadPeriod('');
    setNewAcadLocation('');
    setNewAcadAchievements('');
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim()) return;

    const newItem: CoachEventParticipation = {
      id: `ev-${Date.now()}`,
      eventName: newEventName,
      type: newEventType,
      date: newEventDate || '2026',
      location: newEventLocation || 'Santo Domingo, RD',
      roleInEvent: newEventRole || 'Evaluador Técnico de Campo',
      playersShowcasedCount: Number(newEventPlayersCount) || 5,
      highlightNotes: newEventNotes,
    };

    setEventParticipations([newItem, ...eventParticipations]);
    setShowAddEventModal(false);
    setNewEventName('');
    setNewEventLocation('');
    setNewEventRole('');
    setNewEventNotes('');
  };

  return (
    <div id="staff-dashboard-view" className="space-y-6 sm:space-y-8 animate-in fade-in duration-200 pb-16">
      {/* ========================================================================= */}
      {/* 1. TOP COACH PROFESSIONAL PROFILE BANNER */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/80 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        {/* Left Side: Avatar, Name & Specialty */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 min-w-0">
          <div className="relative shrink-0">
            <img
              src={coach.avatar}
              alt={coach.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-3 border-blue-500/20 shadow-md"
            />
            <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center border-2 border-white shadow-xs" title="Entrenador Certificado">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {coach.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black">
                {coach.roleTitle}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{coach.rating || 4.9} ★</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Especialidad Principal: <strong className="text-slate-900">{coach.specialty || 'Bateo, Biomecánica & Infield Moderno'}</strong>
            </p>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1 text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Academia Matriz: <strong className="text-slate-900">{academy.name}</strong></span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{coach.hometown || 'San Pedro de Macorís, RD'}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-700 font-bold">
                {coach.yearsExperience || 18} Años de Trayectoria
              </span>
            </div>

            {/* Certifications tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {(coach.certifications || ['MLB Hitting Certified', 'TrackMan Pro Level 2', 'Blast Motion Certified']).map((cert, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200"
                >
                  ✓ {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Quick Career Impact KPIs */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 shrink-0 pt-3 xl:pt-0 border-t xl:border-t-0 border-slate-100">
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-center min-w-[110px]">
            <span className="text-2xl font-black text-blue-900 font-mono block">
              {coach.athletesTrainedCount || 42}+
            </span>
            <span className="text-[10px] uppercase tracking-wider font-black text-blue-700">
              Atletas Formados
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center min-w-[110px]">
            <span className="text-2xl font-black text-emerald-900 font-mono block">
              {coach.mlbSigningsCount || 14}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-black text-emerald-700">
              Firmas MLB Pro
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-center min-w-[110px]">
            <span className="text-2xl font-black text-purple-950 font-mono block">
              97.8
            </span>
            <span className="text-[10px] uppercase tracking-wider font-black text-purple-700">
              Avg Exit Velo
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. COACH NAVIGATION TABS (PROFESSIONAL HUBS) */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Perfil & Credenciales</span>
        </button>

        <button
          onClick={() => setActiveTab('mentorships')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'mentorships'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Trayectoria con Jugadores ({mentorships.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('academies')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'academies'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Historial de Academias ({academyHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'events'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Tryouts & Eventos ({eventParticipations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('athletes')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'athletes'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Mis Atletas Actuales ({assignedPlayers.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. TAB 1: PERFIL PROFESIONAL & BIOGRAFÍA TÉCNICA */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-150">
          {/* Col 1 & 2: Bio & Philosophy */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>Filosofía de Entrenamiento & Biografía Profesional</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                  Perfil Verificado Glovall
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {coach.bio ||
                  'Ex-jugador profesional con 18 años formando prospectos de impacto internacional. Especialista en biomecánica del bateo, optimización de velocidad de salida (Exit Velocity) y desarrollo cognitivo de Baseball IQ en situaciones de alta presión.'}
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900">Enfoque de Metodología de Alto Rendimiento:</h4>
                <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                  <li>Uso intensivo de sensores TrackMan y Blast Motion para calibrar planos de ataque y aceleración de swing.</li>
                  <li>Reestructuración neuromuscular de corredores de bases para bajar tiempos en las 60 yardas.</li>
                  <li>Evaluaciones cognitivas continuas de Baseball IQ sincronizadas con el módulo Studio.</li>
                </ul>
              </div>
            </div>

            {/* Specialties Matrix */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Áreas de Especialización Técnica</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(coach.specialties || ['Bateo & Potencia', 'Mecánica de Swings', 'Optimización de Launch Angle', 'Infield Moderno']).map((spec, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{spec}</h4>
                      <p className="text-[10px] text-slate-500">Programa certificado con TrackMan</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Col 3: Contact & Quick Links */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Información de Contacto & Disponibilidad
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Teléfono / WhatsApp</span>
                  <span className="font-bold text-slate-900">{coach.phone || '+1 (809) 555-0192'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Correo Profesional</span>
                  <span className="font-bold text-slate-900">{coach.email || 'crosario@caribebaseball.do'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Estatus de Contrato</span>
                  <span className="font-black text-blue-700">Tiempo Completo (Exclusivo Caribe Academy)</span>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('biomechanics')}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Video className="w-4 h-4" />
                <span>Abrir Studio Biomecánico</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB 2: TRAYECTORIA CON JUGADORES & MENTORÍAS */}
      {/* ========================================================================= */}
      {activeTab === 'mentorships' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Trayectoria de Entrenamiento & Mentorías con Jugadores</span>
              </h3>
              <p className="text-xs text-slate-500">
                Historial documentado de prospectos desarrollados por este entrenador, incluyendo firmas profesionales MLB y aumentos de métricas.
              </p>
            </div>

            <button
              onClick={() => setShowAddMentorshipModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Jugador Formado</span>
            </button>
          </div>

          {/* Mentorships List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentorships.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3 hover:border-blue-300 transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={m.playerAvatar}
                      alt={m.playerName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-xs text-slate-900 truncate">{m.playerName}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold">
                          {m.position}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Clase {m.signingClass} • Período: <strong>{m.period}</strong>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                      m.status === 'Firmado Pro'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                {m.signingTeam && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-2">
                    <Medal className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Firma MLB: {m.signingTeam}</span>
                  </div>
                )}

                <div className="space-y-1 text-xs">
                  <p className="text-slate-700">
                    <strong className="text-slate-900">Enfoque Técnico:</strong> {m.trainingFocus}
                  </p>
                  <p className="text-blue-700 font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span>Logro Clave: {m.progressHighlight}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 3: HISTORIAL DE ACADEMIAS */}
      {/* ========================================================================= */}
      {activeTab === 'academies' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>Historial de Academias & Centros de Desarrollo</span>
              </h3>
              <p className="text-xs text-slate-500">
                Instituciones y academias de béisbol donde el entrenador ha desempeñado roles técnicos.
              </p>
            </div>

            <button
              onClick={() => setShowAddAcademyModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Experiencia</span>
            </button>
          </div>

          {/* Academy Timeline */}
          <div className="space-y-4">
            {academyHistory.map((acad, idx) => (
              <div
                key={acad.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  acad.status === 'actual'
                    ? 'bg-blue-50/50 border-blue-200'
                    : 'bg-slate-50/60 border-slate-200/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white text-indigo-600 flex items-center justify-center font-black border border-slate-200 shadow-2xs">
                      🏛️
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900">{acad.academyName}</h4>
                      <p className="text-xs text-indigo-700 font-bold">{acad.roleTitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">{acad.period}</span>
                    {acad.status === 'actual' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black">
                        Actual
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2.5 text-xs text-slate-600 space-y-1">
                  <p className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{acad.location}</span>
                  </p>
                  {acad.achievements && (
                    <p className="text-slate-800 font-medium mt-1">
                      <strong>Logros & Aportes:</strong> {acad.achievements}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB 4: TRYOUTS & EVENTOS PARTICIPADOS */}
      {/* ========================================================================= */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>Participación en Tryouts, Showcases & Combines MLB</span>
              </h3>
              <p className="text-xs text-slate-500">
                Registro de eventos de scouting y torneos donde el entrenador ha presentado o evaluado atletas.
              </p>
            </div>

            <button
              onClick={() => setShowAddEventModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Evento / Tryout</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {eventParticipations.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      {ev.type}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{ev.date}</span>
                  </div>

                  <h4 className="font-black text-xs text-slate-900 leading-snug">
                    {ev.eventName}
                  </h4>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{ev.location}</span>
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 text-xs space-y-1">
                    <p className="text-slate-700">
                      <strong>Rol:</strong> {ev.roleInEvent}
                    </p>
                    <p className="text-emerald-700 font-bold">
                      {ev.playersShowcasedCount} Atletas Presentados
                    </p>
                    {ev.highlightNotes && (
                      <p className="text-[11px] text-slate-600 italic">
                        "{ev.highlightNotes}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB 5: MIS ATLETAS ACTUALES & ACCESO A 360 */}
      {/* ========================================================================= */}
      {activeTab === 'athletes' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Mis Atletas en Entrenamiento Activo en {academy.name}</span>
              </h3>
              <p className="text-xs text-slate-500">
                Haz clic en cualquier jugador para abrir su Vista 360°, revisar su video biomecánico y ajustar notas de desarrollo.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('roster')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
            >
              Ver Roster Completo ({players.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {assignedPlayers.map((player) => (
              <div
                key={player.id}
                onClick={() => {
                  onSelectPlayer(player);
                  onNavigateTab('roster');
                }}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-2xl transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={player.avatar}
                    alt={player.fullName}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-100 shadow-2xs shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-black text-slate-900 truncate">{player.fullName}</p>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black">
                        {player.position}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Clase {player.signingClass} • B/T: <strong>{player.bats}/{player.throws}</strong> • {player.height}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-bold text-slate-800 block">
                      Exit Velo: <strong>{player.metrics.exitVelocityMph} MPH</strong>
                    </span>
                    <span className="text-[10px] text-purple-600 font-bold">
                      IQ Test: {player.edTech?.baseballIqScore || 90}%
                    </span>
                  </div>

                  <button className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all">
                    Abrir Vista 360°
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. Modal Add Mentorship */}
      {showAddMentorshipModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Registrar Jugador Formado</h3>
              <button onClick={() => setShowAddMentorshipModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMentorship} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre Completo del Jugador</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Ronald Guzmán"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Posición</label>
                  <input
                    type="text"
                    required
                    placeholder="SS / OF / RHP"
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Clase de Firma</label>
                  <input
                    type="text"
                    required
                    placeholder="2026"
                    value={newSigningClass}
                    onChange={(e) => setNewSigningClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Estatus del Jugador</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                >
                  <option value="En Desarrollo Activo">En Desarrollo Activo</option>
                  <option value="Firmado Pro">Firmado Pro (MLB / MiLB)</option>
                  <option value="Colegial D1">Colegial D1 / NCAA</option>
                </select>
              </div>

              {newStatus === 'Firmado Pro' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Equipo de Firma & Bono</label>
                  <input
                    type="text"
                    placeholder="Ej: New York Yankees (Bono $1.2M)"
                    value={newSigningTeam}
                    onChange={(e) => setNewSigningTeam(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Enfoque Técnico Desarrollado</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ej: Reestructuración de plano de swing y aumento de velocidad de salida"
                  value={newTrainingFocus}
                  onChange={(e) => setNewTrainingFocus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Logro / Métrica Destacada</label>
                <input
                  type="text"
                  placeholder="Ej: Subió de 89 a 99 MPH Exit Velo"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMentorshipModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold">
                  Guardar Mentoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal Add Academy */}
      {showAddAcademyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Agregar Experiencia en Academia</h3>
              <button onClick={() => setShowAddAcademyModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAcademy} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre de la Academia</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: San Pedro Baseball Academy"
                  value={newAcadName}
                  onChange={(e) => setNewAcadName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cargo Desempeñado</label>
                  <input
                    type="text"
                    required
                    placeholder="Head Trainer / Hitting Coach"
                    value={newAcadRole}
                    onChange={(e) => setNewAcadRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Período</label>
                  <input
                    type="text"
                    required
                    placeholder="2018 - 2022"
                    value={newAcadPeriod}
                    onChange={(e) => setNewAcadPeriod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ubicación</label>
                <input
                  type="text"
                  required
                  placeholder="Boca Chica / Santo Domingo, RD"
                  value={newAcadLocation}
                  onChange={(e) => setNewAcadLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Logros & Aportes</label>
                <textarea
                  rows={2}
                  placeholder="Ej: Lideró programa que graduó 6 firmas profesionales"
                  value={newAcadAchievements}
                  onChange={(e) => setNewAcadAchievements(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAcademyModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold">
                  Guardar Historial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal Add Event */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Registrar Participación en Tryout / Evento</h3>
              <button onClick={() => setShowAddEventModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre del Evento</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: MLB International Showcase 2026"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo de Evento</label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="Tryout MLB">Tryout MLB</option>
                    <option value="Showcase Internacional">Showcase Internacional</option>
                    <option value="Torneo Nacional">Torneo Nacional</option>
                    <option value="Combine Físico">Combine Físico</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha</label>
                  <input
                    type="text"
                    required
                    placeholder="Marzo 2026"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ubicación</label>
                  <input
                    type="text"
                    required
                    placeholder="Estadio Quisqueya, RD"
                    value={newEventLocation}
                    onChange={(e) => setNewEventLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Atletas Presentados</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newEventPlayersCount}
                    onChange={(e) => setNewEventPlayersCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Rol en el Evento</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Evaluador de Bateo / Coach de Banco"
                  value={newEventRole}
                  onChange={(e) => setNewEventRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notas u Observaciones Destacadas</label>
                <textarea
                  rows={2}
                  placeholder="Scouts presentes, actuaciones sobresalientes..."
                  value={newEventNotes}
                  onChange={(e) => setNewEventNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold">
                  Guardar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
