import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Trophy, 
  Pencil, 
  Trash2, 
  Info, 
  X, 
  Sparkles, 
  Medal, 
  Award, 
  MapPin, 
  Shield, 
  AlertCircle 
} from 'lucide-react';
import { Player, TrajectoryTournament } from '../../types';

interface TrajectoryTournamentsViewProps {
  player: Player;
  onUpdatePlayer: (updated: Player) => void;
}

export function TrajectoryTournamentsView({ player, onUpdatePlayer }: TrajectoryTournamentsViewProps) {
  const tournaments = player.trajectoryTournaments || [];

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<TrajectoryTournament | null>(null);
  const [viewingTournament, setViewingTournament] = useState<TrajectoryTournament | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [teamRepresented, setTeamRepresented] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [resultAward, setResultAward] = useState('Participación');
  const [awardType, setAwardType] = useState<'mvp' | 'champion' | 'runner_up' | 'participation' | 'leader' | 'all_star'>('participation');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const openCreateModal = () => {
    setEditingTournament(null);
    setName('');
    setTeamRepresented('Caribe Baseball Academy');
    setStartDate(new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }));
    setEndDate('-');
    setResultAward('Participación');
    setAwardType('participation');
    setLocation('Santo Domingo, RD');
    setNotes('');
    setIsFormModalOpen(true);
  };

  const openEditModal = (t: TrajectoryTournament) => {
    setEditingTournament(t);
    setName(t.name);
    setTeamRepresented(t.teamRepresented);
    setStartDate(t.startDate);
    setEndDate(t.endDate || '-');
    setResultAward(t.resultAward);
    setAwardType(t.awardType);
    setLocation(t.location || '');
    setNotes(t.notes || '');
    setIsFormModalOpen(true);
  };

  const openDetailModal = (t: TrajectoryTournament) => {
    setViewingTournament(t);
    setIsDetailModalOpen(true);
  };

  const handleSaveTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let updatedTournaments: TrajectoryTournament[];

    if (editingTournament) {
      updatedTournaments = tournaments.map(t =>
        t.id === editingTournament.id
          ? {
              ...t,
              name: name.trim(),
              teamRepresented: teamRepresented.trim(),
              startDate: startDate.trim(),
              endDate: endDate.trim() || '-',
              resultAward: resultAward.trim(),
              awardType,
              location: location.trim(),
              notes: notes.trim(),
            }
          : t
      );
    } else {
      const newTournament: TrajectoryTournament = {
        id: `tt-${Date.now()}`,
        name: name.trim(),
        teamRepresented: teamRepresented.trim(),
        startDate: startDate.trim(),
        endDate: endDate.trim() || '-',
        resultAward: resultAward.trim(),
        awardType,
        location: location.trim(),
        notes: notes.trim(),
      };
      updatedTournaments = [newTournament, ...tournaments];
    }

    onUpdatePlayer({
      ...player,
      trajectoryTournaments: updatedTournaments,
    });

    setIsFormModalOpen(false);
  };

  const handleDeleteTournament = (id: string) => {
    if (window.confirm('¿Deseas eliminar este torneo del historial?')) {
      const updatedTournaments = tournaments.filter(t => t.id !== id);
      onUpdatePlayer({
        ...player,
        trajectoryTournaments: updatedTournaments,
      });
    }
  };

  const renderAwardBadge = (tourn: TrajectoryTournament) => {
    const text = tourn.resultAward;
    const type = tourn.awardType;

    if (type === 'mvp' || text.toLowerCase().includes('mvp')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
          <Sparkles className="w-3 h-3 text-blue-500" />
          <span>{text}</span>
        </span>
      );
    }

    if (type === 'champion' || text.toLowerCase().includes('campeón') || text.toLowerCase().includes('oro')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
          <Trophy className="w-3 h-3 text-amber-500" />
          <span>{text}</span>
        </span>
      );
    }

    if (type === 'runner_up' || text.toLowerCase().includes('subcampeón') || text.toLowerCase().includes('plata')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
          <Medal className="w-3 h-3 text-purple-500" />
          <span>{text}</span>
        </span>
      );
    }

    if (type === 'leader' || text.toLowerCase().includes('líder') || text.toLowerCase().includes('all-star')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
          <Award className="w-3 h-3 text-emerald-500" />
          <span>{text}</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
        <Calendar className="w-3 h-3 text-slate-400" />
        <span>{text}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Registro de Torneos</h1>
            <p className="text-sm text-slate-500">
              Eventos oficiales, showcases y participaciones relevantes registradas por el jugador.
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm shadow-blue-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Registrar Participacion</span>
        </button>
      </div>

      {/* 2. Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Historial de Participaciones</h2>
              <p className="text-xs text-slate-500">Resumen cronologico de todos los torneos y showcases registrados.</p>
            </div>
          </div>

          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
            {tournaments.length} {tournaments.length === 1 ? 'evento registrado' : 'eventos registrados'}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">NOMBRE DEL TORNEO</th>
                <th className="py-3.5 px-4">EQUIPO REPRESENTADO</th>
                <th className="py-3.5 px-4">FECHA DE INICIO</th>
                <th className="py-3.5 px-4">FECHA DE FIN</th>
                <th className="py-3.5 px-4">RESULTADO / LOGRO</th>
                <th className="py-3.5 px-4 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {tournaments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Aún no hay torneos o showcases registrados. Haz clic en "Registrar Participacion".
                  </td>
                </tr>
              ) : (
                tournaments.map((tourn, index) => {
                  return (
                    <tr key={tourn.id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* # */}
                      <td className="py-4 px-4 text-center font-bold text-slate-400 text-xs">
                        {index + 1}
                      </td>

                      {/* NOMBRE DEL TORNEO */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">
                          {tourn.name}
                        </div>
                        {tourn.location && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{tourn.location}</span>
                          </div>
                        )}
                      </td>

                      {/* EQUIPO REPRESENTADO */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium text-xs">
                          <Shield className="w-3.5 h-3.5 text-slate-400" />
                          <span>{tourn.teamRepresented}</span>
                        </div>
                      </td>

                      {/* FECHA DE INICIO */}
                      <td className="py-4 px-4 text-slate-600 font-medium text-xs">
                        {tourn.startDate}
                      </td>

                      {/* FECHA DE FIN */}
                      <td className="py-4 px-4 text-slate-500 text-xs">
                        {tourn.endDate || '-'}
                      </td>

                      {/* RESULTADO / LOGRO */}
                      <td className="py-4 px-4">
                        {renderAwardBadge(tourn)}
                      </td>

                      {/* ACCIONES */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Info Button */}
                          <button
                            onClick={() => openDetailModal(tourn)}
                            title="Ver detalles del evento"
                            className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                          >
                            <Info className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => openEditModal(tourn)}
                            title="Editar torneo"
                            className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center justify-center transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteTournament(tourn.id)}
                            title="Eliminar torneo"
                            className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-colors"
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
      </div>

      {/* 3. Modal Form: Registrar / Editar */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingTournament ? 'Editar Torneo / Showcase' : 'Registrar Participación'}
                  </h3>
                  <p className="text-xs text-slate-500">Historial competitivo y eventos en vivo.</p>
                </div>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTournament} className="space-y-4 pt-4 text-xs">
              {/* Nombre del Torneo */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nombre del Torneo / Showcase <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Sub 15 Costa Atlantica, Tryout Bravos..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Equipo Representado */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Equipo Representado</label>
                  <input
                    type="text"
                    value={teamRepresented}
                    onChange={(e) => setTeamRepresented(e.target.value)}
                    placeholder="Ej. Academia Cararin, Individual..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Ubicación */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ubicación / Ciudad</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej. Puerto Plata, RD"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Fecha Inicio */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha de Inicio</label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Ej. 1 feb 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Fecha Fin */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha de Fin</label>
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="Ej. 5 feb 2026 o -"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Resultado / Texto */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Logro / Distinción</label>
                  <input
                    type="text"
                    value={resultAward}
                    onChange={(e) => setResultAward(e.target.value)}
                    placeholder="Ej. MVP, Campeón, Participación..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Tipo de Distinción (para badge) */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Reconocimiento</label>
                  <select
                    value={awardType}
                    onChange={(e) => setAwardType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="mvp">✨ MVP (Más Valioso)</option>
                    <option value="champion">🏆 Campeón / Oro</option>
                    <option value="runner_up">🥈 Subcampeón / Plata</option>
                    <option value="leader">🎖️ Líder / All-Star</option>
                    <option value="participation">📅 Participación</option>
                  </select>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notas / Estadísticas Destacadas</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalles sobre números individuales, scouts presentes o premios..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Botones */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
                >
                  {editingTournament ? 'Guardar Cambios' : 'Registrar Participación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal Detalle: Ver Información Completa */}
      {isDetailModalOpen && viewingTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{viewingTournament.name}</h3>
                  <p className="text-xs text-slate-500">{viewingTournament.teamRepresented}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 pt-4 text-xs">
              <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Reconocimiento:</span>
                  <div>{renderAwardBadge(viewingTournament)}</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Periodo:</span>
                  <span className="font-semibold text-slate-800">
                    {viewingTournament.startDate} — {viewingTournament.endDate || 'Actual'}
                  </span>
                </div>
                {viewingTournament.location && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Sede / Ubicación:</span>
                    <span className="font-semibold text-slate-800">{viewingTournament.location}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Equipo / Delegación:</span>
                  <span className="font-semibold text-slate-800">{viewingTournament.teamRepresented}</span>
                </div>
              </div>

              {viewingTournament.notes && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Notas y Desempeño:</h4>
                  <p className="text-slate-600 bg-white p-3 rounded-xl border border-slate-200/80 leading-relaxed">
                    {viewingTournament.notes}
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
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
