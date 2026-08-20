import React from 'react';
import {
  Activity,
  AlertCircle,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Edit3,
  Eye,
  FileCheck,
  FileText,
  Flame,
  Globe,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';
import { COACHES_STAFF, INITIAL_PLAYER_INVITATIONS, SHOWCASE_EVENTS } from '../data/mockData';
import { AcademyProfile, CoachStaff, Player } from '../types';

interface AdminDashboardViewProps {
  academy: AcademyProfile;
  players: Player[];
  coaches?: CoachStaff[];
  onNavigateTab: (tab: string) => void;
  onSelectPlayer: (player: Player) => void;
  onOpenRadioPelota?: () => void;
  onOpenRbacModal?: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  academy,
  players,
  coaches = COACHES_STAFF,
  onNavigateTab,
  onSelectPlayer,
  onOpenRbacModal,
}) => {
  const verifiedCount = players.filter((p) => p.verificationStatus === 'verified').length;
  const verifiedTutorCount = players.filter(
    (p) => p.tutorConsentVideoUploaded && p.tutorDocumentVerified
  ).length;
  const tutorCompliancePercent = Math.round((verifiedTutorCount / (players.length || 1)) * 100);

  const activeStaffCount = coaches.filter((c) => (c.status || 'active') === 'active').length;

  const class2026 = players.filter((p) => p.signingClass === '2026');
  const class2027 = players.filter((p) => p.signingClass === '2027');
  const class2028 = players.filter((p) => p.signingClass === '2028');
  const class2029 = players.filter((p) => p.signingClass === '2029');

  const topProspects = [...players].sort((a, b) => b.glovallScore - a.glovallScore).slice(0, 5);

  const nextShowcase = SHOWCASE_EVENTS.find((e) => e.status === 'upcoming') || SHOWCASE_EVENTS[0];

  const pendingInvitations = INITIAL_PLAYER_INVITATIONS.filter((inv) => inv.status === 'pending');

  return (
    <div id="admin-dashboard-view" className="space-y-6 sm:space-y-8 animate-in fade-in duration-200 pb-12">
      {/* 1. TOP INSTITUTIONAL ACADEMY BANNER & QUICK ACTIONS */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        {/* Academy Brand & Meta */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0 border border-blue-400/20">
            ⚾
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                {academy.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wide">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Hub</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-2 text-xs text-slate-500 font-medium">
              <span className="inline-flex items-center gap-1 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{academy.city}</span>
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-slate-600">
                Administrador de academia: <strong className="text-slate-900 font-bold">{academy.directorName}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Toolbar */}
        <div className="grid grid-cols-2 sm:flex sm:items-center sm:flex-wrap gap-2 shrink-0">
          <button
            onClick={() => onNavigateTab('roster')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-indigo-700 border border-slate-200/80 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-98"
            title="Explorar el Directorio Global de Jugadores"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">Directorio</span>
          </button>

          <button
            onClick={() => onNavigateTab('coaches')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-blue-700 border border-slate-200/80 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-98"
            title="Directorio Global de Entrenadores"
          >
            <UserPlus className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">+ Vincular Staff</span>
          </button>

          <button
            onClick={() => onNavigateTab('showcases')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-98"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">Showcases</span>
          </button>

          <button
            onClick={() => onNavigateTab('scout-book')}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-98"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-200 shrink-0" />
            <span className="truncate">Scout Book (PDF)</span>
          </button>
        </div>
      </div>

      {/* 2. EXECUTIVE COMMAND KPIS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Roster Activo */}
        <div
          onClick={() => onNavigateTab('roster')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3.5 cursor-pointer hover:border-blue-300 transition-all"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Prospectos en Roster</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900">{players.length}</span>
              <span className="text-[11px] text-slate-400 font-medium">/ 25 cupos</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Staff Técnico & Red */}
        <div
          onClick={() => onNavigateTab('coaches')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3.5 cursor-pointer hover:border-emerald-300 transition-all"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Staff de Entrenadores</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-emerald-700">{activeStaffCount}</span>
              <span className="text-[11px] text-emerald-600 font-bold">Activos</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Solicitudes de Vinculación a Prospectos */}
        <div
          onClick={() => onNavigateTab('roster')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3.5 cursor-pointer hover:border-amber-300 transition-all"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Convenios con Tutores</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-amber-700">{pendingInvitations.length}</span>
              <span className="text-[11px] text-amber-600 font-bold">En Revisión</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Cumplimiento Tutor Legal */}
        <div
          onClick={() => onNavigateTab('roster')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3.5 cursor-pointer hover:border-purple-300 transition-all"
        >
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Elegibilidad Legal MLB</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-purple-700">
                {tutorCompliancePercent}%
              </span>
              <span className="text-[11px] text-slate-400 font-medium">({verifiedTutorCount}/{players.length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CORE STRATEGIC COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Próximo Evento & Distribución de Clases */}
        <div className="space-y-6">
          {/* Próximo Showcase Destacado */}
          {nextShowcase && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Próximo Showcase MLB
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700">
                  {nextShowcase.date}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <p className="text-sm font-black text-slate-900 leading-snug">
                  {nextShowcase.title}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{nextShowcase.location} • {nextShowcase.city}</span>
                </p>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Scouts Confirmados:</span>
                  <span className="font-black text-emerald-700">{nextShowcase.confirmedScoutsCount || 18} Organizaciones</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Atletas Caribe Inscritos:</span>
                  <span className="font-black text-blue-700">4 Prospectos</span>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('showcases')}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Ver Plan de Preparación & Combines</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Distribución por Clase de Firma */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Prospectos por Clase
              </h3>
              <span className="text-xs text-slate-400 font-bold">{players.length} Total</span>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-blue-900 block">Clase Julio 2, 2026</span>
                  <span className="text-[10px] text-blue-700 font-bold">Próxima Firma Internacional</span>
                </div>
                <span className="text-lg font-black text-blue-900">{class2026.length}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-800 block">Clase 2027</span>
                  <span className="text-[10px] text-slate-400">Desarrollo Avanzado</span>
                </div>
                <span className="text-lg font-black text-slate-800">{class2027.length}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-800 block">Clase 2028 & 2029</span>
                  <span className="text-[10px] text-slate-400">Semillero & Menores</span>
                </div>
                <span className="text-lg font-black text-slate-800">{class2028.length + class2029.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Top Prospectos Más Cotizados (Pipeline MLB) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Top 5 Prospectos Más Cotizados
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Clasificación por Algoritmo Glovall Score™ (Métricas Físicas + Baseball IQ)
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('roster')}
              className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Ver Roster 360°
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {topProspects.map((player, idx) => (
              <div
                key={player.id}
                className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-2xl transition-all cursor-pointer"
                onClick={() => {
                  onSelectPlayer(player);
                  onNavigateTab('roster');
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-5 text-center font-black text-slate-400 text-xs">
                    #{idx + 1}
                  </span>
                  <img
                    src={player.avatar}
                    alt={player.fullName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-black text-slate-900 truncate">{player.fullName}</p>
                      {player.verificationStatus === 'verified' && (
                        <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {player.position} • Clase <strong>{player.signingClass}</strong> • {player.hometown}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:block text-right text-xs">
                    <span className="font-bold text-slate-700 block">
                      Exit: <strong>{player.metrics.exitVelocityMph} MPH</strong>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      60 Yds: <strong>{player.metrics.sixtyYardDashSec}s</strong>
                    </span>
                  </div>

                  <div className="bg-slate-900 text-white px-2.5 py-1 rounded-xl text-center shadow-2xs">
                    <span className="text-xs font-black block">{player.glovallScore}</span>
                    <span className="text-[8px] uppercase tracking-wider text-blue-400 font-bold block">Score</span>
                  </div>

                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 font-medium">
              Todos los prospectos cuentan con perfil 360°, videos Trackman y ficha PDF exportable.
            </p>
            <button
              onClick={() => onNavigateTab('scout-book')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Exportar Scout Book</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. STAFF TÉCNICO & SUSCRIPCIÓN INSTITUCIONAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cobertura del Staff Técnico */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Staff Técnico Vinculado
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('coaches')}
              className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Gestionar Staff
            </button>
          </div>

          <div className="space-y-2.5">
            {coaches.slice(0, 3).map((coach) => (
              <div
                key={coach.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={coach.avatar}
                    alt={coach.name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{coach.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{coach.roleTitle}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-slate-700 border border-slate-200 shrink-0">
                  {coach.specialty || 'Especialista'}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('coaches')}
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Explorar Directorio Global de Entrenadores</span>
          </button>
        </div>

        {/* Suscripción B2B & Licencias */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Licencia Institucional B2B
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                {academy.subscriptionStatus === 'active' ? 'Activo' : 'Pendiente'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-950">Plan Glovall Academy Pro</span>
                <span className="text-xs font-bold text-indigo-700">$499 / mes</span>
              </div>
              <p className="text-[11px] text-indigo-800">
                25 cupos de atletas, gestión multi-staff ilimitada, generador de Scout Book oficial y red internacional de scouts MLB.
              </p>
              <div className="text-[10px] text-slate-500 pt-1">
                Próxima facturación: <strong>{academy.nextBillingDate}</strong>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => onNavigateTab('settings')}
              className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition-all cursor-pointer"
            >
              Configuración & Marca Blanca
            </button>
            {onOpenRbacModal && (
              <button
                onClick={onOpenRbacModal}
                className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>RBAC</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
