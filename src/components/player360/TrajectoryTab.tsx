import React, { useState } from 'react';
import {
  Award,
  Building,
  Calendar,
  Edit3,
  MapPin,
  Plus,
  Save,
  Trash2,
  Trophy,
  User,
  X,
} from 'lucide-react';
import { AcademyHistoryRecord, Player, TournamentAwardRecord, UserRole } from '../../types';

interface TrajectoryTabProps {
  player: Player;
  onUpdatePlayer: (updated: Player) => void;
  activeRole?: UserRole;
}

export const TrajectoryTab: React.FC<TrajectoryTabProps> = ({ player, onUpdatePlayer, activeRole }) => {
  const canDeleteHistory = activeRole !== 'admin' && activeRole !== 'scout';
  const [subTab, setSubTab] = useState<'academies' | 'tournaments'>('academies');

  // Form states for Academy CRUD
  const [showAcademyModal, setShowAcademyModal] = useState(false);
  const [editingAcademyId, setEditingAcademyId] = useState<string | null>(null);
  const [acadName, setAcadName] = useState('');
  const [acadRole, setAcadRole] = useState('');
  const [acadPeriod, setAcadPeriod] = useState('');
  const [acadCoach, setAcadCoach] = useState('');
  const [acadLocation, setAcadLocation] = useState('');
  const [acadStatus, setAcadStatus] = useState<'active_primary' | 'active_specialty' | 'historical'>('active_primary');
  const [acadTransition, setAcadTransition] = useState('');
  const [acadHighlights, setAcadHighlights] = useState('');

  // Form states for Tournament CRUD
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [editingTournamentId, setEditingTournamentId] = useState<string | null>(null);
  const [tourName, setTourName] = useState('');
  const [tourYear, setTourYear] = useState(new Date().getFullYear().toString());
  const [tourTeam, setTourTeam] = useState('');
  const [tourPosition, setTourPosition] = useState('');
  const [tourLocation, setTourLocation] = useState('');
  const [tourDistinctions, setTourDistinctions] = useState('');
  const [tourStats, setTourStats] = useState('');

  // -------------------------------------------------------------
  // CRUD HANDLERS: ACADEMIES
  // -------------------------------------------------------------
  const handleOpenAcademyModal = (record?: AcademyHistoryRecord) => {
    if (record) {
      setEditingAcademyId(record.id);
      setAcadName(record.academyName);
      setAcadRole(record.categoryOrRole);
      setAcadPeriod(record.period);
      setAcadCoach(record.headCoach);
      setAcadLocation(record.location);
      setAcadStatus(record.status || 'active_primary');
      setAcadTransition(record.transitionReason || '');
      setAcadHighlights(record.highlights || '');
    } else {
      setEditingAcademyId(null);
      setAcadName('');
      setAcadRole('Programa de Desarrollo');
      setAcadPeriod('2024 - Presente');
      setAcadCoach('Carlos Rosario');
      setAcadLocation(player.hometown || 'Boca Chica, RD');
      setAcadStatus('active_primary');
      setAcadTransition('Incorporación a programa élite');
      setAcadHighlights('');
    }
    setShowAcademyModal(true);
  };

  const handleSaveAcademy = (e: React.FormEvent) => {
    e.preventDefault();
    const currentList = player.academyHistory || [];
    let updatedList: AcademyHistoryRecord[];

    if (editingAcademyId) {
      updatedList = currentList.map((item) =>
        item.id === editingAcademyId
          ? {
              ...item,
              academyName: acadName,
              categoryOrRole: acadRole,
              period: acadPeriod,
              headCoach: acadCoach,
              location: acadLocation,
              status: acadStatus,
              transitionReason: acadTransition || undefined,
              highlights: acadHighlights || undefined,
            }
          : item
      );
    } else {
      const newItem: AcademyHistoryRecord = {
        id: `acad-${Date.now()}`,
        academyName: acadName,
        categoryOrRole: acadRole,
        period: acadPeriod,
        headCoach: acadCoach,
        location: acadLocation,
        status: acadStatus,
        transitionReason: acadTransition || undefined,
        highlights: acadHighlights || undefined,
      };
      updatedList = [newItem, ...currentList];
    }

    onUpdatePlayer({
      ...player,
      academyHistory: updatedList,
    });
    setShowAcademyModal(false);
  };

  const handleDeleteAcademy = (id: string) => {
    if (confirm('¿Confirmas que deseas eliminar este registro de academia?')) {
      const updatedList = (player.academyHistory || []).filter((item) => item.id !== id);
      onUpdatePlayer({
        ...player,
        academyHistory: updatedList,
      });
    }
  };

  // -------------------------------------------------------------
  // CRUD HANDLERS: TOURNAMENTS
  // -------------------------------------------------------------
  const handleOpenTournamentModal = (record?: TournamentAwardRecord) => {
    if (record) {
      setEditingTournamentId(record.id);
      setTourName(record.tournamentName);
      setTourYear(record.year);
      setTourTeam(record.teamOrSelection);
      setTourPosition(record.positionPlayed);
      setTourLocation(record.location);
      setTourDistinctions(record.distinctions.join(', '));
      setTourStats(record.statsSummary || '');
    } else {
      setEditingTournamentId(null);
      setTourName('');
      setTourYear(new Date().getFullYear().toString());
      setTourTeam('Selección Nacional / Equipo');
      setTourPosition(player.position);
      setTourLocation('Santo Domingo, RD');
      setTourDistinctions('Jugador Más Valioso (MVP), All-Star');
      setTourStats('');
    }
    setShowTournamentModal(true);
  };

  const handleSaveTournament = (e: React.FormEvent) => {
    e.preventDefault();
    const currentList = player.tournamentsAndAwards || [];
    const parsedDistinctions = tourDistinctions
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    let updatedList: TournamentAwardRecord[];

    if (editingTournamentId) {
      updatedList = currentList.map((item) =>
        item.id === editingTournamentId
          ? {
              ...item,
              tournamentName: tourName,
              year: tourYear,
              teamOrSelection: tourTeam,
              positionPlayed: tourPosition,
              location: tourLocation,
              distinctions: parsedDistinctions.length > 0 ? parsedDistinctions : ['Participante Oficial'],
              statsSummary: tourStats || undefined,
            }
          : item
      );
    } else {
      const newItem: TournamentAwardRecord = {
        id: `tr-${Date.now()}`,
        tournamentName: tourName,
        year: tourYear,
        teamOrSelection: tourTeam,
        positionPlayed: tourPosition,
        location: tourLocation,
        distinctions: parsedDistinctions.length > 0 ? parsedDistinctions : ['Participante Destacado'],
        statsSummary: tourStats || undefined,
      };
      updatedList = [newItem, ...currentList];
    }

    onUpdatePlayer({
      ...player,
      tournamentsAndAwards: updatedList,
    });
    setShowTournamentModal(false);
  };

  const handleDeleteTournament = (id: string) => {
    if (confirm('¿Confirmas que deseas eliminar este torneo/distinción?')) {
      const updatedList = (player.tournamentsAndAwards || []).filter((item) => item.id !== id);
      onUpdatePlayer({
        ...player,
        tournamentsAndAwards: updatedList,
      });
    }
  };

  const academiesList = player.academyHistory || [];
  const tournamentsList = player.tournamentsAndAwards || [];

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Sub-selector for Academies vs Tournaments */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setSubTab('academies')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'academies'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-indigo-600" />
            <span>Academias & Ligas ({academiesList.length})</span>
          </button>
          <button
            onClick={() => setSubTab('tournaments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'tournaments'
                ? 'bg-white text-amber-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Torneos & Distinciones ({tournamentsList.length})</span>
          </button>
        </div>

        {subTab === 'academies' ? (
          <button
            onClick={() => handleOpenAcademyModal()}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Registrar Academia
          </button>
        ) : (
          <button
            onClick={() => handleOpenTournamentModal()}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Registrar Torneo / Premio
          </button>
        )}
      </div>

      {/* SUB-VIEW 1: ACADEMIES TABLE */}
      {subTab === 'academies' && (
        <>
          {academiesList.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Building className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">Sin historial de academias registrado</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Registra programas de desarrollo, ligas infantiles o academias anteriores.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Academia / Programa</th>
                      <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Período</th>
                      <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Categoría / Rol</th>
                      <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Entrenador a Cargo</th>
                      <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Ubicación</th>
                      <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Logros / Transición</th>
                      <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {academiesList.map((acad) => (
                      <tr key={acad.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                              <Building className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-slate-900">{acad.academyName}</span>
                                {acad.status === 'active_primary' && (
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                    Matriz Activa
                                  </span>
                                )}
                                {acad.status === 'active_specialty' && (
                                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                                    Especialidad
                                  </span>
                                )}
                                {(!acad.status || acad.status === 'historical') && (
                                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold">
                                    Histórica
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px]">
                            {acad.period}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-indigo-700">{acad.categoryOrRole}</td>
                        <td className="py-3.5 px-4 text-slate-700">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>{acad.headCoach}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{acad.location}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                          {acad.highlights && <div className="font-medium text-slate-800">{acad.highlights}</div>}
                          {acad.transitionReason && (
                            <div className="text-[10px] text-slate-400 mt-0.5">Motivo: {acad.transitionReason}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenAcademyModal(acad)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                              title="Modificar academia"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            {canDeleteHistory && (
                              <button
                                onClick={() => handleDeleteAcademy(acad.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                title="Eliminar academia"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* SUB-VIEW 2: TOURNAMENTS TABLE */}
      {subTab === 'tournaments' && (
        <>
          {tournamentsList.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">Sin torneos o distinciones registradas</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Registra torneos nacionales, selecciones panamericanas o showcases de renombre.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Torneo / Evento</th>
                      <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Año</th>
                      <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Selección / Equipo</th>
                      <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Posición</th>
                      <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Sede</th>
                      <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Distinciones & Stats</th>
                      <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tournamentsList.map((tr) => (
                      <tr key={tr.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>{tr.tournamentName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px]">
                            {tr.year}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-blue-800">{tr.teamOrSelection}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">{tr.positionPlayed}</td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{tr.location}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 mb-1">
                            {tr.distinctions.map((dist, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold inline-flex items-center gap-1"
                              >
                                <Award className="w-3 h-3 text-amber-600" />
                                {dist}
                              </span>
                            ))}
                          </div>
                          {tr.statsSummary && (
                            <div className="text-[10px] font-mono text-slate-500">{tr.statsSummary}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenTournamentModal(tr)}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                              title="Modificar torneo"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            {canDeleteHistory && (
                              <button
                                onClick={() => handleDeleteTournament(tr.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                title="Eliminar torneo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* MODAL: ACADEMY CRUD */}
      {showAcademyModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-600" />
                {editingAcademyId ? 'Editar Academia / Liga' : 'Registrar Academia o Liga'}
              </h4>
              <button
                onClick={() => setShowAcademyModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAcademy} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre de la Academia / Liga</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Caribe Baseball Academy"
                  value={acadName}
                  onChange={(e) => setAcadName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoría / Rol</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Programa Élite / Top Prospect"
                    value={acadRole}
                    onChange={(e) => setAcadRole(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estatus de Vinculación</label>
                  <select
                    value={acadStatus}
                    onChange={(e) => setAcadStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold"
                  >
                    <option value="active_primary">Matriz Activa (Programa Principal)</option>
                    <option value="active_specialty">Activa (Especialidad / Centro Externo)</option>
                    <option value="historical">Histórica / Formativa Anterior</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Período</label>
                  <input
                    type="text"
                    required
                    placeholder="2024 - Presente"
                    value={acadPeriod}
                    onChange={(e) => setAcadPeriod(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ubicación</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Boca Chica, RD"
                    value={acadLocation}
                    onChange={(e) => setAcadLocation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Entrenador Principal a Cargo</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Carlos Rosario & Nelson Peña"
                  value={acadCoach}
                  onChange={(e) => setAcadCoach(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Motivo de Transición</label>
                <input
                  type="text"
                  placeholder="ej. Incorporación a programa internacional de firma"
                  value={acadTransition}
                  onChange={(e) => setAcadTransition(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Logros / Hitos en la Academia</label>
                <input
                  type="text"
                  placeholder="ej. Campeón bateador municipal 3 años consecutivos"
                  value={acadHighlights}
                  onChange={(e) => setAcadHighlights(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAcademyModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Guardar Academia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TOURNAMENT CRUD */}
      {showTournamentModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                {editingTournamentId ? 'Editar Torneo / Distinción' : 'Registrar Torneo / Distinción'}
              </h4>
              <button
                onClick={() => setShowTournamentModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTournament} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre del Torneo / Evento</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Torneo Panamericano Sub-15 FEDOBE"
                  value={tourName}
                  onChange={(e) => setTourName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Equipo o Selección</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Selección Dominicana Sub-15"
                    value={tourTeam}
                    onChange={(e) => setTourTeam(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Año</label>
                  <input
                    type="text"
                    required
                    placeholder="2025"
                    value={tourYear}
                    onChange={(e) => setTourYear(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Posición Jugada</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Campocorto Titular & 3er Bate"
                    value={tourPosition}
                    onChange={(e) => setTourPosition(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ciudad / País</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Barranquilla, Colombia"
                    value={tourLocation}
                    onChange={(e) => setTourLocation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Distinciones / Premios (separadas por comas)</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Jugador Más Valioso (MVP), Campeón Bateador (.485), All-Star"
                  value={tourDistinctions}
                  onChange={(e) => setTourDistinctions(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Resumen Estadístico (Opcional)</label>
                <input
                  type="text"
                  placeholder="ej. 8 JJ, .462 AVG, 3 HR, 11 RBI, 4 BR"
                  value={tourStats}
                  onChange={(e) => setTourStats(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTournamentModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Guardar Torneo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
