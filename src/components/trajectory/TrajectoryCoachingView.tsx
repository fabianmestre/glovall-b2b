import React from 'react';
import {
  Activity,
  Award,
  CheckCircle2,
  Clock,
  Dumbbell,
  FileCheck,
  Flame,
  Layers,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  Video
} from 'lucide-react';
import { Player } from '../../types';
import { CoachingTab } from '../player360/CoachingTab';

interface TrajectoryCoachingViewProps {
  player: Player;
  onUpdatePlayer: (updated: Player) => void;
}

export function TrajectoryCoachingView({ player, onUpdatePlayer }: TrajectoryCoachingViewProps) {
  const sessions = player.coachingSessions || [];
  const totalMinutes = sessions.reduce((acc, curr) => acc + (curr.durationMinutes || 60), 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  
  const scores = sessions.map(s => s.performanceScore).filter((s): s is number => typeof s === 'number');
  const avgScore = scores.length > 0
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    : '9.1';

  const mediaCount = sessions.reduce((acc, curr) => acc + (curr.mediaEvidence?.length || 0), 0);

  return (
    <div id="trajectory-coaching-view" className="space-y-6 animate-in fade-in duration-200">
      {/* 1. VIEW HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Trayectoria del Atleta
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-500">Módulo de Desarrollo 360°</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sesiones & Coaching Técnico
            </h1>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verificado por Staff
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Monitorea el plan de trabajo diario, correcciones mecánicas en jaula y bullpen, evaluaciones periódicas de entrenadores y evidencia en video de alta velocidad.
          </p>
        </div>

        {/* Player Snapshot Info */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 shrink-0 self-start md:self-auto">
          <img
            src={player.avatar}
            alt={player.fullName}
            className="w-12 h-12 rounded-xl object-cover border border-blue-500/40 shadow-xs"
          />
          <div className="text-xs">
            <p className="font-bold text-slate-900">{player.fullName}</p>
            <p className="text-slate-500 font-medium">{player.position} • Clase {player.signingClass}</p>
            <p className="text-blue-600 font-semibold text-[11px] mt-0.5">
              Coach: {player.assignedCoachName || 'Carlos Rosario'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. STATS & KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Sesiones Realizadas
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{sessions.length}</span>
              <span className="text-xs font-semibold text-slate-500">sesiones</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Horas Acumuladas
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{totalHours}</span>
              <span className="text-xs font-semibold text-slate-500">hrs pista/jaula</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Promedio de Rendimiento
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{avgScore}</span>
              <span className="text-xs font-bold text-emerald-600">/ 10 pts</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Evidencias en Video
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{mediaCount}</span>
              <span className="text-xs font-semibold text-slate-500">clips 120 FPS</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. COACHING TAB WORKSPACE */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
        <CoachingTab
          player={player}
          onUpdatePlayer={onUpdatePlayer}
          activeRole="player"
        />
      </div>
    </div>
  );
}
