import React from 'react';
import {
  Activity,
  AlertCircle,
  Award,
  BadgeCheck,
  Bell,
  BookOpen,
  Brain,
  Building2,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  Flame,
  Gauge,
  Globe,
  GraduationCap,
  Info,
  Layers,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  RotateCcw,
  Search,
  Send,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trash2,
  Trophy,
  Upload,
  User,
  UserCheck,
  UserPlus,
  Users,
  Video,
  X,
  Zap,
  QrCode,
} from 'lucide-react';
import {
  CoachStaff,
  Player,
  PlayerAffiliation,
  PlayerInvitation,
  Position,
  SigningClass,
  UserRole,
  VerificationStatus,
} from '../types';
import {
  COACHES_STAFF,
  GLOBAL_PLAYERS_CATALOG,
  INITIAL_PLAYER_INVITATIONS,
} from '../data/mockData';
import { Player360Modal } from './Player360Modal';

interface RosterViewProps {
  players: Player[];
  onUpdatePlayers: (players: Player[]) => void;
  activeRole: UserRole;
  selectedPlayer: Player | null;
  setSelectedPlayer: (player: Player | null) => void;
  onNavigateTab: (tab: string) => void;
  coaches?: CoachStaff[];
}

export const RosterView: React.FC<RosterViewProps> = ({
  players,
  onUpdatePlayers,
  activeRole,
  selectedPlayer,
  setSelectedPlayer,
  onNavigateTab,
  coaches = COACHES_STAFF,
}) => {
  // Navigation Tabs: Roster vs Directory vs Invitations
  const [activeTab, setActiveTab] = React.useState<'roster' | 'directory' | 'invitations'>('roster');

  // Invitations State
  const [invitations, setInvitations] = React.useState<PlayerInvitation[]>(INITIAL_PLAYER_INVITATIONS);

  // Global Directory State (Catalog of available/external players)
  const [globalPlayers, setGlobalPlayers] = React.useState<Player[]>(GLOBAL_PLAYERS_CATALOG);

  // Search & Filter State - Roster
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedPosition, setSelectedPosition] = React.useState<string>('ALL');
  const [selectedClass, setSelectedClass] = React.useState<string>('ALL');
  const [selectedProgram, setSelectedProgram] = React.useState<string>('ALL');
  const [selectedVisibility, setSelectedVisibility] = React.useState<string>('ALL');
  const [sortBy, setSortBy] = React.useState<string>('glovallScore');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = React.useState<'table' | 'grid'>('table');

  // Search & Filter State - Global Directory
  const [dirSearchTerm, setDirSearchTerm] = React.useState('');
  const [dirPosition, setDirPosition] = React.useState<string>('ALL');
  const [dirClass, setDirClass] = React.useState<string>('ALL');
  const [dirAvailability, setDirAvailability] = React.useState<string>('ALL');
  const [dirViewMode, setDirViewMode] = React.useState<'table' | 'grid'>('table');

  // Filter State - Invitations
  const [invFilterStatus, setInvFilterStatus] = React.useState<string>('ALL');

  // Modals & Drawers
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);
  const [selectedPlayerToInvite, setSelectedPlayerToInvite] = React.useState<Player | null>(null);
  const [viewingGlobalPlayer, setViewingGlobalPlayer] = React.useState<Player | null>(null);
  const [simulatedEmailInvitation, setSimulatedEmailInvitation] = React.useState<PlayerInvitation | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Invitation Form State: Code-First Linking
  const [invitePlayerCode, setInvitePlayerCode] = React.useState('');
  const [codeLookupError, setCodeLookupError] = React.useState<string | null>(null);
  const [inviteProgramType, setInviteProgramType] = React.useState<PlayerInvitation['programType']>('matriz_principal');
  const [inviteMonthlyScholarship, setInviteMonthlyScholarship] = React.useState('600');
  const [inviteRoleOffered, setInviteRoleOffered] = React.useState('Prospecto Titular Programa Élite');
  const [inviteAssignedCoach, setInviteAssignedCoach] = React.useState(coaches[0]?.name || 'Carlos Rosario');
  const [inviteNotes, setInviteNotes] = React.useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Program Type Labels & Descriptions
  const PROGRAM_TYPES: Record<PlayerInvitation['programType'], { label: string; desc: string; color: string }> = {
    matriz_principal: {
      label: 'Programa Matriz de Desarrollo',
      desc: 'Formación integral 360°, representación internacional y preparación de firma MLB',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    especialidad_bateo: {
      label: 'Especialidad de Bateo & Exit Velo',
      desc: 'Módulo biomecánico intensivo con Carlos Rosario y análisis de swing TrackMan',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    especialidad_pitcheo: {
      label: 'Pitch Design & Biomecánica',
      desc: 'Optimización de spin rate, túnel de lanzamientos y programa Driveline',
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    },
    preparacion_fisica: {
      label: 'Acondicionamiento & Velocidad',
      desc: 'Potencia neuromuscular, reducción de 60 yardas y prevención de lesiones',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    consultoria_temporal: {
      label: 'Consultoría / Evaluación Temporal',
      desc: 'Campamento intensivo o showcase específico de evaluación diagnóstica',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  };

  // Helper to extract player's active academy affiliation type
  const getPlayerAffiliationType = (player: Player) => {
    const activeEntry = player.academyHistory?.find(
      (a) => a.status === 'active_primary' || a.status === 'active_specialty'
    );
    if (activeEntry?.status === 'active_specialty') {
      return {
        label: activeEntry.categoryOrRole || 'Especialidad Técnica',
        badge: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      };
    }
    return {
      label: 'Programa Matriz',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    };
  };

  // Toggle Scout Visibility function
  const handleToggleScoutVisibility = (playerId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updatedPlayers = players.map((p) => {
      if (p.id === playerId) {
        const nextStatus = p.scoutVisibilityStatus === 'public' ? 'restricted' : 'public';
        return {
          ...p,
          scoutVisibilityStatus: nextStatus as 'public' | 'restricted',
        };
      }
      return p;
    });
    onUpdatePlayers(updatedPlayers);
    if (selectedPlayer && selectedPlayer.id === playerId) {
      setSelectedPlayer({
        ...selectedPlayer,
        scoutVisibilityStatus: selectedPlayer.scoutVisibilityStatus === 'public' ? 'restricted' : 'public',
      });
    }
  };

  // Filter logic for Roster
  const filteredPlayers = players
    .filter((player) => {
      const matchSearch =
        player.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.hometown.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (player.assignedCoachName && player.assignedCoachName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchPosition =
        selectedPosition === 'ALL' ||
        player.position === selectedPosition ||
        player.secondaryPosition === selectedPosition;
      const matchClass = selectedClass === 'ALL' || player.signingClass === selectedClass;
      const matchVisibility =
        selectedVisibility === 'ALL' ||
        (selectedVisibility === 'public' && player.scoutVisibilityStatus === 'public') ||
        (selectedVisibility === 'restricted' && player.scoutVisibilityStatus !== 'public');

      const matchProgram =
        selectedProgram === 'ALL' ||
        (selectedProgram === 'primary' &&
          player.academyHistory?.some((a) => a.status === 'active_primary')) ||
        (selectedProgram === 'specialty' &&
          player.academyHistory?.some((a) => a.status === 'active_specialty'));

      return matchSearch && matchPosition && matchClass && matchVisibility && matchProgram;
    })
    .sort((a, b) => {
      let valA: number = 0;
      let valB: number = 0;

      if (sortBy === 'glovallScore') {
        valA = a.glovallScore;
        valB = b.glovallScore;
      } else if (sortBy === 'age') {
        valA = a.age;
        valB = b.age;
      } else if (sortBy === 'signingClass') {
        valA = Number(a.signingClass);
        valB = Number(b.signingClass);
      }

      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });

  // Filter logic for Global Directory (Basic Data View)
  const filteredGlobalPlayers = globalPlayers.filter((player) => {
    const matchSearch =
      player.fullName.toLowerCase().includes(dirSearchTerm.toLowerCase()) ||
      player.hometown.toLowerCase().includes(dirSearchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(dirSearchTerm.toLowerCase()) ||
      (player.glovallPassportId && player.glovallPassportId.toLowerCase().includes(dirSearchTerm.toLowerCase()));
    const matchPosition = dirPosition === 'ALL' || player.position === dirPosition;
    const matchClass = dirClass === 'ALL' || player.signingClass === dirClass;
    const matchAvailability =
      dirAvailability === 'ALL' || player.availabilityStatus === dirAvailability;

    return matchSearch && matchPosition && matchClass && matchAvailability;
  });

  // Filter logic for Invitations
  const filteredInvitations = invitations.filter((inv) => {
    if (invFilterStatus === 'ALL') return true;
    return inv.status === invFilterStatus;
  });

  const pendingInvitationsCount = invitations.filter((inv) => inv.status === 'pending').length;
  const verifiedTutorsCount = players.filter((p) => p.tutorDocumentVerified && p.tutorConsentVideoUploaded).length;

  // Find Athlete by Code Helper
  const lookupAthleteByCode = (rawCode: string): Player | undefined => {
    const clean = rawCode.trim().toLowerCase();
    if (!clean) return undefined;
    return globalPlayers.find(
      (p) =>
        (p.glovallPassportId && p.glovallPassportId.toLowerCase() === clean) ||
        p.id.toLowerCase() === clean ||
        p.fullName.toLowerCase() === clean
    );
  };

  // Open Invitation Modal (code-driven or direct candidate)
  const handleOpenInviteModal = (candidate?: Player) => {
    setCodeLookupError(null);
    if (candidate) {
      setSelectedPlayerToInvite(candidate);
      setInvitePlayerCode(candidate.glovallPassportId || candidate.id);
      setInviteRoleOffered(`Prospecto Titular (${candidate.position}) - Clase ${candidate.signingClass}`);
      setInviteNotes(`Invitación formal emitida por Caribe Baseball Academy.`);
    } else {
      setSelectedPlayerToInvite(null);
      setInvitePlayerCode('');
      setInviteRoleOffered('Prospecto Titular Programa Élite');
      setInviteNotes('Convenio deportivo institucional Caribe Baseball Academy.');
    }
    setIsInviteModalOpen(true);
  };

  // Code input change handler with instant resolution
  const handlePlayerCodeChange = (code: string) => {
    setInvitePlayerCode(code);
    setCodeLookupError(null);
    if (code.trim().length >= 3) {
      const match = lookupAthleteByCode(code);
      if (match) {
        setSelectedPlayerToInvite(match);
        setInviteRoleOffered(`Prospecto Titular (${match.position}) - Clase ${match.signingClass}`);
      } else {
        setSelectedPlayerToInvite(null);
      }
    } else {
      setSelectedPlayerToInvite(null);
    }
  };

  // Submit Invitation (Only requires athlete code / preloaded registration)
  const handleSubmitInvitation = (e: React.FormEvent) => {
    e.preventDefault();

    let targetPlayer = selectedPlayerToInvite;
    if (!targetPlayer) {
      targetPlayer = lookupAthleteByCode(invitePlayerCode);
    }

    if (!targetPlayer) {
      setCodeLookupError(
        'No se encontró ningún prospecto registrado con este código de Pasaporte Glovall. Verifica el código e intenta nuevamente.'
      );
      return;
    }

    // Check if already in active roster
    const isAlreadyInRoster = players.some(
      (p) => p.id === targetPlayer!.id || p.fullName.toLowerCase() === targetPlayer!.fullName.toLowerCase()
    );
    if (isAlreadyInRoster) {
      setCodeLookupError(`El prospecto ${targetPlayer.fullName} ya se encuentra vinculado activamente en el roster.`);
      return;
    }

    const progInfo = PROGRAM_TYPES[inviteProgramType];
    const tutorFullName =
      targetPlayer.familyAndEligibility?.father?.fullName ||
      targetPlayer.familyAndEligibility?.tutorConsentVideo?.tutorName ||
      `Tutor Legal de ${targetPlayer.fullName}`;
    const tutorEmail =
      targetPlayer.familyAndEligibility?.father?.fullName
        ? `${targetPlayer.fullName.toLowerCase().replace(/\s+/g, '')}.tutor@gmail.com`
        : 'tutor.atleta@gmail.com';
    const tutorPhone = targetPlayer.familyAndEligibility?.father?.phone || '+1 (829) 555-4421';

    const newInvitation: PlayerInvitation = {
      id: `pinv-${Date.now()}`,
      playerId: targetPlayer.id,
      playerName: targetPlayer.fullName,
      playerAvatar: targetPlayer.avatar,
      playerPosition: targetPlayer.position,
      signingClass: targetPlayer.signingClass,
      hometown: targetPlayer.hometown,
      tutorName: tutorFullName,
      tutorEmail: tutorEmail,
      tutorPhone: tutorPhone,
      academyId: 'acad-caribe-001',
      academyName: 'Caribe Baseball Academy',
      programType: inviteProgramType,
      programTypeName: progInfo.label,
      monthlyScholarship: Number(inviteMonthlyScholarship) || 0,
      roleOffered: inviteRoleOffered,
      status: 'pending',
      sentDate: new Date().toISOString().split('T')[0],
      notes: inviteNotes,
      token: `glv_tkn_ply_${Date.now()}`,
      glovallScore: targetPlayer.glovallScore || 90,
    };

    setInvitations([newInvitation, ...invitations]);
    setIsInviteModalOpen(false);
    triggerToast(`Solicitud de vinculación enviada al tutor legal de ${targetPlayer.fullName} (${targetPlayer.glovallPassportId}).`);
  };

  // Handle Tutor Acceptance (From Simulated Email Modal or Direct Action)
  const handleAcceptInvitation = (invitation: PlayerInvitation) => {
    // 1. Update Invitation Status
    const updatedInvitations = invitations.map((inv) => {
      if (inv.id === invitation.id) {
        return {
          ...inv,
          status: 'accepted' as const,
          respondedDate: new Date().toISOString().split('T')[0],
        };
      }
      return inv;
    });
    setInvitations(updatedInvitations);

    // 2. Add Player to Roster if not already in
    const existingInRoster = players.find((p) => p.id === invitation.playerId || p.fullName.toLowerCase() === invitation.playerName.toLowerCase());
    
    if (!existingInRoster) {
      const fromGlobal = globalPlayers.find((p) => p.id === invitation.playerId);
      const newPlayer: Player = fromGlobal
        ? {
            ...fromGlobal,
            assignedCoachName: inviteAssignedCoach || 'Carlos Rosario',
            academyHistory: [
              {
                id: `acad-caribe-${Date.now()}`,
                academyName: 'Caribe Baseball Academy',
                categoryOrRole: invitation.roleOffered || 'Programa Élite de Desarrollo',
                period: '2026 - Presente',
                headCoach: inviteAssignedCoach || 'Carlos Rosario',
                location: 'Boca Chica, Santo Domingo, RD',
                status: invitation.programType === 'matriz_principal' ? 'active_primary' : 'active_specialty',
                programType: invitation.programTypeName,
                highlights: 'Vinculación formal mediante consentimiento de tutor verificado.',
              },
              ...(fromGlobal.academyHistory || []),
            ],
          }
        : {
            id: invitation.playerId,
            fullName: invitation.playerName,
            avatar: invitation.playerAvatar,
            age: invitation.signingClass === '2026' ? 16 : 15,
            birthDate: '2010-03-15',
            position: (invitation.playerPosition as Position) || 'SS',
            signingClass: (invitation.signingClass as SigningClass) || '2026',
            height: "6'2\"",
            weight: 185,
            bats: 'R',
            throws: 'R',
            hometown: invitation.hometown,
            nationality: 'República Dominicana',
            assignedCoachId: 'coach-01',
            assignedCoachName: 'Carlos Rosario',
            glovallScore: invitation.glovallScore || 92,
            verificationStatus: 'verified',
            verificationSource: 'TrackMan Pro Glovall Stadium',
            verificationDate: new Date().toISOString().split('T')[0],
            scoutVisibilityStatus: 'public',
            tutorDocumentVerified: true,
            tutorConsentVideoUploaded: true,
            glovallPassportId: `GLV-PLY-${invitation.signingClass}-88`,
            metrics: {
              exitVelocityMph: 99.5,
              armVelocityMph: 92.0,
              sixtyYardDashSec: 6.45,
              timeToFirstBaseSec: 4.10,
              batSpeedMph: 76.0,
            },
            edTech: {
              baseballIqScore: 90,
              libraryProgress: 80,
              completedCoursesCount: 4,
              totalCoursesCount: 6,
              lastIqTestDate: new Date().toISOString().split('T')[0],
              iqTestHistory: [],
              enrolledCourses: ['c-01'],
            },
            scoutScale: {
              hit: 60,
              power: 60,
              run: 65,
              arm: 65,
              field: 60,
              iq: 65,
              overall: 60,
            },
            scoutingNotes: 'Atleta vinculado exitosamente a través de la Red Global Glovall.',
            strengths: ['Potencia física', 'Velocidad de bateo'],
            areasOfImprovement: ['Consistencia de contacto'],
            comparableMlbPlayer: 'Starling Marte / Wander Franco',
            videoClips: [],
            academyHistory: [
              {
                id: `acad-caribe-${Date.now()}`,
                academyName: 'Caribe Baseball Academy',
                categoryOrRole: invitation.roleOffered || 'Programa Élite de Desarrollo',
                period: '2026 - Presente',
                headCoach: 'Carlos Rosario',
                location: 'Boca Chica, Santo Domingo, RD',
                status: invitation.programType === 'matriz_principal' ? 'active_primary' : 'active_specialty',
                programType: invitation.programTypeName,
                highlights: 'Vinculación formal mediante consentimiento de tutor verificado.',
              },
            ],
          };

      onUpdatePlayers([newPlayer, ...players]);
    }

    if (simulatedEmailInvitation?.id === invitation.id) {
      setSimulatedEmailInvitation(null);
    }

    triggerToast(`¡Atleta ${invitation.playerName} vinculado oficialmente al Roster de Caribe Baseball Academy!`);
  };

  // Handle Tutor Decline
  const handleDeclineInvitation = (invitation: PlayerInvitation) => {
    const updated = invitations.map((inv) => {
      if (inv.id === invitation.id) {
        return {
          ...inv,
          status: 'declined' as const,
          respondedDate: new Date().toISOString().split('T')[0],
        };
      }
      return inv;
    });
    setInvitations(updated);
    if (simulatedEmailInvitation?.id === invitation.id) {
      setSimulatedEmailInvitation(null);
    }
    triggerToast(`Solicitud de ${invitation.playerName} marcada como rechazada por el tutor.`);
  };

  // Cancel invitation
  const handleCancelInvitation = (invitationId: string) => {
    const updated = invitations.filter((inv) => inv.id !== invitationId);
    setInvitations(updated);
    triggerToast('Solicitud eliminada.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 pb-12">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-70 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-800 animate-in slide-in-from-bottom-3">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* HEADER SECTION & TABS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-black text-[11px] tracking-wider uppercase border border-blue-200/60">
                Glovall Athlete Management
              </span>
              <span className="text-xs font-bold text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-500">Clases 2026 – 2029</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Roster & Gestión de Prospectos
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Gestiona los atletas vinculados a la academia, explora prospectos en el directorio global y formaliza convenios con tutores.
            </p>
          </div>

          {/* Action Buttons: Driven by Directory Linking */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setActiveTab('directory')}
              className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-2 border border-indigo-200/60 transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>Explorar Directorio Global</span>
            </button>

            <button
              onClick={() => handleOpenInviteModal()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>+ Vincular Prospecto</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'roster'
                ? 'bg-blue-50 text-blue-700 border border-blue-200/60 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 text-blue-600" />
            <span>Roster Caribe Baseball ({players.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'directory'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>Directorio Global de Prospectos ({globalPlayers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('invitations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'invitations'
                ? 'bg-amber-50 text-amber-800 border border-amber-200/60 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Mail className="w-4 h-4 text-amber-600" />
            <span>Bandeja de Solicitudes ({invitations.length})</span>
            {pendingInvitationsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-[10px]">
                {pendingInvitationsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ROSTER CARIBE BASEBALL (ATLETAS VINCULADOS) */}
      {/* ========================================================================= */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, posición, entrenador asignado o ciudad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* View Mode Toggle & Sort */}
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Tabla
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Tarjetas
                  </button>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <option value="glovallScore">Ordenar: Glovall Score</option>
                  <option value="signingClass">Ordenar: Clase de Firma</option>
                  <option value="age">Ordenar: Edad</option>
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  title="Cambiar orden ascendente/descendente"
                >
                  {sortOrder === 'desc' ? '↓ Mayor' : '↑ Menor'}
                </button>
              </div>
            </div>

            {/* Sub-Filters */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mr-1">Filtros:</span>

              {/* Position Filter */}
              <div className="flex items-center gap-1">
                {['ALL', 'OF', 'SS', 'RHP', 'LHP', 'C', '3B', '2B', '1B'].map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setSelectedPosition(pos)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      selectedPosition === pos
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {pos === 'ALL' ? 'Todas Pos' : pos}
                  </button>
                ))}
              </div>

              <div className="h-4 w-px bg-slate-200 mx-1" />

              {/* Class Filter */}
              <div className="flex items-center gap-1">
                {['ALL', '2026', '2027', '2028', '2029'].map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      selectedClass === cls
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cls === 'ALL' ? 'Todas Clases' : `Clase ${cls}`}
                  </button>
                ))}
              </div>

              <div className="h-4 w-px bg-slate-200 mx-1" />

              {/* Program Filter */}
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                <option value="ALL">Programa: Todos</option>
                <option value="primary">Matriz Principal</option>
                <option value="specialty">Especialidad / Centro Externo</option>
              </select>

              {/* Visibility Filter */}
              <select
                value={selectedVisibility}
                onChange={(e) => setSelectedVisibility(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                <option value="ALL">Visibilidad Scout: Todos</option>
                <option value="public">🟢 Solo Públicos para Scouts</option>
                <option value="restricted">🔒 Solo Confidenciales</option>
              </select>
            </div>
          </div>

          {/* TABLE VIEW (Operational & Athletic Management Data) */}
          {viewMode === 'table' ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Atleta</th>
                      <th className="py-3 px-3 font-extrabold uppercase text-[10px] tracking-wider">Posición & Físico</th>
                      <th className="py-3 px-3 font-extrabold uppercase text-[10px] tracking-wider">Clase</th>
                      <th className="py-3 px-3 font-extrabold uppercase text-[10px] tracking-wider">Programa / Vinculación</th>
                      <th className="py-3 px-3 font-extrabold uppercase text-[10px] tracking-wider">Entrenador Asignado</th>
                      <th className="py-3 px-3 font-extrabold uppercase text-[10px] tracking-wider">Tutor Legal</th>
                      <th className="py-3 px-3 font-extrabold uppercase text-[10px] tracking-wider">Visibilidad Scout</th>
                      <th className="py-3 px-3 font-extrabold uppercase text-[10px] tracking-wider">Glovall Score</th>
                      <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider text-right">Expediente</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPlayers.map((player) => {
                      const isVisible = player.scoutVisibilityStatus === 'public';
                      const affiliation = getPlayerAffiliationType(player);
                      const isTutorOk = player.tutorDocumentVerified && player.tutorConsentVideoUploaded;

                      return (
                        <tr key={player.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Player Info */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={player.avatar}
                                alt={player.fullName}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                                  <span>{player.fullName}</span>
                                  {player.verificationStatus === 'verified' && (
                                    <span title="Verificado TrackMan & Glovall Passport">
                                      <BadgeCheck className="w-4 h-4 text-blue-600 shrink-0" />
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                  <span>{player.hometown}</span>
                                  <span>•</span>
                                  <span className="font-mono text-slate-400">{player.glovallPassportId || `GLV-${player.id}`}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Position & Physical Profile */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-black text-xs">
                                {player.position}
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium">
                                B/T: <strong>{player.bats || 'R'}/{player.throws || 'R'}</strong>
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {player.height} • {player.weight} lbs • {player.age} años
                            </div>
                          </td>

                          {/* Signing Class */}
                          <td className="py-3 px-3 font-bold text-slate-700">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-100 text-[11px]">
                              Clase {player.signingClass}
                            </span>
                          </td>

                          {/* Program Type */}
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${affiliation.badge}`}>
                              {affiliation.label}
                            </span>
                          </td>

                          {/* Assigned Coach */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                              <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-bold text-xs">{player.assignedCoachName || 'Carlos Rosario'}</span>
                            </div>
                          </td>

                          {/* Tutor Legal Status */}
                          <td className="py-3 px-3">
                            {isTutorOk ? (
                              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Consentimiento en Regla</span>
                              </span>
                            ) : (
                              <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                <span>Doc. Pendiente</span>
                              </span>
                            )}
                          </td>

                          {/* Scout Visibility */}
                          <td className="py-3 px-3">
                            <button
                              onClick={(e) => handleToggleScoutVisibility(player.id, e)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                                isVisible
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              {isVisible ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                              <span>{isVisible ? 'Público' : 'Privado'}</span>
                            </button>
                          </td>

                          {/* Glovall Score */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1">
                              <span className="font-black text-sm text-blue-600">{player.glovallScore}</span>
                              <span className="text-[10px] text-slate-400 font-bold">pts</span>
                            </div>
                          </td>

                          {/* Actions: Full 360 view */}
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedPlayer(player)}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Vista 360°</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* GRID VIEW (Clean Cards) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlayers.map((player) => {
                const isVisible = player.scoutVisibilityStatus === 'public';
                const affiliation = getPlayerAffiliationType(player);
                const isTutorOk = player.tutorDocumentVerified && player.tutorConsentVideoUploaded;

                return (
                  <div
                    key={player.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={player.avatar}
                            alt={player.fullName}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-black text-slate-900 text-base">{player.fullName}</h3>
                              <BadgeCheck className="w-4 h-4 text-blue-600 shrink-0" />
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-100">
                                {player.position}
                              </span>
                              <span>Clase {player.signingClass}</span>
                              <span>•</span>
                              <span>{player.age} años</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xl font-black text-blue-600">{player.glovallScore}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Score</div>
                        </div>
                      </div>

                      {/* Operational Badges */}
                      <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Programa:</span>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${affiliation.badge}`}>
                            {affiliation.label}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Entrenador:</span>
                          <span className="font-bold text-slate-800">{player.assignedCoachName || 'Carlos Rosario'}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Tutor Legal:</span>
                          {isTutorOk ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Consentimiento Aprobado
                            </span>
                          ) : (
                            <span className="text-amber-700 font-bold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> En Revisión
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-slate-400 font-medium">Comparable MLB:</span>
                          <span className="font-bold text-indigo-900">{player.comparableMlbPlayer}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={(e) => handleToggleScoutVisibility(player.id, e)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isVisible
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{isVisible ? 'Scouts: Público' : 'Scouts: Privado'}</span>
                      </button>

                      <button
                        onClick={() => setSelectedPlayer(player)}
                        className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Vista 360°</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DIRECTORIO GLOBAL DE PROSPECTOS (DATOS BÁSICOS & PRIVACIDAD) */}
      {/* ========================================================================= */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          {/* Search & Filters for Directory */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar prospecto por nombre, país, posición o Pasaporte Glovall..."
                  value={dirSearchTerm}
                  onChange={(e) => setDirSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">
                  {filteredGlobalPlayers.length} prospectos disponibles
                </span>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setDirViewMode('table')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      dirViewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Tabla
                  </button>
                  <button
                    onClick={() => setDirViewMode('grid')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      dirViewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Tarjetas
                  </button>
                </div>
              </div>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-bold text-[11px] uppercase mr-1">Filtros:</span>

              {/* Position */}
              <div className="flex items-center gap-1">
                {['ALL', 'SS', 'OF', 'RHP', 'LHP', 'C', '3B', '2B', '1B'].map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setDirPosition(pos)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      dirPosition === pos
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {pos === 'ALL' ? 'Todas Pos' : pos}
                  </button>
                ))}
              </div>

              <div className="h-4 w-px bg-slate-200 mx-1" />

              {/* Class */}
              <div className="flex items-center gap-1">
                {['ALL', '2026', '2027', '2028', '2029'].map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setDirClass(cls)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      dirClass === cls
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cls === 'ALL' ? 'Todas Clases' : `Clase ${cls}`}
                  </button>
                ))}
              </div>

              <div className="h-4 w-px bg-slate-200 mx-1" />

              {/* Availability Filter */}
              <select
                value={dirAvailability}
                onChange={(e) => setDirAvailability(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                <option value="ALL">Disponibilidad: Todas</option>
                <option value="disponible_agente_libre">🟢 Agente Libre / Disponible</option>
                <option value="buscando_programa_bateo">⚡ Buscando Módulo de Bateo</option>
                <option value="buscando_pitch_design">🎯 Buscando Pitch Design</option>
              </select>
            </div>
          </div>

          {/* GLOBAL PLAYERS LISTING (TABLE AS PRIMARY FORMAT) */}
          {dirViewMode === 'table' ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/90 text-slate-600 border-b border-slate-200">
                      <th className="py-3.5 px-4 font-extrabold uppercase text-[10px] tracking-wider">Prospecto</th>
                      <th className="py-3.5 px-3 font-extrabold uppercase text-[10px] tracking-wider">Posición</th>
                      <th className="py-3.5 px-3 font-extrabold uppercase text-[10px] tracking-wider">Clase</th>
                      <th className="py-3.5 px-3 font-extrabold uppercase text-[10px] tracking-wider">Biotipo / Físico</th>
                      <th className="py-3.5 px-3 font-extrabold uppercase text-[10px] tracking-wider">Disponibilidad</th>
                      <th className="py-3.5 px-3 font-extrabold uppercase text-[10px] tracking-wider">Tutor Legal</th>
                      <th className="py-3.5 px-4 font-extrabold uppercase text-[10px] tracking-wider text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredGlobalPlayers.map((candidate) => {
                      const isAlreadyInRoster = players.some((p) => p.id === candidate.id || p.fullName.toLowerCase() === candidate.fullName.toLowerCase());
                      const pendingInv = invitations.find((inv) => inv.playerId === candidate.id && inv.status === 'pending');

                      return (
                        <tr key={candidate.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={candidate.avatar}
                                alt={candidate.fullName}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <div className="font-black text-slate-900 flex items-center gap-1.5 text-sm">
                                  <span>{candidate.fullName}</span>
                                  <BadgeCheck className="w-4 h-4 text-blue-600 shrink-0" />
                                </div>
                                <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                                  <span className="bg-slate-100 px-1.5 py-0.2 rounded text-[10px] font-semibold text-slate-600">
                                    {candidate.glovallPassportId || 'GLV-PASSPORT'}
                                  </span>
                                  <span>•</span>
                                  <span>{candidate.hometown}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-1">
                              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-xs">
                                {candidate.position}
                              </span>
                              {candidate.secondaryPosition && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500 font-bold">
                                  {candidate.secondaryPosition}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-3 font-bold text-slate-800">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                              Clase {candidate.signingClass}
                            </span>
                          </td>

                          <td className="py-3.5 px-3 text-slate-700">
                            <div className="font-semibold text-slate-800">
                              {candidate.age} años • B/T: {candidate.bats || 'R'}/{candidate.throws || 'R'}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {candidate.height} • {candidate.weight} lbs
                            </div>
                          </td>

                          <td className="py-3.5 px-3">
                            {candidate.availabilityStatus === 'disponible_agente_libre' && (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Agente Libre
                              </span>
                            )}
                            {candidate.availabilityStatus === 'buscando_pitch_design' && (
                              <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-[11px] font-bold inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                Busca Pitch Design
                              </span>
                            )}
                            {candidate.availabilityStatus === 'buscando_programa_bateo' && (
                              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Busca Bateo
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-3 text-slate-700">
                            <div className="font-semibold text-slate-800">
                              {candidate.familyAndEligibility?.father?.fullName || 'Tutor Verificado'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {candidate.familyAndEligibility?.father?.phone || '+1 (829) 555-4421'}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setViewingGlobalPlayer(candidate)}
                                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                                title="Ver ficha deportiva básica"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Ficha</span>
                              </button>

                              {isAlreadyInRoster ? (
                                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold inline-flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Vinculado</span>
                                </span>
                              ) : pendingInv ? (
                                <button
                                  onClick={() => {
                                    setActiveTab('invitations');
                                    setSimulatedEmailInvitation(pendingInv);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <Mail className="w-3.5 h-3.5 text-amber-600" />
                                  <span>En Proceso</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleOpenInviteModal(candidate)}
                                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Vincular</span>
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
          ) : (
            /* DIRECTORY GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGlobalPlayers.map((candidate) => {
                const isAlreadyInRoster = players.some((p) => p.id === candidate.id || p.fullName.toLowerCase() === candidate.fullName.toLowerCase());
                const pendingInv = invitations.find((inv) => inv.playerId === candidate.id && inv.status === 'pending');

                return (
                  <div
                    key={candidate.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={candidate.avatar}
                            alt={candidate.fullName}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-black text-slate-900 text-base">{candidate.fullName}</h3>
                              <BadgeCheck className="w-4 h-4 text-blue-600 shrink-0" />
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                                {candidate.position}
                              </span>
                              <span>Clase {candidate.signingClass}</span>
                              <span>•</span>
                              <span>{candidate.hometown}</span>
                            </div>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold">
                          {candidate.glovallPassportId || 'GLV-PASSPORT'}
                        </span>
                      </div>

                      {/* Basic Physical & Bio Info */}
                      <div className="mt-3.5 bg-slate-50 p-3 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 font-bold text-[10px] uppercase block">Perfil Físico</span>
                          <span className="font-bold text-slate-800 mt-0.5 block">
                            {candidate.height} • {candidate.weight} lbs
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 font-bold text-[10px] uppercase block">Batea / Tira</span>
                          <span className="font-bold text-slate-800 mt-0.5 block">
                            {candidate.bats || 'R'} / {candidate.throws || 'R'}
                          </span>
                        </div>
                      </div>

                      {/* Status / Tutor Details */}
                      <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Estatus:</span>
                          {candidate.availabilityStatus === 'disponible_agente_libre' && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                              🟢 Agente Libre
                            </span>
                          )}
                          {candidate.availabilityStatus === 'buscando_pitch_design' && (
                            <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] font-bold">
                              🎯 Busca Pitch Design
                            </span>
                          )}
                          {candidate.availabilityStatus === 'buscando_programa_bateo' && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                              ⚡ Busca Bateo
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Tutor Legal:</span>
                          <span className="font-bold text-slate-800 truncate">
                            {candidate.familyAndEligibility?.father?.fullName || 'Tutor Verificado'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => setViewingGlobalPlayer(candidate)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                        title="Ver ficha básica"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ficha</span>
                      </button>

                      {isAlreadyInRoster ? (
                        <div className="flex-1 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>En Roster Activo</span>
                        </div>
                      ) : pendingInv ? (
                        <button
                          onClick={() => {
                            setActiveTab('invitations');
                            setSimulatedEmailInvitation(pendingInv);
                          }}
                          className="flex-1 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5 text-amber-600" />
                          <span>Solicitud Pendiente</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenInviteModal(candidate)}
                          className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>+ Vincular Atleta</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BANDEJA DE SOLICITUDES & CONVENIOS CON TUTORES */}
      {/* ========================================================================= */}
      {activeTab === 'invitations' && (
        <div className="space-y-6">
          {/* Header Strip */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Historial de Solicitudes a Jugadores & Tutores Legales
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Supervisa el estado de vinculación, convenios formativos y simula el correo que reciben los tutores.
              </p>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-2">
              {['ALL', 'pending', 'accepted', 'declined'].map((st) => (
                <button
                  key={st}
                  onClick={() => setInvFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    invFilterStatus === st
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'ALL' && 'Todas'}
                  {st === 'pending' && 'Pendientes'}
                  {st === 'accepted' && 'Aceptadas'}
                  {st === 'declined' && 'Rechazadas'}
                </button>
              ))}
            </div>
          </div>

          {/* INVITATIONS LIST */}
          <div className="space-y-3.5">
            {filteredInvitations.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
                <Mail className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-black text-slate-800">No hay solicitudes en esta categoría</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Utiliza el botón de enviar solicitud o explora el directorio global para invitar a nuevos atletas y sus tutores.
                </p>
                <button
                  onClick={() => setActiveTab('directory')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-2 cursor-pointer"
                >
                  <Globe className="w-4 h-4" />
                  <span>Explorar Directorio Global</span>
                </button>
              </div>
            ) : (
              filteredInvitations.map((inv) => {
                const prog = PROGRAM_TYPES[inv.programType] || PROGRAM_TYPES.matriz_principal;

                return (
                  <div
                    key={inv.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    {/* Left: Player & Tutor Details */}
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={inv.playerAvatar}
                        alt={inv.playerName}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-slate-900 text-base">{inv.playerName}</h4>
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-extrabold border border-blue-100">
                            {inv.playerPosition} • Clase {inv.signingClass}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                          <span>Tutor: <strong className="text-slate-800">{inv.tutorName}</strong></span>
                          <span>•</span>
                          <span className="text-slate-500">{inv.tutorEmail}</span>
                          {inv.tutorPhone && (
                            <>
                              <span>•</span>
                              <span className="text-slate-500">{inv.tutorPhone}</span>
                            </>
                          )}
                        </div>

                        {/* Program Badge */}
                        <div className="pt-1 flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${prog.color}`}>
                            {inv.programTypeName}
                          </span>
                          {inv.monthlyScholarship ? (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Beca: ${inv.monthlyScholarship} USD/mes
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* Right: Status & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:border-l lg:border-slate-100 lg:pl-6">
                      {/* Status Tag */}
                      <div className="text-left sm:text-right">
                        {inv.status === 'pending' && (
                          <div>
                            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold inline-flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Pendiente de Aceptación</span>
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1">Enviada: {inv.sentDate}</div>
                          </div>
                        )}
                        {inv.status === 'accepted' && (
                          <div>
                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold inline-flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Vinculación Aceptada</span>
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1">Aceptada: {inv.respondedDate || inv.sentDate}</div>
                          </div>
                        )}
                        {inv.status === 'declined' && (
                          <div>
                            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold inline-flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Rechazada por Tutor</span>
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1">Respuesta: {inv.respondedDate}</div>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {/* Simulate Tutor Email Modal Button */}
                        <button
                          onClick={() => setSimulatedEmailInvitation(inv)}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                          title="Ver simulación del correo recibido por el tutor"
                        >
                          <Mail className="w-3.5 h-3.5 text-amber-400" />
                          <span>Simular Correo</span>
                        </button>

                        {inv.status === 'pending' && (
                          <button
                            onClick={() => handleCancelInvitation(inv.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                            title="Cancelar solicitud"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: 360° PLAYER DOSSIER MODAL */}
      {/* ========================================================================= */}
      {selectedPlayer && (
        <Player360Modal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onUpdatePlayer={(updated) => {
            setSelectedPlayer(updated);
            const updatedPlayers = players.map((p) => (p.id === updated.id ? updated : p));
            onUpdatePlayers(updatedPlayers);
          }}
          onNavigateTab={onNavigateTab}
          activeRole={activeRole}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: SEND NEW INVITATION (VINCULACIÓN POR CÓDIGO GLOVALL) */}
      {/* ========================================================================= */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl p-6 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Send className="w-5 h-5 text-indigo-600" />
                  Vincular Prospecto por Código
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ingresa el código del Pasaporte Glovall del atleta para vincularlo con sus datos previamente registrados.
                </p>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitInvitation} className="space-y-4">
              {/* Code Input Section */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-indigo-600" />
                    <span>Código de Pasaporte Glovall</span>
                  </label>
                  <span className="text-[10px] font-semibold text-slate-400">
                    ej. GLV-DOM-2026-01 o Nombre
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    value={invitePlayerCode}
                    onChange={(e) => handlePlayerCodeChange(e.target.value)}
                    placeholder="Escribe el código del jugador (ej. GLV-DOM-2026-01)..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-mono font-black text-indigo-950 placeholder:font-sans placeholder:font-normal focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
                    autoFocus
                  />
                  {selectedPlayerToInvite && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Atleta Encontrado</span>
                    </div>
                  )}
                </div>

                {/* Quick select pills from catalog if not entered yet */}
                {!selectedPlayerToInvite && (
                  <div className="pt-1">
                    <div className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center justify-between">
                      <span>Prospectos sugeridos del directorio:</span>
                      <span className="text-[10px] text-indigo-600 font-semibold">Clic para autocompletar</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                      {globalPlayers.slice(0, 6).map((gp) => (
                        <button
                          key={gp.id}
                          type="button"
                          onClick={() => {
                            handlePlayerCodeChange(gp.glovallPassportId || gp.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 text-[11px] font-semibold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className="font-bold">{gp.fullName}</span>
                          <span className="font-mono text-[10px] text-slate-400">({gp.glovallPassportId || gp.position})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {codeLookupError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{codeLookupError}</span>
                  </div>
                )}
              </div>

              {/* Resolved Athlete Live Preview (Data pre-registered by the player & tutor) */}
              {selectedPlayerToInvite ? (
                <div className="bg-gradient-to-br from-indigo-50/70 via-blue-50/40 to-slate-50 p-4 rounded-2xl border border-indigo-100/80 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-indigo-100/60 pb-2.5">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                      <BadgeCheck className="w-4 h-4 text-blue-600" />
                      <span>Ficha Pre-Registrada por el Atleta</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Datos Verificados
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={selectedPlayerToInvite.avatar}
                      alt={selectedPlayerToInvite.fullName}
                      className="w-12 h-12 rounded-2xl object-cover border border-indigo-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-slate-900 text-sm flex items-center gap-1.5 truncate">
                        <span>{selectedPlayerToInvite.fullName}</span>
                        <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 text-[10px] font-extrabold">
                          {selectedPlayerToInvite.position}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 text-[10px] font-extrabold">
                          Clase {selectedPlayerToInvite.signingClass}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-2">
                        <span>{selectedPlayerToInvite.hometown}</span>
                        <span>•</span>
                        <span>{selectedPlayerToInvite.age} años ({selectedPlayerToInvite.height}, {selectedPlayerToInvite.weight} lbs)</span>
                      </div>
                    </div>
                  </div>

                  {/* Registered Tutor Info (Preloaded) */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-indigo-100/60 text-xs">
                    <div className="bg-white/80 p-2.5 rounded-xl border border-indigo-100/60">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Tutor Legal Pre-Cargado</span>
                      <span className="font-extrabold text-slate-800 mt-0.5 block truncate">
                        {selectedPlayerToInvite.familyAndEligibility?.father?.fullName ||
                          selectedPlayerToInvite.familyAndEligibility?.tutorConsentVideo?.tutorName ||
                          'Tutor Verificado Glovall'}
                      </span>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-xl border border-indigo-100/60">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Notificación de Convenio</span>
                      <span className="font-semibold text-slate-700 mt-0.5 block truncate">
                        {selectedPlayerToInvite.familyAndEligibility?.father?.fullName
                          ? `${selectedPlayerToInvite.fullName.toLowerCase().replace(/\s+/g, '')}.tutor@gmail.com`
                          : 'tutor.atleta@gmail.com'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Academy Offer & Program Terms */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                  Condiciones de la Vinculación
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Programa Destino</label>
                  <select
                    value={inviteProgramType}
                    onChange={(e) => setInviteProgramType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-indigo-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="matriz_principal">Programa Matriz de Desarrollo & Representación Principal</option>
                    <option value="especialidad_bateo">Especialidad de Bateo & Exit Velocity (Carlos Rosario)</option>
                    <option value="especialidad_pitcheo">Centro de Biomecánica & Pitch Design TrackMan (Nelson Peña)</option>
                    <option value="preparacion_fisica">Acondicionamiento Físico & Velocidad 60 Yds</option>
                    <option value="consultoria_temporal">Consultoría Técnica / Showcase Temporal</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Entrenador Responsable</label>
                    <select
                      value={inviteAssignedCoach}
                      onChange={(e) => setInviteAssignedCoach(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800"
                    >
                      {coaches.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.roleTitle})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Beca Mensual (USD)</label>
                    <input
                      type="number"
                      step="50"
                      value={inviteMonthlyScholarship}
                      onChange={(e) => setInviteMonthlyScholarship(e.target.value)}
                      placeholder="600"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-emerald-700"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!invitePlayerCode.trim()}
                  className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-2 cursor-pointer transition-all ${
                    invitePlayerCode.trim()
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-slate-400 cursor-not-allowed opacity-70'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Emitir Solicitud de Vinculación</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: SIMULADOR INTERACTIVO DE CORREO AL TUTOR */}
      {/* ========================================================================= */}
      {simulatedEmailInvitation && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Email Client Bar */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-300 ml-2">
                  Simulador de Notificación Oficial Glovall
                </span>
              </div>
              <button
                onClick={() => setSimulatedEmailInvitation(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Headers */}
            <div className="bg-slate-50 p-6 border-b border-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-400 w-16">De:</span>
                <span className="font-bold text-slate-900">
                  Caribe Baseball Academy &lt;notificaciones@glovall.com&gt;
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-400 w-16">Para:</span>
                <span className="font-bold text-slate-900">
                  {simulatedEmailInvitation.tutorName} &lt;{simulatedEmailInvitation.tutorEmail}&gt;
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-400 w-16">Asunto:</span>
                <span className="font-extrabold text-indigo-900">
                  Invitación Oficial de Vinculación Deportiva: {simulatedEmailInvitation.playerName} (Clase {simulatedEmailInvitation.signingClass})
                </span>
              </div>
            </div>

            {/* Email Body */}
            <div className="p-6 space-y-5 text-xs text-slate-700 leading-relaxed max-h-[55vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center text-base">
                    CBA
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">Caribe Baseball Academy</h4>
                    <p className="text-[11px] text-slate-400">Boca Chica, Santo Domingo, República Dominicana</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Glovall Verified Hub
                </span>
              </div>

              <p>
                Estimado(a) <strong>{simulatedEmailInvitation.tutorName}</strong>,
              </p>

              <p>
                Por medio de la presente, la dirección técnica y deportiva de <strong>Caribe Baseball Academy</strong> le
                extiende una cordial y formal invitación para que su representado, el prospecto{' '}
                <strong>{simulatedEmailInvitation.playerName}</strong> ({simulatedEmailInvitation.playerPosition} - Clase{' '}
                {simulatedEmailInvitation.signingClass}), se incorpore oficialmente a nuestro programa de alto rendimiento.
              </p>

              {/* Offer Summary Card */}
              <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 space-y-2.5">
                <div className="font-extrabold text-indigo-950 text-xs">Detalles del Convenio Formativo:</div>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    • Programa: <strong>{simulatedEmailInvitation.programTypeName}</strong>
                  </div>
                  <div>
                    • Rol: <strong>{simulatedEmailInvitation.roleOffered}</strong>
                  </div>
                  <div>
                    • Beca / Estipendio: <strong>${simulatedEmailInvitation.monthlyScholarship || 600} USD / mes</strong>
                  </div>
                  <div>
                    • Cobertura: <strong>Hospedaje, Nutrición & Gimnasio</strong>
                  </div>
                </div>
                {simulatedEmailInvitation.notes && (
                  <div className="pt-1 text-[11px] text-indigo-800 italic">
                    Notas adicionales: "{simulatedEmailInvitation.notes}"
                  </div>
                )}
              </div>

              <p>
                Al aceptar esta vinculación a través de la plataforma Glovall, el atleta mantendrá su pasaporte digital
                actualizado, con registro auditado de métricas TrackMan, combine físico y acceso directo a los scouts de las 30
                organizaciones de Grandes Ligas.
              </p>

              {/* Status or Interactive Action */}
              {simulatedEmailInvitation.status === 'pending' ? (
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => handleAcceptInvitation(simulatedEmailInvitation)}
                    className="w-full sm:flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Aceptar Vinculación e Integrar al Roster</span>
                  </button>
                  <button
                    onClick={() => handleDeclineInvitation(simulatedEmailInvitation)}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-all cursor-pointer"
                  >
                    Rechazar
                  </button>
                </div>
              ) : simulatedEmailInvitation.status === 'accepted' ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Esta vinculación ya fue aceptada formalmente el {simulatedEmailInvitation.respondedDate || simulatedEmailInvitation.sentDate}.</span>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 font-bold text-center flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Esta solicitud fue rechazada por el tutor el {simulatedEmailInvitation.respondedDate}.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: QUICK VIEW BASIC GLOBAL PLAYER DETAILS */}
      {/* ========================================================================= */}
      {viewingGlobalPlayer && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg p-6 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={viewingGlobalPlayer.avatar}
                  alt={viewingGlobalPlayer.fullName}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                    <span>{viewingGlobalPlayer.fullName}</span>
                    <BadgeCheck className="w-4 h-4 text-blue-600" />
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {viewingGlobalPlayer.glovallPassportId} • {viewingGlobalPlayer.position} (Clase {viewingGlobalPlayer.signingClass})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingGlobalPlayer(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Basic Physical Profile */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 font-bold text-[10px] uppercase block">Perfil & Biometría</span>
                <span className="font-extrabold text-slate-900 mt-1 block">
                  {viewingGlobalPlayer.height} • {viewingGlobalPlayer.weight} lbs ({viewingGlobalPlayer.age} años)
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold text-[10px] uppercase block">Batea & Tira</span>
                <span className="font-extrabold text-slate-900 mt-1 block">
                  Batea {viewingGlobalPlayer.bats || 'R'} / Tira {viewingGlobalPlayer.throws || 'R'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold text-[10px] uppercase block">Nacionalidad</span>
                <span className="font-extrabold text-slate-900 mt-1 block">
                  {viewingGlobalPlayer.hometown}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold text-[10px] uppercase block">Tutor Legal</span>
                <span className="font-extrabold text-slate-900 mt-1 block">
                  {viewingGlobalPlayer.familyAndEligibility?.father?.fullName || 'Tutor Verificado'}
                </span>
              </div>
            </div>

            {/* Privacy notice for unlinked candidate */}
            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Las métricas biomecánicas completas (TrackMan, velocidad de salida, combine 60 yds y videoanálisis) se
                desbloquearán una vez que el tutor legal acepte la solicitud de vinculación de tu academia.
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setViewingGlobalPlayer(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  const target = viewingGlobalPlayer;
                  setViewingGlobalPlayer(null);
                  handleOpenInviteModal(target);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>+ Enviar Solicitud de Vinculación</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
