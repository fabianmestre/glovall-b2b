import React from 'react';
import {
  Check,
  CheckCircle2,
  FileSpreadsheet,
  Lock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
  X
} from 'lucide-react';
import { RBAC_PERMISSIONS_MATRIX } from '../data/mockData';
import { UserRole } from '../types';

interface RbacMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
}

export const RbacMatrixModal: React.FC<RbacMatrixModalProps> = ({
  isOpen,
  onClose,
  activeRole,
  setActiveRole,
}) => {
  if (!isOpen) return null;

  const roleDefinitions = [
    {
      id: 'admin' as UserRole,
      title: 'Administrador de academia',
      badge: 'Control Total',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      dashboardView: 'Dashboard Central Ejecutivo B2B & Consolidado Financiero',
      coreActions: [
        'Gestión integral de suscripción y facturación institucional',
        'Creación y asignación de entrenadores a prospectos',
        'Visualización y auditoría legal completa del Roster (25 jugadores)',
        'Generador de reportes consolidados y Scout Book Marca Blanca',
        'Control de visibilidad pública ante scouts y auditoría de tutores',
      ],
    },
    {
      id: 'staff' as UserRole,
      title: 'Entrenador / Preparador Físico (Staff)',
      badge: 'Operación & Métricas',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      dashboardView: 'Dashboard Operativo de Entrenamiento y Carga Técnica',
      coreActions: [
        'Carga y actualización de métricas diarias (Exit Velo, 60 Yd, Pop Time, Pitch Velo)',
        'Asignación y revisión de evaluaciones de Baseball IQ',
        'Videoanálisis biomecánico en Studio (trazado de ángulos y soltada)',
        'Registro de asistencia y marcas en Showcases y Combines',
      ],
    },
    {
      id: 'scout' as UserRole,
      title: 'Scout / Evaluador MLB (Invitado / Vista Externa)',
      badge: 'Solo Lectura Verificada',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      dashboardView: 'Portal de Scouting Internacional & Radar 20-80',
      coreActions: [
        'Acceso mediante enlace seguro a "Scout Cards" públicas y verificadas',
        'Filtrado de prospectos por año de firma (2026, 2027, 2028) y posición',
        'Visualización de radares en escala 20-80 y video de bateo / bullpen',
        'Exportación de dossier confidencial de evaluación de talento',
      ],
    },
    {
      id: 'player' as UserRole,
      title: 'Jugador / Prospecto (Usuario B2C Vinculado)',
      badge: 'Perfil Personal & EdTech',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      dashboardView: 'Mi Perfil de Prospecto, Baseball IQ & Radio Pelota',
      coreActions: [
        'Vista de su propio perfil de prospecto y evolución de métricas',
        'Presentación interactiva de Tests de Baseball IQ asignados',
        'Acceso a la Biblioteca de Cursos (Inglés, Nutrición, Mentalidad)',
        'Escucha de transmisiones de Radio Pelota y cápsulas de desarrollo',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="rbac-matrix-modal"
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900">
                  Arquitectura de Roles y Permisos (RBAC)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  Glovall B2B Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Matriz de acceso, dashboards iniciales y políticas de seguridad para academias de béisbol.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Role Cards Grid */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
              1. Definición de los 4 Tipos de Usuario
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roleDefinitions.map((role) => (
                <div
                  key={role.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    activeRole === role.id
                      ? 'bg-blue-50/40 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border mb-1.5 ${role.badgeColor}`}>
                        {role.badge}
                      </span>
                      <h5 className="text-sm font-bold text-slate-900">{role.title}</h5>
                    </div>
                    {activeRole === role.id ? (
                      <span className="text-[11px] font-bold text-blue-600 flex items-center gap-1 bg-blue-100 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Activo
                      </span>
                    ) : (
                      <button
                        onClick={() => setActiveRole(role.id)}
                        className="text-xs font-bold text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-all"
                      >
                        Simular Rol
                      </button>
                    )}
                  </div>

                  <div className="mb-3 text-[11px] font-semibold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400">Dashboard Inicial: </span>
                    {role.dashboardView}
                  </div>

                  <ul className="space-y-1.5">
                    {role.coreActions.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed RBAC Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                2. Matriz Detallada de Permisos por Módulo y Acción
              </h4>
              <span className="text-xs text-slate-400">
                Cumplimiento de Privacidad y Reglamentación MLB
              </span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold">
                    <th className="py-3 px-4">Módulo de Plataforma</th>
                    <th className="py-3 px-4">Acción Permitida</th>
                    <th className="py-3 px-3 text-center">Administrador de academia</th>
                    <th className="py-3 px-3 text-center">Entrenador (Staff)</th>
                    <th className="py-3 px-3 text-center">Scout MLB</th>
                    <th className="py-3 px-3 text-center">Jugador (B2C)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {RBAC_PERMISSIONS_MATRIX.map((perm, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50 hover:bg-blue-50/30'}
                    >
                      <td className="py-3 px-4 font-bold text-slate-900">{perm.module}</td>
                      <td className="py-3 px-4 text-slate-600">
                        <div>{perm.action}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{perm.notes}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {perm.admin ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 font-bold">
                            -
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {perm.staff ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 font-bold">
                            -
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {perm.scout ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 font-bold">
                            -
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {perm.player ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 font-bold">
                            -
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            * El cambio de rol es reactivo y actualiza las pantallas al instante.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            Entendido, Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
