import {
  Player,
  CoachingSessionRecord,
  FormalEducation,
  NonFormalCourse,
  MetricMeasurementRecord,
  AcademyHistoryRecord,
  TournamentAwardRecord,
  PlayerFamilyEligibility,
  PlayerShowcaseParticipation,
  VideoClip,
  TrajectoryProgram,
  AcademySolicitude,
  AffiliationAuditEvent,
  TrajectoryTournament,
  TrajectoryMetricRecord,
  TrajectoryEducationYear,
  TrajectoryCourseItem,
} from '../types';

export function hydratePlayer(raw: Player): Player {
  const isPitcher = raw.position === 'LHP' || raw.position === 'RHP';
  const isCatcher = raw.position === 'C';
  const isInfield = ['SS', '2B', '3B', '1B'].includes(raw.position);
  const isOutfield = raw.position === 'OF' || raw.position === 'UTIL';

  // 1. Family & Eligibility
  const familyAndEligibility: PlayerFamilyEligibility = raw.familyAndEligibility || {
    birthCity: raw.hometown.split(',')[0] || 'Santo Domingo',
    birthCountry: raw.nationality || 'República Dominicana',
    birthHospitalOrRegistry: `Hospital Regional de ${raw.hometown.split(',')[0]} (Registro Civil 1ra Circ.)`,
    currentResidenceAddress: `Residencia de Prospectos Caribe Academy, Calle Las Palmas #18`,
    currentResidenceCity: `Boca Chica / ${raw.hometown.split(',')[0]}`,
    currentResidenceCountry: 'República Dominicana',
    personalInterestsAndHobbies: [
      'Ajedrez táctico y análisis de juego',
      'Música instrumental y producción urbana',
      'Natación y movilidad articular en playa',
      'Videojuegos competitivos (MLB The Show)',
    ],
    languagesSpoken: ['Español (Nativo)', 'Inglés (Intermedio A2/B1 - En curso en Glovall)'],
    offFieldAspirations: 'Estudiar Administración Deportiva o Negocios Internacionales',
    favoriteMusicGenre: 'Merengue típico, Bachata tradicional y Trap latino',
    favoriteFoods: 'Mangú con tres golpes, Pescado al coco con tostones y pechuga a la plancha',
    roleModelOutsideBaseball: 'Sus padres y Pedro Martínez por su labor filantrópica',
    father: {
      fullName: `José ${raw.fullName.split(' ')[raw.fullName.split(' ').length - 2] || 'Manuel'} ${raw.fullName.split(' ').pop() || 'Valdez'}`,
      relationship: 'Padre',
      nationality: 'República Dominicana',
      birthPlace: raw.hometown,
      currentResidence: raw.hometown,
      occupation: 'Comerciante / Técnico Agroindustrial',
      phone: '+1 (829) 555-' + Math.floor(1000 + Math.random() * 9000),
      hasPassport: true,
      passportCountry: 'República Dominicana',
      idDocumentNumber: `023-${Math.floor(1000000 + Math.random() * 9000000)}-4`,
    },
    mother: {
      fullName: `María Elena ${raw.fullName.split(' ').pop() || 'Morales'} de ${raw.fullName.split(' ')[raw.fullName.split(' ').length - 2] || 'Pérez'}`,
      relationship: 'Madre',
      nationality: raw.id.endsWith('3') || raw.id.endsWith('7') ? 'Venezuela / Dominicana' : 'República Dominicana',
      birthPlace: raw.id.endsWith('3') || raw.id.endsWith('7') ? 'Valencia, Venezuela' : raw.hometown,
      currentResidence: raw.hometown,
      occupation: 'Licenciada en Educación / Enfermera',
      phone: '+1 (849) 555-' + Math.floor(1000 + Math.random() * 9000),
      hasPassport: true,
      passportCountry: 'República Dominicana',
      idDocumentNumber: `023-${Math.floor(1000000 + Math.random() * 9000000)}-1`,
    },
    legalGuardianSameAsParent: true,
    tutorConsentVideo: {
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80',
      tutorName: `José ${raw.fullName.split(' ').pop() || 'Valdez'}`,
      tutorRelationship: 'Padre',
      tutorIdDocument: `023-${Math.floor(1000000 + Math.random() * 9000000)}-4`,
      recordedDate: '2026-06-15',
      durationFormatted: '1:40 min',
      notaryOrLawyerName: 'Lic. Fernando Taveras (Notaría Pública Distrito Nacional)',
      statementSummary: 'Consentimiento jurado en video para firma profesional MLB, patria potestad y representación legal.',
      status: raw.verificationStatus === 'pending_video' ? 'en_revision' : 'verificado',
      documentSignedAttached: true,
    },
    eligibleNationalTeams: [
      {
        id: 'team-dom',
        country: 'República Dominicana',
        flagEmoji: '🇩🇴',
        basis: 'Nacimiento',
        status: 'confirmado',
        federationCode: 'FEDOBE / WBSC-DOM',
        notes: 'Elegible de pleno derecho por nacimiento y padre dominicano.',
      },
      ...(raw.id.endsWith('3') || raw.id.endsWith('7')
        ? [
            {
              id: 'team-ven',
              country: 'Venezuela',
              flagEmoji: '🇻🇪',
              basis: 'Madre' as const,
              status: 'apto' as const,
              federationCode: 'FEVEBEISBOL / WBSC-VEN',
              notes: 'Elegible por línea materna directa.',
            },
          ]
        : [
            {
              id: 'team-pan',
              country: 'Panamá / Caribe',
              flagEmoji: '🇵🇦',
              basis: 'Doble Nacionalidad' as const,
              status: 'apto' as const,
              federationCode: 'FEDEBEIS',
              notes: 'Elegible para torneos confederados del Caribe.',
            },
          ]),
    ],
    passportsAvailable: [
      {
        id: 'pass-1',
        country: 'República Dominicana',
        passportNumberMasked: `DO-RD${Math.floor(800000 + Math.random() * 190000)}`,
        expirationDate: '2032-05-20',
        hasUsVisa: true,
        visaType: 'B1/B2 Turista & Atleta (Válida hasta 2035)',
      },
    ],
  };

  // 2. Coaching Sessions (Position-Tailored)
  let coachingSessions: CoachingSessionRecord[] = raw.coachingSessions || [];

  if (!coachingSessions || coachingSessions.length === 0) {
    if (isPitcher) {
      coachingSessions = [
        {
          id: `cs-${raw.id}-1`,
          date: '2026-08-18',
          time: '08:30 AM',
          coachName: 'Nelson Peña',
          coachRole: 'Coordinador de Pitcheo & Biomecánica',
          trainingArea: 'Pitcheo & Bullpen',
          drillsCompleted: 'Bullpen de 45 lanzamientos con TrackMan. Medición de spin rate en recta de 4 costuras y túnel del cambio de velocidad. Drills de toalla para extensión del brazo.',
          durationMinutes: 70,
          evaluationRating: 'Excelente',
          performanceScore: 9.4,
          coachFeedback: 'Excelente retención de la bola y soltada consistente en 6.4 pies de extensión. El cambio tuvo 14 pulgadas de caída horizontal.',
          nextStepGoal: 'Ajustar la rotación del slider para evitar que quede alto en conteo de 2 strikes.',
          mediaEvidence: [
            {
              id: `med-${raw.id}-1`,
              type: 'video',
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              thumbnailUrl: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=600&q=80',
              title: 'Bullpen TrackMan - Análisis de Soltada 120 FPS',
              fpsOrFormat: '120 FPS Slow-Mo',
              notes: 'Punto de liberación a 5.9 pies con ángulo de ataque empinado.',
            },
            {
              id: `med-${raw.id}-2`,
              type: 'image',
              url: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=800&q=80',
              thumbnailUrl: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=400&q=80',
              title: 'Foto Biomecánica de Codo y Hombro',
              fpsOrFormat: 'Foto Diagnóstica HD',
              notes: 'Alineación perfecta del codo a 90 grados al momento del aterrizaje.',
            },
          ],
        },
        {
          id: `cs-${raw.id}-2`,
          date: '2026-08-14',
          time: '09:00 AM',
          coachName: 'Miguel Ángel Batista',
          coachRole: 'Preparador Físico / S&C',
          trainingArea: 'Cuidado de Brazo & Biomecánica',
          drillsCompleted: 'Protocolo J-Bands de calentamiento, trabajo con balones pliométricos de 1kg y 2kg en pared, rutina de desaceleración y manguito rotador.',
          durationMinutes: 60,
          evaluationRating: 'Favorable',
          performanceScore: 9.0,
          coachFeedback: 'Gran respuesta en los test de fuerza excéntrica del hombro. Cero inflamación post-lanzamiento.',
          nextStepGoal: 'Mantener flexibilidad de escápulas durante toda la semana.',
          mediaEvidence: [
            {
              id: `med-${raw.id}-3`,
              type: 'video',
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
              thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
              title: 'Rutina Pliométrica de Hombro',
              fpsOrFormat: '60 FPS HD',
              notes: 'Desaceleración controlada con balones de peso.',
            },
          ],
        },
        {
          id: `cs-${raw.id}-3`,
          date: '2026-08-09',
          time: '04:00 PM',
          coachName: 'Prof. Alberto Santana',
          coachRole: 'Director de Baseball IQ',
          trainingArea: 'Baseball IQ & Táctica',
          drillsCompleted: 'Simulación de secuencias de pitcheo con corredores en base y conteos 2-1 y 3-2 en sala de video interactiva.',
          durationMinutes: 45,
          evaluationRating: 'Excelente',
          performanceScore: 9.6,
          coachFeedback: 'Excelente lectura de debilidades de los bateadores en la zona interna.',
          nextStepGoal: 'Coordinación de tiempos de entrega al plato frente a corredores veloces.',
        },
      ];
    } else if (isCatcher) {
      coachingSessions = [
        {
          id: `cs-${raw.id}-1`,
          date: '2026-08-17',
          time: '08:00 AM',
          coachName: 'Danilo Encarnación',
          coachRole: 'Instructor de Receptores & Infield',
          trainingArea: 'Defensa & Infield/OF',
          drillsCompleted: 'Rutina de pop-time a segunda base con cronómetro láser (60 tiros). Drills de transferencia rápida y pie izquierdo hacia el objetivo.',
          durationMinutes: 75,
          evaluationRating: 'Excelente',
          performanceScore: 9.5,
          coachFeedback: `Pop time promedio registrado en ${raw.metrics.popTimeSec || 1.88} seg con tiros al pecho del segunda base. Transferencia limpia de manos.`,
          nextStepGoal: 'Pulir bloqueo lateral en lanzamientos con quiebre que botan en la tierra.',
          mediaEvidence: [
            {
              id: `med-${raw.id}-1`,
              type: 'video',
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              thumbnailUrl: 'https://images.unsplash.com/photo-1562077772-3ab125463375?auto=format&fit=crop&w=600&q=80',
              title: `Tiro a Segunda Base - Pop Time Láser ${raw.metrics.popTimeSec || 1.88}s`,
              fpsOrFormat: '120 FPS Slow-Mo',
              notes: 'Transferencia a 0.65 seg y tiro en línea sin parábola.',
            },
          ],
        },
        {
          id: `cs-${raw.id}-2`,
          date: '2026-08-13',
          time: '09:30 AM',
          coachName: 'Carlos Rosario',
          coachRole: 'Director de Bateo',
          trainingArea: 'Bateo & Swing',
          drillsCompleted: 'Jaula de bateo: reconocimiento de pitcheos rompientes exteriores y trabajo con máquina a 90 MPH. Enfoque en líneas hacia el callejón central.',
          durationMinutes: 60,
          evaluationRating: 'Favorable',
          performanceScore: 8.9,
          coachFeedback: 'Buen contacto al centro del campo con salida constante por encima de 96 MPH.',
          nextStepGoal: 'Mantener peso cargado en la pierna trasera ante curvas lentas.',
        },
        {
          id: `cs-${raw.id}-3`,
          date: '2026-08-08',
          time: '03:30 PM',
          coachName: 'Danilo Encarnación',
          coachRole: 'Instructor de Receptores',
          trainingArea: 'Baseball IQ & Táctica',
          drillsCompleted: 'Estudio de cartas de tiro y señas de juego para guiar al cuerpo de abridores juveniles.',
          durationMinutes: 45,
          evaluationRating: 'Excelente',
          performanceScore: 9.7,
          coachFeedback: 'Excelente voz de mando y liderazgo natural detrás del plato.',
          nextStepGoal: 'Optimización de señas con corredores en segunda base.',
        },
      ];
    } else {
      // Infield or Outfield Hitters
      coachingSessions = [
        {
          id: `cs-${raw.id}-1`,
          date: '2026-08-18',
          time: '08:30 AM',
          coachName: 'Carlos Rosario',
          coachRole: 'Director de Bateo & Hitting Coach',
          trainingArea: 'Bateo & Swing',
          drillsCompleted: `Sesión de jaula con máquina a 90 MPH. Drills de tee alto y bajo para consistencia de plano de bateo. 70 contactos registrados con salida promedio de ${raw.metrics.exitVelocityMph} MPH.`,
          durationMinutes: 75,
          evaluationRating: 'Excelente',
          performanceScore: 9.3,
          coachFeedback: `Gran rotación de caderas y retención del hombro delantero. Salidas potentes con ángulo de ${raw.metrics.launchAngleAvgDeg || 16} grados hacia el jardín central.`,
          nextStepGoal: 'Seguir ajustando el reconocimiento de pitcheos rompientes en conteos de 2 strikes.',
          mediaEvidence: [
            {
              id: `med-${raw.id}-1`,
              type: 'video',
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              thumbnailUrl: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=600&q=80',
              title: `BP Live - ${raw.metrics.exitVelocityMph} MPH EV en Jaula`,
              fpsOrFormat: '120 FPS Slow-Mo',
              notes: 'Mecánica de swing balanceada con aceleración de manos.',
            },
            {
              id: `med-${raw.id}-2`,
              type: 'image',
              url: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=800&q=80',
              thumbnailUrl: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=400&q=80',
              title: 'Foto Técnica - Punto de Contacto y Extensión',
              fpsOrFormat: 'Foto HD',
              notes: 'Barril de bate perfectamente alineado a la trayectoria de la pelota.',
            },
          ],
        },
        {
          id: `cs-${raw.id}-2`,
          date: '2026-08-15',
          time: '09:45 AM',
          coachName: isInfield ? 'Danilo Encarnación' : 'Miguel Ángel Batista',
          coachRole: isInfield ? 'Especialista en Infield' : 'Coordinador de Outfield & Velocidad',
          trainingArea: 'Defensa & Infield/OF',
          drillsCompleted: isInfield
            ? '80 roletazos de rutina, revés y a mano limpia. Transición rápida y tiros al pecho de primera base con radar.'
            : '60 elevados con máquina de fungo hacia los callejones, lecturas de primer paso y tiros al home plate.',
          durationMinutes: 65,
          evaluationRating: 'Excelente',
          performanceScore: 9.1,
          coachFeedback: isInfield
            ? 'Excelente juego de pies y suavidad de manos. Tiempo de tiro promedio en 0.74 seg.'
            : `Rutas directas a la bola y tiros certeros a 90+ MPH al home plate.`,
          nextStepGoal: isInfield ? 'Ajustar tiro en carrera sobre la marcha.' : 'Mejorar corte y tiro al intermediario.',
          mediaEvidence: [
            {
              id: `med-${raw.id}-3`,
              type: 'video',
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
              thumbnailUrl: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?auto=format&fit=crop&w=600&q=80',
              title: isInfield ? 'Drills de Fildeo de Revés en el Campo' : 'Lectura de Elevados & Tiro a 3B',
              fpsOrFormat: '60 FPS HD',
              notes: 'Footwork ágil y transferencia sin pasos innecesarios.',
            },
          ],
        },
        {
          id: `cs-${raw.id}-3`,
          date: '2026-08-11',
          time: '07:30 AM',
          coachName: 'Prof. Yovanny Batista',
          coachRole: 'Preparador Físico & Velocidad',
          trainingArea: 'Fuerza, Velocidad & Físico',
          drillsCompleted: `Series de aceleración de 10, 30 y 60 yardas con cronómetro láser. Trabajo de pliometría de cajón y trineo con resistencia de 15 kg.`,
          durationMinutes: 75,
          evaluationRating: 'Favorable',
          performanceScore: 8.9,
          coachFeedback: `Excelente tiempo de reacción en los primeros 10 metros. Marca sostenida de ${raw.metrics.sixtyYardDashSec}s en 60 yardas.`,
          nextStepGoal: 'Mayor dorsiflexión de tobillo en la zancada de aceleración.',
        },
      ];
    }
  }

  // 3. Formal Education
  const formalEducation: FormalEducation[] = raw.formalEducation && raw.formalEducation.length > 0
    ? raw.formalEducation
    : [
        {
          id: `edu-${raw.id}-1`,
          level: 'Secundaria / Bachillerato',
          institution: `Liceo Cristiano de ${raw.hometown.split(',')[0]}`,
          currentGradeOrYear: raw.age <= 15 ? '3er Grado de Secundaria (9th Grade)' : '4to de Secundaria (10th Grade)',
          status: 'en_curso',
          gpaOrAverage: '89/100 (Muy Bueno)',
          cityCountry: `${raw.hometown.split(',')[0]}, RD`,
          graduationYearExpected: raw.age <= 15 ? '2028' : '2027',
          notes: 'Horario académico matutino coordinado con entrenamientos de la academia.',
        },
        {
          id: `edu-${raw.id}-2`,
          level: 'Primaria & Básica',
          institution: `Escuela Primaria Central de ${raw.hometown.split(',')[0]}`,
          currentGradeOrYear: 'Completado (8vo Grado)',
          status: 'completado',
          gpaOrAverage: '87/100',
          cityCountry: `${raw.hometown.split(',')[0]}, RD`,
        },
      ];

  // 4. Non-Formal Courses
  const nonFormalCourses: NonFormalCourse[] = raw.nonFormalCourses && raw.nonFormalCourses.length > 0
    ? raw.nonFormalCourses
    : [
        {
          id: `nfc-${raw.id}-1`,
          title: 'Inglés Práctico & Entrevistas para Prospectos MLB (Nivel A2/B1)',
          category: 'Idiomas',
          institution: 'Glovall Language & EdTech Program',
          completionYear: '2026',
          hoursCount: 50,
          status: 'completado',
          certificateCode: `GLV-ENG-${raw.id.toUpperCase()}-2026`,
          skillsLearned: ['Entrevistas con Scouts MLB', 'Terminología táctica en inglés', 'Expresión fluida'],
        },
        {
          id: `nfc-${raw.id}-2`,
          title: 'Nutrición Deportiva & Suplementación Segura',
          category: 'Nutrición & Salud',
          institution: 'MLB Player Development Institute',
          completionYear: '2025',
          hoursCount: 25,
          status: 'completado',
          certificateCode: `NUTRI-GLV-${raw.id.toUpperCase()}`,
          skillsLearned: ['Hidratación pre/post partido', 'Aumento de masa magra'],
        },
        {
          id: `nfc-${raw.id}-3`,
          title: 'Educación Financiera y Gestión Patrimonial para Atletas',
          category: 'Finanzas para Atletas',
          institution: 'Glovall Leadership Series',
          completionYear: '2026',
          hoursCount: 20,
          status: 'en_progreso',
        },
      ];

  // 5. Metric Measurement History
  const measurementHistory: MetricMeasurementRecord[] = raw.measurementHistory && raw.measurementHistory.length > 0
    ? raw.measurementHistory
    : [
        {
          id: `meas-${raw.id}-1`,
          date: '2026-07-28',
          eventName: 'Combine Oficial TrackMan Quisqueya',
          verifiedByTool: 'TrackMan',
          exitVelocityMph: raw.metrics.exitVelocityMph,
          armVelocityMph: raw.metrics.armVelocityMph,
          sixtyYardDashSec: raw.metrics.sixtyYardDashSec,
          popTimeSec: raw.metrics.popTimeSec,
          fastballVeloMaxMph: raw.metrics.fastballVeloMaxMph,
          batSpeedMph: raw.metrics.batSpeedMph,
          notes: 'Evaluación oficial con tecnología de radar TrackMan y cronometraje láser.',
        },
        {
          id: `meas-${raw.id}-2`,
          date: '2026-05-15',
          eventName: 'Evaluación Intermedia Primavera Caribe Academy',
          verifiedByTool: 'Rapsodo Pro',
          exitVelocityMph: Math.max(80, raw.metrics.exitVelocityMph - 2.2),
          armVelocityMph: Math.max(78, raw.metrics.armVelocityMph - 1.8),
          sixtyYardDashSec: Number((raw.metrics.sixtyYardDashSec + 0.08).toFixed(2)),
          popTimeSec: raw.metrics.popTimeSec ? Number((raw.metrics.popTimeSec + 0.04).toFixed(2)) : undefined,
          fastballVeloMaxMph: raw.metrics.fastballVeloMaxMph ? raw.metrics.fastballVeloMaxMph - 1.5 : undefined,
          batSpeedMph: raw.metrics.batSpeedMph ? raw.metrics.batSpeedMph - 1.8 : undefined,
          notes: 'Progreso notable en velocidad de salida y aceleración.',
        },
        {
          id: `meas-${raw.id}-3`,
          date: '2026-01-20',
          eventName: 'Test Diagnóstico Inicial de Temporada',
          verifiedByTool: 'Laser Stalker',
          exitVelocityMph: Math.max(76, raw.metrics.exitVelocityMph - 4.5),
          armVelocityMph: Math.max(75, raw.metrics.armVelocityMph - 3.5),
          sixtyYardDashSec: Number((raw.metrics.sixtyYardDashSec + 0.18).toFixed(2)),
          notes: 'Línea de base al ingresar al ciclo de entrenamientos 2026.',
        },
      ];

  // 6. Academy History
  const academyHistory: AcademyHistoryRecord[] = raw.academyHistory && raw.academyHistory.length > 0
    ? raw.academyHistory
    : [
        {
          id: `acad-${raw.id}-1`,
          academyName: 'Caribe Baseball Academy',
          categoryOrRole: 'Programa Élite de Desarrollo Internacional',
          period: '2024 - Presente',
          headCoach: 'Carlos Rosario & Nelson Peña',
          location: 'Boca Chica, Santo Domingo, RD',
          transitionReason: 'Incorporación al programa de preparación para firma profesional',
          highlights: 'Mejoró marcas físicas en un 12% y perfeccionó mecánica técnica.',
        },
        {
          id: `acad-${raw.id}-2`,
          academyName: `Liga Municipal de ${raw.hometown.split(',')[0]}`,
          categoryOrRole: 'Categorías Menores (Infantil / Pre-Juvenil)',
          period: '2019 - 2023',
          headCoach: 'Prof. Domingo Santana',
          location: `${raw.hometown.split(',')[0]}, RD`,
          transitionReason: 'Pase a academia de alto rendimiento',
          highlights: 'Seleccionado al equipo de estrellas regional en 3 ocasiones.',
        },
      ];

  // 7. Tournaments & Awards
  const tournamentsAndAwards: TournamentAwardRecord[] = raw.tournamentsAndAwards && raw.tournamentsAndAwards.length > 0
    ? raw.tournamentsAndAwards
    : [
        {
          id: `tr-${raw.id}-1`,
          tournamentName: 'PG Caribbean Select Showcase',
          year: '2026',
          teamOrSelection: 'Caribe Academy All-Stars',
          positionPlayed: raw.position,
          location: 'Santo Domingo, RD',
          distinctions: [`Top Prospect Award Clase ${raw.signingClass}`, 'Destacado por Scouts MLB'],
          statsSummary: 'Evaluación élite en velocidad, métricas de TrackMan y Baseball IQ.',
        },
        {
          id: `tr-${raw.id}-2`,
          tournamentName: 'Campeonato Nacional Juvenil FEDOBE',
          year: '2025',
          teamOrSelection: `Selección Provincial ${raw.hometown.split(',')[0]}`,
          positionPlayed: raw.position,
          location: 'Santiago de los Caballeros, RD',
          distinctions: ['Subcampeón Nacional', 'All-Star Team'],
          statsSummary: 'Rendimiento sobresaliente en playoffs del torneo.',
        },
      ];

  // 7b. Showcase History & Tryouts Participation
  const showcaseHistory: PlayerShowcaseParticipation[] = raw.showcaseHistory && raw.showcaseHistory.length > 0
    ? raw.showcaseHistory
    : [
        {
          id: `sh-${raw.id}-1`,
          eventTitle: 'National Showcase Internacional Quisqueya 2026',
          eventCategory: 'Showcase Internacional',
          date: '2026-08-12',
          location: 'Estadio Quisqueya Juan Marichal',
          city: 'Santo Domingo',
          country: 'República Dominicana',
          source: 'glovall_official',
          status: 'Evaluado Destacado',
          metricsRecorded: [
            {
              metricName: 'Velocidad de Salida (Exit Velo)',
              value: `${raw.metrics.exitVelocityMph} MPH`,
              benchmarkRating: 'TrackMan Stadium Verificado',
            },
            {
              metricName: 'Sprint 60 Yardas Láser',
              value: `${raw.metrics.sixtyYardDashSec} seg`,
              benchmarkRating: 'Láser Brower Timing',
            },
            {
              metricName: isPitcher ? 'Fastball Máx (Radar)' : 'Fuerza de Brazo (Arm Velo)',
              value: isPitcher ? `${raw.metrics.fastballVeloMaxMph || 94} MPH` : `${raw.metrics.armVelocityMph} MPH`,
              benchmarkRating: 'Stalker Pro II+',
            },
            ...(isCatcher
              ? [
                  {
                    metricName: 'Pop Time a 2B',
                    value: `${raw.metrics.popTimeSec || 1.88} seg`,
                    benchmarkRating: 'Oficial TrackMan',
                  },
                ]
              : []),
          ],
          interestedOrganizations: [
            'New York Yankees',
            'Los Angeles Dodgers',
            'San Diego Padres',
            'Toronto Blue Jays',
          ],
          scoutInterviewsOrNotes:
            'Entrevista realizada con el Director de Scouting Internacional. Gran madurez en respuestas, fluidez en inglés técnico y alta disposición a la disciplina de granja.',
          coachSummary:
            'Demostró poder natural hacia la banda opuesta en las 4 rondas de BP y solidez defensiva en los 6 rodados evaluados.',
        },
        {
          id: `sh-${raw.id}-2`,
          eventTitle: 'Combine de Velocidad & Poder del Caribe',
          eventCategory: 'Combine Élite',
          date: '2026-07-20',
          location: 'Complejo Deportivo Boca Chica',
          city: 'Boca Chica',
          country: 'República Dominicana',
          source: 'glovall_official',
          status: 'Reporte Favorable',
          metricsRecorded: [
            {
              metricName: 'Velocidad de Salida',
              value: `${Math.round((raw.metrics.exitVelocityMph - 1.2) * 10) / 10} MPH`,
              benchmarkRating: 'TrackMan Oficial',
            },
            {
              metricName: 'Sprint 60 Yardas',
              value: `${(raw.metrics.sixtyYardDashSec + 0.04).toFixed(2)} seg`,
              benchmarkRating: 'Láser Electrónico',
            },
          ],
          interestedOrganizations: ['Tampa Bay Rays', 'Houston Astros', 'Boston Red Sox'],
          scoutInterviewsOrNotes:
            'Monitoreo activo para confirmación de clase de firma internacional.',
          coachSummary:
            'Excelente rendimiento bajo presión ante más de 45 scouts presentes en las gradas.',
        },
        {
          id: `sh-${raw.id}-3`,
          eventTitle: 'Tryout Evaluativo Regional Cibao',
          eventCategory: 'Tryout Abierto',
          date: '2026-05-18',
          location: 'Estadio Cibao',
          city: 'Santiago de los Caballeros',
          country: 'República Dominicana',
          source: 'community_suggested',
          status: 'Participó',
          metricsRecorded: [
            {
              metricName: 'Sprint 60 Yardas',
              value: `${(raw.metrics.sixtyYardDashSec + 0.08).toFixed(2)} seg`,
              benchmarkRating: 'Cronómetro Doble',
            },
            {
              metricName: 'Prueba de Bateo en Vivo',
              value: '3 Hits en 4 Turnos Live',
              benchmarkRating: 'Enfrentamiento Real',
            },
          ],
          interestedOrganizations: ['Miami Marlins', 'Philadelphia Phillies'],
          scoutInterviewsOrNotes: 'Seguimiento solicitado para el próximo showcase internacional.',
          coachSummary: 'Buen contacto consistente y sólida presencia en la caja de bateo.',
        },
      ];

  // 8. Video Clips
  const videoClips: VideoClip[] = raw.videoClips && raw.videoClips.length > 0
    ? raw.videoClips.map((v) => ({ ...v, source: v.source || 'academy_verified' }))
    : [
        {
          id: `vc-${raw.id}-1`,
          title: isPitcher
            ? `Sesión de Bullpen - Recta ${raw.metrics.fastballVeloMaxMph || 94} MPH`
            : `BP Live Session - ${raw.metrics.exitVelocityMph} MPH EV`,
          category: isPitcher ? 'Bullpen' : 'Bateo (BP)',
          thumbnail: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=400&q=80',
          duration: '1:45',
          date: '2026-08-05',
          biomechanicsVerified: true,
          notes: 'Análisis biomecánico validado con TrackMan.',
          source: 'academy_verified',
        },
        {
          id: `vc-${raw.id}-2`,
          title: isCatcher
            ? `Tiros a Segunda Base - Pop Time ${raw.metrics.popTimeSec || 1.88}s`
            : `60 Yard Dash Láser - ${raw.metrics.sixtyYardDashSec}s`,
          category: isCatcher ? 'Defensa & Tiro' : '60 Yardas',
          thumbnail: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=400&q=80',
          duration: '0:40',
          date: '2026-07-28',
          biomechanicsVerified: true,
          notes: 'Cronometraje láser y alta frecuencia de paso.',
          source: 'academy_verified',
        },
      ];

  // 9. Trackman Data
  const trackmanData = raw.trackmanData || {
    maxDistanceFt: Math.round(370 + (raw.metrics.exitVelocityMph - 90) * 4),
    hardHitPercentage: Math.min(85, Math.round(55 + (raw.metrics.exitVelocityMph - 90) * 1.5)),
    sweetSpotPercentage: 42.5,
    zoneContactPercentage: 82.0,
  };

  // 10. Trajectory Direct Management (Platform Parity)
  const trajectoryPrograms: TrajectoryProgram[] = raw.trajectoryPrograms && raw.trajectoryPrograms.length > 0
    ? raw.trajectoryPrograms
    : [
        {
          id: `tp-${raw.id}-1`,
          name: 'Erik Hernandez Baseball Academy - Tetero',
          coach: 'Erik Hernandez',
          type: 'Residencia',
          startDate: '1/4/2026',
          status: 'activo',
          note: 'Entrenamiento de bateo de poder, acondicionamiento y showcases MLB.',
          location: 'San Pedro de Macorís, RD',
          directorName: 'Erik Hernández',
          categoryOrRole: 'Prospecto Titular Programa Élite',
          scholarshipCoverage: 'Beca 100% Residencial, Alimentación y Preparación Física',
          signedByTutor: true,
          tutorSignerName: 'José Valdez (Padre & Tutor Legal)',
        },
        {
          id: `tp-${raw.id}-2`,
          name: 'Academia La Javilla',
          coach: 'John Carmona',
          type: 'Entrenamiento de Showcases, Cajas de Bateo',
          startDate: '15/01/2025',
          endDate: '06/02/2026',
          status: 'finalizado',
          note: 'Culminación exitosa del programa formativo sub-15 y pase a residencia intensiva.',
          location: 'Santo Domingo Este, RD',
          directorName: 'John Carmona',
          categoryOrRole: 'Programa de Desarrollo Juvenil Sub-15',
          transitionReason: 'Carta de Libertad emitida por mutuo acuerdo tras cumplir metas de desarrollo y pase a programa de firma internacional.',
          hasReleaseLetter: true,
          releaseLetterCode: 'CL-JAV-2026-041',
          releaseDate: '06/02/2026',
          releaseLetterUrl: 'https://glovall.com/certificates/CL-JAV-2026-041.pdf',
          scholarshipCoverage: 'Beca Deportiva Parcial (80%)',
          signedByTutor: true,
          tutorSignerName: 'José Valdez',
        },
        {
          id: `tp-${raw.id}-3`,
          name: 'Caribe Baseball Academy',
          coach: 'Carlos Rosario',
          type: 'Infield & Defensa Élite',
          startDate: '01/08/2024',
          endDate: '10/01/2025',
          status: 'finalizado',
          note: 'Especialización defensiva en campocorto con métricas TrackMan verificadas.',
          location: 'Boca Chica, RD',
          directorName: 'Lic. Rafael Almonte',
          categoryOrRole: 'Módulo Intensivo de Campocorto',
          transitionReason: 'Constancia de culminación de módulo técnico y liberación de derechos federativos.',
          hasReleaseLetter: true,
          releaseLetterCode: 'CL-CBA-2025-118',
          releaseDate: '10/01/2025',
          releaseLetterUrl: 'https://glovall.com/certificates/CL-CBA-2025-118.pdf',
          scholarshipCoverage: 'Beca de Alto Rendimiento 100%',
          signedByTutor: true,
          tutorSignerName: 'José Valdez',
        },
      ];

  const academyRequests: AcademySolicitude[] = raw.academyRequests && raw.academyRequests.length > 0
    ? raw.academyRequests
    : [
        {
          id: `req-${raw.id}-1`,
          academyId: 'acad-marrero',
          academyName: 'Marrero Baseball Complex',
          academyLogo: '🏟️',
          academyLocation: 'Villa Mella / Guerra, RD',
          directorName: 'Christian Marrero',
          directorRole: 'Director General & Ex-Scout MLB',
          scoutContact: 'scouting@marrerobaseball.com • +1 (809) 555-8821',
          programOffered: 'Programa Élite de Residencia & Firma Internacional 2026',
          programType: 'Residencia',
          scholarshipOffer: 'Beca 100% Completa (Residencia, Alimentación, TrackMan, Escolaridad Bilingüe)',
          monthlyAllowance: '$1,200 USD / mes para viáticos y suplementación',
          sentDate: '10/08/2026',
          expirationDate: '30/08/2026',
          status: 'pending',
          glovallRatingScore: 98,
          proposalLetter: 'Estimado prospecto y tutor legal: Tras realizar un seguimiento exhaustivo a sus métricas en Glovall (Exit Velo 98.4 MPH, 60 Yardas en 6.45s) y sus evaluaciones de Baseball IQ, nuestra institución desea formalizar una oferta de vinculación directa para ingresar a nuestro programa de residencia de alta competencia clase 2026 con miras a la ventana de julio 2.',
          clauses: [
            'Alojamiento en villa de prospectos con supervisión 24/7 y chef deportivo.',
            'Acceso ilimitado a tecnología TrackMan Stadium y Rapsodo 3.0.',
            'Participación garantizada en al menos 6 Showcases MLB oficiales durante el ciclo.',
            'Continuidad de estudios académicos secundarios avalados por el MINERD.',
            'Asistencia médica, seguro de lesiones deportivas y fisioterapia preventiva.',
          ],
        },
        {
          id: `req-${raw.id}-2`,
          academyId: 'acad-erik',
          academyName: 'Erik Hernandez Baseball Academy - Tetero',
          academyLogo: '⚾',
          academyLocation: 'San Pedro de Macorís, RD',
          directorName: 'Erik Hernández',
          directorRole: 'Head Director & Trainer',
          programOffered: 'Programa de Residencia & Bateo de Poder',
          programType: 'Residencia',
          scholarshipOffer: 'Beca 100% Integral de Entrenamiento y Residencia',
          monthlyAllowance: '$800 USD / mes',
          sentDate: '25/03/2026',
          expirationDate: '05/04/2026',
          status: 'accepted',
          glovallRatingScore: 95,
          tutorDecisionDate: '01/04/2026',
          tutorDecisionNote: 'Aceptada por común acuerdo familiar con firma de tutor legal.',
          proposalLetter: 'Invitación formal para incorporación prioritaria a la academia para potenciar la fuerza de bateo y velocidad en bases de cara a showcases internacionales.',
          clauses: [
            'Entrenamiento técnico de lunes a sábado en sesiones dobles.',
            'Acompañamiento en eventos de scouting con directores internacionales.',
            'Nutrición y monitoreo antropométrico semanal.',
          ],
        },
        {
          id: `req-${raw.id}-3`,
          academyId: 'acad-santin',
          academyName: 'Rudy Santin International Academy',
          academyLogo: '🌟',
          academyLocation: 'Boca Chica, RD',
          directorName: 'Rudy Santin',
          directorRole: 'Fundador & Director de Operaciones',
          programOffered: 'Módulo Intensivo de Pitcheo y Pitch Design',
          programType: 'Pitcheo Especializado',
          scholarshipOffer: 'Beca 50% con copago mensual de $500 USD',
          sentDate: '12/02/2026',
          expirationDate: '28/02/2026',
          status: 'declined',
          glovallRatingScore: 92,
          tutorDecisionDate: '18/02/2026',
          tutorDecisionNote: 'Rechazada: El jugador se enfoca en posición de campocorto/infield y bateo, no en pitcheo exclusivo, y se priorizan becas integrales 100%.',
          rejectionReason: 'Incompatibilidad de perfil de posición y condiciones de beca no integrales.',
          proposalLetter: 'Propuesta de formación y diseño de lanzamientos biomecánicos en nuestro complejo de Boca Chica.',
          clauses: [
            'Sesiones especializadas de bullpen con cámaras de alta velocidad.',
            'Trabajo de acondicionamiento de hombro y codo con protocolo Driveline.',
          ],
        },
        {
          id: `req-${raw.id}-4`,
          academyId: 'acad-mvp',
          academyName: 'MVP Baseball Academy',
          academyLogo: '🏆',
          academyLocation: 'Santiago de los Caballeros, RD',
          directorName: 'Amaurys Nina',
          directorRole: 'Presidente & Director de Desarrollo',
          programOffered: 'Gira Internacional de Showcases en Florida & Arizona',
          programType: 'Entrenamiento de Showcases',
          scholarshipOffer: 'Beca 100% + Boletos Aéreos + Visado P-1 Atleta',
          sentDate: '05/08/2026',
          expirationDate: '25/08/2026',
          status: 'under_review',
          glovallRatingScore: 97,
          proposalLetter: 'Invitación exclusiva para formar parte del equipo selectivo que viajará a los Estados Unidos para la serie de exhibición ante scouts y directores de scouts de 30 franquicias de Grandes Ligas.',
          clauses: [
            'Cobertura total de trámites consulares y visado deportivo.',
            'Participación en 4 encuentros formales ante novenas universitarias D1.',
            'Seguro médico internacional con cobertura de $250,000 USD.',
          ],
        },
      ];

  const affiliationAuditTrail: AffiliationAuditEvent[] = raw.affiliationAuditTrail && raw.affiliationAuditTrail.length > 0
    ? raw.affiliationAuditTrail
    : [
        {
          id: `audit-${raw.id}-1`,
          timestamp: '10/08/2026, 14:30',
          eventType: 'solicitud_recibida',
          title: 'Solicitud de Reclutamiento Recibida',
          description: 'Marrero Baseball Complex envió una propuesta formal con beca 100% para residencia y firma 2026.',
          academyName: 'Marrero Baseball Complex',
          actor: 'Christian Marrero (Director)',
          badgeColor: 'blue',
          evidenceCode: 'REQ-MB-2026-901',
        },
        {
          id: `audit-${raw.id}-2`,
          timestamp: '05/08/2026, 11:15',
          eventType: 'solicitud_recibida',
          title: 'Invitación a Gira Internacional de Showcases',
          description: 'MVP Baseball Academy remitió propuesta para gira de exhibición en Florida/Arizona.',
          academyName: 'MVP Baseball Academy',
          actor: 'Amaurys Nina (Presidente)',
          badgeColor: 'purple',
          evidenceCode: 'REQ-MVP-2026-302',
        },
        {
          id: `audit-${raw.id}-3`,
          timestamp: '01/04/2026, 09:00',
          eventType: 'vinculacion_inicial',
          title: 'Vinculación Activa Formalizada',
          description: 'El jugador y su tutor firmaron la aceptación del Programa de Residencia en Erik Hernandez Baseball Academy.',
          academyName: 'Erik Hernandez Baseball Academy - Tetero',
          actor: 'José Valdez (Tutor) & Erik Hernández (Director)',
          badgeColor: 'emerald',
          evidenceCode: 'VINC-EH-2026-001',
        },
        {
          id: `audit-${raw.id}-4`,
          timestamp: '06/02/2026, 16:45',
          eventType: 'emision_carta_libertad',
          title: 'Emisión de Carta de Libertad Oficial',
          description: 'Academia La Javilla emitió constancia de desvinculación y Carta de Libertad por mutuo acuerdo.',
          academyName: 'Academia La Javilla',
          actor: 'John Carmona (Director) & Glovall Compliance',
          badgeColor: 'amber',
          evidenceCode: 'CL-JAV-2026-041',
        },
        {
          id: `audit-${raw.id}-5`,
          timestamp: '18/02/2026, 10:20',
          eventType: 'solicitud_rechazada',
          title: 'Oferta Declinada por el Tutor',
          description: 'El tutor legal declinó la oferta de Rudy Santin Academy por priorizar programas de posición e infield.',
          academyName: 'Rudy Santin International Academy',
          actor: 'José Valdez (Tutor)',
          badgeColor: 'rose',
          evidenceCode: 'DEC-RS-2026-012',
        },
      ];

  const trajectoryTournaments: TrajectoryTournament[] = raw.trajectoryTournaments && raw.trajectoryTournaments.length > 0
    ? raw.trajectoryTournaments
    : [
        {
          id: `tt-${raw.id}-1`,
          name: 'Sub 15 Costa Atlantica',
          teamRepresented: 'Academia Cararin',
          startDate: '1 feb 2026',
          endDate: '5 feb 2026',
          resultAward: 'MVP',
          awardType: 'mvp',
          notes: 'Destacado como Jugador Más Valioso con 3 HR y promedio de .512.',
          location: 'Puerto Plata, RD',
        },
        {
          id: `tt-${raw.id}-2`,
          name: 'Tryout Bravos de Atlanta',
          teamRepresented: 'Individual',
          startDate: '31 ene 2026',
          endDate: '-',
          resultAward: 'Participación',
          awardType: 'participation',
          notes: 'Evaluación directa por scouts internacionales de la organización.',
          location: 'Complejo MLB Boca Chica',
        },
        {
          id: `tt-${raw.id}-3`,
          name: 'Torneo Panamericano U-15',
          teamRepresented: 'Selección Nacional',
          startDate: '10 dic 2025',
          endDate: '18 dic 2025',
          resultAward: 'Campeón',
          awardType: 'champion',
          notes: 'Medalla de Oro invicto.',
          location: 'Panamá',
        },
      ];

  const trajectoryMetrics: TrajectoryMetricRecord[] = raw.trajectoryMetrics && raw.trajectoryMetrics.length > 0
    ? raw.trajectoryMetrics
    : [
        {
          id: `tm-${raw.id}-1`,
          discipline: 'BAT',
          metricName: 'Angulo de Salida (LA)',
          value: 31,
          unit: 'deg',
          condition: 'Tryout',
          tool: '-',
          date: '21/04/2026, 17:27',
          hasEvidence: true,
          evidenceUrl: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=600&q=80',
          notes: 'Elevado profundo al jardín derecho con excelente sweet spot.',
        },
        {
          id: `tm-${raw.id}-2`,
          discipline: 'BAT',
          metricName: 'Velocidad del Bate',
          value: 75,
          unit: 'MPH',
          condition: 'Tryout',
          tool: '-',
          date: '21/04/2026, 10:23',
          hasEvidence: true,
          evidenceUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80',
          notes: 'Aceleración pico en zona media.',
        },
        {
          id: `tm-${raw.id}-3`,
          discipline: 'BAT',
          metricName: 'Angulo de Ataque',
          value: 8,
          unit: 'deg',
          condition: 'Tryout',
          tool: '-',
          date: '21/04/2026, 10:22',
          hasEvidence: true,
          evidenceUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80',
          notes: 'Ataque plano óptimo para batazos de línea.',
        },
        {
          id: `tm-${raw.id}-4`,
          discipline: 'BAT',
          metricName: 'Velocidad del Bate',
          value: 60,
          unit: 'MPH',
          condition: 'Practica Individual',
          tool: '-',
          date: '08/04/2026, 10:36',
          hasEvidence: true,
          evidenceUrl: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=600&q=80',
          notes: 'Control de swing en calentamiento.',
        },
        {
          id: `tm-${raw.id}-5`,
          discipline: 'RUN',
          metricName: '60 Yard Dash',
          value: 6.45,
          unit: 'sec',
          condition: 'Showcase Oficial',
          tool: 'TrackMan Láser',
          date: '04/04/2026, 10:30',
          hasEvidence: true,
          evidenceUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          notes: 'Sprint evaluado con sensores láser.',
        },
        {
          id: `tm-${raw.id}-6`,
          discipline: 'PIT',
          metricName: 'Velocidad de Recta (Fastball Max)',
          value: 94,
          unit: 'MPH',
          condition: 'Bullpen Oficial',
          tool: 'TrackMan',
          date: '04/04/2026, 10:25',
          hasEvidence: true,
          evidenceUrl: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=600&q=80',
          notes: 'Punto de soltada y extensión hacia el plato.',
        },
        {
          id: `tm-${raw.id}-7`,
          discipline: 'FIL',
          metricName: 'Velocidad de Brazo (Infield/OF)',
          value: 89.5,
          unit: 'MPH',
          condition: 'Showcase Oficial',
          tool: 'Radar Stalker Pro II',
          date: '28/03/2026, 09:15',
          hasEvidence: true,
          evidenceUrl: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=600&q=80',
          notes: 'Tiro preciso desde el fondo del infield a primera base.',
        },
        {
          id: `tm-${raw.id}-8`,
          discipline: 'ACO',
          metricName: 'Salto Vertical',
          value: 34.5,
          unit: 'pulg',
          condition: 'Test Físico Certificado',
          tool: 'Plataforma de Salto Óptico',
          date: '20/03/2026, 08:30',
          hasEvidence: true,
          evidenceUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
          notes: 'Potencia explosiva del tren inferior sobresaliente.',
        },
        {
          id: `tm-${raw.id}-9`,
          discipline: 'ACO',
          metricName: 'Fuerza de Agarre (Dinamómetro)',
          value: 62.0,
          unit: 'kg',
          condition: 'Test Físico Certificado',
          tool: 'Dinamómetro Digital Jamar',
          date: '20/03/2026, 08:45',
          hasEvidence: true,
          evidenceUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
          notes: 'Fuerza isométrica de mano dominante por encima del percentil 90.',
        },
      ];

  const trajectoryEducation: TrajectoryEducationYear[] = raw.trajectoryEducation && raw.trajectoryEducation.length > 0
    ? raw.trajectoryEducation
    : [
        {
          id: `te-${raw.id}-1`,
          institution: 'Colegio Fundación Colombia',
          level: 'Secundaria',
          grade: '6',
          year: '2026',
          average: '5.00',
          subjectsCount: 1,
          subjects: [
            { id: 'sub-1', name: 'Matemáticas y Razonamiento', grade: '5.00', score: 100, status: 'Destacado' },
            { id: 'sub-2', name: 'Lengua Española & Comunicación', grade: '4.90', score: 98, status: 'Aprobado' },
            { id: 'sub-3', name: 'Ciencias Naturales & Biología', grade: '5.00', score: 100, status: 'Destacado' },
            { id: 'sub-4', name: 'Inglés Avanzado', grade: '4.85', score: 97, status: 'Aprobado' },
          ],
          hasCertificate: true,
          certificateUrl: 'https://caribebaseball.do/certificates/cert-fundacion-colombia.pdf',
        },
        {
          id: `te-${raw.id}-2`,
          institution: 'Colegio Fundación Colombia',
          level: 'Primaria',
          grade: '5',
          year: '2026',
          average: '4.00',
          subjectsCount: 1,
          subjects: [
            { id: 'sub-21', name: 'Educación Básica General', grade: '4.00', score: 85, status: 'Aprobado' },
          ],
          hasCertificate: true,
        },
        {
          id: `te-${raw.id}-3`,
          institution: 'Colegio Fundación Colombia',
          level: 'Primaria',
          grade: '4',
          year: '2026',
          average: '4.00',
          subjectsCount: 1,
          subjects: [
            { id: 'sub-31', name: 'Educación Básica General', grade: '4.00', score: 85, status: 'Aprobado' },
          ],
          hasCertificate: true,
        },
        {
          id: `te-${raw.id}-4`,
          institution: 'Colegio Fundación Colombia',
          level: 'Primaria',
          grade: '3',
          year: '2026',
          average: '5.00',
          subjectsCount: 1,
          subjects: [
            { id: 'sub-41', name: 'Educación Básica General', grade: '5.00', score: 100, status: 'Destacado' },
          ],
          hasCertificate: true,
        },
      ];

  const trajectoryCourses: TrajectoryCourseItem[] = raw.trajectoryCourses && raw.trajectoryCourses.length > 0
    ? raw.trajectoryCourses
    : [
        {
          id: `tc-${raw.id}-1`,
          title: 'Inglés Básico',
          institution: 'Udemy',
          durationHours: 20,
          completionDate: '17 feb 2026',
          score: 'Aprobado',
          source: 'externo',
          hasCertificate: true,
          certificateUrl: 'https://udemy.com/certificate/UC-2026-EN-BASIC',
          notes: 'Fundamentos de gramática y vocabulario conversacional.',
        },
        {
          id: `tc-${raw.id}-2`,
          title: 'Inglés Intermedio',
          institution: 'Coursera',
          durationHours: 30,
          completionDate: '4 feb 2026',
          score: 'Aprobado',
          source: 'externo',
          hasCertificate: true,
          certificateUrl: 'https://coursera.org/verify/GLV-EN-INT-44',
          notes: 'Expresión oral, listening y redacción en contexto profesional.',
        },
        {
          id: `tc-${raw.id}-3`,
          title: 'Alimentación Básica de Prospectos',
          institution: 'Universidad del Norte',
          durationHours: 20,
          completionDate: '2 feb 2026',
          score: 'Aprobado',
          source: 'externo',
          hasCertificate: true,
          notes: 'Nutrición deportiva y suplementación para atletas de alto rendimiento.',
        },
        {
          id: `tc-${raw.id}-4`,
          title: 'Baseball IQ & Toma de Decisiones Tácticas',
          institution: 'Glovall EdTech',
          durationHours: 45,
          completionDate: '15 ene 2026',
          score: '96/100 (Sobresaliente)',
          source: 'glovall',
          hasCertificate: true,
          certificateUrl: 'https://glovall.com/certificates/GLV-IQ-2026-PRO',
          notes: 'Lectura de situaciones de juego, conteos y posicionamiento defensivo.',
        },
      ];

  return {
    ...raw,
    familyAndEligibility,
    coachingSessions,
    coachingHistory: coachingSessions,
    formalEducation,
    nonFormalCourses,
    measurementHistory,
    academyHistory,
    tournamentsAndAwards,
    showcaseHistory,
    videoClips,
    trackmanData,
    trajectoryPrograms,
    academyRequests,
    affiliationAuditTrail,
    trajectoryTournaments,
    trajectoryMetrics,
    trajectoryEducation,
    trajectoryCourses,
  };
}
