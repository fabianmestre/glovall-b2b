import React, { useState, useMemo } from 'react';
import {
  Activity,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Filter,
  HelpCircle,
  Info,
  MapPin,
  Plus,
  Radio,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCheck,
  Users,
  X,
  ChevronRight,
  Zap,
  Building2
} from 'lucide-react';
import { Player, PlayerShowcaseParticipation, UserRole } from '../../types';

interface ShowcaseHistoryTabProps {
  player: Player;
  onUpdatePlayer: (updatedPlayer: Player) => void;
  activeRole?: UserRole;
}

export const ShowcaseHistoryTab: React.FC<ShowcaseHistoryTabProps> = ({
  player,
  onUpdatePlayer,
  activeRole,
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedShowcase, setSelectedShowcase] = useState<PlayerShowcaseParticipation | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Form state for adding manual showcase record
  const [formData, setFormData] = useState({
    eventTitle: '',
    eventCategory: 'Showcase Internacional',
    date: new Date().toISOString().split('T')[0],
    location: 'Estadio Quisqueya Juan Marichal',
    city: 'Santo Domingo',
    country: 'República Dominicana',
    source: 'glovall_official' as 'glovall_official' | 'community_suggested',
    status: 'Evaluado Destacado' as 'Evaluado Destacado' | 'Seguimiento Solicitado' | 'Participó' | 'Entrevista Realizada' | 'Reporte Favorable',
    sixtyYards: '',
    exitVelo: '',
    fastballOrArm: '',
    popTimeOrOther: '',
    interestedOrgs: 'New York Yankees, Los Angeles Dodgers',
    scoutInterviewsOrNotes: '',
    coachSummary: '',
  });

  const showcaseList = player.showcaseHistory || [];

  // Filtered showcases
  const filteredShowcases = useMemo(() => {
    return showcaseList.filter((item) => {
      const matchesSearch =
        searchTerm === '' ||
        item.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.city && item.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.interestedOrganizations &&
          item.interestedOrganizations.some((org) => org.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchesCategory =
        selectedCategoryFilter === 'all' ||
        item.eventCategory.toLowerCase().includes(selectedCategoryFilter.toLowerCase());

      const matchesStatus =
        selectedStatusFilter === 'all' || item.status === selectedStatusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [showcaseList, searchTerm, selectedCategoryFilter, selectedStatusFilter]);

  const handleAddShowcase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.eventTitle) return;

    const metricsRecorded = [];
    if (formData.sixtyYards) {
      metricsRecorded.push({
        metricName: 'Sprint 60 Yardas Láser',
        value: formData.sixtyYards,
        benchmarkRating: 'Oficial Láser',
      });
    }
    if (formData.exitVelo) {
      metricsRecorded.push({
        metricName: 'Velocidad de Salida (Exit Velo)',
        value: formData.exitVelo,
        benchmarkRating: 'TrackMan Verificado',
      });
    }
    if (formData.fastballOrArm) {
      metricsRecorded.push({
        metricName: player.position === 'RHP' || player.position === 'LHP' ? 'Fastball Máx' : 'Fuerza de Brazo',
        value: formData.fastballOrArm,
        benchmarkRating: 'Radar Stalker Pro',
      });
    }
    if (formData.popTimeOrOther) {
      metricsRecorded.push({
        metricName: player.position === 'C' ? 'Pop Time a Segunda' : 'Test Físico Complementario',
        value: formData.popTimeOrOther,
        benchmarkRating: 'Certificado Staff',
      });
    }

    const newRecord: PlayerShowcaseParticipation = {
      id: `sh-${Date.now()}`,
      eventId: `ev-custom-${Date.now()}`,
      eventTitle: formData.eventTitle,
      eventCategory: formData.eventCategory,
      date: formData.date,
      location: formData.location,
      city: formData.city,
      country: formData.country,
      source: formData.source,
      status: formData.status,
      metricsRecorded,
      interestedOrganizations: formData.interestedOrgs
        .split(',')
        .map((org) => org.trim())
        .filter(Boolean),
      scoutInterviewsOrNotes: formData.scoutInterviewsOrNotes,
      coachSummary: formData.coachSummary || `Evaluación técnica registrada en el expediente de ${player.fullName}.`,
      recordedByCoachName: player.assignedCoachName || 'Staff Técnico',
      recordedDate: new Date().toISOString().split('T')[0],
    };

    const updatedPlayer: Player = {
      ...player,
      showcaseHistory: [newRecord, ...showcaseList],
    };

    onUpdatePlayer(updatedPlayer);
    setShowAddModal(false);
    setFormData({
      eventTitle: '',
      eventCategory: 'Showcase Internacional',
      date: new Date().toISOString().split('T')[0],
      location: 'Estadio Quisqueya Juan Marichal',
      city: 'Santo Domingo',
      country: 'República Dominicana',
      source: 'glovall_official',
      status: 'Evaluado Destacado',
      sixtyYards: '',
      exitVelo: '',
      fastballOrArm: '',
      popTimeOrOther: '',
      interestedOrgs: 'New York Yankees, Los Angeles Dodgers',
      scoutInterviewsOrNotes: '',
      coachSummary: '',
    });
  };

  const handleDeleteShowcase = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este registro del historial?')) {
      const updated = showcaseList.filter((s) => s.id !== id);
      onUpdatePlayer({
        ...player,
        showcaseHistory: updated,
      });
      if (selectedShowcase?.id === id) {
        setSelectedShowcase(null);
      }
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Historial de Tryouts & Showcases MLB
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Trazabilidad oficial de eventos evaluativos, mediciones TrackMan y seguimiento de organizaciones MLB
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Evento / Tryout</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar evento, sede, equipo..."
            className="w-full pl-8.5 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ×
            </button>
          )}
        </div>

        {/* Category & Status Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-600"
          >
            <option value="all">Todas las Categorías</option>
            <option value="Showcase">Showcases Internacionales</option>
            <option value="Combine">Combines Élite</option>
            <option value="Tryout">Tryouts Abiertos</option>
            <option value="Evaluación">Evaluaciones Técnicas</option>
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-600"
          >
            <option value="all">Todos los Estatus</option>
            <option value="Evaluado Destacado">Evaluado Destacado</option>
            <option value="Reporte Favorable">Reporte Favorable</option>
            <option value="Seguimiento Solicitado">Seguimiento Solicitado</option>
            <option value="Participó">Participó</option>
          </select>

          <span className="text-[11px] font-bold text-slate-500 ml-auto md:ml-2">
            {filteredShowcases.length} de {showcaseList.length} eventos
          </span>
        </div>
      </div>

      {/* Main Executive Table - 100% Width */}
      {filteredShowcases.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
          <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">Sin eventos registrados para este filtro</p>
          <p className="text-[11px] text-slate-400 mt-0.5 max-w-md mx-auto">
            Registra los tryouts, torneos internacionales y combines en los que el atleta ha participado para alimentar su hoja de vida oficial.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3.5 w-32">Fecha & Certificación</th>
                  <th className="py-3 px-3.5">Evento & Sede</th>
                  <th className="py-3 px-3.5">Métricas Clave</th>
                  <th className="py-3 px-3.5">Interés MLB</th>
                  <th className="py-3 px-3.5">Estatus / Veredicto</th>
                  <th className="py-3 px-3.5 text-right w-20">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredShowcases.map((item, idx) => {
                  const isOfficial = item.source === 'glovall_official';
                  return (
                    <tr
                      key={item.id || idx}
                      className="hover:bg-slate-50/80 transition-colors align-top"
                    >
                      {/* 1. Fecha & Certificación */}
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item.date}</span>
                        </div>
                        <div className="mt-1">
                          {isOfficial ? (
                            <span className="px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-bold inline-flex items-center gap-1">
                              <ShieldCheck className="w-2.5 h-2.5 text-blue-600" />
                              Oficial Glovall
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[9px] font-bold inline-flex items-center gap-1">
                              Comunidad
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 2. Evento & Sede */}
                      <td className="py-3 px-3.5">
                        <p className="font-bold text-slate-900 text-xs leading-tight">
                          {item.eventTitle}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {item.eventCategory}
                          </span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {item.location} {item.city ? `• ${item.city}` : ''}
                          </span>
                        </div>
                      </td>

                      {/* 3. Métricas Clave */}
                      <td className="py-3 px-3.5">
                        {item.metricsRecorded && item.metricsRecorded.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {item.metricsRecorded.map((m, mIdx) => (
                              <span
                                key={mIdx}
                                className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-800"
                                title={`${m.metricName}: ${m.value} (${m.benchmarkRating || 'Verificado'})`}
                              >
                                <span className="text-slate-500 font-normal">
                                  {m.metricName.includes('Exit Velo') || m.metricName.includes('Velocidad de Salida')
                                    ? 'EV'
                                    : m.metricName.includes('Sprint') || m.metricName.includes('60')
                                    ? '60 Yd'
                                    : m.metricName.includes('Fastball')
                                    ? 'FB'
                                    : m.metricName.includes('Pop Time')
                                    ? 'Pop'
                                    : m.metricName.split(' ')[0]}
                                  :
                                </span>{' '}
                                <strong className="text-emerald-700">{m.value}</strong>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">Sin métricas registradas</span>
                        )}
                      </td>

                      {/* 4. Interés MLB */}
                      <td className="py-3 px-3.5">
                        {item.interestedOrganizations && item.interestedOrganizations.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {item.interestedOrganizations.slice(0, 3).map((org, oIdx) => (
                              <span
                                key={oIdx}
                                className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold"
                              >
                                {org}
                              </span>
                            ))}
                            {item.interestedOrganizations.length > 3 && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-bold">
                                +{item.interestedOrganizations.length - 3} más
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">Scouting General</span>
                        )}
                      </td>

                      {/* 5. Estatus */}
                      <td className="py-3 px-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            item.status === 'Evaluado Destacado'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : item.status === 'Reporte Favorable'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : item.status === 'Seguimiento Solicitado'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {item.status}
                        </span>
                      </td>

                      {/* 6. Acciones */}
                      <td className="py-3 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedShowcase(item)}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                            title="Ver reporte completo"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {activeRole !== 'player' && (
                            <button
                              onClick={() => handleDeleteShowcase(item.id)}
                              className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                              title="Eliminar registro"
                            >
                              <X className="w-4 h-4" />
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
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL DETALLE COMPLETO DE SHOWCASE */}
      {/* ------------------------------------------------------------- */}
      {selectedShowcase && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xl shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900">
                    {selectedShowcase.eventTitle}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedShowcase.eventCategory} • {selectedShowcase.date}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedShowcase(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Sede y Estatus */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Sede & Ubicación</span>
                <p className="font-bold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {selectedShowcase.location}
                </p>
                <p className="text-slate-500 text-[11px]">
                  {selectedShowcase.city}, {selectedShowcase.country || 'República Dominicana'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Veredicto Oficial</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold inline-block">
                  ★ {selectedShowcase.status}
                </span>
                <p className="text-slate-500 text-[11px]">
                  Fuente: {selectedShowcase.source === 'glovall_official' ? 'Oficial Glovall' : 'Comunidad'}
                </p>
              </div>
            </div>

            {/* Métricas Registradas */}
            {selectedShowcase.metricsRecorded && selectedShowcase.metricsRecorded.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                  Métricas Oficiales Obtenidas en Terreno:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedShowcase.metricsRecorded.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                      <p className="text-[11px] font-medium text-slate-600">{m.metricName}</p>
                      <p className="text-base font-black text-emerald-800">{m.value}</p>
                      {m.benchmarkRating && (
                        <p className="text-[10px] font-bold text-emerald-600 mt-0.5">{m.benchmarkRating}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Organizaciones MLB Interesadas */}
            {selectedShowcase.interestedOrganizations && selectedShowcase.interestedOrganizations.length > 0 && (
              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-blue-900">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Franquicias MLB con Interés Activo:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedShowcase.interestedOrganizations.map((org, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-800 text-xs font-bold"
                    >
                      {org}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notas e Informes */}
            {selectedShowcase.scoutInterviewsOrNotes && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <span className="font-bold text-slate-700 block">Interacción & Entrevistas de Scouts:</span>
                <p className="text-slate-600 leading-relaxed">{selectedShowcase.scoutInterviewsOrNotes}</p>
              </div>
            )}

            {selectedShowcase.coachSummary && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <span className="font-bold text-slate-700 block">Resumen del Staff Técnico:</span>
                <p className="text-slate-600 leading-relaxed">{selectedShowcase.coachSummary}</p>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
              <span>Registrado por: <strong>{selectedShowcase.recordedByCoachName || 'Staff Glovall'}</strong></span>
              <button
                onClick={() => setSelectedShowcase(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Agregar Registro Manual de Showcase */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black">
                    Registrar Evento / Showcase en la Hoja de Vida
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Atleta: {player.fullName} ({player.position})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddShowcase} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Nombre del Showcase / Tryout / Evento *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.eventTitle}
                    onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
                    placeholder="Ej: Showcase Internacional Caribe 2026 / Tryout San Pedro"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Categoría</label>
                  <select
                    value={formData.eventCategory}
                    onChange={(e) => setFormData({ ...formData, eventCategory: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  >
                    <option>Showcase Internacional</option>
                    <option>Evaluación TrackMan</option>
                    <option>Combine Élite</option>
                    <option>Torneo Invitacional</option>
                    <option>Tryout Privado MLB</option>
                    <option>Tryout Abierto</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Fecha del Evento *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Sede o Complejo</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Estadio Quisqueya / Boca Chica"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Resultado / Desempeño</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  >
                    <option>Evaluado Destacado</option>
                    <option>Reporte Favorable</option>
                    <option>Seguimiento Solicitado</option>
                    <option>Participó</option>
                    <option>Entrevista Realizada</option>
                  </select>
                </div>

                {/* Métricas tomadas en el evento */}
                <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <span className="font-black text-slate-900 text-xs block">
                    Métricas Oficiales Obtenidas en Este Evento
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-0.5">
                        Sprint 60 Yardas Láser
                      </label>
                      <input
                        type="text"
                        value={formData.sixtyYards}
                        onChange={(e) => setFormData({ ...formData, sixtyYards: e.target.value })}
                        placeholder="Ej: 6.45 seg"
                        className="w-full p-2 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-0.5">
                        Velocidad de Salida (Exit Velo)
                      </label>
                      <input
                        type="text"
                        value={formData.exitVelo}
                        onChange={(e) => setFormData({ ...formData, exitVelo: e.target.value })}
                        placeholder="Ej: 98.4 MPH"
                        className="w-full p-2 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-0.5">
                        {player.position === 'RHP' || player.position === 'LHP' ? 'Fastball Máx' : 'Fuerza de Brazo'}
                      </label>
                      <input
                        type="text"
                        value={formData.fastballOrArm}
                        onChange={(e) => setFormData({ ...formData, fastballOrArm: e.target.value })}
                        placeholder="Ej: 94 MPH"
                        className="w-full p-2 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-0.5">
                        {player.position === 'C' ? 'Pop Time a 2B' : 'Test Físico / Otro'}
                      </label>
                      <input
                        type="text"
                        value={formData.popTimeOrOther}
                        onChange={(e) => setFormData({ ...formData, popTimeOrOther: e.target.value })}
                        placeholder="Ej: 1.88 seg"
                        className="w-full p-2 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Organizaciones MLB con Interés (separadas por coma)
                  </label>
                  <input
                    type="text"
                    value={formData.interestedOrgs}
                    onChange={(e) => setFormData({ ...formData, interestedOrgs: e.target.value })}
                    placeholder="New York Yankees, Los Angeles Dodgers, San Diego Padres"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Notas de Entrevistas con Scouts
                  </label>
                  <textarea
                    rows={2}
                    value={formData.scoutInterviewsOrNotes}
                    onChange={(e) => setFormData({ ...formData, scoutInterviewsOrNotes: e.target.value })}
                    placeholder="Comentarios realizados por scouts sobre disciplina, carácter o proyección..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Resumen Técnico del Staff de la Academia
                  </label>
                  <textarea
                    rows={2}
                    value={formData.coachSummary}
                    onChange={(e) => setFormData({ ...formData, coachSummary: e.target.value })}
                    placeholder="Conclusiones del staff sobre el rendimiento del atleta en la jornada..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Guardar en Hoja de Vida
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
