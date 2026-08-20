import React from 'react';
import {
  Activity,
  Award,
  Calendar,
  CheckCircle2,
  FileText,
  Layers,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Zap
} from 'lucide-react';
import { Player } from '../../types';
import { ShowcaseHistoryTab } from '../player360/ShowcaseHistoryTab';

interface TrajectoryShowcasesViewProps {
  player: Player;
  onUpdatePlayer: (updated: Player) => void;
}

export function TrajectoryShowcasesView({ player, onUpdatePlayer }: TrajectoryShowcasesViewProps) {
  const showcases = player.showcaseHistory || [];
  
  const allOrgs = showcases.flatMap(s => s.interestedOrganizations || []);
  const uniqueOrgsCount = new Set(allOrgs).size;

  return (
    <div id="trajectory-showcases-view" className="space-y-6 animate-in fade-in duration-200">
      {/* 1. VIEW HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Trayectoria del Atleta
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-500">Módulo de Scouting & Eventos</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Tryouts & Showcases MLB
            </h1>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Historial Certificado
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Consulta tus métricas obtenidas ante scouts de Grandes Ligas, combinados oficiales de velocidad y poder, entrevistas de organizaciones MLB y valoraciones técnicas.
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
            <p className="text-emerald-600 font-semibold text-[11px] mt-0.5">
              {uniqueOrgsCount > 0 ? `${uniqueOrgsCount} Franquicias MLB con Interés` : 'Perfil Activo en Scouting'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. STATS & KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Eventos Evaluados
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{showcases.length}</span>
              <span className="text-xs font-semibold text-slate-500">showcases/tryouts</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Velocidad Pico TrackMan
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">
                {player.position === 'RHP' || player.position === 'LHP'
                  ? `${player.metrics.fastballVeloMaxMph || 94} MPH`
                  : `${player.metrics.exitVelocityMph} MPH`}
              </span>
              <span className="text-xs font-bold text-emerald-600">
                {player.position === 'RHP' || player.position === 'LHP' ? 'Fastball' : 'Exit Velo'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              60 Yardas Oficial Láser
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{player.metrics.sixtyYardDashSec}</span>
              <span className="text-xs font-semibold text-slate-500">segundos</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Franquicias MLB
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{uniqueOrgsCount || 4}</span>
              <span className="text-xs font-bold text-amber-600">equipos scouting</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SHOWCASE HISTORY WORKSPACE */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
        <ShowcaseHistoryTab
          player={player}
          onUpdatePlayer={onUpdatePlayer}
          activeRole="player"
        />
      </div>
    </div>
  );
}
