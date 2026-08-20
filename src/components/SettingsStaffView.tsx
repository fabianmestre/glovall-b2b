import React from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  CreditCard,
  Crown,
  Edit2,
  ExternalLink,
  Eye,
  FileCheck,
  Filter,
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
  RefreshCw,
  Save,
  Search,
  Share2,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
  Trophy,
  UserCheck,
  Users,
  Video,
  X,
  Youtube,
  Zap
} from 'lucide-react';
import { AcademyAchievement, AcademyProfile, AcademySocialLinks, Player, UserRole } from '../types';
import { ALL_TECHNICAL_SPECIALTIES_AND_RESOURCES } from '../data/mockData';
import { SubscriptionManagementTab } from './SubscriptionManagementTab';

interface SettingsStaffViewProps {
  academy: AcademyProfile;
  players: Player[];
  activeRole: UserRole;
  onUpdateAcademy: (updated: AcademyProfile) => void;
  onOpenRbacModal: () => void;
  onNavigateToCoaches?: () => void;
}

// Columns defined according to the reference schema
const COLUMN_1_SERVICES = [
  'Diseño de Pitcheo',
  'Aumento de Exit Velocity',
  'Catcher Framing & Blocking',
  'Lectura de Rutas',
  'Entrenamiento de Showcases',
  'Fisioterapia y Recuperación',
  'Potencia Explosiva',
  'Cajas de Bateo',
  'HitTrax',
  'Sensores Blast',
];

const COLUMN_2_SERVICES = [
  'Aumento de Velocidad',
  'Reconocimiento de Pitcheos',
  'Control de Zona',
  'Fisioterapia Deportiva',
  'Hipertrofia Funcional',
  'Nutrición Deportiva Pro',
  'Psicología Deportiva',
  'Rapsodo',
  'Radares de Velocidad',
  'Residencia',
];

const COLUMN_3_SERVICES = [
  'Optimización de Launch Angle',
  'Infield Moderno',
  'Mecánica de Swings',
  'Gimnasio',
  'Cuidado de Brazo',
  'Biomecánica del Movimiento',
  'Campos Propios',
  'Trackman',
  'Análisis de Video',
];

interface AccessLog {
  id: string;
  user: string;
  role: string;
  method: 'OTP Correo' | 'Google SSO' | 'Contraseña + 2FA';
  ip: string;
  location: string;
  timestamp: string;
  status: 'Exitoso' | 'Bloqueado por Dominio' | '2FA Verificado';
}

const INITIAL_ACCESS_LOGS: AccessLog[] = [
  {
    id: 'log-1',
    user: 'director@caribebaseball.do',
    role: 'Director General',
    method: 'Google SSO',
    ip: '190.166.45.12',
    location: 'Santo Domingo, DO',
    timestamp: 'Hace 12 min',
    status: 'Exitoso',
  },
  {
    id: 'log-2',
    user: 'crosario@caribebaseball.do',
    role: 'Head Trainer',
    method: 'OTP Correo',
    ip: '179.52.120.88',
    location: 'Santiago, DO',
    timestamp: 'Hace 45 min',
    status: 'Exitoso',
  },
  {
    id: 'log-3',
    user: 'scout.evaluator@mlb.com',
    role: 'Scout MLB Verificado',
    method: 'Google SSO',
    ip: '108.28.194.5',
    location: 'Miami, FL (USA)',
    timestamp: 'Hace 2 horas',
    status: 'Exitoso',
  },
  {
    id: 'log-4',
    user: 'externo@gmail.com',
    role: 'Desconocido',
    method: 'Google SSO',
    ip: '201.229.74.19',
    location: 'Boca Chica, DO',
    timestamp: 'Ayer, 18:20',
    status: 'Bloqueado por Dominio',
  },
];

const DEFAULT_ACHIEVEMENTS: AcademyAchievement[] = [
  {
    id: 'ach-1',
    year: 2025,
    title: 'Firma Internacional MLB: Bonos Superiores a $4.8M',
    category: 'Firma MLB',
    description: '6 prospectos firmaron con organizaciones de Grandes Ligas en el periodo Julio 2 / Enero 15 (Yankees, Padres, Astros).',
    metricOrBonus: '$4.85M en Bonos',
    verifiedByScout: true,
  },
  {
    id: 'ach-2',
    year: 2024,
    title: 'Campeones del Showcase Internacional PG Caribbean Select',
    category: 'Torneo / Campeonato',
    description: 'Equipo Sub-17 invicto con efectividad colectiva de 1.45 ERA y velocidad máxima de salida de 105.4 MPH registrada por TrackMan.',
    metricOrBonus: 'Medalla de Oro (Invictos)',
    verifiedByScout: true,
  },
  {
    id: 'ach-3',
    year: 2024,
    title: 'Alianza Oficial D1 NCAA & Becas Universitarias en EE.UU.',
    category: 'Alianza Académica D1',
    description: 'Convenio de intercambio atlético-académico con 4 universidades D1 y Junior Colleges de Florida y Texas para atletas no firmados.',
    metricOrBonus: '12 Becas Otorgadas',
    verifiedByScout: true,
  },
  {
    id: 'ach-4',
    year: 2023,
    title: 'Certificación Oficial de Instalaciones TrackMan & Driveline',
    category: 'Certificación Internacional',
    description: 'Acreditación como centro de entrenamiento de alta tecnología con sensores V3 e iluminación LED nocturna homologada.',
    metricOrBonus: 'Acreditación Grado Oro',
    verifiedByScout: true,
  },
  {
    id: 'ach-5',
    year: 2022,
    title: 'Inauguración Complejo Residencial & Laboratorio Biomecánico',
    category: 'Hito Institucional',
    description: 'Apertura de residencia para 40 atletas, comedor con nutricionista deportiva full-time y jaula de bateo inteligente.',
    metricOrBonus: 'Capacidad 40 Atletas',
    verifiedByScout: true,
  },
];

export const SettingsStaffView: React.FC<SettingsStaffViewProps> = ({
  academy,
  players,
  activeRole,
  onUpdateAcademy,
  onOpenRbacModal,
  onNavigateToCoaches,
}) => {
  // Navigation Tabs state
  const [activeTabSection, setActiveTabSection] = React.useState<
    'services' | 'achievements' | 'institutional' | 'access' | 'subscription'
  >('services');

  // Institutional Data State
  const [academyName, setAcademyName] = React.useState(academy.name);
  const [tagline, setTagline] = React.useState(academy.tagline || 'Desarrollo de Élite y Proyección Internacional de Prospectos MLB');
  const [directorName, setDirectorName] = React.useState(academy.directorName);
  const [phone, setPhone] = React.useState(academy.directorPhone);
  const [email, setEmail] = React.useState(academy.directorEmail);
  const [city, setCity] = React.useState(academy.city);
  const [country, setCountry] = React.useState(academy.country || 'República Dominicana');
  const [establishedYear, setEstablishedYear] = React.useState(academy.establishedYear || 2018);

  // Digital Presence & Social Media State
  const [websiteUrl, setWebsiteUrl] = React.useState(academy.websiteUrl || academy.socialLinks?.website || 'https://caribebaseball.do');
  const [instagram, setInstagram] = React.useState(academy.socialLinks?.instagram || 'https://instagram.com/caribebaseballacademy');
  const [youtube, setYoutube] = React.useState(academy.socialLinks?.youtube || 'https://youtube.com/@caribebaseballdo');
  const [twitter, setTwitter] = React.useState(academy.socialLinks?.twitter || 'https://x.com/caribebaseballdo');
  const [facebook, setFacebook] = React.useState(academy.socialLinks?.facebook || 'https://facebook.com/caribebaseballacademy');
  const [tiktok, setTiktok] = React.useState(academy.socialLinks?.tiktok || 'https://tiktok.com/@caribebaseball');
  const [linkedin, setLinkedin] = React.useState(academy.socialLinks?.linkedin || 'https://linkedin.com/company/caribe-baseball-academy');

  // Technical Specialties & Resources State
  const [selectedServices, setSelectedServices] = React.useState<string[]>(
    academy.technicalSpecialtiesAndResources || [
      'Diseño de Pitcheo',
      'Aumento de Exit Velocity',
      'Catcher Framing & Blocking',
      'Entrenamiento de Showcases',
      'Potencia Explosiva',
      'Cajas de Bateo',
      'HitTrax',
      'Sensores Blast',
      'Aumento de Velocidad',
      'Reconocimiento de Pitcheos',
      'Nutrición Deportiva Pro',
      'Psicología Deportiva',
      'Rapsodo',
      'Residencia',
      'Optimización de Launch Angle',
      'Infield Moderno',
      'Mecánica de Swings',
      'Gimnasio',
      'Cuidado de Brazo',
      'Biomecánica del Movimiento',
      'Campos Propios',
      'Trackman',
      'Análisis de Video',
    ]
  );

  // Structured Achievements State (CRUD)
  const [achievementsList, setAchievementsList] = React.useState<AcademyAchievement[]>(
    academy.achievementsList || DEFAULT_ACHIEVEMENTS
  );
  const [achievementFilterCategory, setAchievementFilterCategory] = React.useState<string>('all');
  const [achievementSearch, setAchievementSearch] = React.useState<string>('');

  // Achievement Modal / Form State
  const [isAchievementModalOpen, setIsAchievementModalOpen] = React.useState(false);
  const [editingAchievementId, setEditingAchievementId] = React.useState<string | null>(null);
  const [formYear, setFormYear] = React.useState<number>(new Date().getFullYear());
  const [formTitle, setFormTitle] = React.useState('');
  const [formCategory, setFormCategory] = React.useState<AcademyAchievement['category']>('Firma MLB');
  const [formDescription, setFormDescription] = React.useState('');
  const [formMetric, setFormMetric] = React.useState('');
  const [formVerified, setFormVerified] = React.useState(true);

  // Success Feedback
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  // ==========================================
  // ACCESS & AUTH SIMULATION STATE
  // ==========================================
  const [accessMethodTab, setAccessMethodTab] = React.useState<'otp' | 'sso' | 'policies'>('otp');
  const [otpEmail, setOtpEmail] = React.useState('director@caribebaseball.do');
  const [otpStep, setOtpStep] = React.useState<'input' | 'sent' | 'verified'>('input');
  const [generatedCode, setGeneratedCode] = React.useState('749216');
  const [enteredCode, setEnteredCode] = React.useState('');
  const [isSendingCode, setIsSendingCode] = React.useState(false);
  const [otpError, setOtpError] = React.useState<string | null>(null);

  // SSO State
  const [ssoStep, setSsoStep] = React.useState<'idle' | 'account_modal' | 'loading' | 'authenticated'>('idle');
  const [ssoSelectedAccount, setSsoSelectedAccount] = React.useState<string | null>(null);

  // Policy Toggles
  const [allowOtpEmail, setAllowOtpEmail] = React.useState(true);
  const [allowGoogleSso, setAllowGoogleSso] = React.useState(true);
  const [restrictToDomain, setRestrictToDomain] = React.useState(true);
  const [allowedDomain, setAllowedDomain] = React.useState('caribebaseball.do');
  const [accessLogs, setAccessLogs] = React.useState<AccessLog[]>(INITIAL_ACCESS_LOGS);

  // ==========================================
  // HANDLERS FOR ACHIEVEMENTS CRUD
  // ==========================================
  const handleOpenNewAchievementModal = () => {
    setEditingAchievementId(null);
    setFormYear(new Date().getFullYear());
    setFormTitle('');
    setFormCategory('Firma MLB');
    setFormDescription('');
    setFormMetric('');
    setFormVerified(true);
    setIsAchievementModalOpen(true);
  };

  const handleOpenEditAchievementModal = (ach: AcademyAchievement) => {
    setEditingAchievementId(ach.id);
    setFormYear(Number(ach.year) || new Date().getFullYear());
    setFormTitle(ach.title);
    setFormCategory(ach.category);
    setFormDescription(ach.description);
    setFormMetric(ach.metricOrBonus || '');
    setFormVerified(ach.verifiedByScout ?? true);
    setIsAchievementModalOpen(true);
  };

  const handleSaveAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingAchievementId) {
      setAchievementsList((prev) =>
        prev.map((ach) =>
          ach.id === editingAchievementId
            ? {
                ...ach,
                year: formYear,
                title: formTitle.trim(),
                category: formCategory,
                description: formDescription.trim(),
                metricOrBonus: formMetric.trim(),
                verifiedByScout: formVerified,
              }
            : ach
        )
      );
    } else {
      const newAch: AcademyAchievement = {
        id: `ach-${Date.now()}`,
        year: formYear,
        title: formTitle.trim(),
        category: formCategory,
        description: formDescription.trim(),
        metricOrBonus: formMetric.trim(),
        verifiedByScout: formVerified,
      };
      setAchievementsList((prev) => [newAch, ...prev]);
    }

    setIsAchievementModalOpen(false);
  };

  const handleDeleteAchievement = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este logro o palmarés de la academia?')) {
      setAchievementsList((prev) => prev.filter((ach) => ach.id !== id));
    }
  };

  const filteredAchievements = achievementsList.filter((ach) => {
    const matchesCategory =
      achievementFilterCategory === 'all' || ach.category === achievementFilterCategory;
    const matchesSearch =
      achievementSearch.trim() === '' ||
      ach.title.toLowerCase().includes(achievementSearch.toLowerCase()) ||
      ach.description.toLowerCase().includes(achievementSearch.toLowerCase()) ||
      (ach.metricOrBonus && ach.metricOrBonus.toLowerCase().includes(achievementSearch.toLowerCase())) ||
      ach.year.toString().includes(achievementSearch);
    return matchesCategory && matchesSearch;
  });

  // Handlers for OTP Simulation
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
      const newLog: AccessLog = {
        id: `log-${Date.now()}`,
        user: otpEmail,
        role: otpEmail.includes('director')
          ? 'Director General'
          : otpEmail.includes('staff') || otpEmail.includes('crosario')
          ? 'Entrenador / Staff'
          : 'Prospecto / Atleta',
        method: 'OTP Correo',
        ip: '190.166.45.12',
        location: 'Santo Domingo, DO',
        timestamp: 'Justo ahora',
        status: 'Exitoso',
      };
      setAccessLogs((prev) => [newLog, ...prev]);
    } else {
      setOtpError('El código ingresado no coincide con el código enviado. Intenta nuevamente.');
    }
  };

  const handleResetOtp = () => {
    setOtpStep('input');
    setEnteredCode('');
    setOtpError(null);
  };

  // Handlers for Google SSO Simulation
  const handleStartGoogleSso = () => {
    setSsoStep('account_modal');
  };

  const handleSelectGoogleAccount = (accountEmail: string) => {
    setSsoSelectedAccount(accountEmail);
    setSsoStep('loading');

    setTimeout(() => {
      const isAllowed =
        !restrictToDomain || accountEmail.endsWith(`@${allowedDomain}`) || accountEmail.includes('mlb.com');
      if (isAllowed) {
        setSsoStep('authenticated');
        const newLog: AccessLog = {
          id: `log-${Date.now()}`,
          user: accountEmail,
          role: accountEmail.includes('director') ? 'Director General' : 'Staff Autorizado',
          method: 'Google SSO',
          ip: '190.166.45.12',
          location: 'Santo Domingo, DO',
          timestamp: 'Justo ahora',
          status: 'Exitoso',
        };
        setAccessLogs((prev) => [newLog, ...prev]);
      } else {
        setSsoStep('idle');
        alert(`Acceso denegado: El correo ${accountEmail} no pertenece al dominio corporativo @${allowedDomain}`);
      }
    }, 900);
  };

  // Toggle individual service
  const handleToggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleSelectAll = () => {
    setSelectedServices([...ALL_TECHNICAL_SPECIALTIES_AND_RESOURCES]);
  };

  const handleDeselectAll = () => {
    setSelectedServices([]);
  };

  const handleSelectCategory = (categoryType: 'pitching' | 'hitting' | 'tech' | 'facility') => {
    let preset: string[] = [];
    if (categoryType === 'pitching') {
      preset = ['Diseño de Pitcheo', 'Aumento de Velocidad', 'Cuidado de Brazo', 'Biomecánica del Movimiento', 'Trackman', 'Rapsodo', 'Radares de Velocidad'];
    } else if (categoryType === 'hitting') {
      preset = ['Aumento de Exit Velocity', 'Optimización de Launch Angle', 'Mecánica de Swings', 'HitTrax', 'Sensores Blast', 'Cajas de Bateo', 'Reconocimiento de Pitcheos'];
    } else if (categoryType === 'tech') {
      preset = ['Trackman', 'Rapsodo', 'HitTrax', 'Sensores Blast', 'Radares de Velocidad', 'Análisis de Video'];
    } else if (categoryType === 'facility') {
      preset = ['Campos Propios', 'Gimnasio', 'Cajas de Bateo', 'Residencia', 'Fisioterapia Deportiva'];
    }

    setSelectedServices((prev) => Array.from(new Set([...prev, ...preset])));
  };

  // Save all changes to the profile
  const handleSaveAcademy = (e: React.FormEvent) => {
    e.preventDefault();

    const socialLinks: AcademySocialLinks = {
      website: websiteUrl,
      instagram,
      youtube,
      twitter,
      facebook,
      tiktok,
      linkedin,
    };

    const synthesizedAchievements = achievementsList
      .map((a) => `[${a.year}] ${a.title}: ${a.description}${a.metricOrBonus ? ` (${a.metricOrBonus})` : ''}`)
      .join(' | ');

    const updated: AcademyProfile = {
      ...academy,
      name: academyName,
      tagline,
      directorName,
      directorPhone: phone,
      directorEmail: email,
      city,
      country,
      establishedYear: Number(establishedYear),
      websiteUrl,
      socialLinks,
      technicalSpecialtiesAndResources: selectedServices,
      achievementsList,
      highlightedAchievements: synthesizedAchievements,
    };

    onUpdateAcademy(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getCategoryBadgeClass = (category: AcademyAchievement['category']) => {
    switch (category) {
      case 'Firma MLB':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Torneo / Campeonato':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Alianza Académica D1':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Certificación Internacional':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Hito Institucional':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="settings-academy-profile-container" className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-xs border border-blue-100">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Perfil y Suscripción
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Configura los servicios, palmarés de logros, sitio web, redes sociales, accesos (OTP/SSO) y plan institucional
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Ver Web Oficial</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}

          {onNavigateToCoaches && (
            <button
              type="button"
              onClick={onNavigateToCoaches}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4 text-slate-600" />
              <span>Staff ({academy.staffList?.length || 4})</span>
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
            <span>¡Los cambios en el perfil de la academia (servicios, logros y redes) fueron guardados exitosamente!</span>
          </div>
          <span className="text-[10px] bg-emerald-600/60 px-2 py-0.5 rounded-full uppercase font-black">
            Actualizado en Vivo
          </span>
        </div>
      )}

      {/* 2. Main Tabbed Form Container */}
      <form onSubmit={handleSaveAcademy} className="space-y-6">
        {/* Navigation Tabs between Sections */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTabSection('services')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTabSection === 'services'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Especialidades & Recursos ({selectedServices.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection('achievements')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTabSection === 'achievements'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Logros & Palmarés ({achievementsList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection('institutional')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTabSection === 'institutional'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Datos Institucionales & Redes</span>
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

          <button
            type="button"
            onClick={() => setActiveTabSection('subscription')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTabSection === 'subscription'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Suscripción & Licencias</span>
          </button>
        </div>

        {/* SECTION A: ESPECIALIDADES TÉCNICAS Y RECURSOS */}
        {activeTabSection === 'services' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>Especialidades Técnicas y Recursos</span>
                  <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-100">
                    {selectedServices.length} de {ALL_TECHNICAL_SPECIALTIES_AND_RESOURCES.length} Seleccionados
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Marca todos los servicios que tu academia tiene disponibles para que los scouts puedan filtrarte con precisión.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSelectCategory('pitching')}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition-all cursor-pointer"
                >
                  + Pitcheo
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCategory('hitting')}
                  className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold transition-all cursor-pointer"
                >
                  + Bateo
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCategory('tech')}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition-all cursor-pointer"
                >
                  + Tecnología
                </button>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-all cursor-pointer"
                >
                  Marcar Todos
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 text-[11px] font-bold transition-all cursor-pointer"
                >
                  Limpiar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-2">
              <div className="space-y-2.5">
                {COLUMN_1_SERVICES.map((service) => {
                  const isChecked = selectedServices.includes(service);
                  return (
                    <label
                      key={service}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                        isChecked
                          ? 'bg-blue-50/70 border-blue-200 text-blue-950 font-bold shadow-2xs'
                          : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleService(service)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                      />
                      <span className="text-xs">{service}</span>
                    </label>
                  );
                })}
              </div>

              <div className="space-y-2.5">
                {COLUMN_2_SERVICES.map((service) => {
                  const isChecked = selectedServices.includes(service);
                  return (
                    <label
                      key={service}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                        isChecked
                          ? 'bg-blue-50/70 border-blue-200 text-blue-950 font-bold shadow-2xs'
                          : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleService(service)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                      />
                      <span className="text-xs">{service}</span>
                    </label>
                  );
                })}
              </div>

              <div className="space-y-2.5">
                {COLUMN_3_SERVICES.map((service) => {
                  const isChecked = selectedServices.includes(service);
                  return (
                    <label
                      key={service}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                        isChecked
                          ? 'bg-blue-50/70 border-blue-200 text-blue-950 font-bold shadow-2xs'
                          : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleService(service)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                      />
                      <span className="text-xs">{service}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-amber-950">
                    Palmarés de Logros & Firmas MLB ({achievementsList.length} registrados)
                  </p>
                  <p className="text-[11px] text-amber-800">
                    Gestiona los trofeos, convenios D1 y contratos de tus prospectos en la pestaña dedicada.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTabSection('achievements')}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Ver Tabla de Logros</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION B: LOGROS & PALMARÉS (STRUCTURED CRUD TABLE) */}
        {activeTabSection === 'achievements' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-black text-slate-900">{achievementsList.length}</p>
                  <p className="text-[11px] text-slate-500 font-medium">Total de Logros</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-black text-slate-900">
                    {achievementsList.filter((a) => a.category === 'Firma MLB').length}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">Hitos de Firmas MLB</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Medal className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-black text-slate-900">
                    {achievementsList.filter((a) => a.category === 'Torneo / Campeonato').length}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">Campeonatos Ganados</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <GraduationCapIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-black text-slate-900">
                    {achievementsList.filter((a) => a.category === 'Alianza Académica D1').length}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">Alianzas D1 / Becas</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span>Gestión de Logros, Campeonatos y Firmas de la Academia</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Registra, modifica o elimina los hitos históricos visibles en el Scout Book y perfil público.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenNewAchievementModal}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Registrar Nuevo Logro</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setAchievementFilterCategory('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      achievementFilterCategory === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Todos ({achievementsList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAchievementFilterCategory('Firma MLB')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      achievementFilterCategory === 'Firma MLB'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    Firmas MLB
                  </button>
                  <button
                    type="button"
                    onClick={() => setAchievementFilterCategory('Torneo / Campeonato')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      achievementFilterCategory === 'Torneo / Campeonato'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    Torneos
                  </button>
                  <button
                    type="button"
                    onClick={() => setAchievementFilterCategory('Alianza Académica D1')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      achievementFilterCategory === 'Alianza Académica D1'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    Alianzas D1
                  </button>
                  <button
                    type="button"
                    onClick={() => setAchievementFilterCategory('Certificación Internacional')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      achievementFilterCategory === 'Certificación Internacional'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    Certificaciones
                  </button>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={achievementSearch}
                    onChange={(e) => setAchievementSearch(e.target.value)}
                    placeholder="Buscar por año, título o bono..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 border-b border-slate-200">
                      <th className="py-3 px-4 w-20">Año</th>
                      <th className="py-3 px-4 w-36">Categoría</th>
                      <th className="py-3 px-4">Título & Descripción</th>
                      <th className="py-3 px-4 w-44">Métrica / Bono</th>
                      <th className="py-3 px-4 w-28 text-center">Verificado</th>
                      <th className="py-3 px-4 w-24 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAchievements.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No se encontraron logros con los filtros seleccionados.
                        </td>
                      </tr>
                    ) : (
                      filteredAchievements.map((ach) => (
                        <tr key={ach.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                            {ach.year}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getCategoryBadgeClass(
                                ach.category
                              )}`}
                            >
                              {ach.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 space-y-0.5">
                            <p className="font-bold text-slate-900 text-xs">{ach.title}</p>
                            <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
                              {ach.description}
                            </p>
                          </td>
                          <td className="py-3.5 px-4">
                            {ach.metricOrBonus ? (
                              <span className="px-2 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold inline-block">
                                {ach.metricOrBonus}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px] italic">—</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {ach.verifiedByScout ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                MLB Validado
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400">Pendiente</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditAchievementModal(ach)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                                title="Editar logro"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAchievement(ach.id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                                title="Eliminar logro"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal de Logro */}
            {isAchievementModalOpen && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-black text-slate-900">
                        {editingAchievementId ? 'Modificar Logro / Palmarés' : 'Registrar Nuevo Logro'}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAchievementModalOpen(false)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Año del Hito</label>
                        <input
                          type="number"
                          value={formYear}
                          onChange={(e) => setFormYear(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Categoría</label>
                        <select
                          value={formCategory}
                          onChange={(e) =>
                            setFormCategory(e.target.value as AcademyAchievement['category'])
                          }
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white cursor-pointer"
                        >
                          <option value="Firma MLB">Firma MLB</option>
                          <option value="Torneo / Campeonato">Torneo / Campeonato</option>
                          <option value="Alianza Académica D1">Alianza Académica D1</option>
                          <option value="Certificación Internacional">Certificación Internacional</option>
                          <option value="Hito Institucional">Hito Institucional</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Título del Logro</label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Ej: Campeones Nacionales Sub-17 / Firma de 5 Prospectos"
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        Métrica Clave / Monto de Bono (Opcional)
                      </label>
                      <input
                        type="text"
                        value={formMetric}
                        onChange={(e) => setFormMetric(e.target.value)}
                        placeholder="Ej: $3.2M en Bonos / Medalla de Oro / 12 Becas D1"
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Descripción & Detalles</label>
                      <textarea
                        rows={3}
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Explica el contexto, equipos involucrados o impacto del logro..."
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white resize-none"
                      />
                    </div>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formVerified}
                        onChange={(e) => setFormVerified(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <span className="text-xs font-semibold text-slate-800">
                        Marcar como verificado con reporte oficial de scout / prensa
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAchievementModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAchievement}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                    >
                      {editingAchievementId ? 'Guardar Cambios' : 'Añadir Logro'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION C: DATOS INSTITUCIONALES & REDES SOCIALES */}
        {activeTabSection === 'institutional' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    Información Institucional y Representante
                  </h2>
                  <p className="text-xs text-slate-500">Datos legales y de contacto oficial de la academia</p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  {country}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Nombre Oficial de la Academia</label>
                  <input
                    type="text"
                    value={academyName}
                    onChange={(e) => setAcademyName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Año de Fundación</label>
                  <input
                    type="number"
                    value={establishedYear}
                    onChange={(e) => setEstablishedYear(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Lema / Misión Institucional</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Director General / Representante</label>
                  <input
                    type="text"
                    value={directorName}
                    onChange={(e) => setDirectorName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Correo Electrónico Oficial</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Teléfono / WhatsApp Corporativo</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Ciudad / Sede Principal</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700">País</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span>Sitio Web & Redes Sociales Oficiales</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Permite a los scouts, familias y patrocinadores conocer la presencia digital de tu academia
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Visible en Scout Book
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>Página Web Oficial (URL)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://www.tuacademia.com"
                    className="flex-1 p-2.5 rounded-xl bg-white border border-blue-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                  {websiteUrl && (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Probar</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center">
                      <Instagram className="w-3.5 h-3.5" />
                    </span>
                    <span>Instagram Oficial</span>
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/tuacademia"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-red-600 text-white flex items-center justify-center">
                      <Youtube className="w-3.5 h-3.5" />
                    </span>
                    <span>Canal de YouTube (Videos & Bullpens)</span>
                  </label>
                  <input
                    type="text"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="https://youtube.com/@tuacademia"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">
                      𝕏
                    </span>
                    <span>Cuenta X (Twitter)</span>
                  </label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://x.com/tuacademia"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      f
                    </span>
                    <span>Página de Facebook</span>
                  </label>
                  <input
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="https://facebook.com/tuacademia"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-black text-white flex items-center justify-center text-xs font-bold">
                      🎵
                    </span>
                    <span>TikTok (Clips Cortos & Highlights)</span>
                  </label>
                  <input
                    type="text"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    placeholder="https://tiktok.com/@tuacademia"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-blue-700 text-white flex items-center justify-center">
                      <Linkedin className="w-3.5 h-3.5" />
                    </span>
                    <span>LinkedIn Institucional</span>
                  </label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/company/tuacademia"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION D: ACCESO & AUTENTICACIÓN (OTP / GOOGLE SSO) */}
        {activeTabSection === 'access' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span>Control de Acceso a la Plataforma & Seguridad</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Simula y gestiona cómo los directores, entrenadores y scouts ingresan a Glovall (Código OTP o Google SSO).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    MFA Habilitado
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAccessMethodTab('otp')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    accessMethodTab === 'otp'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Simulador Código OTP (Correo)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAccessMethodTab('sso')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    accessMethodTab === 'sso'
                      ? 'bg-red-50 text-red-700 border border-red-200 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 6.3 10.1 6.3z"
                    />
                  </svg>
                  <span>Simulador Google SSO</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAccessMethodTab('policies')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    accessMethodTab === 'policies'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Políticas Institucionales</span>
                </button>
              </div>
            </div>

            {/* Interactive Simulator: OTP */}
            {accessMethodTab === 'otp' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900">
                          Acceso Passwordless: Código por Correo
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          El usuario no necesita recordar contraseñas. Recibe un token OTP de 6 dígitos.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetOtp}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all text-xs flex items-center gap-1 cursor-pointer"
                      title="Reiniciar simulador"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reiniciar</span>
                    </button>
                  </div>

                  {otpStep === 'input' && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Correo Institucional o de Scout
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            value={otpEmail}
                            onChange={(e) => setOtpEmail(e.target.value)}
                            placeholder="ejemplo@caribebaseball.do"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Probar como:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setOtpEmail('director@caribebaseball.do')}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold transition-all cursor-pointer"
                          >
                            Director (Admin)
                          </button>
                          <button
                            type="button"
                            onClick={() => setOtpEmail('crosario@caribebaseball.do')}
                            className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-semibold transition-all cursor-pointer"
                          >
                            Carlos Rosario (Staff)
                          </button>
                          <button
                            type="button"
                            onClick={() => setOtpEmail('scout.evaluator@mlb.com')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold transition-all cursor-pointer"
                          >
                            Scout MLB
                          </button>
                        </div>
                      </div>

                      {otpError && (
                        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{otpError}</span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingCode}
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isSendingCode ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Despachando Código Seguro...</span>
                          </>
                        ) : (
                          <>
                            <span>Enviar Código de 6 Dígitos</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {otpStep === 'sent' && (
                    <div className="space-y-5 animate-in fade-in">
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200/80 px-2 py-0.5 rounded-full text-amber-900">
                            Simulación de Bandeja de Entrada 📩
                          </span>
                          <span className="text-[10px] text-amber-700">Enviado a {otpEmail}</span>
                        </div>
                        <p className="text-xs">
                          Tu código de verificación de <strong>Caribe Baseball Academy</strong> es:
                        </p>
                        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-amber-300/60">
                          <span className="text-lg font-black tracking-widest text-slate-900 font-mono">
                            {generatedCode}
                          </span>
                          <button
                            type="button"
                            onClick={() => setEnteredCode(generatedCode)}
                            className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Pegar Código</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-700 block text-center">
                          Ingresa el código recibido:
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={enteredCode}
                          onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="______"
                          className="w-48 mx-auto block text-center text-2xl font-black tracking-widest py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 font-mono"
                        />

                        {otpError && (
                          <p className="text-xs text-red-600 text-center font-semibold">{otpError}</p>
                        )}

                        <div className="flex items-center justify-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            <span>Verificar & Acceder</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {otpStep === 'verified' && (
                    <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in zoom-in-95">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-black text-emerald-950">
                        ¡Autenticación OTP Exitosa!
                      </h4>
                      <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                        El usuario <strong>{otpEmail}</strong> ha validado su sesión con token seguro de un solo uso.
                      </p>
                      <button
                        type="button"
                        onClick={handleResetOtp}
                        className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-all cursor-pointer inline-flex items-center gap-1.5 mt-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Simular Nuevo Acceso</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800 space-y-4">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-wider">
                        Ventajas de Acceso por Código OTP
                      </span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Cero contraseñas olvidadas</strong>: Los entrenadores acceden al instante.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Tokens efímeros</strong> con expiración de 10 minutos.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Detección automática de RBAC</strong> según el rol.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Simulator: Google SSO */}
            {accessMethodTab === 'sso' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="#EA4335"
                            d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                          />
                          <path
                            fill="#4285F4"
                            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 6.3 10.1 6.3z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900">
                          Single Sign-On (SSO) con Google Workspace
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Inicio de sesión corporativo en 1 clic utilizando cuentas @{allowedDomain}
                        </p>
                      </div>
                    </div>
                  </div>

                  {ssoStep === 'idle' && (
                    <div className="text-center py-6 space-y-4">
                      <p className="text-xs text-slate-600 max-w-md mx-auto">
                        Haz clic en el botón inferior para simular el flujo federado de Google Identity Services (GSI) con validación de dominio corporativo.
                      </p>

                      <button
                        type="button"
                        onClick={handleStartGoogleSso}
                        className="mx-auto px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#EA4335"
                            d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                          />
                          <path
                            fill="#4285F4"
                            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 6.3 10.1 6.3z"
                          />
                        </svg>
                        <span>Continuar con Google Workspace</span>
                      </button>
                    </div>
                  )}

                  {ssoStep === 'account_modal' && (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs font-bold text-slate-800">Elige una cuenta de Google</span>
                        <span className="text-[10px] text-slate-500 font-mono">accounts.google.com</span>
                      </div>

                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => handleSelectGoogleAccount(`director@${allowedDomain}`)}
                          className="w-full p-3 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 text-left flex items-center justify-between transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                              D
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">Director General</p>
                              <p className="text-[11px] text-slate-500">director@{allowedDomain}</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Dominio Válido
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSelectGoogleAccount(`crosario@${allowedDomain}`)}
                          className="w-full p-3 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 text-left flex items-center justify-between transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                              CR
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">Carlos Rosario (Coach)</p>
                              <p className="text-[11px] text-slate-500">crosario@{allowedDomain}</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Dominio Válido
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {ssoStep === 'loading' && (
                    <div className="py-8 text-center space-y-3">
                      <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                      <p className="text-xs text-slate-600 font-bold">
                        Validando token OpenID Connect con Google Identity...
                      </p>
                    </div>
                  )}

                  {ssoStep === 'authenticated' && (
                    <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in zoom-in-95">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-black text-emerald-950">
                        ¡SSO con Google Verificado!
                      </h4>
                      <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                        Acceso concedido mediante Google Workspace OAuth para <strong>{ssoSelectedAccount}</strong>.
                      </p>
                      <button
                        type="button"
                        onClick={() => setSsoStep('idle')}
                        className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-all cursor-pointer inline-flex items-center gap-1.5 mt-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Simular Nuevo SSO</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Parámetros SSO
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-500 text-[11px] block">Dominio Permitido:</span>
                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                          @{allowedDomain}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Policies Tab */}
            {accessMethodTab === 'policies' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 space-y-6">
                <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
                  Políticas de Seguridad & Acceso de la Academia
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-900">
                        Permitir Acceso por Código al Correo (OTP)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Tokens numéricos temporales sin contraseñas fijas.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowOtpEmail}
                        onChange={(e) => setAllowOtpEmail(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-900">
                        Permitir Google Single Sign-On (SSO)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Autenticación corporativa con Google Workspace.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowGoogleSso}
                        onChange={(e) => setAllowGoogleSso(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Audit Log Table */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Bitácora de Accesos Recientes a la Academia
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-bold">Últimas 24 horas</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                      <th className="py-2 px-3">Usuario</th>
                      <th className="py-2 px-3">Rol</th>
                      <th className="py-2 px-3">Método</th>
                      <th className="py-2 px-3">Ubicación / IP</th>
                      <th className="py-2 px-3">Fecha y Hora</th>
                      <th className="py-2 px-3 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {accessLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{log.user}</td>
                        <td className="py-2.5 px-3 text-slate-600">{log.role}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {log.method}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                          {log.location} <span className="text-slate-400">({log.ip})</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 text-[11px]">{log.timestamp}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              log.status === 'Exitoso'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION E: SUSCRIPCIÓN & LICENCIAS (FULL SIMULATOR) */}
        {activeTabSection === 'subscription' && (
          <SubscriptionManagementTab
            academy={academy}
            players={players}
            onUpdateAcademy={onUpdateAcademy}
          />
        )}

        {/* 3. Footer Save Actions (Always visible) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Los cambios de perfil, redes y logros se sincronizan en tiempo real en la ficha pública.</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-black text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cambios del Perfil</span>
          </button>
        </div>
      </form>
    </div>
  );
};

// Helper SVG Icon component for Graduation Cap
function GraduationCapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  );
}
