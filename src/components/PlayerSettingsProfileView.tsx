import React from 'react';
import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  Crown,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  FileCheck,
  FileText,
  Fingerprint,
  Globe,
  Instagram,
  Key,
  Layers,
  Linkedin,
  Lock,
  LogIn,
  Mail,
  MapPin,
  Medal,
  Phone,
  Plus,
  Radio,
  RefreshCw,
  Save,
  Search,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
  Trophy,
  Upload,
  User,
  UserCheck,
  Users,
  Video,
  X,
  Youtube,
  Zap
} from 'lucide-react';
import { AcademyProfile, Player, Position, SigningClass, UserRole } from '../types';

interface PlayerSettingsProfileViewProps {
  player: Player;
  academy: AcademyProfile;
  activeRole: UserRole;
  onUpdatePlayer: (updated: Player) => void;
  onOpenRbacModal: () => void;
  onNavigateTab?: (tab: string) => void;
}

interface PlayerAccessLog {
  id: string;
  user: string;
  role: string;
  method: 'OTP Correo' | 'Google SSO' | 'Contraseña + 2FA';
  ip: string;
  location: string;
  timestamp: string;
  status: 'Exitoso' | 'Bloqueado por Dominio' | '2FA Verificado';
}

const INITIAL_PLAYER_ACCESS_LOGS: PlayerAccessLog[] = [
  {
    id: 'plog-1',
    user: 'y.mendoza@caribebaseball.do',
    role: 'Jugador / Prospecto',
    method: 'OTP Correo',
    ip: '190.166.45.88',
    location: 'Santo Domingo, DO',
    timestamp: 'Hace 8 min',
    status: 'Exitoso',
  },
  {
    id: 'plog-2',
    user: 'tutor.mendoza@gmail.com',
    role: 'Tutor Legal (Padre/Madre)',
    method: 'Google SSO',
    ip: '179.52.120.14',
    location: 'Santiago, DO',
    timestamp: 'Ayer, 20:15',
    status: 'Exitoso',
  },
  {
    id: 'plog-3',
    user: 'scout.evaluator@mlb.com',
    role: 'Scout MLB Verificado',
    method: 'Google SSO',
    ip: '108.28.194.5',
    location: 'Miami, FL (USA)',
    timestamp: 'Hace 2 días',
    status: 'Exitoso',
  },
];

export const PlayerSettingsProfileView: React.FC<PlayerSettingsProfileViewProps> = ({
  player,
  academy,
  activeRole,
  onUpdatePlayer,
  onOpenRbacModal,
  onNavigateTab,
}) => {
  // Main Tab Navigation matching the settings structure
  const [activeTabSection, setActiveTabSection] = React.useState<
    'profile' | 'tutor' | 'visibility' | 'access'
  >('profile');

  // 1. Personal & Athletic Info State
  const [fullName, setFullName] = React.useState(player.fullName);
  const [position, setPosition] = React.useState<Position>(player.position);
  const [secondaryPosition, setSecondaryPosition] = React.useState<string>(player.secondaryPosition || 'SS');
  const [birthDate, setBirthDate] = React.useState(player.birthDate || '2008-04-14');
  
  // Birth & Residence (Requested replacement for signing class, age, linked academy, and hometown)
  const [birthCountry, setBirthCountry] = React.useState(
    player.birthCountry || player.familyAndEligibility?.birthCountry || 'República Dominicana'
  );
  const [birthCity, setBirthCity] = React.useState(
    player.birthCity || player.familyAndEligibility?.birthCity || (player.hometown ? player.hometown.split(',')[0].trim() : 'San Pedro de Macorís')
  );
  const [residenceCountry, setResidenceCountry] = React.useState(
    player.residenceCountry || player.familyAndEligibility?.currentResidenceCountry || 'República Dominicana'
  );
  const [residenceCity, setResidenceCity] = React.useState(
    player.residenceCity || player.familyAndEligibility?.currentResidenceCity || 'Santo Domingo Este'
  );

  const [height, setHeight] = React.useState(player.height);
  const [weight, setWeight] = React.useState(player.weight);
  const [bats, setBats] = React.useState(player.bats);
  const [throws, setThrows] = React.useState(player.throws);
  const [email, setEmail] = React.useState(player.email || 'y.mendoza@caribebaseball.do');
  const [phone, setPhone] = React.useState(player.phone || '+1 (809) 555-0182');

  // Digital Presence (Instagram, TikTok, YouTube, Twitter)
  const [instagram, setInstagram] = React.useState(player.socialMedia?.instagram || '@yander_mendoza08');
  const [tiktok, setTiktok] = React.useState(player.socialMedia?.tiktok || '@yander.mendoza.bb');
  const [youtube, setYoutube] = React.useState(player.socialMedia?.youtube || 'https://youtube.com/@yandermendozabaseball');
  const [twitter, setTwitter] = React.useState(player.socialMedia?.twitter || '@yandermendoza_');

  // 2. Tutor & Parents (Padre, Madre, Tutor Legal) State
  const initialFamily = player.familyAndEligibility;
  
  // Father State
  const [fatherName, setFatherName] = React.useState(initialFamily?.father?.fullName || 'Carlos Mendoza Sr.');
  const [fatherBirthCountry, setFatherBirthCountry] = React.useState(initialFamily?.father?.nationality || 'República Dominicana');
  const [fatherBirthPlace, setFatherBirthPlace] = React.useState(initialFamily?.father?.birthPlace || 'San Pedro de Macorís, República Dominicana');
  const [fatherIdNumber, setFatherIdNumber] = React.useState(initialFamily?.father?.idDocumentNumber || '001-1829481-2');
  const [fatherPhone, setFatherPhone] = React.useState(initialFamily?.father?.phone || '+1 (809) 555-8890');
  const [fatherOccupation, setFatherOccupation] = React.useState(initialFamily?.father?.occupation || 'Comerciante Independiente');
  const [fatherHasPassport, setFatherHasPassport] = React.useState(initialFamily?.father?.hasPassport ?? true);
  const [fatherPassportCountry, setFatherPassportCountry] = React.useState(initialFamily?.father?.passportCountry || 'República Dominicana');

  // Mother State
  const [motherName, setMotherName] = React.useState(initialFamily?.mother?.fullName || 'Elena Castillo de Mendoza');
  const [motherBirthCountry, setMotherBirthCountry] = React.useState(initialFamily?.mother?.nationality || 'República Dominicana');
  const [motherBirthPlace, setMotherBirthPlace] = React.useState(initialFamily?.mother?.birthPlace || 'Santo Domingo, República Dominicana');
  const [motherIdNumber, setMotherIdNumber] = React.useState(initialFamily?.mother?.idDocumentNumber || '001-0987123-4');
  const [motherPhone, setMotherPhone] = React.useState(initialFamily?.mother?.phone || '+1 (809) 555-8891');
  const [motherOccupation, setMotherOccupation] = React.useState(initialFamily?.mother?.occupation || 'Docente de Educación Básica');
  const [motherHasPassport, setMotherHasPassport] = React.useState(initialFamily?.mother?.hasPassport ?? true);
  const [motherPassportCountry, setMotherPassportCountry] = React.useState(initialFamily?.mother?.passportCountry || 'República Dominicana');

  // Tutor Legal State
  const [tutorName, setTutorName] = React.useState('Carlos Mendoza Sr.');
  const [tutorRelationship, setTutorRelationship] = React.useState('Padre');
  const [tutorBirthCountry, setTutorBirthCountry] = React.useState('República Dominicana');
  const [tutorIdNumber, setTutorIdNumber] = React.useState('001-1829481-2');
  const [tutorPhone, setTutorPhone] = React.useState('+1 (809) 555-8890');
  const [tutorEmail, setTutorEmail] = React.useState('carlos.mendoza.tutor@gmail.com');
  const [tutorDocumentVerified, setTutorDocumentVerified] = React.useState(player.tutorDocumentVerified ?? true);
  const [tutorConsentVideoUploaded, setTutorConsentVideoUploaded] = React.useState(player.tutorConsentVideoUploaded ?? true);
  const [tutorDocumentFileName, setTutorDocumentFileName] = React.useState<string>('Cedula_Tutor_CarlosMendoza.pdf');

  // 3. Visibility & Prospect Directory State (Configured for academy linkage)
  const [availableInProspectDirectory, setAvailableInProspectDirectory] = React.useState<boolean>(
    player.availableInProspectDirectory ?? (player.scoutVisibilityStatus === 'public')
  );
  const [allowDirectAcademyInvitations, setAllowDirectAcademyInvitations] = React.useState(true);
  const [showMetricsInDirectory, setShowMetricsInDirectory] = React.useState(true);
  const [showVideosInDirectory, setShowVideosInDirectory] = React.useState(true);
  const [notifyTutorOnInvitation, setNotifyTutorOnInvitation] = React.useState(true);

  // 4. Access & Auth (Platform Access Configuration)
  const [accessMethodTab, setAccessMethodTab] = React.useState<'credentials' | 'otp' | 'sso' | 'policies'>('credentials');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = React.useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = React.useState('60');
  const [requirePinForSensitiveChanges, setRequirePinForSensitiveChanges] = React.useState(true);

  const [otpEmail, setOtpEmail] = React.useState(player.email || 'y.mendoza@caribebaseball.do');
  const [otpStep, setOtpStep] = React.useState<'input' | 'sent' | 'verified'>('input');
  const [generatedCode, setGeneratedCode] = React.useState('619284');
  const [enteredCode, setEnteredCode] = React.useState('');
  const [isSendingCode, setIsSendingCode] = React.useState(false);
  const [otpError, setOtpError] = React.useState<string | null>(null);

  // SSO Simulation
  const [ssoStep, setSsoStep] = React.useState<'idle' | 'account_modal' | 'loading' | 'authenticated'>('idle');
  const [ssoSelectedAccount, setSsoSelectedAccount] = React.useState<string | null>(null);
  const [allowGoogleSso, setAllowGoogleSso] = React.useState(true);
  const [allowOtpEmail, setAllowOtpEmail] = React.useState(true);
  const [accessLogs, setAccessLogs] = React.useState<PlayerAccessLog[]>(INITIAL_PLAYER_ACCESS_LOGS);

  // Modal / Upload simulator (supports PDF / JPG / PNG)
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [uploadModalType, setUploadModalType] = React.useState<'id_card' | 'father_doc' | 'mother_doc' | 'consent_video' | 'medical'>('id_card');
  const [uploadedFileTemp, setUploadedFileTemp] = React.useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);

  // General feedback
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  // Save changes
  const handleSavePlayerProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedHometown = `${birthCity}, ${birthCountry}`;

    const updated: Player = {
      ...player,
      fullName,
      position,
      secondaryPosition: (secondaryPosition as Position) || undefined,
      birthDate,
      birthCountry,
      birthCity,
      residenceCountry,
      residenceCity,
      availableInProspectDirectory,
      hometown: formattedHometown,
      height,
      weight: Number(weight),
      bats,
      throws,
      email,
      phone,
      socialMedia: {
        instagram,
        tiktok,
        youtube,
        twitter,
      },
      tutorDocumentVerified,
      tutorConsentVideoUploaded,
      scoutVisibilityStatus: availableInProspectDirectory ? 'public' : 'restricted',
      verificationStatus: tutorDocumentVerified && tutorConsentVideoUploaded ? 'verified' : 'in_review',
      familyAndEligibility: {
        birthCity,
        birthCountry,
        currentResidenceAddress: player.familyAndEligibility?.currentResidenceAddress || 'Av. Las Américas Km 14',
        currentResidenceCity: residenceCity,
        currentResidenceCountry: residenceCountry,
        personalInterestsAndHobbies: player.familyAndEligibility?.personalInterestsAndHobbies || ['Ajedrez', 'Natación'],
        languagesSpoken: player.familyAndEligibility?.languagesSpoken || ['Español (Nativo)', 'Inglés (Básico)'],
        father: {
          fullName: fatherName,
          relationship: 'Padre',
          nationality: fatherBirthCountry,
          birthPlace: fatherBirthPlace,
          idDocumentNumber: fatherIdNumber,
          phone: fatherPhone,
          occupation: fatherOccupation,
          hasPassport: fatherHasPassport,
          passportCountry: fatherPassportCountry,
        },
        mother: {
          fullName: motherName,
          relationship: 'Madre',
          nationality: motherBirthCountry,
          birthPlace: motherBirthPlace,
          idDocumentNumber: motherIdNumber,
          phone: motherPhone,
          occupation: motherOccupation,
          hasPassport: motherHasPassport,
          passportCountry: motherPassportCountry,
        },
        legalGuardianSameAsParent: tutorRelationship === 'Padre' || tutorRelationship === 'Madre',
        legalGuardianName: tutorName,
        eligibleNationalTeams: player.familyAndEligibility?.eligibleNationalTeams || [
          {
            id: 'nt-dom',
            country: fatherBirthCountry || 'República Dominicana',
            basis: 'Nacimiento',
            status: 'confirmado',
            federationCode: 'FEDOBE / WBSC-DOM',
          }
        ],
        passportsAvailable: player.familyAndEligibility?.passportsAvailable || [
          {
            id: 'pass-1',
            country: 'República Dominicana',
            passportNumberMasked: 'DO***4821',
            expirationDate: '2030-05-15',
            hasUsVisa: true,
            visaType: 'B1/B2 Turista & Negocios',
          }
        ],
      }
    };

    onUpdatePlayer(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Password & credentials update handler
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setPasswordChangeMessage({ text: 'La nueva contraseña debe contener al menos 8 caracteres.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordChangeMessage({ text: 'La confirmación de la contraseña no coincide con la nueva clave.', type: 'error' });
      return;
    }
    setPasswordChangeMessage({ text: '¡Credenciales de acceso a la plataforma actualizadas exitosamente!', type: 'success' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordChangeMessage(null), 4000);
  };

  // OTP simulation handlers
  const handleSendOtp = () => {
    if (!otpEmail || !otpEmail.includes('@')) {
      setOtpError('Ingresa un correo electrónico válido');
      return;
    }
    setOtpError(null);
    setIsSendingCode(true);

    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(randomCode);

    setTimeout(() => {
      setIsSendingCode(false);
      setOtpStep('sent');
      setEnteredCode('');
    }, 700);
  };

  const handleVerifyOtp = () => {
    if (enteredCode.trim() === generatedCode) {
      setOtpStep('verified');
      setOtpError(null);
      const newLog: PlayerAccessLog = {
        id: `plog-${Date.now()}`,
        user: otpEmail,
        role: 'Jugador / Prospecto',
        method: 'OTP Correo',
        ip: '190.166.45.88',
        location: 'Santo Domingo, DO',
        timestamp: 'Justo ahora',
        status: 'Exitoso',
      };
      setAccessLogs((prev) => [newLog, ...prev]);
    } else {
      setOtpError('El código ingresado no coincide con el enviado al correo.');
    }
  };

  const handleResetOtp = () => {
    setOtpStep('input');
    setEnteredCode('');
    setOtpError(null);
  };

  const handleStartGoogleSso = () => {
    setSsoStep('account_modal');
  };

  const handleSelectGoogleAccount = (accountEmail: string) => {
    setSsoSelectedAccount(accountEmail);
    setSsoStep('loading');

    setTimeout(() => {
      setSsoStep('authenticated');
      const newLog: PlayerAccessLog = {
        id: `plog-${Date.now()}`,
        user: accountEmail,
        role: accountEmail.includes('tutor') ? 'Tutor Legal' : 'Jugador / Atleta',
        method: 'Google SSO',
        ip: '190.166.45.88',
        location: 'Santo Domingo, DO',
        timestamp: 'Justo ahora',
        status: 'Exitoso',
      };
      setAccessLogs((prev) => [newLog, ...prev]);
    }, 900);
  };

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadSuccess(true);
    setTimeout(() => {
      if (uploadModalType === 'id_card') {
        setTutorDocumentVerified(true);
      } else if (uploadModalType === 'consent_video') {
        setTutorConsentVideoUploaded(true);
        setAvailableInProspectDirectory(true);
      }
      setUploadSuccess(false);
      setShowUploadModal(false);
    }, 1200);
  };

  return (
    <div id="player-settings-profile-container" className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={player.avatar}
              alt={player.fullName}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-3 border-blue-500 shadow-lg"
            />
            <div className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-blue-600 text-white font-black text-[10px] shadow-sm">
              #{player.position}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {player.fullName}
              </h1>
              {availableInProspectDirectory ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> En Directorio de Prospectos
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center gap-1">
                  <EyeOff className="w-3.5 h-3.5" /> Oculto del Directorio
                </span>
              )}
              {tutorConsentVideoUploaded && tutorDocumentVerified ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Perfil Verificado
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Pendiente Tutor
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Gestión Integral del Perfil: Datos de Identidad, Tutor Legal, Directorio de Prospectos y Accesos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('dashboard')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-slate-600" />
              <span>Ver Dashboard</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenRbacModal}
            className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Matriz RBAC</span>
          </button>
        </div>
      </div>

      {/* Success notification banner */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-500 text-white text-xs rounded-2xl font-bold flex items-center justify-between shadow-md shadow-emerald-500/20 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5" />
            <span>¡Los datos de identidad, residencia y visibilidad del jugador fueron guardados exitosamente!</span>
          </div>
          <span className="text-[10px] bg-emerald-600/60 px-2 py-0.5 rounded-full uppercase font-black">
            Sincronizado
          </span>
        </div>
      )}

      {/* 2. Main Tabbed Navigation */}
      <form onSubmit={handleSavePlayerProfile} className="space-y-6">
        {/* Navigation Tabs Bar (Clean 4-tab structure without Plan & Subscription) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTabSection('profile')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTabSection === 'profile'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Datos de Identidad</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection('tutor')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTabSection === 'tutor'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Tutor Legal & Documentos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection('visibility')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTabSection === 'visibility'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Visibilidad & Directorio de Prospectos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection('access')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTabSection === 'access'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Acceso & Autenticación (OTP / SSO)</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: DATOS PERSONALES & FICHA DEPORTIVA */}
        {/* ========================================================================= */}
        {activeTabSection === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Ficha de Identidad & Perfil Atlético
                </h2>
                <p className="text-xs text-slate-500">
                  Datos biográficos oficiales, procedencia de nacimiento, residencia actual y medidas físicas
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Posición Principal</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="SS">Shortstop (SS)</option>
                    <option value="OF">Outfielder / CF (OF)</option>
                    <option value="RHP">Right-Handed Pitcher (RHP)</option>
                    <option value="LHP">Left-Handed Pitcher (LHP)</option>
                    <option value="C">Catcher (C)</option>
                    <option value="3B">Third Baseman (3B)</option>
                    <option value="2B">Second Baseman (2B)</option>
                    <option value="1B">First Baseman (1B)</option>
                    <option value="UTIL">Utility (UTIL)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Posición Secundaria</label>
                  <input
                    type="text"
                    value={secondaryPosition}
                    onChange={(e) => setSecondaryPosition(e.target.value)}
                    placeholder="Ej. 2B / CF"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">País de Nacimiento</label>
                  <input
                    type="text"
                    required
                    value={birthCountry}
                    onChange={(e) => setBirthCountry(e.target.value)}
                    placeholder="Ej. República Dominicana"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Ciudad de Nacimiento</label>
                  <input
                    type="text"
                    required
                    value={birthCity}
                    onChange={(e) => setBirthCity(e.target.value)}
                    placeholder="Ej. San Pedro de Macorís"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">País de Residencia</label>
                  <input
                    type="text"
                    required
                    value={residenceCountry}
                    onChange={(e) => setResidenceCountry(e.target.value)}
                    placeholder="Ej. República Dominicana"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Ciudad de Residencia</label>
                  <input
                    type="text"
                    required
                    value={residenceCity}
                    onChange={(e) => setResidenceCity(e.target.value)}
                    placeholder="Ej. Santo Domingo Este"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Estatura</label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Ej. 6'1''"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Peso (lbs)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Batea (Bats)</label>
                  <select
                    value={bats}
                    onChange={(e) => setBats(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="R">Derecho (R)</option>
                    <option value="L">Zurdo (L)</option>
                    <option value="S">Ambidiestro (Switch / S)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Lanza (Throws)</label>
                  <select
                    value={throws}
                    onChange={(e) => setThrows(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="R">Derecho (R)</option>
                    <option value="L">Zurdo (L)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Teléfono Móvil</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (809) 555-0182"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Correo Electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Redes y Medios Digitales con TikTok incluido */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Presencia Digital & Redes del Atleta
                </h2>
                <p className="text-xs text-slate-500">
                  Perfiles oficiales para seguimiento de scouts, highlights, videos y marca personal
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    <span>Instagram</span>
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@usuario"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-slate-900 fill-current" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.48 2.76 1.26-.01 2.39-.73 2.89-1.87.26-.53.37-1.13.36-1.72V.02h-.01z" />
                    </svg>
                    <span>TikTok</span>
                  </label>
                  <input
                    type="text"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    placeholder="@usuario.tiktok"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Youtube className="w-3.5 h-3.5 text-rose-600" />
                    <span>Canal de YouTube</span>
                  </label>
                  <input
                    type="text"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="https://youtube.com/@..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-sky-500" />
                    <span>X / Twitter</span>
                  </label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="@usuario"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PADRES (PADRE Y MADRE) & TUTOR LEGAL & DOCUMENTOS (FOTO / PDF) */}
        {/* ========================================================================= */}
        {activeTabSection === 'tutor' && (
          <div className="space-y-6">
            {/* Header / Summary Status Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>Registro de Padres (Padre & Madre) y Tutor Legal</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Datos biográficos oficiales, países de nacimiento para elegibilidad de selecciones nacionales y custodia legal / MLB
                </p>
              </div>

              {tutorDocumentVerified && tutorConsentVideoUploaded ? (
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 self-start sm:self-auto">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Elegibilidad & Custodia Validadas
                </span>
              ) : (
                <span className="px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-2 self-start sm:self-auto">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Documentación Pendiente de Revisión
                </span>
              )}
            </div>

            {/* SECCIÓN 1: DATOS DEL PADRE */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-sm">
                    👨
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">Datos del Padre</h3>
                    <p className="text-xs text-slate-500">Información de identidad, país de nacimiento y contacto</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold">
                  Línea Paterna
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Nombre Completo del Padre</label>
                  <input
                    type="text"
                    required
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="Ej. Carlos Mendoza Sr."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">País de Nacimiento (Padre)</label>
                  <input
                    type="text"
                    required
                    value={fatherBirthCountry}
                    onChange={(e) => setFatherBirthCountry(e.target.value)}
                    placeholder="Ej. República Dominicana / Venezuela / Cuba / EE.UU."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Ciudad / Lugar de Nacimiento</label>
                  <input
                    type="text"
                    value={fatherBirthPlace}
                    onChange={(e) => setFatherBirthPlace(e.target.value)}
                    placeholder="Ej. San Pedro de Macorís, RD"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Cédula / Documento de Identidad</label>
                  <input
                    type="text"
                    value={fatherIdNumber}
                    onChange={(e) => setFatherIdNumber(e.target.value)}
                    placeholder="Ej. 001-1829481-2"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Teléfono del Padre</label>
                  <input
                    type="text"
                    value={fatherPhone}
                    onChange={(e) => setFatherPhone(e.target.value)}
                    placeholder="+1 (809) 555-8890"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Ocupación / Profesión</label>
                  <input
                    type="text"
                    value={fatherOccupation}
                    onChange={(e) => setFatherOccupation(e.target.value)}
                    placeholder="Ej. Comerciante / Entrenador / Ingeniero"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">¿Posee Pasaporte Vigente?</label>
                  <select
                    value={fatherHasPassport ? 'yes' : 'no'}
                    onChange={(e) => setFatherHasPassport(e.target.value === 'yes')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="yes">Sí, Pasaporte Vigente</option>
                    <option value="no">No posee pasaporte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">País del Pasaporte</label>
                  <input
                    type="text"
                    value={fatherPassportCountry}
                    onChange={(e) => setFatherPassportCountry(e.target.value)}
                    placeholder="Ej. República Dominicana"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: DATOS DE LA MADRE */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-black text-sm">
                    👩
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">Datos de la Madre</h3>
                    <p className="text-xs text-slate-500">Información biográfica, país de nacimiento y contacto</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold">
                  Línea Materna
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Nombre Completo de la Madre</label>
                  <input
                    type="text"
                    required
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="Ej. Elena Castillo de Mendoza"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">País de Nacimiento (Madre)</label>
                  <input
                    type="text"
                    required
                    value={motherBirthCountry}
                    onChange={(e) => setMotherBirthCountry(e.target.value)}
                    placeholder="Ej. República Dominicana / Puerto Rico / EE.UU."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Ciudad / Lugar de Nacimiento</label>
                  <input
                    type="text"
                    value={motherBirthPlace}
                    onChange={(e) => setMotherBirthPlace(e.target.value)}
                    placeholder="Ej. Santo Domingo, RD"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Cédula / Documento de Identidad</label>
                  <input
                    type="text"
                    value={motherIdNumber}
                    onChange={(e) => setMotherIdNumber(e.target.value)}
                    placeholder="Ej. 001-0987123-4"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Teléfono de la Madre</label>
                  <input
                    type="text"
                    value={motherPhone}
                    onChange={(e) => setMotherPhone(e.target.value)}
                    placeholder="+1 (809) 555-8891"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Ocupación / Profesión</label>
                  <input
                    type="text"
                    value={motherOccupation}
                    onChange={(e) => setMotherOccupation(e.target.value)}
                    placeholder="Ej. Docente / Contadora / Empresaria"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">¿Posee Pasaporte Vigente?</label>
                  <select
                    value={motherHasPassport ? 'yes' : 'no'}
                    onChange={(e) => setMotherHasPassport(e.target.value === 'yes')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="yes">Sí, Pasaporte Vigente</option>
                    <option value="no">No posee pasaporte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">País del Pasaporte</label>
                  <input
                    type="text"
                    value={motherPassportCountry}
                    onChange={(e) => setMotherPassportCountry(e.target.value)}
                    placeholder="Ej. República Dominicana"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: TUTOR LEGAL DESIGNADO & CUSTODIO */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-black text-sm">
                    ⚖️
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Tutor Legal / Custodio Designado ante MLB & Academia
                    </h3>
                    <p className="text-xs text-slate-500">
                      Persona autorizada para firma de contratos, representación legal y consentimientos de viaje
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold">
                  Custodia Legal
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Nombre del Tutor Legal</label>
                  <input
                    type="text"
                    value={tutorName}
                    onChange={(e) => setTutorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Parentesco con el Atleta</label>
                  <select
                    value={tutorRelationship}
                    onChange={(e) => {
                      const rel = e.target.value;
                      setTutorRelationship(rel);
                      if (rel === 'Padre') {
                        setTutorName(fatherName);
                        setTutorBirthCountry(fatherBirthCountry);
                        setTutorIdNumber(fatherIdNumber);
                        setTutorPhone(fatherPhone);
                      } else if (rel === 'Madre') {
                        setTutorName(motherName);
                        setTutorBirthCountry(motherBirthCountry);
                        setTutorIdNumber(motherIdNumber);
                        setTutorPhone(motherPhone);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Padre">Padre</option>
                    <option value="Madre">Madre</option>
                    <option value="Tutor Legal Autorizado">Tutor Legal Autorizado / Custodio</option>
                    <option value="Abuelo/a">Abuelo / Abuela</option>
                    <option value="Apoderado Legal">Apoderado Legal / Representante</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">País de Nacimiento del Tutor</label>
                  <input
                    type="text"
                    value={tutorBirthCountry}
                    onChange={(e) => setTutorBirthCountry(e.target.value)}
                    placeholder="Ej. República Dominicana"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Cédula / Pasaporte del Tutor</label>
                  <input
                    type="text"
                    value={tutorIdNumber}
                    onChange={(e) => setTutorIdNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Teléfono Directo del Tutor</label>
                  <input
                    type="text"
                    value={tutorPhone}
                    onChange={(e) => setTutorPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Correo Electrónico del Tutor</label>
                  <input
                    type="email"
                    value={tutorEmail}
                    onChange={(e) => setTutorEmail(e.target.value)}
                    placeholder="tutor@correo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Resumen de Elegibilidad para Torneos WBSC</label>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      Apto para representar a: <strong>{fatherBirthCountry || 'República Dominicana'}</strong> (vía Padre) {motherBirthCountry !== fatherBirthCountry && motherBirthCountry && <>y <strong>{motherBirthCountry}</strong> (vía Madre)</>}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 4: DOCUMENTOS (FOTO / PDF) & VIDEO DE CONSENTIMIENTO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Doc 1: Identity Card (Photo or PDF) */}
              <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        tutorDocumentVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Documento del Tutor (Foto o PDF)</h3>
                      <p className="text-xs text-slate-500">Cédula de Identidad o Pasaporte Escaneado</p>
                    </div>
                  </div>

                  {tutorDocumentVerified && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black border border-emerald-200">
                      ✓ Validado
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Archivo digital en formato PDF o fotografía legible que acredita la identidad y patria potestad del tutor legal ante directores de scouting MLB y la academia.
                </p>

                {tutorDocumentVerified && (
                  <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="truncate">{tutorDocumentFileName}</span>
                    <span className="ml-auto text-[10px] text-emerald-600 font-bold">Verificado</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Soporta: PDF, JPG, PNG
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadModalType('id_card');
                      setShowUploadModal(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{tutorDocumentVerified ? 'Actualizar Documento (PDF/Foto)' : 'Subir Documento (PDF/Foto)'}</span>
                  </button>
                </div>
              </div>

              {/* Doc 2: Video Consent */}
              <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        tutorConsentVideoUploaded ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      <Video className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Video de Consentimiento del Tutor</h3>
                      <p className="text-xs text-slate-500">Grabación de 15 segundos con autorización verbal</p>
                    </div>
                  </div>

                  {tutorConsentVideoUploaded && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black border border-emerald-200">
                      ✓ Grabado
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Declaración en video del tutor legal autorizando la difusión deportiva de las métricas Trackman y la participación en showcases internacionales.
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 font-medium">Estado: {tutorConsentVideoUploaded ? 'Aprobado por Compliance' : 'Pendiente'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadModalType('consent_video');
                      setShowUploadModal(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{tutorConsentVideoUploaded ? 'Volver a Grabar Video' : 'Grabar Video Ahora'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: VISIBILIDAD EN DIRECTORIO DE PROSPECTOS & VINCULACIÓN A ACADEMIAS */}
        {/* ========================================================================= */}
        {activeTabSection === 'visibility' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Directorio de Prospectos & Vinculación a Academias
                </h2>
                <p className="text-xs text-slate-500">
                  Controla tu disponibilidad pública para aparecer en el Directorio General de Talentos y recibir solicitudes de vinculación de academias registradas
                </p>
              </div>

              {/* Master Availability Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setAvailableInProspectDirectory(true)}
                  className={`p-6 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                    availableInProspectDirectory
                      ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-full">
                      ✓ Disponible para Vinculación
                    </span>
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-slate-900">
                    Visible en el Directorio de Prospectos
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tu ficha de jugador, datos de procedencia ({birthCity}, {birthCountry}), residencia ({residenceCity}, {residenceCountry}), videos y percentiles son descubribles por directores y entrenadores de academias para enviarte invitaciones directas de vinculación y reclutamiento.
                  </p>
                  <div className="pt-2 border-t border-blue-100/60 flex items-center gap-2 text-[11px] font-bold text-blue-700">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Recomendado para prospectos libres o buscando afiliación</span>
                  </div>
                </div>

                <div
                  onClick={() => setAvailableInProspectDirectory(false)}
                  className={`p-6 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                    !availableInProspectDirectory
                      ? 'border-slate-700 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      !availableInProspectDirectory ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      Oculto / No Disponible
                    </span>
                    <EyeOff className={`w-5 h-5 ${!availableInProspectDirectory ? 'text-amber-400' : 'text-slate-400'}`} />
                  </div>
                  <h4 className={`text-sm sm:text-base font-black ${!availableInProspectDirectory ? 'text-white' : 'text-slate-900'}`}>
                    No salir en el Directorio de Prospectos
                  </h4>
                  <p className={`text-xs leading-relaxed ${!availableInProspectDirectory ? 'text-slate-300' : 'text-slate-600'}`}>
                    Tu perfil no aparecerá en las búsquedas públicas ni filtros de academias. Solo podrás ser vinculado a una academia si recibes un código de invitación directo del director o si te vinculas manualmente.
                  </p>
                  <div className={`pt-2 border-t flex items-center gap-2 text-[11px] font-bold ${
                    !availableInProspectDirectory ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
                  }`}>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Modo privado / Perfil reservado</span>
                  </div>
                </div>
              </div>

              {/* Granular Directory Preferences */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Preferencias de Contacto & Vinculación con Academias
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Permitir Solicitudes de Vinculación Directa</h4>
                      <p className="text-[11px] text-slate-500">Las academias interesadas pueden enviarte ofertas formales de vinculación</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowDirectAcademyInvitations}
                      onChange={(e) => setAllowDirectAcademyInvitations(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Mostrar Métricas & Percentiles Atléticos</h4>
                      <p className="text-[11px] text-slate-500">60 yardas, exit velo, pop time y brazo visibles en tu tarjeta del directorio</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={showMetricsInDirectory}
                      onChange={(e) => setShowMetricsInDirectory(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Permitir Visualización de Videos de Mecánica</h4>
                      <p className="text-[11px] text-slate-500">Coaches y directores pueden evaluar videos de bateo y fildeo</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={showVideosInDirectory}
                      onChange={(e) => setShowVideosInDirectory(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Notificar al Tutor Legal ante Invitaciones</h4>
                      <p className="text-[11px] text-slate-500">Aviso inmediato por correo electrónico y WhatsApp al tutor registrado</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifyTutorOnInvitation}
                      onChange={(e) => setNotifyTutorOnInvitation(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ACCESO & AUTENTICACIÓN (CONFIGURACIÓN DE ACCESO A LA PLATAFORMA) */}
        {/* ========================================================================= */}
        {activeTabSection === 'access' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-600" />
                  <span>Configuración de Acceso a la Plataforma & Seguridad</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Gestiona las credenciales de inicio de sesión, contraseñas, autenticación sin contraseña (OTP), Google SSO y políticas de seguridad del atleta y tutor.
                </p>
              </div>

              {/* Sub-tabs for Access: Credentials, OTP, SSO, Policies */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
                <button
                  type="button"
                  onClick={() => setAccessMethodTab('credentials')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    accessMethodTab === 'credentials'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Credenciales & Contraseña</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAccessMethodTab('otp')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    accessMethodTab === 'otp'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Acceso por Código OTP</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAccessMethodTab('sso')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    accessMethodTab === 'sso'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Google SSO & Cuentas</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAccessMethodTab('policies')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    accessMethodTab === 'policies'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Historial de Sesiones ({accessLogs.length})</span>
                </button>
              </div>

              {/* 1. CREDENTIALS & PASSWORD MANAGEMENT */}
              {accessMethodTab === 'credentials' && (
                <div className="space-y-6">
                  {/* Account Identification */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <User className="w-4 h-4 text-blue-600" /> Correo de Acceso del Atleta
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                          Cuenta Principal
                        </span>
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="atleta@dominio.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                      <p className="text-[11px] text-slate-500">
                        Utilizado para ingresar al portal de prospectos y recibir notificaciones de eventos.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Correo de Acceso del Tutor Legal
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Autoridad Legal
                        </span>
                      </div>
                      <input
                        type="email"
                        value={tutorEmail}
                        onChange={(e) => setTutorEmail(e.target.value)}
                        placeholder="tutor@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                      <p className="text-[11px] text-slate-500">
                        Tiene permisos para aprobar solicitudes de vinculación, contratos y consentimientos de video.
                      </p>
                    </div>
                  </div>

                  {/* Password Change Form */}
                  <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Lock className="w-4 h-4 text-slate-700" />
                          <span>Cambio de Contraseña de la Plataforma</span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          Establece una contraseña robusta de al menos 8 caracteres para proteger tu cuenta.
                        </p>
                      </div>
                    </div>

                    {passwordChangeMessage && (
                      <div
                        className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                          passwordChangeMessage.type === 'success'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {passwordChangeMessage.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span>{passwordChangeMessage.text}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Contraseña Actual</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Nueva Contraseña</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Mínimo 8 caracteres"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirmar Nueva Contraseña</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repite la nueva contraseña"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={handleUpdatePassword}
                        className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>Actualizar Contraseña</span>
                      </button>
                    </div>
                  </div>

                  {/* Security Policies */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Autenticación en Dos Pasos (2FA)</h4>
                        <p className="text-[11px] text-slate-500">Solicita un código de confirmación al iniciar sesión en un dispositivo nuevo</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={twoFactorEnabled}
                        onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">PIN de Autorización para el Tutor</h4>
                        <p className="text-[11px] text-slate-500">Exige PIN de seguridad antes de firmar vinculaciones o cartas de rescisión</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={requirePinForSensitiveChanges}
                        onChange={(e) => setRequirePinForSensitiveChanges(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. OTP SIMULATION PANEL */}
              {accessMethodTab === 'otp' && (
                <div className="space-y-4 max-w-xl">
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2">
                    <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span>Acceso Rápido sin Contraseña (One-Time Password)</span>
                    </div>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      El jugador o tutor recibe un código numérico temporal de 6 dígitos en su correo para ingresar a la plataforma de forma segura y sin recordar contraseñas.
                    </p>
                  </div>

                  {otpStep === 'input' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico para Recibir Código</label>
                        <input
                          type="email"
                          value={otpEmail}
                          onChange={(e) => setOtpEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>

                      {otpError && <p className="text-xs text-rose-600 font-bold">{otpError}</p>}

                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingCode}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                      >
                        {isSendingCode ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                        <span>Enviar Código de 6 Dígitos</span>
                      </button>
                    </div>
                  )}

                  {otpStep === 'sent' && (
                    <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Código enviado a {otpEmail}</span>
                        <span className="text-[11px] font-mono font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">
                          Código de prueba: {generatedCode}
                        </span>
                      </div>

                      <input
                        type="text"
                        maxLength={6}
                        value={enteredCode}
                        onChange={(e) => setEnteredCode(e.target.value)}
                        placeholder="Ingresa los 6 dígitos"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-center font-mono text-lg font-black tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />

                      {otpError && <p className="text-xs text-rose-600 font-bold">{otpError}</p>}

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all cursor-pointer"
                        >
                          Verificar & Autenticar
                        </button>
                        <button
                          type="button"
                          onClick={handleResetOtp}
                          className="px-3.5 py-2.5 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                        >
                          Reenviar código
                        </button>
                      </div>
                    </div>
                  )}

                  {otpStep === 'verified' && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>¡Identidad verificada exitosamente mediante OTP!</span>
                      </div>
                      <p className="text-xs text-emerald-700">
                        La sesión ha sido validada y registrada en el historial de accesos del atleta.
                      </p>
                      <button
                        type="button"
                        onClick={handleResetOtp}
                        className="mt-2 text-xs font-bold text-emerald-800 underline cursor-pointer"
                      >
                        Probar otra autenticación
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 3. SSO SIMULATION PANEL */}
              {accessMethodTab === 'sso' && (
                <div className="space-y-4 max-w-xl">
                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                      <Globe className="w-4 h-4 text-indigo-600" />
                      <span>Inicio de Sesión Rápido con Google (Single Sign-On)</span>
                    </div>
                    <p className="text-xs text-indigo-700 leading-relaxed">
                      Permite iniciar sesión con 1 clic en la plataforma utilizando las cuentas institucionales de Google o cuentas personales autorizadas.
                    </p>
                  </div>

                  {ssoStep === 'idle' && (
                    <button
                      type="button"
                      onClick={handleStartGoogleSso}
                      className="px-5 py-3 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-3 shadow-xs transition-all cursor-pointer"
                    >
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-blue-600">
                        G
                      </div>
                      <span>Iniciar Sesión con Google</span>
                    </button>
                  )}

                  {ssoStep === 'account_modal' && (
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-md space-y-3">
                      <span className="text-xs font-bold text-slate-800 block">Selecciona una cuenta de Google vinculada:</span>
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => handleSelectGoogleAccount(email || 'y.mendoza@caribebaseball.do')}
                          className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 flex items-center justify-between text-left transition-all cursor-pointer"
                        >
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{fullName} (Atleta)</span>
                            <span className="text-[11px] text-slate-500">{email || 'y.mendoza@caribebaseball.do'}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSelectGoogleAccount(tutorEmail || 'carlos.mendoza.tutor@gmail.com')}
                          className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 flex items-center justify-between text-left transition-all cursor-pointer"
                        >
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{tutorName} (Tutor Legal)</span>
                            <span className="text-[11px] text-slate-500">{tutorEmail || 'carlos.mendoza.tutor@gmail.com'}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  )}

                  {ssoStep === 'loading' && (
                    <div className="p-4 rounded-2xl bg-slate-50 flex items-center gap-3 text-xs font-bold text-slate-700">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                      <span>Validando credenciales OAuth 2.0 con Google...</span>
                    </div>
                  )}

                  {ssoStep === 'authenticated' && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>¡Autenticado con Google SSO ({ssoSelectedAccount})!</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSsoStep('idle')}
                        className="text-xs font-bold text-emerald-800 underline cursor-pointer"
                      >
                        Cerrar sesión simulada
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 4. AUDIT & ACCESS LOGS */}
              {accessMethodTab === 'policies' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      Registro de inicios de sesión y dispositivos autorizados para acceder a este perfil de atleta.
                    </p>
                    <button
                      type="button"
                      onClick={() => alert('Todas las demás sesiones activas han sido cerradas por seguridad.')}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Cerrar Otras Sesiones</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                        <tr>
                          <th className="py-3 px-4">Usuario / Cuenta</th>
                          <th className="py-3 px-4">Rol</th>
                          <th className="py-3 px-4">Método</th>
                          <th className="py-3 px-4">Ubicación</th>
                          <th className="py-3 px-4">Hora</th>
                          <th className="py-3 px-4">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {accessLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50">
                            <td className="py-3 px-4 font-bold text-slate-900">{log.user}</td>
                            <td className="py-3 px-4 text-slate-600">{log.role}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                                {log.method}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-500">{log.location}</td>
                            <td className="py-3 px-4 text-slate-500">{log.timestamp}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Floating Bottom Action Bar for Saving */}
        <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-slate-200 shadow-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs text-slate-600 font-semibold hidden sm:block">
              Cambios pendientes en el perfil de <strong className="text-slate-900">{fullName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/20 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios del Jugador</span>
            </button>
          </div>
        </div>
      </form>

      {/* Upload Simulation Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-slate-900">
                {uploadModalType === 'id_card'
                  ? 'Subir Cédula / Pasaporte del Tutor'
                  : uploadModalType === 'consent_video'
                  ? 'Grabar Video de Consentimiento Legal'
                  : 'Subir Certificado Médico'}
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {uploadSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl text-center text-xs font-bold space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p>¡Documento / Video recibido y aprobado por el departamento legal!</p>
              </div>
            ) : (
              <form onSubmit={handleSimulateUpload} className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-2 hover:border-blue-400 transition-colors cursor-pointer bg-slate-50/50">
                  {uploadModalType === 'consent_video' ? (
                    <Video className="w-8 h-8 text-blue-600 mx-auto" />
                  ) : (
                    <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  )}
                  <p className="text-xs font-bold text-slate-700">
                    {uploadModalType === 'consent_video'
                      ? 'Grabar video de 15 segundos con la cámara o subir archivo'
                      : 'Arrastra o haz clic para subir foto del documento'}
                  </p>
                  <span className="text-[10px] text-slate-400">Formatos permitidos: JPG, PNG, PDF, MP4 (Máx 50MB)</span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm"
                  >
                    Confirmar Subida
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper send icon
function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
