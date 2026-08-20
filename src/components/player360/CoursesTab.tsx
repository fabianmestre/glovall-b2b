import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { NonFormalCourse, Player, UserRole } from '../../types';

interface CoursesTabProps {
  player: Player;
  onUpdatePlayer: (updated: Player) => void;
  activeRole?: UserRole;
}

export const CoursesTab: React.FC<CoursesTabProps> = ({ player, onUpdatePlayer, activeRole }) => {
  const canDeleteHistory = activeRole !== 'admin' && activeRole !== 'scout';
  const [showNonFormalModal, setShowNonFormalModal] = useState(false);
  const [editingNonFormalId, setEditingNonFormalId] = useState<string | null>(null);
  const [nonFormalTitle, setNonFormalTitle] = useState('');
  const [nonFormalCategory, setNonFormalCategory] = useState<
    'Idiomas' | 'Nutrición & Salud' | 'Finanzas para Atletas' | 'Liderazgo & Media' | 'Baseball IQ & Táctica' | 'Tecnología & Biomecánica'
  >('Idiomas');
  const [nonFormalInstitution, setNonFormalInstitution] = useState('');
  const [nonFormalYear, setNonFormalYear] = useState(new Date().getFullYear().toString());
  const [nonFormalHours, setNonFormalHours] = useState('30');
  const [nonFormalStatus, setNonFormalStatus] = useState<'completado' | 'en_progreso'>('completado');
  const [nonFormalCertCode, setNonFormalCertCode] = useState('');
  const [nonFormalSkills, setNonFormalSkills] = useState('');

  const handleOpenNonFormalModal = (record?: NonFormalCourse) => {
    if (record) {
      setEditingNonFormalId(record.id);
      setNonFormalTitle(record.title);
      setNonFormalCategory(record.category);
      setNonFormalInstitution(record.institution);
      setNonFormalYear(record.completionYear);
      setNonFormalHours(record.hoursCount ? record.hoursCount.toString() : '30');
      setNonFormalStatus(record.status);
      setNonFormalCertCode(record.certificateCode || '');
      setNonFormalSkills(record.skillsLearned ? record.skillsLearned.join(', ') : '');
    } else {
      setEditingNonFormalId(null);
      setNonFormalTitle('');
      setNonFormalCategory('Idiomas');
      setNonFormalInstitution('Glovall EdTech Institute');
      setNonFormalYear(new Date().getFullYear().toString());
      setNonFormalHours('45');
      setNonFormalStatus('completado');
      setNonFormalCertCode(`GLV-CERT-${Math.floor(1000 + Math.random() * 9000)}`);
      setNonFormalSkills('Terminología béisbol en inglés, Entrevistas con scouts');
    }
    setShowNonFormalModal(true);
  };

  const handleSaveNonFormalCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const currentList = player.nonFormalCourses || [];
    const parsedSkills = nonFormalSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    let updatedList: NonFormalCourse[];

    if (editingNonFormalId) {
      updatedList = currentList.map((item) =>
        item.id === editingNonFormalId
          ? {
              ...item,
              title: nonFormalTitle,
              category: nonFormalCategory,
              institution: nonFormalInstitution,
              completionYear: nonFormalYear,
              hoursCount: Number(nonFormalHours) || undefined,
              status: nonFormalStatus,
              certificateCode: nonFormalCertCode || undefined,
              skillsLearned: parsedSkills.length > 0 ? parsedSkills : undefined,
            }
          : item
      );
    } else {
      const newItem: NonFormalCourse = {
        id: `nfc-${Date.now()}`,
        title: nonFormalTitle,
        category: nonFormalCategory,
        institution: nonFormalInstitution,
        completionYear: nonFormalYear,
        hoursCount: Number(nonFormalHours) || undefined,
        status: nonFormalStatus,
        certificateCode: nonFormalCertCode || undefined,
        skillsLearned: parsedSkills.length > 0 ? parsedSkills : undefined,
      };
      updatedList = [newItem, ...currentList];
    }

    onUpdatePlayer({
      ...player,
      nonFormalCourses: updatedList,
    });
    setShowNonFormalModal(false);
  };

  const handleDeleteNonFormalCourse = (id: string) => {
    if (confirm('¿Confirmas que deseas eliminar este curso/capacitación?')) {
      const updatedList = (player.nonFormalCourses || []).filter((item) => item.id !== id);
      onUpdatePlayer({
        ...player,
        nonFormalCourses: updatedList,
      });
    }
  };

  const coursesList = player.nonFormalCourses || [];

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Cursos, Certificaciones & Capacitación No Formal
          </h4>
          <p className="text-xs text-slate-500">
            Talleres extracurriculares en idiomas, nutrición, finanzas, media training y biomecánica deportiva
          </p>
        </div>
        <button
          onClick={() => handleOpenNonFormalModal()}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all self-start"
        >
          <Plus className="w-4 h-4" /> Registrar Curso / Certificado
        </button>
      </div>

      {coursesList.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">Sin cursos o certificaciones registrados</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Registra certificaciones en idiomas, finanzas para atletas o talleres complementarios.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Curso / Capacitación</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Categoría</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Institución Emisora</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Año / Horas</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Certificado ID</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Estado</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coursesList.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{course.title}</div>
                      {course.skillsLearned && course.skillsLearned.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {course.skillsLearned.map((sk, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[9px] font-semibold"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {course.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{course.institution}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span className="font-semibold text-slate-900">{course.completionYear}</span>
                        {course.hoursCount && (
                          <span className="text-[10px] text-slate-500 font-normal">({course.hoursCount}h)</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px] font-bold text-slate-600">
                      {course.certificateCode ? (
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                          {course.certificateCode}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          course.status === 'completado'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {course.status === 'completado' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Completado
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" /> En Progreso
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenNonFormalModal(course)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Modificar curso"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {canDeleteHistory && (
                          <button
                            onClick={() => handleDeleteNonFormalCourse(course.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Eliminar curso"
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

      {/* MODAL: COURSE CRUD */}
      {showNonFormalModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                {editingNonFormalId ? 'Editar Curso / Taller' : 'Registrar Curso / Taller'}
              </h4>
              <button
                onClick={() => setShowNonFormalModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNonFormalCourse} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre del Curso / Taller</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Inglés Básico-Intermedio para Beisbolistas"
                  value={nonFormalTitle}
                  onChange={(e) => setNonFormalTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoría</label>
                  <select
                    value={nonFormalCategory}
                    onChange={(e) => setNonFormalCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800"
                  >
                    <option value="Idiomas">Idiomas (Inglés)</option>
                    <option value="Nutrición & Salud">Nutrición & Salud</option>
                    <option value="Finanzas para Atletas">Finanzas para Atletas</option>
                    <option value="Liderazgo & Media">Liderazgo & Media</option>
                    <option value="Baseball IQ & Táctica">Baseball IQ & Táctica</option>
                    <option value="Tecnología & Biomecánica">Tecnología & Biomecánica</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Institución / Proveedor</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Glovall EdTech Academy"
                    value={nonFormalInstitution}
                    onChange={(e) => setNonFormalInstitution(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Año</label>
                  <input
                    type="text"
                    required
                    placeholder="2026"
                    value={nonFormalYear}
                    onChange={(e) => setNonFormalYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Horas Acreditadas</label>
                  <input
                    type="number"
                    placeholder="45"
                    value={nonFormalHours}
                    onChange={(e) => setNonFormalHours(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Código Certificado</label>
                  <input
                    type="text"
                    placeholder="GLV-ENG-891"
                    value={nonFormalCertCode}
                    onChange={(e) => setNonFormalCertCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Habilidades Aprendidas (separadas por comas)</label>
                <input
                  type="text"
                  placeholder="ej. Entrevistas con Scouts, Vida en Spring Training"
                  value={nonFormalSkills}
                  onChange={(e) => setNonFormalSkills(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Estado</label>
                <div className="flex gap-2">
                  {(['completado', 'en_progreso'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNonFormalStatus(st)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-bold capitalize transition-all ${
                        nonFormalStatus === st
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNonFormalModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Guardar Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
