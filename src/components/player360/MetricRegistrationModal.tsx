import React, { useState, useRef } from 'react';
import {
  Activity,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileSpreadsheet,
  FileText,
  Film,
  Paperclip,
  Plus,
  Save,
  Trash2,
  Upload,
  Video,
  X,
} from 'lucide-react';
import {
  MetricDiscipline,
  MetricMeasurementRecord,
  Player,
  SessionMetricItem,
  UserRole,
} from '../../types';

export interface DisciplineMetricDefinition {
  key: string;
  label: string;
  unit: string;
  defaultValue?: number;
}

export const DISCIPLINE_METRICS_MAP: Record<
  MetricDiscipline,
  {
    name: string;
    code: MetricDiscipline;
    metrics: DisciplineMetricDefinition[];
  }
> = {
  BAT: {
    name: 'Bateo',
    code: 'BAT',
    metrics: [
      { key: 'exitVelocityMph', label: 'Velocidad de Salida (EV)', unit: 'MPH', defaultValue: 95.5 },
      { key: 'launchAngleAvgDeg', label: 'Angulo de Salida (LA)', unit: '°', defaultValue: 18.0 },
      { key: 'flightDistanceFt', label: 'Distancia de Vuelo', unit: 'FT', defaultValue: 390 },
      { key: 'batSpeedMph', label: 'Velocidad del Bate', unit: 'MPH', defaultValue: 76.5 },
      { key: 'attackAngleDeg', label: 'Angulo de Ataque', unit: '°', defaultValue: 12.0 },
      { key: 'hipRotationTimeMs', label: 'Tiempo de Rotacion de Cadera', unit: 'ms', defaultValue: 140 },
      { key: 'onPlaneEfficiencyPct', label: 'Eficiencia del Swing en el Plano', unit: '%', defaultValue: 82 },
      { key: 'rotationalAccelerationG', label: 'Aceleracion Rotacional', unit: 'g', defaultValue: 14.5 },
    ],
  },
  PIT: {
    name: 'Pitcheo',
    code: 'PIT',
    metrics: [
      { key: 'fastballVeloMaxMph', label: 'Velocidad de Recta (Fastball Max)', unit: 'MPH', defaultValue: 92.5 },
      { key: 'fastballVeloAvgMph', label: 'Velocidad de Recta Promedio', unit: 'MPH', defaultValue: 90.0 },
      { key: 'spinRateRpm', label: 'Tasa de Rotación (Spin Rate)', unit: 'RPM', defaultValue: 2380 },
      { key: 'horizontalBreakInches', label: 'Quiebre Horizontal (HB)', unit: 'pulg', defaultValue: 12.0 },
      { key: 'inducedVerticalBreakInches', label: 'Quiebre Vertical Inducido (IVB)', unit: 'pulg', defaultValue: 16.5 },
      { key: 'extensionFt', label: 'Extensión de Salida (Extension)', unit: 'FT', defaultValue: 6.4 },
      { key: 'changeupVeloMph', label: 'Velocidad de Cambio (Changeup)', unit: 'MPH', defaultValue: 83.0 },
      { key: 'sliderVeloMph', label: 'Velocidad de Slider / Sweeper', unit: 'MPH', defaultValue: 82.5 },
      { key: 'curveballVeloMph', label: 'Velocidad de Curva (Curveball)', unit: 'MPH', defaultValue: 78.0 },
      { key: 'strikePercentage', label: 'Porcentaje de Strikes (Strike %)', unit: '%', defaultValue: 68 },
    ],
  },
  FIL: {
    name: 'Fildeo',
    code: 'FIL',
    metrics: [
      { key: 'armVelocityMph', label: 'Velocidad de Brazo (Infield/OF)', unit: 'MPH', defaultValue: 89.0 },
      { key: 'popTimeSec', label: 'Pop Time (Receptor/Catcher)', unit: 'seg', defaultValue: 1.92 },
      { key: 'exchangeTimeSec', label: 'Tiempo de Transferencia (Exchange)', unit: 'seg', defaultValue: 0.68 },
      { key: 'reactionTimeSec', label: 'Tiempo de Reacción (First Step)', unit: 'seg', defaultValue: 0.28 },
      { key: 'throwAccuracyPct', label: 'Precisión de Tiro a Bases', unit: '%', defaultValue: 90 },
      { key: 'lateralRangeFt', label: 'Alcance Lateral (Lateral Range)', unit: 'FT', defaultValue: 42 },
      { key: 'fieldSprintSpeedMph', label: 'Velocidad de Carrera en el Fildeo', unit: 'MPH', defaultValue: 27.5 },
    ],
  },
  RUN: {
    name: 'Base Running',
    code: 'RUN',
    metrics: [
      { key: 'sixtyYardDashSec', label: 'Carrera de 60 Yardas (Láser)', unit: 'seg', defaultValue: 6.60 },
      { key: 'timeToFirstBaseSec', label: 'Tiempo Home a Primera Base (Home to 1st)', unit: 'seg', defaultValue: 4.12 },
      { key: 'timeToSecondBaseSec', label: 'Tiempo Home a Segunda Base', unit: 'seg', defaultValue: 7.80 },
      { key: 'sprintSpeedFps', label: 'Velocidad Máxima de Sprint', unit: 'FT/s', defaultValue: 28.5 },
      { key: 'tenYardSplitSec', label: 'Aceleración en 10 Yardas (10-yd Split)', unit: 'seg', defaultValue: 1.55 },
      { key: 'thirtyYardSplitSec', label: 'Aceleración en 30 Yardas', unit: 'seg', defaultValue: 3.75 },
      { key: 'stolenBaseEfficiencyPct', label: 'Eficiencia de Robo de Base', unit: '%', defaultValue: 85 },
    ],
  },
  ACO: {
    name: 'Acondicionamiento',
    code: 'ACO',
    metrics: [
      { key: 'verticalJumpInches', label: 'Salto Vertical (Vertical Jump)', unit: 'pulg', defaultValue: 32.5 },
      { key: 'gripStrengthKg', label: 'Fuerza de Agarre Manual (Grip Strength)', unit: 'kg', defaultValue: 56 },
      { key: 'squatMaxLbs', label: 'Sentadilla Máxima (1RM Squat)', unit: 'lbs', defaultValue: 315 },
      { key: 'deadliftMaxLbs', label: 'Peso Muerto (Deadlift 1RM)', unit: 'lbs', defaultValue: 385 },
      { key: 'benchPressMaxLbs', label: 'Press de Pecho (Bench Press 1RM)', unit: 'lbs', defaultValue: 225 },
      { key: 'medBallThrowFt', label: 'Lanzamiento de Balón Medicinal', unit: 'FT', defaultValue: 48 },
      { key: 'proAgilityShuttleSec', label: 'Pro Agility 5-10-5 Shuttle', unit: 'seg', defaultValue: 4.25 },
      { key: 'bodyFatPct', label: 'Porcentaje de Grasa Corporal', unit: '%', defaultValue: 12.5 },
    ],
  },
};

interface MetricRegistrationModalProps {
  player: Player;
  onClose: () => void;
  onSave: (newRecord: MetricMeasurementRecord, updatedPlayer: Player) => void;
  initialRecord?: MetricMeasurementRecord | null;
  activeRole?: UserRole;
}

export const MetricRegistrationModal: React.FC<MetricRegistrationModalProps> = ({
  player,
  onClose,
  onSave,
  initialRecord,
  activeRole,
}) => {
  // Step 1: Discipline
  const [selectedDiscipline, setSelectedDiscipline] = useState<MetricDiscipline>(
    initialRecord?.discipline || 'BAT'
  );

  // Step 2: Context
  const [condition, setCondition] = useState(initialRecord?.condition || '');
  const [tool, setTool] = useState(initialRecord?.verifiedByTool || '');
  
  // Format current date-time for datetime-local (YYYY-MM-DDTHH:mm)
  const getInitialDateTime = () => {
    if (initialRecord?.dateTime) return initialRecord.dateTime;
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };
  const [dateTime, setDateTime] = useState(getInitialDateTime());

  const [country, setCountry] = useState(initialRecord?.country || '');
  const [city, setCity] = useState(initialRecord?.city || player.hometown?.split(',')[0] || '');
  const [location, setLocation] = useState(initialRecord?.location || '');
  const [description, setDescription] = useState(initialRecord?.description || initialRecord?.notes || '');

  // Step 3: Video
  const [videoFile, setVideoFile] = useState<{ name: string; size: string } | null>(
    initialRecord?.videoFileName ? { name: initialRecord.videoFileName, size: '18.4 MB' } : null
  );
  const [videoUrl, setVideoUrl] = useState(initialRecord?.videoUrl || '');

  // Evidences (optional)
  const [evidences, setEvidences] = useState<Array<{ name: string; type: string; size: string }>>(
    initialRecord?.evidenceFiles?.map(e => ({ name: e.name, type: e.type, size: e.size || '1.2 MB' })) || []
  );

  // Step 4: Dynamic Metrics based on discipline
  const getDefaultMetricRows = (discipline: MetricDiscipline): SessionMetricItem[] => {
    const list = DISCIPLINE_METRICS_MAP[discipline].metrics;
    if (list.length === 0) return [];
    // Provide initial default rows for this discipline
    return [
      {
        id: `m-${Date.now()}-1`,
        metricKey: list[0].key,
        metricLabel: list[0].label,
        value: list[0].defaultValue ?? '',
        unit: list[0].unit,
      },
      {
        id: `m-${Date.now()}-2`,
        metricKey: list[1]?.key || list[0].key,
        metricLabel: list[1]?.label || list[0].label,
        value: list[1]?.defaultValue ?? '',
        unit: list[1]?.unit || list[0].unit,
      },
    ];
  };

  const [metricRows, setMetricRows] = useState<SessionMetricItem[]>(() => {
    if (initialRecord?.customMetrics && initialRecord.customMetrics.length > 0) {
      return initialRecord.customMetrics;
    }
    return getDefaultMetricRows(initialRecord?.discipline || 'BAT');
  });

  // When discipline changes, update metric rows to match new discipline
  const handleSelectDiscipline = (disc: MetricDiscipline) => {
    setSelectedDiscipline(disc);
    const available = DISCIPLINE_METRICS_MAP[disc].metrics;
    if (available.length > 0) {
      setMetricRows([
        {
          id: `m-${Date.now()}-1`,
          metricKey: available[0].key,
          metricLabel: available[0].label,
          value: available[0].defaultValue ?? '',
          unit: available[0].unit,
        },
        {
          id: `m-${Date.now()}-2`,
          metricKey: available[1]?.key || available[0].key,
          metricLabel: available[1]?.label || available[0].label,
          value: available[1]?.defaultValue ?? '',
          unit: available[1]?.unit || available[0].unit,
        },
      ]);
    }
  };

  // Video file upload trigger
  const fileInputRef = useRef<HTMLInputElement>(null);
  const evidenceInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      });
      setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    }
  };

  const handleEvidenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newItems = Array.from(files).map((f) => ({
        name: f.name,
        type: f.name.split('.').pop()?.toUpperCase() || 'FILE',
        size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
      }));
      setEvidences((prev) => [...prev, ...newItems]);
    }
  };

  const removeEvidence = (index: number) => {
    setEvidences((prev) => prev.filter((_, i) => i !== index));
  };

  const isNoTool = tool === 'Sin herramienta' || tool === 'Sin herramientas';

  // Metric rows handlers
  const handleMetricChange = (index: number, key: string) => {
    const activeMetrics = DISCIPLINE_METRICS_MAP[selectedDiscipline].metrics;
    const found = activeMetrics.find((m) => m.key === key);
    if (!found) return;

    setMetricRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              metricKey: found.key,
              metricLabel: found.label,
              unit: found.unit,
              value: found.defaultValue ?? row.value,
            }
          : row
      )
    );
  };

  const handleValueChange = (index: number, val: string) => {
    setMetricRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, value: val } : row))
    );
  };

  const handleAddMetricRow = () => {
    const activeMetrics = DISCIPLINE_METRICS_MAP[selectedDiscipline].metrics;
    // Pick the first metric not yet used, or the first one
    const usedKeys = new Set(metricRows.map((r) => r.metricKey));
    const nextMetric = activeMetrics.find((m) => !usedKeys.has(m.key)) || activeMetrics[0];

    const newRow: SessionMetricItem = {
      id: `m-${Date.now()}-${metricRows.length + 1}`,
      metricKey: nextMetric.key,
      metricLabel: nextMetric.label,
      value: nextMetric.defaultValue ?? '',
      unit: nextMetric.unit,
    };
    setMetricRows((prev) => [...prev, newRow]);
  };

  const handleRemoveMetricRow = (index: number) => {
    if (metricRows.length <= 1) return;
    setMetricRows((prev) => prev.filter((_, i) => i !== index));
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dateOnly = dateTime ? dateTime.split('T')[0] : new Date().toISOString().split('T')[0];
    const eventTitle = location
      ? `${condition || 'Sesión'} en ${location}`
      : `${condition || 'Evaluación'} - ${tool || 'TrackMan'}`;

    // Extract core physical values if defined in the metric rows (only if not 'Sin herramienta')
    let exitVelo = player.metrics.exitVelocityMph;
    let armVelo = player.metrics.armVelocityMph;
    let sixtyDash = player.metrics.sixtyYardDashSec;
    let batSpeed = player.metrics.batSpeedMph;
    let fastballMax = player.metrics.fastballVeloMaxMph;
    let spinRate = player.metrics.spinRateRpm;
    let popTime = player.metrics.popTimeSec;
    let launchAngle = player.metrics.launchAngleAvgDeg;
    let verticalJump = player.metrics.verticalJumpInches;
    let gripStrength = player.metrics.gripStrengthKg;

    if (!isNoTool) {
      metricRows.forEach((row) => {
        const numVal = parseFloat(row.value.toString());
        if (!isNaN(numVal)) {
          if (row.metricKey === 'exitVelocityMph') exitVelo = numVal;
          if (row.metricKey === 'armVelocityMph') armVelo = numVal;
          if (row.metricKey === 'sixtyYardDashSec') sixtyDash = numVal;
          if (row.metricKey === 'batSpeedMph') batSpeed = numVal;
          if (row.metricKey === 'fastballVeloMaxMph') fastballMax = numVal;
          if (row.metricKey === 'spinRateRpm') spinRate = numVal;
          if (row.metricKey === 'popTimeSec') popTime = numVal;
          if (row.metricKey === 'launchAngleAvgDeg') launchAngle = numVal;
          if (row.metricKey === 'verticalJumpInches') verticalJump = numVal;
          if (row.metricKey === 'gripStrengthKg') gripStrength = numVal;
        }
      });
    }

    const newRecord: MetricMeasurementRecord = {
      id: initialRecord?.id || `meas-${Date.now()}`,
      date: dateOnly,
      dateTime: dateTime.replace('T', ' '),
      eventName: eventTitle,
      discipline: selectedDiscipline,
      condition: condition || 'Entrenamiento',
      verifiedByTool: (tool as any) || 'Sin herramienta',
      country: country || 'República Dominicana',
      city: city || player.hometown,
      location: location || undefined,
      description: description || undefined,
      videoUrl: videoUrl || (videoFile ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' : undefined),
      videoFileName: videoFile?.name || undefined,
      evidenceFiles: evidences.map(e => ({ name: e.name, type: e.type, size: e.size })),
      customMetrics: isNoTool ? [] : metricRows,
      exitVelocityMph: exitVelo,
      armVelocityMph: armVelo,
      sixtyYardDashSec: sixtyDash,
      batSpeedMph: batSpeed,
      fastballVeloMaxMph: fastballMax,
      spinRateRpm: spinRate,
      popTimeSec: popTime,
      launchAngleAvgDeg: launchAngle,
      verticalJumpInches: verticalJump,
      gripStrengthKg: gripStrength,
      notes: description || undefined,
    };

    // Calculate updated player
    const currentList = player.measurementHistory || [];
    let updatedHistory: MetricMeasurementRecord[];
    if (initialRecord) {
      updatedHistory = currentList.map((item) => (item.id === initialRecord.id ? newRecord : item));
    } else {
      updatedHistory = [newRecord, ...currentList];
    }

    const updatedPlayer: Player = {
      ...player,
      verificationDate: dateOnly,
      measurementHistory: updatedHistory,
      metrics: {
        ...player.metrics,
        exitVelocityMph: exitVelo,
        armVelocityMph: armVelo,
        sixtyYardDashSec: sixtyDash,
        batSpeedMph: batSpeed,
        fastballVeloMaxMph: fastballMax,
        spinRateRpm: spinRate,
        popTimeSec: popTime,
        launchAngleAvgDeg: launchAngle,
        verticalJumpInches: verticalJump,
        gripStrengthKg: gripStrength,
      },
    };

    onSave(newRecord, updatedPlayer);
    onClose();
  };

  const disciplines: Array<{ id: MetricDiscipline; code: string; label: string }> = [
    { id: 'BAT', code: 'BAT', label: 'Bateo' },
    { id: 'PIT', code: 'PIT', label: 'Pitcheo' },
    { id: 'FIL', code: 'FIL', label: 'Fildeo' },
    { id: 'RUN', code: 'RUN', label: 'Base Running' },
    { id: 'ACO', code: 'ACO', label: 'Acondicionamiento' },
  ];

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-4xl my-auto overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* MODAL HEADER (Matching Screenshot 1) */}
        <div className="px-6 py-5 border-b border-slate-100/90 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Nuevo Registro de Métricas
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Completa los datos de la sesión. Los scouts podrán filtrar y evaluar tu perfil con esta información.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL FORM BODY */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-7 text-sm flex-1">
          {/* ========================================================================= */}
          {/* STEP 1: SELECCIONA LA DISCIPLINA (Matching Screenshot 1) */}
          {/* ========================================================================= */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                1
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Selecciona la Disciplina
              </h3>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {disciplines.map((d) => {
                const isSelected = selectedDiscipline === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleSelectDiscipline(d.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10.5px] font-black tracking-wider ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {d.code}
                    </span>
                    <span>{d.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STEP 2: CONTEXTO DE LA SESION (Matching Screenshot 2) */}
          {/* ========================================================================= */}
          <div className="space-y-4 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                2
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Contexto de la Sesion
              </h3>
            </div>

            {/* Row 1: Condicion, Herramienta, Fecha y Hora */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Condicion <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer pr-9"
                  >
                    <option value="">Selecciona</option>
                    <option value="Juego Oficial">Juego Oficial</option>
                    <option value="Práctica de Bateo (BP)">Práctica de Bateo (BP)</option>
                    <option value="Showcase Certificado">Showcase Certificado</option>
                    <option value="Bullpen / Live BP">Bullpen / Live BP</option>
                    <option value="Entrenamiento Diario">Entrenamiento Diario</option>
                    <option value="Juego Simulado">Juego Simulado</option>
                    <option value="Tryout Evaluativo">Tryout Evaluativo</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Herramienta <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={tool}
                    onChange={(e) => setTool(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer pr-9"
                  >
                    <option value="">Selecciona</option>
                    <option value="Sin herramienta">Sin herramienta (Solo evidencia y video)</option>
                    <option value="TrackMan">TrackMan Stadium</option>
                    <option value="TrackMan Portátil">TrackMan Portátil</option>
                    <option value="Rapsodo Pro">Rapsodo Pro 3.0</option>
                    <option value="Blast Motion">Blast Motion</option>
                    <option value="HitTrax">HitTrax</option>
                    <option value="Diamond Kinetics">Diamond Kinetics</option>
                    <option value="Laser Stalker">Laser Stalker Pro II</option>
                    <option value="Pocket Radar">Pocket Radar Smart</option>
                    <option value="Cronómetro Láser">Cronómetro Láser</option>
                    <option value="Biomechanics 3D">Sensores K-Vest 3D</option>
                    <option value="Manual Certificado">Manual Certificado</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Fecha y Hora <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    required
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Pais, Ciudad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pais <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer pr-9"
                  >
                    <option value="">Selecciona</option>
                    <option value="República Dominicana">República Dominicana</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Estados Unidos">Estados Unidos</option>
                    <option value="México">México</option>
                    <option value="Puerto Rico">Puerto Rico</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Cuba">Cuba</option>
                    <option value="Panamá">Panamá</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Otro">Otro</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Ciudad <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Caracas, Santo Domingo, Miami..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Row 3: Instalacion / Lugar (opcional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Instalacion / Lugar <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Academia La Javilla, Estadio Universitario, Campo Municipal..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Row 4: Descripcion de la Sesion */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Descripcion de la Sesion <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe el contexto: objetivo del entrenamiento, condiciones del dia, personas presentes, notas para el scout..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STEP 3: VIDEO DE LA SESION & EVIDENCIAS (Matching Screenshot 3) */}
          {/* ========================================================================= */}
          <div className="space-y-4 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                3
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Video de la Sesion <span className="text-rose-500">*</span>
              </h3>
            </div>

            {/* Video Dropzone */}
            <input
              type="file"
              ref={fileInputRef}
              accept="video/mp4,video/quicktime,video/x-msvideo"
              className="hidden"
              onChange={handleVideoUpload}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-2xl border-2 border-dashed transition-all p-6 text-center cursor-pointer ${
                videoFile
                  ? 'border-emerald-400 bg-emerald-50/40'
                  : 'border-blue-200/90 hover:border-blue-400 bg-blue-50/20 hover:bg-blue-50/40'
              }`}
            >
              {videoFile ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900">{videoFile.name}</p>
                    <p className="text-[11px] text-slate-500">{videoFile.size} • Video cargado correctamente</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoFile(null);
                      setVideoUrl('');
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-blue-600">Haz clic para subir el video</p>
                  <p className="text-xs text-slate-500">MP4, MOV, AVI - max. 1 minuto</p>
                </div>
              )}
            </div>

            {/* Evidencias de la Sesion (archivo de herramienta - opcional) */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  +
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                  Evidencias de la Sesion{' '}
                  <span className="text-slate-400 font-normal text-xs">(archivo de herramienta - opcional)</span>
                </h4>
              </div>

              <input
                type="file"
                ref={evidenceInputRef}
                multiple
                accept=".pdf,.csv,.xlsx,.xls,.png,.jpg,.jpeg,.mp4"
                className="hidden"
                onChange={handleEvidenceUpload}
              />

              <div className="rounded-2xl border border-slate-200/80 p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => evidenceInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-2xs cursor-pointer shrink-0"
                  >
                    <span>Agregar métrica / archivo</span>
                  </button>
                  <span className="text-xs text-slate-500">
                    Imagenes, PDF, CSV, Excel o video corto
                  </span>
                </div>
              </div>

              {/* Uploaded Evidence Badges */}
              {evidences.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {evidences.map((ev, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs border border-slate-200"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-medium truncate max-w-[200px]">{ev.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({ev.size})</span>
                      <button
                        type="button"
                        onClick={() => removeEvidence(idx)}
                        className="text-slate-400 hover:text-rose-600 ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STEP 4: MÉTRICAS DINÁMICAS SEGÚN LA DISCIPLINA ESCOGIDA */}
          {/* ========================================================================= */}
          <div className="space-y-4 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-6 h-6 rounded-full font-black text-xs flex items-center justify-center shrink-0 shadow-xs ${
                    isNoTool ? 'bg-slate-400 text-white' : 'bg-blue-600 text-white'
                  }`}
                >
                  4
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Métricas de la Sesión ({DISCIPLINE_METRICS_MAP[selectedDiscipline].name})
                    </h3>
                    {isNoTool && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-100 text-amber-900 border border-amber-300/80">
                        Desactivadas por "Sin herramienta"
                      </span>
                    )}
                  </div>
                  {isNoTool && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      No se requieren mediciones numéricas obligatorias para esta sesión de evidencia.
                    </p>
                  )}
                </div>
              </div>

              {!isNoTool && (
                <button
                  type="button"
                  onClick={handleAddMetricRow}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs hover:bg-blue-100 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar otra métrica</span>
                </button>
              )}
            </div>

            {/* If 'Sin herramienta' is active, show the evidence-only banner and deactivate number inputs */}
            {isNoTool ? (
              <div className="rounded-2xl bg-gradient-to-r from-amber-50/80 via-blue-50/40 to-slate-50 border border-amber-200/90 p-5 space-y-3.5">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Video className="w-5 h-5 text-amber-700" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">
                      Modo Sin Herramientas (Solo Evidencia / Video)
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Has seleccionado la opción <strong>"Sin herramienta"</strong>. Las opciones y campos de métricas numéricas obligatorias (velocidades, ángulos, distancias de radar) han sido desactivadas para este registro.
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Este registro se guardará con la disciplina <strong>{DISCIPLINE_METRICS_MAP[selectedDiscipline].name} ({selectedDiscipline})</strong> y los scouts/evaluadores podrán visualizar y analizar directamente tu técnica a través del <strong>video y archivos de evidencia adjuntos</strong> cargados en el Paso 3.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Evidencia vinculada a: <span className="text-blue-700 font-black">{DISCIPLINE_METRICS_MAP[selectedDiscipline].name}</span></span>
                  </div>
                  <span className="text-[11px] text-slate-500 italic">
                    Tip: Si deseas ingresar números de radar calibrados, selecciona TrackMan o Rapsodo en el Paso 2.
                  </span>
                </div>
              </div>
            ) : (
              /* Normal Metric Rows Container */
              <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                {metricRows.map((row, index) => {
                  const availableMetrics = DISCIPLINE_METRICS_MAP[selectedDiscipline].metrics;
                  return (
                    <div
                      key={row.id}
                      className="grid grid-cols-12 gap-3 items-center bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs"
                    >
                      {/* Metric Select Dropdown */}
                      <div className="col-span-12 sm:col-span-6 relative">
                        <select
                          value={row.metricKey}
                          onChange={(e) => handleMetricChange(index, e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer pr-9"
                        >
                          <option value="">Selecciona la métrica</option>
                          {availableMetrics.map((m) => (
                            <option key={m.key} value={m.key}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {/* Value Input */}
                      <div className="col-span-6 sm:col-span-3">
                        <input
                          type="number"
                          step="0.01"
                          required
                          placeholder="Valor"
                          value={row.value}
                          onChange={(e) => handleValueChange(index, e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>

                      {/* Unit Box */}
                      <div className="col-span-4 sm:col-span-2">
                        <div className="w-full px-3 py-2.5 rounded-xl bg-slate-100/90 border border-slate-200 text-xs font-bold text-slate-600 text-center uppercase tracking-wider">
                          {row.unit || 'MPH'}
                        </div>
                      </div>

                      {/* Delete Button */}
                      <div className="col-span-2 sm:col-span-1 flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveMetricRow(index)}
                          disabled={metricRows.length <= 1}
                          className={`p-2 rounded-xl transition-all ${
                            metricRows.length <= 1
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-rose-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
                          }`}
                          title="Eliminar fila de métrica"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* MODAL ACTIONS FOOTER (Matching Screenshot 1) */}
          {/* ========================================================================= */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Registro</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
