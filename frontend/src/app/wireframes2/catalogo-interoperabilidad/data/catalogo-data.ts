export type UserRole =
  | "COORDINADOR_SINARP"
  | "DGR"
  | "DTD"
  | "DPI";

export interface RoleInfo {
  id: UserRole;
  name: string;
  shortName: string;
  badgeTone: "neutral";
  description: string;
  responsibilities: string[];
}

export const ROLES_CONFIG: Record<UserRole, RoleInfo> = {
  COORDINADOR_SINARP: {
    id: "COORDINADOR_SINARP",
    name: "Coordinador SINARP",
    shortName: "Coordinador",
    badgeTone: "neutral",
    description: "Representa a la institución que incorpora la fuente. Registra datos, documentos y subsana observaciones.",
    responsibilities: [
      "Registrar fuente candidata y campos candidatos",
      "Adjuntar documentación soporte según Res. 004",
      "Subsanar observaciones puntuales de DGR sin reiniciar trámite",
      "Consultar estado, historial y recibir notificación final"
    ]
  },
  DGR: {
    id: "DGR",
    name: "Dirección de Gestión y Registro (DGR)",
    shortName: "DGR (Funcional)",
    badgeTone: "neutral",
    description: "Responsable funcional del catálogo. Revisa requisitos, emite observaciones, valida en preproducción y aprueba.",
    responsibilities: [
      "Revisar documentación y campos candidatos",
      "Registrar observaciones a nivel de campo/documento",
      "Validar integración en ambiente de preproducción",
      "Diligenciar formulario automatizado y aprobar integración",
      "Radicar y evaluar requerimientos de novedades (eliminación, supresión, fusión)"
    ]
  },
  DTD: {
    id: "DTD",
    name: "Dirección de Tecnología y Desarrollo (DTD)",
    shortName: "DTD (Técnica)",
    badgeTone: "neutral",
    description: "Responsable técnico de la integración, microservicios, despliegue y paso a producción.",
    responsibilities: [
      "Validar factibilidad técnica y registrar estado OCULTO",
      "Desarrollar microservicio y desplegar en preproducción",
      "Solventar errores técnicos reportados por DGR y redesplegar",
      "Ejecutar el paso a producción y disparar notificación automática"
    ]
  },
  DPI: {
    id: "DPI",
    name: "Dirección de Protección de la Información (DPI)",
    shortName: "DPI (Protección)",
    badgeTone: "neutral",
    description: "Responsable de la clasificación de sensibilidad de los datos según normativa de protección.",
    responsibilities: [
      "Revisar campos candidatos en paralelo a la integración técnica",
      "Clasificar cada campo como Accesible o Confidencial",
      "Cargar el Informe Técnico de Clasificación (PDF)",
      "Vincular clasificación como atributo inmutable del catálogo"
    ]
  }
};

export interface MockUser {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  institution: string;
  initials: string;
}

export const MOCK_USERS_BY_ROLE: Record<UserRole, MockUser> = {
  COORDINADOR_SINARP: {
    id: "USR-001",
    name: "Andrea López",
    role: "COORDINADOR_SINARP",
    roleTitle: "Coordinador SINARP",
    institution: "Dirección General de Registro Civil",
    initials: "AL"
  },
  DGR: {
    id: "USR-002",
    name: "María Torres",
    role: "DGR",
    roleTitle: "Dirección de Gestión y Registro (DGR)",
    institution: "DINARP",
    initials: "MT"
  },
  DTD: {
    id: "USR-003",
    name: "Carlos Mena",
    role: "DTD",
    roleTitle: "Dirección de Tecnologías de la Información (DTD)",
    institution: "DINARP",
    initials: "CM"
  },
  DPI: {
    id: "USR-004",
    name: "Daniela Ruiz",
    role: "DPI",
    roleTitle: "Dirección de Protección de la Información (DPI)",
    institution: "DINARP",
    initials: "DR"
  }
};

export type CampoClasificacion = "Accesible" | "Confidencial" | "Pendiente";

export interface CampoCatalogo {
  id: string;
  nombre: string;
  tipo: "Texto" | "Numérico" | "Fecha" | "Booleano" | "JSON" | "Alfanumérico";
  descripcion: string;
  clasificacion: CampoClasificacion;
  requiereJustificacion?: boolean;
  observacionDGR?: string;
  estadoRevision?: "Valido" | "Observado" | "Pendiente";
}

export type FuenteEstado = "PUBLICADO" | "OCULTO" | "DESACTIVADO";

export interface FuenteServicio {
  id: string;
  institucionId: string;
  institucionNombre: string;
  nombre: string;
  codigoServicio: string;
  descripcion: string;
  estado: FuenteEstado;
  version: string;
  tipoConsumo: "Servicio Web (REST/JSON)" | "Intercambio Masivo (Batch)" | "SOAP / XML";
  baseLegal: string;
  fechaIntegracion: string;
  ultimaActualizacion: string;
  responsableDGR: string;
  responsableDTD: string;
  microservicio: {
    nombre: string;
    version: string;
    endpointPre?: string;
    endpointProd?: string;
    fechaDesplieguePre?: string;
    fechaDespliegueProd?: string;
  };
  clasificacionDPI: {
    clasificado: boolean;
    fechaInforme?: string;
    nroInforme?: string;
    responsableDPI?: string;
    archivoInforme?: string;
  };
  campos: CampoCatalogo[];
  trazabilidadExpedienteId?: string;
  historialNovedades?: Array<{
    fecha: string;
    tipo: string;
    detalle: string;
    responsable: string;
  }>;
}

export interface Institucion {
  id: string;
  nombre: string;
  sigla: string;
  sector: "Público - Función Ejecutiva" | "Público - Función Judicial" | "Público - Función Electoral" | "Público - GAD" | "Privado";
  codigoInstitucion: string;
  contactoCoordinador: {
    nombreTitular: string;
    correoTitular: string;
    nombreSuplente: string;
    correoSuplente: string;
    telefono: string;
  };
  fuentes: FuenteServicio[];
}

export interface DocumentoSoporte {
  id: string;
  nombre: string;
  tipoRequerido: string;
  archivoNombre?: string;
  archivoTamano?: string;
  fechaCarga?: string;
  estadoRevision: "Aprobado" | "Observado" | "Pendiente";
  observacionDGR?: string;
  esReferencial?: boolean;
}

export type EtapaExpediente =
  | "ETAPA_1_REGISTRO"
  | "ETAPA_2_REVISION_DGR"
  | "ETAPA_3_CORRECCION_COORDINADOR"
  | "ETAPA_4_VALIDACION_DTD"
  | "ETAPA_5_PARALELO_DPI_DTD"
  | "ETAPA_6_VALIDACION_PRE_DGR"
  | "ETAPA_7_ERROR_TECNICO_LOOP"
  | "ETAPA_8_APROBACION_DGR"
  | "ETAPA_9_PRODUCCION_DTD"
  | "ETAPA_10_NOTIFICACION_FINAL";

export interface EtapaConfig {
  id: EtapaExpediente;
  numero: number;
  nombre: string;
  huRef: string;
  bpmnActividad: string;
  rolResponsable: UserRole;
  descripcion: string;
}

export const ETAPAS_EXPEDIENTE_CONFIG: Record<EtapaExpediente, EtapaConfig> = {
  ETAPA_1_REGISTRO: {
    id: "ETAPA_1_REGISTRO",
    numero: 1,
    nombre: "Registro de Fuente Candidata",
    huRef: "HU-INT-03",
    bpmnActividad: "Ingresar documentación soporte y campos candidatos",
    rolResponsable: "COORDINADOR_SINARP",
    descripcion: "El Coordinador SINARP registra la información de la fuente, documentos soporte (Res. 004) y campos candidatos.",
  },
  ETAPA_2_REVISION_DGR: {
    id: "ETAPA_2_REVISION_DGR",
    numero: 2,
    nombre: "Revisión Documental y de Campos",
    huRef: "HU-INT-04",
    bpmnActividad: "Validar requisitos documentales y campos",
    rolResponsable: "DGR",
    descripcion: "DGR valida la pertinencia funcional. Si existen errores, emite observaciones puntuales para corrección.",
  },
  ETAPA_3_CORRECCION_COORDINADOR: {
    id: "ETAPA_3_CORRECCION_COORDINADOR",
    numero: 3,
    nombre: "Depuración y Subsanación",
    huRef: "HU-INT-05",
    bpmnActividad: "Validar y depurar información (Coordinador)",
    rolResponsable: "COORDINADOR_SINARP",
    descripcion: "El Coordinador subsana únicamente los elementos observados y reenvía a DGR sin reiniciar el trámite.",
  },
  ETAPA_4_VALIDACION_DTD: {
    id: "ETAPA_4_VALIDACION_DTD",
    numero: 4,
    nombre: "Validación Técnica e Ingreso a Catálogo",
    huRef: "HU-INT-06 / HU-INT-07",
    bpmnActividad: "Validar información en catálogo y pasar a estado OCULTO",
    rolResponsable: "DTD",
    descripcion: "DTD valida la viabilidad técnica y registra la fuente en el catálogo en estado OCULTO.",
  },
  ETAPA_5_PARALELO_DPI_DTD: {
    id: "ETAPA_5_PARALELO_DPI_DTD",
    numero: 5,
    nombre: "Clasificación DPI e Integración DTD (Paralelo)",
    huRef: "HU-INT-08 (DPI) y HU-INT-09 (DTD)",
    bpmnActividad: "Paralelo: DPI clasifica campos + DTD despliega en preproducción",
    rolResponsable: "DPI",
    descripcion: "DPI clasifica campos (Accesible/Confidencial) con informe PDF, mientras DTD genera y despliega el microservicio en preproducción.",
  },
  ETAPA_6_VALIDACION_PRE_DGR: {
    id: "ETAPA_6_VALIDACION_PRE_DGR",
    numero: 6,
    nombre: "Validación Funcional en Preproducción",
    huRef: "HU-INT-10",
    bpmnActividad: "Validar la integración en ambiente preproducción",
    rolResponsable: "DGR",
    descripcion: "DGR realiza pruebas de consumo funcional en preproducción. Emite resultado favorable o no favorable.",
  },
  ETAPA_7_ERROR_TECNICO_LOOP: {
    id: "ETAPA_7_ERROR_TECNICO_LOOP",
    numero: 7,
    nombre: "Corrección Técnica y Redespliegue",
    huRef: "HU-INT-11",
    bpmnActividad: "Solventar errores y redesplegar en preproducción",
    rolResponsable: "DTD",
    descripcion: "DTD atiende las incidencias técnicas reportadas por DGR, ajusta el microservicio y redespliega para nueva validación.",
  },
  ETAPA_8_APROBACION_DGR: {
    id: "ETAPA_8_APROBACION_DGR",
    numero: 8,
    nombre: "Aprobación de la Integración",
    huRef: "HU-INT-12",
    bpmnActividad: "Registrar resultados favorables en formulario automatizado y aprobar",
    rolResponsable: "DGR",
    descripcion: "DGR formaliza los resultados de validación mediante formulario automatizado precargado y emite la aprobación.",
  },
  ETAPA_9_PRODUCCION_DTD: {
    id: "ETAPA_9_PRODUCCION_DTD",
    numero: 9,
    nombre: "Paso a Producción",
    huRef: "HU-INT-13",
    bpmnActividad: "Generar paso a producción del microservicio",
    rolResponsable: "DTD",
    descripcion: "DTD despliega el microservicio en el entorno productivo y registra endpoints y certificados oficiales.",
  },
  ETAPA_10_NOTIFICACION_FINAL: {
    id: "ETAPA_10_NOTIFICACION_FINAL",
    numero: 10,
    nombre: "Notificación Automática de Cierre",
    huRef: "HU-INT-14",
    bpmnActividad: "Disparar notificación automática de fuente integrada",
    rolResponsable: "COORDINADOR_SINARP",
    descripcion: "El sistema notifica automáticamente a los coordinadores institucional titular y suplente la disponibilidad de la fuente.",
  }
};

export interface EventoHistorial {
  id: string;
  fecha: string;
  hora: string;
  etapaNumero: number;
  etapaNombre: string;
  actorRol: UserRole;
  actorNombre: string;
  accion: string;
  version: string;
  observaciones?: string;
  detalles?: string;
  huRef: string;
}

export interface ExpedienteIntegracion {
  id: string;
  codigoExpediente: string;
  institucionId: string;
  institucionNombre: string;
  institucionSigla: string;
  nombreFuente: string;
  codigoFuente: string;
  descripcion: string;
  fechaRadicacion: string;
  ultimaActualizacion: string;
  versionActual: string;
  etapaActual: EtapaExpediente;
  responsableActualRol: UserRole;
  responsableActualNombre: string;
  estadoGeneral: "Borrador" | "En revisión DGR" | "Con observaciones" | "En validación técnica DTD" | "En integración y clasificación" | "En validación preproducción" | "En corrección técnica" | "Aprobada" | "En producción" | "Integrada";

  // Documentos soporte (Res. 004)
  documentosSoporte: DocumentoSoporte[];

  // Campos candidatos
  camposCandidatos: CampoCatalogo[];

  // Validación técnica DTD
  validacionTecnicaDTD?: {
    aprobado: boolean;
    fecha: string;
    responsable: string;
    observacionTecnica?: string;
    estadoCatalogoAsignado: "OCULTO";
  };

  // Paralelo DPI
  clasificacionDPI?: {
    completada: boolean;
    fecha: string;
    responsable: string;
    informeAdjunto?: string;
    numeroInforme?: string;
    observaciones?: string;
  };

  // Paralelo DTD (Preproducción)
  desplieguePreDTD?: {
    completado: boolean;
    fecha: string;
    responsable: string;
    microservicioNombre: string;
    version: string;
    endpointPre: string;
    notasDespliegue?: string;
  };

  // Validación Preproducción DGR
  validacionPreDGR?: {
    evaluada: boolean;
    resultado: "Favorable" | "No favorable" | "Pendiente";
    fecha: string;
    responsable: string;
    observacionesValidacion?: string;
    erroresDetectados?: string[];
  };

  // Loop corrección DTD
  correccionTecnicaDTD?: {
    atendida: boolean;
    fecha: string;
    responsable: string;
    solucionAplicada: string;
    nuevaVersion: string;
  };

  // Aprobación DGR
  aprobacionDGR?: {
    aprobada: boolean;
    fecha: string;
    responsable: string;
    formularioAutomatizadoNro: string;
    conclusiones: string;
  };

  // Paso a Producción DTD
  pasoProduccionDTD?: {
    ejecutado: boolean;
    fecha: string;
    responsable: string;
    endpointProd: string;
    versionProd: string;
  };

  // Notificación
  notificacionFinal?: {
    enviada: boolean;
    fecha: string;
    destinatarios: string[];
    asunto: string;
  };

  historial: EventoHistorial[];
}

export type TipoNovedad = "Eliminación" | "Supresión" | "Fusión" | "Actualización de esquema (Propuesta)";

export interface NovedadCatalogo {
  id: string;
  nroTramite: string;
  organismoSolicitante: string;
  tipoNovedad: TipoNovedad;
  fechaRadicacion: string;
  estado: "En validación legal y funcional" | "Aplicada (Fuente Desactivada)" | "Fusión ejecutada y notificada" | "Rechazada";
  fuentesAfectadas: Array<{
    fuenteId: string;
    fuenteNombre: string;
    institucionNombre: string;
    estadoPrevio: FuenteEstado;
    estadoNuevo: FuenteEstado;
  }>;
  documentoSoporteOficio: {
    numeroOficio: string;
    fechaOficio: string;
    archivoPdf: string;
  };
  evaluacionDGR: {
    responsable: string;
    fechaDictamen?: string;
    conceptoLegal: string;
    conceptoFuncional: string;
    procede: boolean;
  };
  notificacionFusion?: {
    requiereNotificacion: boolean;
    notificadoCoordinador: boolean;
    fechaNotificacion?: string;
    mensajeEnviado?: string;
  };
  historialEventos: Array<{
    fecha: string;
    actor: string;
    accion: string;
    detalle: string;
  }>;
}

// ==========================================
// MOCK DATA INICIAL COMPLETO Y COHERENTE
// ==========================================

export const INITIAL_INSTITUCIONES: Institucion[] = [
  {
    id: "INST-001",
    nombre: "Dirección General de Registro Civil, Identificación y Cedulación",
    sigla: "DIGERCIC",
    sector: "Público - Función Ejecutiva",
    codigoInstitucion: "1760001550001",
    contactoCoordinador: {
      nombreTitular: "Ing. Carlos Mendoza Viteri",
      correoTitular: "carlos.mendoza@registrocivil.gob.ec",
      nombreSuplente: "Lcda. Andrea Saltos",
      correoSuplente: "andrea.saltos@registrocivil.gob.ec",
      telefono: "02-3814400 ext. 1204"
    },
    fuentes: [
      {
        id: "FNT-001",
        institucionId: "INST-001",
        institucionNombre: "Dirección General de Registro Civil, Identificación y Cedulación",
        nombre: "Datos Demográficos e Identidad",
        codigoServicio: "SRV-RC-001",
        descripcion: "Consulta de datos básicos de identificación ciudadana, estado civil, fecha de nacimiento y condición de ciudadanía.",
        estado: "PUBLICADO",
        version: "v2.1.0",
        tipoConsumo: "Servicio Web (REST/JSON)",
        baseLegal: "Ley Orgánica de Gestión de la Identidad y Datos Civiles - Res. 004-DN-2023",
        fechaIntegracion: "14/01/2026",
        ultimaActualizacion: "18/02/2026",
        responsableDGR: "Dra. Valeria Paredes (DGR)",
        responsableDTD: "Ing. Marco Andrade (DTD)",
        microservicio: {
          nombre: "ms-registrocivil-identidad",
          version: "2.1.0",
          endpointPre: "https://pre-api.dinarp.gob.ec/v2/rc/identidad",
          endpointProd: "https://api.dinarp.gob.ec/v2/rc/identidad",
          fechaDesplieguePre: "10/01/2026",
          fechaDespliegueProd: "14/01/2026"
        },
        clasificacionDPI: {
          clasificado: true,
          fechaInforme: "12/01/2026",
          nroInforme: "INF-DPI-2026-0012",
          responsableDPI: "Mgs. Patricio Silva (DPI)",
          archivoInforme: "Informe_Clasificacion_RC_Identidad.pdf"
        },
        campos: [
          { id: "c-01", nombre: "numeroIdentificacion", tipo: "Alfanumérico", descripcion: "Número único de cédula o documento de identidad", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-02", nombre: "nombres", tipo: "Texto", descripcion: "Nombres completos del titular según acta registral", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-03", nombre: "apellidos", tipo: "Texto", descripcion: "Apellidos paterno y materno del titular", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-04", nombre: "fechaNacimiento", tipo: "Fecha", descripcion: "Fecha de nacimiento registrada (AAAA-MM-DD)", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-05", nombre: "estadoCivil", tipo: "Texto", descripcion: "Estado civil registrado (Soltero, Casado, Divorciado, etc.)", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-06", nombre: "condicionCedulado", tipo: "Texto", descripcion: "Condición vital (Vivo, Fallecido, Suspendido)", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-07", nombre: "nombrePadre", tipo: "Texto", descripcion: "Filiación paterna registrada", clasificacion: "Confidencial", requiereJustificacion: true, estadoRevision: "Valido" },
          { id: "c-08", nombre: "nombreMadre", tipo: "Texto", descripcion: "Filiación materna registrada", clasificacion: "Confidencial", requiereJustificacion: true, estadoRevision: "Valido" },
          { id: "c-09", nombre: "domicilioDetallado", tipo: "Texto", descripcion: "Dirección domiciliaria completa con calle secundaria y número de casa", clasificacion: "Confidencial", requiereJustificacion: true, estadoRevision: "Valido" }
        ]
      },
      {
        id: "FNT-002",
        institucionId: "INST-001",
        institucionNombre: "Dirección General de Registro Civil, Identificación y Cedulación",
        nombre: "Pasaportes y Documentos de Viaje",
        codigoServicio: "SRV-RC-002",
        descripcion: "Verificación de validez, fecha de emisión y vigencia de pasaportes ordinarios biométricos.",
        estado: "PUBLICADO",
        version: "v1.0.4",
        tipoConsumo: "Servicio Web (REST/JSON)",
        baseLegal: "Reglamento de Documentos de Viaje - Res. 004-DN-2023",
        fechaIntegracion: "02/02/2026",
        ultimaActualizacion: "20/02/2026",
        responsableDGR: "Lcdo. Fernando Cueva (DGR)",
        responsableDTD: "Ing. Sofía Morales (DTD)",
        microservicio: {
          nombre: "ms-registrocivil-pasaportes",
          version: "1.0.4",
          endpointPre: "https://pre-api.dinarp.gob.ec/v1/rc/pasaportes",
          endpointProd: "https://api.dinarp.gob.ec/v1/rc/pasaportes",
          fechaDesplieguePre: "28/01/2026",
          fechaDespliegueProd: "02/02/2026"
        },
        clasificacionDPI: {
          clasificado: true,
          fechaInforme: "30/01/2026",
          nroInforme: "INF-DPI-2026-0028",
          responsableDPI: "Mgs. Patricio Silva (DPI)",
          archivoInforme: "Informe_Clasificacion_RC_Pasaportes.pdf"
        },
        campos: [
          { id: "c-10", nombre: "numeroPasaporte", tipo: "Alfanumérico", descripcion: "Código alfanumérico del pasaporte biométrico", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-11", nombre: "fechaEmision", tipo: "Fecha", descripcion: "Fecha en que se expidió el documento de viaje", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-12", nombre: "fechaExpiracion", tipo: "Fecha", descripcion: "Fecha de caducidad del pasaporte", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-13", nombre: "estadoDocumento", tipo: "Texto", descripcion: "Estado actual (Activo, Anulado, Extraviado)", clasificacion: "Accesible", estadoRevision: "Valido" }
        ]
      }
    ]
  },
  {
    id: "INST-002",
    nombre: "Servicio de Rentas Internas",
    sigla: "SRI",
    sector: "Público - Función Ejecutiva",
    codigoInstitucion: "1760013210001",
    contactoCoordinador: {
      nombreTitular: "Ing. Marcelo Guzmán",
      correoTitular: "mguzman@sri.gob.ec",
      nombreSuplente: "Econ. Mónica Carvajal",
      correoSuplente: "mcarvajal@sri.gob.ec",
      telefono: "02-3934444 ext. 5521"
    },
    fuentes: [
      {
        id: "FNT-003",
        institucionId: "INST-002",
        institucionNombre: "Servicio de Rentas Internas",
        nombre: "Registro Único de Contribuyentes (RUC)",
        codigoServicio: "SRV-SRI-001",
        descripcion: "Información del catastro tributario de personas naturales y jurídicas, actividades económicas y estado del RUC.",
        estado: "PUBLICADO",
        version: "v3.0.0",
        tipoConsumo: "Servicio Web (REST/JSON)",
        baseLegal: "Código Tributario del Ecuador - Res. 004-DN-2023",
        fechaIntegracion: "19/01/2026",
        ultimaActualizacion: "05/03/2026",
        responsableDGR: "Dra. Valeria Paredes (DGR)",
        responsableDTD: "Ing. Marco Andrade (DTD)",
        microservicio: {
          nombre: "ms-sri-ruc-catastro",
          version: "3.0.0",
          endpointPre: "https://pre-api.dinarp.gob.ec/v3/sri/ruc",
          endpointProd: "https://api.dinarp.gob.ec/v3/sri/ruc",
          fechaDesplieguePre: "15/01/2026",
          fechaDespliegueProd: "19/01/2026"
        },
        clasificacionDPI: {
          clasificado: true,
          fechaInforme: "17/01/2026",
          nroInforme: "INF-DPI-2026-0018",
          responsableDPI: "Mgs. Patricio Silva (DPI)",
          archivoInforme: "Informe_Clasificacion_SRI_RUC.pdf"
        },
        campos: [
          { id: "c-14", nombre: "numeroRuc", tipo: "Alfanumérico", descripcion: "Número de 13 dígitos del RUC", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-15", nombre: "razonSocial", tipo: "Texto", descripcion: "Razón social o nombres comerciales registrados", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-16", nombre: "estadoContribuyente", tipo: "Texto", descripcion: "Estado del RUC (Activo, Pasivo, Suspendido)", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-17", nombre: "tipoContribuyente", tipo: "Texto", descripcion: "Persona Natural, Sociedad, RIMPE, etc.", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-18", nombre: "actividadEconomicaPrincipal", tipo: "Texto", descripcion: "Descripción de la actividad según CIIU", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-19", nombre: "obligadoContabilidad", tipo: "Booleano", descripcion: "Indicador S/N de obligación contable", clasificacion: "Accesible", estadoRevision: "Valido" }
        ]
      },
      {
        id: "FNT-004",
        institucionId: "INST-002",
        institucionNombre: "Servicio de Rentas Internas",
        nombre: "Avalúo y Catastro Vehicular",
        codigoServicio: "SRV-SRI-002",
        descripcion: "Valores de avalúo comercial fiscal, impuesto a la propiedad vehicular y características básicas del automotor.",
        estado: "OCULTO",
        version: "v1.0.0-rc2",
        tipoConsumo: "Servicio Web (REST/JSON)",
        baseLegal: "Ley de Régimen Tributario Interno - Res. 004-DN-2023",
        fechaIntegracion: "En integración técnica",
        ultimaActualizacion: "15/03/2026",
        responsableDGR: "Lcdo. Fernando Cueva (DGR)",
        responsableDTD: "Ing. Sofía Morales (DTD)",
        microservicio: {
          nombre: "ms-sri-vehiculos-avaluo",
          version: "1.0.0-rc2",
          endpointPre: "https://pre-api.dinarp.gob.ec/v1/sri/vehiculos-avaluo",
          fechaDesplieguePre: "12/03/2026"
        },
        clasificacionDPI: {
          clasificado: true,
          fechaInforme: "10/03/2026",
          nroInforme: "INF-DPI-2026-0045",
          responsableDPI: "Mgs. Patricio Silva (DPI)",
          archivoInforme: "Informe_Clasificacion_SRI_Vehiculos.pdf"
        },
        campos: [
          { id: "c-20", nombre: "placaVehiculo", tipo: "Alfanumérico", descripcion: "Placa oficial de identificación vehicular", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-21", nombre: "marcaModelo", tipo: "Texto", descripcion: "Marca, modelo y versión comercial", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-22", nombre: "anioFabricacion", tipo: "Numérico", descripcion: "Año de fabricación del automotor", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-23", nombre: "avaluoFiscal", tipo: "Numérico", descripcion: "Valor de avalúo vigente según base SRI", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-24", nombre: "historialExoneraciones", tipo: "JSON", descripcion: "Detalle de beneficios tributarios aplicados", clasificacion: "Confidencial", requiereJustificacion: true, estadoRevision: "Valido" }
        ]
      }
    ]
  },
  {
    id: "INST-003",
    nombre: "Agencia Nacional de Tránsito",
    sigla: "ANT",
    sector: "Público - Función Ejecutiva",
    codigoInstitucion: "1768134590001",
    contactoCoordinador: {
      nombreTitular: "Ing. Pamela Játiva",
      correoTitular: "pamela.jativa@ant.gob.ec",
      nombreSuplente: "Abg. Diego Narváez",
      correoSuplente: "diego.narvaez@ant.gob.ec",
      telefono: "02-3828890 ext. 331"
    },
    fuentes: [
      {
        id: "FNT-005",
        institucionId: "INST-003",
        institucionNombre: "Agencia Nacional de Tránsito",
        nombre: "Licencias de Conducir y Puntos",
        codigoServicio: "SRV-ANT-001",
        descripcion: "Consulta de tipo de licencia otorgada, puntos vigentes, restricciones médicas y fecha de caducidad.",
        estado: "PUBLICADO",
        version: "v2.0.0",
        tipoConsumo: "Servicio Web (REST/JSON)",
        baseLegal: "Ley Orgánica de Transporte Terrestre, Tránsito y Seguridad Vial",
        fechaIntegracion: "25/01/2026",
        ultimaActualizacion: "28/02/2026",
        responsableDGR: "Dra. Valeria Paredes (DGR)",
        responsableDTD: "Ing. Marco Andrade (DTD)",
        microservicio: {
          nombre: "ms-ant-licencias",
          version: "2.0.0",
          endpointPre: "https://pre-api.dinarp.gob.ec/v2/ant/licencias",
          endpointProd: "https://api.dinarp.gob.ec/v2/ant/licencias",
          fechaDesplieguePre: "20/01/2026",
          fechaDespliegueProd: "25/01/2026"
        },
        clasificacionDPI: {
          clasificado: true,
          fechaInforme: "22/01/2026",
          nroInforme: "INF-DPI-2026-0021",
          responsableDPI: "Mgs. Patricio Silva (DPI)",
          archivoInforme: "Informe_Clasificacion_ANT_Licencias.pdf"
        },
        campos: [
          { id: "c-25", nombre: "tipoLicencia", tipo: "Texto", descripcion: "Categoría (A, B, C, D, E, F, G)", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-26", nombre: "puntosDisponibles", tipo: "Numérico", descripcion: "Saldo de puntos sobre base de 30", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-27", nombre: "fechaCaducidad", tipo: "Fecha", descripcion: "Fecha límite de vigencia de la licencia", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-28", nombre: "restriccionesMedicas", tipo: "Texto", descripcion: "Observaciones de conducción (lentes, prótesis)", clasificacion: "Confidencial", requiereJustificacion: true, estadoRevision: "Valido" }
        ]
      },
      {
        id: "FNT-006",
        institucionId: "INST-003",
        institucionNombre: "Agencia Nacional de Tránsito",
        nombre: "Registro Histórico de Infracciones de Tránsito",
        codigoServicio: "SRV-ANT-002",
        descripcion: "Fuente histórica consolidada de citaciones y fotomultas (Desactivada por migración a plataforma unificada de tránsito).",
        estado: "DESACTIVADO",
        version: "v1.2.0-legacy",
        tipoConsumo: "Servicio Web (REST/JSON)",
        baseLegal: "Oficio Nro. ANT-DE-2026-0412 / Res. 004-DN-2023",
        fechaIntegracion: "10/11/2025",
        ultimaActualizacion: "14/03/2026",
        responsableDGR: "María Torres (DGR)",
        responsableDTD: "Carlos Mena (DTD)",
        microservicio: {
          nombre: "ms-ant-citaciones-legacy",
          version: "1.2.0"
        },
        clasificacionDPI: {
          clasificado: true,
          fechaInforme: "08/11/2025",
          nroInforme: "INF-DPI-2025-0189",
          responsableDPI: "Daniela Ruiz (DPI)",
          archivoInforme: "Informe_Clasificacion_ANT_Infracciones.pdf"
        },
        campos: [
          { id: "c-29", nombre: "nroCitacion", tipo: "Alfanumérico", descripcion: "Identificador de la boleta de infracción", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-30", nombre: "fechaInfraccion", tipo: "Fecha", descripcion: "Momento del evento sancionado", clasificacion: "Accesible", estadoRevision: "Valido" },
          { id: "c-31", nombre: "valorMulta", tipo: "Numérico", descripcion: "Monto liquidado de la sanción", clasificacion: "Accesible", estadoRevision: "Valido" }
        ],
        historialNovedades: [
          {
            fecha: "14/03/2026",
            tipo: "Supresión / Desactivación",
            detalle: "Fuente desactivada formalmente por requerimiento de novedad NOV-2026-001. Se conserva historial inmutable sin borrado físico.",
            responsable: "María Torres (DGR)"
          }
        ]
      }
    ]
  }
];

// EXPEDIENTES DE INTEGRACIÓN DE PRUEBA
export const INITIAL_EXPEDIENTES: ExpedienteIntegracion[] = [
  {
    id: "EXP-2026-001",
    codigoExpediente: "INT-2026-001",
    institucionId: "INST-001",
    institucionNombre: "Dirección General de Registro Civil, Identificación y Cedulación",
    institucionSigla: "DIGERCIC",
    nombreFuente: "Registro de Defunciones y Certificados Digitales",
    codigoFuente: "SRV-RC-003",
    descripcion: "Consulta en tiempo real del acta de defunción, causa de defunción codificada CIE-10, lugar de defunción y datos del declarante para cruce con entidades de seguridad social y bancarias.",
    fechaRadicacion: "18/03/2026 09:30",
    ultimaActualizacion: "22/03/2026 14:15",
    versionActual: "v1.0.0",
    etapaActual: "ETAPA_5_PARALELO_DPI_DTD",
    responsableActualRol: "DPI",
    responsableActualNombre: "Daniela Ruiz (DPI) & Carlos Mena (DTD)",
    estadoGeneral: "En integración y clasificación",
    documentosSoporte: [
      {
        id: "doc-1",
        nombre: "Oficio formal de solicitud de integración",
        tipoRequerido: "PDF Firmado electrónicamente",
        archivoNombre: "OFICIO-RC-DIR-2026-0891-M.pdf",
        archivoTamano: "1.4 MB",
        fechaCarga: "18/03/2026 09:35",
        estadoRevision: "Aprobado",
        esReferencial: true
      },
      {
        id: "doc-2",
        nombre: "Diccionario de datos y especificación técnica de la fuente",
        tipoRequerido: "PDF / Excel",
        archivoNombre: "Diccionario_Datos_Defunciones_v1.0.pdf",
        archivoTamano: "3.2 MB",
        fechaCarga: "18/03/2026 09:40",
        estadoRevision: "Aprobado",
        esReferencial: true
      },
      {
        id: "doc-3",
        nombre: "Designación oficial del Coordinador SINARP Titular y Suplente",
        tipoRequerido: "Acción de Personal / Resolución PDF",
        archivoNombre: "Designacion_Coordinadores_RC_2026.pdf",
        archivoTamano: "890 KB",
        fechaCarga: "18/03/2026 09:42",
        estadoRevision: "Aprobado",
        esReferencial: true
      }
    ],
    camposCandidatos: [
      { id: "f-01", nombre: "numeroActaDefuncion", tipo: "Alfanumérico", descripcion: "Código único de registro del acta de defunción", clasificacion: "Accesible", estadoRevision: "Valido" },
      { id: "f-02", nombre: "numeroCedulaFallecido", tipo: "Alfanumérico", descripcion: "Número de identificación de la persona fallecida", clasificacion: "Accesible", estadoRevision: "Valido" },
      { id: "f-03", nombre: "nombresFallecido", tipo: "Texto", descripcion: "Nombres y apellidos completos del fallecido", clasificacion: "Accesible", estadoRevision: "Valido" },
      { id: "f-04", nombre: "fechaHoraFallecimiento", tipo: "Fecha", descripcion: "Fecha y hora exacta registrada en el certificado médico", clasificacion: "Accesible", estadoRevision: "Valido" },
      { id: "f-05", nombre: "causaFallecimientoCIE10", tipo: "Texto", descripcion: "Diagnóstico médico de causa básica de defunción (CIE-10)", clasificacion: "Confidencial", requiereJustificacion: true, estadoRevision: "Valido" },
      { id: "f-06", nombre: "lugarFallecimientoProvinciaCanton", tipo: "Texto", descripcion: "Jurisdicción territorial del deceso", clasificacion: "Accesible", estadoRevision: "Valido" },
      { id: "f-07", nombre: "cedulaDeclarante", tipo: "Alfanumérico", descripcion: "Identificación de quien asiste a registrar la defunción", clasificacion: "Confidencial", requiereJustificacion: true, estadoRevision: "Valido" }
    ],
    validacionTecnicaDTD: {
      aprobado: true,
      fecha: "20/03/2026 11:20",
      responsable: "Carlos Mena (DTD)",
      observacionTecnica: "Estructura JSON y esquema REST validados correctamente. Fuente ingresada en catálogo interno bajo estado OCULTO.",
      estadoCatalogoAsignado: "OCULTO"
    },
    clasificacionDPI: {
      completada: false,
      fecha: "En proceso",
      responsable: "Daniela Ruiz (DPI)",
      observaciones: "Evaluando sensibilidad del campo causaFallecimientoCIE10 conforme a la LOPDP."
    },
    desplieguePreDTD: {
      completado: true,
      fecha: "21/03/2026 16:45",
      responsable: "Carlos Mena (DTD)",
      microservicioNombre: "ms-rc-defunciones",
      version: "1.0.0-rc1",
      endpointPre: "https://pre-api.dinarp.gob.ec/v1/rc/defunciones",
      notasDespliegue: "Microservicio desplegado en clúster de preproducción con autenticación mTLS y token JWT."
    },
    historial: [
      {
        id: "h-01",
        fecha: "18/03/2026",
        hora: "09:45",
        etapaNumero: 1,
        etapaNombre: "Registro de Fuente Candidata",
        actorRol: "COORDINADOR_SINARP",
        actorNombre: "Andrea López (Registro Civil)",
        accion: "Envío inicial de integración a revisión",
        version: "v1.0.0",
        detalles: "Se ingresaron 3 documentos soporte y 7 campos candidatos.",
        huRef: "HU-INT-03"
      },
      {
        id: "h-02",
        fecha: "19/03/2026",
        hora: "10:15",
        etapaNumero: 2,
        etapaNombre: "Revisión Documental y de Campos",
        actorRol: "DGR",
        actorNombre: "María Torres (DGR)",
        accion: "Solicitud de corrección con observaciones",
        version: "v1.0.0",
        observaciones: "El campo causaFallecimientoCIE10 debe precisar si incluye causa antecedente o solo causa básica; corregir descripción.",
        huRef: "HU-INT-04"
      },
      {
        id: "h-03",
        fecha: "19/03/2026",
        hora: "15:30",
        etapaNumero: 3,
        etapaNombre: "Depuración y Subsanación",
        actorRol: "COORDINADOR_SINARP",
        actorNombre: "Andrea López (Registro Civil)",
        accion: "Reenvío con corrección puntual",
        version: "v1.0.1",
        detalles: "Se actualizó la descripción del campo causaFallecimientoCIE10 según requerimiento sin reiniciar el expediente.",
        huRef: "HU-INT-05"
      },
      {
        id: "h-04",
        fecha: "20/03/2026",
        hora: "09:00",
        etapaNumero: 2,
        etapaNombre: "Revisión Documental y de Campos",
        actorRol: "DGR",
        actorNombre: "María Torres (DGR)",
        accion: "Aprobación documental y derivación técnica (Enlace A)",
        version: "v1.0.1",
        detalles: "Requisitos documentales y pertinencia funcional completos. Pasa a DTD.",
        huRef: "HU-INT-04"
      },
      {
        id: "h-05",
        fecha: "20/03/2026",
        hora: "11:20",
        etapaNumero: 4,
        etapaNombre: "Validación Técnica e Ingreso a Catálogo",
        actorRol: "DTD",
        actorNombre: "Carlos Mena (DTD)",
        accion: "Validación técnica aprobada y pase a estado OCULTO",
        version: "v1.0.1",
        detalles: "Fuente incorporada internamente en el Catálogo como OCULTO. Se inician actividades paralelas DPI y DTD.",
        huRef: "HU-INT-06 / HU-INT-07"
      },
      {
        id: "h-06",
        fecha: "21/03/2026",
        hora: "16:45",
        etapaNumero: 5,
        etapaNombre: "Integración DTD en Preproducción",
        actorRol: "DTD",
        actorNombre: "Carlos Mena (DTD)",
        accion: "Despliegue de microservicio en preproducción",
        version: "v1.0.0-rc1",
        detalles: "Endpoint preproducción generado: https://pre-api.dinarp.gob.ec/v1/rc/defunciones",
        huRef: "HU-INT-09"
      }
    ]
  },
  {
    id: "EXP-2026-002",
    codigoExpediente: "INT-2026-002",
    institucionId: "INST-002",
    institucionNombre: "Servicio de Rentas Internas",
    institucionSigla: "SRI",
    nombreFuente: "Cumplimiento y Obligaciones Tributarias al Día",
    codigoFuente: "SRV-SRI-003",
    descripcion: "Consulta de estado de cumplimiento tributario ciudadano y corporativo (Al día / Con deuda en firme / En impugnación).",
    fechaRadicacion: "15/03/2026 11:00",
    ultimaActualizacion: "21/03/2026 17:00",
    versionActual: "v1.0.0",
    etapaActual: "ETAPA_2_REVISION_DGR",
    responsableActualRol: "DGR",
    responsableActualNombre: "María Torres (DGR)",
    estadoGeneral: "En revisión DGR",
    documentosSoporte: [
      {
        id: "doc-4",
        nombre: "Oficio formal SRI-DGT-2026-0129",
        tipoRequerido: "PDF",
        archivoNombre: "SRI-DGT-2026-0129.pdf",
        archivoTamano: "1.1 MB",
        fechaCarga: "15/03/2026 11:05",
        estadoRevision: "Pendiente",
        esReferencial: true
      },
      {
        id: "doc-5",
        nombre: "Especificación OpenAPI 3.0",
        tipoRequerido: "YAML / JSON",
        archivoNombre: "openapi-sri-cumplimiento.json",
        archivoTamano: "450 KB",
        fechaCarga: "15/03/2026 11:10",
        estadoRevision: "Pendiente",
        esReferencial: true
      }
    ],
    camposCandidatos: [
      { id: "f-08", nombre: "identificacionContribuyente", tipo: "Alfanumérico", descripcion: "Cédula o RUC", clasificacion: "Pendiente", estadoRevision: "Pendiente" },
      { id: "f-09", nombre: "estadoCumplimiento", tipo: "Texto", descripcion: "Al Día, En Mora, Coactiva", clasificacion: "Pendiente", estadoRevision: "Pendiente" },
      { id: "f-10", nombre: "montoDeudaFirme", tipo: "Numérico", descripcion: "Monto exigible de cobro", clasificacion: "Pendiente", estadoRevision: "Pendiente" }
    ],
    historial: [
      {
        id: "h-07",
        fecha: "15/03/2026",
        hora: "11:15",
        etapaNumero: 1,
        etapaNombre: "Registro de Fuente Candidata",
        actorRol: "COORDINADOR_SINARP",
        actorNombre: "Andrea López (Registro Civil)",
        accion: "Envío inicial a revisión",
        version: "v1.0.0",
        huRef: "HU-INT-03"
      }
    ]
  }
];

// NOVEDADES DEL CATÁLOGO DE PRUEBA
export const INITIAL_NOVEDADES: NovedadCatalogo[] = [
  {
    id: "NOV-2026-001",
    nroTramite: "NOV-CAT-2026-001",
    organismoSolicitante: "Agencia Nacional de Tránsito (ANT) / Ministerio de Transporte",
    tipoNovedad: "Supresión",
    fechaRadicacion: "12/03/2026 10:00",
    estado: "Aplicada (Fuente Desactivada)",
    fuentesAfectadas: [
      {
        fuenteId: "FNT-006",
        fuenteNombre: "Registro Histórico de Infracciones de Tránsito (Legacy)",
        institucionNombre: "Agencia Nacional de Tránsito",
        estadoPrevio: "PUBLICADO",
        estadoNuevo: "DESACTIVADO"
      }
    ],
    documentoSoporteOficio: {
      numeroOficio: "ANT-DE-2026-0412-O",
      fechaOficio: "10/03/2026",
      archivoPdf: "Oficio_Supresion_Servicio_ANT_Legacy.pdf"
    },
    evaluacionDGR: {
      responsable: "María Torres (DGR)",
      fechaDictamen: "14/03/2026",
      conceptoLegal: "Cumple con el Art. 18 de la Res. 004-DN-2023. La entidad centralizó las citaciones en el nuevo sistema unificado AXIS 4.0.",
      conceptoFuncional: "Procede la desactivación en el Catálogo. Se inhabilita para nuevas solicitudes de consumo manteniendo el histórico y bitácora intacta.",
      procede: true
    },
    historialEventos: [
      { fecha: "12/03/2026 10:00", actor: "Mesa de Entrada / DGR", accion: "Radicación de requerimiento", detalle: "Radicado requerimiento de supresión de fuente emitido por ANT." },
      { fecha: "14/03/2026 11:30", actor: "María Torres (DGR)", accion: "Dictamen favorable y desactivación", detalle: "Fuente FNT-006 marcada como DESACTIVADO en el Catálogo sin borrado físico." }
    ]
  },
  {
    id: "NOV-2026-002",
    nroTramite: "NOV-CAT-2026-002",
    organismoSolicitante: "Ministerio de Telecomunicaciones y de la Sociedad de la Información (MINTEL)",
    tipoNovedad: "Fusión",
    fechaRadicacion: "19/03/2026 14:20",
    estado: "En validación legal y funcional",
    fuentesAfectadas: [
      {
        fuenteId: "FNT-001",
        fuenteNombre: "Datos Demográficos e Identidad",
        institucionNombre: "Dirección General de Registro Civil",
        estadoPrevio: "PUBLICADO",
        estadoNuevo: "PUBLICADO"
      }
    ],
    documentoSoporteOficio: {
      numeroOficio: "MINTEL-SUBGOB-2026-0188-OF",
      fechaOficio: "18/03/2026",
      archivoPdf: "Requerimiento_Fusion_Padron_Electoral.pdf"
    },
    evaluacionDGR: {
      responsable: "María Torres (DGR)",
      conceptoLegal: "En análisis legal de competencias concurrentes CNE - Registro Civil.",
      conceptoFuncional: "Se evalúa fusionar el padrón electoral pasivo dentro del microservicio de identidad.",
      procede: false
    },
    notificacionFusion: {
      requiereNotificacion: true,
      notificadoCoordinador: false
    },
    historialEventos: [
      { fecha: "19/03/2026 14:20", actor: "Mesa de Entrada / DGR", accion: "Radicación de requerimiento", detalle: "Radicado requerimiento de fusión de servicios registrales." }
    ]
  }
];

