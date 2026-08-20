import React, { useState } from 'react';
import { 
  BarChart3, 
  Plus, 
  Eye, 
  Pencil, 
  Trash2, 
  X, 
  Image as ImageIcon, 
  Video, 
  SlidersHorizontal, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  Zap, 
  Activity, 
  AlertCircle,
  Film,
  Play,
  Paperclip
} from 'lucide-react';
import { MetricMeasurementRecord, Player, TrajectoryMetricRecord } from '../../types';
import { MetricRegistrationModal } from '../player360/MetricRegistrationModal';

interface TrajectoryMetricsViewProps {
  player: Player;
  onUpdatePlayer: (updated: Player) => void;
}

export function TrajectoryMetricsView({ player, onUpdatePlayer }: TrajectoryMetricsViewProps) {
  const metricsList = player.trajectoryMetrics || [];

  // Filter state
  const [selectedDisciplineFilter, setSelectedDisciplineFilter] = useState<string>('all');
  const [selectedChartDiscipline, setSelectedChartDiscipline] = useState<'BAT' | 'PIT' | 'RUN' | 'FIL' | 'ACO'>('BAT');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MetricMeasurementRecord | null>(null);
  const [activeEvidence, setActiveEvidence] = useState<TrajectoryMetricRecord | null>(null);
  const [activeVideoModal, setActiveVideoModal] = useState<{ url: string; title: string } | null>(null);

  // Filtered metrics list
  const filteredMetrics = metricsList.filter((m) => {
    if (selectedDisciplineFilter === 'all') return true;
    if (selectedDisciplineFilter === 'FIL') return m.discipline === 'FIL' || m.discipline === 'FLD';
    return m.discipline === selectedDisciplineFilter;
  });

  const openCreateModal = () => {
    setEditingRecord(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (rec: TrajectoryMetricRecord) => {
    // Map TrajectoryMetricRecord to MetricMeasurementRecord for the modal
    const mappedRecord: MetricMeasurementRecord = {
      id: rec.id,
      date: rec.date.split(',')[0].trim() || '2026-04-21',
      dateTime: rec.date.includes(',') ? rec.date.replace(', ', 'T') : `${rec.date}T10:00`,
      eventName: `${rec.condition} - ${rec.tool}`,
      discipline: (rec.discipline === 'FLD' ? 'FIL' : rec.discipline) as any,
      condition: rec.condition,
      verifiedByTool: (rec.tool as any) || 'TrackMan',
      country: rec.country || 'República Dominicana',
      city: rec.city || player.hometown,
      location: rec.location,
      description: rec.notes || rec.description,
      videoUrl: rec.videoUrl,
      videoFileName: rec.videoFileName,
      evidenceFiles: rec.evidenceFiles,
      customMetrics: rec.customMetrics || [
        {
          id: `m-${rec.id}`,
          metricKey: rec.metricName.toLowerCase().replace(/\s+/g, ''),
          metricLabel: rec.metricName,
          value: rec.value,
          unit: rec.unit,
        },
      ],
      exitVelocityMph: rec.discipline === 'BAT' && rec.metricName.includes('Salida') ? rec.value : player.metrics.exitVelocityMph,
      armVelocityMph: (rec.discipline === 'FIL' || rec.discipline === 'FLD') ? rec.value : player.metrics.armVelocityMph,
      sixtyYardDashSec: rec.discipline === 'RUN' && rec.metricName.includes('60') ? rec.value : player.metrics.sixtyYardDashSec,
      batSpeedMph: rec.discipline === 'BAT' && rec.metricName.includes('Bate') ? rec.value : player.metrics.batSpeedMph,
      notes: rec.notes,
    };
    setEditingRecord(mappedRecord);
    setIsFormModalOpen(true);
  };

  const openEvidenceModal = (rec: TrajectoryMetricRecord) => {
    setActiveEvidence(rec);
    setIsEvidenceModalOpen(true);
  };

  const handleSaveRegistrationModal = (newRecord: MetricMeasurementRecord, updatedPlayer: Player) => {
    // Convert newRecord into TrajectoryMetricRecords
    const currentTraj = player.trajectoryMetrics || [];
    let updatedTrajectory: TrajectoryMetricRecord[];

    const isNoTool = newRecord.verifiedByTool === 'Sin herramienta' || newRecord.verifiedByTool === 'Sin herramientas';

    const newEntries: TrajectoryMetricRecord[] = isNoTool
      ? [
          {
            id: `tm-${Date.now()}`,
            discipline: (newRecord.discipline as any) || 'BAT',
            metricName: `Evidencia Técnica (${newRecord.discipline === 'BAT' ? 'Bateo' : newRecord.discipline === 'PIT' ? 'Pitcheo' : newRecord.discipline === 'FIL' ? 'Fildeo' : newRecord.discipline === 'RUN' ? 'Base Running' : 'Acondicionamiento'})`,
            value: 0,
            unit: 'Video / Clip',
            condition: newRecord.condition || 'Práctica Libre',
            tool: 'Sin herramienta',
            date: newRecord.date,
            hasEvidence: !!(newRecord.videoUrl || newRecord.videoFileName || (newRecord.evidenceFiles && newRecord.evidenceFiles.length > 0)),
            evidenceUrl: newRecord.evidenceFiles?.[0]?.name,
            videoUrl: newRecord.videoUrl,
            videoFileName: newRecord.videoFileName,
            country: newRecord.country,
            city: newRecord.city,
            location: newRecord.location,
            description: newRecord.description,
            evidenceFiles: newRecord.evidenceFiles,
            customMetrics: [],
            notes: newRecord.description || newRecord.notes,
          }
        ]
      : (newRecord.customMetrics && newRecord.customMetrics.length > 0)
      ? newRecord.customMetrics.map((cm, idx) => ({
          id: `tm-${Date.now()}-${idx}`,
          discipline: newRecord.discipline as any,
          metricName: cm.metricLabel,
          value: typeof cm.value === 'number' ? cm.value : parseFloat(cm.value.toString()) || 0,
          unit: cm.unit,
          condition: newRecord.condition || 'Showcase Oficial',
          tool: newRecord.verifiedByTool || 'TrackMan',
          date: newRecord.date,
          hasEvidence: !!(newRecord.videoUrl || newRecord.videoFileName || (newRecord.evidenceFiles && newRecord.evidenceFiles.length > 0)),
          evidenceUrl: newRecord.evidenceFiles?.[0]?.name,
          videoUrl: newRecord.videoUrl,
          videoFileName: newRecord.videoFileName,
          country: newRecord.country,
          city: newRecord.city,
          location: newRecord.location,
          description: newRecord.description,
          evidenceFiles: newRecord.evidenceFiles,
          customMetrics: newRecord.customMetrics,
          notes: newRecord.description || newRecord.notes,
        }))
      : [
          {
            id: `tm-${Date.now()}`,
            discipline: newRecord.discipline as any,
            metricName: newRecord.discipline === 'BAT' ? 'Velocidad de Salida (Exit Velo)' : newRecord.discipline === 'RUN' ? '60 Yard Dash' : 'Métrica de Sesión',
            value: newRecord.discipline === 'BAT' ? newRecord.exitVelocityMph : newRecord.discipline === 'RUN' ? newRecord.sixtyYardDashSec : 90,
            unit: newRecord.discipline === 'RUN' ? 'sec' : 'MPH',
            condition: newRecord.condition || 'Showcase Oficial',
            tool: newRecord.verifiedByTool || 'TrackMan',
            date: newRecord.date,
            hasEvidence: !!(newRecord.videoUrl || newRecord.videoFileName),
            videoUrl: newRecord.videoUrl,
            notes: newRecord.notes,
          }
        ];

    if (editingRecord) {
      // Replace existing entry
      updatedTrajectory = currentTraj.map(t => t.id === editingRecord.id ? newEntries[0] : t);
    } else {
      updatedTrajectory = [...newEntries, ...currentTraj];
    }

    onUpdatePlayer({
      ...updatedPlayer,
      trajectoryMetrics: updatedTrajectory,
    });
    setIsFormModalOpen(false);
    setEditingRecord(null);
  };

  const handleDeleteMetric = (id: string) => {
    if (window.confirm('¿Deseas eliminar este registro de métrica?')) {
      const updatedList = metricsList.filter((m) => m.id !== id);
      onUpdatePlayer({
        ...player,
        trajectoryMetrics: updatedList,
      });
    }
  };

  // Benchmark chart data for the selected chart discipline
  const getDisciplineBenchmarkData = (disc: 'BAT' | 'PIT' | 'RUN' | 'FIL' | 'ACO') => {
    if (disc === 'BAT') {
      return [
        { name: 'Exit Velocity', player: player.metrics?.exitVelocityMph || 95, mlb: 89.0, unit: 'MPH', max: 110 },
        { name: 'Velocidad de Bate', player: player.metrics?.batSpeedMph || 75, mlb: 72.0, unit: 'MPH', max: 90 },
        { name: 'Launch Angle', player: player.metrics?.launchAngleAvgDeg || 18, mlb: 14.0, unit: 'deg', max: 40 },
        { name: 'Hard Hit %', player: player.trackmanData?.hardHitPercentage || 65, mlb: 52.0, unit: '%', max: 100 },
      ];
    }
    if (disc === 'PIT') {
      return [
        { name: 'Fastball Max', player: player.metrics?.fastballVeloMaxMph || 94, mlb: 93.8, unit: 'MPH', max: 105 },
        { name: 'Spin Rate', player: player.metrics?.spinRateRpm || 2350, mlb: 2250, unit: 'rpm', max: 2800 },
        { name: 'Extension', player: 6.4, mlb: 6.1, unit: 'ft', max: 7.5 },
        { name: 'Zona de Strike %', player: 68, mlb: 65, unit: '%', max: 100 },
      ];
    }
    if (disc === 'RUN') {
      return [
        { name: '60 Yard Dash (Invertido)', player: Number((8.0 - (player.metrics?.sixtyYardDashSec || 6.45)).toFixed(2)), mlb: Number((8.0 - 6.8).toFixed(2)), unit: 'pts', max: 2.5, rawPlayer: `${player.metrics?.sixtyYardDashSec || 6.45}s`, rawMlb: '6.80s' },
        { name: '10 Yard Split (Invertido)', player: Number((2.0 - 1.48).toFixed(2)), mlb: Number((2.0 - 1.55).toFixed(2)), unit: 'pts', max: 0.8, rawPlayer: '1.48s', rawMlb: '1.55s' },
        { name: 'Velocidad Pico', player: 21.5, mlb: 20.2, unit: 'MPH', max: 25 },
        { name: 'Home a 1B (Invertido)', player: Number((5.0 - 3.98).toFixed(2)), mlb: Number((5.0 - 4.20).toFixed(2)), unit: 'pts', max: 1.5, rawPlayer: '3.98s', rawMlb: '4.20s' },
      ];
    }
    if (disc === 'ACO') {
      return [
        { name: 'Salto Vertical', player: player.metrics?.verticalJumpInches || 34.5, mlb: 29.0, unit: 'pulg', max: 45 },
        { name: 'Fuerza de Agarre', player: player.metrics?.gripStrengthKg || 62, mlb: 54, unit: 'kg', max: 80 },
        { name: 'Sentadilla 1RM', player: 335, mlb: 315, unit: 'lbs', max: 450 },
        { name: 'Press de Pecho 1RM', player: 240, mlb: 225, unit: 'lbs', max: 350 },
      ];
    }
    // FIL / FLD
    return [
      { name: 'Velocidad Tiro OF/IF', player: player.metrics?.armVelocityMph || 90, mlb: 88.0, unit: 'MPH', max: 100 },
      { name: 'Pop Time (Invertido)', player: Number((2.5 - (player.metrics?.popTimeSec || 1.88)).toFixed(2)), mlb: Number((2.5 - 2.01).toFixed(2)), unit: 'pts', max: 1.0, rawPlayer: `${player.metrics?.popTimeSec || 1.88}s`, rawMlb: '2.01s' },
      { name: 'Transferencia (Invertida)', player: Number((1.2 - 0.68).toFixed(2)), mlb: Number((1.2 - 0.75).toFixed(2)), unit: 'pts', max: 0.8, rawPlayer: '0.68s', rawMlb: '0.75s' },
      { name: 'Efectividad Rutas', player: 92, mlb: 88, unit: '%', max: 100 },
    ];
  };

  const benchmarkData = getDisciplineBenchmarkData(selectedChartDiscipline);

  const getDisciplineBadge = (disc: string) => {
    switch (disc) {
      case 'BAT':
        return <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-blue-100 text-blue-700">BAT</span>;
      case 'PIT':
        return <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-indigo-100 text-indigo-700">PIT</span>;
      case 'RUN':
        return <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-100 text-emerald-700">RUN</span>;
      case 'FIL':
      case 'FLD':
        return <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-amber-100 text-amber-700">FIL</span>;
      case 'ACO':
        return <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-purple-100 text-purple-700">ACO</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 text-slate-700">{disc}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Registros de Métricas</h1>
            <p className="text-sm text-slate-500">
              Carga sesiones con video, evidencia y métricas por disciplina (Bateo, Pitcheo, Fildeo, Running y Acondicionamiento).
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm shadow-blue-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cargar Registro</span>
        </button>
      </div>

      {/* 2. Top Chart Card: Comparativa vs Promedio MLB */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Comparativa de Rendimiento vs. Promedio MLB
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Contraste de percentiles y marcas físicas homologadas por tecnología TrackMan y Rapsodo.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Legend */}
            <div className="hidden sm:flex items-center gap-3 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                <span className="text-slate-700">Mi Nivel Actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-slate-700">Promedio MLB</span>
              </div>
            </div>

            {/* Selector Disciplina */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Disciplina:</span>
              <select
                value={selectedChartDiscipline}
                onChange={(e) => setSelectedChartDiscipline(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="BAT">Bateo (BAT)</option>
                <option value="PIT">Pitcheo (PIT)</option>
                <option value="FIL">Fildeo / Defensa (FIL)</option>
                <option value="RUN">Base Running (RUN)</option>
                <option value="ACO">Acondicionamiento (ACO)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Visual Bar Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          {benchmarkData.map((item, idx) => {
            const playerPct = Math.min(100, Math.round((item.player / item.max) * 100));
            const mlbPct = Math.min(100, Math.round((item.mlb / item.max) * 100));
            const isAhead = item.player >= item.mlb;

            return (
              <div key={idx} className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{item.name}</span>
                  {isAhead ? (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      + Élite
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      En Proceso
                    </span>
                  )}
                </div>

                {/* Player Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-blue-700">Mi Registro:</span>
                    <span className="font-bold text-slate-900">
                      {item.rawPlayer || `${item.player} ${item.unit}`}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${playerPct}%` }}
                    />
                  </div>
                </div>

                {/* MLB Benchmark Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-500">Promedio MLB:</span>
                    <span className="font-semibold text-slate-600">
                      {item.rawMlb || `${item.mlb} ${item.unit}`}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${mlbPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. History Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Historial de Registros</h2>
              <p className="text-xs text-slate-500">Resumen de mediciones de campo, radar, video y sensores.</p>
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={selectedDisciplineFilter}
              onChange={(e) => setSelectedDisciplineFilter(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">Todas las Disciplinas</option>
              <option value="BAT">Bateo (BAT)</option>
              <option value="PIT">Pitcheo (PIT)</option>
              <option value="FIL">Fildeo / Defensa (FIL)</option>
              <option value="RUN">Base Running (RUN)</option>
              <option value="ACO">Acondicionamiento (ACO)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                <th className="py-3.5 px-4 w-10 text-center">#</th>
                <th className="py-3.5 px-4">DISC.</th>
                <th className="py-3.5 px-4">MÉTRICA</th>
                <th className="py-3.5 px-4">VALOR</th>
                <th className="py-3.5 px-4">UNIDAD</th>
                <th className="py-3.5 px-4">CONDICION</th>
                <th className="py-3.5 px-4">HERRAMIENTA</th>
                <th className="py-3.5 px-4">FECHA</th>
                <th className="py-3.5 px-4 text-center">VIDEO / EVIDENCIA</th>
                <th className="py-3.5 px-4 text-right">GESTIÓN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredMetrics.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No hay registros de métricas para la disciplina seleccionada. Haz clic en "Cargar Registro".
                  </td>
                </tr>
              ) : (
                filteredMetrics.map((rec, index) => {
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* # */}
                      <td className="py-4 px-4 text-center font-bold text-slate-400 text-xs">
                        {index + 1}
                      </td>

                      {/* DISC. */}
                      <td className="py-4 px-4">
                        {getDisciplineBadge(rec.discipline)}
                      </td>

                      {/* MÉTRICA */}
                      <td className="py-4 px-4 font-bold text-slate-900 text-xs">
                        {rec.metricName}
                      </td>

                      {/* VALOR con mini-bar */}
                      <td className="py-4 px-4">
                        {rec.tool === 'Sin herramienta' || rec.tool === 'Sin herramientas' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200/90">
                            <Film className="w-3 h-3 text-amber-600" />
                            Evidencia
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-xs sm:text-sm min-w-[28px]">
                              {rec.value}
                            </span>
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${Math.min(100, Math.max(15, (rec.value / 100) * 100))}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </td>

                      {/* UNIDAD */}
                      <td className="py-4 px-4 text-slate-500 font-medium text-xs">
                        {rec.tool === 'Sin herramienta' || rec.tool === 'Sin herramientas' ? 'Video / Clip' : rec.unit}
                      </td>

                      {/* CONDICION */}
                      <td className="py-4 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {rec.condition}
                        </span>
                      </td>

                      {/* HERRAMIENTA */}
                      <td className="py-4 px-4 text-xs">
                        {rec.tool === 'Sin herramienta' || rec.tool === 'Sin herramientas' ? (
                          <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[11px]">
                            Sin herramienta
                          </span>
                        ) : (
                          <span className="text-slate-600 font-medium">{rec.tool || '-'}</span>
                        )}
                      </td>

                      {/* FECHA */}
                      <td className="py-4 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {rec.date}
                      </td>

                      {/* VIDEO / EVIDENCIA */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {rec.videoUrl || rec.videoFileName ? (
                            <button
                              onClick={() =>
                                setActiveVideoModal({
                                  url: rec.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                                  title: `${rec.metricName} - ${rec.condition}`,
                                })
                              }
                              title="Reproducir Video de la Sesión"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10.5px] font-bold transition-all cursor-pointer"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Video</span>
                            </button>
                          ) : null}

                          {rec.hasEvidence && (
                            <button
                              onClick={() => openEvidenceModal(rec)}
                              title="Ver evidencia fotográfica / informe"
                              className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {!rec.videoUrl && !rec.videoFileName && !rec.hasEvidence && (
                            <span className="text-slate-300 text-xs">-</span>
                          )}
                        </div>
                      </td>

                      {/* GESTIÓN */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Detail */}
                          <button
                            onClick={() => openEvidenceModal(rec)}
                            title="Ver detalle de métrica"
                            className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => openEditModal(rec)}
                            title="Editar métrica"
                            className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteMetric(rec.id)}
                            title="Eliminar métrica"
                            className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
          <div>
            Mostrando 1-{filteredMetrics.length} de {filteredMetrics.length}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400">Filas por página: 10</span>
            <div className="flex items-center gap-1 font-bold text-slate-700">
              <button className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-400 hover:text-slate-600">
                &lt;
              </button>
              <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 border border-blue-200">1</span>
              <button className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-400 hover:text-slate-600">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODAL: REGISTRO COMPLETO DE MÉTRICAS (4 PASOS & TODAS LAS DISCIPLINAS) */}
      {isFormModalOpen && (
        <MetricRegistrationModal
          player={player}
          initialRecord={editingRecord}
          activeRole="player"
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingRecord(null);
          }}
          onSave={handleSaveRegistrationModal}
        />
      )}

      {/* 5. VIDEO PREVIEW MODAL */}
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

      {/* 6. Modal Evidencia / Detalle */}
      {isEvidenceModalOpen && activeEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{activeEvidence.metricName}</h3>
                  <p className="text-xs text-slate-500">
                    {activeEvidence.value} {activeEvidence.unit} — {activeEvidence.condition}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEvidenceModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 pt-4 text-xs">
              {/* Imagen o Preview de Evidencia */}
              {activeEvidence.evidenceUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video relative group">
                  <img
                    src={activeEvidence.evidenceUrl}
                    alt="Evidencia técnica"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Captura Validada ({activeEvidence.tool || 'Sensor'})
                    </span>
                  </div>
                </div>
              )}

              <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Disciplina:</span>
                  <div>{getDisciplineBadge(activeEvidence.discipline)}</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Herramienta de Medición:</span>
                  <span className="font-semibold text-slate-800">{activeEvidence.tool || 'No especificada'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Fecha y Hora:</span>
                  <span className="font-semibold text-slate-800">{activeEvidence.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Condición:</span>
                  <span className="font-semibold text-slate-800">{activeEvidence.condition}</span>
                </div>
              </div>

              {activeEvidence.notes && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">Notas Técnicas:</h4>
                  <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 leading-relaxed">
                    {activeEvidence.notes}
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsEvidenceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

