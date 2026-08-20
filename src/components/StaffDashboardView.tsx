import React from 'react';
import {
  Activity,
  AlertCircle,
  Award,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Edit3,
  FileCheck,
  Flame,
  Gauge,
  Plus,
  Target,
  Trophy,
  Users,
  Video,
  Zap
} from 'lucide-react';
import { AcademyProfile, Player } from '../types';

interface StaffDashboardViewProps {
  academy: AcademyProfile;
  players: Player[];
  onNavigateTab: (tab: string) => void;
  onSelectPlayer: (player: Player) => void;
}

export const StaffDashboardView: React.FC<StaffDashboardViewProps> = ({
  academy,
  players,
  onNavigateTab,
  onSelectPlayer,
}) => {
  // Assigned athletes to coach (Carlos Rosario - Bateo & Infield)
  const assignedPlayers = players.filter((p) => p.assignedCoachId === 'coach-01' || p.position === 'SS' || p.position === 'OF' || p.position === '3B');

  return (
    <div id="staff-dashboard-view" className="space-y-8 animate-in fade-in duration-200">
      {/* 1. TOP STAFF WELCOME BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-600 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            📋
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Panel Técnico de Entrenamiento
              </h1>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black">
                Staff: Carlos Rosario (Head Trainer)
              </span>
            </div>

            <p className="text-xs text-slate-500">
              {academy.name} • Especialidad: <strong>Bateo, Mecánica & IQ Situacional</strong>
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="text-slate-600 font-semibold">
                Atletas Asignados: <strong className="text-slate-900">{assignedPlayers.length} Prospectos</strong>
              </span>
              <span>•</span>
              <span className="text-emerald-600 font-bold">
                ✓ Plan de Entrenamiento al Día
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('biomechanics')}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
          >
            <Video className="w-4 h-4" />
            <span>Studio Biomecánico</span>
          </button>

          <button
            onClick={() => onNavigateTab('roster')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
          >
            <Users className="w-4 h-4" />
            <span>Roster & Vista 360°</span>
          </button>
        </div>
      </div>

      {/* 2. DAILY TRAINING METRICS & WORKOUT PLAN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Asignados
            </span>
          </div>

          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              MIS ATLETAS EN ENTRENAMIENTO
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">{assignedPlayers.length}</span>
              <span className="text-xs font-bold text-slate-400">Prospectos</span>
            </div>
            <p className="text-[11px] text-blue-600 font-bold mt-1">Infielders y Bateadores</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Gauge className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              Exit Velo
            </span>
          </div>

          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              PROMEDIO EXIT VELOCITY
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">97.8</span>
              <span className="text-xs font-bold text-indigo-600 font-black">MPH</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">+2.4 MPH este mes</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
              IQ Promedio
            </span>
          </div>

          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              BASEBALL IQ DEL GRUPO
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">89%</span>
              <span className="text-xs font-bold text-purple-600">Aciertos</span>
            </div>
            <p className="text-[11px] text-purple-600 font-bold mt-1">12 Tests Asignados</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Evaluaciones
            </span>
          </div>

          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              SESIONES BIOMECÁNICAS
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">28</span>
              <span className="text-xs font-bold text-slate-400">Videos HD</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">Ángulos de ataque analizados</p>
          </div>
        </div>
      </div>

      {/* 3. ASSIGNED ATHLETES TABLE WITH 360 VIEW ACCESS */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Mis Prospectos Asignados — Vista Rápida
            </h3>
            <p className="text-xs text-slate-500">Haz clic en cualquier jugador para abrir su Vista 360° y actualizar sus métricas</p>
          </div>

          <button
            onClick={() => onNavigateTab('roster')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
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
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-black text-slate-900 truncate">{player.fullName}</p>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black">
                      {player.position}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Clase {player.signingClass} • Bateo: <strong>{player.bats}</strong> • Tiro: <strong>{player.throws}</strong> • {player.height}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-slate-800 block">
                    Exit Velo: <strong>{player.metrics.exitVelocityMph} MPH</strong>
                  </span>
                  <span className="text-[10px] text-purple-600 font-bold">
                    IQ Test: {player.edTech.baseballIqScore}%
                  </span>
                </div>

                <button className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all">
                  Abrir Vista 360°
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
