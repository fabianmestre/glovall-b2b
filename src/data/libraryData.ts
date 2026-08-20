export interface LibraryDocument {
  id: string;
  category: 'Scouting' | 'Académico' | 'Biomecánica' | 'Salud & Nutrición' | 'Psicología';
  name: string;
  size: string;
  updatedDate: string;
  author: string;
  assignedByAcademy?: boolean;
  pagesCount: number;
  previewSummary: string;
  metricsAnalysis?: {
    overallGrade: number; // e.g. 60
    exitVeloMax: number;
    exitVeloAvg: number;
    hardHitRate: number; // percentage
    launchAngleSweetSpot: number; // percentage
    pullPct: number;
    centerPct: number;
    oppoPct: number;
    chaseRate: number;
    zoneContactRate: number;
    keyFindings: string[];
    coachAdvice: string;
  };
  aiDefaultAnalysis: string;
  aiSuggestedQuestions: string[];
}

export interface LibraryPodcast {
  id: string;
  orderNumber: string; // "01", "02", etc.
  title: string;
  category: 'Técnica' | 'Pitcheo' | 'Mentalidad' | 'Físico' | 'Scouting' | 'Salud';
  speaker: string;
  speakerRole: string;
  duration: string;
  durationSeconds: number;
  thumbnail: string;
  description: string;
  audioUrl: string;
  keyTakeaways: string[];
}

export interface LibraryCourse {
  id: string;
  category: 'TÉCNICA' | 'PITCHEO' | 'FÍSICO' | 'MENTALIDAD' | 'DEFENSA' | 'SALUD' | 'SCOUTING' | 'COACHING';
  categoryFilter: string;
  title: string;
  description: string;
  price?: string;
  isFreeForPlayers?: boolean;
  isAssignedByAcademy?: boolean;
  classesCount: number;
  thumbnail: string;
  instructor: string;
  level: 'Novato' | 'Intermedio' | 'Avanzado' | 'Clase Firma MLB';
  progressPercentage?: number;
  modules: Array<{
    title: string;
    duration: string;
    lessons: string[];
  }>;
}

export interface MlbPlayAnalysis {
  id: string;
  title: string;
  gameMatchup: string; // e.g. "Yankees vs Dodgers - World Series"
  playType: 'Bateo' | 'Defensa Infield' | 'Fildeo Outfield' | 'Pitcheo & Túnel' | 'Corrido de Bases' | 'Baseball IQ';
  mlbStar: string; // e.g. "Shohei Ohtani", "Aaron Judge", "Fernando Tatis Jr."
  teamBadge: string;
  duration: string;
  date: string;
  thumbnail: string;
  videoSimulatorUrl: string;
  analysisSummary: string;
  keyTacticalTakeaways: string[];
  glovallIqScore: number; // 95/100
  telemetryMetrics: {
    label1: string;
    val1: string;
    label2: string;
    val2: string;
    label3: string;
    val3: string;
  };
  analyst: string;
  analystRole: string;
}

export interface TechPartner {
  id: string;
  name: string;
  shortName: string;
  logoLetter: string;
  logoColor: string;
  tagline: string;
  description: string;
  features: string[];
  videosCount: number;
  videos: Array<{
    id: string;
    title: string;
    categoryTag: 'Bateo' | 'Pitcheo' | 'Análisis' | 'Scouting' | 'Coaching' | 'Biomecánica';
    duration: string;
    thumbnail: string;
    description: string;
    videoUrl?: string;
  }>;
}

export const LIBRARY_DOCUMENTS: LibraryDocument[] = [
  // 1. Scouting Category
  {
    id: 'doc-scout-01',
    category: 'Scouting',
    name: 'Reporte Bateo.pdf',
    size: '2.4 MB',
    updatedDate: 'Hoy, 09:30 AM',
    author: 'Trackman One & Glovall Analytics',
    assignedByAcademy: true,
    pagesCount: 6,
    previewSummary: 'Reporte cinemático y volumétrico del swing con radar Trackman. Incluye velocidad de salida por zona y mapas de calor de contacto sólido.',
    metricsAnalysis: {
      overallGrade: 58,
      exitVeloMax: 98.4,
      exitVeloAvg: 90.2,
      hardHitRate: 46.5,
      launchAngleSweetSpot: 38.2,
      pullPct: 48,
      centerPct: 34,
      oppoPct: 18,
      chaseRate: 19.4,
      zoneContactRate: 84.1,
      keyFindings: [
        'Excelente velocidad de bate en lanzamientos de 4 costuras en el tercio medio-alto (94+ MPH).',
        'Tendencia a descolgar el hombro posterior en sliders bajos y afuera, produciendo roletazos débiles al SS.',
        'Sweet Spot (8°-32° ángulo de elevación) alcanzado en 38.2% de contactos, ubicado en percentil 85 de la clase 2026.'
      ],
      coachAdvice: 'Mantener la palma de la mano guía hacia arriba durante el punto de impacto y no anticipar la rotación de caderas en conteos de dos strikes.'
    },
    aiDefaultAnalysis: 'El reporte de bateo de Yoan Mendoza muestra un perfil de poder proyectable clase MLB 2026. Su Exit Velo tope de 98.4 MPH y 84.1% de contacto en zona lo sitúan por encima del promedio latinoamericano. Se detecta vulnerabilidad en rompientes en la esquina exterior.',
    aiSuggestedQuestions: [
      '¿Cómo puedo mejorar mi porcentaje de bateo hacia la banda contraria (Oppo)?',
      '¿Qué ejercicios me recomiendan para no abrir las caderas antes de tiempo en sliders?',
      '¿Cuál es mi percentil de Exit Velo frente al promedio de prospectos 2026?'
    ]
  },
  {
    id: 'doc-scout-02',
    category: 'Scouting',
    name: 'Spray Chart.pdf',
    size: '1.8 MB',
    updatedDate: 'Ayer, 04:15 PM',
    author: 'Scouting Staff Caribe Academy',
    assignedByAcademy: true,
    pagesCount: 3,
    previewSummary: 'Mapa visual de dispersión de batazos en juegos simulados y prácticas en vivo (Live BP). Muestra distribución por dirección y tipo de trayectoria.',
    metricsAnalysis: {
      overallGrade: 55,
      exitVeloMax: 97.2,
      exitVeloAvg: 88.6,
      hardHitRate: 42.0,
      launchAngleSweetSpot: 34.0,
      pullPct: 52,
      centerPct: 30,
      oppoPct: 18,
      chaseRate: 21.0,
      zoneContactRate: 81.5,
      keyFindings: [
        'Más del 52% de los contactos sólidos van dirigidos entre LF y el callejón LF-CF.',
        'Pocos elevados profundos hacia el Right Field; los contactos al lado derecho son mayoritariamente roletazos.',
        'Líneas directas por el centro representan el mayor valor esperado (xBA .650).'
      ],
      coachAdvice: 'Incorporar drills de bateo con máquina de lanzamiento enfocados exclusivamente en dejar viajar la pelota al tercio posterior del plato.'
    },
    aiDefaultAnalysis: 'El Spray Chart refleja un bateador con marcado enfoque hacia el lado de halar (Pull-Heavy). Para maximizar el valor de scouting ante evaluadores MLB, se requiere demostrar capacidad para conectar con solidez hacia la banda opuesta.',
    aiSuggestedQuestions: [
      '¿Por qué los scouts prefieren bateadores que usan todo el terreno?',
      '¿Cómo cambia la formación defensiva rival contra mi Spray Chart?',
      '¿Qué drill con "Tee" me ayuda a empujar la pelota hacia el Right Field?'
    ]
  },
  {
    id: 'doc-scout-03',
    category: 'Scouting',
    name: 'Exit Velo.pdf',
    size: '3.1 MB',
    updatedDate: '18 Ago 2026',
    author: 'Trackman Radar & HitTrax Lab',
    assignedByAcademy: true,
    pagesCount: 5,
    previewSummary: 'Desglose detallado de velocidades de salida, velocidad de punta de bate (Bat Speed) y eficiencia de transferencia energética por swing.',
    metricsAnalysis: {
      overallGrade: 60,
      exitVeloMax: 98.4,
      exitVeloAvg: 90.5,
      hardHitRate: 48.0,
      launchAngleSweetSpot: 36.5,
      pullPct: 49,
      centerPct: 32,
      oppoPct: 19,
      chaseRate: 18.5,
      zoneContactRate: 85.0,
      keyFindings: [
        'Bat Speed promedio de 76.5 MPH con aceleración máxima de 21.4G.',
        'Top 10% en Exit Velocity en su rango de edad (16.4 años).',
        'Consistencia de impacto de 1.48 Smash Factor en el centro del barril.'
      ],
      coachAdvice: 'Continuar con el programa de sobrecarga y descarga de bates lastrados para elevar la velocidad terminal a 100+ MPH.'
    },
    aiDefaultAnalysis: 'Tu velocidad de salida es tu herramienta más atractiva para el reporte de scouts (Escala 60). Tu pico de 98.4 MPH proyecta poder de Grandes Ligas a medida que completes el desarrollo muscular.',
    aiSuggestedQuestions: [
      '¿Qué es el Smash Factor y cómo lo maximizo?',
      '¿Cómo se compara 98.4 MPH con los prospectos firmados en julio 2?',
      '¿Qué ejercicios de pliometría incrementan la velocidad de bate?'
    ]
  },
  {
    id: 'doc-scout-04',
    category: 'Scouting',
    name: 'Heatmap Semanal.pdf',
    size: '1.5 MB',
    updatedDate: '15 Ago 2026',
    author: 'Departamento de Analítica',
    assignedByAcademy: false,
    pagesCount: 4,
    previewSummary: 'Mapa de calor tridimensional de efectividad de swing y contacto por cuadrante de la zona de strike durante los últimos 7 días.',
    metricsAnalysis: {
      overallGrade: 54,
      exitVeloMax: 96.0,
      exitVeloAvg: 87.8,
      hardHitRate: 39.5,
      launchAngleSweetSpot: 31.0,
      pullPct: 45,
      centerPct: 35,
      oppoPct: 20,
      chaseRate: 23.1,
      zoneContactRate: 80.2,
      keyFindings: [
        'Zona roja de máximo daño: Cuadrante 5 y 6 (Medio-Bajo y Centro).',
        'Zona azul de baja producción: Cuadrante 3 (Alto-Afuera) y lanzamientos por debajo de las rodillas.',
        'Reducción del 8% en swings a pitcheos fuera de zona con respecto al mes anterior.'
      ],
      coachAdvice: 'Ajustar la visión en los primeros dos lanzamientos del turno para no regalar strikes altos.'
    },
    aiDefaultAnalysis: 'El Heatmap semanal muestra una gran maduración en la selección de lanzamientos, concentrando los batazos de línea en la zona media donde tu swing es más compacto.',
    aiSuggestedQuestions: [
      '¿Cómo reconozco más rápido los pitcheos en la zona alta de strike?',
      '¿Cuál es mi porcentaje de ponches en el cuadrante exterior?',
      '¿Cómo estructuro mi plan de turno según el conteo de bolas y strikes?'
    ]
  },
  {
    id: 'doc-scout-05',
    category: 'Scouting',
    name: 'Zonas de Strike.pdf',
    size: '2.0 MB',
    updatedDate: '12 Ago 2026',
    author: 'Glovall Scout Lab',
    assignedByAcademy: false,
    pagesCount: 3,
    previewSummary: 'Análisis de disciplina en el plato: Chase Rate, Zone Contact, Whiff Rate y efectividad ante rectas vs lanzamientos rompientes.',
    metricsAnalysis: {
      overallGrade: 56,
      exitVeloMax: 95.5,
      exitVeloAvg: 88.2,
      hardHitRate: 41.0,
      launchAngleSweetSpot: 35.0,
      pullPct: 46,
      centerPct: 36,
      oppoPct: 18,
      chaseRate: 19.4,
      zoneContactRate: 84.1,
      keyFindings: [
        'Whiff Rate contra rectas de 4 costuras: 12.3% (Excelente).',
        'Whiff Rate contra cambios de velocidad: 28.5% (Área de mejora).',
        'Tiempo promedio de decisión desde la liberación de la bola: 168 milisegundos.'
      ],
      coachAdvice: 'Practicar lectura del túnel de pitcheo con gafas estroboscópicas o ejercicios de reconocimiento de costuras.'
    },
    aiDefaultAnalysis: 'Tienes una excelente visión contra la velocidad viva. El próximo escalón para elevar tu Baseball IQ es identificar la rotación de los rompientes desde la ventana de salida del lanzador.',
    aiSuggestedQuestions: [
      '¿Qué es el Pitch Tunneling y cómo afecta mi lectura de la zona?',
      '¿Cómo me preparo para lanzadores zurdos con slider cruzado?',
      '¿Qué hábitos antes del pitcheo mejoran mi tiempo de reacción?'
    ]
  },

  // 2. Académico
  {
    id: 'doc-acad-01',
    category: 'Académico',
    name: 'Reglamento MLB 2026 & Contratos.pdf',
    size: '4.2 MB',
    updatedDate: '10 Ago 2026',
    author: 'MLB International Operations',
    assignedByAcademy: true,
    pagesCount: 24,
    previewSummary: 'Normativa oficial para el periodo de firmas internacionales de prospectos latinoamericanos, elegibilidad por edad y requisitos de registro en MLB.',
    aiDefaultAnalysis: 'Documento fundamental que todo prospecto y tutor legal debe conocer para entender los plazos de firma, el pool de bonos de las 30 franquicias y los derechos del jugador novato.',
    aiSuggestedQuestions: [
      '¿Cuáles son los requisitos de elegibilidad para la clase de firma 2026?',
      '¿Cómo se estructura el bono de firma y los pagos diferidos?',
      '¿Qué protección médica exige MLB antes de oficializar un contrato?'
    ]
  },
  {
    id: 'doc-acad-02',
    category: 'Académico',
    name: 'Guía de Visas Deportivas P-1A.pdf',
    size: '1.9 MB',
    updatedDate: '01 Ago 2026',
    author: 'Departamento Legal Glovall',
    assignedByAcademy: false,
    pagesCount: 8,
    previewSummary: 'Paso a paso para la tramitación de visas deportivas y consulares para atletas novatos que viajan a la liga instruccional o academias en USA.',
    aiDefaultAnalysis: 'Guía legal que describe la documentación requerida para el atleta y sus tutores legales al momento de ser contratado por una organización de Grandes Ligas.',
    aiSuggestedQuestions: [
      '¿Qué documentos debe preparar el tutor legal para la cita consular?',
      '¿Cuánto tiempo tarda la emisión de la visa de atleta?',
      '¿Qué pasa con los permisos de viaje si soy menor de 18 años?'
    ]
  },

  // 3. Biomecánica
  {
    id: 'doc-bio-01',
    category: 'Biomecánica',
    name: 'Análisis Cinemático Swing 3D.pdf',
    size: '5.6 MB',
    updatedDate: '05 Ago 2026',
    author: 'Laboratorio Biomecánico Caribe',
    assignedByAcademy: true,
    pagesCount: 12,
    previewSummary: 'Captura de movimiento con sensores K-Vest y marcadores ópticos. Muestra la secuencia de aceleración: pelvis -> torso -> brazo -> bate.',
    aiDefaultAnalysis: 'El análisis confirma una secuencia cinemática limpia con pico de desaceleración de pelvis justo antes del impacto, lo que garantiza máxima transferencia de energía al bate.',
    aiSuggestedQuestions: [
      '¿Por qué es importante el frenado de la cadera antes de mover los brazos?',
      '¿Qué ángulo de inclinación del torso produce mayor porcentaje de líneas?',
      '¿Cómo influye la posición del pie delantero en el timing del swing?'
    ]
  },

  // 4. Salud & Nutrición
  {
    id: 'doc-nut-01',
    category: 'Salud & Nutrición',
    name: 'Plan Nutricional Temporada & Hidratación.pdf',
    size: '2.8 MB',
    updatedDate: '02 Ago 2026',
    author: 'Nutrición Deportiva Pro',
    assignedByAcademy: true,
    pagesCount: 10,
    previewSummary: 'Guía de requerimientos calóricos, ingesta de proteínas por kilo de peso y protocolo de electrolitos para entrenamientos bajo calor extremo caribeño.',
    aiDefaultAnalysis: 'Plan alimenticio diseñado para sostener la masa muscular magra y mantener niveles óptimos de energía durante jornadas dobles de prácticas y showcases.',
    aiSuggestedQuestions: [
      '¿Cuánta agua y electrolitos debo tomar por hora de práctica?',
      '¿Qué alimentos son mejores para comer 2 horas antes de un juego?',
      '¿Cómo acelero la recuperación muscular después de una sesión pesada?'
    ]
  },

  // 5. Psicología
  {
    id: 'doc-psi-01',
    category: 'Psicología',
    name: 'Manejo de Presión en el Montículo & Caja.pdf',
    size: '1.7 MB',
    updatedDate: '28 Jul 2026',
    author: 'Psic. Raúl Morales (Mental Coach)',
    assignedByAcademy: true,
    pagesCount: 7,
    previewSummary: 'Técnicas de respiración diafragmática, rutinas de reset mental entre lanzamientos y lenguaje corporal positivo ante cazatalentos de MLB.',
    aiDefaultAnalysis: 'Estrategias de fortaleza mental para superar los momentos de alta tensión en showcases donde hay decenas de scouts evaluando cada gesto.',
    aiSuggestedQuestions: [
      '¿Cómo me calmo si tengo un turno de dos strikes con corredores en base?',
      '¿Qué es la rutina del "Reset" mental y cómo la aplico?',
      '¿Por qué el lenguaje corporal influye en la nota de maquillaje del scout?'
    ]
  }
];

export const LIBRARY_PODCASTS: LibraryPodcast[] = [
  {
    id: 'pod-01',
    orderNumber: '01',
    title: 'Mecánica de Pitcheo con Expertos MLB',
    category: 'Técnica',
    speaker: 'Coach Rivera',
    speakerRole: 'Ex-Pitching Coach Grandes Ligas & Asesor Internacional',
    duration: '45 min',
    durationSeconds: 2700,
    thumbnail: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=400&q=80',
    description: 'Breakdown completo del ciclo cinético del pitcheo con análisis de videos de grandes ligas. Cómo generar velocidad sin forzar los ligamentos del codo.',
    audioUrl: 'https://cdn.example.com/audio/pod-01.mp3',
    keyTakeaways: [
      'La rotación de la cadera genera el 50% de la energía del lanzamiento.',
      'El túnel de salida del codo debe mantenerse por encima del hombro.',
      'Importancia de la extensión frontal para engañar al bateador.'
    ]
  },
  {
    id: 'pod-02',
    orderNumber: '02',
    title: 'Lectura de Lanzamientos para Bateadores',
    category: 'Técnica',
    speaker: 'Scout MLÁ',
    speakerRole: 'Evaluador Senior MLB para el Caribe',
    duration: '38 min',
    durationSeconds: 2280,
    thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80',
    description: 'Cómo anticipar el tipo de pitch en los primeros 100ms y ejecutar el swing correcto. Claves visuales desde la mano del pitcher hasta el plato.',
    audioUrl: 'https://cdn.example.com/audio/pod-02.mp3',
    keyTakeaways: [
      'Focalizar la vista en la ventana de lanzamiento y no en el cuerpo del pitcher.',
      'Reconocimiento del punto rojo (Red Dot) en la rotación del slider.',
      'Disciplina en conteos a favor: esperar el error en la zona.'
    ]
  },
  {
    id: 'pod-03',
    orderNumber: '03',
    title: 'Defensa de Infield: Footwork Avanzado',
    category: 'Técnica',
    speaker: 'Coach Alvarado',
    speakerRole: 'Instructor de Guante de Oro & Coordinador Defensivo',
    duration: '33 min',
    durationSeconds: 1980,
    thumbnail: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=400&q=80',
    description: 'Técnicas de posicionamiento, primer paso y tiro desde todos los ángulos del infield. Rutinas de manos suaves y lectura de botes.',
    audioUrl: 'https://cdn.example.com/audio/pod-03.mp3',
    keyTakeaways: [
      'El peso del cuerpo debe apoyarse sobre la parte delantera de los pies.',
      'Atacar la pelota en el bote ascendente para facilitar la transición al guante.',
      'Plantarse rápido con el pie derecho para tiros con potencia a primera base.'
    ]
  },
  {
    id: 'pod-04',
    orderNumber: '04',
    title: 'Exit Velocity y el Bateo Moderno',
    category: 'Técnica',
    speaker: 'Analista Jim S.',
    speakerRole: 'Especialista en Sabermetría & Trackman Analytics',
    duration: '42 min',
    durationSeconds: 2520,
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80',
    description: 'La ciencia detrás del Exit Velo y cómo los scouts usan estos datos para evaluar prospectos. La relación entre masa corporal y aceleración del bate.',
    audioUrl: 'https://cdn.example.com/audio/pod-04.mp3',
    keyTakeaways: [
      'Cada 1 MPH adicional de Exit Velo añade aproximadamente 5 pies de distancia.',
      'Un ángulo de elevación de 15° a 25° maximiza el promedio de bateo esperado.',
      'La fuerza en el antebrazo y muñeca asegura el control en el impacto.'
    ]
  },
  {
    id: 'pod-05',
    orderNumber: '05',
    title: 'El Arte del Steal: Lectura del Pitcher',
    category: 'Técnica',
    speaker: 'Speed Coach D.',
    speakerRole: 'Coach de Corredores de Base & Velocidad Pura',
    duration: '29 min',
    durationSeconds: 1740,
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    description: 'Protocolo completo del robo de base: leads, timing y sliding para maximizar el éxito. Descifrar los "tells" inconscientes del lanzador.',
    audioUrl: 'https://cdn.example.com/audio/pod-05.mp3',
    keyTakeaways: [
      'Medir el tiempo de entrega al home del lanzador con cronómetro (1.30s o superior es robable).',
      'El primer paso explosivo en dirección cruzada determina el 80% del robo.',
      'Deslizarse al lado opuesto del guante del fildeador para evitar el out.'
    ]
  },
  {
    id: 'pod-06',
    orderNumber: '06',
    title: 'Spin Rate y Movimiento del Pitch',
    category: 'Técnica',
    speaker: 'Rapsodo Analyst',
    speakerRole: 'Consultor de Diseño de Pitcheos con Tecnología de Radar',
    duration: '36 min',
    durationSeconds: 2160,
    thumbnail: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&q=80',
    description: 'Relación entre RPM, ejes de giro y efectividad de cada tipo de lanzamiento. Cómo la alta rotación genera la ilusión de que la bola "sube".',
    audioUrl: 'https://cdn.example.com/audio/pod-06.mp3',
    keyTakeaways: [
      'La recta de 4 costuras con más de 2,400 RPM tiene una tasa de swing fallido superior al 25%.',
      'El quiebre del slider depende del ángulo del eje de giro gyro.',
      'La consistencia del punto de soltada permite crear túneles engañosos.'
    ]
  },
  {
    id: 'pod-07',
    orderNumber: '07',
    title: 'Biomecánica del Swing Moderno',
    category: 'Técnica',
    speaker: 'Dr. Manuel Ortiz',
    speakerRole: 'Director de Biomecánica del Deporte',
    duration: '40 min',
    durationSeconds: 2400,
    thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=400&q=80',
    description: 'Estudio de la cadena cinética: cómo el torque del tren inferior viaja a través del core hacia la cabeza del bate en fracciones de segundo.',
    audioUrl: 'https://cdn.example.com/audio/pod-07.mp3',
    keyTakeaways: [
      'La rotación de la pelvis precede al torso por 40 a 60 milisegundos.',
      'El brazo de atrás debe mantener una flexión de 90° al momento de entrar al plano.',
      'Evitar el sobre-balance hacia adelante para no perder ángulo de palanca.'
    ]
  },
  {
    id: 'pod-08',
    orderNumber: '08',
    title: 'Mentalidad del Prospecto en Showcases',
    category: 'Mentalidad',
    speaker: 'Psic. Raúl Morales',
    speakerRole: 'Consultor de Alto Rendimiento & Scout Interview Prep',
    duration: '35 min',
    durationSeconds: 2100,
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
    description: 'Estrategias psicológicas para brillar en eventos evaluativos con 50+ scouts en las gradas. El manejo de la frustración tras un turno fallido.',
    audioUrl: 'https://cdn.example.com/audio/pod-08.mp3',
    keyTakeaways: [
      'Los scouts evalúan cómo reaccionas al fallo tanto como tus mejores jugadas.',
      'Usa anclajes de respiración diafragmática para mantener el pulso bajo control.',
      'Visualiza cada jugada con anticipación antes de entrar al terreno.'
    ]
  }
];

export const LIBRARY_COURSES: LibraryCourse[] = [
  {
    id: 'crs-01',
    category: 'TÉCNICA',
    categoryFilter: 'Técnica',
    title: 'Bateo Moderno',
    description: 'Domina las mecánicas avanzadas de swing con datos reales. Aprende a leer lanzamientos, atacar el plano y elevar tu Exit Velo.',
    price: '$24.99',
    isAssignedByAcademy: true,
    classesCount: 8,
    thumbnail: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=600&q=80',
    instructor: 'Coach Carlos Rosario',
    level: 'Clase Firma MLB',
    progressPercentage: 65,
    modules: [
      { title: 'Módulo 1: Anatomía del Swing y Plano de Ataque', duration: '45 min', lessons: ['Postura y Balance Inicial', 'El Primer Movimiento: Carga y Separación', 'El Plano de Ataque (Attack Angle)'] },
      { title: 'Módulo 2: Contacto y Aceleración del Bate', duration: '55 min', lessons: ['Punto de Impacto Óptimo', 'Extensión y Seguimiento del Swing', 'Drills con Bates Lastrados'] }
    ]
  },
  {
    id: 'crs-02',
    category: 'PITCHEO',
    categoryFilter: 'Pitcheo',
    title: 'Control del Lanzador',
    description: 'Secretos de comando y control usados en academias MLB. Aprende a ubicar cada pitch en las esquinas y dominar la zona baja.',
    price: '$35.00',
    isAssignedByAcademy: true,
    classesCount: 8,
    thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80',
    instructor: 'Nelson Peña (Pitch Design Pro)',
    level: 'Avanzado',
    progressPercentage: 40,
    modules: [
      { title: 'Módulo 1: Repetición Mecánica del Delivery', duration: '50 min', lessons: ['Balance en el Montículo', 'Línea de Dirección al Plato', 'Punto de Liberación Consistente'] },
      { title: 'Módulo 2: Estrategia y Secuencia de Pitcheos', duration: '60 min', lessons: ['Atacar el Primer Strike', 'Cambios de Velocidad y Engaño', 'Ejecución en Conteos Adversos'] }
    ]
  },
  {
    id: 'crs-03',
    category: 'FÍSICO',
    categoryFilter: 'Físico',
    title: 'Acondicionamiento',
    description: 'Rutinas de fuerza y movilidad diseñadas específicamente para jugadores de béisbol. Potencia explosiva y prevención de lesiones.',
    price: '$19.90',
    isAssignedByAcademy: true,
    classesCount: 8,
    thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    instructor: 'Miguel Batista (CSCS)',
    level: 'Intermedio',
    progressPercentage: 80,
    modules: [
      { title: 'Módulo 1: Movilidad y Fuerza Rotacional', duration: '40 min', lessons: ['Calentamiento Dinámico Pro', 'Potencia de Caderas con Balón Medicinal', 'Core Antirrotacional'] },
      { title: 'Módulo 2: Velocidad Lineal de 60 Yardas', duration: '50 min', lessons: ['Técnica de Aceleración y Salida', 'Fuerza Unilateral de Piernas', 'Pliometría'] }
    ]
  },
  {
    id: 'crs-04',
    category: 'MENTALIDAD',
    categoryFilter: 'Mentalidad',
    title: 'Psicología del Éxito',
    description: 'Herramientas psicológicas para rendir bajo presión. Aprende a construir confianza, superar malos turnos y conectar con scouts.',
    price: '$39.99',
    isAssignedByAcademy: false,
    classesCount: 8,
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    instructor: 'Psic. Raúl Morales',
    level: 'Clase Firma MLB',
    progressPercentage: 25,
    modules: [
      { title: 'Módulo 1: Enfoque y Control del Pulso', duration: '45 min', lessons: ['Respiración Box y Diafragma', 'Rutinas Pre-Lanzamiento', 'Manejo de Expectativas'] }
    ]
  },
  {
    id: 'crs-05',
    category: 'DEFENSA',
    categoryFilter: 'Defensa',
    title: 'Maestría Defensiva',
    description: 'Domina el guante en infield y outfield. Técnicas de posicionamiento, tiro, primera base y lectura instantánea del bateador.',
    price: '$24.99',
    isAssignedByAcademy: true,
    classesCount: 8,
    thumbnail: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=600&q=80',
    instructor: 'Coach Alvarado',
    level: 'Intermedio',
    progressPercentage: 50,
    modules: [
      { title: 'Módulo 1: Fundamentos de Guante y Transferencia', duration: '40 min', lessons: ['Manos Suaves y Posición Lista', 'Tiro con Impulso', 'Filtros en Backhand'] }
    ]
  },
  {
    id: 'crs-06',
    category: 'SALUD',
    categoryFilter: 'Salud',
    title: 'Nutrición Deportiva',
    description: 'Planifica tu alimentación para mantener energía máxima durante toda la temporada. Hidratación, suplementación segura y sueño.',
    price: '$29.99',
    isAssignedByAcademy: true,
    classesCount: 8,
    thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
    instructor: 'Dra. Elena Santos (Nutricionista)',
    level: 'Novato',
    progressPercentage: 90,
    modules: [
      { title: 'Módulo 1: Combustible para el Día del Juego', duration: '35 min', lessons: ['Macronutrientes Clave', 'Timing de Comidas y Snacks', 'Hidratación con Electrolitos'] }
    ]
  },
  {
    id: 'crs-07',
    category: 'SCOUTING',
    categoryFilter: 'Scouting',
    title: 'Perfil de Scout',
    description: 'Aprende a construir tu perfil de prospecto ideal. Desde tu video de scouting hasta tus métricas oficiales para firmas internacionales.',
    price: '$25.00',
    isAssignedByAcademy: false,
    classesCount: 8,
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    instructor: 'Donny Rowland (Scout MLB)',
    level: 'Clase Firma MLB',
    progressPercentage: 10,
    modules: [
      { title: 'Módulo 1: Lo que Busca el Evaluador MLB', duration: '45 min', lessons: ['La Escala 20-80 Explicada', 'Proyección Corporal y Atleticismo', 'Preparación de Video de Scouting'] }
    ]
  },
  {
    id: 'crs-08',
    category: 'COACHING',
    categoryFilter: 'Coaching',
    title: 'Liderazgo Táctico',
    description: 'Estrategias de liderazgo y dirección táctica para capitanes y jugadores veteranos. Comunicación en el campo y lectura de señales.',
    price: '$29.99',
    isAssignedByAcademy: false,
    classesCount: 8,
    thumbnail: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=600&q=80',
    instructor: 'Lic. Rafael Almonte',
    level: 'Avanzado',
    progressPercentage: 0,
    modules: [
      { title: 'Módulo 1: Liderazgo y Dinámica de Equipo', duration: '40 min', lessons: ['Comunicación Asertiva', 'Apoyo a Compañeros en Baches', 'Ejecución de Estrategias'] }
    ]
  },
  // 8 additional courses to complete 16 courses
  {
    id: 'crs-09',
    category: 'TÉCNICA',
    categoryFilter: 'Técnica',
    title: 'Optimización del Launch Angle',
    description: 'Ajusta tu ángulo de salida para transformar roletazos en extrabases y cuadrangulares con data de TrackMan y Blast.',
    price: '$29.99',
    isAssignedByAcademy: true,
    classesCount: 6,
    thumbnail: 'https://images.unsplash.com/photo-1562077772-3ab125463375?auto=format&fit=crop&w=600&q=80',
    instructor: 'Coach Carlos Rosario',
    level: 'Avanzado',
    progressPercentage: 0,
    modules: [{ title: 'Módulo 1: Ángulos de Ataque y Elevación', duration: '40 min', lessons: ['Comprendiendo el Launch Angle', 'Ajuste de Trayectoria'] }]
  },
  {
    id: 'crs-10',
    category: 'PITCHEO',
    categoryFilter: 'Pitcheo',
    title: 'Pitch Design con Rapsodo',
    description: 'Diseña tu slider, curva y cambio de velocidad midiendo el eje de rotación y la eficiencia de giro en tiempo real.',
    price: '$39.00',
    isAssignedByAcademy: false,
    classesCount: 10,
    thumbnail: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    instructor: 'Nelson Peña',
    level: 'Avanzado',
    progressPercentage: 0,
    modules: [{ title: 'Módulo 1: Ejes de Giro y Spin Efficiency', duration: '60 min', lessons: ['Lectura de Datos Rapsodo', 'Ajuste de Agarre'] }]
  },
  {
    id: 'crs-11',
    category: 'FÍSICO',
    categoryFilter: 'Físico',
    title: 'Velocidad de 60 Yardas & Salto',
    description: 'Entrenamiento pliométrico y técnica de carrera para bajar tu tiempo de las 60 yardas por debajo de 6.60 segundos.',
    price: '$22.50',
    isAssignedByAcademy: true,
    classesCount: 6,
    thumbnail: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
    instructor: 'Miguel Batista',
    level: 'Intermedio',
    progressPercentage: 0,
    modules: [{ title: 'Módulo 1: Primeros 10 Metros y Aceleración', duration: '35 min', lessons: ['Postura de Salida', 'Frecuencia de Zancada'] }]
  },
  {
    id: 'crs-12',
    category: 'DEFENSA',
    categoryFilter: 'Defensa',
    title: 'Catcher Elite: Framing & Bloqueo',
    description: 'Gana strikes adicionales para tu lanzador con la técnica de guante moderna y domina el bloqueo de pitcheos en la tierra.',
    price: '$32.00',
    isAssignedByAcademy: false,
    classesCount: 8,
    thumbnail: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=600&q=80',
    instructor: 'Coach Receptoría MLB',
    level: 'Avanzado',
    progressPercentage: 0,
    modules: [{ title: 'Módulo 1: Postura a una Rodilla y Recepción', duration: '45 min', lessons: ['Recepción Ascendente', 'Bloqueo Rápido'] }]
  },
  {
    id: 'crs-13',
    category: 'SALUD',
    categoryFilter: 'Salud',
    title: 'Cuidado de Brazo & Bandas J-Bands',
    description: 'Protocolos de fortalecimiento del manguito rotador y desaceleración para mantener tu brazo saludable todo el año.',
    price: '$18.00',
    isAssignedByAcademy: true,
    classesCount: 5,
    thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
    instructor: 'Fisioterapeuta Deportivo',
    level: 'Novato',
    progressPercentage: 0,
    modules: [{ title: 'Módulo 1: Rutinas Pre y Post Lanzamiento', duration: '30 min', lessons: ['Uso de Bandas Elásticas', 'Liberación Miofascial'] }]
  },
  {
    id: 'crs-14',
    category: 'SCOUTING',
    categoryFilter: 'Scouting',
    title: 'Entendiendo la Escala 20-80 MLB',
    description: 'Aprende a interpretar tu reporte de scouting profesional: Hit, Poder, Corring, Brazo, Defensa y Baseball IQ.',
    price: '$20.00',
    isAssignedByAcademy: true,
    classesCount: 4,
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    instructor: 'Donny Rowland',
    level: 'Clase Firma MLB',
    progressPercentage: 0,
    modules: [{ title: 'Módulo 1: Los Grados de Evaluación', duration: '30 min', lessons: ['Grado 50 (Promedio MLB)', 'Herramientas Plus 60+'] }]
  },
  {
    id: 'crs-15',
    category: 'MENTALIDAD',
    categoryFilter: 'Mentalidad',
    title: 'Rutina Pre-Juego & Visualización',
    description: 'Construye un ritual mental inquebrantable antes de cada partido para entrar al terreno en estado de flujo (Flow State).',
    price: '$24.00',
    isAssignedByAcademy: false,
    classesCount: 6,
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    instructor: 'Psic. Raúl Morales',
    level: 'Intermedio',
    progressPercentage: 0,
    modules: [{ title: 'Módulo 1: Visualización Sensorial', duration: '35 min', lessons: ['Creación de Imágenes Mentales', 'Respiración de Anclaje'] }]
  },
  {
    id: 'crs-16',
    category: 'COACHING',
    categoryFilter: 'Coaching',
    title: 'Lectura de Sabermetría para Jugadores',
    description: 'Comprende el wOBA, xBA, Hard Hit % y Spin Efficiency para aplicar la analítica a tu plan táctico de juego.',
    price: '$28.00',
    isAssignedByAcademy: false,
    classesCount: 7,
    thumbnail: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=600&q=80',
    instructor: 'Jim S. (Data Analyst)',
    level: 'Avanzado',
    progressPercentage: 0,
    modules: [{ title: 'Módulo 1: Métricas Esperadas vs Reales', duration: '40 min', lessons: ['xBA vs BA', 'Valor de las Salidas Frecuentes'] }]
  }
];

export const TECH_PARTNERS: TechPartner[] = [
  {
    id: 'partner-trackman',
    name: 'Trackman',
    shortName: 'Trackman',
    logoLetter: 'T',
    logoColor: 'bg-blue-700',
    tagline: 'Sistema de radar doppler estándar en Grandes Ligas y Academias Élite',
    description: 'Trackman es el sistema de radar y tecnología de seguimiento más usado en las Grandes Ligas y academias de alto rendimiento. Sus datos miden con precisión cada aspecto del juego.',
    features: ['Exit Velocity', 'Spin Rate', 'Launch Angle', 'Spray Chart', 'Pitch Tracking', 'TrackmanOne'],
    videosCount: 8,
    videos: [
      {
        id: 'vid-tm-01',
        title: 'Introducción al Exit Velocity',
        categoryTag: 'Bateo',
        duration: '8:24',
        thumbnail: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=600&q=80',
        description: 'Aprende qué es el Exit Velo, cómo se mide y cuáles son los rangos elite en MLB y academias.'
      },
      {
        id: 'vid-tm-02',
        title: 'Spin Rate y su impacto en pitcheo',
        categoryTag: 'Pitcheo',
        duration: '11:02',
        thumbnail: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
        description: 'Relación entre RPM, movimiento y efectividad del lanzamiento. Datos reales de liga.'
      },
      {
        id: 'vid-tm-03',
        title: 'Cómo leer un Spray Chart',
        categoryTag: 'Análisis',
        duration: '6:45',
        thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80',
        description: 'Interpreta los patrones de contacto del bateador y ajusta la defensa con data visual.'
      },
      {
        id: 'vid-tm-04',
        title: 'Launch Angle óptimo por posición',
        categoryTag: 'Bateo',
        duration: '9:17',
        thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
        description: 'Descubre los ángulos de lanzamiento ideales según tu posición y tipo de bateador.'
      },
      {
        id: 'vid-tm-05',
        title: 'Trackman en ligas de academia',
        categoryTag: 'Scouting',
        duration: '7:50',
        thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
        description: 'Cómo se usa el sistema en torneos de academia latinoamericana para evaluar prospectos.'
      },
      {
        id: 'vid-tm-06',
        title: 'Análisis con TrackmanOne',
        categoryTag: 'Pitcheo',
        duration: '13:20',
        thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
        description: 'Guía completa del módulo TrackmanOne: carga, sesiones y comparación histórica.'
      },
      {
        id: 'vid-tm-07',
        title: 'Exit Velo por categoría de edad',
        categoryTag: 'Scouting',
        duration: '6:30',
        thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        description: 'Rangos de Exit Velocity esperados según edad y nivel (12U, 14U, 16U, 18U, Universitario).'
      },
      {
        id: 'vid-tm-08',
        title: 'Datos Trackman para el cuerpo técnico',
        categoryTag: 'Coaching',
        duration: '10:05',
        thumbnail: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=600&q=80',
        description: 'Cómo usar los reportes Trackman para tomar decisiones en prácticas y competencia.'
      }
    ]
  },
  {
    id: 'partner-rapsodo',
    name: 'Rapsodo Baseball',
    shortName: 'Rapsodo',
    logoLetter: 'R',
    logoColor: 'bg-red-600',
    tagline: 'Cámara óptica y radar para pitch design y mecánica de bateo',
    description: 'Rapsodo proporciona métricas en tiempo real sobre la rotación del balón, velocidad y perfil de rompimiento para optimizar cada pitcheo.',
    features: ['Spin Direction', 'Gyro Degree', 'Horizontal Break', 'Vertical Break', 'Pitch Design'],
    videosCount: 6,
    videos: [
      {
        id: 'vid-rap-01',
        title: 'Ejes de Rotación y Gyro Spin',
        categoryTag: 'Pitcheo',
        duration: '12:15',
        thumbnail: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
        description: 'Entendiendo la diferencia entre el giro útil y el giro giroscópico en la slider.'
      },
      {
        id: 'vid-rap-02',
        title: 'Diseño del Cambio de Velocidad',
        categoryTag: 'Pitcheo',
        duration: '9:40',
        thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80',
        description: 'Cómo maximizar la caída vertical del changeup modificando la presión de los dedos.'
      }
    ]
  },
  {
    id: 'partner-blast',
    name: 'Blast Motion',
    shortName: 'Blast Motion',
    logoLetter: 'B',
    logoColor: 'bg-amber-600',
    tagline: 'Sensores de perilla para cinemática de bateo y tiempo al contacto',
    description: 'Blast Motion analiza la velocidad de la punta del bate, plano de ataque y tiempo de reacción milimétrico.',
    features: ['Bat Speed', 'Time to Contact', 'Rotational Acceleration', 'On-Plane Efficiency'],
    videosCount: 5,
    videos: [
      {
        id: 'vid-bl-01',
        title: 'Rotational Acceleration y su impacto',
        categoryTag: 'Bateo',
        duration: '8:50',
        thumbnail: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=600&q=80',
        description: 'Por qué una aceleración superior a 15G permite esperar el pitcheo más tiempo.'
      }
    ]
  }
];

export const MLB_PLAY_ANALYSES: MlbPlayAnalysis[] = [
  {
    id: 'mlb-play-01',
    title: 'Análisis de Swing: Shohei Ohtani vs Recta Alta 101 MPH',
    gameMatchup: 'Dodgers vs Yankees • Serie Mundial Juego 3',
    playType: 'Bateo',
    mlbStar: 'Shohei Ohtani',
    teamBadge: 'LAD',
    duration: '4:20',
    date: 'Octubre 2024',
    thumbnail: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=600&q=80',
    videoSimulatorUrl: 'https://cdn.example.com/mlb/ohtani-hr.mp4',
    analysisSummary: 'Desglose fotograma a fotograma del ajuste biomecánico de Shohei Ohtani ante una bola rápida de 101.4 MPH en la esquina superior interna. Observa cómo retiene el codo trasero y mantiene la cabeza en el plano sin colapsar el balance.',
    keyTacticalTakeaways: [
      'Retraso deliberado de la cadera para permitir que las manos viajen compactas por dentro de la pelota.',
      'Ángulo de ataque de 14° ideal para generar elevación sin crear efecto de retroceso excesivo.',
      'Exit Velocity registrada: 115.8 MPH con distancia proyectada de 442 pies.'
    ],
    glovallIqScore: 98,
    telemetryMetrics: {
      label1: 'Exit Velocity',
      val1: '115.8 MPH',
      label2: 'Launch Angle',
      val2: '28°',
      label3: 'Tiempo Reacción',
      val3: '0.14s'
    },
    analyst: 'Carlos Rosario & Staff Biomecánica',
    analystRole: 'Especialista en Cinemática de Bateo MLB'
  },
  {
    id: 'mlb-play-02',
    title: 'Doble Play Acrobático: Fernando Tatis Jr. y Relevo en Suspensión',
    gameMatchup: 'Padres vs Braves • Wild Card Series',
    playType: 'Defensa Infield',
    mlbStar: 'Fernando Tatis Jr.',
    teamBadge: 'SD',
    duration: '3:45',
    date: 'Septiembre 2024',
    thumbnail: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=600&q=80',
    videoSimulatorUrl: 'https://cdn.example.com/mlb/tatis-dp.mp4',
    analysisSummary: 'Evaluación del posicionamiento defensivo previo al swing, lectura del bote intermedio en grama corta y mecánica de tiro en suspensión de 94.2 MPH a primera base.',
    keyTacticalTakeaways: [
      'Primer paso explosivo (First Step Latency: 0.18s) hacia su mano izquierda.',
      'Transferencia de guante a mano limpia en solo 0.62 segundos en movimiento.',
      'Uso del giro del tronco en el aire para mantener el tiro en línea al pecho del inicialista.'
    ],
    glovallIqScore: 96,
    telemetryMetrics: {
      label1: 'Velocidad de Tiro',
      val1: '94.2 MPH',
      label2: 'Tiempo de Transfer',
      val2: '0.62s',
      label3: 'Latencia 1er Paso',
      val3: '0.18s'
    },
    analyst: 'Coach Alvarado',
    analystRole: 'Instructor Defensivo Guante de Oro'
  },
  {
    id: 'mlb-play-03',
    title: 'Túnel de Pitcheo Perfecto: Paul Skenes Splinker vs Slider',
    gameMatchup: 'Pirates vs Phillies • Temporada Regular',
    playType: 'Pitcheo & Túnel',
    mlbStar: 'Paul Skenes',
    teamBadge: 'PIT',
    duration: '5:10',
    date: 'Julio 2024',
    thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80',
    videoSimulatorUrl: 'https://cdn.example.com/mlb/skenes-tunnel.mp4',
    analysisSummary: 'Superposición gráfica 3D de dos lanzamientos consecutivos soltados exactamente desde el mismo punto (Release Height 6.2 ft) que rompen en direcciones opuestas a 15 pies del plato.',
    keyTacticalTakeaways: [
      'Dispersión del punto de soltada de solo 1.2 pulgadas entre su recta híbrida y el slider.',
      'Diferencial de velocidad de 14.5 MPH con idéntica extensión corporal hacia el receptor.',
      'Tasa de swing en blanco provocada (Whiff Rate): 44.8% en la sesión.'
    ],
    glovallIqScore: 99,
    telemetryMetrics: {
      label1: 'Splinker Velo',
      val1: '100.2 MPH',
      label2: 'Slider Break',
      val2: '14.2 in',
      label3: 'Tunnel Variance',
      val3: '1.2 in'
    },
    analyst: 'Nelson Peña',
    analystRole: 'Director de Pitch Design Glovall'
  },
  {
    id: 'mlb-play-04',
    title: 'Robo de Home & Lectura de Tiempo: Elly De La Cruz',
    gameMatchup: 'Reds vs Brewers • Juego de División Central',
    playType: 'Corrido de Bases',
    mlbStar: 'Elly De La Cruz',
    teamBadge: 'CIN',
    duration: '3:15',
    date: 'Agosto 2024',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    videoSimulatorUrl: 'https://cdn.example.com/mlb/elly-steal.mp4',
    analysisSummary: 'Cálculo del tiempo de entrega del pitcher zurdo (1.42s) y arranque suicida desde tercera base con velocidad tope de 30.5 ft/sec.',
    keyTacticalTakeaways: [
      'Lectura del levantamiento de la pierna del lanzador sin titubeos.',
      'Aceleración de 0 a 20 MPH alcanzada en apenas 3.8 pasos.',
      'Deslizamiento pop-up con la mano derecha esquivando el tag del receptor.'
    ],
    glovallIqScore: 97,
    telemetryMetrics: {
      label1: 'Sprint Speed',
      val1: '30.5 ft/s',
      label2: 'Tiempo 3B-Home',
      val2: '3.12s',
      label3: 'Distancia Salto',
      val3: '14.2 ft'
    },
    analyst: 'Speed Coach D.',
    analystRole: 'Consultor de Velocidad & Corrido'
  },
  {
    id: 'mlb-play-05',
    title: 'Atrapada Contra la Pared: Aaron Judge y la Ruta Inversa',
    gameMatchup: 'Yankees vs Red Sox • Fenway Park',
    playType: 'Fildeo Outfield',
    mlbStar: 'Aaron Judge',
    teamBadge: 'NYY',
    duration: '4:05',
    date: 'Junio 2024',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    videoSimulatorUrl: 'https://cdn.example.com/mlb/judge-catch.mp4',
    analysisSummary: 'Análisis de la ruta de cobertura (Route Efficiency 98.4%) en un elevado profundo con probabilidad de atrapada de solo 25%. Manejo del salto y amortiguación en la pared.',
    keyTacticalTakeaways: [
      'Giro de cadera inmediato sin dar pasos en falso hacia adelante.',
      'Monitoreo continuo de la pelota por encima del hombro dominante.',
      'Amortiguación con el hombro contrario al guante para no soltar la bola tras el impacto.'
    ],
    glovallIqScore: 94,
    telemetryMetrics: {
      label1: 'Route Efficiency',
      val1: '98.4%',
      label2: 'Distancia Cubierta',
      val2: '89.5 ft',
      label3: 'Catch Probability',
      val3: '25%'
    },
    analyst: 'Staff Glovall Scouting',
    analystRole: 'Evaluador de Campo & Datos'
  },
  {
    id: 'mlb-play-06',
    title: 'Baseball IQ en Jugada Situacional: Asistencia Infield & Corte',
    gameMatchup: 'Astros vs Rangers • Serie de Campeonato',
    playType: 'Baseball IQ',
    mlbStar: 'Alex Bregman',
    teamBadge: 'HOU',
    duration: '4:40',
    date: 'Mayo 2024',
    thumbnail: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=600&q=80',
    videoSimulatorUrl: 'https://cdn.example.com/mlb/bregman-iq.mp4',
    analysisSummary: 'Cómo anticipar un tiro desviado desde el outfield, cortar la bola antes del plato y registrar el out en segunda base antes de que el corredor cruce el home.',
    keyTacticalTakeaways: [
      'Conocimiento situacional del marcador, conteo y velocidad del corredor de bases.',
      'Voz de mando para redirigir el corte defensivo en menos de 0.5 segundos.',
      'Ejecución reglamentaria de la jugada sin conceder bases extras.'
    ],
    glovallIqScore: 99,
    telemetryMetrics: {
      label1: 'IQ Táctico',
      val1: '99/100',
      label2: 'Tiempo de Decisión',
      val2: '0.38s',
      label3: 'Bases Salvadas',
      val3: '+1.8 Runs'
    },
    analyst: 'Lic. Rafael Almonte',
    analystRole: 'Director de Estrategia B-IQ'
  }
];
