import React from 'react';
import {
  AlertCircle,
  Award,
  BookOpen,
  Brain,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileCheck,
  FileText,
  Flame,
  Gauge,
  Lock,
  Play,
  Share2,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Upload,
  UserCheck,
  Video,
  Zap
} from 'lucide-react';
import { COURSES_LIBRARY } from '../data/mockData';
import { AcademyProfile, Player } from '../types';

interface PlayerPortalViewProps {
  player: Player;
  academy: AcademyProfile;
  onUpdatePlayer: (updated: Player) => void;
  onNavigateTab: (tab: string) => void;
}

export const PlayerPortalView: React.FC<PlayerPortalViewProps> = ({
  player,
  academy,
  onUpdatePlayer,
  onNavigateTab,
}) => {
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [uploadType, setUploadType] = React.useState<'document' | 'video'>('document');
  const [uploadedSuccess, setUploadedSuccess] = React.useState(false);

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadedSuccess(true);
    setTimeout(() => {
      if (uploadType === 'document') {
        onUpdatePlayer({ ...player, tutorDocumentVerified: true });
      } else {
        onUpdatePlayer({
          ...player,
          tutorConsentVideoUploaded: true,
          scoutVisibilityStatus: 'public',
          verificationStatus: 'verified',
        });
      }
      setUploadedSuccess(false);
      setShowUploadModal(false);
    }, 1500);
  };

  return (
    <div id="player-portal-container" className="space-y-6 animate-in fade-in duration-200">
      {/* 1. TOP ATHLETE PROFILE CARD & VERIFICATION BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={player.avatar}
              alt={player.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-blue-500 shadow-xl"
            />
            <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-black text-xs shadow-md">
              #{player.position}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {player.fullName}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-black text-xs">
                Clase {player.signingClass}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              {player.hometown} • {player.age} años • {player.height} • {player.weight} lbs • {academy.name}
            </p>

            <div className="flex items-center gap-3 pt-1 text-xs">
              <span className="text-slate-600 font-semibold">
                Coach: <strong className="text-slate-900">{player.assignedCoachName}</strong>
              </span>
              <span>•</span>
              <span className="text-slate-600 font-semibold">
                B/T: <strong>{player.bats}/{player.throws}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Glovall Score Badge */}
        <div className="flex items-center gap-4 bg-slate-900 text-white p-5 rounded-3xl shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-blue-400 block">
              Glovall Score™
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black">{player.glovallScore}</span>
              <span className="text-xs text-slate-400 font-semibold">/ 100</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
              Percentil 92 Nacional
            </span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl">
            ⚾
          </div>
        </div>
      </div>

      {/* 2. COMPLIANCE & SCOUT VISIBILITY STATUS */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Requisitos de Visibilidad ante Scouts MLB
            </h3>
          </div>

          {player.tutorConsentVideoUploaded && player.tutorDocumentVerified ? (
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Perfil 100% Habilitado ante Scouts
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Pendiente de Documentos de Tutor
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Doc 1: Tutor Legal Document */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  player.tutorDocumentVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                }`}
              >
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Documento de Identidad del Tutor</h4>
                <p className="text-[11px] text-slate-500">
                  {player.tutorDocumentVerified ? 'Cédula / Pasaporte Verificado' : 'Requerido para menores de edad'}
                </p>
              </div>
            </div>

            {player.tutorDocumentVerified ? (
              <span className="text-emerald-600 font-bold text-xs">✓ Validado</span>
            ) : (
              <button
                onClick={() => {
                  setUploadType('document');
                  setShowUploadModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all"
              >
                Subir Cédula
              </button>
            )}
          </div>

          {/* Doc 2: Video Consent */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  player.tutorConsentVideoUploaded ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                }`}
              >
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Video de Consentimiento del Tutor</h4>
                <p className="text-[11px] text-slate-500">
                  {player.tutorConsentVideoUploaded ? 'Grabación Aprobada por Glovall Legal' : 'Video corto de 15 segundos'}
                </p>
              </div>
            </div>

            {player.tutorConsentVideoUploaded ? (
              <span className="text-emerald-600 font-bold text-xs">✓ Grabado</span>
            ) : (
              <button
                onClick={() => {
                  setUploadType('video');
                  setShowUploadModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all"
              >
                Grabar Video
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. MY METRICS & BASEBALL IQ PROGRESS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trackman Metrics Overview */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Mis Métricas Registradas en la Academia
            </h3>
            <span className="text-xs text-slate-400">Medido el {player.verificationDate}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100">
              <span className="text-[10px] font-bold text-sky-800 uppercase block">Exit Velocity</span>
              <span className="text-2xl font-black text-sky-900">{player.metrics.exitVelocityMph}</span>
              <span className="text-xs font-semibold text-sky-700 ml-1">MPH</span>
            </div>

            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
              <span className="text-[10px] font-bold text-indigo-800 uppercase block">Arm Velocity</span>
              <span className="text-2xl font-black text-indigo-900">{player.metrics.armVelocityMph}</span>
              <span className="text-xs font-semibold text-indigo-700 ml-1">MPH</span>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">60 Yardas</span>
              <span className="text-2xl font-black text-emerald-900">{player.metrics.sixtyYardDashSec}</span>
              <span className="text-xs font-semibold text-emerald-700 ml-1">sec</span>
            </div>

            <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
              <span className="text-[10px] font-bold text-purple-800 uppercase block">Baseball IQ</span>
              <span className="text-2xl font-black text-purple-900">{player.edTech.baseballIqScore}</span>
              <span className="text-xs font-semibold text-purple-700 ml-1">%</span>
            </div>
          </div>

          {/* Radar 20-80 Bar breakdown */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
            <span className="text-xs font-bold text-slate-700 block">Mi Escala de Scouting 20-80:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500">Hit:</span> <strong>{player.scoutScale.hit} / 80</strong>
              </div>
              <div>
                <span className="text-slate-500">Power:</span> <strong>{player.scoutScale.power} / 80</strong>
              </div>
              <div>
                <span className="text-slate-500">Run:</span> <strong>{player.scoutScale.run} / 80</strong>
              </div>
              <div>
                <span className="text-slate-500">Arm:</span> <strong>{player.scoutScale.arm} / 80</strong>
              </div>
              <div>
                <span className="text-slate-500">Field:</span> <strong>{player.scoutScale.field} / 80</strong>
              </div>
              <div>
                <span className="text-slate-500">Decisión IQ:</span> <strong>{player.scoutScale.iq} / 80</strong>
              </div>
            </div>
          </div>
        </div>

        {/* EdTech & Course Tasks */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1">
              Mi Academia EdTech
            </h3>
            <p className="text-xs text-slate-500">Cursos obligatorios para desarrollo profesional</p>

            <div className="space-y-3 mt-4">
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex items-center justify-between text-xs font-bold text-blue-900 mb-1">
                  <span>Progreso de Biblioteca</span>
                  <span>{player.edTech.libraryProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full"
                    style={{ width: `${player.edTech.libraryProgress}%` }}
                  />
                </div>
                <span className="text-[10px] text-blue-700 mt-1 block">
                  {player.edTech.completedCoursesCount} de {player.edTech.totalCoursesCount} cursos aprobados
                </span>
              </div>

              <button
                onClick={() => onNavigateTab('baseball-iq')}
                className="w-full p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-400" />
                  <span>Hacer Test de Baseball IQ</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[10px] text-slate-500 block">Comparación Proyectada MLB</span>
            <span className="text-xs font-black text-slate-900">{player.comparableMlbPlayer}</span>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-slate-900">
                {uploadType === 'document' ? 'Subir Documento del Tutor' : 'Grabar Video de Consentimiento'}
              </h3>
              <button onClick={() => setShowUploadModal(false)}>✕</button>
            </div>

            {uploadedSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl text-center text-xs font-bold">
                ✓ ¡Archivo subido y verificado exitosamente con el departamento legal de la academia!
              </div>
            ) : (
              <form onSubmit={handleSimulateUpload} className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-2 hover:border-blue-400 cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">
                    {uploadType === 'document'
                      ? 'Arrastra o haz clic para subir foto de Cédula/Pasaporte'
                      : 'Graba o sube video del tutor legal'}
                  </p>
                  <span className="text-[10px] text-slate-400">Formatos: JPG, PNG, MP4, MOV (Max 50MB)</span>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    Confirmar Subida
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
