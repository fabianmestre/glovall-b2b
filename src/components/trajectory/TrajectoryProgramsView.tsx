import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Check, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  X, 
  Layers,
  MapPin,
  Calendar,
  AlertCircle,
  Mail,
  Send,
  FileText,
  FileCheck,
  Shield,
  ShieldCheck,
  Download,
  Printer,
  QrCode,
  Sparkles,
  Building2,
  UserCheck,
  Clock,
  ExternalLink,
  ArrowRight,
  History,
  Award,
  CheckCircle,
  XCircle,
  Eye,
  DollarSign,
  Star,
  RefreshCw
} from 'lucide-react';
import { 
  Player, 
  TrajectoryProgram, 
  AcademySolicitude, 
  AffiliationAuditEvent 
} from '../../types';

interface TrajectoryProgramsViewProps {
  player: Player;
  onUpdatePlayer: (updated: Player) => void;
}

export function TrajectoryProgramsView({ player, onUpdatePlayer }: TrajectoryProgramsViewProps) {
  const programs: TrajectoryProgram[] = player.trajectoryPrograms || [];
  const requests: AcademySolicitude[] = player.academyRequests || [];
  const auditTrail: AffiliationAuditEvent[] = player.affiliationAuditTrail || [];

  // Main active view tab
  const [activeMainTab, setActiveMainTab] = useState<'programs' | 'requests'>('programs');

  // Filter state for programs
  const [programFilter, setProgramFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Filter state for academy requests
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'accepted' | 'under_review' | 'declined'>('all');

  // Modal states
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<TrajectoryProgram | null>(null);

  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AcademySolicitude | null>(null);

  const [isReleaseLetterModalOpen, setIsReleaseLetterModalOpen] = useState(false);
  const [selectedReleaseProgram, setSelectedReleaseProgram] = useState<TrajectoryProgram | null>(null);

  const [isDesvincularModalOpen, setIsDesvincularModalOpen] = useState(false);
  const [programToDesvincular, setProgramToDesvincular] = useState<TrajectoryProgram | null>(null);
  const [desvinculacionReason, setDesvinculacionReason] = useState('Carta de Libertad otorgada por mutuo acuerdo y pase a nuevo programa de desarrollo.');
  const [desvinculacionDate, setDesvinculacionDate] = useState(new Date().toISOString().split('T')[0]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Program Form State
  const [name, setName] = useState('');
  const [coach, setCoach] = useState('');
  const [directorName, setDirectorName] = useState('');
  const [type, setType] = useState('Residencia');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<'activo' | 'finalizado'>('activo');
  const [note, setNote] = useState('');
  const [location, setLocation] = useState('');
  const [scholarshipCoverage, setScholarshipCoverage] = useState('Beca 100% Residencial & Alimentación');
  const [transitionReason, setTransitionReason] = useState('');

  // Stats calculation
  const totalPrograms = programs.length;
  const activeProgramsCount = programs.filter(p => p.status === 'activo').length;
  const completedProgramsCount = programs.filter(p => p.status === 'finalizado').length;
  const releaseLettersCount = programs.filter(p => p.hasReleaseLetter || p.status === 'finalizado').length;

  const totalRequests = requests.length;
  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;
  const acceptedRequestsCount = requests.filter(r => r.status === 'accepted').length;
  const reviewRequestsCount = requests.filter(r => r.status === 'under_review').length;
  const declinedRequestsCount = requests.filter(r => r.status === 'declined').length;

  // Filtered lists
  const filteredPrograms = programs.filter(p => {
    if (programFilter === 'active') return p.status === 'activo';
    if (programFilter === 'completed') return p.status === 'finalizado';
    return true;
  });

  const filteredRequests = requests.filter(r => {
    if (requestFilter === 'pending') return r.status === 'pending';
    if (requestFilter === 'accepted') return r.status === 'accepted';
    if (requestFilter === 'under_review') return r.status === 'under_review';
    if (requestFilter === 'declined') return r.status === 'declined';
    return true;
  });

  // Handle Open Create Modal
  const openCreateModal = () => {
    setEditingProgram(null);
    setName('');
    setCoach('');
    setDirectorName('');
    setType('Residencia');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setStatus('activo');
    setNote('Sin anotaciones');
    setLocation('San Pedro de Macorís, RD');
    setScholarshipCoverage('Beca 100% Residencial & Alimentación');
    setTransitionReason('');
    setIsProgramModalOpen(true);
  };

  // Handle Open Edit Modal
  const openEditModal = (prog: TrajectoryProgram) => {
    setEditingProgram(prog);
    setName(prog.name);
    setCoach(prog.coach || '');
    setDirectorName(prog.directorName || '');
    setType(prog.type);
    setStartDate(prog.startDate);
    setEndDate(prog.endDate || '');
    setStatus(prog.status);
    setNote(prog.note || 'Sin anotaciones');
    setLocation(prog.location || '');
    setScholarshipCoverage(prog.scholarshipCoverage || 'Beca 100% Residencial & Alimentación');
    setTransitionReason(prog.transitionReason || '');
    setIsProgramModalOpen(true);
  };

  // Handle Save Program (Create / Edit)
  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let updatedPrograms: TrajectoryProgram[];
    const nowStr = new Date().toLocaleDateString('es-DO');

    if (editingProgram) {
      updatedPrograms = programs.map(p => 
        p.id === editingProgram.id 
          ? {
              ...p,
              name: name.trim(),
              coach: coach.trim(),
              directorName: directorName.trim() || undefined,
              type: type.trim(),
              startDate: startDate.trim(),
              endDate: endDate.trim() || undefined,
              status,
              note: note.trim() || 'Sin anotaciones',
              location: location.trim(),
              scholarshipCoverage: scholarshipCoverage.trim(),
              transitionReason: transitionReason.trim() || p.transitionReason,
            }
          : p
      );
      showToast(`Programa "${name}" actualizado con éxito.`);
    } else {
      const newProgram: TrajectoryProgram = {
        id: `tp-${Date.now()}`,
        name: name.trim(),
        coach: coach.trim(),
        directorName: directorName.trim() || 'Director General',
        type: type.trim(),
        startDate: startDate.trim(),
        endDate: endDate.trim() || undefined,
        status,
        note: note.trim() || 'Sin anotaciones',
        location: location.trim(),
        scholarshipCoverage: scholarshipCoverage.trim(),
        transitionReason: transitionReason.trim() || (status === 'finalizado' ? 'Culminación de programa' : undefined),
        hasReleaseLetter: status === 'finalizado',
        releaseLetterCode: status === 'finalizado' ? `CL-GLV-${Date.now().toString().slice(-6)}` : undefined,
        releaseDate: status === 'finalizado' ? (endDate.trim() || nowStr) : undefined,
        signedByTutor: true,
        tutorSignerName: `${player.familyAndEligibility?.father?.fullName || 'Tutor Legal'}`,
      };
      updatedPrograms = [newProgram, ...programs];

      // Also log audit event
      const auditEvent: AffiliationAuditEvent = {
        id: `audit-${Date.now()}`,
        timestamp: `${nowStr}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        eventType: status === 'activo' ? 'vinculacion_inicial' : 'cambio_estatus',
        title: status === 'activo' ? 'Nuevo Programa Deportivo Registrado' : 'Programa Histórico Registrado',
        description: `Se registró ${name} (${type}) con vigencia desde ${startDate}.`,
        academyName: name,
        actor: 'Administrador / Tutor Legal',
        badgeColor: status === 'activo' ? 'emerald' : 'blue',
        evidenceCode: newProgram.releaseLetterCode || `REG-${Date.now().toString().slice(-6)}`,
      };

      onUpdatePlayer({
        ...player,
        trajectoryPrograms: updatedPrograms,
        affiliationAuditTrail: [auditEvent, ...auditTrail],
      });

      showToast(`Programa "${name}" registrado correctamente.`);
      setIsProgramModalOpen(false);
      return;
    }

    onUpdatePlayer({
      ...player,
      trajectoryPrograms: updatedPrograms,
    });

    setIsProgramModalOpen(false);
  };

  // Open Desvincular Modal
  const openDesvincularFlow = (prog: TrajectoryProgram) => {
    setProgramToDesvincular(prog);
    setDesvinculacionReason('Carta de Libertad otorgada por mutuo acuerdo y pase a nuevo programa de desarrollo.');
    setDesvinculacionDate(new Date().toLocaleDateString('es-DO'));
    setIsDesvincularModalOpen(true);
  };

  // Confirm Desvinculacion and Issue Release Letter
  const handleConfirmDesvinculacion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!programToDesvincular) return;

    const releaseCode = `CL-GLV-${Date.now().toString().slice(-6)}`;
    const nowStr = new Date().toLocaleDateString('es-DO');

    const updatedPrograms = programs.map(p => {
      if (p.id === programToDesvincular.id) {
        return {
          ...p,
          status: 'finalizado' as const,
          endDate: desvinculacionDate || nowStr,
          transitionReason: desvinculacionReason,
          hasReleaseLetter: true,
          releaseLetterCode: releaseCode,
          releaseDate: desvinculacionDate || nowStr,
          signedByTutor: true,
          tutorSignerName: `${player.familyAndEligibility?.father?.fullName || 'Tutor Legal'}`,
        };
      }
      return p;
    });

    const auditEvent: AffiliationAuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: `${nowStr}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      eventType: 'emision_carta_libertad',
      title: 'Emisión de Carta de Libertad y Desvinculación',
      description: `Se formalizó la desvinculación de ${programToDesvincular.name}. Motivo: ${desvinculacionReason}.`,
      academyName: programToDesvincular.name,
      actor: `${programToDesvincular.directorName || 'Director de Academia'} & Glovall Compliance`,
      badgeColor: 'amber',
      evidenceCode: releaseCode,
    };

    onUpdatePlayer({
      ...player,
      trajectoryPrograms: updatedPrograms,
      affiliationAuditTrail: [auditEvent, ...auditTrail],
    });

    setIsDesvincularModalOpen(false);
    showToast(`Carta de Libertad (${releaseCode}) generada con éxito para ${programToDesvincular.name}.`);
  };

  // Handle Delete Program
  const handleDeleteProgram = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este registro de tu trayectoria?')) {
      const updatedPrograms = programs.filter(p => p.id !== id);
      onUpdatePlayer({
        ...player,
        trajectoryPrograms: updatedPrograms,
      });
      showToast('Registro eliminado de la trayectoria.');
    }
  };

  // Open Release Letter Document Viewer
  const handleViewReleaseLetter = (prog: TrajectoryProgram) => {
    setSelectedReleaseProgram(prog);
    setIsReleaseLetterModalOpen(true);
  };

  // Open Request Proposal Modal
  const handleViewProposal = (req: AcademySolicitude) => {
    setSelectedRequest(req);
    setIsProposalModalOpen(true);
  };

  // Accept Academy Request Flow
  const handleAcceptRequest = (req: AcademySolicitude) => {
    const nowStr = new Date().toLocaleDateString('es-DO');

    // 1. Update requests list
    const updatedRequests = requests.map(r => 
      r.id === req.id 
        ? {
            ...r,
            status: 'accepted' as const,
            tutorDecisionDate: nowStr,
            tutorDecisionNote: 'Oferta aceptada formalmente por el tutor legal del prospecto.',
          }
        : r
    );

    // 2. Automatically create new active Trajectory Program
    const newProg: TrajectoryProgram = {
      id: `tp-from-req-${Date.now()}`,
      name: req.academyName,
      coach: req.directorName,
      directorName: req.directorName,
      type: req.programType,
      startDate: nowStr,
      status: 'activo',
      note: `Incorporación tras aceptar solicitud formal de reclutamiento. ${req.scholarshipOffer}.`,
      location: req.academyLocation,
      scholarshipCoverage: req.scholarshipOffer,
      signedByTutor: true,
      tutorSignerName: `${player.familyAndEligibility?.father?.fullName || 'Tutor Legal'}`,
    };

    // 3. Log Audit Trail
    const auditEvent: AffiliationAuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: `${nowStr}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      eventType: 'solicitud_aceptada',
      title: 'Solicitud de Academia Aceptada',
      description: `El tutor legal aceptó la propuesta de ${req.academyName} (${req.programOffered}). Atleta incorporado como Activo.`,
      academyName: req.academyName,
      actor: `${player.familyAndEligibility?.father?.fullName || 'Tutor Legal'} (Aprobación Familiar)`,
      badgeColor: 'emerald',
      evidenceCode: `VINC-${Date.now().toString().slice(-6)}`,
    };

    onUpdatePlayer({
      ...player,
      availabilityStatus: 'en_desarrollo',
      academyRequests: updatedRequests,
      trajectoryPrograms: [newProg, ...programs],
      affiliationAuditTrail: [auditEvent, ...auditTrail],
    });

    if (isProposalModalOpen) {
      setIsProposalModalOpen(false);
    }

    showToast(`¡Solicitud de "${req.academyName}" Aceptada! El jugador ha sido vinculado al programa activo.`);
  };

  // Decline Academy Request Flow
  const handleDeclineRequest = (req: AcademySolicitude, reason?: string) => {
    const nowStr = new Date().toLocaleDateString('es-DO');
    const customReason = reason || 'Oferta declinada por el tutor legal tras evaluación de alternativas formativas.';

    const updatedRequests = requests.map(r => 
      r.id === req.id 
        ? {
            ...r,
            status: 'declined' as const,
            tutorDecisionDate: nowStr,
            tutorDecisionNote: customReason,
            rejectionReason: customReason,
          }
        : r
    );

    const auditEvent: AffiliationAuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: `${nowStr}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      eventType: 'solicitud_rechazada',
      title: 'Solicitud de Academia Rechazada',
      description: `El tutor legal declinó la propuesta de ${req.academyName}. Razón: ${customReason}.`,
      academyName: req.academyName,
      actor: `${player.familyAndEligibility?.father?.fullName || 'Tutor Legal'}`,
      badgeColor: 'rose',
      evidenceCode: `DEC-${Date.now().toString().slice(-6)}`,
    };

    onUpdatePlayer({
      ...player,
      academyRequests: updatedRequests,
      affiliationAuditTrail: [auditEvent, ...auditTrail],
    });

    if (isProposalModalOpen) {
      setIsProposalModalOpen(false);
    }

    showToast(`Solicitud de "${req.academyName}" marcada como rechazada.`);
  };

  // Mark Request Under Review
  const handleSetUnderReview = (req: AcademySolicitude) => {
    const updatedRequests = requests.map(r => 
      r.id === req.id ? { ...r, status: 'under_review' as const } : r
    );

    onUpdatePlayer({
      ...player,
      academyRequests: updatedRequests,
    });

    if (isProposalModalOpen && selectedRequest?.id === req.id) {
      setSelectedRequest({ ...selectedRequest, status: 'under_review' });
    }

    showToast(`Solicitud de "${req.academyName}" puesta en estado "En Evaluación".`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-medium">{toastMessage}</p>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Programas & Vinculaciones de Academias</h1>
              {pendingRequestsCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold animate-pulse border border-amber-300">
                  {pendingRequestsCount} solicitud{pendingRequestsCount > 1 ? 'es' : ''} pendiente{pendingRequestsCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500">
              Historial de academias, cartas de libertad oficiales y solicitudes de reclutamiento dirigidas al jugador.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm shadow-blue-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Registrar Programa</span>
          </button>
        </div>
      </div>

      {/* 2. Top Sub-Navigation Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60 overflow-x-auto">
        <button
          onClick={() => setActiveMainTab('programs')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeMainTab === 'programs'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Programas & Vinculaciones</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black">
            {totalPrograms}
          </span>
        </button>

        <button
          onClick={() => setActiveMainTab('requests')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeMainTab === 'requests'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Mail className="w-4 h-4 text-amber-600" />
          <span>Historial de Solicitudes de Academias</span>
          {pendingRequestsCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse">
              {pendingRequestsCount} Nuevas
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black">
              {totalRequests}
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: PROGRAMAS & VINCULACIONES */}
      {/* ========================================================================= */}
      {activeMainTab === 'programs' && (
        <div className="space-y-4">
          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Table Header Controls */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Estructura de Vinculación y Programas</h2>
                  <p className="text-xs text-slate-500">Detalle de academias, constancias de liberación y estatus formativo.</p>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setProgramFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    programFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todos ({totalPrograms})
                </button>
                <button
                  onClick={() => setProgramFilter('active')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    programFilter === 'active'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Vigentes ({activeProgramsCount})
                </button>
                <button
                  onClick={() => setProgramFilter('completed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    programFilter === 'completed'
                      ? 'bg-white text-slate-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Históricos ({completedProgramsCount})
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                    <th className="py-3.5 px-4">ACADEMIA / PROGRAMA</th>
                    <th className="py-3.5 px-4">MODALIDAD / BECA</th>
                    <th className="py-3.5 px-4">PERÍODO / VIGENCIA</th>
                    <th className="py-3.5 px-4">DOCUMENTACIÓN & MOTIVO</th>
                    <th className="py-3.5 px-4 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredPrograms.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        No hay programas registrados con este filtro.
                      </td>
                    </tr>
                  ) : (
                    filteredPrograms.map((prog, index) => {
                      const initial = prog.name.charAt(0).toUpperCase() || 'P';
                      const isActive = prog.status === 'activo';

                      return (
                        <tr key={prog.id} className="hover:bg-slate-50/60 transition-colors group">
                          {/* # */}
                          <td className="py-4 px-4 text-center font-bold text-slate-400 text-xs">
                            {index + 1}
                          </td>

                          {/* PROGRAMA / ENTRENADOR */}
                          <td className="py-4 px-4">
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${
                                isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {initial}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-slate-900 text-sm">
                                    {prog.name}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                                      isActive
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                                    }`}
                                  >
                                    {isActive ? 'ACTIVO / VIGENTE' : 'FINALIZADO'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 flex-wrap">
                                  {prog.coach && (
                                    <span>
                                      Coach: <strong className="text-slate-700">{prog.coach}</strong>
                                    </span>
                                  )}
                                  {prog.location && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-slate-400" />
                                        {prog.location}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* MODALIDAD / BECA */}
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                                {prog.type}
                              </span>
                              {prog.scholarshipCoverage && (
                                <p className="text-[11px] text-slate-500 font-medium">
                                  {prog.scholarshipCoverage}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* VIGENCIA */}
                          <td className="py-4 px-4">
                            {isActive ? (
                              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>Desde {prog.startDate} (En Desarrollo)</span>
                              </div>
                            ) : (
                              <div className="text-[11px] text-slate-600 font-medium space-y-0.5">
                                <div>{prog.startDate} {prog.endDate ? `— ${prog.endDate}` : ''}</div>
                                <span className="text-[10px] text-slate-400 block">Ciclo cerrado</span>
                              </div>
                            )}
                          </td>

                          {/* DOCUMENTACIÓN & MOTIVO */}
                          <td className="py-4 px-4">
                            <div className="space-y-1 max-w-[240px]">
                              {prog.hasReleaseLetter ? (
                                <button
                                  onClick={() => handleViewReleaseLetter(prog)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[11px] hover:bg-amber-100 transition-colors cursor-pointer"
                                >
                                  <FileCheck className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Carta de Libertad ({prog.releaseLetterCode || 'Certificada'})</span>
                                </button>
                              ) : isActive ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  Afiliación Federativa Vigente
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">Sin carta digital</span>
                              )}

                              {prog.transitionReason && (
                                <p className="text-[11px] text-slate-500 line-clamp-2" title={prog.transitionReason}>
                                  {prog.transitionReason}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* ACCIONES */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* If active, offer to generate release letter / desvincular */}
                              {isActive && (
                                <button
                                  onClick={() => openDesvincularFlow(prog)}
                                  title="Desvincular y Emitir Carta de Libertad"
                                  className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-[11px] font-bold flex items-center gap-1 transition-colors"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>Liberar</span>
                                </button>
                              )}

                              {/* If has release letter, quick view */}
                              {prog.hasReleaseLetter && (
                                <button
                                  onClick={() => handleViewReleaseLetter(prog)}
                                  title="Ver Documento Oficial de Carta de Libertad"
                                  className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center justify-center transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Edit */}
                              <button
                                onClick={() => openEditModal(prog)}
                                title="Editar datos del programa"
                                className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteProgram(prog.id)}
                                title="Eliminar programa"
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: SOLICITUDES HECHAS POR LAS ACADEMIAS AL JUGADOR */}
      {/* ========================================================================= */}
      {activeMainTab === 'requests' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Filtrar:</span>
              <button
                onClick={() => setRequestFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  requestFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todas ({totalRequests})
              </button>
              <button
                onClick={() => setRequestFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  requestFilter === 'pending'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                Pendientes ({pendingRequestsCount})
              </button>
              <button
                onClick={() => setRequestFilter('accepted')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  requestFilter === 'accepted'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                Aceptadas ({acceptedRequestsCount})
              </button>
              <button
                onClick={() => setRequestFilter('under_review')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  requestFilter === 'under_review'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                }`}
              >
                En Evaluación ({reviewRequestsCount})
              </button>
              <button
                onClick={() => setRequestFilter('declined')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  requestFilter === 'declined'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                }`}
              >
                Rechazadas ({declinedRequestsCount})
              </button>
            </div>
          </div>

          {/* Table View of Academy Requests */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-3 text-center w-12">#</th>
                    <th className="py-3.5 px-4">Academia / Entidad</th>
                    <th className="py-3.5 px-4">Programa Ofertado</th>
                    <th className="py-3.5 px-4">Beca & Viáticos</th>
                    <th className="py-3.5 px-4">Fechas & Directiva</th>
                    <th className="py-3.5 px-4">Estado / Decisión</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 px-4 text-center text-slate-400">
                        <Mail className="w-9 h-9 mx-auto mb-2 text-slate-300" />
                        <p className="font-semibold text-slate-700 text-sm">No hay solicitudes en esta categoría.</p>
                        <p className="text-xs text-slate-500 mt-1">Las solicitudes de vinculación recibidas de academias aparecerán aquí.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req, index) => {
                      const isPending = req.status === 'pending';
                      const isAccepted = req.status === 'accepted';
                      const isUnderReview = req.status === 'under_review';
                      const isDeclined = req.status === 'declined';

                      return (
                        <tr 
                          key={req.id} 
                          className={`hover:bg-slate-50/70 transition-colors ${
                            isPending 
                              ? 'bg-amber-50/20' 
                              : isAccepted 
                              ? 'bg-emerald-50/15' 
                              : isUnderReview 
                              ? 'bg-purple-50/15' 
                              : ''
                          }`}
                        >
                          {/* # */}
                          <td className="py-4 px-3 text-center font-bold text-slate-400 text-xs">
                            {index + 1}
                          </td>

                          {/* ACADEMIA / UBICACIÓN */}
                          <td className="py-4 px-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs">
                                {req.academyLogo || '⚾'}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-slate-900 text-sm">
                                    {req.academyName}
                                  </span>
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60">
                                    <ShieldCheck className="w-3 h-3" />
                                    {req.glovallRatingScore || 95} pts
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span>{req.academyLocation}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* PROGRAMA OFERTADO */}
                          <td className="py-4 px-4 max-w-[220px]">
                            <div className="space-y-1">
                              <p className="font-bold text-slate-900 text-xs leading-snug line-clamp-2" title={req.programOffered}>
                                {req.programOffered}
                              </p>
                              <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[10px]">
                                {req.programType}
                              </span>
                            </div>
                          </td>

                          {/* BECA & VIÁTICOS */}
                          <td className="py-4 px-4 max-w-[200px]">
                            <div className="space-y-1">
                              <div className="text-xs font-semibold text-slate-800 line-clamp-2" title={req.scholarshipOffer}>
                                {req.scholarshipOffer}
                              </div>
                              {req.monthlyAllowance && (
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200/60">
                                  <span>Viáticos: {req.monthlyAllowance}</span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* FECHAS & DIRECTIVA */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="space-y-1 text-[11px] text-slate-600">
                              <div>
                                <span className="text-slate-400">Enviada: </span>
                                <strong className="text-slate-700">{req.sentDate}</strong>
                              </div>
                              <div>
                                <span className="text-slate-400">Vence: </span>
                                <strong className="text-amber-700">{req.expirationDate}</strong>
                              </div>
                              <div className="text-[10px] text-slate-500">
                                Dir: <span className="font-medium text-slate-700">{req.directorName}</span>
                              </div>
                            </div>
                          </td>

                          {/* ESTADO / DECISIÓN */}
                          <td className="py-4 px-4">
                            <div className="space-y-1.5">
                              <div>
                                {isPending && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-300 animate-pulse whitespace-nowrap">
                                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                                    Pendiente Tutor
                                  </span>
                                )}
                                {isAccepted && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-300 whitespace-nowrap">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    Aceptada
                                  </span>
                                )}
                                {isUnderReview && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 text-[11px] font-bold border border-purple-300 whitespace-nowrap">
                                    <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
                                    En Evaluación
                                  </span>
                                )}
                                {isDeclined && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 text-[11px] font-bold border border-rose-300 whitespace-nowrap">
                                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                    Declinada
                                  </span>
                                )}
                              </div>

                              {req.tutorDecisionNote && (
                                <p className="text-[10px] text-slate-500 line-clamp-1 italic max-w-[170px]" title={req.tutorDecisionNote}>
                                  "{req.tutorDecisionNote}"
                                </p>
                              )}
                            </div>
                          </td>

                          {/* ACCIONES */}
                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Ver Propuesta Modal */}
                              <button
                                onClick={() => handleViewProposal(req)}
                                title="Ver carta formal y cláusulas completas"
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <FileText className="w-3.5 h-3.5 text-slate-600" />
                                <span>Detalle</span>
                              </button>

                              {/* Interactive Decision Actions */}
                              {(isPending || isUnderReview) && (
                                <>
                                  {isPending && (
                                    <button
                                      onClick={() => handleSetUnderReview(req)}
                                      title="Poner en evaluación técnica"
                                      className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold transition-colors border border-purple-200/80 cursor-pointer"
                                    >
                                      <RefreshCw className="w-3.5 h-3.5" />
                                    </button>
                                  )}

                                  <button
                                    onClick={() => handleDeclineRequest(req)}
                                    title="Rechazar propuesta"
                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition-colors border border-rose-200/80 cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => handleAcceptRequest(req)}
                                    title="Aceptar y vincular al roster oficial"
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 active:scale-[0.98] cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Aceptar</span>
                                  </button>
                                </>
                              )}

                              {isAccepted && (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200/60">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Vinculado</span>
                                </span>
                              )}
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CARTA DE LIBERTAD / CONSTANCIA DE DESVINCULACIÓN OFICIAL */}
      {/* ========================================================================= */}
      {isReleaseLetterModalOpen && selectedReleaseProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 space-y-6 my-8">
            {/* Modal Top Actions */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                <FileCheck className="w-4 h-4 text-amber-600" />
                <span>Documento Oficial Certificado por Glovall Compliance</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  title="Imprimir"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsReleaseLetterModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Formal Certificate Layout */}
            <div className="p-6 sm:p-8 rounded-2xl bg-amber-50/20 border-2 border-amber-200/80 relative overflow-hidden space-y-6 font-serif text-slate-800">
              {/* Watermark */}
              <div className="absolute right-6 -bottom-10 text-9xl font-black text-amber-900/5 select-none pointer-events-none font-sans">
                GLOVALL
              </div>

              {/* Certificate Header */}
              <div className="text-center space-y-2 border-b border-amber-200/60 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-sans font-black text-xl mx-auto flex items-center justify-center shadow-md">
                  ⚾
                </div>
                <h3 className="text-xl font-bold tracking-tight uppercase text-slate-900">
                  Carta de Libertad & Desvinculación Oficial
                </h3>
                <p className="text-xs font-sans text-slate-500">
                  Registro Nacional de Prospectos de Béisbol • Código Único: <strong>{selectedReleaseProgram.releaseLetterCode || 'CL-GLV-2026-089'}</strong>
                </p>
              </div>

              {/* Body Text */}
              <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700">
                <p>
                  Por medio de la presente constancia, la institución deportiva <strong>{selectedReleaseProgram.name}</strong>, ubicada en <strong>{selectedReleaseProgram.location || 'República Dominicana'}</strong>, certifica formalmente que el atleta prospecto:
                </p>

                <div className="p-4 rounded-xl bg-white/80 border border-amber-200/60 font-sans space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nombre del Atleta:</span>
                    <strong className="text-slate-900">{player.fullName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Posición & Clase:</span>
                    <strong className="text-slate-900">{player.position} • Clase {player.signingClass}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fecha de Inicio de Afiliación:</span>
                    <span className="text-slate-800">{selectedReleaseProgram.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fecha de Liberación / Desvinculación:</span>
                    <strong className="text-amber-800">{selectedReleaseProgram.endDate || selectedReleaseProgram.releaseDate || '06/02/2026'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Modalidad Cursada:</span>
                    <span className="text-slate-800">{selectedReleaseProgram.type}</span>
                  </div>
                </div>

                <p>
                  Ha cumplido a cabalidad con los compromisos acordados, <strong>no existiendo a la fecha ningún reclamo económico, contractual ni federativo pendiente</strong>. En consecuencia, se otorga <strong>PLENA LIBERTAD DE VINCULACIÓN</strong> para que el prospecto pueda incorporarse libremente a cualquier academia, programa o representación deportiva.
                </p>

                <div className="p-3 rounded-xl bg-amber-100/50 border border-amber-200 text-xs font-sans text-amber-900">
                  <strong>Motivo de Liberación:</strong> {selectedReleaseProgram.transitionReason || 'Carta de Libertad otorgada por mutuo acuerdo tras culminación de etapa formativa.'}
                </div>
              </div>

              {/* Signatures & QR */}
              <div className="pt-6 border-t border-amber-200/60 grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans items-end">
                {/* Director Signature */}
                <div className="text-center space-y-1">
                  <div className="h-10 border-b border-slate-400 mx-auto w-3/4 flex items-end justify-center pb-1 text-slate-600 font-serif italic text-xs">
                    {selectedReleaseProgram.coach || selectedReleaseProgram.directorName || 'Firma Director'}
                  </div>
                  <span className="font-bold text-[11px] text-slate-800 block">
                    {selectedReleaseProgram.directorName || selectedReleaseProgram.coach || 'Director General'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Director de Academia</span>
                </div>

                {/* Tutor Signature */}
                <div className="text-center space-y-1">
                  <div className="h-10 border-b border-slate-400 mx-auto w-3/4 flex items-end justify-center pb-1 text-slate-600 font-serif italic text-xs">
                    {player.familyAndEligibility?.father?.fullName || 'José Valdez'}
                  </div>
                  <span className="font-bold text-[11px] text-slate-800 block">
                    {player.familyAndEligibility?.father?.fullName || 'José Valdez'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Padre / Tutor Legal</span>
                </div>

                {/* QR Code Verification */}
                <div className="flex flex-col items-center justify-center text-center space-y-1 bg-white p-2.5 rounded-xl border border-amber-200">
                  <QrCode className="w-10 h-10 text-slate-900" />
                  <span className="text-[9px] font-bold text-slate-500">Validación Blockchain</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 font-sans">
              <button
                type="button"
                onClick={() => setIsReleaseLetterModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100 transition-colors"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Constancia en PDF descargada con éxito.');
                  setIsReleaseLetterModalOpen(false);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-md active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>Descargar PDF Certificado</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: VER PROPUESTA FORMAL DE ACADEMIA & CLAUSULAS */}
      {/* ========================================================================= */}
      {isProposalModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                  {selectedRequest.academyLogo || '🏟️'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Propuesta Formal de Incorporación
                  </h3>
                  <p className="text-xs text-slate-500">{selectedRequest.academyName} • {selectedRequest.academyLocation}</p>
                </div>
              </div>
              <button
                onClick={() => setIsProposalModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Proposal Content */}
            <div className="space-y-4 text-xs">
              {/* Header Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Programa:</span>
                  <span className="font-bold text-slate-900">{selectedRequest.programOffered}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Modalidad:</span>
                  <span className="font-bold text-blue-600">{selectedRequest.programType}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Oferta de Beca:</span>
                  <span className="font-bold text-slate-900">{selectedRequest.scholarshipOffer}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Viáticos / Asignación:</span>
                  <span className="font-bold text-emerald-600">{selectedRequest.monthlyAllowance || 'No aplica'}</span>
                </div>
              </div>

              {/* Director's Letter */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                  Carta Oficial de la Dirección Deportiva:
                </label>
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-slate-700 leading-relaxed italic">
                  "{selectedRequest.proposalLetter}"
                </div>
              </div>

              {/* Clauses List */}
              <div>
                <label className="block font-bold text-slate-700 mb-2 uppercase tracking-wider text-[11px]">
                  Cláusulas y Beneficios Incluidos:
                </label>
                <div className="space-y-2">
                  {selectedRequest.clauses.map((clause, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{clause}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex items-center justify-between text-slate-500 pt-2 border-t border-slate-100">
                <span>Director Responsable: <strong className="text-slate-800">{selectedRequest.directorName}</strong></span>
                <span>Vence: <strong className="text-amber-700">{selectedRequest.expirationDate}</strong></span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsProposalModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100 transition-colors"
              >
                Cerrar
              </button>

              {(selectedRequest.status === 'pending' || selectedRequest.status === 'under_review') && (
                <>
                  <button
                    type="button"
                    onClick={() => handleDeclineRequest(selectedRequest)}
                    className="px-4 py-2.5 rounded-xl text-rose-700 bg-rose-50 font-bold text-xs hover:bg-rose-100 transition-colors border border-rose-200"
                  >
                    Rechazar Propuesta
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAcceptRequest(selectedRequest)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-md shadow-emerald-600/20"
                  >
                    Aceptar & Vincular al Roster
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DESVINCULAR & EMITIR CARTA DE LIBERTAD */}
      {/* ========================================================================= */}
      {isDesvincularModalOpen && programToDesvincular && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Desvincular & Emitir Carta de Libertad
                  </h3>
                  <p className="text-xs text-slate-500">{programToDesvincular.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDesvincularModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmDesvinculacion} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <span className="font-bold block">Efecto Legal de la Desvinculación:</span>
                <p className="text-[11px] leading-relaxed">
                  El estatus del programa pasará a <strong>"FINALIZADO / HISTÓRICO"</strong> y se generará automáticamente una <strong>Carta de Libertad oficial certificada</strong> con código QR y constancia de no adeudo deportivo.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fecha de Desvinculación</label>
                <input
                  type="text"
                  required
                  value={desvinculacionDate}
                  onChange={(e) => setDesvinculacionDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Motivo de Transición / Liberación</label>
                <textarea
                  rows={3}
                  required
                  value={desvinculacionReason}
                  onChange={(e) => setDesvinculacionReason(e.target.value)}
                  placeholder="Ej. Carta de Libertad otorgada por mutuo acuerdo tras cumplir ciclo formativo..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDesvincularModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 active:scale-[0.98] transition-all shadow-md"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Emitir Carta de Libertad</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: REGISTRAR / EDITAR PROGRAMA DEPORTIVO */}
      {/* ========================================================================= */}
      {isProgramModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingProgram ? 'Editar Programa' : 'Registrar Nuevo Programa'}
                  </h3>
                  <p className="text-xs text-slate-500">Historial y afiliación deportiva del prospecto.</p>
                </div>
              </div>
              <button
                onClick={() => setIsProgramModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-4 pt-1 text-xs">
              {/* Nombre de la Academia / Programa */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nombre del Programa o Academia <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Erik Hernandez Baseball Academy - Tetero"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Entrenador */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Entrenador / Coach</label>
                  <input
                    type="text"
                    value={coach}
                    onChange={(e) => setCoach(e.target.value)}
                    placeholder="Ej. Erik Hernandez"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Director */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Director General</label>
                  <input
                    type="text"
                    value={directorName}
                    onChange={(e) => setDirectorName(e.target.value)}
                    placeholder="Ej. Lic. Rafael Almonte"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Tipo de Programa */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Programa</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Residencia">Residencia</option>
                    <option value="Entrenamiento de Showcases, Cajas de Bateo">Entrenamiento de Showcases, Cajas de Bateo</option>
                    <option value="Pitcheo Especializado">Pitcheo Especializado</option>
                    <option value="Infield & Defensa Élite">Infield & Defensa Élite</option>
                    <option value="Preparación Física & Fuerza">Preparación Física & Fuerza</option>
                    <option value="Consultoría Temporal">Consultoría Temporal</option>
                  </select>
                </div>

                {/* Beca */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Beca / Cobertura</label>
                  <input
                    type="text"
                    value={scholarshipCoverage}
                    onChange={(e) => setScholarshipCoverage(e.target.value)}
                    placeholder="Ej. Beca 100% Residencial"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                    placeholder="Ej. 1/4/2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Fecha Fin */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha de Fin (opcional)</label>
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="Ej. 6/2/2026 (o vacío si es activo)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Estado */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estado</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'activo' | 'finalizado')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="activo">Activo / Vigente</option>
                    <option value="finalizado">Finalizado / Histórico</option>
                  </select>
                </div>

                {/* Ubicación */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ubicación / Ciudad</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej. San Pedro de Macorís, RD"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Motivo de transición if finalizado */}
              {status === 'finalizado' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Motivo de Transición / Desvinculación</label>
                  <input
                    type="text"
                    value={transitionReason}
                    onChange={(e) => setTransitionReason(e.target.value)}
                    placeholder="Ej. Carta de Libertad otorgada por mutuo acuerdo..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              )}

              {/* Notas */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notas / Anotaciones</label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Detalles sobre el progreso del prospecto..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProgramModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
                >
                  {editingProgram ? 'Guardar Cambios' : 'Registrar Programa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
