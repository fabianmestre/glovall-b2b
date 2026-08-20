import React, { useState } from 'react';
import { 
  Award, 
  Plus, 
  Bookmark, 
  ExternalLink, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  X, 
  FileCheck, 
  Globe, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { Player, TrajectoryCourseItem } from '../../types';

interface TrajectoryCoursesViewProps {
  player: Player;
  onUpdatePlayer: (updated: Player) => void;
}

export function TrajectoryCoursesView({ player, onUpdatePlayer }: TrajectoryCoursesViewProps) {
  const courses = player.trajectoryCourses || [];

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<TrajectoryCourseItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [institution, setInstitution] = useState('Udemy');
  const [durationHours, setDurationHours] = useState<number>(20);
  const [completionDate, setCompletionDate] = useState(
    new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
  );
  const [score, setScore] = useState('Aprobado');
  const [source, setSource] = useState<'externo' | 'glovall'>('externo');
  const [hasCertificate, setHasCertificate] = useState(true);
  const [certificateUrl, setCertificateUrl] = useState('');
  const [notes, setNotes] = useState('');

  const openCreateModal = () => {
    setEditingCourse(null);
    setTitle('');
    setInstitution('Udemy');
    setDurationHours(20);
    setCompletionDate(new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }));
    setScore('Aprobado');
    setSource('externo');
    setHasCertificate(true);
    setCertificateUrl('');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (c: TrajectoryCourseItem) => {
    setEditingCourse(c);
    setTitle(c.title);
    setInstitution(c.institution);
    setDurationHours(c.durationHours);
    setCompletionDate(c.completionDate);
    setScore(c.score);
    setSource(c.source);
    setHasCertificate(!!c.hasCertificate);
    setCertificateUrl(c.certificateUrl || '');
    setNotes(c.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let updatedCourses: TrajectoryCourseItem[];

    if (editingCourse) {
      updatedCourses = courses.map((c) =>
        c.id === editingCourse.id
          ? {
              ...c,
              title: title.trim(),
              institution: institution.trim(),
              durationHours: Number(durationHours) || 0,
              completionDate: completionDate.trim(),
              score: score.trim(),
              source,
              hasCertificate,
              certificateUrl: certificateUrl.trim() || undefined,
              notes: notes.trim(),
            }
          : c
      );
    } else {
      const newCourse: TrajectoryCourseItem = {
        id: `tc-${Date.now()}`,
        title: title.trim(),
        institution: institution.trim(),
        durationHours: Number(durationHours) || 0,
        completionDate: completionDate.trim(),
        score: score.trim(),
        source,
        hasCertificate,
        certificateUrl: certificateUrl.trim() || undefined,
        notes: notes.trim(),
      };
      updatedCourses = [newCourse, ...courses];
    }

    onUpdatePlayer({
      ...player,
      trajectoryCourses: updatedCourses,
    });

    setIsModalOpen(false);
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('¿Deseas eliminar este curso o certificación del historial?')) {
      const updatedCourses = courses.filter((c) => c.id !== id);
      onUpdatePlayer({
        ...player,
        trajectoryCourses: updatedCourses,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Certificaciones y Cursos</h1>
            <p className="text-sm text-slate-500">
              Demuestra tu compromiso con la formación técnica y académica.
            </p>
          </div>
        </div>

        {/* Amber / Gold solid button matching screenshot 6 */}
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 active:scale-[0.98] transition-all shadow-sm shadow-amber-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Registrar Curso Externo</span>
        </button>
      </div>

      {/* 2. Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Historial Consolidado de Cursos</h2>
              <p className="text-xs text-slate-500">
                Incluye formación interna de Glovall y cursos externos registrados por el jugador.
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
            {courses.length} {courses.length === 1 ? 'curso registrado' : 'cursos registrados'}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">NOMBRE DEL CURSO</th>
                <th className="py-3.5 px-4">INSTITUCIÓN</th>
                <th className="py-3.5 px-4">DURACIÓN (H)</th>
                <th className="py-3.5 px-4">FINALIZACIÓN</th>
                <th className="py-3.5 px-4">PUNTUACIÓN</th>
                <th className="py-3.5 px-4">FUENTE</th>
                <th className="py-3.5 px-4 text-center">CERTIFICADO</th>
                <th className="py-3.5 px-4 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No hay cursos o certificaciones registradas. Haz clic en "Registrar Curso Externo".
                  </td>
                </tr>
              ) : (
                courses.map((c, index) => {
                  const isGlovall = c.source === 'glovall';

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* # */}
                      <td className="py-4 px-4 text-center font-bold text-slate-400 text-xs">
                        {index + 1}
                      </td>

                      {/* NOMBRE DEL CURSO */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer text-xs sm:text-sm">
                          {c.title}
                        </span>
                        {c.notes && (
                          <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs truncate">
                            {c.notes}
                          </p>
                        )}
                      </td>

                      {/* INSTITUCIÓN */}
                      <td className="py-4 px-4 font-semibold text-slate-700 text-xs">
                        {c.institution}
                      </td>

                      {/* DURACIÓN (H) */}
                      <td className="py-4 px-4 font-medium text-slate-600 text-xs">
                        {c.durationHours}
                      </td>

                      {/* FINALIZACIÓN */}
                      <td className="py-4 px-4 text-slate-500 font-medium text-xs">
                        {c.completionDate}
                      </td>

                      {/* PUNTUACIÓN */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-900 text-xs">
                          {c.score}
                        </span>
                      </td>

                      {/* FUENTE */}
                      <td className="py-4 px-4">
                        {isGlovall ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Sparkles className="w-3 h-3 text-blue-500" />
                            <span>Glovall EdTech</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Globe className="w-3 h-3 text-amber-500" />
                            <span>Externo</span>
                          </span>
                        )}
                      </td>

                      {/* CERTIFICADO */}
                      <td className="py-4 px-4 text-center">
                        {c.hasCertificate ? (
                          <span
                            title="Certificado verificado adjunto"
                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600"
                          >
                            <FileCheck className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">-</span>
                        )}
                      </td>

                      {/* ACCIONES */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit */}
                          <button
                            onClick={() => openEditModal(c)}
                            title="Editar curso"
                            className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center justify-center transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteCourse(c.id)}
                            title="Eliminar curso"
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

      {/* 3. Modal Form: Registrar / Editar Curso */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingCourse ? 'Editar Certificación' : 'Registrar Curso Externo'}
                  </h3>
                  <p className="text-xs text-slate-500">Capacitación académica y técnica del jugador.</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4 pt-4 text-xs">
              {/* Nombre del Curso */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nombre del Curso / Título <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Inglés Básico, Alimentación Básica..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Institución */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Institución / Plataforma</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Ej. Udemy, Coursera, Univ..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                {/* Duración */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duración (Horas)</label>
                  <input
                    type="number"
                    value={durationHours}
                    onChange={(e) => setDurationHours(parseInt(e.target.value) || 0)}
                    placeholder="Ej. 20"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Fecha Finalización */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha de Finalización</label>
                  <input
                    type="text"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    placeholder="Ej. 17 feb 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                {/* Puntuación / Estado */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Puntuación o Resultado</label>
                  <input
                    type="text"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="Ej. Aprobado, 95/100, Distinción..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Fuente */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fuente</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as 'externo' | 'glovall')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="externo">Externo (Plataforma / Universidad)</option>
                    <option value="glovall">Glovall EdTech</option>
                  </select>
                </div>

                {/* Certificado Link */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Enlace de Certificado</label>
                  <input
                    type="text"
                    value={certificateUrl}
                    onChange={(e) => {
                      setCertificateUrl(e.target.value);
                      setHasCertificate(!!e.target.value);
                    }}
                    placeholder="URL de verificación o código"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Habilidades / Resumen del Curso</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalles sobre lo aprendido o certificación obtenida..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Botones */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 active:scale-[0.98] transition-all shadow-sm"
                >
                  {editingCourse ? 'Guardar Cambios' : 'Registrar Curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
