import React, { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  FileCheck,
  FileText,
  Flag,
  Globe,
  Heart,
  Home,
  Info,
  Languages,
  Lock,
  MapPin,
  Music,
  Phone,
  Play,
  Plus,
  Save,
  Shield,
  ShieldCheck,
  Sparkles,
  Trash2,
  Tv,
  User,
  UserCheck,
  Users,
  Utensils,
  Video,
  X,
} from 'lucide-react';
import {
  EligibleTeamRecord,
  ParentInfo,
  PassportRecord,
  Player,
  PlayerFamilyEligibility,
  TutorConsentVideoRecord,
  UserRole,
} from '../../types';

interface FamilyEligibilityTabProps {
  player: Player;
  onUpdatePlayer: (updated: Player) => void;
  activeRole?: UserRole;
}

export const FamilyEligibilityTab: React.FC<FamilyEligibilityTabProps> = ({
  player,
  onUpdatePlayer,
  activeRole,
}) => {
  const canDeleteHistory = activeRole !== 'admin' && activeRole !== 'scout';
  // Default values if familyAndEligibility is empty
  const defaultConsentVideo: TutorConsentVideoRecord = {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80',
    tutorName: player.familyAndEligibility?.father?.fullName || 'José Manuel Valdez Santana',
    tutorRelationship: 'Padre',
    tutorIdDocument: player.familyAndEligibility?.father?.idDocumentNumber || '023-0098412-4',
    recordedDate: '2026-06-14',
    durationFormatted: '1:45 min',
    notaryOrLawyerName: 'Lic. Fernando Taveras (Notaría Pública Distrito Nacional)',
    statementSummary:
      'Declaración jurada en video: consentimiento expreso de patria potestad, representación ante MLB y autorización para entrenamientos, competencias y trámites consulares.',
    status: 'verificado',
    documentSignedAttached: true,
  };

  const defaultFamily: PlayerFamilyEligibility = player.familyAndEligibility || {
    birthCity: player.hometown.split(',')[0] || 'San Pedro de Macorís',
    birthCountry: player.nationality || 'República Dominicana',
    birthHospitalOrRegistry: 'Registro Civil Oficial',
    currentResidenceAddress: 'Sector Centro',
    currentResidenceCity: player.hometown.split(',')[0] || 'San Pedro de Macorís',
    currentResidenceCountry: 'República Dominicana',
    personalInterestsAndHobbies: [
      'Ajedrez y concentración estratégica',
      'Música instrumental y producción',
      'Videojuegos de deportes y estrategia',
    ],
    languagesSpoken: ['Español (Nativo)', 'Inglés (Intermedio B1)'],
    offFieldAspirations: 'Negocios Deportivos y Gestión Administrativa',
    favoriteMusicGenre: 'Música latina / Instrumental',
    favoriteFoods: 'Comida típica caribeña y dieta balanceada para atletas',
    roleModelOutsideBaseball: 'Sus padres y mentores comunitarios',
    father: {
      fullName: 'José Manuel Valdez Santana',
      relationship: 'Padre',
      nationality: 'República Dominicana',
      birthPlace: 'San Pedro de Macorís, República Dominicana',
      currentResidence: 'San Pedro de Macorís, RD',
      occupation: 'Ingeniero Mecánico / Técnico Industrial',
      phone: '+1 (829) 555-4102',
      hasPassport: true,
      passportCountry: 'República Dominicana',
      idDocumentNumber: '023-0098412-4',
    },
    mother: {
      fullName: 'Elena Maritza Morales de Valdez',
      relationship: 'Madre',
      nationality: 'República Dominicana / Ascendencia Venezolana',
      birthPlace: 'Maracaibo, Estado Zulia, Venezuela',
      currentResidence: 'San Pedro de Macorís, RD',
      occupation: 'Licenciada en Educación',
      phone: '+1 (829) 555-7731',
      hasPassport: true,
      passportCountry: 'República Dominicana / Pasaporte Venezolano',
      idDocumentNumber: '023-0145298-1',
    },
    legalGuardianSameAsParent: true,
    tutorConsentVideo: defaultConsentVideo,
    eligibleNationalTeams: [
      {
        id: 'team-1',
        country: 'República Dominicana',
        flagEmoji: '🇩🇴',
        basis: 'Nacimiento',
        status: 'confirmado',
        federationCode: 'FEDOBE / WBSC-DOM',
        notes: 'Elegible por nacimiento y padre dominicano.',
      },
      {
        id: 'team-2',
        country: 'Venezuela',
        flagEmoji: '🇻🇪',
        basis: 'Madre',
        status: 'apto',
        federationCode: 'FEVEBEISBOL / WBSC-VEN',
        notes: 'Elegible por línea sanguínea materna (madre nacida en Maracaibo, Venezuela).',
      },
    ],
    passportsAvailable: [
      {
        id: 'pass-1',
        country: 'República Dominicana',
        passportNumberMasked: 'DO-RD948210',
        expirationDate: '2031-04-15',
        hasUsVisa: true,
        visaType: 'B1/B2 Turista & Atleta (Válida)',
      },
    ],
  };

  const familyData = player.familyAndEligibility || defaultFamily;
  const consentVideo = familyData.tutorConsentVideo || defaultConsentVideo;

  // Video Modals State
  const [showVideoPlayerModal, setShowVideoPlayerModal] = useState(false);
  const [showConsentVideoEditModal, setShowConsentVideoEditModal] = useState(false);

  // Consent Video Form State
  const [formVideoUrl, setFormVideoUrl] = useState(consentVideo.videoUrl);
  const [formVideoThumb, setFormVideoThumb] = useState(consentVideo.thumbnailUrl || '');
  const [formTutorName, setFormTutorName] = useState(consentVideo.tutorName);
  const [formTutorRelationship, setFormTutorRelationship] = useState<
    'Padre' | 'Madre' | 'Tutor Legal Certificado'
  >(consentVideo.tutorRelationship);
  const [formTutorIdDoc, setFormTutorIdDoc] = useState(consentVideo.tutorIdDocument);
  const [formRecordedDate, setFormRecordedDate] = useState(consentVideo.recordedDate);
  const [formDuration, setFormDuration] = useState(consentVideo.durationFormatted || '1:45 min');
  const [formNotary, setFormNotary] = useState(consentVideo.notaryOrLawyerName || '');
  const [formSummary, setFormSummary] = useState(consentVideo.statementSummary);
  const [formVideoStatus, setFormVideoStatus] = useState<'verificado' | 'en_revision' | 'pendiente'>(
    consentVideo.status
  );

  // Modal: Edit Personal Profile & Hobbies
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [birthCity, setBirthCity] = useState(familyData.birthCity);
  const [birthCountry, setBirthCountry] = useState(familyData.birthCountry);
  const [birthHospital, setBirthHospital] = useState(familyData.birthHospitalOrRegistry || '');
  const [resAddress, setResAddress] = useState(familyData.currentResidenceAddress);
  const [resCity, setResCity] = useState(familyData.currentResidenceCity);
  const [resCountry, setResCountry] = useState(familyData.currentResidenceCountry);
  const [hobbies, setHobbies] = useState(familyData.personalInterestsAndHobbies.join(', '));
  const [languages, setLanguages] = useState(familyData.languagesSpoken.join(', '));
  const [aspirations, setAspirations] = useState(familyData.offFieldAspirations || '');
  const [musicGenre, setMusicGenre] = useState(familyData.favoriteMusicGenre || '');
  const [foods, setFoods] = useState(familyData.favoriteFoods || '');
  const [roleModel, setRoleModel] = useState(familyData.roleModelOutsideBaseball || '');

  // Modal: Edit Parents Info
  const [showParentsModal, setShowParentsModal] = useState(false);
  // Father fields
  const [fatherName, setFatherName] = useState(familyData.father.fullName);
  const [fatherNat, setFatherNat] = useState(familyData.father.nationality);
  const [fatherBirth, setFatherBirth] = useState(familyData.father.birthPlace);
  const [fatherOcc, setFatherOcc] = useState(familyData.father.occupation || '');
  const [fatherPhone, setFatherPhone] = useState(familyData.father.phone || '');
  const [fatherPassport, setFatherPassport] = useState(familyData.father.hasPassport);
  const [fatherDoc, setFatherDoc] = useState(familyData.father.idDocumentNumber || '');
  // Mother fields
  const [motherName, setMotherName] = useState(familyData.mother.fullName);
  const [motherNat, setMotherNat] = useState(familyData.mother.nationality);
  const [motherBirth, setMotherBirth] = useState(familyData.mother.birthPlace);
  const [motherOcc, setMotherOcc] = useState(familyData.mother.occupation || '');
  const [motherPhone, setMotherPhone] = useState(familyData.mother.phone || '');
  const [motherPassport, setMotherPassport] = useState(familyData.mother.hasPassport);
  const [motherDoc, setMotherDoc] = useState(familyData.mother.idDocumentNumber || '');

  // Modal: National Teams Eligibility
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [teamCountry, setTeamCountry] = useState('');
  const [teamFlag, setTeamFlag] = useState('🇩🇴');
  const [teamBasis, setTeamBasis] = useState<
    'Nacimiento' | 'Padre' | 'Madre' | 'Residencia (+5 años)' | 'Doble Nacionalidad'
  >('Nacimiento');
  const [teamStatus, setTeamStatus] = useState<'confirmado' | 'en_tramite' | 'apto'>('confirmado');
  const [teamFedCode, setTeamFedCode] = useState('');
  const [teamNotes, setTeamNotes] = useState('');

  const handleSavePersonalProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFamily: PlayerFamilyEligibility = {
      ...familyData,
      birthCity,
      birthCountry,
      birthHospitalOrRegistry: birthHospital,
      currentResidenceAddress: resAddress,
      currentResidenceCity: resCity,
      currentResidenceCountry: resCountry,
      personalInterestsAndHobbies: hobbies
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      languagesSpoken: languages
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      offFieldAspirations: aspirations,
      favoriteMusicGenre: musicGenre,
      favoriteFoods: foods,
      roleModelOutsideBaseball: roleModel,
    };

    onUpdatePlayer({
      ...player,
      familyAndEligibility: updatedFamily,
    });
    setShowPersonalModal(false);
  };

  const handleSaveParents = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFather: ParentInfo = {
      fullName: fatherName,
      relationship: 'Padre',
      nationality: fatherNat,
      birthPlace: fatherBirth,
      occupation: fatherOcc,
      phone: fatherPhone,
      hasPassport: fatherPassport,
      idDocumentNumber: fatherDoc,
    };

    const updatedMother: ParentInfo = {
      fullName: motherName,
      relationship: 'Madre',
      nationality: motherNat,
      birthPlace: motherBirth,
      occupation: motherOcc,
      phone: motherPhone,
      hasPassport: motherPassport,
      idDocumentNumber: motherDoc,
    };

    const updatedFamily: PlayerFamilyEligibility = {
      ...familyData,
      father: updatedFather,
      mother: updatedMother,
    };

    onUpdatePlayer({
      ...player,
      familyAndEligibility: updatedFamily,
    });
    setShowParentsModal(false);
  };

  const handleSaveConsentVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedVideo: TutorConsentVideoRecord = {
      videoUrl: formVideoUrl,
      thumbnailUrl: formVideoThumb || undefined,
      tutorName: formTutorName,
      tutorRelationship: formTutorRelationship,
      tutorIdDocument: formTutorIdDoc,
      recordedDate: formRecordedDate,
      durationFormatted: formDuration,
      notaryOrLawyerName: formNotary || undefined,
      statementSummary: formSummary,
      status: formVideoStatus,
      documentSignedAttached: true,
    };

    const updatedFamily: PlayerFamilyEligibility = {
      ...familyData,
      tutorConsentVideo: updatedVideo,
    };

    onUpdatePlayer({
      ...player,
      tutorConsentVideoUploaded: formVideoStatus === 'verificado',
      tutorDocumentVerified: true,
      familyAndEligibility: updatedFamily,
    });
    setShowConsentVideoEditModal(false);
  };

  const handleOpenTeamModal = (record?: EligibleTeamRecord) => {
    if (record) {
      setEditingTeamId(record.id);
      setTeamCountry(record.country);
      setTeamFlag(record.flagEmoji || '🇩🇴');
      setTeamBasis(record.basis);
      setTeamStatus(record.status);
      setTeamFedCode(record.federationCode || '');
      setTeamNotes(record.notes || '');
    } else {
      setEditingTeamId(null);
      setTeamCountry('');
      setTeamFlag('🇩🇴');
      setTeamBasis('Nacimiento');
      setTeamStatus('confirmado');
      setTeamFedCode('');
      setTeamNotes('');
    }
    setShowTeamModal(true);
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    const currentTeams = familyData.eligibleNationalTeams || [];
    let updatedTeams: EligibleTeamRecord[];

    if (editingTeamId) {
      updatedTeams = currentTeams.map((t) =>
        t.id === editingTeamId
          ? {
              ...t,
              country: teamCountry,
              flagEmoji: teamFlag,
              basis: teamBasis,
              status: teamStatus,
              federationCode: teamFedCode || undefined,
              notes: teamNotes || undefined,
            }
          : t
      );
    } else {
      const newTeam: EligibleTeamRecord = {
        id: `team-${Date.now()}`,
        country: teamCountry,
        flagEmoji: teamFlag,
        basis: teamBasis,
        status: teamStatus,
        federationCode: teamFedCode || undefined,
        notes: teamNotes || undefined,
      };
      updatedTeams = [...currentTeams, newTeam];
    }

    onUpdatePlayer({
      ...player,
      familyAndEligibility: {
        ...familyData,
        eligibleNationalTeams: updatedTeams,
      },
    });
    setShowTeamModal(false);
  };

  const handleDeleteTeam = (id: string) => {
    if (confirm('¿Confirmas que deseas eliminar esta selección nacional elegible?')) {
      const updatedTeams = (familyData.eligibleNationalTeams || []).filter((t) => t.id !== id);
      onUpdatePlayer({
        ...player,
        familyAndEligibility: {
          ...familyData,
          eligibleNationalTeams: updatedTeams,
        },
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* SECTION 1: DATOS DEL PADRE Y DE LA MADRE (EXECUTIVE TABLE & CONSENT VIDEO) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
          <div>
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Datos Genealógicos de los Padres & Origen
            </h4>
            <p className="text-xs text-slate-500">
              Información de nacimiento, nacionalidad, residencia y consentimiento legal de los progenitores
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setFormVideoUrl(consentVideo.videoUrl);
                setFormVideoThumb(consentVideo.thumbnailUrl || '');
                setFormTutorName(consentVideo.tutorName);
                setFormTutorRelationship(consentVideo.tutorRelationship);
                setFormTutorIdDoc(consentVideo.tutorIdDocument);
                setFormRecordedDate(consentVideo.recordedDate);
                setFormDuration(consentVideo.durationFormatted || '1:45 min');
                setFormNotary(consentVideo.notaryOrLawyerName || '');
                setFormSummary(consentVideo.statementSummary);
                setFormVideoStatus(consentVideo.status);
                setShowConsentVideoEditModal(true);
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-blue-600" />
              <span>Gestionar Video Tutor</span>
            </button>

            <button
              onClick={() => {
                setFatherName(familyData.father.fullName);
                setFatherNat(familyData.father.nationality);
                setFatherBirth(familyData.father.birthPlace);
                setFatherOcc(familyData.father.occupation || '');
                setFatherPhone(familyData.father.phone || '');
                setFatherPassport(familyData.father.hasPassport);
                setFatherDoc(familyData.father.idDocumentNumber || '');

                setMotherName(familyData.mother.fullName);
                setMotherNat(familyData.mother.nationality);
                setMotherBirth(familyData.mother.birthPlace);
                setMotherOcc(familyData.mother.occupation || '');
                setMotherPhone(familyData.mother.phone || '');
                setMotherPassport(familyData.mother.hasPassport);
                setMotherDoc(familyData.mother.idDocumentNumber || '');

                setShowParentsModal(true);
              }}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Editar Padres
            </button>
          </div>
        </div>

        {/* Executive Table of Parents */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Parentesco</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Nombre Completo</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Lugar de Nacimiento (Origen)</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Nacionalidad</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Residencia Actual</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Ocupación</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Contacto / Pasaporte</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Father Row */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-black text-indigo-700">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-[10px] uppercase font-bold">
                      Padre
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{familyData.father.fullName}</div>
                    {familyData.father.idDocumentNumber && (
                      <div className="text-[10px] font-mono text-slate-400">
                        ID: {familyData.father.idDocumentNumber}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      {familyData.father.birthPlace}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {familyData.father.nationality}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {familyData.father.currentResidence || '-'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-semibold">
                    {familyData.father.occupation || '-'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <div className="font-semibold text-slate-900">{familyData.father.phone || '-'}</div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                      {familyData.father.hasPassport ? '✓ Pasaporte Vigente' : '✕ Sin Pasaporte'}
                    </div>
                  </td>
                </tr>

                {/* Mother Row */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-black text-rose-700">
                    <span className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-[10px] uppercase font-bold">
                      Madre
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{familyData.mother.fullName}</div>
                    {familyData.mother.idDocumentNumber && (
                      <div className="text-[10px] font-mono text-slate-400">
                        ID: {familyData.mother.idDocumentNumber}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      {familyData.mother.birthPlace}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {familyData.mother.nationality}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {familyData.mother.currentResidence || '-'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-semibold">
                    {familyData.mother.occupation || '-'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <div className="font-semibold text-slate-900">{familyData.mother.phone || '-'}</div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                      {familyData.mother.hasPassport ? '✓ Pasaporte Vigente' : '✕ Sin Pasaporte'}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* DEDICATED PANEL: PARENTAL / TUTOR CONSENT VIDEO & AUDIT */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-indigo-800/40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Video Preview & Thumbnail */}
            <div className="flex items-start sm:items-center gap-4">
              <div
                onClick={() => setShowVideoPlayerModal(true)}
                className="relative group cursor-pointer w-28 h-20 sm:w-36 sm:h-24 rounded-xl overflow-hidden shrink-0 border-2 border-indigo-400/50 shadow-md hover:border-blue-300 transition-all"
              >
                <img
                  src={consentVideo.thumbnailUrl || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80'}
                  alt="Consent Video Thumbnail"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-all flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-white translate-x-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-mono font-bold text-white">
                  {consentVideo.durationFormatted || '1:45 min'}
                </div>
              </div>

              {/* Center Info */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Video de Consentimiento Verificado
                  </span>
                  <span className="text-[11px] text-slate-300">
                    Grabado: <strong className="text-white">{consentVideo.recordedDate}</strong>
                  </span>
                </div>

                <h5 className="text-xs sm:text-sm font-black text-white">
                  Declaración Jurada del Tutor: {consentVideo.tutorName} ({consentVideo.tutorRelationship})
                </h5>

                <p className="text-[11px] text-slate-300 line-clamp-2 max-w-xl">
                  "{consentVideo.statementSummary}"
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[10px] text-indigo-200 pt-0.5">
                  <span>Cédula/ID: <strong className="text-white font-mono">{consentVideo.tutorIdDocument}</strong></span>
                  <span>•</span>
                  <span>Notaría/Testigo: <strong className="text-white">{consentVideo.notaryOrLawyerName || 'Notaría Pública'}</strong></span>
                </div>
              </div>
            </div>

            {/* Right Buttons */}
            <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
              <button
                onClick={() => setShowVideoPlayerModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Reproducir Video</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: ELIGIBILIDAD EN SELECCIONES NACIONALES */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
          <div>
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              Elegibilidad de Selecciones Nacionales (WBSC / WBC / Torneos Federados)
            </h4>
            <p className="text-xs text-slate-500">
              Países a los que el atleta es elegible para representar según su lugar de nacimiento y origen genealógico de sus padres
            </p>
          </div>
          <button
            onClick={() => handleOpenTeamModal()}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all self-start cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Registrar País Elegible
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">País / Bandera</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Base de Elegibilidad</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Federación / Código</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Estado Jurídico</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider">Fundamento / Notas</th>
                  <th className="py-3 px-4 font-extrabold uppercase text-[10px] tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {familyData.eligibleNationalTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <span className="flex items-center gap-2 text-sm">
                        <span>{team.flagEmoji || '🌎'}</span>
                        <span className="text-xs font-black">{team.country}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        Vía: {team.basis}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700 text-[11px]">
                      {team.federationCode || 'WBSC / Federación'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          team.status === 'confirmado'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : team.status === 'apto'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {team.status === 'confirmado'
                          ? '✓ Confirmado / Titular'
                          : team.status === 'apto'
                          ? '● Apto por Sangre'
                          : 'En Trámite'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">{team.notes || '-'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenTeamModal(team)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                          title="Modificar elegibilidad"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {canDeleteHistory && (
                          <button
                            onClick={() => handleDeleteTeam(team.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                            title="Eliminar país"
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
      </div>

      {/* SECTION 3: PERFIL PERSONAL & VIDA FUERA DEL BÉISBOL (EXECUTIVE SUMMARY) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
          <div>
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Perfil Personal, Origen y Vida Fuera del Béisbol
            </h4>
            <p className="text-xs text-slate-500">
              Lugar de nacimiento, residencia actual, intereses, aficiones, idiomas y metas personales del atleta
            </p>
          </div>
          <button
            onClick={() => {
              setBirthCity(familyData.birthCity);
              setBirthCountry(familyData.birthCountry);
              setBirthHospital(familyData.birthHospitalOrRegistry || '');
              setResAddress(familyData.currentResidenceAddress);
              setResCity(familyData.currentResidenceCity);
              setResCountry(familyData.currentResidenceCountry);
              setHobbies(familyData.personalInterestsAndHobbies.join(', '));
              setLanguages(familyData.languagesSpoken.join(', '));
              setAspirations(familyData.offFieldAspirations || '');
              setMusicGenre(familyData.favoriteMusicGenre || '');
              setFoods(familyData.favoriteFoods || '');
              setRoleModel(familyData.roleModelOutsideBaseball || '');
              setShowPersonalModal(true);
            }}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all self-start cursor-pointer"
          >
            <Edit3 className="w-4 h-4" /> Editar Perfil Personal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Box 1: Origin & Residence */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <h5 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              Lugar de Nacimiento & Residencia Actual
            </h5>

            <div className="space-y-2 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Lugar de Nacimiento (Registro Civil)
                </span>
                <span className="font-bold text-slate-900 text-sm block">
                  {familyData.birthCity}, {familyData.birthCountry}
                </span>
                {familyData.birthHospitalOrRegistry && (
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    {familyData.birthHospitalOrRegistry}
                  </span>
                )}
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Residencia y Domicilio Actual
                </span>
                <span className="font-bold text-slate-900 block">{familyData.currentResidenceAddress}</span>
                <span className="text-slate-600 block mt-0.5">
                  {familyData.currentResidenceCity}, {familyData.currentResidenceCountry}
                </span>
              </div>
            </div>
          </div>

          {/* Box 2: Hobbies, Aspirations & Languages */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <h5 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              Gustos, Idiomas & Aspiraciones Fuera del Béisbol
            </h5>

            <div className="space-y-2 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 flex items-center gap-1">
                  <Gamepad2Icon className="w-3 h-3 text-slate-400" />
                  Intereses y Hobbies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {familyData.personalInterestsAndHobbies.map((hobby, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 flex items-center gap-1">
                  <Languages className="w-3 h-3 text-slate-400" />
                  Idiomas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {familyData.languagesSpoken.map((lang, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-800 font-semibold text-[11px] border border-blue-100"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {familyData.offFieldAspirations && (
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Aspiraciones Académicas / Profesionales
                  </span>
                  <span className="text-slate-800 font-medium text-xs block">
                    {familyData.offFieldAspirations}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: VIDEO PLAYER & LEGAL AUDIT DETAILS */}
      {/* ------------------------------------------------------------- */}
      {showVideoPlayerModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 text-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-800 space-y-0 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-400" />
                  Video de Consentimiento Legal del Tutor
                </h4>
                <p className="text-xs text-slate-400">
                  Declaración jurada y autorización de representación legal para {player.fullName}
                </p>
              </div>
              <button
                onClick={() => setShowVideoPlayerModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Display */}
            <div className="bg-black relative aspect-video flex items-center justify-center">
              <video
                controls
                autoPlay
                className="w-full h-full object-contain"
                src={consentVideo.videoUrl}
                poster={consentVideo.thumbnailUrl}
              >
                Tu navegador no soporta reproducción de video HTML5.
              </video>
            </div>

            {/* Legal Statement & Notary Details */}
            <div className="p-5 sm:p-6 bg-slate-900 space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Tutor Declarante</span>
                  <span className="text-sm font-black text-white">{consentVideo.tutorName}</span>
                  <span className="text-slate-400 ml-1.5 font-bold">({consentVideo.tutorRelationship})</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Cédula / Documento Oficial</span>
                  <span className="font-mono font-bold text-indigo-300">{consentVideo.tutorIdDocument}</span>
                </div>
              </div>

              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Extracto de Declaración Jurada Registrada
                </span>
                <p className="text-slate-200 text-xs italic leading-relaxed">
                  "{consentVideo.statementSummary}"
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-slate-400 text-[11px] pt-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sello Notarial & Auditoría Legal Conforme ante MLB</span>
                </div>
                <span>Notario: <strong className="text-white">{consentVideo.notaryOrLawyerName || 'Notaría Pública'}</strong></span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowVideoPlayerModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Cerrar Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT / UPLOAD CONSENT VIDEO */}
      {/* ------------------------------------------------------------- */}
      {showConsentVideoEditModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xl shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-600" />
                Gestionar Video de Consentimiento del Tutor
              </h4>
              <button
                onClick={() => setShowConsentVideoEditModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveConsentVideo} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">URL del Video (MP4 / Streaming)</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={formVideoUrl}
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">URL de Portada / Miniatura (Thumbnail)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formVideoThumb}
                  onChange={(e) => setFormVideoThumb(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre Completo del Tutor</label>
                  <input
                    type="text"
                    required
                    value={formTutorName}
                    onChange={(e) => setFormTutorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Parentesco</label>
                  <select
                    value={formTutorRelationship}
                    onChange={(e) => setFormTutorRelationship(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800"
                  >
                    <option value="Padre">Padre</option>
                    <option value="Madre">Madre</option>
                    <option value="Tutor Legal Certificado">Tutor Legal Certificado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">No. Cédula / DNI</label>
                  <input
                    type="text"
                    required
                    value={formTutorIdDoc}
                    onChange={(e) => setFormTutorIdDoc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha de Grabación</label>
                  <input
                    type="date"
                    required
                    value={formRecordedDate}
                    onChange={(e) => setFormRecordedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duración (ej. 1:45 min)</label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notaría / Abogado Testigo Legal</label>
                <input
                  type="text"
                  placeholder="ej. Lic. Fernando Taveras (Notaría Pública Santo Domingo)"
                  value={formNotary}
                  onChange={(e) => setFormNotary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Resumen de la Declaración Jurada</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Declaración de patria potestad y representación legal..."
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Estado de Verificación</label>
                <select
                  value={formVideoStatus}
                  onChange={(e) => setFormVideoStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800"
                >
                  <option value="verificado">✓ Verificado y Aprobado Legalmente</option>
                  <option value="en_revision">En Revisión de Asesoría Jurídica</option>
                  <option value="pendiente">Pendiente de Aprobación</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowConsentVideoEditModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Guardar Video y Consentimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT PERSONAL PROFILE */}
      {/* ------------------------------------------------------------- */}
      {showPersonalModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xl shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Editar Perfil Personal & Vida Fuera del Béisbol
              </h4>
              <button
                onClick={() => setShowPersonalModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePersonalProfile} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ciudad de Nacimiento</label>
                  <input
                    type="text"
                    required
                    value={birthCity}
                    onChange={(e) => setBirthCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">País de Nacimiento</label>
                  <input
                    type="text"
                    required
                    value={birthCountry}
                    onChange={(e) => setBirthCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Centro de Salud / Registro Civil de Nacimiento</label>
                <input
                  type="text"
                  placeholder="ej. Hospital Regional Dr. Antonio Musa / Oficialía de Estado Civil"
                  value={birthHospital}
                  onChange={(e) => setBirthHospital(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Dirección de Residencia Actual</label>
                  <input
                    type="text"
                    required
                    value={resAddress}
                    onChange={(e) => setResAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ciudad Residencia</label>
                  <input
                    type="text"
                    required
                    value={resCity}
                    onChange={(e) => setResCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Intereses y Hobbies (separados por coma)</label>
                <input
                  type="text"
                  placeholder="Ajedrez, Producción musical, Natación"
                  value={hobbies}
                  onChange={(e) => setHobbies(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Idiomas (separados por coma)</label>
                <input
                  type="text"
                  placeholder="Español (Nativo), Inglés (Intermedio B1)"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Aspiraciones Fuera del Deporte</label>
                <input
                  type="text"
                  placeholder="ej. Negocios Deportivos, Finanzas o Bienes Raíces"
                  value={aspirations}
                  onChange={(e) => setAspirations(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPersonalModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Guardar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT PARENTS INFO */}
      {/* ------------------------------------------------------------- */}
      {showParentsModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Editar Datos de Padre y Madre (Genealogía & Elegibilidad)
              </h4>
              <button
                onClick={() => setShowParentsModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveParents} className="space-y-4 text-xs">
              {/* Father Subsection */}
              <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-3">
                <h5 className="font-black text-indigo-900 uppercase text-[11px] tracking-wider">
                  Datos del Padre
                </h5>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nombre Completo del Padre</label>
                    <input
                      type="text"
                      required
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nacionalidad</label>
                    <input
                      type="text"
                      required
                      value={fatherNat}
                      onChange={(e) => setFatherNat(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Lugar y Ciudad de Nacimiento</label>
                    <input
                      type="text"
                      required
                      value={fatherBirth}
                      onChange={(e) => setFatherBirth(e.target.value)}
                      placeholder="ej. San Pedro de Macorís, República Dominicana"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Ocupación / Profesión</label>
                    <input
                      type="text"
                      value={fatherOcc}
                      onChange={(e) => setFatherOcc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={fatherPhone}
                      onChange={(e) => setFatherPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">No. Cédula / DNI</label>
                    <input
                      type="text"
                      value={fatherDoc}
                      onChange={(e) => setFatherDoc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
                    />
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fatherPassport}
                        onChange={(e) => setFatherPassport(e.target.checked)}
                        className="rounded text-indigo-600 w-4 h-4"
                      />
                      <span>Pasaporte Vigente</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Mother Subsection */}
              <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-2xl space-y-3">
                <h5 className="font-black text-rose-900 uppercase text-[11px] tracking-wider">
                  Datos de la Madre
                </h5>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nombre Completo de la Madre</label>
                    <input
                      type="text"
                      required
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nacionalidad</label>
                    <input
                      type="text"
                      required
                      value={motherNat}
                      onChange={(e) => setMotherNat(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Lugar y Ciudad de Nacimiento</label>
                    <input
                      type="text"
                      required
                      value={motherBirth}
                      onChange={(e) => setMotherBirth(e.target.value)}
                      placeholder="ej. Maracaibo, Estado Zulia, Venezuela"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Ocupación / Profesión</label>
                    <input
                      type="text"
                      value={motherOcc}
                      onChange={(e) => setMotherOcc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={motherPhone}
                      onChange={(e) => setMotherPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">No. Cédula / DNI</label>
                    <input
                      type="text"
                      value={motherDoc}
                      onChange={(e) => setMotherDoc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
                    />
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={motherPassport}
                        onChange={(e) => setMotherPassport(e.target.checked)}
                        className="rounded text-rose-600 w-4 h-4"
                      />
                      <span>Pasaporte Vigente</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowParentsModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Guardar Datos de Padres
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: TEAM ELIGIBILITY CRUD */}
      {/* ------------------------------------------------------------- */}
      {showTeamModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                {editingTeamId ? 'Editar Selección Nacional Elegible' : 'Registrar País / Selección Elegible'}
              </h4>
              <button
                onClick={() => setShowTeamModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTeam} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">País</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. República Dominicana, Venezuela, etc."
                    value={teamCountry}
                    onChange={(e) => setTeamCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bandera Emoji</label>
                  <input
                    type="text"
                    required
                    value={teamFlag}
                    onChange={(e) => setTeamFlag(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-center text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Base de Elegibilidad</label>
                  <select
                    value={teamBasis}
                    onChange={(e) => setTeamBasis(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800"
                  >
                    <option value="Nacimiento">Nacimiento en el país</option>
                    <option value="Padre">Padre nacido en el país</option>
                    <option value="Madre">Madre nacida en el país</option>
                    <option value="Doble Nacionalidad">Doble Nacionalidad / Pasaporte</option>
                    <option value="Residencia (+5 años)">Residencia Continua (+5 años)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estado Jurídico</label>
                  <select
                    value={teamStatus}
                    onChange={(e) => setTeamStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800"
                  >
                    <option value="confirmado">Confirmado / Titular WBSC</option>
                    <option value="apto">Apto por Ascendencia</option>
                    <option value="en_tramite">En Trámite de Documentación</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Federación Nacional / Código WBSC</label>
                <input
                  type="text"
                  placeholder="ej. FEDOBE / FEVEBEISBOL / WBSC-DOM"
                  value={teamFedCode}
                  onChange={(e) => setTeamFedCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Fundamento Jurídico / Observaciones</label>
                <textarea
                  rows={2}
                  placeholder="ej. Elegible por madre nacida en Maracaibo con pasaporte vigente."
                  value={teamNotes}
                  onChange={(e) => setTeamNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTeamModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Guardar País Elegible
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper icon
const Gamepad2Icon = ({ className }: { className?: string }) => (
  <Sparkles className={className} />
);
