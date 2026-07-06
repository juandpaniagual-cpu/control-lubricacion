window.CMMS_SEED_DATA = {
  seedVersion: "excel-lubricacion-2026-07-04-v3-pwa-roles",
  sourceFile: "Formato_seguimiento_lubricacion_centrifugas.xlsx",
  sourceSheet: "PLAN_MAESTRO / REGISTRO_EJECUCIONES / PARAMETROS",
  config: {
    baseDate: "2026-05-01",
    prealertDays: 7,
    site: "Planta Sales",
    masterSystem: "SAP",
    supportSystem: "App local / CMMS de turno",
  },
  equipment: [
    {
      id: "EQ-30M001",
      code: "30M001",
      name: "Centrífuga horizontal 30M001",
      area: "Hipocalcio",
      system: "Centrifugación",
      subsystem: "Decantación",
      family: "Centrífugas",
      criticality: "Alta",
      costCenter: "CC-CENT-01",
      active: true,
    },
    {
      id: "EQ-30M002",
      code: "30M002",
      name: "Centrífuga horizontal 30M002",
      area: "Hipocalcio",
      system: "Centrifugación",
      subsystem: "Decantación",
      family: "Centrífugas",
      criticality: "Alta",
      costCenter: "CC-CENT-01",
      active: true,
    },
    {
      id: "EQ-40M001",
      code: "40M001",
      name: "Centrífuga horizontal 40M001",
      area: "Hipocalcio",
      system: "Centrifugación",
      subsystem: "Decantación",
      family: "Centrífugas",
      criticality: "Alta",
      costCenter: "CC-CENT-01",
      active: true,
    },
  ],
  routines: [
    {
      id: "RT-R1",
      code: "R1",
      name: "Rutina 1",
      scope: "Centrífugas",
      description: "Lubricación puntos internos de centrífuga.",
      frequencyDays: 30,
      frequencyText: "Mensual",
      responsible: "Técnico mecánico",
      lubricant: "Nevastane XS 80",
      requiresLoto: "Sí",
      procedure: "PROCEDIMIENTO LUBRICACIÓN CENTRÍFUGAS HIPOCALCIO",
      active: true,
    },
    {
      id: "RT-R2",
      code: "R2",
      name: "Rutina 2",
      scope: "Centrífugas",
      description: "Lubricación según puntos definidos en procedimiento.",
      frequencyDays: 20,
      frequencyText: "Cada 20 días",
      responsible: "Técnico mecánico",
      lubricant: "Nevastane XS 80",
      requiresLoto: "Según condición",
      procedure: "PROCEDIMIENTO LUBRICACIÓN CENTRÍFUGAS HIPOCALCIO",
      active: true,
    },
    {
      id: "RT-R3",
      code: "R3",
      name: "Rutina 3",
      scope: "Centrífugas",
      description: "Lubricación según puntos definidos en procedimiento.",
      frequencyDays: 15,
      frequencyText: "Cada 15 días",
      responsible: "Técnico mecánico",
      lubricant: "Nevastane XS 80",
      requiresLoto: "Según condición",
      procedure: "PROCEDIMIENTO LUBRICACIÓN CENTRÍFUGAS HIPOCALCIO",
      active: true,
    },
    {
      id: "RT-R4",
      code: "R4",
      name: "Semestral motores",
      scope: "Centrífugas",
      description: "Lubricación motor principal y motor auxiliar.",
      frequencyDays: 180,
      frequencyText: "Cada 6 meses",
      responsible: "Técnico mecánico",
      lubricant: "Grasa según placa/manual del motor",
      requiresLoto: "Según condición",
      procedure: "Manual motor / procedimiento interno",
      active: true,
    },
    {
      id: "RT-R5",
      code: "R5",
      name: "Semestral aceite",
      scope: "Centrífugas",
      description: "Chequeo de aceite: nivel, condición, contaminación y fugas.",
      frequencyDays: 180,
      frequencyText: "Cada 6 meses",
      responsible: "Técnico mecánico",
      lubricant: "Aceite especificado por fabricante",
      requiresLoto: "Según condición",
      procedure: "Manual fabricante / procedimiento interno",
      active: true,
    },
  ],
  planAssignments: [
    {
      id: "PL-30M001-R1",
      equipmentId: "EQ-30M001",
      routineId: "RT-R1",
      baseDate: "2026-05-01",
      responsible: "Técnico mecánico",
      procedure: "PROCEDIMIENTO LUBRICACIÓN CENTRÍFUGAS HIPOCALCIO",
      lubricant: "Nevastane XS 80",
      standardQuantity: "",
      requiresLoto: "Sí",
      plannedSapOrder: "",
      observations: "",
      active: true,
    },
    {
      id: "PL-30M001-R4",
      equipmentId: "EQ-30M001",
      routineId: "RT-R4",
      baseDate: "2026-05-01",
      responsible: "Técnico mecánico",
      procedure: "Manual motor / procedimiento interno",
      lubricant: "Grasa según placa/manual del motor",
      standardQuantity: "",
      requiresLoto: "Según condición",
      plannedSapOrder: "",
      observations: "",
      active: true,
    },
    {
      id: "PL-30M001-R5",
      equipmentId: "EQ-30M001",
      routineId: "RT-R5",
      baseDate: "2026-05-01",
      responsible: "Técnico mecánico",
      procedure: "Manual fabricante / procedimiento interno",
      lubricant: "Aceite especificado por fabricante",
      standardQuantity: "",
      requiresLoto: "Según condición",
      plannedSapOrder: "",
      observations: "",
      active: true,
    },
    {
      id: "PL-30M002-R4",
      equipmentId: "EQ-30M002",
      routineId: "RT-R4",
      baseDate: "2026-05-01",
      responsible: "Técnico mecánico",
      procedure: "Manual motor / procedimiento interno",
      lubricant: "Grasa según placa/manual del motor",
      standardQuantity: "",
      requiresLoto: "Según condición",
      plannedSapOrder: "",
      observations: "",
      active: true,
    },
    {
      id: "PL-30M002-R5",
      equipmentId: "EQ-30M002",
      routineId: "RT-R5",
      baseDate: "2026-05-01",
      responsible: "Técnico mecánico",
      procedure: "Manual fabricante / procedimiento interno",
      lubricant: "Aceite especificado por fabricante",
      standardQuantity: "",
      requiresLoto: "Según condición",
      plannedSapOrder: "",
      observations: "",
      active: true,
    },
    {
      id: "PL-40M001-R3",
      equipmentId: "EQ-40M001",
      routineId: "RT-R3",
      baseDate: "2026-05-01",
      responsible: "Técnico mecánico",
      procedure: "PROCEDIMIENTO LUBRICACIÓN CENTRÍFUGAS HIPOCALCIO",
      lubricant: "Nevastane XS 80",
      standardQuantity: "",
      requiresLoto: "Según condición",
      plannedSapOrder: "",
      observations: "",
      active: true,
    },
    {
      id: "PL-40M001-R4",
      equipmentId: "EQ-40M001",
      routineId: "RT-R4",
      baseDate: "2026-05-01",
      responsible: "Técnico mecánico",
      procedure: "Manual motor / procedimiento interno",
      lubricant: "Grasa según placa/manual del motor",
      standardQuantity: "",
      requiresLoto: "Según condición",
      plannedSapOrder: "",
      observations: "",
      active: true,
    },
    {
      id: "PL-40M001-R5",
      equipmentId: "EQ-40M001",
      routineId: "RT-R5",
      baseDate: "2026-05-01",
      responsible: "Técnico mecánico",
      procedure: "Manual fabricante / procedimiento interno",
      lubricant: "Aceite especificado por fabricante",
      standardQuantity: "",
      requiresLoto: "Según condición",
      plannedSapOrder: "",
      observations: "",
      active: true,
    },
  ],
  records: [
    {
      id: "REG-0001",
      equipmentId: "EQ-30M001",
      equipmentCode: "30M001",
      routineId: "RT-R1",
      routineCode: "R1",
      date: "2026-05-15",
      time: "",
      shift: "Turno 1",
      technician: "FGOMEZ",
      status: "Ejecutado",
      hourmeter: "",
      lubricant: "Nevastane XS 80",
      quantity: "",
      loto: "Sí",
      oilCondition: "OK",
      sapNotice: "",
      sapOrder: "",
      evidence: "",
      supervisor: "",
      findings: "",
      action: "",
      closeDate: "",
      observations: "",
      createdAt: "2026-05-15T00:00:00.000Z",
    },
    {
      id: "REG-0002",
      equipmentId: "EQ-30M002",
      equipmentCode: "30M002",
      routineId: "RT-R2",
      routineCode: "R2",
      date: "2026-05-15",
      time: "",
      shift: "Turno 1",
      technician: "FGOMEZ",
      status: "Ejecutado",
      hourmeter: "",
      lubricant: "Nevastane XS 80",
      quantity: "",
      loto: "Sí",
      oilCondition: "OK",
      sapNotice: "",
      sapOrder: "",
      evidence: "",
      supervisor: "",
      findings: "",
      action: "",
      closeDate: "",
      observations: "",
      createdAt: "2026-05-15T00:00:00.000Z",
    },
    {
      id: "REG-0003",
      equipmentId: "EQ-40M001",
      equipmentCode: "40M001",
      routineId: "RT-R3",
      routineCode: "R3",
      date: "2026-05-15",
      time: "",
      shift: "Turno 1",
      technician: "FGOMEZ",
      status: "Ejecutado",
      hourmeter: "",
      lubricant: "Nevastane XS 80",
      quantity: "",
      loto: "Sí",
      oilCondition: "OK",
      sapNotice: "",
      sapOrder: "",
      evidence: "",
      supervisor: "",
      findings: "",
      action: "",
      closeDate: "",
      observations: "",
      createdAt: "2026-05-15T00:00:00.000Z",
    },
    {
      id: "REG-0004",
      equipmentId: "EQ-30M001",
      equipmentCode: "30M001",
      routineId: "RT-R4",
      routineCode: "R4",
      date: "2026-06-15",
      time: "",
      shift: "Turno 1",
      technician: "FGOMEZ",
      status: "Ejecutado",
      hourmeter: "",
      lubricant: "Grasa según placa/manual del motor",
      quantity: "",
      loto: "Sí",
      oilCondition: "OK",
      sapNotice: "",
      sapOrder: "",
      evidence: "",
      supervisor: "",
      findings: "",
      action: "",
      closeDate: "",
      observations: "",
      createdAt: "2026-06-15T00:00:00.000Z",
    },
    {
      id: "REG-0005",
      equipmentId: "EQ-30M002",
      equipmentCode: "30M002",
      routineId: "RT-R4",
      routineCode: "R4",
      date: "2026-06-15",
      time: "",
      shift: "Turno 1",
      technician: "FGOMEZ",
      status: "Ejecutado",
      hourmeter: "",
      lubricant: "Grasa según placa/manual del motor",
      quantity: "",
      loto: "Sí",
      oilCondition: "OK",
      sapNotice: "",
      sapOrder: "",
      evidence: "",
      supervisor: "",
      findings: "",
      action: "",
      closeDate: "",
      observations: "",
      createdAt: "2026-06-15T00:00:00.000Z",
    },
    {
      id: "REG-0006",
      equipmentId: "EQ-40M001",
      equipmentCode: "40M001",
      routineId: "RT-R4",
      routineCode: "R4",
      date: "2026-06-15",
      time: "",
      shift: "Turno 1",
      technician: "FGOMEZ",
      status: "Ejecutado",
      hourmeter: "",
      lubricant: "Grasa según placa/manual del motor",
      quantity: "",
      loto: "Sí",
      oilCondition: "OK",
      sapNotice: "",
      sapOrder: "",
      evidence: "",
      supervisor: "",
      findings: "",
      action: "",
      closeDate: "",
      observations: "",
      createdAt: "2026-06-15T00:00:00.000Z",
    },
    {
      id: "REG-0007",
      equipmentId: "EQ-30M001",
      equipmentCode: "30M001",
      routineId: "RT-R5",
      routineCode: "R5",
      date: "2026-06-15",
      time: "",
      shift: "Turno 1",
      technician: "FGOMEZ",
      status: "Ejecutado",
      hourmeter: "",
      lubricant: "Aceite especificado por fabricante",
      quantity: "",
      loto: "Sí",
      oilCondition: "OK",
      sapNotice: "",
      sapOrder: "",
      evidence: "",
      supervisor: "",
      findings: "",
      action: "",
      closeDate: "",
      observations: "",
      createdAt: "2026-06-15T00:00:00.000Z",
    },
    {
      id: "REG-0008",
      equipmentId: "EQ-30M002",
      equipmentCode: "30M002",
      routineId: "RT-R5",
      routineCode: "R5",
      date: "2026-06-15",
      time: "",
      shift: "Turno 1",
      technician: "FGOMEZ",
      status: "Ejecutado",
      hourmeter: "",
      lubricant: "Aceite especificado por fabricante",
      quantity: "",
      loto: "Sí",
      oilCondition: "OK",
      sapNotice: "",
      sapOrder: "",
      evidence: "",
      supervisor: "",
      findings: "",
      action: "",
      closeDate: "",
      observations: "",
      createdAt: "2026-06-15T00:00:00.000Z",
    },
    {
      id: "REG-0009",
      equipmentId: "EQ-40M001",
      equipmentCode: "40M001",
      routineId: "RT-R5",
      routineCode: "R5",
      date: "2026-06-15",
      time: "",
      shift: "Turno 1",
      technician: "FGOMEZ",
      status: "Ejecutado",
      hourmeter: "",
      lubricant: "Aceite especificado por fabricante",
      quantity: "",
      loto: "Sí",
      oilCondition: "OK",
      sapNotice: "",
      sapOrder: "",
      evidence: "",
      supervisor: "",
      findings: "",
      action: "",
      closeDate: "",
      observations: "",
      createdAt: "2026-06-15T00:00:00.000Z",
    },
    {
      id: "REG-0010",
      equipmentId: "EQ-30M001",
      equipmentCode: "30M001",
      routineId: "RT-R1",
      routineCode: "R1",
      date: "2026-06-15",
      time: "",
      shift: "Turno 1",
      technician: "CARABALI",
      status: "Ejecutado",
      hourmeter: "",
      lubricant: "Nevastane XS 80",
      quantity: "",
      loto: "Sí",
      oilCondition: "OK",
      sapNotice: "",
      sapOrder: "",
      evidence: "",
      supervisor: "",
      findings: "",
      action: "",
      closeDate: "",
      observations: "",
      createdAt: "2026-06-15T00:00:00.000Z",
    },
    {
      id: "REG-0011",
      equipmentId: "EQ-30M002",
      equipmentCode: "30M002",
      routineId: "RT-R2",
      routineCode: "R2",
      date: "2026-06-10",
      time: "",
      shift: "Turno 1",
      technician: "CARABALI",
      status: "Ejecutado",
      hourmeter: "",
      lubricant: "Nevastane XS 80",
      quantity: "",
      loto: "Sí",
      oilCondition: "OK",
      sapNotice: "",
      sapOrder: "",
      evidence: "",
      supervisor: "",
      findings: "",
      action: "",
      closeDate: "",
      observations: "",
      createdAt: "2026-06-10T00:00:00.000Z",
    },
    {
      id: "REG-0012",
      equipmentId: "EQ-40M001",
      equipmentCode: "40M001",
      routineId: "RT-R3",
      routineCode: "R3",
      date: "2026-06-30",
      time: "",
      shift: "Turno 1",
      technician: "CARABALI",
      status: "Ejecutado",
      hourmeter: "",
      lubricant: "Nevastane XS 80",
      quantity: "",
      loto: "Sí",
      oilCondition: "OK",
      sapNotice: "",
      sapOrder: "",
      evidence: "",
      supervisor: "",
      findings: "",
      action: "",
      closeDate: "",
      observations: "",
      createdAt: "2026-06-30T00:00:00.000Z",
    },
    {
      id: "REG-0013",
      equipmentId: "EQ-30M001",
      equipmentCode: "30M001",
      routineId: "RT-R1",
      routineCode: "R1",
      date: "2026-06-03",
      time: "",
      shift: "Turno 1",
      technician: "AVILA",
      status: "Ejecutado",
      hourmeter: "",
      lubricant: "Nevastane XS 80",
      quantity: "",
      loto: "Sí",
      oilCondition: "OK",
      sapNotice: "",
      sapOrder: "",
      evidence: "",
      supervisor: "",
      findings: "",
      action: "",
      closeDate: "",
      observations: "",
      createdAt: "2026-06-03T00:00:00.000Z",
    },
    {
      id: "REG-0014",
      equipmentId: "EQ-30M002",
      equipmentCode: "30M002",
      routineId: "RT-R2",
      routineCode: "R2",
      date: "2026-06-04",
      time: "",
      shift: "Turno 1",
      technician: "AVILA",
      status: "Ejecutado",
      hourmeter: "",
      lubricant: "Nevastane XS 80",
      quantity: "",
      loto: "Sí",
      oilCondition: "OK",
      sapNotice: "",
      sapOrder: "",
      evidence: "",
      supervisor: "",
      findings: "",
      action: "",
      closeDate: "",
      observations: "",
      createdAt: "2026-06-04T00:00:00.000Z",
    },
    {
      id: "REG-0015",
      equipmentId: "EQ-40M001",
      equipmentCode: "40M001",
      routineId: "RT-R3",
      routineCode: "R3",
      date: "2026-06-05",
      time: "",
      shift: "Turno 1",
      technician: "AVILA",
      status: "Ejecutado",
      hourmeter: "",
      lubricant: "Nevastane XS 80",
      quantity: "",
      loto: "Sí",
      oilCondition: "OK",
      sapNotice: "",
      sapOrder: "",
      evidence: "",
      supervisor: "",
      findings: "",
      action: "",
      closeDate: "",
      observations: "",
      createdAt: "2026-06-05T00:00:00.000Z",
    },
  ],
  users: [
    {
      id: "USR-ADMIN",
      name: "Administrador",
      username: "admin",
      pin: "admin123",
      role: "admin",
      note: "Acceso total inicial",
      active: true,
    },
    {
      id: "USR-SUPERVISOR",
      name: "Supervisor mantenimiento",
      username: "supervisor",
      pin: "sup123",
      role: "supervisor",
      note: "Seguimiento y exportación",
      active: true,
    },
    {
      id: "USR-TECNICO",
      name: "Técnico de turno",
      username: "tecnico",
      pin: "tec123",
      role: "tecnico",
      note: "Registro de rutinas",
      active: true,
    },
    {
      id: "USR-CONSULTA",
      name: "Usuario consulta",
      username: "consulta",
      pin: "ver123",
      role: "consulta",
      note: "Solo lectura",
      active: true,
    },
  ],
};

(function () {
  const STORAGE_KEY = "cmms_lubricacion_local_v1";
  const API_BASE = "./api";
  const APP_VERSION = "2026-07-06-d1-device-access-v1";
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const families = ["Todos", "Centrífugas", "Bombas", "Chillers", "Compresores", "Empaque", "Motores", "General"];
  const SESSION_KEY = "cmms_lubricacion_session_v1";
  const DEVICE_KEY = "cmms_lubricacion_device_id_v1";
  const DEVICE_LABEL_KEY = "cmms_lubricacion_device_label_v1";
  const REQUIRE_D1_LOGIN = true;
  const roleLabels = {
    admin: "Administrador",
    supervisor: "Supervisor",
    tecnico: "Técnico",
    consulta: "Consulta",
  };
  const rolePermissions = {
    admin: {
      views: ["dashboard", "registro", "plan", "historico", "equipos", "rutinas", "usuarios", "config"],
      actions: ["record", "editMaster", "users", "export", "import", "delete", "config"],
    },
    supervisor: {
      views: ["dashboard", "registro", "plan", "historico", "equipos", "rutinas"],
      actions: ["record", "export"],
    },
    tecnico: {
      views: ["dashboard", "registro", "plan", "historico"],
      actions: ["record"],
    },
    consulta: {
      views: ["dashboard", "plan", "historico"],
      actions: [],
    },
  };
  let currentUser = null;
  let deferredInstallPrompt = null;
  let apiAvailable = false;
  const dashboardFilters = {
    status: "",
    equipmentId: "",
    routineId: "",
  };

  function todayISO() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }

  function uid(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`.toUpperCase();
  }

  function parseLocalDate(value) {
    if (!value) return null;
    const parts = String(value).split("-").map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function toISODate(date) {
    if (!date) return "";
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }

  function addDays(dateValue, days) {
    const date = parseLocalDate(dateValue);
    if (!date) return "";
    date.setDate(date.getDate() + Number(days || 0));
    return toISODate(date);
  }

  function diffDays(dateValue, fromValue = todayISO()) {
    const target = parseLocalDate(dateValue);
    const from = parseLocalDate(fromValue);
    if (!target || !from) return null;
    target.setHours(0, 0, 0, 0);
    from.setHours(0, 0, 0, 0);
    return Math.round((target - from) / 86400000);
  }

  function formatDate(value) {
    const d = parseLocalDate(value);
    if (!d) return "";
    return d.toLocaleDateString("es-CO", { year: "numeric", month: "2-digit", day: "2-digit" });
  }

  function cloneSeedData() {
    if (!window.CMMS_SEED_DATA) return null;
    return JSON.parse(JSON.stringify(window.CMMS_SEED_DATA));
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function defaultData() {
    const seed = cloneSeedData();
    if (seed) return seed;

    const baseDate = todayISO();
    return {
      seedVersion: "fallback-local-v1",
      config: {
        baseDate,
        prealertDays: 7,
        site: "Planta Sales",
        masterSystem: "SAP",
      },
      equipment: [
        {
          id: "EQ-30M001",
          code: "30M001",
          name: "Centrífuga horizontal 30M001",
          area: "Hipocalcio",
          system: "Centrifugación",
          subsystem: "Decantación",
          family: "Centrífugas",
          criticality: "Alta",
          costCenter: "CC-CENT-01",
          active: true,
        },
        {
          id: "EQ-30M002",
          code: "30M002",
          name: "Centrífuga horizontal 30M002",
          area: "Hipocalcio",
          system: "Centrifugación",
          subsystem: "Decantación",
          family: "Centrífugas",
          criticality: "Alta",
          costCenter: "CC-CENT-01",
          active: true,
        },
        {
          id: "EQ-40M001",
          code: "40M001",
          name: "Centrífuga horizontal 40M001",
          area: "Hipocalcio",
          system: "Centrifugación",
          subsystem: "Decantación",
          family: "Centrífugas",
          criticality: "Alta",
          costCenter: "CC-CENT-01",
          active: true,
        },
      ],
      routines: [
        {
          id: "RT-R1",
          code: "R1",
          name: "Rutina 1",
          scope: "Centrífugas",
          description: "Lubricación de puntos internos de centrífuga.",
          frequencyDays: 30,
          frequencyText: "Mensual",
          responsible: "Técnico mecánico",
          lubricant: "Nevastane XS 80",
          requiresLoto: "Sí",
          procedure: "PROCEDIMIENTO LUBRICACIÓN CENTRÍFUGAS HIPOCALCIO",
          active: true,
        },
        {
          id: "RT-R2",
          code: "R2",
          name: "Rutina 2",
          scope: "Centrífugas",
          description: "Lubricación según puntos definidos en procedimiento.",
          frequencyDays: 20,
          frequencyText: "Cada 20 días",
          responsible: "Técnico mecánico",
          lubricant: "Nevastane XS 80",
          requiresLoto: "Según condición",
          procedure: "PROCEDIMIENTO LUBRICACIÓN CENTRÍFUGAS HIPOCALCIO",
          active: true,
        },
        {
          id: "RT-R3",
          code: "R3",
          name: "Rutina 3",
          scope: "Centrífugas",
          description: "Lubricación según puntos definidos en procedimiento.",
          frequencyDays: 15,
          frequencyText: "Cada 15 días",
          responsible: "Técnico mecánico",
          lubricant: "Nevastane XS 80",
          requiresLoto: "Según condición",
          procedure: "PROCEDIMIENTO LUBRICACIÓN CENTRÍFUGAS HIPOCALCIO",
          active: true,
        },
        {
          id: "RT-R4",
          code: "R4",
          name: "Semestral motores",
          scope: "Centrífugas",
          description: "Lubricación de motor principal y motor auxiliar.",
          frequencyDays: 180,
          frequencyText: "Cada 6 meses",
          responsible: "Técnico mecánico",
          lubricant: "Grasa según placa/manual del motor",
          requiresLoto: "Sí",
          procedure: "Manual del motor / procedimiento interno",
          active: true,
        },
        {
          id: "RT-R5",
          code: "R5",
          name: "Semestral aceite",
          scope: "Centrífugas",
          description: "Chequeo de aceite: nivel, condición, contaminación y fugas.",
          frequencyDays: 180,
          frequencyText: "Cada 6 meses",
          responsible: "Técnico mecánico",
          lubricant: "Aceite especificado por fabricante",
          requiresLoto: "Según condición",
          procedure: "Manual fabricante / procedimiento interno",
          active: true,
        },
      ],
      planAssignments: [],
      records: [],
      users: [
        { id: "USR-ADMIN", name: "Administrador", username: "admin", pin: "admin123", role: "admin", note: "Acceso total inicial", active: true },
        { id: "USR-SUPERVISOR", name: "Supervisor mantenimiento", username: "supervisor", pin: "sup123", role: "supervisor", note: "Seguimiento y exportación", active: true },
        { id: "USR-TECNICO", name: "Técnico de turno", username: "tecnico", pin: "tec123", role: "tecnico", note: "Registro de rutinas", active: true },
        { id: "USR-CONSULTA", name: "Usuario consulta", username: "consulta", pin: "ver123", role: "consulta", note: "Solo lectura", active: true },
      ],
    };
  }

  function loadData() {
    try {
      const defaults = defaultData();
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return defaults;
      const data = JSON.parse(saved);
      if (data.seedVersion !== defaults.seedVersion && (!Array.isArray(data.records) || data.records.length === 0)) {
        return defaults;
      }
      return {
        ...defaults,
        ...data,
        config: { ...defaults.config, ...(data.config || {}) },
        equipment: Array.isArray(data.equipment) ? data.equipment : defaults.equipment,
        routines: Array.isArray(data.routines) ? data.routines : defaults.routines,
        planAssignments: Array.isArray(data.planAssignments) ? data.planAssignments : defaults.planAssignments,
        records: Array.isArray(data.records) ? data.records : [],
        users: Array.isArray(data.users) ? data.users : defaults.users,
      };
    } catch (error) {
      console.error(error);
      return defaultData();
    }
  }

  let state = loadData();

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function loadSessionUser() {
    const savedUser = localStorage.getItem(SESSION_KEY);
    if (!savedUser) return null;
    return (state.users || []).find((user) =>
      user.active !== false && (user.id === savedUser || user.username === savedUser)
    ) || null;
  }

  function setSessionUser(user) {
    if (!user) {
      currentUser = null;
      localStorage.removeItem(SESSION_KEY);
      return;
    }
    state.users = Array.isArray(state.users) ? state.users : [];
    const existingIndex = state.users.findIndex((item) =>
      item.id === user.id || item.username?.toLowerCase() === user.username?.toLowerCase()
    );
    if (existingIndex >= 0) {
      const existing = state.users[existingIndex];
      state.users[existingIndex] = {
        ...existing,
        ...user,
        pin: existing.pin || user.pin || "",
        active: user.active !== false,
      };
      currentUser = state.users[existingIndex];
    } else {
      currentUser = { ...user, active: user.active !== false };
      state.users.push(currentUser);
    }
    localStorage.setItem(SESSION_KEY, currentUser.id || currentUser.username);
    saveData();
  }

  function getPermissions() {
    return rolePermissions[currentUser?.role] || rolePermissions.consulta;
  }

  function can(action) {
    return getPermissions().actions.includes(action);
  }

  function canView(view) {
    return getPermissions().views.includes(view);
  }

  function requireAction(action, message = "Tu rol no tiene permiso para esta acción.") {
    if (can(action)) return true;
    toast(message);
    return false;
  }


  function getDeviceId() {
    let deviceId = localStorage.getItem(DEVICE_KEY);
    if (!deviceId) {
      deviceId = uid("DEV");
      localStorage.setItem(DEVICE_KEY, deviceId);
    }
    return deviceId;
  }

  function getDeviceLabel() {
    let label = localStorage.getItem(DEVICE_LABEL_KEY);
    if (!label) {
      const platform = navigator.platform || "Equipo";
      const brand = navigator.userAgentData?.brands?.[0]?.brand || "Navegador";
      label = `${platform} · ${brand} · ${new Date().toLocaleDateString("es-CO")}`;
      localStorage.setItem(DEVICE_LABEL_KEY, label);
    }
    return label;
  }

  function ensureAccessHelp() {
    const form = $("#loginForm");
    if (!form) return null;
    let help = $("#loginAccessHelp");
    if (!help) {
      help = document.createElement("div");
      help.id = "loginAccessHelp";
      help.style.cssText = "margin-top:12px;padding:12px;border-radius:14px;background:#fff7ed;color:#7c2d12;font-size:13px;line-height:1.35;border:1px solid #fed7aa;display:none;";
      form.insertAdjacentElement("afterend", help);
    }
    return help;
  }

  function showAccessMessage(message) {
    const help = ensureAccessHelp();
    if (help) {
      help.innerHTML = message;
      help.style.display = "block";
    }
    toast("Equipo no autorizado. Solicita acceso al administrador.");
  }

  function clearAccessMessage() {
    const help = $("#loginAccessHelp");
    if (help) {
      help.textContent = "";
      help.style.display = "none";
    }
  }

  function formatDeviceStatus(user) {
    if (user.role === "admin") return "Equipo: llave maestra";
    if (user.authorizedDeviceId) return `Equipo autorizado: ${user.authorizedDeviceLabel || user.authorizedDeviceId}`;
    return "Equipo: pendiente de primer acceso";
  }

  async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.error || `Error API ${response.status}`);
      error.status = response.status;
      error.payload = payload;
      throw error;
    }
    return payload;
  }

  function mergeRemoteState(remote) {
    const localUsersById = Object.fromEntries((state.users || []).map((user) => [user.id, user]));
    const mergedUsers = Array.isArray(remote.users)
      ? remote.users.map((user) => ({ ...user, pin: user.pin || localUsersById[user.id]?.pin || "" }))
      : state.users;
    state = {
      ...state,
      config: { ...state.config, ...(remote.config || {}) },
      equipment: Array.isArray(remote.equipment) ? remote.equipment : state.equipment,
      routines: Array.isArray(remote.routines) ? remote.routines : state.routines,
      planAssignments: Array.isArray(remote.planAssignments) ? remote.planAssignments : state.planAssignments,
      records: Array.isArray(remote.records) ? remote.records : state.records,
      users: mergedUsers,
    };
    saveData();
  }

  async function hydrateFromApi() {
    try {
      const remote = await apiRequest("/bootstrap");
      apiAvailable = true;
      mergeRemoteState(remote);
      currentUser = loadSessionUser();
      renderAll();
      toast("Conectado a Cloudflare D1.");
    } catch (error) {
      apiAvailable = false;
    }
  }

  function toast(message) {
    const node = $("#toast");
    if (!node) {
      console.info(message);
      return;
    }
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove("show"), 2800);
  }

  function findInitialUser(username, pin) {
    const defaults = defaultData();
    const candidates = [...(state.users || []), ...(defaults.users || [])];
    return candidates.find((item) =>
      item.active !== false &&
      item.username?.toLowerCase() === username &&
      String(item.pin || "") === pin
    ) || null;
  }

  function unlockAfterLogin(user) {
    setSessionUser(user);
    $("#loginForm")?.reset();
    document.body.classList.remove("locked");
    $("#loginScreen")?.classList.add("hidden");
    try {
      showView(getPermissions().views[0] || "dashboard");
    } catch (error) {
      console.warn("No se pudo cambiar la vista inicial.", error);
    }
    try {
      renderAll();
    } catch (error) {
      console.error("Se inició sesión, pero falló el render completo.", error);
      renderCurrentUser();
      applyPermissions();
    }
    toast(`Bienvenido, ${user.name}.`);
  }

  function routineAppliesToEquipment(routine, equipment) {
    return routine.active !== false && equipment.active !== false && (routine.scope === "Todos" || routine.scope === equipment.family);
  }

  function hasExplicitPlanAssignments() {
    return Array.isArray(state.planAssignments) && state.planAssignments.some((assignment) => assignment.active !== false);
  }

  function getEquipmentById(equipmentId) {
    return state.equipment.find((equipment) => equipment.id === equipmentId);
  }

  function getRoutineById(routineId) {
    return state.routines.find((routine) => routine.id === routineId);
  }

  function getRoutinesForEquipment(equipment) {
    if (!equipment) return [];
    const assignedRoutineIds = new Set(
      (state.planAssignments || [])
        .filter((assignment) => assignment.active !== false && assignment.equipmentId === equipment.id)
        .map((assignment) => assignment.routineId)
    );
    const historicalRoutineIds = new Set(
      (state.records || [])
        .filter((record) => record.equipmentId === equipment.id)
        .map((record) => record.routineId)
    );

    return state.routines.filter((routine) => {
      if (routine.active === false) return false;
      if (!hasExplicitPlanAssignments()) return routineAppliesToEquipment(routine, equipment);
      return assignedRoutineIds.has(routine.id) || historicalRoutineIds.has(routine.id);
    });
  }

  function latestExecution(equipmentId, routineId) {
    return state.records
      .filter((record) => record.equipmentId === equipmentId && record.routineId === routineId && record.status === "Ejecutado")
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))[0] || null;
  }

  function getAlertStatus(nextDate) {
    if (!nextDate) return { label: "SIN FECHA", className: "gray", days: null };
    const days = diffDays(nextDate);
    const prealert = Number(state.config.prealertDays || 7);
    if (days < 0) return { label: "VENCIDO", className: "red", days };
    if (days === 0) return { label: "VENCE HOY", className: "amber", days };
    if (days <= prealert) return { label: `PRÓXIMO ${prealert} DÍAS`, className: "amber", days };
    return { label: "VIGENTE", className: "green", days };
  }

  function buildPlan() {
    const plan = [];
    const explicitAssignments = hasExplicitPlanAssignments();

    if (explicitAssignments) {
      state.planAssignments
        .filter((assignment) => assignment.active !== false)
        .forEach((assignment) => {
          const equipment = getEquipmentById(assignment.equipmentId);
          const routine = getRoutineById(assignment.routineId);
          if (!equipment || !routine || equipment.active === false || routine.active === false) return;
          const latest = latestExecution(equipment.id, routine.id);
          const lastDate = latest ? latest.date : "";
          const baseDate = lastDate || assignment.baseDate || state.config.baseDate || todayISO();
          const nextDate = lastDate ? addDays(lastDate, routine.frequencyDays) : baseDate;
          const alert = getAlertStatus(nextDate);
          plan.push({
            id: assignment.id || `${equipment.id}-${routine.id}`,
            assignment,
            equipment,
            routine: {
              ...routine,
              responsible: assignment.responsible || routine.responsible,
              procedure: assignment.procedure || routine.procedure,
              lubricant: assignment.lubricant || routine.lubricant,
              requiresLoto: assignment.requiresLoto || routine.requiresLoto,
            },
            lastRecord: latest,
            lastDate,
            nextDate,
            days: alert.days,
            status: alert.label,
            statusClass: alert.className,
          });
        });
    } else {
      state.equipment
        .filter((equipment) => equipment.active !== false)
        .forEach((equipment) => {
          state.routines
            .filter((routine) => routineAppliesToEquipment(routine, equipment))
            .forEach((routine) => {
              const latest = latestExecution(equipment.id, routine.id);
              const lastDate = latest ? latest.date : "";
              const baseDate = lastDate || state.config.baseDate || todayISO();
              const nextDate = lastDate ? addDays(lastDate, routine.frequencyDays) : baseDate;
              const alert = getAlertStatus(nextDate);
              plan.push({
                id: `${equipment.id}-${routine.id}`,
                equipment,
                routine,
                lastRecord: latest,
                lastDate,
                nextDate,
                days: alert.days,
                status: alert.label,
                statusClass: alert.className,
              });
            });
        });
    }

    return plan.sort((a, b) => {
      const aDays = a.days ?? 999999;
      const bDays = b.days ?? 999999;
      return aDays - bDays || a.equipment.code.localeCompare(b.equipment.code) || a.routine.code.localeCompare(b.routine.code);
    });
  }

  function statusBadge(status, className) {
    return `<span class="badge ${className}">${escapeHtml(status)}</span>`;
  }

  function filterPlanForDashboard(plan) {
    return plan.filter((item) => {
      const statusOk =
        !dashboardFilters.status ||
        (dashboardFilters.status === "PROXIMO" ? item.status.startsWith("PRÓXIMO") : item.status === dashboardFilters.status);
      const equipmentOk = !dashboardFilters.equipmentId || item.equipment.id === dashboardFilters.equipmentId;
      const routineOk = !dashboardFilters.routineId || item.routine.id === dashboardFilters.routineId;
      return statusOk && equipmentOk && routineOk;
    });
  }

  function populateDashboardFilters() {
    const equipmentOptions = [
      `<option value="">Todos los equipos</option>`,
      ...state.equipment
        .filter((equipment) => equipment.active !== false)
        .map((equipment) => `<option value="${escapeHtml(equipment.id)}">${escapeHtml(equipment.code)} · ${escapeHtml(equipment.name)}</option>`),
    ];
    $("#dashboardEquipmentFilter").innerHTML = equipmentOptions.join("");
    $("#dashboardEquipmentFilter").value = dashboardFilters.equipmentId;

    const routineOptions = [
      `<option value="">Todas las rutinas</option>`,
      ...state.routines
        .filter((routine) => routine.active !== false)
        .map((routine) => `<option value="${escapeHtml(routine.id)}">${escapeHtml(routine.code)} · ${escapeHtml(routine.name)}</option>`),
    ];
    $("#dashboardRoutineFilter").innerHTML = routineOptions.join("");
    $("#dashboardRoutineFilter").value = dashboardFilters.routineId;
    $("#dashboardStatusFilter").value = dashboardFilters.status;
  }

  function renderDashboard() {
    const plan = buildPlan();
    const filteredPlan = filterPlanForDashboard(plan);
    const counts = {
      total: plan.length,
      vencidas: plan.filter((item) => item.status === "VENCIDO").length,
      hoy: plan.filter((item) => item.status === "VENCE HOY").length,
      proximas: plan.filter((item) => item.status.startsWith("PRÓXIMO")).length,
      vigentes: plan.filter((item) => item.status === "VIGENTE").length,
    };
    const recordsTotal = state.records.length;
    const compliance = counts.total ? Math.round((counts.vigentes / counts.total) * 100) : 0;

    const cards = [
      { title: "Rutinas vencidas", value: counts.vencidas, hint: "Atención inmediata", color: "red", status: "VENCIDO" },
      { title: "Vencen hoy", value: counts.hoy, hint: "Programar en turno", color: "amber", status: "VENCE HOY" },
      { title: "Próximas", value: counts.proximas, hint: `Dentro de ${state.config.prealertDays} días`, color: "amber", status: "PROXIMO" },
      { title: "Vigentes", value: counts.vigentes, hint: `${compliance}% cumplimiento estimado`, color: "green", status: "VIGENTE" },
      { title: "Ejecuciones registradas", value: recordsTotal, hint: "Histórico guardado", color: "blue", status: "" },
    ];

    $("#dashboardCards").innerHTML = cards
      .map((card) => `
        <article class="card clickable ${card.color} ${dashboardFilters.status === card.status ? "active-filter" : ""}" data-dashboard-card="${escapeHtml(card.status)}">
          <p>${escapeHtml(card.title)}</p>
          <strong>${escapeHtml(card.value)}</strong>
          <small>${escapeHtml(card.hint)}</small>
        </article>
      `)
      .join("");

    renderEquipmentChart(filteredPlan);
    renderRecentRecords();

    $("#alertsTable").innerHTML = filteredPlan.length
      ? filteredPlan
          .map((item) => `
            <tr>
              <td>${statusBadge(item.status, item.statusClass)}</td>
              <td>${item.days ?? ""}</td>
              <td>${formatDate(item.nextDate)}</td>
              <td><strong>${escapeHtml(item.equipment.code)}</strong><br>${escapeHtml(item.equipment.name)}</td>
              <td>${escapeHtml(item.routine.code)} · ${escapeHtml(item.routine.name)}</td>
              <td>${escapeHtml(item.routine.responsible || "")}</td>
              <td>${escapeHtml(item.lastRecord?.sapOrder || item.lastRecord?.sapNotice || "Pendiente")}</td>
            </tr>
          `)
          .join("")
      : `<tr><td colspan="7">No hay resultados con los filtros seleccionados.</td></tr>`;
  }

  function renderEquipmentChart(plan) {
    const groups = {};
    plan.forEach((item) => {
      const key = item.equipment.code;
      if (!groups[key]) groups[key] = { total: 0, ok: 0, pending: 0 };
      groups[key].total += 1;
      if (item.status === "VIGENTE") groups[key].ok += 1;
      else groups[key].pending += 1;
    });

    const rows = Object.entries(groups);
    if (!rows.length) {
      $("#equipmentChart").innerHTML = `<p class="note">Sin datos para graficar.</p>`;
      return;
    }

    $("#equipmentChart").innerHTML = rows
      .map(([equipment, group]) => {
        const okPct = group.total ? Math.round((group.ok / group.total) * 100) : 0;
        const pendingPct = group.total ? Math.round((group.pending / group.total) * 100) : 0;
        return `
          <div class="bar-row" title="${escapeHtml(equipment)}">
            <div class="bar-label">${escapeHtml(equipment)}</div>
            <div class="bar-track">
              <div class="bar-fill ${group.pending ? "warning" : ""}" style="width: ${Math.max(okPct || pendingPct, 4)}%"></div>
            </div>
            <div class="bar-value">${group.ok}/${group.total} OK</div>
          </div>
        `;
      })
      .join("");
  }

  function renderRecentRecords() {
    const equipmentById = Object.fromEntries(state.equipment.map((item) => [item.id, item]));
    const routinesById = Object.fromEntries(state.routines.map((item) => [item.id, item]));
    const rows = [...state.records].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 6);

    $("#recentRecords").innerHTML = rows.length
      ? rows
          .map((record) => {
            const equipment = equipmentById[record.equipmentId] || {};
            const routine = routinesById[record.routineId] || {};
            return `
              <div class="recent-item">
                <strong>${escapeHtml(equipment.code || record.equipmentCode || "")} · ${escapeHtml(routine.name || record.routineCode || "")}</strong>
                <small>${formatDate(record.date)} · ${escapeHtml(record.technician || "Sin técnico")} · ${escapeHtml(record.status || "")}</small>
              </div>
            `;
          })
          .join("")
      : `<p class="note">Aún no hay registros.</p>`;
  }

  function renderPlan() {
    const filter = $("#planStatusFilter").value;
    let plan = buildPlan();
    if (filter === "PROXIMO") plan = plan.filter((item) => item.status.startsWith("PRÓXIMO"));
    else if (filter) plan = plan.filter((item) => item.status === filter);

    $("#planTable").innerHTML = plan
      .map((item) => `
        <tr>
          <td>${statusBadge(item.status, item.statusClass)}</td>
          <td>${item.days ?? ""}</td>
          <td><strong>${escapeHtml(item.equipment.code)}</strong><br>${escapeHtml(item.equipment.name)}</td>
          <td>${escapeHtml(item.equipment.family || "")}</td>
          <td><strong>${escapeHtml(item.routine.code)}</strong><br>${escapeHtml(item.routine.name)}</td>
          <td>${escapeHtml(item.routine.frequencyText || `${item.routine.frequencyDays} días`)}</td>
          <td>${formatDate(item.lastDate) || "Sin registro"}</td>
          <td>${formatDate(item.nextDate)}</td>
          <td>${escapeHtml(item.routine.procedure || "")}</td>
          <td>${escapeHtml(item.routine.responsible || "")}</td>
        </tr>
      `)
      .join("");
  }

  function renderEquipment() {
    $("#equipmentTable").innerHTML = state.equipment
      .map((equipment) => `
        <tr>
          <td><strong>${escapeHtml(equipment.code)}</strong></td>
          <td>${escapeHtml(equipment.name)}</td>
          <td>${escapeHtml(equipment.area || "")}</td>
          <td>${escapeHtml(equipment.family || "")}</td>
          <td>${escapeHtml(equipment.criticality || "")}</td>
          <td>${escapeHtml(equipment.costCenter || "")}</td>
          <td>
            ${can("editMaster") ? `<div class="row-actions">
              <button class="mini-btn" data-edit-equipment="${escapeHtml(equipment.id)}" type="button">Editar</button>
              <button class="mini-btn danger" data-delete-equipment="${escapeHtml(equipment.id)}" type="button">Eliminar</button>
            </div>` : ""}
          </td>
        </tr>
      `)
      .join("");
  }

  function renderRoutines() {
    $("#routinesTable").innerHTML = state.routines
      .map((routine) => `
        <tr>
          <td><strong>${escapeHtml(routine.code)}</strong></td>
          <td>${escapeHtml(routine.name)}<br><small>${escapeHtml(routine.description || "")}</small></td>
          <td>${escapeHtml(routine.scope || "Todos")}</td>
          <td>${escapeHtml(routine.frequencyText || `${routine.frequencyDays} días`)}</td>
          <td>${escapeHtml(routine.lubricant || "")}</td>
          <td>${escapeHtml(routine.procedure || "")}</td>
          <td>
            ${can("editMaster") ? `<div class="row-actions">
              <button class="mini-btn" data-edit-routine="${escapeHtml(routine.id)}" type="button">Editar</button>
              <button class="mini-btn danger" data-delete-routine="${escapeHtml(routine.id)}" type="button">Eliminar</button>
            </div>` : ""}
          </td>
        </tr>
      `)
      .join("");
  }

  function renderRecords() {
    const equipmentById = Object.fromEntries(state.equipment.map((item) => [item.id, item]));
    const routinesById = Object.fromEntries(state.routines.map((item) => [item.id, item]));
    const rows = [...state.records].sort((a, b) => String(b.date).localeCompare(String(a.date)));

    $("#recordsTable").innerHTML = rows.length
      ? rows
          .map((record) => {
            const equipment = equipmentById[record.equipmentId] || {};
            const routine = routinesById[record.routineId] || {};
            return `
              <tr>
                <td>${escapeHtml(record.id)}</td>
                <td>${formatDate(record.date)}</td>
                <td><strong>${escapeHtml(equipment.code || record.equipmentCode || "")}</strong></td>
                <td>${escapeHtml(routine.code || record.routineCode || "")} · ${escapeHtml(routine.name || "")}</td>
                <td>${escapeHtml(record.status)}</td>
                <td>${escapeHtml(record.shift || "")}</td>
                <td>${escapeHtml(record.technician || "")}</td>
                <td>${escapeHtml(record.sapOrder || record.sapNotice || "")}</td>
                <td>${escapeHtml(record.findings || record.action || "")}</td>
                <td>${can("delete") ? `<button class="mini-btn danger" data-delete-record="${escapeHtml(record.id)}" type="button">Eliminar</button>` : ""}</td>
              </tr>
            `;
          })
          .join("")
      : `<tr><td colspan="10">Aún no hay registros de ejecución.</td></tr>`;
  }

  function renderUsers() {
    const users = state.users || [];
    $("#usersTable").innerHTML = users.length
      ? users
          .map((user) => `
            <tr>
              <td><strong>${escapeHtml(user.name || "")}</strong></td>
              <td>${escapeHtml(user.username || "")}</td>
              <td>${escapeHtml(roleLabels[user.role] || user.role || "")}</td>
              <td>${user.active === false ? statusBadge("INACTIVO", "gray") : statusBadge("ACTIVO", "green")}</td>
              <td>
                ${escapeHtml(user.note || "")}
                <br><small>${escapeHtml(formatDeviceStatus(user))}</small>
              </td>
              <td>
                <div class="row-actions">
                  <button class="mini-btn" data-edit-user="${escapeHtml(user.id)}" type="button">Editar</button>
                  ${user.role !== "admin" && user.authorizedDeviceId ? `<button class="mini-btn" data-release-device="${escapeHtml(user.id)}" type="button">Liberar equipo</button>` : ""}
                  <button class="mini-btn danger" data-delete-user="${escapeHtml(user.id)}" type="button">Eliminar</button>
                </div>
              </td>
            </tr>
          `)
          .join("")
      : `<tr><td colspan="6">No hay usuarios creados.</td></tr>`;
  }

  function renderCurrentUser() {
    const badge = $("#currentUserBadge");
    if (!currentUser) {
      badge.textContent = "";
      return;
    }
    badge.textContent = `${currentUser.name} · ${roleLabels[currentUser.role] || currentUser.role}`;
  }

  function applyPermissions() {
    document.body.classList.toggle("locked", !currentUser);
    $("#loginScreen").classList.toggle("hidden", !!currentUser);
    if (!currentUser) return;

    $$(".nav-btn").forEach((btn) => {
      btn.classList.toggle("hidden", !canView(btn.dataset.view));
    });

    $$(".view").forEach((view) => {
      view.classList.toggle("hidden", !canView(view.id));
    });

    $("#btnExportJson").classList.toggle("hidden", !can("export"));
    $("#btnExportJson2").classList.toggle("hidden", !can("export"));
    $("#btnExportAlerts").classList.toggle("hidden", !can("export"));
    $("#btnExportPlan").classList.toggle("hidden", !can("export"));
    $("#btnExportRecords").classList.toggle("hidden", !can("export"));
    const importButton = $("#importJson").closest(".file-btn");
    if (importButton) importButton.classList.toggle("hidden", !can("import"));
    $("#btnSeedDemo").classList.toggle("hidden", !can("config"));

    $("#equipmentForm").classList.toggle("hidden", !can("editMaster"));
    $("#routineForm").classList.toggle("hidden", !can("editMaster"));
    $("#configForm").classList.toggle("hidden", !can("config"));

    if (!canView($(".view.active")?.id)) {
      const firstAllowed = getPermissions().views[0] || "dashboard";
      showView(firstAllowed);
    }
  }

  function populateExecutionSelectors() {
    const equipmentSelect = $("#recordEquipment");
    const selectedEquipment = equipmentSelect.value;
    equipmentSelect.innerHTML = state.equipment
      .filter((equipment) => equipment.active !== false)
      .map((equipment) => `<option value="${escapeHtml(equipment.id)}">${escapeHtml(equipment.code)} · ${escapeHtml(equipment.name)}</option>`)
      .join("");
    if (selectedEquipment && state.equipment.some((equipment) => equipment.id === selectedEquipment)) {
      equipmentSelect.value = selectedEquipment;
    }

    const equipment = state.equipment.find((item) => item.id === equipmentSelect.value) || state.equipment[0];
    const routines = getRoutinesForEquipment(equipment || {});
    const routineSelect = $("#recordRoutine");
    const selectedRoutine = routineSelect.value;
    routineSelect.innerHTML = routines
      .map((routine) => `<option value="${escapeHtml(routine.id)}">${escapeHtml(routine.code)} · ${escapeHtml(routine.name)} (${escapeHtml(routine.frequencyText)})</option>`)
      .join("");
    if (selectedRoutine && routines.some((routine) => routine.id === selectedRoutine)) {
      routineSelect.value = selectedRoutine;
    }
    fillRoutineDefaults();
  }

  function fillRoutineDefaults() {
    const routine = state.routines.find((item) => item.id === $("#recordRoutine").value);
    if (!routine) return;
    if (!$("#recordLubricant").value) $("#recordLubricant").value = routine.lubricant || "";
    $("#recordLoto").value = routine.requiresLoto || "Según condición";
  }

  function renderConfig() {
    $("#configBaseDate").value = state.config.baseDate || todayISO();
    $("#configPrealert").value = state.config.prealertDays || 7;
    $("#configSite").value = state.config.site || "";
    $("#configMaster").value = state.config.masterSystem || "SAP";
  }

  function renderAll() {
    renderCurrentUser();
    applyPermissions();
    populateExecutionSelectors();
    populateDashboardFilters();
    renderDashboard();
    renderPlan();
    renderEquipment();
    renderRoutines();
    renderRecords();
    renderUsers();
    renderConfig();
  }

  function clearRecordForm() {
    $("#executionForm").reset();
    $("#recordDate").value = todayISO();
    const now = new Date();
    $("#recordTime").value = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    fillRoutineDefaults();
  }

  function clearEquipmentForm() {
    $("#equipmentForm").reset();
    $("#equipmentId").value = "";
    $("#equipmentFamily").value = "General";
    $("#equipmentCriticality").value = "Media";
  }

  function clearRoutineForm() {
    $("#routineForm").reset();
    $("#routineId").value = "";
    $("#routineScope").value = "Todos";
    $("#routineLoto").value = "Según condición";
  }

  function clearUserForm() {
    $("#userForm").reset();
    $("#userId").value = "";
    $("#userRole").value = "tecnico";
    $("#userActive").value = "true";
  }

  function showView(viewId) {
    if (!canView(viewId)) {
      toast("Tu rol no tiene permiso para abrir esta vista.");
      return;
    }
    $$(".nav-btn").forEach((item) => item.classList.toggle("active", item.dataset.view === viewId));
    $$(".view").forEach((item) => item.classList.toggle("active", item.id === viewId));
  }

  function bindNavigation() {
    $$(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        showView(btn.dataset.view);
      });
    });
  }

  function bindForms() {
    $("#recordEquipment").addEventListener("change", () => {
      $("#recordLubricant").value = "";
      populateExecutionSelectors();
    });
    $("#recordRoutine").addEventListener("change", () => {
      $("#recordLubricant").value = "";
      fillRoutineDefaults();
    });

    $("#executionForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!requireAction("record")) return;
      const equipment = state.equipment.find((item) => item.id === $("#recordEquipment").value);
      const routine = state.routines.find((item) => item.id === $("#recordRoutine").value);
      const record = {
        id: uid("REG"),
        equipmentId: equipment?.id || "",
        equipmentCode: equipment?.code || "",
        routineId: routine?.id || "",
        routineCode: routine?.code || "",
        date: $("#recordDate").value,
        time: $("#recordTime").value,
        shift: $("#recordShift").value,
        technician: $("#recordTechnician").value.trim() || currentUser?.name || "",
        status: $("#recordStatus").value,
        hourmeter: $("#recordHourmeter").value,
        lubricant: $("#recordLubricant").value.trim(),
        quantity: $("#recordQuantity").value.trim(),
        loto: $("#recordLoto").value,
        oilCondition: $("#recordOilCondition").value,
        sapNotice: $("#recordSapNotice").value.trim(),
        sapOrder: $("#recordSapOrder").value.trim(),
        evidence: $("#recordEvidence").value.trim(),
        supervisor: $("#recordSupervisor").value.trim(),
        findings: $("#recordFindings").value.trim(),
        action: $("#recordAction").value.trim(),
        createdAt: new Date().toISOString(),
      };
      if (apiAvailable) {
        try {
          const result = await apiRequest("/records", { method: "POST", body: record });
          if (result.record?.id) record.id = result.record.id;
        } catch (error) {
          toast("No se pudo sincronizar con D1; se guardará localmente.");
        }
      }
      state.records.push(record);
      saveData();
      clearRecordForm();
      renderAll();
      toast("Registro guardado y plan actualizado.");
    });

    $("#equipmentForm").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!requireAction("editMaster")) return;
      const id = $("#equipmentId").value || uid("EQ");
      const equipment = {
        id,
        code: $("#equipmentCode").value.trim(),
        name: $("#equipmentName").value.trim(),
        area: $("#equipmentArea").value.trim(),
        system: $("#equipmentSystem").value.trim(),
        subsystem: $("#equipmentSubsystem").value.trim(),
        family: $("#equipmentFamily").value,
        criticality: $("#equipmentCriticality").value,
        costCenter: $("#equipmentCostCenter").value.trim(),
        active: true,
      };
      const index = state.equipment.findIndex((item) => item.id === id);
      if (index >= 0) state.equipment[index] = equipment;
      else state.equipment.push(equipment);
      saveData();
      clearEquipmentForm();
      renderAll();
      toast("Equipo guardado.");
    });

    $("#routineForm").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!requireAction("editMaster")) return;
      const id = $("#routineId").value || uid("RT");
      const routine = {
        id,
        code: $("#routineCode").value.trim(),
        name: $("#routineName").value.trim(),
        scope: $("#routineScope").value,
        frequencyDays: Number($("#routineFrequency").value),
        frequencyText: $("#routineFrequencyText").value.trim() || `${$("#routineFrequency").value} días`,
        responsible: $("#routineResponsible").value.trim(),
        lubricant: $("#routineLubricant").value.trim(),
        requiresLoto: $("#routineLoto").value,
        description: $("#routineDescription").value.trim(),
        procedure: $("#routineProcedure").value.trim(),
        active: true,
      };
      const index = state.routines.findIndex((item) => item.id === id);
      if (index >= 0) state.routines[index] = routine;
      else state.routines.push(routine);
      saveData();
      clearRoutineForm();
      renderAll();
      toast("Rutina guardada.");
    });

    $("#configForm").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!requireAction("config")) return;
      state.config = {
        ...state.config,
        baseDate: $("#configBaseDate").value || todayISO(),
        prealertDays: Number($("#configPrealert").value || 7),
        site: $("#configSite").value.trim(),
        masterSystem: $("#configMaster").value.trim() || "SAP",
      };
      saveData();
      renderAll();
      toast("Configuración guardada.");
    });

    $("#userForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!requireAction("users")) return;
      const id = $("#userId").value || uid("USR");
      const username = $("#userUsername").value.trim().toLowerCase();
      const duplicated = state.users.some((user) => user.username.toLowerCase() === username && user.id !== id);
      if (duplicated) {
        toast("Ya existe un usuario con ese nombre de acceso.");
        return;
      }
      const user = {
        id,
        name: $("#userName").value.trim(),
        username,
        pin: $("#userPin").value.trim(),
        role: $("#userRole").value,
        active: $("#userActive").value === "true",
        note: $("#userNote").value.trim(),
      };
      if (apiAvailable) {
        try {
          const result = await apiRequest("/users", { method: "POST", body: user });
          if (result.user?.id) user.id = result.user.id;
        } catch (error) {
          toast("No se pudo sincronizar usuario con D1; se guardará localmente.");
        }
      }
      const index = state.users.findIndex((item) => item.id === id);
      if (index >= 0) state.users[index] = user;
      else state.users.push(user);
      saveData();
      clearUserForm();
      renderAll();
      toast("Usuario guardado.");
    });
  }

  function bindRowActions() {
    document.body.addEventListener("click", async (event) => {
      const editEquipment = event.target.closest("[data-edit-equipment]");
      const deleteEquipment = event.target.closest("[data-delete-equipment]");
      const editRoutine = event.target.closest("[data-edit-routine]");
      const deleteRoutine = event.target.closest("[data-delete-routine]");
      const deleteRecord = event.target.closest("[data-delete-record]");
      const editUser = event.target.closest("[data-edit-user]");
      const deleteUser = event.target.closest("[data-delete-user]");
      const releaseDevice = event.target.closest("[data-release-device]");
      const dashboardCard = event.target.closest("[data-dashboard-card]");

      if (editEquipment) {
        if (!requireAction("editMaster")) return;
        const equipment = state.equipment.find((item) => item.id === editEquipment.dataset.editEquipment);
        if (!equipment) return;
        $("#equipmentId").value = equipment.id;
        $("#equipmentCode").value = equipment.code || "";
        $("#equipmentName").value = equipment.name || "";
        $("#equipmentArea").value = equipment.area || "";
        $("#equipmentSystem").value = equipment.system || "";
        $("#equipmentSubsystem").value = equipment.subsystem || "";
        $("#equipmentFamily").value = equipment.family || "General";
        $("#equipmentCriticality").value = equipment.criticality || "Media";
        $("#equipmentCostCenter").value = equipment.costCenter || "";
        toast("Equipo cargado para edición.");
      }

      if (deleteEquipment) {
        if (!requireAction("editMaster")) return;
        const id = deleteEquipment.dataset.deleteEquipment;
        if (!confirm("¿Eliminar este equipo del plan local? El histórico se conserva, pero ya no aparecerá en el plan.")) return;
        state.equipment = state.equipment.filter((item) => item.id !== id);
        saveData();
        renderAll();
        toast("Equipo eliminado.");
      }

      if (editRoutine) {
        if (!requireAction("editMaster")) return;
        const routine = state.routines.find((item) => item.id === editRoutine.dataset.editRoutine);
        if (!routine) return;
        $("#routineId").value = routine.id;
        $("#routineCode").value = routine.code || "";
        $("#routineName").value = routine.name || "";
        $("#routineScope").value = routine.scope || "Todos";
        $("#routineFrequency").value = routine.frequencyDays || "";
        $("#routineFrequencyText").value = routine.frequencyText || "";
        $("#routineResponsible").value = routine.responsible || "";
        $("#routineLubricant").value = routine.lubricant || "";
        $("#routineLoto").value = routine.requiresLoto || "Según condición";
        $("#routineDescription").value = routine.description || "";
        $("#routineProcedure").value = routine.procedure || "";
        toast("Rutina cargada para edición.");
      }

      if (deleteRoutine) {
        if (!requireAction("editMaster")) return;
        const id = deleteRoutine.dataset.deleteRoutine;
        if (!confirm("¿Eliminar esta rutina del plan local?")) return;
        state.routines = state.routines.filter((item) => item.id !== id);
        saveData();
        renderAll();
        toast("Rutina eliminada.");
      }

      if (deleteRecord) {
        if (!requireAction("delete")) return;
        const id = deleteRecord.dataset.deleteRecord;
        if (!confirm("¿Eliminar este registro de ejecución?")) return;
        if (apiAvailable) {
          try {
            await apiRequest(`/records/${encodeURIComponent(id)}`, { method: "DELETE" });
          } catch (error) {
            toast("No se pudo eliminar en D1; se eliminará localmente.");
          }
        }
        state.records = state.records.filter((item) => item.id !== id);
        saveData();
        renderAll();
        toast("Registro eliminado.");
      }

      if (editUser) {
        if (!requireAction("users")) return;
        const user = state.users.find((item) => item.id === editUser.dataset.editUser);
        if (!user) return;
        $("#userId").value = user.id;
        $("#userName").value = user.name || "";
        $("#userUsername").value = user.username || "";
        $("#userRole").value = user.role || "tecnico";
        $("#userPin").value = user.pin || "";
        $("#userActive").value = user.active === false ? "false" : "true";
        $("#userNote").value = user.note || "";
        toast("Usuario cargado para edición.");
      }

      if (releaseDevice) {
        if (!requireAction("users")) return;
        const id = releaseDevice.dataset.releaseDevice;
        const user = state.users.find((item) => item.id === id);
        if (!user) return;
        if (!confirm("¿Liberar el equipo autorizado para este usuario? El próximo ingreso vinculará el nuevo dispositivo.")) return;
        try {
          const result = await apiRequest(`/users/${encodeURIComponent(id)}/release-device`, { method: "POST" });
          apiAvailable = true;
          if (result.user) Object.assign(user, result.user);
          else {
            delete user.authorizedDeviceId;
            delete user.authorizedDeviceLabel;
            delete user.authorizedDeviceAt;
          }
        } catch (error) {
          toast("No se pudo liberar en D1. Revisa el binding DB y el deploy.");
          return;
        }
        saveData();
        renderAll();
        toast("Equipo liberado. El usuario deberá ingresar desde el nuevo dispositivo.");
      }

      if (deleteUser) {
        if (!requireAction("users")) return;
        const id = deleteUser.dataset.deleteUser;
        if (id === currentUser?.id) {
          toast("No puedes eliminar el usuario con el que estás conectado.");
          return;
        }
        if (!confirm("¿Eliminar este usuario local?")) return;
        if (apiAvailable) {
          try {
            await apiRequest(`/users/${encodeURIComponent(id)}`, { method: "DELETE" });
          } catch (error) {
            toast("No se pudo eliminar usuario en D1; se eliminará localmente.");
          }
        }
        state.users = state.users.filter((item) => item.id !== id);
        saveData();
        renderAll();
        toast("Usuario eliminado.");
      }

      if (dashboardCard) {
        dashboardFilters.status = dashboardCard.dataset.dashboardCard || "";
        renderAll();
      }
    });
  }

  function toCsv(rows) {
    return rows
      .map((row) =>
        row
          .map((value) => {
            const text = String(value ?? "");
            return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
          })
          .join(";")
      )
      .join("\n");
  }

  function download(filename, content, type = "text/plain;charset=utf-8") {
    const blob = new Blob(["\ufeff", content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function exportPlanCsv() {
    if (!requireAction("export")) return;
    const rows = [
      ["Estado", "Días", "Equipo", "Nombre equipo", "Familia", "Rutina", "Frecuencia días", "Última ejecución", "Próxima fecha", "Responsable", "Procedimiento"],
      ...buildPlan().map((item) => [
        item.status,
        item.days ?? "",
        item.equipment.code,
        item.equipment.name,
        item.equipment.family,
        `${item.routine.code} - ${item.routine.name}`,
        item.routine.frequencyDays,
        item.lastDate,
        item.nextDate,
        item.routine.responsible,
        item.routine.procedure,
      ]),
    ];
    download(`plan_lubricacion_${todayISO()}.csv`, toCsv(rows), "text/csv;charset=utf-8");
  }

  function exportAlertsCsv() {
    if (!requireAction("export")) return;
    const alerts = buildPlan().filter((item) => item.status !== "VIGENTE");
    const rows = [
      ["Estado", "Días", "Próxima fecha", "Equipo", "Rutina", "Responsable", "Acción requerida"],
      ...alerts.map((item) => [
        item.status,
        item.days ?? "",
        item.nextDate,
        item.equipment.code,
        `${item.routine.code} - ${item.routine.name}`,
        item.routine.responsible,
        item.status === "VENCIDO" ? "Programar intervención inmediata / justificar reprogramación" : "Incluir en programación",
      ]),
    ];
    download(`alertas_lubricacion_${todayISO()}.csv`, toCsv(rows), "text/csv;charset=utf-8");
  }

  function exportRecordsCsv() {
    if (!requireAction("export")) return;
    const rows = [
      ["ID", "Fecha", "Hora", "Equipo", "Rutina", "Estado", "Turno", "Técnico", "Horómetro", "Lubricante", "Cantidad", "LOTO", "Condición aceite", "Aviso SAP", "OT SAP", "Supervisor", "Hallazgos", "Acción", "Evidencia"],
      ...state.records.map((record) => [
        record.id,
        record.date,
        record.time,
        record.equipmentCode,
        record.routineCode,
        record.status,
        record.shift,
        record.technician,
        record.hourmeter,
        record.lubricant,
        record.quantity,
        record.loto,
        record.oilCondition,
        record.sapNotice,
        record.sapOrder,
        record.supervisor,
        record.findings,
        record.action,
        record.evidence,
      ]),
    ];
    download(`historico_lubricacion_${todayISO()}.csv`, toCsv(rows), "text/csv;charset=utf-8");
  }

  function exportJson() {
    if (!requireAction("export")) return;
    download(`respaldo_cmms_lubricacion_${todayISO()}.json`, JSON.stringify(state, null, 2), "application/json;charset=utf-8");
  }

  function bindExports() {
    $("#btnExportPlan").addEventListener("click", exportPlanCsv);
    $("#btnExportAlerts").addEventListener("click", exportAlertsCsv);
    $("#btnExportRecords").addEventListener("click", exportRecordsCsv);
    $("#btnExportJson").addEventListener("click", exportJson);
    $("#btnExportJson2").addEventListener("click", exportJson);

    $("#importJson").addEventListener("change", (event) => {
      if (!requireAction("import")) return;
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const imported = JSON.parse(reader.result);
          if (!Array.isArray(imported.equipment) || !Array.isArray(imported.routines) || !Array.isArray(imported.records)) {
            throw new Error("Estructura inválida");
          }
          const defaults = defaultData();
          state = {
            ...defaults,
            ...imported,
            config: { ...defaults.config, ...(imported.config || {}) },
            users: Array.isArray(imported.users) ? imported.users : defaults.users,
            planAssignments: Array.isArray(imported.planAssignments) ? imported.planAssignments : defaults.planAssignments,
          };
          saveData();
          renderAll();
          toast("Respaldo importado correctamente.");
        } catch (error) {
          console.error(error);
          toast("No se pudo importar el archivo JSON.");
        }
      };
      reader.readAsText(file);
    });
  }

  function bindAuth() {
    $("#loginForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = $("#loginUser").value.trim().toLowerCase();
      const pin = $("#loginPin").value.trim();
      const deviceId = getDeviceId();
      const deviceLabel = getDeviceLabel();

      try {
        const result = await apiRequest("/auth/login", {
          method: "POST",
          body: { username, pin, deviceId, deviceLabel },
        });
        apiAvailable = true;
        clearAccessMessage();
        unlockAfterLogin(result.user);
      } catch (error) {
        if (error.status === 401) {
          toast("Usuario o PIN incorrecto.");
          return;
        }
        if (error.status === 403 && error.payload?.code === "DEVICE_LOCKED") {
          showAccessMessage(`
            <strong>Acceso bloqueado por cambio de equipo.</strong><br>
            Este usuario ya fue autorizado en otro dispositivo.<br>
            Solicita al administrador liberar el equipo desde el módulo Usuarios.<br>
            <strong>Usuario:</strong> ${escapeHtml(error.payload.username || username)}<br>
            <strong>Este equipo:</strong> ${escapeHtml(deviceLabel)}<br>
            <strong>Código:</strong> ${escapeHtml(deviceId)}
          `);
          return;
        }

        if (!REQUIRE_D1_LOGIN) {
          const localUser = findInitialUser(username, pin);
          if (localUser) {
            clearAccessMessage();
            unlockAfterLogin(localUser);
            return;
          }
        }

        console.error(error);
        toast("No se pudo validar el acceso en Cloudflare D1. Revisa el deploy y el binding DB.");
      }
    });

    $("#btnLogout").addEventListener("click", () => {
      setSessionUser(null);
      renderCurrentUser();
      applyPermissions();
      toast("Sesión cerrada.");
    });
  }

  function bindPwaInstall() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").catch((error) => {
        console.warn("No se pudo registrar el service worker", error);
      });
    }

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      $("#btnInstallApp").classList.remove("hidden");
    });

    $("#btnInstallApp").addEventListener("click", async () => {
      if (!deferredInstallPrompt) {
        toast("Si no ves la instalación automática, usa el menú del navegador: Instalar aplicación.");
        return;
      }
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      $("#btnInstallApp").classList.add("hidden");
    });
  }

  function bindMisc() {
    $("#planStatusFilter").addEventListener("change", renderPlan);
    $("#dashboardStatusFilter").addEventListener("change", (event) => {
      dashboardFilters.status = event.target.value;
      renderDashboard();
    });
    $("#dashboardEquipmentFilter").addEventListener("change", (event) => {
      dashboardFilters.equipmentId = event.target.value;
      renderDashboard();
    });
    $("#dashboardRoutineFilter").addEventListener("change", (event) => {
      dashboardFilters.routineId = event.target.value;
      renderDashboard();
    });
    $("#btnDashboardClear").addEventListener("click", () => {
      dashboardFilters.status = "";
      dashboardFilters.equipmentId = "";
      dashboardFilters.routineId = "";
      populateDashboardFilters();
      renderDashboard();
    });
    $("#btnClearRecord").addEventListener("click", clearRecordForm);
    $("#btnClearEquipment").addEventListener("click", clearEquipmentForm);
    $("#btnClearRoutine").addEventListener("click", clearRoutineForm);
    $("#btnClearUser").addEventListener("click", clearUserForm);

    $("#btnSeedDemo").addEventListener("click", () => {
      if (!requireAction("config")) return;
      if (!confirm("Esto reemplaza los datos locales por la información del Excel actualizado. ¿Continuar?")) return;
      state = defaultData();
      saveData();
      clearRecordForm();
      clearEquipmentForm();
      clearRoutineForm();
      clearUserForm();
      renderAll();
      toast("Datos del Excel actualizado cargados.");
    });

    $("#btnNotify").addEventListener("click", async () => {
      const alerts = buildPlan().filter((item) => item.status === "VENCIDO" || item.status === "VENCE HOY");
      if (!("Notification" in window)) {
        toast("Este navegador no soporta notificaciones. Las alertas quedan visibles en el dashboard.");
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast("No se activaron notificaciones. Puedes seguir usando el dashboard de alertas.");
        return;
      }
      if (!alerts.length) {
        new Notification("Lubricación al día", { body: "No hay rutinas vencidas ni que venzan hoy." });
        return;
      }
      new Notification("Alertas de lubricación", {
        body: `${alerts.length} rutina(s) vencidas o con vencimiento hoy. Revisar dashboard.`,
      });
    });
  }

  function init() {
    window.CMMS_APP_VERSION = APP_VERSION;
    document.body.classList.add("locked");
    currentUser = loadSessionUser();
    bindNavigation();
    bindAuth();
    bindForms();
    bindRowActions();
    bindExports();
    bindPwaInstall();
    bindMisc();
    clearRecordForm();
    clearEquipmentForm();
    clearRoutineForm();
    clearUserForm();
    renderAll();
    hydrateFromApi();
  }

  init();
})();

