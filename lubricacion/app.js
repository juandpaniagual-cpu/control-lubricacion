(function () {
  const STORAGE_KEY = "cmms_lubricacion_local_v1";
  const API_BASE = "/api/lubrication";
  const PLANT_ID = new URLSearchParams(location.search).get("plant") || "";
  let allowedActions = [], revision = 0, committed = null, saving = false;
  const APP_VERSION = "2026-11-11-multiplanta";
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



  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function defaultData() {
    return {config:{site:"",baseDate:todayISO(),prealertDays:7,masterSystem:"SAP",supportSystem:"CMMS multiplanta"},equipment:[],routines:[],planAssignments:[],records:[],users:[],accessRequests:[]};
  }

  function loadData() {
    return defaultData();
  }

  let state = loadData();

  async function saveData() {
    if (saving) return false;
    saving = true;
    const snapshot = JSON.parse(JSON.stringify({config:state.config,equipment:state.equipment,routines:state.routines,planAssignments:state.planAssignments,records:state.records}));
    try {
      const result = await apiRequest("/state",{method:"POST",body:{revision,state:snapshot}});
      revision=result.revision; committed=JSON.parse(JSON.stringify(snapshot)); return true;
    } catch(error) {
      if(committed) state={...JSON.parse(JSON.stringify(committed)),users:[],accessRequests:[]};
      renderAll(); toast(error.message + " No se guardaron los cambios. Recarga la planta antes de continuar."); return false;
    } finally {saving=false;}

  }





  function getPermissions() {
    const views=["dashboard","plan","historico","equipos","rutinas","config"];
    if(allowedActions.includes("record"))views.push("registro");
    if(currentUser?.role==="admin")views.push("usuarios");
    const actions=[...allowedActions];
    // Actualización: se conservan las tablas existentes; no se importa desde JSON.
    return {views,actions};
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







  function refreshInstallButtonVisibility() {
    $("#btnInstallApp").classList.add("hidden");
  }

  async function apiRequest(path, options={}) {
    const response=await fetch(API_BASE+path+"?plant="+encodeURIComponent(PLANT_ID),{
      method:options.method||"GET",credentials:"same-origin",cache:"no-store",
      headers:{"Content-Type":"application/json"},
      body:options.body?JSON.stringify(options.body):undefined
    });
    const data=await response.json();
    if(!response.ok){
      if(response.status===401 || response.status===403 && path==="/bootstrap"){
        currentUser=null;state=defaultData();document.body.classList.add("locked");
        $("#loginScreen").classList.remove("hidden");
      }
      throw new Error(data.error||"No se pudo completar la operación.");
    }
    return data;
  }




  async function hydrateFromApi() {
    const result=await apiRequest("/bootstrap");
    currentUser=result.user;allowedActions=result.actions;revision=result.revision;apiAvailable=true;
    state={...defaultData(),config:result.config,equipment:result.equipment,routines:result.routines,planAssignments:result.planAssignments,records:result.records};
    committed=JSON.parse(JSON.stringify(state));
    $("#plantName").textContent=state.config.site;
    $("#configSite").disabled=true;

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
    $("#usuarios").innerHTML='<h2>Usuarios y permisos</h2><p>La administración es centralizada. Los accesos se asignan por planta, módulo y acción.</p><a href="/?admin=1" target="_top">Administrar usuarios y permisos</a>';
  }


  function renderAccessRequests() {
    return;
  }

  function renderCurrentUser() {
    const badge = $("#currentUserBadge");
    if (!currentUser) {
      badge.textContent = "";
      return;
    }
    badge.textContent = `${currentUser.name} · ${roleLabels[currentUser.role] || currentUser.role}`;
  }

  function ensureEngineerSignature() {
    return;
  }


  function applyPermissions() {
    document.body.classList.toggle("locked", !currentUser);
    $("#loginScreen").classList.toggle("hidden", !!currentUser);
    if (!currentUser) {
      $("#btnInstallApp")?.classList.add("hidden");
      return;
    }
    refreshInstallButtonVisibility();

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
    $("#btnSeedDemo").classList.add("hidden");

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
    ensureEngineerSignature();
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
    if(!can('delete')) document.querySelectorAll('[data-delete-equipment],[data-delete-routine],[data-delete-record]').forEach(b=>b.hidden=true);
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
      if(saving)return;
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
      state.records.push(record);
      if (!await saveData()) return;
      clearRecordForm();
      renderAll();
      toast("Registro guardado y plan actualizado.");
    });

    $("#equipmentForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      if(saving)return;
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
      if (!await saveData()) return;
      clearEquipmentForm();
      renderAll();
      toast("Equipo guardado.");
    });

    $("#routineForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      if(saving)return;
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
      if (!await saveData()) return;
      clearRoutineForm();
      renderAll();
      toast("Rutina guardada.");
    });

    $("#configForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      if(saving)return;
      if (!requireAction("config")) return;
      state.config = {
        ...state.config,
        baseDate: $("#configBaseDate").value || todayISO(),
        prealertDays: Number($("#configPrealert").value || 7),
        site: $("#configSite").value.trim(),
        masterSystem: $("#configMaster").value.trim() || "SAP",
      };
      if (!await saveData()) return;
      renderAll();
      toast("Configuración guardada.");
    });

  }


  function bindRowActions() {
    document.body.addEventListener("click", async (event) => {
      if(saving)return;
      const editEquipment = event.target.closest("[data-edit-equipment]");
      const deleteEquipment = event.target.closest("[data-delete-equipment]");
      const editRoutine = event.target.closest("[data-edit-routine]");
      const deleteRoutine = event.target.closest("[data-delete-routine]");
      const deleteRecord = event.target.closest("[data-delete-record]");
      const editUser = event.target.closest("[data-edit-user]");
      const deleteUser = event.target.closest("[data-delete-user]");
      const releaseDevice = event.target.closest("[data-release-device]");
      const approveAccessRequest = event.target.closest("[data-approve-access-request]");
      const denyAccessRequest = event.target.closest("[data-deny-access-request]");
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
        if (!requireAction("delete")) return;
        const id = deleteEquipment.dataset.deleteEquipment;
        if (!confirm("¿Eliminar este equipo del plan local? El histórico se conserva, pero ya no aparecerá en el plan.")) return;
        state.equipment = state.equipment.filter((item) => item.id !== id);
        if (!await saveData()) return;
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
        if (!requireAction("delete")) return;
        const id = deleteRoutine.dataset.deleteRoutine;
        if (!confirm("¿Eliminar esta rutina del plan local?")) return;
        state.routines = state.routines.filter((item) => item.id !== id);
        if (!await saveData()) return;
        renderAll();
        toast("Rutina eliminada.");
      }

      if (deleteRecord) {
        if (!requireAction("delete")) return;
        const id = deleteRecord.dataset.deleteRecord;
        if (!confirm("¿Eliminar este registro de ejecución?")) return;
        state.records = state.records.filter((item) => item.id !== id);
        if (!await saveData()) return;
        renderAll();
        toast("Registro eliminado.");
      }

      if (dashboardCard) {
        const selectedStatus = dashboardCard.dataset.dashboardCard || "";
        dashboardFilters.status = selectedStatus;

        if (selectedStatus) {
          const planFilter = $("#planStatusFilter");
          if (planFilter) {
            planFilter.value = selectedStatus;
          }
          renderAll();
          showView("plan");
          setTimeout(() => {
            $("#plan")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 60);
          const label = selectedStatus === "PROXIMO" ? "PRÓXIMAS" : selectedStatus;
          toast(`Filtro aplicado en Plan maestro: ${label}.`);
        } else {
          renderAll();
          showView("historico");
          setTimeout(() => {
            $("#historico")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 60);
          toast("Abriendo histórico de ejecuciones.");
        }
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
    const backup={plantId:PLANT_ID,config:state.config,equipment:state.equipment,routines:state.routines,planAssignments:state.planAssignments,records:state.records};
    download("respaldo_"+PLANT_ID+"_"+todayISO()+".json",JSON.stringify(backup,null,2),"application/json;charset=utf-8");
  }

  function bindExports() {
    $("#btnExportPlan").addEventListener("click",exportPlanCsv);
    $("#btnExportAlerts").addEventListener("click",exportAlertsCsv);
    $("#btnExportRecords").addEventListener("click",exportRecordsCsv);
    $("#btnExportJson").addEventListener("click",exportJson);
    $("#btnExportJson2").addEventListener("click",exportJson);
    $("#importJson").addEventListener("change",async(event)=>{
      if(!requireAction("import"))return;
      const file=event.target.files[0];if(!file)return;
      try{
        const source=JSON.parse(await file.text());
        const imported={config:source.config,equipment:source.equipment,routines:source.routines,planAssignments:source.planAssignments||[],records:source.records};
        const preview=await apiRequest("/import",{method:"POST",body:{state:imported,preview:true}});
        const c=preview.counts;
        if(!confirm("Importar SOLO a HIPOCALCIO: "+c.equipment+" equipos, "+c.routines+" rutinas, "+c.planAssignments+" asignaciones y "+c.records+" ejecuciones. No se importarán usuarios ni contraseñas. ¿Continuar?"))return;
        await apiRequest("/import",{method:"POST",body:{state:imported}});
        await hydrateFromApi();renderAll();toast("Respaldo importado a HIPOCALCIO.");
      }catch(error){toast(error.message);}finally{event.target.value="";}
    });
  }

  function bindAuth() {
    $("#btnLogout").addEventListener("click",async()=>{
      await fetch("/api/logout",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:"{}"});
      window.top.location.href="/";
    });
  }

  function bindPwaInstall() {
    $("#btnInstallApp").classList.add("hidden");
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


  async function init() {
    window.CMMS_APP_VERSION=APP_VERSION;
    document.body.classList.add("locked");
    try {
      await hydrateFromApi();
      bindNavigation();bindAuth();bindForms();bindRowActions();bindExports();bindPwaInstall();bindMisc();
      clearRecordForm();clearEquipmentForm();clearRoutineForm();renderAll();
    }catch(error){$("#bootstrapError").textContent=error.message;}

  }

  init();
})();
