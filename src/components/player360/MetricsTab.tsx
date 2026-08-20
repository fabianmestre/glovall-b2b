import React, { useState } from 'react';
import {
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Film,
  Flame,
  Gauge,
  MapPin,
  Paperclip,
  Play,
  Plus,
  Save,
  ShieldCheck,
  Target,
  Trash2,
  Video,
  X,
  Zap,
} from 'lucide-react';
import { MetricDiscipline, MetricMeasurementRecord, Player, UserRole } from '../../types';
import { MetricRegistrationModal } from './MetricRegistrationModal';

interface MetricsTabProps {
  player: Player;
  onUpdatePlayer: (updated: Player) => void;
  activeRole?: UserRole;
}

export const MetricsTab: React.FC<MetricsTabProps> = ({ player, onUpdatePlayer, activeRole }) => {
  const canDeleteHistory = activeRole !== 'admin' && activeRole !== 'scout';
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MetricMeasurementRecord | null>(null);
  const [activeVideoModal, setActiveVideoModal] = useState<{ url: string; title: string } | null>(null);

  const handleOpenMeasurementModal = (record?: MetricMeasurementRecord) => {
    if (record) {
      setEditingRecord(record);
    } else {
      setEditingRecord(null);
    }
    setShowMeasurementModal(true);
  };

  const handleSaveRecord = (newRecord: MetricMeasurementRecord, updatedPlayer: Player) => {
    onUpdatePlayer(updatedPlayer);
  };

  const handleDeleteMeasurement = (id: string) => {
    if (confirm('¿Confirmas que deseas eliminar este registro de sesión de métricas?')) {
      const updatedList = (player.measurementHistory || []).filter((item) => item.id !== id);
      onUpdatePlayer({
        ...player,
        measurementHistory: updatedList,
      });
    }
  };

  const measurementList: MetricMeasurementRecord[] = player.measurementHistory || [
    {
      id: 'm-current',
      date: player.verificationDate || '2026-07-22',
      dateTime: '2026-07-22 10:30',
      eventName: 'Showcase Oficial Estadio Quisqueya',
      discipline: 'BAT',
      condition: 'Showcase Certificado',
      verifiedByTool: 'TrackMan',
      country: 'República Dominicana',
      city: 'Santo Domingo',
      location: 'Estadio Quisqueya Juan Marichal',
      description: 'Sesión oficial con radares ópticos de alta frecuencia y TrackMan Stadium.',
      exitVelocityMph: player.metrics.exitVelocityMph,
      armVelocityMph: player.metrics.armVelocityMph,
      sixtyYardDashSec: player.metrics.sixtyYardDashSec,
      batSpeedMph: player.metrics.batSpeedMph,
      launchAngleAvgDeg: player.metrics.launchAngleAvgDeg || 18.2,
      flightDistanceFt: 395,
      notes: 'Medición récord certificada con radar óptico',
    },
  ];

  const getDisciplineBadge = (disc?: MetricDiscipline) => {
    switch (disc) {
      case 'BAT':
        return { label: 'Bateo', code: 'BAT', style: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'PIT':
        return { label: 'Pitcheo', code: 'PIT', style: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'FIL':
        return { label: 'Fildeo', code: 'FIL', style: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'RUN':
        return { label: 'Base Running', code: 'RUN', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'ACO':
        return { label: 'Acondicionamiento', code: 'ACO', style: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: 'General', code: 'ALL', style: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            Tabla Histórica de Mediciones & TrackMan
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro cronológico por disciplina con contexto de sesión, video y métricas dinámicas
          </p>
        </div>

        <button
          onClick={() => handleOpenMeasurementModal()}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Registro de Métricas</span>
        </button>
      </div>

      {/* Main Historical Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Fecha / Evento</th>
                <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Disciplina & Contexto</th>
                <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Herramienta</th>
                <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider text-right">Métricas Registradas</th>
                <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider text-center">Video / Evidencias</th>
                <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {measurementList.map((meas, idx) => {
                const discBadge = getDisciplineBadge(meas.discipline);
                return (
                  <tr key={meas.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Fecha / Evento */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 align-top">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{meas.date}</span>
                        {idx === 0 && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-extrabold">
                            ACTUAL
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-600 font-semibold mt-0.5 max-w-[200px] truncate">
                        {meas.eventName}
                      </div>
                      {(meas.city || meas.country) && (
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5" />
                          <span>{meas.city ? `${meas.city}, ` : ''}{meas.country}</span>
                        </div>
                      )}
                    </td>

                    {/* Disciplina & Contexto */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px] font-black border ${discBadge.style}`}>
                          <span>{discBadge.code}</span>
                          <span className="font-semibold text-slate-600">• {discBadge.label}</span>
                        </span>
                        {meas.condition && (
                          <div className="text-[11px] text-slate-600 font-medium">
                            {meas.condition}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Herramienta */}
                    <td className="py-3.5 px-4 align-top">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 inline-flex items-center gap-1">
                        {meas.verifiedByTool === 'Sin herramienta' || meas.verifiedByTool === 'Sin herramientas' ? (
                          <Film className="w-3 h-3 text-amber-600" />
                        ) : (
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        )}
                        {meas.verifiedByTool}
                      </span>
                    </td>

                    {/* Métricas Registradas */}
                    <td className="py-3.5 px-4 text-right align-top">
                      {meas.verifiedByTool === 'Sin herramienta' || meas.verifiedByTool === 'Sin herramientas' ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
                          <span>Solo Evidencia Técnica</span>
                        </div>
                      ) : meas.customMetrics && meas.customMetrics.length > 0 ? (
                        <div className="space-y-1">
                          {meas.customMetrics.map((cm, ci) => (
                            <div key={ci} className="text-[11px]">
                              <span className="text-slate-500 mr-1.5">{cm.metricLabel}:</span>
                              <span className="font-mono font-bold text-slate-900">{cm.value}</span>{' '}
                              <span className="text-[10px] text-slate-400 font-semibold">{cm.unit}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-1 font-mono">
                          {meas.exitVelocityMph > 0 && (
                            <div className="text-[11px]">
                              <span className="text-slate-500 mr-1">Exit Velo:</span>
                              <span className="font-bold text-blue-700">{meas.exitVelocityMph.toFixed(1)} MPH</span>
                            </div>
                          )}
                          {meas.armVelocityMph > 0 && (
                            <div className="text-[11px]">
                              <span className="text-slate-500 mr-1">Brazo:</span>
                              <span className="font-bold text-indigo-700">{meas.armVelocityMph.toFixed(1)} MPH</span>
                            </div>
                          )}
                          {meas.sixtyYardDashSec > 0 && (
                            <div className="text-[11px]">
                              <span className="text-slate-500 mr-1">60 Yds:</span>
                              <span className="font-bold text-emerald-700">{meas.sixtyYardDashSec.toFixed(2)} sec</span>
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Video / Evidencias */}
                    <td className="py-3.5 px-4 text-center align-top">
                      <div className="flex flex-col items-center gap-1">
                        {meas.videoUrl || meas.videoFileName ? (
                          <button
                            onClick={() =>
                              setActiveVideoModal({
                                url: meas.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                                title: meas.eventName,
                              })
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-bold transition-all cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Video</span>
                          </button>
                        ) : (
                          <span className="text-slate-300 text-[11px]">-</span>
                        )}

                        {meas.evidenceFiles && meas.evidenceFiles.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                            <Paperclip className="w-2.5 h-2.5" />
                            {meas.evidenceFiles.length} adjunto(s)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right align-top">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenMeasurementModal(meas)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                          title="Modificar medición"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {canDeleteHistory && measurementList.length > 1 && (
                          <button
                            onClick={() => handleDeleteMeasurement(meas.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                            title="Eliminar medición"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* MODAL: NUEVO REGISTRO DE MÉTRICAS / EDICIÓN */}
      {showMeasurementModal && (
        <MetricRegistrationModal
          player={player}
          initialRecord={editingRecord}
          activeRole={activeRole}
          onClose={() => {
            setShowMeasurementModal(false);
            setEditingRecord(null);
          }}
          onSave={handleSaveRecord}
        />
      )}

      {/* VIDEO PREVIEW MODAL */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 rounded-3xl p-5 w-full max-w-2xl border border-slate-800 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-blue-400" />
                <h4 className="text-sm font-bold truncate max-w-md">{activeVideoModal.title}</h4>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video bg-black rounded-2xl overflow-hidden">
              <video
                src={activeVideoModal.url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

