import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  GraduationCap,
  MapPin,
  Plus,
  Save,
  School,
  Trash2,
  X,
} from 'lucide-react';
import { FormalEducation, Player, UserRole } from '../../types';

interface EducationTabProps {
  player: Player;
  onUpdatePlayer: (updated: Player) => void;
  activeRole?: UserRole;
}

export const EducationTab: React.FC<EducationTabProps> = ({ player, onUpdatePlayer, activeRole }) => {
  const canDeleteHistory = activeRole !== 'admin' && activeRole !== 'scout';
  const [showFormalEduModal, setShowFormalEduModal] = useState(false);
  const [editingFormalEduId, setEditingFormalEduId] = useState<string | null>(null);
  const [formalLevel, setFormalLevel] = useState('Secundaria / Bachillerato');
  const [formalInstitution, setFormalInstitution] = useState('');
  const [formalGrade, setFormalGrade] = useState('');
  const [formalStatus, setFormalStatus] = useState<'en_curso' | 'completado' | 'pausado'>('en_curso');
  const [formalGpa, setFormalGpa] = useState('');
  const [formalCity, setFormalCity] = useState('');
  const [formalGradYear, setFormalGradYear] = useState('');
  const [formalNotes, setFormalNotes] = useState('');

  const handleOpenFormalEduModal = (record?: FormalEducation) => {
    if (record) {
      setEditingFormalEduId(record.id);
      setFormalLevel(record.level);
      setFormalInstitution(record.institution);
      setFormalGrade(record.currentGradeOrYear);
      setFormalStatus(record.status);
      setFormalGpa(record.gpaOrAverage || '');
      setFormalCity(record.cityCountry);
      setFormalGradYear(record.graduationYearExpected || '');
      setFormalNotes(record.notes || '');
    } else {
      setEditingFormalEduId(null);
      setFormalLevel('Secundaria / Bachillerato');
      setFormalInstitution('');
      setFormalGrade('4to de Secundaria (10th Grade)');
      setFormalStatus('en_curso');
      setFormalGpa('90/100 (Excelente)');
      setFormalCity(player.hometown || 'San Pedro de Macorís, RD');
      setFormalGradYear('2027');
      setFormalNotes('');
    }
    setShowFormalEduModal(true);
  };

  const handleSaveFormalEducation = (e: React.FormEvent) => {
    e.preventDefault();
    const currentList = player.formalEducation || [];
    let updatedList: FormalEducation[];

    if (editingFormalEduId) {
      updatedList = currentList.map((item) =>
        item.id === editingFormalEduId
          ? {
              ...item,
              level: formalLevel,
              institution: formalInstitution,
              currentGradeOrYear: formalGrade,
              status: formalStatus,
              gpaOrAverage: formalGpa || undefined,
              cityCountry: formalCity,
              graduationYearExpected: formalGradYear || undefined,
              notes: formalNotes || undefined,
            }
          : item
      );
    } else {
      const newItem: FormalEducation = {
        id: `edu-${Date.now()}`,
        level: formalLevel,
        institution: formalInstitution,
        currentGradeOrYear: formalGrade,
        status: formalStatus,
        gpaOrAverage: formalGpa || undefined,
        cityCountry: formalCity,
        graduationYearExpected: formalGradYear || undefined,
        notes: formalNotes || undefined,
      };
      updatedList = [newItem, ...currentList];
    }

    onUpdatePlayer({
      ...player,
      formalEducation: updatedList,
    });
    setShowFormalEduModal(false);
  };

  const handleDeleteFormalEducation = (id: string) => {
    if (confirm('¿Confirmas que deseas eliminar este registro educativo?')) {
      const updatedList = (player.formalEducation || []).filter((item) => item.id !== id);
      onUpdatePlayer({
        ...player,
        formalEducation: updatedList,
      });
    }
  };

  const educationList = player.formalEducation || [];

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <School className="w-4 h-4 text-blue-600" />
            Registro de Educación Formal
          </h4>
          <p className="text-xs text-slate-500">
            Historial de escolaridad formal del atleta (primaria, secundaria, bachillerato acelerado o técnico)
          </p>
        </div>
        <button
          onClick={() => handleOpenFormalEduModal()}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all self-start"
        >
          <Plus className="w-4 h-4" /> Registrar Estudio
        </button>
      </div>

      {educationList.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">Sin estudios formales registrados</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Registra el grado escolar, institución y promedio del jugador.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Nivel / Grado</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Institución Educativa</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Ciudad / País</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Promedio / GPA</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Graduación</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Estado</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {educationList.map((edu) => (
                  <tr key={edu.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{edu.level}</div>
                      <div className="text-[11px] text-blue-600 font-semibold">{edu.currentGradeOrYear}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{edu.institution}</span>
                      </div>
                      {edu.notes && <div className="text-[10px] text-slate-500 mt-0.5">{edu.notes}</div>}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{edu.cityCountry}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {edu.gpaOrAverage ? (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px]">
                          {edu.gpaOrAverage}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {edu.graduationYearExpected ? (
                        <span className="flex items-center gap-1 text-[11px]">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {edu.graduationYearExpected}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          edu.status === 'completado'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : edu.status === 'en_curso'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {edu.status === 'completado' && <CheckCircle2 className="w-3 h-3" />}
                        {edu.status === 'en_curso' && <Clock className="w-3 h-3" />}
                        {edu.status === 'completado' ? 'Completado' : edu.status === 'en_curso' ? 'En Curso' : 'Pausado'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenFormalEduModal(edu)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Modificar estudio"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {canDeleteHistory && (
                          <button
                            onClick={() => handleDeleteFormalEducation(edu.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Eliminar estudio"
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

      {/* MODAL: FORMAL EDUCATION CRUD */}
      {showFormalEduModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                {editingFormalEduId ? 'Editar Estudio Formal' : 'Registrar Estudio Formal'}
              </h4>
              <button
                onClick={() => setShowFormalEduModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFormalEducation} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nivel Educativo</label>
                  <select
                    value={formalLevel}
                    onChange={(e) => setFormalLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium"
                  >
                    <option value="Secundaria / Bachillerato">Secundaria / Bachillerato</option>
                    <option value="Primaria & Básica">Primaria & Básica</option>
                    <option value="Bachillerato Acelerado (Atletas)">Bachillerato Acelerado (Atletas)</option>
                    <option value="Técnico Vocacional">Técnico Vocacional</option>
                    <option value="Educación Bilingüe Especial">Educación Bilingüe Especial</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Grado Actual / Último</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. 4to de Secundaria (10th)"
                    value={formalGrade}
                    onChange={(e) => setFormalGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Institución Educativa / Escuela</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Colegio Cristiano Logos"
                  value={formalInstitution}
                  onChange={(e) => setFormalInstitution(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ciudad / País</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. San Pedro de Macorís, RD"
                    value={formalCity}
                    onChange={(e) => setFormalCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Promedio (GPA)</label>
                  <input
                    type="text"
                    placeholder="ej. 91/100"
                    value={formalGpa}
                    onChange={(e) => setFormalGpa(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Año Graduación</label>
                  <input
                    type="text"
                    placeholder="2027"
                    value={formalGradYear}
                    onChange={(e) => setFormalGradYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Estado</label>
                <div className="flex gap-2">
                  {(['en_curso', 'completado', 'pausado'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFormalStatus(st)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-bold capitalize transition-all ${
                        formalStatus === st
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notas / Observaciones</label>
                <textarea
                  rows={2}
                  placeholder="Horarios adaptados a entrenamiento deportivo..."
                  value={formalNotes}
                  onChange={(e) => setFormalNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFormalEduModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Guardar Estudio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
