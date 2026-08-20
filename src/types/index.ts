export type UserRole = 'admin' | 'staff' | 'scout' | 'player';

export interface RoleInfo {
  id: UserRole;
  label: string;
  sublabel: string;
  iconName: string;
  badgeColor: string;
  description: string;
}

export type Position = 'OF' | 'SS' | 'RHP' | 'LHP' | 'C' | '3B' | '2B' | '1B' | 'UTIL';

export type SigningClass = '2026' | '2027' | '2028' | '2029';

export type VerificationStatus = 'verified' | 'in_review' | 'pending_video';

export interface PhysicalMetrics {
  exitVelocityMph: number;       // e.g. 98.5 MPH
  armVelocityMph: number;        // e.g. 92.0 MPH
  fastballVeloMaxMph?: number;   // e.g. 95.0 MPH (for pitchers)
  fastballVeloAvgMph?: number;   // e.g. 92.4 MPH
  spinRateRpm?: number;          // e.g. 2450 RPM
  popTimeSec?: number;           // e.g. 1.89 sec (for catchers)
  sixtyYardDashSec: number;      // e.g. 6.45 sec
  timeToFirstBaseSec: number;    // e.g. 4.12 sec
  batSpeedMph?: number;          // e.g. 76.5 MPH
  launchAngleAvgDeg?: number;    // e.g. 14.2 deg
  verticalJumpInches?: number;   // e.g. 33.5 in
  gripStrengthKg?: number;       // e.g. 58 kg
}

export interface EdTechMetrics {
  baseballIqScore: number;       // percentage 0 - 100%
  libraryProgress: number;       // percentage 0 - 100%
  completedCoursesCount: number;
  totalCoursesCount: number;
  lastIqTestDate: string;
  iqTestHistory: Array<{
    id: string;
    date: string;
    topic: string;
    score: number;
    totalQuestions: number;
  }>;
  enrolledCourses: string[];
}

export interface ScoutScale20_80 {
  hit: number;      // 20-80 scale
  power: number;
  run: number;
  arm: number;
  field: number;
  iq: number;
  overall: number;
}

export interface VideoClip {
  id: string;
  title: string;
  category: 'Bateo (BP)' | 'Juego Real' | 'Bullpen' | 'Defensa & Tiro' | '60 Yardas' | 'Preparación Física';
  thumbnail: string;
  videoUrl?: string;
  duration: string;
  date: string;
  biomechanicsVerified: boolean;
  notes: string;
  source?: 'player_upload' | 'academy_verified' | 'showcase_official';
  uploadedBy?: string;
}

export interface FormalEducation {
  id: string;
  level: string; // e.g. 'Primaria', 'Secundaria / Bachillerato', 'Técnico Vocacional', 'Secundaria Acelerada'
  institution: string; // e.g. 'Colegio Evangélico Central'
  currentGradeOrYear: string; // e.g. '4to de Secundaria (10th Grade)'
  status: 'en_curso' | 'completado' | 'pausado';
  gpaOrAverage?: string; // e.g. '89/100 (B+)'
  cityCountry: string; // e.g. 'San Pedro de Macorís, RD'
  graduationYearExpected?: string; // e.g. '2027'
  notes?: string;
}

export interface NonFormalCourse {
  id: string;
  title: string; // e.g. 'Inglés Básico-Intermedio para Béisbol Pro'
  category: 'Idiomas' | 'Nutrición & Salud' | 'Finanzas para Atletas' | 'Liderazgo & Media' | 'Baseball IQ & Táctica' | 'Tecnología & Biomecánica';
  institution: string; // e.g. 'Glovall EdTech Academy' / 'Dominico Americano'
  completionYear: string; // e.g. '2025'
  hoursCount?: number; // e.g. 45
  status: 'completado' | 'en_progreso';
  certificateCode?: string;
  skillsLearned?: string[];
}

export type MetricDiscipline = 'BAT' | 'PIT' | 'FIL' | 'RUN' | 'ACO';

export interface SessionMetricItem {
  id: string;
  metricKey: string;
  metricLabel: string;
  value: number | string;
  unit: string;
}

export interface MetricMeasurementRecord {
  id: string;
  date: string; // YYYY-MM-DD or formatted date
  dateTime?: string; // e.g. '2026-08-19 22:33'
  eventName: string; // e.g. 'Evaluación Oficial TrackMan Estadio Quisqueya'
  discipline?: MetricDiscipline;
  condition?: string; // e.g. 'Juego Oficial', 'Entrenamiento', 'Showcase'
  verifiedByTool: 'TrackMan' | 'Rapsodo Pro' | 'Laser Stalker' | 'Biomechanics 3D' | 'Manual Certificado' | string;
  country?: string;
  city?: string;
  location?: string;
  description?: string;
  videoUrl?: string;
  videoFileName?: string;
  evidenceFiles?: Array<{ name: string; type: string; size?: string }>;
  customMetrics?: SessionMetricItem[];
  exitVelocityMph: number;
  armVelocityMph: number;
  sixtyYardDashSec: number;
  popTimeSec?: number;
  fastballVeloMaxMph?: number;
  spinRateRpm?: number;
  batSpeedMph?: number;
  launchAngleAvgDeg?: number;
  flightDistanceFt?: number;
  attackAngleDeg?: number;
  hipRotationTimeMs?: number;
  rotationalAccelerationG?: number;
  onPlaneEfficiencyPct?: number;
  verticalJumpInches?: number;
  gripStrengthKg?: number;
  notes?: string;
}

export interface AcademyHistoryRecord {
  id: string;
  academyName: string; // e.g. 'Caribe Baseball Academy'
  categoryOrRole: string; // e.g. 'Programa Élite de Desarrollo Internacional'
  period: string; // e.g. '2023 - Presente'
  headCoach: string; // e.g. 'Carlos Rosario'
  location: string; // e.g. 'Boca Chica, RD'
  status?: 'active_primary' | 'active_specialty' | 'historical';
  programType?: string;
  transitionReason?: string; // e.g. 'Incorporación a programa intensivo de firma'
  highlights?: string;
}

// ==========================================
// TRAYECTORIA DEL PROSPECTO (PLATAFORMA ANTERIOR)
// ==========================================
export interface TrajectoryProgram {
  id: string;
  name: string; // e.g. "Erik Hernandez Baseball Academy - Tetero"
  coach?: string; // e.g. "Erik Hernandez"
  type: string; // e.g. "Residencia", "Entrenamiento de Showcases, Cajas de Bateo"
  startDate: string; // e.g. "1/4/2026"
  endDate?: string; // e.g. "6/2/2026"
  status: 'activo' | 'finalizado';
  note?: string; // e.g. "Sin anotaciones"
  location?: string;
  directorName?: string;
  categoryOrRole?: string;
  transitionReason?: string; // e.g. "Carta de Libertad emitida por mutuo acuerdo", "Traspaso a programa de alta competencia"
  hasReleaseLetter?: boolean;
  releaseLetterCode?: string; // e.g. "CL-GLV-2026-089"
  releaseDate?: string;
  releaseLetterUrl?: string;
  scholarshipCoverage?: string; // e.g. "Beca 100% Residencial & Alimentación"
  signedByTutor?: boolean;
  tutorSignerName?: string;
}

export interface AcademySolicitude {
  id: string;
  academyId: string;
  academyName: string;
  academyLogo?: string;
  academyLocation: string;
  directorName: string;
  directorRole: string;
  scoutContact?: string;
  programOffered: string; // e.g. "Programa Élite de Residencia & Firma MLB 2026"
  programType: 'Residencia' | 'Entrenamiento de Showcases' | 'Especialidad de Bateo' | 'Pitcheo Especializado' | 'Preparación Física & Fuerza' | 'Desarrollo Integral';
  scholarshipOffer: string; // e.g. "Beca 100% (Alojamiento, Alimentación, TrackMan & Escolaridad)"
  monthlyAllowance?: string; // e.g. "$1,500 USD / mes de viáticos"
  sentDate: string; // e.g. "12/04/2026"
  expirationDate: string; // e.g. "30/05/2026"
  status: 'pending' | 'accepted' | 'declined' | 'under_review' | 'cancelled';
  proposalLetter: string; // Full letter from academy director
  clauses: string[]; // Legal and development clauses
  tutorDecisionDate?: string;
  tutorDecisionNote?: string;
  rejectionReason?: string;
  officialDocumentUrl?: string;
  glovallRatingScore?: number; // Academy ranking e.g. 98
}

export interface AffiliationAuditEvent {
  id: string;
  timestamp: string;
  eventType: 'vinculacion_inicial' | 'solicitud_recibida' | 'solicitud_aceptada' | 'solicitud_rechazada' | 'emision_carta_libertad' | 'desvinculacion' | 'cambio_estatus';
  title: string;
  description: string;
  academyName: string;
  actor: string; // e.g. "Director Lic. Rafael Almonte", "Tutor José Valdez", "Glovall Compliance"
  badgeColor: 'emerald' | 'blue' | 'rose' | 'amber' | 'purple';
  evidenceCode?: string;
}

export interface TrajectoryTournament {
  id: string;
  name: string; // e.g. "Sub 15 Costa Atlantica"
  teamRepresented: string; // e.g. "Academia Cararin", "Individual"
  startDate: string; // e.g. "1 feb 2026"
  endDate?: string; // e.g. "5 feb 2026" o "-"
  resultAward: string; // e.g. "MVP", "Participación", "Campeón", "Subcampeón", "Líder de Bateo"
  awardType: 'mvp' | 'champion' | 'runner_up' | 'participation' | 'leader' | 'all_star';
  notes?: string;
  location?: string;
}

export interface TrajectoryMetricRecord {
  id: string;
  discipline: 'BAT' | 'PIT' | 'RUN' | 'FLD' | 'FIL' | 'ACO';
  metricName: string; // e.g. "Angulo de Salida (LA)", "Velocidad del Bate", "Angulo de Ataque", "60 Yard Dash", "Extension"
  value: number; // e.g. 31, 75, 8, 60, 5, 120
  unit: string; // e.g. "deg", "MPH", "sec", "ft", "rpm"
  condition: string; // e.g. "Tryout", "Practica Individual", "Trabajo en Tee", "Bullpen", "Juego Real", "Showcase Oficial"
  tool: string; // e.g. "TrackMan", "Rapsodo", "Blast Motion", "Stalker Radar", "Cronómetro Láser", "-"
  date: string; // e.g. "21/04/2026, 17:27"
  hasEvidence?: boolean;
  evidenceUrl?: string;
  videoUrl?: string;
  videoFileName?: string;
  country?: string;
  city?: string;
  location?: string;
  description?: string;
  evidenceFiles?: Array<{ name: string; type: string; size?: string; url?: string }>;
  customMetrics?: SessionMetricItem[];
  notes?: string;
}

export interface TrajectoryEducationSubject {
  id: string;
  name: string;
  grade: string;
  score?: number;
  status: 'Aprobado' | 'En Curso' | 'Destacado';
}

export interface TrajectoryEducationYear {
  id: string;
  institution: string; // e.g. "Colegio Fundación Colombia"
  level: string; // e.g. "Secundaria", "Primaria", "Bachillerato"
  grade: string; // e.g. "6", "5", "4", "3"
  year: string; // e.g. "2026"
  average: string; // e.g. "5.00", "4.00"
  subjectsCount: number; // e.g. 1
  subjects?: TrajectoryEducationSubject[];
  hasCertificate?: boolean;
  certificateUrl?: string;
  notes?: string;
}

export interface TrajectoryCourseItem {
  id: string;
  title: string; // e.g. "Inglés Básico", "Inglés Intermedio", "Alimentación Básica de Prospectos"
  institution: string; // e.g. "Udemy", "Coursera", "Universidad del Norte", "Glovall EdTech"
  durationHours: number; // e.g. 20, 30, 20
  completionDate: string; // e.g. "17 feb 2026", "4 feb 2026", "2 feb 2026"
  score: string; // e.g. "Aprobado", "95/100", "Certificado de Excelencia"
  source: 'externo' | 'glovall'; // "Externo" (amber) | "Glovall" (blue)
  hasCertificate?: boolean;
  certificateUrl?: string;
  notes?: string;
}

export interface PlayerAffiliation {
  academyId: string;
  academyName: string;
  programType: 'matriz_principal' | 'especialidad_bateo' | 'especialidad_pitcheo' | 'preparacion_fisica' | 'consultoria_temporal';
  programTypeName: string;
  roleOrCategory: string;
  isPrimary: boolean;
  startDate: string;
  status: 'active' | 'completed' | 'paused';
  headCoachName?: string;
  location?: string;
}

export interface PlayerInvitation {
  id: string;
  playerId: string;
  playerName: string;
  playerAvatar: string;
  playerPosition: Position | string;
  signingClass: SigningClass | string;
  hometown: string;
  tutorName: string;
  tutorEmail: string;
  tutorPhone?: string;
  academyId: string;
  academyName: string;
  programType: 'matriz_principal' | 'especialidad_bateo' | 'especialidad_pitcheo' | 'preparacion_fisica' | 'consultoria_temporal';
  programTypeName: string;
  monthlyScholarship?: number;
  roleOffered: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  sentDate: string;
  respondedDate?: string;
  notes?: string;
  token?: string;
  glovallScore?: number;
}

export interface TournamentAwardRecord {
  id: string;
  tournamentName: string; // e.g. 'Torneo Nacional Sub-15 FEDOBE'
  year: string; // e.g. '2024'
  teamOrSelection: string; // e.g. 'Selección Nacional Dominicana U15'
  positionPlayed: string; // e.g. 'Campocorto Titular'
  location: string; // e.g. 'Santo Domingo, RD'
  distinctions: string[]; // e.g. ['Jugador Más Valioso (MVP)', 'Líder de Bateo (.485)', 'Campeón Nacional']
  statsSummary?: string; // e.g. '6 JJ, .485 AVG, 2 HR, 9 RBI, 5 BR'
}

export interface SessionMediaEvidence {
  id: string;
  type: 'video' | 'image';
  url: string;
  thumbnailUrl?: string;
  title: string; // e.g. 'Ángulo lateral en jaula 120 FPS'
  fpsOrFormat?: string; // e.g. '120 FPS Slow-Mo', 'Foto Técnica 4K', 'TrackMan Snapshot'
  notes?: string;
}

export interface CoachingSessionRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // e.g. '08:30 AM'
  coachName: string; // e.g. 'Carlos Rosario'
  coachRole: string; // e.g. 'Director de Bateo / Hitting Coach', 'Pitching Coach', 'Preparador Físico / S&C'
  trainingArea: 'Bateo & Swing' | 'Pitcheo & Bullpen' | 'Defensa & Infield/OF' | 'Fuerza, Velocidad & Físico' | 'Baseball IQ & Táctica' | 'Cuidado de Brazo & Biomecánica';
  drillsCompleted: string; // e.g. 'Drills de cadera y extensión con tee alto, 60 contactos en jaula a 85 MPH'
  durationMinutes?: number; // e.g. 75
  evaluationRating: 'Excelente' | 'Favorable' | 'En Progresión' | 'Requiere Ajuste';
  performanceScore?: number; // e.g. 9.0 (1-10)
  coachFeedback: string; // e.g. 'Excelente rotación de cadera, mejoró el ángulo de salida...'
  nextStepGoal?: string; // e.g. 'Mantener la cabeza fija en pitcheos quebrados exteriores'
  mediaEvidence?: SessionMediaEvidence[];
  videoEvidenceUrl?: string;
}

export interface PlayerShowcaseMetricRecord {
  metricName: string; // e.g. "Sprint 60 Yardas Láser", "Velocidad de Salida (Exit Velo)", "Fastball Máx (TrackMan)", "Pop Time"
  value: string; // e.g. "6.45 seg", "98.4 MPH", "94.2 MPH", "1.86 seg"
  benchmarkRating?: string; // e.g. "Top 1% Clase 2026", "Escala MLB 70", "Élite"
}

export interface PlayerShowcaseParticipation {
  id: string;
  eventId?: string;
  eventTitle: string;
  eventCategory: string;
  date: string;
  location: string;
  city?: string;
  country?: string;
  source: 'glovall_official' | 'community_suggested';
  organizer?: string;
  status: 'Evaluado Destacado' | 'Seguimiento Solicitado' | 'Participó' | 'Entrevista Realizada' | 'Reporte Favorable';
  metricsRecorded: PlayerShowcaseMetricRecord[];
  interestedOrganizations: string[]; // e.g. ['New York Yankees', 'Los Angeles Dodgers', 'San Diego Padres']
  scoutInterviewsOrNotes?: string;
  coachSummary: string;
  recordedByCoachName?: string;
  recordedDate?: string;
}

export interface ParentInfo {
  fullName: string;
  relationship: 'Padre' | 'Madre' | 'Tutor Legal';
  nationality: string;
  birthPlace: string; // e.g. 'San Pedro de Macorís, República Dominicana'
  currentResidence?: string;
  occupation?: string;
  phone?: string;
  hasPassport: boolean;
  passportCountry?: string;
  idDocumentNumber?: string;
}

export interface EligibleTeamRecord {
  id: string;
  country: string;
  flagEmoji?: string;
  basis: 'Nacimiento' | 'Padre' | 'Madre' | 'Residencia (+5 años)' | 'Doble Nacionalidad';
  status: 'confirmado' | 'en_tramite' | 'apto';
  federationCode?: string; // e.g. 'FEDOBE / WBSC-DOM'
  notes?: string;
}

export interface PassportRecord {
  id: string;
  country: string;
  passportNumberMasked: string; // e.g. 'DO***4821'
  expirationDate: string;
  hasUsVisa: boolean;
  visaType?: string; // e.g. 'B1/B2 Turista & Negocios' o 'P-1 Atleta'
}

export interface TutorConsentVideoRecord {
  videoUrl: string;
  thumbnailUrl?: string;
  tutorName: string;
  tutorRelationship: 'Padre' | 'Madre' | 'Tutor Legal Certificado';
  tutorIdDocument: string;
  recordedDate: string;
  durationFormatted?: string; // e.g. '1:45 min'
  notaryOrLawyerName?: string; // e.g. 'Lic. Fernando Taveras (Notaría Pública Santo Domingo)'
  statementSummary: string; // e.g. 'Consentimiento expreso de patria potestad, representación ante MLB y autorización para entrenamientos y traslados internacionales'
  status: 'verificado' | 'en_revision' | 'pendiente';
  documentSignedAttached?: boolean;
}

export interface PlayerFamilyEligibility {
  // Origin & Personal Profile of the Player
  birthCity: string;
  birthCountry: string;
  birthHospitalOrRegistry?: string;
  currentResidenceAddress: string;
  currentResidenceCity: string;
  currentResidenceCountry: string;
  personalInterestsAndHobbies: string[]; // e.g. ['Ajedrez', 'Producción Musical', 'Natación', 'Videojuegos (MLB The Show)']
  languagesSpoken: string[]; // e.g. ['Español (Nativo)', 'Inglés (Intermedio B1)']
  offFieldAspirations?: string; // e.g. 'Negocios Internacionales o Gestión Deportiva'
  favoriteMusicGenre?: string; // e.g. 'Urbano / Merengue Típico'
  favoriteFoods?: string; // e.g. 'Mangú con los tres golpes / Pollo a la plancha'
  roleModelOutsideBaseball?: string; // e.g. 'Su abuelo materno y Nelson Mandela'
  
  // Parents Info
  father: ParentInfo;
  mother: ParentInfo;
  legalGuardianSameAsParent?: boolean;
  legalGuardianName?: string;
  
  // Consent Video of Parent/Legal Guardian
  tutorConsentVideo?: TutorConsentVideoRecord;
  
  // National Teams Eligibility
  eligibleNationalTeams: EligibleTeamRecord[];
  
  // Passports & Travel Docs
  passportsAvailable: PassportRecord[];
}

export interface Player {
  id: string;
  fullName: string;
  nickname?: string;
  jerseyNumber?: number;
  avatar: string;
  age: number;
  birthDate: string;
  position: Position;
  secondaryPosition?: Position;
  signingClass: SigningClass;
  height: string;             // e.g. "6'2\""
  weight: number;             // in lbs e.g. 185
  bats: 'R' | 'L' | 'S';
  throws: 'R' | 'L';
  hometown: string;           // e.g. "San Pedro de Macorís, RD"
  nationality: string;        // "República Dominicana", "Venezuela", etc.
  birthCountry?: string;      // e.g. "República Dominicana"
  birthCity?: string;         // e.g. "San Pedro de Macorís"
  residenceCountry?: string;  // e.g. "República Dominicana"
  residenceCity?: string;     // e.g. "Santo Domingo Este"
  availableInProspectDirectory?: boolean; // Visible en Directorio de Prospectos para vincularse a academias
  assignedCoachId: string;
  assignedCoachName: string;
  
  // Identifiers & Passport
  glovallPassportId?: string; // e.g. "GLV-PLY-2026-001"
  availabilityStatus?: 'disponible_agente_libre' | 'en_desarrollo' | 'buscando_programa_bateo' | 'buscando_pitch_design' | 'exclusivo';
  currentAffiliations?: PlayerAffiliation[];
  
  // Indicators & Verification
  glovallScore: number;        // 1 - 100 overall algorithm index
  verificationStatus: VerificationStatus;
  verificationSource: string; // "TrackMan Stadium Verified", "Rapsodo Pro 3.0", "Glovall Staff Laser"
  verificationDate: string;
  
  // Legal & Scout Visibility
  scoutVisibilityStatus: 'public' | 'pending' | 'restricted';
  tutorDocumentVerified: boolean;
  tutorConsentVideoUploaded: boolean;
  mlbIdAssigned?: string;
  email?: string;
  phone?: string;
  socialMedia?: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    tiktok?: string;
  };
  
  // Metrics & EdTech
  metrics: PhysicalMetrics;
  edTech: EdTechMetrics;
  scoutScale: ScoutScale20_80;
  
  // Reports & Clips
  scoutingNotes: string;
  strengths: string[];
  areasOfImprovement: string[];
  comparableMlbPlayer: string;
  videoClips: VideoClip[];
  videos?: VideoClip[];
  
  // Trajectory & Life 360 Records
  formalEducation?: FormalEducation[];
  nonFormalCourses?: NonFormalCourse[];
  measurementHistory?: MetricMeasurementRecord[];
  academyHistory?: AcademyHistoryRecord[];
  tournamentsAndAwards?: TournamentAwardRecord[];
  familyAndEligibility?: PlayerFamilyEligibility;
  coachingSessions?: CoachingSessionRecord[];
  coachingHistory?: CoachingSessionRecord[];
  showcaseHistory?: PlayerShowcaseParticipation[];

  // Direct Player Trajectory Management Modules (Legacy platform parity)
  trajectoryPrograms?: TrajectoryProgram[];
  academyRequests?: AcademySolicitude[];
  affiliationAuditTrail?: AffiliationAuditEvent[];
  trajectoryTournaments?: TrajectoryTournament[];
  trajectoryMetrics?: TrajectoryMetricRecord[];
  trajectoryEducation?: TrajectoryEducationYear[];
  trajectoryCourses?: TrajectoryCourseItem[];
  
  // Trackman details
  trackmanData?: {
    maxDistanceFt: number;
    hardHitPercentage: number;
    sweetSpotPercentage: number;
    zoneContactPercentage: number;
  };
}

export interface AcademyAchievement {
  id: string;
  year: number | string;
  title: string;
  category: 'Firma MLB' | 'Torneo / Campeonato' | 'Alianza Académica D1' | 'Certificación Internacional' | 'Hito Institucional';
  description: string;
  metricOrBonus?: string; // e.g. '$3.2M Bono de Firma', 'Medalla de Oro PG Caribbean', '100% Becas'
  verifiedByScout?: boolean;
}

export interface AcademySocialLinks {
  website?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
}

export interface PaymentMethod {
  id: string;
  cardBrand: 'visa' | 'mastercard' | 'amex';
  last4: string;
  cardHolderName: string;
  expMonth: string;
  expYear: string;
  isDefault: boolean;
  bankOrIssuer?: string;
}

export interface AcademyInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  planName: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  billingPeriod: string;
  paymentMethodLast4: string;
  downloadUrl?: string;
}

export interface AcademyProfile {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  country: string;
  city: string;
  establishedYear: number;
  directorName: string;
  directorPhone: string;
  directorEmail: string;
  logo: string;
  coverImage: string;
  subscriptionPlan: string;
  subscriptionStatus: 'active' | 'trial' | 'renewal_pending';
  nextBillingDate: string;
  totalAthletesCount: number;
  totalStaffCount: number;
  mlbPartnershipTier: 'MLB Certified Partner' | 'Gold Academy' | 'Pro Member';
  activeShowcasesCount: number;
  verifiedProspectsPercentage: number;
  licensedPlayersSeats?: number;
  staffList?: CoachStaff[];
  technicalSpecialtiesAndResources?: string[];
  highlightedAchievements?: string;
  websiteUrl?: string;
  socialLinks?: AcademySocialLinks;
  achievementsList?: AcademyAchievement[];
  paymentMethods?: PaymentMethod[];
  invoices?: AcademyInvoice[];
  autoRenew?: boolean;
}

export interface CoachAffiliation {
  academyId: string;
  academyName: string;
  roleTitle: string;
  status: 'active' | 'pending_approval' | 'former';
  contractType: 'Tiempo Completo' | 'Medio Tiempo' | 'Consultor Externo';
  startDate: string;
  isPrimary?: boolean;
}

export interface CoachInvitation {
  id: string;
  coachId: string;
  coachName: string;
  coachEmail: string;
  coachAvatar: string;
  academyId: string;
  academyName: string;
  roleProposed: string;
  contractType: 'Tiempo Completo' | 'Medio Tiempo' | 'Consultor Externo';
  assignedCategories: string[];
  sentDate: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'revoked';
  notificationEmailSent: boolean;
}

export interface CoachAcademyExperience {
  id: string;
  academyName: string;
  roleTitle: string;
  period: string; // e.g. "2018 - 2022"
  location: string;
  achievements?: string;
  status: 'actual' | 'anterior';
}

export interface CoachPlayerMentorship {
  id: string;
  playerName: string;
  playerAvatar: string;
  position: string;
  signingClass: string;
  signingTeam?: string; // e.g. "New York Yankees (Bono $1.8M)"
  trainingFocus: string; // e.g. "Reestructuración mecánica de swing & Exit Velo"
  period: string; // e.g. "2023 - 2025"
  status: 'Firmado Pro' | 'En Desarrollo Activo' | 'Colegial D1';
  progressHighlight: string; // e.g. "De 88 a 99.4 MPH Exit Velo"
}

export interface CoachEventParticipation {
  id: string;
  eventName: string;
  type: 'Tryout MLB' | 'Showcase Internacional' | 'Torneo Nacional' | 'Combine Físico';
  date: string;
  location: string;
  roleInEvent: string; // e.g. "Evaluador Principal de Bateo", "Coach de Banco", "Organizador Técnico"
  playersShowcasedCount: number;
  highlightNotes?: string;
}

export interface CoachStaff {
  id: string;
  name: string;
  roleTitle: string;
  specialties?: string[];
  specialty?: 'Bateo & Potencia' | 'Pitcheo & Biomecánica' | 'Preparación Física & Velocidad' | 'Receptoría & Defensa' | string;
  assignedPlayersCount?: number;
  assignedPlayerCount?: number;
  assignedCategory?: string;
  phone?: string;
  email: string;
  avatar: string;
  yearsExperience?: number;
  status?: 'active' | 'inactive' | 'pending_approval';
  linkStatus?: 'active' | 'pending_approval' | 'invitation_sent';
  contractType?: 'Tiempo Completo' | 'Medio Tiempo' | 'Consultor Externo';
  bio?: string;
  certifications?: string[];
  hometown?: string;
  currentAffiliations?: CoachAffiliation[];
  athletesTrainedCount?: number;
  mlbSigningsCount?: number;
  rating?: number;
  verifiedGlovall?: boolean;
  availabilityStatus?: 'disponible_inmediato' | 'parcial_consultoria' | 'exclusivo';
  
  // Trayectoria Profesional del Entrenador
  academyExperienceHistory?: CoachAcademyExperience[];
  playerMentorships?: CoachPlayerMentorship[];
  eventParticipations?: CoachEventParticipation[];
}

export type GlobalCoachProfile = CoachStaff;

export type StaffMember = CoachStaff;


export interface BaseballIqQuestion {
  id: string;
  topic: 'Conteo & Bateo' | 'Corring de Bases' | 'Posicionamiento Defensivo' | 'Reglas MLB' | 'Estrategia de Pitcheo';
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  situation: string;
  count?: string;
  runners?: string;
  outs?: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  mlbExample?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  category: 'Baseball IQ' | 'Inglés para Peloteros' | 'Nutrición & Cuidado Físico' | 'Salud Mental & Scout Interview' | 'Reglas & Contratos';
  lessonsCount: number;
  durationMinutes: number;
  thumbnail: string;
  instructor: string;
  description: string;
  level: 'Prospecto Inicial' | 'Clase Firma' | 'Élite';
}

export interface ShowcaseEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  city?: string;
  country?: string;
  category: 'Showcase Internacional' | 'Evaluación TrackMan' | 'Combine Físico Láser' | 'Juego Simulado Live BP' | 'Torneo Invitacional' | 'Tryout Abierto MLB' | string;
  organizer?: string;
  source: 'glovall_official' | 'community_suggested';
  approvalStatus: 'approved_published' | 'pending_review' | 'rejected';
  suggestedByAcademyName?: string;
  suggestedByAcademyId?: string;
  suggestedDate?: string;
  attendingScoutsCount?: number;
  confirmedScoutsCount?: number;
  organizationsCount?: number;
  registeredPlayersIds?: string[];
  participatingPlayerIds?: string[];
  status: 'upcoming' | 'live' | 'completed';
  description: string;
  schedule?: Array<{ time: string; activity: string; responsible: string }>;
  scoutsAttending?: Array<{ scoutName: string; organization: string }>;
  targetClasses?: string[];
  contactEmail?: string;
  contactPhone?: string;
  officialVerificationCode?: string;
}


export interface RadioPelotaEpisode {
  id: string;
  title: string;
  host: string;
  duration: string;
  category: 'Cápsula Mental' | 'Scouting Insights' | 'Entrevistas MLB' | 'Nutrición';
  audioUrl: string;
  date: string;
  description: string;
  listensCount: number;
}

export interface MlbBenchmark {
  id?: string;
  name: string;
  team: string;
  jerseyNumber?: number;
  position: string;
  bats?: string;
  throws?: string;
  photo: string;
  wOBA: number;
  ops: number;
  sprintSpeedFtSec: number;
  maxExitVeloMph: number;
  exitVelocityMaxMph?: number;
  batSpeedMph?: number;
  hardHitPercent: number;
  barrelPercent: number;
  description: string;
}


export interface RbacPermission {
  module: string;
  action: string;
  admin: boolean;   // Director
  staff: boolean;   // Entrenador
  scout: boolean;   // Scout MLB
  player: boolean;  // Jugador
  notes: string;
}

export interface PlayerOutcomeReport {
  playerId: string;
  status: 'Evaluado Destacado' | 'Seguimiento Solicitado' | 'Participó' | 'Entrevista Realizada' | 'Reporte Favorable';
  sixtyYards?: string;
  exitVelo?: string;
  armSpeed?: string;
  popTime?: string;
  interestedOrganizations: string[];
  scoutInterviewsOrNotes?: string;
  coachSummary?: string;
}

export interface AcademyShowcasePlan {
  id: string;
  eventId?: string; // Reference to official/community event
  eventTitle: string;
  category: string;
  date: string;
  time?: string;
  location: string;
  city?: string;
  country?: string;
  status: 'En Preparación' | 'Confirmado' | 'Finalizado';
  assignedCoachIds: string[];
  assignedPlayerIds: string[];
  preparationGoals: string;
  drillsFocus?: string[];
  playerOutcomes?: Record<string, PlayerOutcomeReport>;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

