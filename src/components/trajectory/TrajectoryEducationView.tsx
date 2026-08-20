import React, { useState } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Clock, 
  FileText, 
  Pencil, 
  Trash2, 
  FileCheck, 
  X, 
  School, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Player, TrajectoryEducationYear, TrajectoryEducationSubject } from '../../types';

interface TrajectoryEducationViewProps {
  player: Player;
  onUpdatePlayer: (updated: Player) => void;
}

export function TrajectoryEducationView({ player, onUpdatePlayer }: TrajectoryEducationViewProps) {
  const educationYears = player.trajectoryEducation || [];

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isSubjectsModalOpen, setIsSubjectsModalOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<TrajectoryEducationYear | null>(null);
  const [selectedYearForSubjects, setSelectedYearForSubjects] = useState<TrajectoryEducationYear | null>(null);

  // Form states
  const [institution, setInstitution] = useState('');
  const [level, setLevel] = useState('Secundaria');
  const [grade, setGrade] = useState('6');
  const [year, setYear] = useState('2026');
  const [average, setAverage] = useState('5.00');
  const [hasCertificate, setHasCertificate] = useState(true);
  const [certificateUrl, setCertificateUrl] = useState('');
  const [subjects, setSubjects] = useState<TrajectoryEducationSubject[]>([
    { id: 'sub-1', name: 'Matemáticas y Razonamiento', grade: '5.00', score: 100, status: 'Destacado' },
    { id: 'sub-2', name: 'Lengua Española & Comunicación', grade: '4.90', score: 98, status: 'Aprobado' },
    { id: 'sub-3', name: 'Ciencias Naturales & Biología', grade: '5.00', score: 100, status: 'Destacado' },
    { id: 'sub-4', name: 'Inglés Avanzado', grade: '4.85', score: 97, status: 'Aprobado' },
  ]);

  const openCreateModal = () => {
    setEditingYear(null);
    setInstitution('Colegio Fundación Colombia');
    setLevel('Secundaria');
    setGrade('6');
    setYear('2026');
    setAverage('5.00');
    setHasCertificate(true);
    setCertificateUrl('https://caribebaseball.do/certificates/cert-fundacion-colombia.pdf');
    setSubjects([
      { id: 'sub-1', name: 'Matemáticas y Razonamiento', grade: '5.00', score: 100, status: 'Destacado' },
      { id: 'sub-2', name: 'Lengua Española & Comunicación', grade: '4.90', score: 98, status: 'Aprobado' },
      { id: 'sub-3', name: 'Ciencias Naturales', grade: '5.00', score: 100, status: 'Destacado' },
      { id: 'sub-4', name: 'Inglés', grade: '4.85', score: 97, status: 'Aprobado' },
    ]);
    setIsFormModalOpen(true);
  };

  const openEditModal = (yr: TrajectoryEducationYear) => {
    setEditingYear(yr);
    setInstitution(yr.institution);
    setLevel(yr.level);
    setGrade(yr.grade);
    setYear(yr.year);
    setAverage(yr.average);
    setHasCertificate(!!yr.hasCertificate);
    setCertificateUrl(yr.certificateUrl || '');
    setSubjects(
      yr.subjects || [
        { id: 'sub-1', name: 'Educación Básica General', grade: yr.average, score: 90, status: 'Aprobado' },
      ]
    );
    setIsFormModalOpen(true);
  };

  const openSubjectsModal = (yr: TrajectoryEducationYear) => {
    setSelectedYearForSubjects(yr);
    setIsSubjectsModalOpen(true);
  };

  const handleAddSubjectRow = () => {
    const newSubject: TrajectoryEducationSubject = {
      id: `sub-${Date.now()}`,
      name: 'Nueva Asignatura',
      grade: '5.00',
      score: 100,
      status: 'Aprobado',
    };
    setSubjects([...subjects, newSubject]);
  };

  const handleRemoveSubjectRow = (subId: string) => {
    setSubjects(subjects.filter((s) => s.id !== subId));
  };

  const handleSaveEducationYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim()) return;

    let updatedList: TrajectoryEducationYear[];

    if (editingYear) {
      updatedList = educationYears.map((yr) =>
        yr.id === editingYear.id
          ? {
              ...yr,
              institution: institution.trim(),
              level: level.trim(),
              grade: grade.trim(),
              year: year.trim(),
              average: average.trim(),
              subjectsCount: subjects.length,
              subjects,
              hasCertificate,
              certificateUrl: certificateUrl.trim() || undefined,
            }
          : yr
      );
    } else {
      const newYear: TrajectoryEducationYear = {
        id: `te-${Date.now()}`,
        institution: institution.trim(),
        level: level.trim(),
        grade: grade.trim(),
        year: year.trim(),
        average: average.trim(),
        subjectsCount: subjects.length,
        subjects,
        hasCertificate,
        certificateUrl: certificateUrl.trim() || undefined,
      };
      updatedList = [newYear, ...educationYears];
    }

    onUpdatePlayer({
      ...player,
      trajectoryEducation: updatedList,
    });

    setIsFormModalOpen(false);
  };

  const handleDeleteEducationYear = (id: string) => {
    if (window.confirm('¿Deseas eliminar este año escolar del historial académico?')) {
      const updatedList = educationYears.filter((yr) => yr.id !== id);
      onUpdatePlayer({
        ...player,
        trajectoryEducation: updatedList,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Perfil Académico</h1>
            <p className="text-sm text-slate-500">Registro de Educación Formal</p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm shadow-blue-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cargar Nuevo Año</span>
        </button>
      </div>

      {/* 2. Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Historial Académico Registrado</h2>
              <p className="text-xs text-slate-500">Resumen de todos los años escolares cargados.</p>
            </div>
          </div>

          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
            {educationYears.length} {educationYears.length === 1 ? 'año registrado' : 'años registrados'}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">INSTITUCIÓN</th>
                <th className="py-3.5 px-4">NIVEL</th>
                <th className="py-3.5 px-4">CURSO/GRADO</th>
                <th className="py-3.5 px-4">AÑO</th>
                <th className="py-3.5 px-4">PROMEDIO</th>
                <th className="py-3.5 px-4">MATERIAS</th>
                <th className="py-3.5 px-4 text-center">CERT.</th>
                <th className="py-3.5 px-4 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {educationYears.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No hay años escolares registrados. Haz clic en "Cargar Nuevo Año".
                  </td>
                </tr>
              ) : (
                educationYears.map((yr, index) => {
                  return (
                    <tr key={yr.id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* # */}
                      <td className="py-4 px-4 text-center font-bold text-slate-400 text-xs">
                        {index + 1}
                      </td>

                      {/* INSTITUCIÓN */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <School className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {yr.institution}
                          </span>
                        </div>
                      </td>

                      {/* NIVEL */}
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {yr.level}
                        </span>
                      </td>

                      {/* CURSO/GRADO */}
                      <td className="py-4 px-4 font-semibold text-slate-800 text-xs">
                        {yr.grade}
                      </td>

                      {/* AÑO */}
                      <td className="py-4 px-4 text-slate-600 font-semibold text-xs">
                        {yr.year}
                      </td>

                      {/* PROMEDIO */}
                      <td className="py-4 px-4 font-black text-blue-600 text-sm">
                        {yr.average}
                      </td>

                      {/* MATERIAS */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => openSubjectsModal(yr)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 font-bold text-[11px] hover:bg-teal-100 transition-colors cursor-pointer border border-teal-200"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{yr.subjectsCount || (yr.subjects ? yr.subjects.length : 1)} Materias</span>
                        </button>
                      </td>

                      {/* CERT. */}
                      <td className="py-4 px-4 text-center">
                        {yr.hasCertificate ? (
                          <span
                            title="Certificado y boletín adjunto"
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
                            onClick={() => openEditModal(yr)}
                            title="Editar año escolar"
                            className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteEducationYear(yr.id)}
                            title="Eliminar registro"
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

      {/* 3. Modal Form: Cargar / Editar Año Escolar */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingYear ? 'Editar Año Escolar' : 'Cargar Nuevo Año Escolar'}
                  </h3>
                  <p className="text-xs text-slate-500">Historial educativo formal del prospecto.</p>
                </div>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEducationYear} className="space-y-4 pt-4 text-xs">
              {/* Institución */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Institución Educativa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="Ej. Colegio Fundación Colombia"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Nivel */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nivel</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Primaria">Primaria</option>
                    <option value="Secundaria">Secundaria</option>
                    <option value="Bachillerato">Bachillerato</option>
                    <option value="Superior / Técnico">Superior / Técnico</option>
                  </select>
                </div>

                {/* Grado */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grado / Curso</label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="Ej. 6, 5, 4..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Año Lectivo */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Año</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Ej. 2026"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Promedio General */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Promedio General <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={average}
                    onChange={(e) => setAverage(e.target.value)}
                    placeholder="Ej. 5.00, 4.00, 95/100"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Certificado Adjunto</label>
                  <input
                    type="text"
                    value={certificateUrl}
                    onChange={(e) => {
                      setCertificateUrl(e.target.value);
                      setHasCertificate(!!e.target.value);
                    }}
                    placeholder="Enlace o nombre de archivo PDF"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Materias Cursadas */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-bold text-slate-700">
                    Materias del Periodo ({subjects.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSubjectRow}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
                  >
                    + Agregar Materia
                  </button>
                </div>

                <div className="space-y-2 max-h-44 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-100">
                  {subjects.map((sub, sIdx) => (
                    <div key={sub.id || sIdx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200/80">
                      <input
                        type="text"
                        value={sub.name}
                        onChange={(e) => {
                          const updated = [...subjects];
                          updated[sIdx].name = e.target.value;
                          setSubjects(updated);
                        }}
                        className="flex-1 px-2 py-1 rounded border border-slate-200 text-[11px]"
                        placeholder="Nombre de Asignatura"
                      />
                      <input
                        type="text"
                        value={sub.grade}
                        onChange={(e) => {
                          const updated = [...subjects];
                          updated[sIdx].grade = e.target.value;
                          setSubjects(updated);
                        }}
                        className="w-16 px-2 py-1 rounded border border-slate-200 text-[11px] text-center font-bold text-blue-600"
                        placeholder="Nota"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSubjectRow(sub.id)}
                        className="w-6 h-6 rounded text-rose-500 hover:bg-rose-50 flex items-center justify-center"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
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
                  {editingYear ? 'Guardar Cambios' : 'Registrar Año'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal Detalle de Materias */}
      {isSubjectsModalOpen && selectedYearForSubjects && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Desglose de Materias</h3>
                  <p className="text-xs text-slate-500">
                    {selectedYearForSubjects.institution} — Grado {selectedYearForSubjects.grade} ({selectedYearForSubjects.year})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSubjectsModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 pt-4 text-xs">
              <div className="flex items-center justify-between bg-blue-50 p-3.5 rounded-xl border border-blue-100">
                <span className="font-bold text-blue-900">Promedio General Ponderado:</span>
                <span className="text-base font-black text-blue-700">{selectedYearForSubjects.average}</span>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-700">Asignaturas Cursadas:</h4>
                <div className="space-y-2">
                  {(selectedYearForSubjects.subjects || [
                    { id: 'sub-1', name: 'Educación Básica Integral', grade: selectedYearForSubjects.average, score: 95, status: 'Destacado' },
                  ]).map((sub, idx) => (
                    <div
                      key={sub.id || idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="font-semibold text-slate-800">{sub.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">{sub.grade}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          {sub.status || 'Aprobado'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsSubjectsModalOpen(false)}
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
