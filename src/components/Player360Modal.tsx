import React, { useState } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Building,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  MapPin,
  Sparkles,
  Trophy,
  UserCheck,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { Player, UserRole } from '../types';
import { CoachingTab } from './player360/CoachingTab';
import { CoursesTab } from './player360/CoursesTab';
import { EducationTab } from './player360/EducationTab';
import { FamilyEligibilityTab } from './player360/FamilyEligibilityTab';
import { MetricsTab } from './player360/MetricsTab';
import { ShowcaseHistoryTab } from './player360/ShowcaseHistoryTab';
import { TrajectoryTab } from './player360/TrajectoryTab';

interface Player360ModalProps {
  player: Player;
  onClose: () => void;
  onUpdatePlayer: (updatedPlayer: Player) => void;
  onNavigateTab: (tab: string) => void;
  activeRole: UserRole;
}

export const Player360Modal: React.FC<Player360ModalProps> = ({
  player,
  onClose,
  onUpdatePlayer,
  onNavigateTab,
  activeRole,
}) => {
  const [activeTab, setActiveTab] = useState<
    'family' | 'education' | 'courses' | 'metrics' | 'trajectory' | 'coaching' | 'showcases'
  >('showcases');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl my-auto overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[94vh]">
        {/* MODAL HEADER & ATHLETE IDENTITY */}
        <div className="relative bg-slate-900 px-5 py-4 sm:px-6 sm:py-5 text-white shrink-0 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative shrink-0">
                <img
                  src={player.avatar}
                  alt={player.fullName}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-blue-600 border border-white text-[9px] font-black rounded uppercase">
                  {player.position}
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">{player.fullName}</h3>
                  {player.nickname && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/10 text-blue-200">
                      "{player.nickname}"
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Clase {player.signingClass}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> TrackMan Verificado
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-300">
                  <span>
                    Edad: <strong className="text-white">{player.age} años</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Físico: <strong className="text-white">{player.height} / {player.weight} lbs</strong>
                  </span>
                  <span>•</span>
                  <span>
                    B/T: <strong className="text-white">{player.bats}/{player.throws}</strong>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-400" />
                    <strong className="text-white">{player.hometown}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Glovall Index Metric Score */}
            <div className="flex sm:flex-row items-center gap-3 bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-slate-700 self-start sm:self-auto">
              <div className="text-right">
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                  Glovall Index
                </span>
                <span className="text-xl font-black text-amber-400 leading-tight">
                  {player.glovallScore}<span className="text-xs text-slate-400 font-normal">/100</span>
                </span>
              </div>
              <div className="h-8 w-px bg-slate-700" />
              <div className="text-left">
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                  MLB Scaled
                </span>
                <span className="text-xs font-black text-emerald-400">Élite A+</span>
              </div>
            </div>
          </div>

          {/* COMPACT NO-SCROLL NAVIGATION GRID (7 COLUMNS) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('showcases')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'showcases'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Showcases & Tryouts ({player.showcaseHistory?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('coaching')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'coaching'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Sesiones & Coaching ({player.coachingSessions?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('family')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'family'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Familia & Origen</span>
            </button>

            <button
              onClick={() => setActiveTab('education')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'education'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Educación ({player.formalEducation?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'courses'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Cursos ({player.nonFormalCourses?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('metrics')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'metrics'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Mediciones ({player.measurementHistory?.length || 1})</span>
            </button>

            <button
              onClick={() => setActiveTab('trajectory')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'trajectory'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Trayectoria ({player.academyHistory?.length || 0})</span>
            </button>
          </div>
        </div>

        {/* MODAL MAIN CONTENT BODY (SCROLLABLE TAB CONTENT) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50">
          {activeTab === 'showcases' && (
            <ShowcaseHistoryTab player={player} onUpdatePlayer={onUpdatePlayer} activeRole={activeRole} />
          )}

          {activeTab === 'coaching' && (
            <CoachingTab player={player} onUpdatePlayer={onUpdatePlayer} activeRole={activeRole} />
          )}

          {activeTab === 'family' && (
            <FamilyEligibilityTab player={player} onUpdatePlayer={onUpdatePlayer} activeRole={activeRole} />
          )}

          {activeTab === 'education' && (
            <EducationTab player={player} onUpdatePlayer={onUpdatePlayer} activeRole={activeRole} />
          )}

          {activeTab === 'courses' && (
            <CoursesTab player={player} onUpdatePlayer={onUpdatePlayer} activeRole={activeRole} />
          )}

          {activeTab === 'metrics' && (
            <MetricsTab player={player} onUpdatePlayer={onUpdatePlayer} activeRole={activeRole} />
          )}

          {activeTab === 'trajectory' && (
            <TrajectoryTab player={player} onUpdatePlayer={onUpdatePlayer} activeRole={activeRole} />
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-3.5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-300">
              Expediente Digital 360° • Caribe Baseball Academy
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
              {activeRole === 'admin'
                ? 'Administrador de academia: Registro y edición habilitados • Historial de atleta y staff inmutable'
                : activeRole === 'player'
                ? 'Portal del Atleta: Autogestión de perfil, tutor y portafolio • Mediciones y staff certificados'
                : 'Auditoría y trazabilidad Glovall'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all cursor-pointer"
          >
            Cerrar Expediente
          </button>
        </div>
      </div>
    </div>
  );
};
