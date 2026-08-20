import React from 'react';
import {
  Award,
  BadgeCheck,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Edit3,
  ExternalLink,
  Eye,
  FileCheck,
  Filter,
  Globe,
  GraduationCap,
  Info,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
  Zap
} from 'lucide-react';
import { CoachAffiliation, CoachInvitation, CoachStaff, Player } from '../types';
import {
  ALL_TECHNICAL_SPECIALTIES_AND_RESOURCES,
  GLOBAL_GLOVALL_COACHES,
  INITIAL_COACH_INVITATIONS
} from '../data/mockData';

interface CoachesManagementViewProps {
  coaches: CoachStaff[];
  onUpdateCoaches: (coaches: CoachStaff[]) => void;
  players: Player[];
}

export const CoachesManagementView: React.FC<CoachesManagementViewProps> = ({
  coaches,
  onUpdateCoaches,
  players,
}) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = React.useState<'staff' | 'directory' | 'invitations'>('staff');

  // Invitations State
  const [invitations, setInvitations] = React.useState<CoachInvitation[]>(INITIAL_COACH_INVITATIONS);

  // Global Coaches Directory State
  const [globalCoaches, setGlobalCoaches] = React.useState<CoachStaff[]>(GLOBAL_GLOVALL_COACHES);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = React.useState('');
  const [specialtyFilter, setSpecialtyFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'active' | 'pending'>('all');
  const [contractTypeFilter, setContractTypeFilter] = React.useState('all');

  // Directory Filters
  const [dirSearchQuery, setDirSearchQuery] = React.useState('');
  const [dirSpecialtyFilter, setDirSpecialtyFilter] = React.useState('all');
  const [dirAvailabilityFilter, setDirAvailabilityFilter] = React.useState('all');

  // Modals state
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);
  const [selectedCoachToInvite, setSelectedCoachToInvite] = React.useState<CoachStaff | null>(null);
  const [viewingCoach, setViewingCoach] = React.useState<CoachStaff | null>(null);
  const [editingCoach, setEditingCoach] = React.useState<CoachStaff | null>(null);
  const [deletingCoach, setDeletingCoach] = React.useState<CoachStaff | null>(null);
  const [simulatedEmailInvitation, setSimulatedEmailInvitation] = React.useState<CoachInvitation | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Invitation Form State
  const [inviteCoachName, setInviteCoachName] = React.useState('');
  const [inviteCoachEmail, setInviteCoachEmail] = React.useState('');
  const [inviteRoleTitle, setInviteRoleTitle] = React.useState('Instructor de Bateo & Potencia');
  const [inviteContractType, setInviteContractType] = React.useState<'Tiempo Completo' | 'Medio Tiempo' | 'Consultor Externo'>('Tiempo Completo');
  const [inviteCategory, setInviteCategory] = React.useState('Clase 2026 / Infielders');
  const [inviteMessage, setInviteMessage] = React.useState('');

  // Show temporary toast notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Open invite modal for a specific coach from the directory
  const handleOpenInviteModalForCoach = (coach: CoachStaff) => {
    setSelectedCoachToInvite(coach);
    setInviteCoachName(coach.name);
    setInviteCoachEmail(coach.email);
    setInviteRoleTitle(coach.roleTitle || 'Instructor de Bateo & Potencia');
    setInviteContractType('Tiempo Completo');
    setInviteCategory('Clase 2026 / Infielders');
    setInviteMessage(`Hola ${coach.name}, en Caribe Baseball Academy nos gustaría que te unas a nuestro staff técnico oficial.`);
    setIsInviteModalOpen(true);
  };

  // Open invite modal for a new coach by email
  const handleOpenNewInviteModal = () => {
    setSelectedCoachToInvite(null);
    setInviteCoachName('');
    setInviteCoachEmail('');
    setInviteRoleTitle('Instructor de Bateo & Potencia');
    setInviteContractType('Tiempo Completo');
    setInviteCategory('Clase 2026 / Infielders');
    setInviteMessage('Nos complace invitarte a formar parte del cuerpo técnico de Caribe Baseball Academy.');
    setIsInviteModalOpen(true);
  };

  // Submit invitation
  const handleSendInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCoachName.trim() || !inviteCoachEmail.trim()) return;

    const coachId = selectedCoachToInvite ? selectedCoachToInvite.id : `coach-${Date.now()}`;
    const avatar = selectedCoachToInvite
      ? selectedCoachToInvite.avatar
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

    const newInvitation: CoachInvitation = {
      id: `inv-${Date.now()}`,
      coachId,
      coachName: inviteCoachName,
      coachEmail: inviteCoachEmail,
      coachAvatar: avatar,
      academyId: 'acad-caribe-001',
      academyName: 'Caribe Baseball Academy',
      roleProposed: inviteRoleTitle,
      contractType: inviteContractType,
      assignedCategories: [inviteCategory],
      sentDate: 'Hoy (19 de Agosto, 2026)',
      message: inviteMessage,
      status: 'pending',
      notificationEmailSent: true,
    };

    // Add invitation
    setInvitations([newInvitation, ...invitations]);

    // Also add to academy coaches list as pending
    const existingIndex = coaches.findIndex((c) => c.id === coachId || c.email === inviteCoachEmail);
    if (existingIndex >= 0) {
      const updated = [...coaches];
      updated[existingIndex] = {
        ...updated[existingIndex],
        status: 'pending_approval',
        linkStatus: 'pending_approval',
        roleTitle: inviteRoleTitle,
        contractType: inviteContractType,
        assignedCategory: inviteCategory,
      };
      onUpdateCoaches(updated);
    } else {
      const newPendingCoach: CoachStaff = {
        id: coachId,
        name: inviteCoachName,
        roleTitle: inviteRoleTitle,
        specialty: selectedCoachToInvite?.specialty || 'Bateo & Potencia',
        specialties: selectedCoachToInvite?.specialties || ['Bateo & Potencia', 'Desarrollo de Prospectos'],
        email: inviteCoachEmail,
        phone: selectedCoachToInvite?.phone || '+1 (809) 555-0000',
        avatar,
        yearsExperience: selectedCoachToInvite?.yearsExperience || 8,
        status: 'pending_approval',
        linkStatus: 'pending_approval',
        contractType: inviteContractType,
        assignedCategory: inviteCategory,
        assignedPlayersCount: 0,
        assignedPlayerCount: 0,
        bio: selectedCoachToInvite?.bio || 'Entrenador profesional en proceso de vinculación oficial.',
        certifications: selectedCoachToInvite?.certifications || ['Certificación Glovall Coach'],
        rating: selectedCoachToInvite?.rating || 4.9,
        verifiedGlovall: true,
        currentAffiliations: selectedCoachToInvite?.currentAffiliations || [],
      };
      onUpdateCoaches([...coaches, newPendingCoach]);
    }

    setIsInviteModalOpen(false);
    triggerToast(` Solicitud y correo de notificación enviados con éxito a ${inviteCoachName}`);
    // Open simulated email preview so the user can see what the coach receives
    setSimulatedEmailInvitation(newInvitation);
  };

  // Coach accepts invitation (simulated via email or action button)
  const handleAcceptInvitation = (invitation: CoachInvitation) => {
    // 1. Update invitation status
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === invitation.id ? { ...inv, status: 'accepted' } : inv))
    );

    // 2. Update coach status in academy roster to active
    const existingIndex = coaches.findIndex((c) => c.id === invitation.coachId || c.email === invitation.coachEmail);
    if (existingIndex >= 0) {
      const updated = [...coaches];
      const coach = updated[existingIndex];
      const newAffiliations: CoachAffiliation[] = [
        ...(coach.currentAffiliations || []).filter((a) => a.academyId !== 'acad-caribe-001'),
        {
          academyId: 'acad-caribe-001',
          academyName: 'Caribe Baseball Academy',
          roleTitle: invitation.roleProposed,
          status: 'active',
          contractType: invitation.contractType,
          startDate: '2026 - Presente',
          isPrimary: invitation.contractType === 'Tiempo Completo',
        },
      ];

      updated[existingIndex] = {
        ...coach,
        status: 'active',
        linkStatus: 'active',
        roleTitle: invitation.roleProposed,
        contractType: invitation.contractType,
        assignedCategory: invitation.assignedCategories[0] || 'Roster General',
        assignedPlayersCount: coach.assignedPlayersCount || 6,
        currentAffiliations: newAffiliations,
      };
      onUpdateCoaches(updated);
    }

    setSimulatedEmailInvitation(null);
    triggerToast(`🎉 ¡${invitation.coachName} aceptó la solicitud y ahora está ACTIVO en Caribe Baseball Academy!`);
  };

  // Reject / Revoke invitation
  const handleRevokeInvitation = (invitationId: string, coachId: string) => {
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === invitationId ? { ...inv, status: 'revoked' } : inv))
    );
    onUpdateCoaches(coaches.filter((c) => c.id !== coachId || c.status === 'active'));
    triggerToast('Solicitud de vinculación revocada.');
  };

  // Terminate contract / unbind coach
  const handleTerminateCoachLink = () => {
    if (!deletingCoach) return;
    onUpdateCoaches(coaches.filter((c) => c.id !== deletingCoach.id));
    setDeletingCoach(null);
    triggerToast(`El entrenador ${deletingCoach.name} ha sido desvinculado de la academia. Su perfil global Glovall permanece intacto.`);
  };

  // Filtered coaches for Academy Staff Table
  const filteredStaffCoaches = coaches.filter((coach) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      coach.name.toLowerCase().includes(query) ||
      coach.roleTitle.toLowerCase().includes(query) ||
      coach.email.toLowerCase().includes(query) ||
      (coach.specialties && coach.specialties.some((s) => s.toLowerCase().includes(query)));

    const matchesSpecialty =
      specialtyFilter === 'all' ||
      (coach.specialties && coach.specialties.includes(specialtyFilter)) ||
      coach.specialty === specialtyFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && (coach.status === 'active' || !coach.status)) ||
      (statusFilter === 'pending' && coach.status === 'pending_approval');

    const matchesContract =
      contractTypeFilter === 'all' || (coach.contractType || 'Tiempo Completo') === contractTypeFilter;

    return matchesSearch && matchesSpecialty && matchesStatus && matchesContract;
  });

  // Filtered coaches for Global Directory
  const filteredDirectoryCoaches = globalCoaches.filter((coach) => {
    const query = dirSearchQuery.toLowerCase();
    const matchesSearch =
      coach.name.toLowerCase().includes(query) ||
      coach.roleTitle.toLowerCase().includes(query) ||
      (coach.hometown && coach.hometown.toLowerCase().includes(query)) ||
      (coach.specialties && coach.specialties.some((s) => s.toLowerCase().includes(query))) ||
      (coach.certifications && coach.certifications.some((c) => c.toLowerCase().includes(query)));

    const matchesSpecialty =
      dirSpecialtyFilter === 'all' ||
      (coach.specialties && coach.specialties.includes(dirSpecialtyFilter)) ||
      coach.specialty === dirSpecialtyFilter;

    const matchesAvailability =
      dirAvailabilityFilter === 'all' || coach.availabilityStatus === dirAvailabilityFilter;

    return matchesSearch && matchesSpecialty && matchesAvailability;
  });

  const activeCount = coaches.filter((c) => (c.status || 'active') === 'active').length;
  const pendingCount = coaches.filter((c) => c.status === 'pending_approval').length;
  const totalAssignedAthletes = coaches.reduce(
    (acc, curr) => acc + (curr.assignedPlayersCount || curr.assignedPlayerCount || 0),
    0
  );

  return (
    <div id="coaches-management-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-top-4">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-xs font-bold text-slate-100">{toastMessage}</p>
        </div>
      )}

      {/* 1. Clean Minimal Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Gestión de Entrenadores
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Cuerpo técnico de la academia y red global Glovall
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('directory')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Directorio Global</span>
          </button>
          <button
            onClick={handleOpenNewInviteModal}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>+ Vincular Entrenador</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl px-2 py-1 shadow-xs">
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black transition-all border-b-2 cursor-pointer ${
            activeTab === 'staff'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Staff de la Academia</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700">
            {activeCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black transition-all border-b-2 cursor-pointer ${
            activeTab === 'directory'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Directorio Global</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700">
            {globalCoaches.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('invitations')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black transition-all border-b-2 cursor-pointer ${
            activeTab === 'invitations'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Solicitudes</span>
          {invitations.filter((i) => i.status === 'pending').length > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
              {invitations.filter((i) => i.status === 'pending').length}
            </span>
          )}
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: CUERPO TÉCNICO DE LA ACADEMIA (VINCULADOS) */}
      {/* ======================================================== */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          {/* Minimal Clean KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">Total Staff</p>
                <p className="text-xl font-black text-slate-900">{coaches.length}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">Activos</p>
                <p className="text-xl font-black text-emerald-700">{activeCount}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">Pendientes</p>
                <p className="text-xl font-black text-amber-700">{pendingCount}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">Atletas Asignados</p>
                <p className="text-xl font-black text-purple-700">{totalAssignedAthletes}</p>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, especialidad o correo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold shrink-0">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Filtros:</span>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los Estados</option>
                <option value="active">Activos</option>
                <option value="pending">Pendientes de Aprobación</option>
              </select>

              <select
                value={contractTypeFilter}
                onChange={(e) => setContractTypeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las Modalidades</option>
                <option value="Tiempo Completo">Tiempo Completo</option>
                <option value="Medio Tiempo">Medio Tiempo</option>
                <option value="Consultor Externo">Consultor Externo</option>
              </select>
            </div>
          </div>

          {/* Coaches Table */}
          <div className="bg-white rounded-3xl shadow-xs border border-slate-100 overflow-hidden">
            <table className="w-full table-fixed text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-4 w-[24%]">Entrenador (Perfil Glovall)</th>
                  <th className="py-4 px-3 w-[20%]">Rol & Modalidad</th>
                  <th className="py-4 px-3 w-[20%]">Academias Vinculadas</th>
                  <th className="py-4 px-3 w-[18%]">Especialidades Técnicas</th>
                  <th className="py-4 px-2 w-[8%] text-center">Estado</th>
                  <th className="py-4 px-3 w-[10%] text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredStaffCoaches.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                      No se encontraron entrenadores con los criterios de búsqueda.
                    </td>
                  </tr>
                ) : (
                  filteredStaffCoaches.map((coach) => {
                    const specs = coach.specialties && coach.specialties.length > 0 ? coach.specialties : [coach.specialty || 'General'];
                    const isActive = (coach.status || 'active') === 'active';
                    const isPending = coach.status === 'pending_approval';
                    const affiliations = coach.currentAffiliations || [];

                    return (
                      <tr key={coach.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Entrenador / Perfil */}
                        <td className="py-3.5 px-4 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <img
                                src={coach.avatar}
                                alt={coach.name}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs"
                              />
                              {coach.verifiedGlovall && (
                                <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 ring-2 ring-white">
                                  <BadgeCheck className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="font-black text-slate-900 text-xs truncate">{coach.name}</p>
                              </div>
                              <p className="text-[11px] text-slate-500 truncate">{coach.email}</p>
                              {coach.hometown && (
                                <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-2.5 h-2.5" /> {coach.hometown}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Rol & Modalidad */}
                        <td className="py-3.5 px-3 align-middle">
                          <div className="min-w-0 pr-2">
                            <p className="font-bold text-slate-800 text-xs leading-snug">
                              {coach.roleTitle}
                            </p>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold mt-1">
                              <Briefcase className="w-2.5 h-2.5 text-slate-400" />
                              {coach.contractType || 'Tiempo Completo'}
                            </span>
                          </div>
                        </td>

                        {/* Academias Vinculadas (Multi-tenant representation) */}
                        <td className="py-3.5 px-3 align-middle">
                          <div className="space-y-1">
                            {affiliations.length === 0 ? (
                              <span className="text-[11px] text-slate-400 italic">Sin otras academias</span>
                            ) : (
                              affiliations.map((aff, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-[11px]">
                                  <Building2 className={`w-3 h-3 shrink-0 ${aff.academyId === 'acad-caribe-001' ? 'text-blue-600' : 'text-slate-400'}`} />
                                  <span className={`truncate font-medium ${aff.academyId === 'acad-caribe-001' ? 'font-bold text-blue-900' : 'text-slate-600'}`}>
                                    {aff.academyName}
                                  </span>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 shrink-0">
                                    {aff.contractType === 'Consultor Externo' ? 'Consultor' : 'Planta'}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </td>

                        {/* Especialidades */}
                        <td className="py-3.5 px-3 align-middle">
                          <div className="flex flex-wrap gap-1 items-center">
                            {specs.slice(0, 2).map((spec, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100"
                              >
                                {spec}
                              </span>
                            ))}
                            {specs.length > 2 && (
                              <span className="text-[10px] font-bold text-slate-400">
                                +{specs.length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Estado */}
                        <td className="py-3.5 px-2 text-center align-middle">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Activo
                            </span>
                          ) : isPending ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                              <Clock className="w-2.5 h-2.5 text-amber-600" />
                              Por Confirmar
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-600">
                              Inactivo
                            </span>
                          )}
                        </td>

                        {/* Acciones */}
                        <td className="py-3.5 px-3 text-center align-middle">
                          <div className="flex items-center justify-center gap-1">
                            {isPending ? (
                              <button
                                onClick={() => {
                                  const matchingInv = invitations.find((i) => i.coachId === coach.id || i.coachEmail === coach.email);
                                  if (matchingInv) {
                                    setSimulatedEmailInvitation(matchingInv);
                                  } else {
                                    // Generate invitation preview on the fly
                                    setSimulatedEmailInvitation({
                                      id: `inv-${Date.now()}`,
                                      coachId: coach.id,
                                      coachName: coach.name,
                                      coachEmail: coach.email,
                                      coachAvatar: coach.avatar,
                                      academyId: 'acad-caribe-001',
                                      academyName: 'Caribe Baseball Academy',
                                      roleProposed: coach.roleTitle,
                                      contractType: coach.contractType || 'Tiempo Completo',
                                      assignedCategories: [coach.assignedCategory || 'Roster General'],
                                      sentDate: 'Hoy',
                                      status: 'pending',
                                      notificationEmailSent: true,
                                    });
                                  }
                                }}
                                title="Ver Correo de Notificación & Simular Aprobación"
                                className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                              >
                                <Mail className="w-3 h-3" />
                                <span>Aprobar Correo</span>
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => setViewingCoach(coach)}
                                  title="Ver Ficha Técnica 360°"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeletingCoach(coach)}
                                  title="Desvincular de la Academia"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
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
      )}

      {/* ======================================================== */}
      {/* TAB 2: DIRECTORIO GLOBAL GLOVALL (EXPLORAR ENTRENADORES) */}
      {/* ======================================================== */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          {/* Directory Search & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, especialidad o ciudad..."
                value={dirSearchQuery}
                onChange={(e) => setDirSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={dirSpecialtyFilter}
                onChange={(e) => setDirSpecialtyFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las Especialidades</option>
                <option value="Bateo & Potencia">Bateo & Potencia</option>
                <option value="Pitcheo & Biomecánica">Pitcheo & Biomecánica</option>
                <option value="Preparación Física & Velocidad">Preparación Física & Velocidad</option>
                <option value="Receptoría & Defensa">Receptoría & Defensa</option>
              </select>

              <select
                value={dirAvailabilityFilter}
                onChange={(e) => setDirAvailabilityFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toda Disponibilidad</option>
                <option value="disponible_inmediato">Disponible Inmediato</option>
                <option value="parcial_consultoria">Consultoría Parcial</option>
                <option value="exclusivo">Exclusivo</option>
              </select>

              <button
                onClick={handleOpenNewInviteModal}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Invitar por Correo</span>
              </button>
            </div>
          </div>

          {/* Directory Coaches Table (Clean, 100% full-width, readable layout) */}
          <div className="bg-white rounded-3xl shadow-xs border border-slate-100 overflow-hidden">
            <table className="w-full table-fixed text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-4 w-[26%]">Entrenador / Perfil Global</th>
                  <th className="py-4 px-3 w-[22%]">Especialidad & Experiencia</th>
                  <th className="py-4 px-3 w-[18%]">Certificaciones Oficiales</th>
                  <th className="py-4 px-3 w-[20%]">Academias & Trayectoria</th>
                  <th className="py-4 px-3 w-[14%] text-center">Acción de Vinculación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredDirectoryCoaches.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                      No se encontraron entrenadores en el directorio global con los criterios seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredDirectoryCoaches.map((coach) => {
                    const isAlreadyInAcademy = coaches.some(
                      (c) => c.id === coach.id && (c.status === 'active' || !c.status)
                    );
                    const isPendingInvitation = invitations.some(
                      (i) => i.coachId === coach.id && i.status === 'pending'
                    );
                    const specs =
                      coach.specialties && coach.specialties.length > 0
                        ? coach.specialties
                        : [coach.specialty || 'General'];
                    const affiliations = coach.currentAffiliations || [];

                    return (
                      <tr key={coach.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Entrenador / Perfil Global */}
                        <td className="py-3.5 px-4 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <img
                                src={coach.avatar}
                                alt={coach.name}
                                className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-2xs"
                              />
                              {coach.verifiedGlovall && (
                                <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 ring-2 ring-white">
                                  <BadgeCheck className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="font-black text-slate-900 text-xs truncate">{coach.name}</p>
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-800 text-[10px] font-black border border-amber-200 shrink-0">
                                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                  {coach.rating || '4.9'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 truncate">{coach.email}</p>
                              {coach.hometown && (
                                <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-2.5 h-2.5" /> {coach.hometown}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Especialidad & Experiencia */}
                        <td className="py-3.5 px-3 align-middle">
                          <div className="min-w-0 space-y-1">
                            <p className="font-bold text-slate-800 text-xs leading-snug">
                              {coach.roleTitle}
                            </p>
                            <div className="flex flex-wrap gap-1 items-center">
                              {specs.slice(0, 2).map((spec, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100"
                                >
                                  {spec}
                                </span>
                              ))}
                              {specs.length > 2 && (
                                <span className="text-[10px] font-bold text-slate-400">
                                  +{specs.length - 2}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 block">
                              {coach.yearsExperience ? `${coach.yearsExperience} años de experiencia` : 'Entrenador Certificado'}
                            </span>
                          </div>
                        </td>

                        {/* Certificaciones Oficiales */}
                        <td className="py-3.5 px-3 align-middle">
                          <div className="flex flex-wrap gap-1 items-center">
                            {(coach.certifications || []).map((cert, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200"
                              >
                                <ShieldCheck className="w-2.5 h-2.5 text-blue-600 shrink-0" />
                                <span className="truncate max-w-[130px]">{cert}</span>
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Academias & Trayectoria */}
                        <td className="py-3.5 px-3 align-middle">
                          <div className="space-y-1">
                            <div className="text-[11px] font-semibold text-slate-700">
                              {affiliations.length > 0 ? (
                                <div className="flex items-center gap-1.5 truncate">
                                  <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{affiliations[0].academyName}</span>
                                </div>
                              ) : (
                                <span className="text-emerald-700 font-bold flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  Disponible para Vinculación
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-2">
                              <span><strong>{coach.athletesTrainedCount || 25}+</strong> Atletas</span>
                              <span>•</span>
                              <span className="text-emerald-700 font-bold">{coach.mlbSigningsCount || 6} Firmas MLB</span>
                            </div>
                          </div>
                        </td>

                        {/* Acción de Vinculación */}
                        <td className="py-3.5 px-3 text-center align-middle">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setViewingCoach(coach)}
                              title="Ver Ficha 360°"
                              className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {isAlreadyInAcademy ? (
                              <span className="px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-black flex items-center gap-1 shrink-0">
                                <Check className="w-3 h-3" />
                                <span>En Staff</span>
                              </span>
                            ) : isPendingInvitation ? (
                              <button
                                onClick={() => {
                                  const matching = invitations.find((i) => i.coachId === coach.id);
                                  if (matching) setSimulatedEmailInvitation(matching);
                                }}
                                title="Ver Invitación Enviada"
                                className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-black flex items-center gap-1 shrink-0 transition-all cursor-pointer"
                              >
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>Por Confirmar</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenInviteModalForCoach(coach)}
                                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0"
                              >
                                <Send className="w-3 h-3" />
                                <span>Vincular</span>
                              </button>
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
      )}

      {/* ======================================================== */}
      {/* TAB 3: BANDEJA DE SOLICITUDES & SIMULADOR DE CORREO */}
      {/* ======================================================== */}
      {activeTab === 'invitations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Solicitudes de Vinculación
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Estado y confirmación de invitaciones enviadas
                </p>
              </div>
              <button
                onClick={handleOpenNewInviteModal}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>+ Nueva Solicitud</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {invitations.length === 0 ? (
                <p className="text-center py-8 text-xs text-slate-400">No hay solicitudes registradas.</p>
              ) : (
                invitations.map((inv) => {
                  const isPending = inv.status === 'pending';
                  const isAccepted = inv.status === 'accepted';

                  return (
                    <div
                      key={inv.id}
                      className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={inv.coachAvatar}
                          alt={inv.coachName}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-2xs"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black text-slate-900">{inv.coachName}</h4>
                            <span className="text-[10px] text-slate-400">• {inv.coachEmail}</span>
                          </div>
                          <p className="text-xs text-blue-700 font-bold mt-0.5">
                            {inv.roleProposed} • <span className="text-slate-500 font-normal">{inv.contractType}</span>
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Enviada: {inv.sentDate} • Notificación por correo: <span className="text-emerald-600 font-bold">Entregada </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {isPending && (
                          <>
                            <button
                              onClick={() => setSimulatedEmailInvitation(inv)}
                              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all"
                            >
                              <Mail className="w-3.5 h-3.5 text-amber-600" />
                              <span>Simular Correo del Coach</span>
                            </button>
                            <button
                              onClick={() => handleRevokeInvitation(inv.id, inv.coachId)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 text-xs font-bold transition-all cursor-pointer"
                            >
                              Revocar
                            </button>
                          </>
                        )}

                        {isAccepted && (
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Aceptada & Activa en Staff</span>
                          </span>
                        )}

                        {inv.status === 'revoked' && (
                          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold">
                            Revocada
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: ENVIAR SOLICITUD DE VINCULACIÓN A ENTRENADOR */}
      {/* ======================================================== */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl p-6 space-y-5 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Enviar Solicitud de Vinculación
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    El entrenador recibirá un correo con los términos para aprobar su ingreso al staff
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvitation} className="space-y-4">
              {/* Coach Selection */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Nombre del Entrenador *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Héctor Gómez"
                  value={inviteCoachName}
                  onChange={(e) => setInviteCoachName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Correo Electrónico (Para envío de Notificación y Aprobación) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="entrenador@glovallpro.com"
                    value={inviteCoachEmail}
                    onChange={(e) => setInviteCoachEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Rol Propuesto en la Academia *
                  </label>
                  <select
                    value={inviteRoleTitle}
                    onChange={(e) => setInviteRoleTitle(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Instructor de Bateo & Potencia">Instructor de Bateo & Potencia</option>
                    <option value="Coordinador de Pitcheo & Biomecánica">Coordinador de Pitcheo & Biomecánica</option>
                    <option value="Preparador Físico & S&C">Preparador Físico & S&C</option>
                    <option value="Instructor de Receptoría & Cuadro">Instructor de Receptoría & Cuadro</option>
                    <option value="Consultor de Swings & Exit Velo">Consultor de Swings & Exit Velo</option>
                    <option value="Director Científico de Biomecánica">Director Científico de Biomecánica</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Modalidad de Contratación *
                  </label>
                  <select
                    value={inviteContractType}
                    onChange={(e) => setInviteContractType(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Tiempo Completo">Tiempo Completo</option>
                    <option value="Medio Tiempo">Medio Tiempo</option>
                    <option value="Consultor Externo">Consultor Externo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Categoría / Grupo de Atletas a Supervisar
                </label>
                <input
                  type="text"
                  placeholder="Ej. Clase 2026 / Infielders de Poder"
                  value={inviteCategory}
                  onChange={(e) => setInviteCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Mensaje Personal de Bienvenida / Propuesta
                </label>
                <textarea
                  rows={3}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder="Escribe unas palabras para el entrenador..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Una vez enviada, el entrenador recibirá un correo con el membrete de <strong>Caribe Baseball Academy</strong> y un botón seguro para confirmar su vinculación.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Invitación & Notificar por Correo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: SIMULADOR DE CORREO ELECTRÓNICO DEL ENTRENADOR */}
      {/* ======================================================== */}
      {simulatedEmailInvitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl p-0 overflow-hidden my-8 animate-in fade-in zoom-in-95">
            {/* Email Client Header Bar */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block">
                    Bandeja de Entrada del Entrenador (Simulación)
                  </span>
                  <h4 className="text-xs font-black text-white">
                    Para: {simulatedEmailInvitation.coachName} ({simulatedEmailInvitation.coachEmail})
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setSimulatedEmailInvitation(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Email Body Content */}
            <div className="p-6 space-y-5 bg-slate-50">
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                {/* Academy Brand Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center text-xl">
                      ⚾
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Caribe Baseball Academy
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Plataforma Oficial Glovall SportsTech
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase">
                    Solicitud de Staff
                  </span>
                </div>

                {/* Email Greeting */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    ¡Hola {simulatedEmailInvitation.coachName}!
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Caribe Baseball Academy</strong> te ha enviado una solicitud formal para integrarte a su cuerpo técnico institucional a través de la red Glovall.
                  </p>
                </div>

                {/* Terms Box */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Rol Asignado:</span>
                    <span className="font-black text-slate-900">{simulatedEmailInvitation.roleProposed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Modalidad:</span>
                    <span className="font-bold text-blue-700">{simulatedEmailInvitation.contractType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Categorías / Atletas:</span>
                    <span className="font-bold text-slate-800">
                      {simulatedEmailInvitation.assignedCategories.join(', ') || 'Roster General'}
                    </span>
                  </div>
                  {simulatedEmailInvitation.message && (
                    <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 italic">
                      "{simulatedEmailInvitation.message}"
                    </div>
                  )}
                </div>

                {/* Simulated Email Call-To-Actions */}
                <div className="pt-3 space-y-2.5">
                  <button
                    onClick={() => handleAcceptInvitation(simulatedEmailInvitation)}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✅ Aceptar Vinculación a Caribe Baseball Academy</span>
                  </button>

                  <button
                    onClick={() => {
                      handleRevokeInvitation(simulatedEmailInvitation.id, simulatedEmailInvitation.coachId);
                      setSimulatedEmailInvitation(null);
                    }}
                    className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer"
                  >
                    Rechazar Solicitud
                  </button>
                </div>

                <p className="text-[10px] text-center text-slate-400">
                  Al aceptar, tu perfil de entrenador se vinculará de forma segura sin afectar tus afiliaciones previas ni tus certificaciones globales.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: FICHA TÉCNICA 360° DEL ENTRENADOR */}
      {/* ======================================================== */}
      {viewingCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl p-6 space-y-5 my-8 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={viewingCoach.avatar}
                  alt={viewingCoach.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-600 shadow-md shadow-blue-600/20"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">{viewingCoach.name}</h3>
                    <BadgeCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs font-bold text-blue-600">{viewingCoach.roleTitle}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {viewingCoach.hometown || 'República Dominicana'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingCoach(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Coach Details */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                  Biografía & Trayectoria
                </span>
                <p className="text-slate-700 leading-relaxed">{viewingCoach.bio}</p>
              </div>

              {/* Multi-academy affiliations */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                  Academias Vinculadas en la Red Glovall
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(viewingCoach.currentAffiliations || []).map((aff, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{aff.academyName}</p>
                          <p className="text-[10px] text-slate-400">{aff.roleTitle}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                        {aff.contractType}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications & Specialties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    Certificaciones
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(viewingCoach.certifications || []).map((c, i) => (
                      <span key={i} className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-[10px] font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    Especialidades Técnicas
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(viewingCoach.specialties || []).map((s, i) => (
                      <span key={i} className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingCoach(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: CONFIRM DESVINCULAR ENTRENADOR */}
      {/* ======================================================== */}
      {deletingCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                ¿Desvincular a {deletingCoach.name}?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                El entrenador dejará de tener acceso a los atletas y métricas de <strong>Caribe Baseball Academy</strong>. Su perfil global Glovall, historial de evaluaciones y certificaciones no se eliminarán.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeletingCoach(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleTerminateCoachLink}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                Confirmar Desvinculación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
