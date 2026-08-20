import React from 'react';
import {
  Activity,
  AlertCircle,
  Award,
  BookOpen,
  Brain,
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Eye,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  Flame,
  Gauge,
  History,
  Home,
  Layers,
  LayoutGrid,
  Lock,
  LogOut,
  Radio,
  Scale,
  Search,
  Settings,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Upload,
  User,
  UserCheck,
  Users,
  Video,
  X,
  Zap
} from 'lucide-react';
import { AcademyProfile, Player, UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeRole: UserRole;
  academy: AcademyProfile;
  activePlayer: Player;
  onOpenRadioPelota: () => void;
  onOpenRbacModal: () => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  isRadioPlaying?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  activeRole,
  academy,
  activePlayer,
  onOpenRadioPelota,
  onOpenRbacModal,
  isOpenMobile,
  setIsOpenMobile,
  isRadioPlaying = false,
}) => {
  // Collapsible menu sections
  const [trayectoriaOpen, setTrayectoriaOpen] = React.useState(false);
  const [studioOpen, setStudioOpen] = React.useState(true);
  const [b2bOpen, setB2bOpen] = React.useState(true);
  const [scoutingOpen, setScoutingOpen] = React.useState(true);

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsOpenMobile(false);
  };

  // Footer profile indicator
  const getRoleProfile = () => {
    switch (activeRole) {
      case 'admin':
        return {
          name: academy.directorName || 'Lic. Rafael Almonte',
          role: 'Administrador de academia',
          avatar: '👑',
          plan: 'Plan Academy Pro B2B',
          statusColor: 'bg-purple-600',
        };
      case 'staff':
        return {
          name: 'Carlos Rosario',
          role: 'Head Trainer & Bateo (Staff)',
          avatar: '📋',
          plan: 'Licencia Staff Activa',
          statusColor: 'bg-blue-600',
        };
      case 'scout':
        return {
          name: 'Donny Rowland',
          role: 'Scout MLB Internacional',
          avatar: '🔭',
          plan: 'MLB Certified Pass',
          statusColor: 'bg-amber-600',
        };
      case 'player':
        return {
          name: activePlayer.fullName,
          role: `Prospecto (${activePlayer.position} • Clase ${activePlayer.signingClass})`,
          avatar: '⚾',
          plan: 'Perfil B2C Vinculado',
          statusColor: 'bg-emerald-600',
        };
    }
  };

  const profile = getRoleProfile();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      <aside
        id="glovall-sidebar"
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } shadow-xs`}
      >
        {/* 1. Header: Glovall Brand + Academy Badge */}
        <div className="h-18 px-6 flex items-center justify-between border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20">
              G
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-blue-600">Glovall</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 truncate max-w-[150px]">
                {activeRole === 'player' ? 'Portal del Atleta' : academy.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpenMobile(false)}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Navigation Items (Dynamically rendered based on activeRole) */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 custom-scrollbar">
          {/* ======================================================== */}
          {/* A. DIRECTOR / DUEÑO DE ACADEMIA (ADMIN) SIDEBAR MENU */}
          {/* ======================================================== */}
          {activeRole === 'admin' && (
            <>
              <div className="space-y-1">
                <button
                  onClick={() => handleNavClick('admin-dashboard')}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    currentTab === 'admin-dashboard' || currentTab === 'dashboard'
                      ? 'bg-blue-50 text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Dashboard Academia</span>
                </button>
              </div>

              <div className="space-y-1">
                <span className="px-3.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Gestión Administrativa
                </span>

                <button
                  onClick={() => handleNavClick('roster')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'roster'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>Roster & Vista 360°</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                    25
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('coaches')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'coaches'
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>Gestionar Entrenadores</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[9px] font-black">
                    Staff
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('scout-book')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'scout-book'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span>Scout Book</span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('showcases')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'showcases'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Showcases & Eventos</span>
                </button>
              </div>

              <div className="space-y-1">
                <span className="px-3.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  EdTech & Studio
                </span>

                <button
                  onClick={() => handleNavClick('studio-assignments')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'studio-assignments' || currentTab === 'assignments'
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ClipboardList className={`w-4 h-4 ${currentTab === 'studio-assignments' || currentTab === 'assignments' ? 'text-white' : 'text-blue-600'}`} />
                    <span>Asignaciones Studio</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${
                    currentTab === 'studio-assignments' || currentTab === 'assignments' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                  }`}>
                    Checks & IQ
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('studio-tracking')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'studio-tracking'
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Eye className={`w-4 h-4 ${currentTab === 'studio-tracking' ? 'text-white' : 'text-indigo-600'}`} />
                    <span>Mirada 360° Estudio</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${
                    currentTab === 'studio-tracking' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    360°
                  </span>
                </button>
              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* B. ENTRENADOR / PREPARADOR FÍSICO (STAFF) SIDEBAR MENU */}
          {/* ======================================================== */}
          {activeRole === 'staff' && (
            <>
              <div className="space-y-1">
                <button
                  onClick={() => handleNavClick('staff-dashboard')}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    currentTab === 'staff-dashboard' || currentTab === 'dashboard'
                      ? 'bg-blue-50 text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Dashboard de Entrenamiento</span>
                </button>
              </div>

              <div className="space-y-1">
                <span className="px-3.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Desarrollo Técnico
                </span>

                <button
                  onClick={() => handleNavClick('roster')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'roster'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>Roster & Vista 360°</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                    Mis Atletas
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('biomechanics')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'biomechanics'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Video className="w-4 h-4 text-purple-600" />
                  <span>Videoanálisis Biomecánico</span>
                </button>

                <button
                  onClick={() => handleNavClick('coaches')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'coaches'
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>Equipo de Entrenadores</span>
                </button>
              </div>

              <div className="space-y-1">
                <span className="px-3.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  EdTech & Studio
                </span>

                <button
                  onClick={() => handleNavClick('studio-assignments')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'studio-assignments' || currentTab === 'assignments'
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ClipboardList className={`w-4 h-4 ${currentTab === 'studio-assignments' || currentTab === 'assignments' ? 'text-white' : 'text-blue-600'}`} />
                    <span>Asignaciones Studio</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${
                    currentTab === 'studio-assignments' || currentTab === 'assignments' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                  }`}>
                    Checks & IQ
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('studio-tracking')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'studio-tracking'
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Eye className={`w-4 h-4 ${currentTab === 'studio-tracking' ? 'text-white' : 'text-indigo-600'}`} />
                    <span>Mirada 360° Estudio</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${
                    currentTab === 'studio-tracking' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    360°
                  </span>
                </button>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100">
                <span className="px-3.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Eventos
                </span>
                <button
                  onClick={() => handleNavClick('showcases')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    currentTab === 'showcases'
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-slate-600" />
                  <span>Calendario de Combines</span>
                </button>
              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* C. SCOUT MLB (INVITADO EXTERNO) SIDEBAR MENU */}
          {/* ======================================================== */}
          {activeRole === 'scout' && (
            <>
              <div className="space-y-1">
                <button
                  onClick={() => handleNavClick('scout-portal')}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    currentTab === 'scout-portal'
                      ? 'bg-blue-50 text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Search className="w-5 h-5 text-blue-600" />
                  <span>Portal de Scouting MLB</span>
                </button>
              </div>

              <div className="space-y-1">
                <span className="px-3.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Herramientas de Evaluación
                </span>

                <button
                  onClick={() => handleNavClick('scout-portal')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                >
                  <Scale className="w-4 h-4 text-indigo-600" />
                  <span>Comparador Head-to-Head</span>
                </button>

                <button
                  onClick={() => handleNavClick('showcases')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'showcases'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Showcases Oficiales</span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/60 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Acceso Scout MLB</span>
                </div>
                <p className="text-[11px] text-amber-800/90 leading-relaxed">
                  Estás visualizando únicamente prospectos con documentos y videos de tutor legal aprobados.
                </p>
              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* D. JUGADOR / PROSPECTO (B2C - VISTA DE LA IMAGEN DE REFERENCIA) */}
          {/* ======================================================== */}
          {activeRole === 'player' && (
            <>
              {/* Main Dashboard (Screenshot representation) */}
              <div className="space-y-1">
                <button
                  id="nav-dashboard-btn"
                  onClick={() => handleNavClick('player-dashboard')}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    currentTab === 'player-dashboard' || currentTab === 'dashboard'
                      ? 'bg-blue-50 text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Dashboard</span>
                </button>
              </div>

              {/* Section: Trayectoria (from screenshot) */}
              <div className="space-y-1">
                <button
                  onClick={() => setTrayectoriaOpen(!trayectoriaOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <Activity className="w-4 h-4 text-slate-600" />
                    <span>Trayectoria</span>
                  </div>
                  {trayectoriaOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {trayectoriaOpen && (
                  <div className="pl-4 space-y-1 border-l-2 border-slate-100 ml-3 mt-1">
                    <button
                      onClick={() => handleNavClick('programs')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        currentTab === 'programs'
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Layers className="w-4 h-4" />
                        <span>Programas</span>
                      </div>
                      {(activePlayer.academyRequests?.filter(r => r.status === 'pending').length || 0) > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse">
                          {activePlayer.academyRequests?.filter(r => r.status === 'pending').length}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => handleNavClick('tournaments')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        currentTab === 'tournaments'
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Trophy className="w-4 h-4" />
                      <span>Torneos</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('metrics')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        currentTab === 'metrics'
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>Métricas</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('coaching')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        currentTab === 'coaching' || currentTab === 'coaching-sessions'
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <UserCheck className="w-4 h-4 text-blue-600" />
                        <span>Sesiones</span>
                      </div>
                      {(activePlayer.coachingSessions?.length || activePlayer.coachingHistory?.length || 0) > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                          {activePlayer.coachingSessions?.length || activePlayer.coachingHistory?.length}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => handleNavClick('showcase-history')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        currentTab === 'showcase-history' || currentTab === 'tryouts'
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>Tryouts</span>
                      </div>
                      {(activePlayer.showcaseHistory?.length || 0) > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                          {activePlayer.showcaseHistory?.length}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => handleNavClick('education')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        currentTab === 'education'
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Educación</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('courses')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        currentTab === 'courses'
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Award className="w-4 h-4" />
                      <span>Cursos</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Section: STUDIO (EdTech & Biblioteca) */}
              <div className="space-y-1">
                <button
                  onClick={() => setStudioOpen(!studioOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>STUDIO</span>
                  </div>
                  {studioOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {studioOpen && (
                  <div className="pl-4 space-y-1 border-l-2 border-slate-100 ml-3 mt-1">
                    <button
                      onClick={() => handleNavClick('biblioteca')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        currentTab === 'biblioteca' || currentTab === 'library' || currentTab === 'studio-library'
                          ? 'bg-blue-50 text-blue-600 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>Biblioteca</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('studio-test')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        currentTab === 'studio-test'
                          ? 'bg-blue-50 text-blue-600 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <ClipboardList className="w-4 h-4 text-emerald-600" />
                      <span>Test B-IQ</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('savant')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        currentTab === 'savant' || currentTab === 'studio-savant'
                          ? 'bg-blue-50 text-blue-600 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Target className="w-4 h-4 text-amber-600" />
                      <span>Savant</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* 3. Radio Pelota Action Pill (Direct Stream Toggle in Primary Blue) */}
        <div className="px-4 py-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onOpenRadioPelota}
            title={isRadioPlaying ? 'Pausar Radio Pelota' : 'Reproducir Radio Pelota (En Vivo)'}
            className={`w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2.5 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
              isRadioPlaying
                ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30 ring-2 ring-blue-400/30'
                : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/10'
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isRadioPlaying ? 'bg-emerald-300' : 'bg-rose-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isRadioPlaying ? 'bg-emerald-400' : 'bg-rose-500'
                }`}
              />
            </span>
            <Radio className={`w-4 h-4 ${isRadioPlaying ? 'animate-pulse text-blue-100' : 'text-slate-300'}`} />
            <span>{isRadioPlaying ? 'Radio Pelota • Al Aire' : 'Radio Pelota'}</span>
          </button>
        </div>

        {/* 4. Active Role Profile Indicator Footer (Clean & Seamless Link to Perfil & Suscripción) */}
        <div className="p-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => handleNavClick(activeRole === 'player' ? 'player-portal' : 'settings')}
            title="Ver y gestionar Perfil Institucional & Suscripción"
            className="w-full flex items-center gap-3 text-left transition-all cursor-pointer group hover:opacity-90"
          >
            <div
              className={`w-9 h-9 rounded-xl ${profile.statusColor} text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0 group-hover:scale-105 transition-transform`}
            >
              {profile.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {profile.name}
                </p>
                <Settings className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:rotate-45 transition-all shrink-0" />
              </div>
              <p className="text-[11px] font-medium text-slate-500 truncate">{profile.role}</p>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[10px] font-semibold text-emerald-600 truncate">
                  {profile.plan}
                </span>
              </div>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};
