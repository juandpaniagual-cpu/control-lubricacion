const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function error(message, status = 400, extra = {}) {
  return json({ ok: false, error: message, ...extra }, status);
}

async function bodyJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`.toUpperCase();
}

function requireDb(env) {
  if (!env.DB) throw new Error("Falta binding D1 llamado DB");
  return env.DB;
}

async function all(db, sql, params = []) {
  const res = await db.prepare(sql).bind(...params).all();
  return res.results || [];
}

async function first(db, sql, params = []) {
  return await db.prepare(sql).bind(...params).first();
}

async function run(db, sql, params = []) {
  return await db.prepare(sql).bind(...params).run();
}

async function logDeviceEvent(db, data) {
  try {
    await run(
      db,
      `INSERT INTO device_access_events (id, user_id, username, device_id, device_label, event_type, detail, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        makeId("DVE"),
        data.userId || "",
        data.username || "",
        data.deviceId || "",
        data.deviceLabel || "",
        data.eventType || "INFO",
        data.detail || "",
        new Date().toISOString(),
      ]
    );
  } catch (err) {
    console.warn("No se pudo registrar evento de dispositivo", err);
  }
}

function user(row) {
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    role: row.role,
    note: row.note || "",
    active: row.active === 1 || row.active === true,
    authorizedDeviceId: row.authorized_device_id || "",
    authorizedDeviceLabel: row.authorized_device_label || "",
    authorizedDeviceAt: row.authorized_device_at || "",
    lastLoginAt: row.last_login_at || "",
  };
}

function equipment(row) {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    area: row.area || "",
    system: row.system || "",
    subsystem: row.subsystem || "",
    family: row.family || "General",
    criticality: row.criticality || "Media",
    costCenter: row.cost_center || "",
    active: row.active === 1 || row.active === true,
  };
}

function routine(row) {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    scope: row.scope || "Todos",
    description: row.description || "",
    frequencyDays: row.frequency_days,
    frequencyText: row.frequency_text || `${row.frequency_days} días`,
    responsible: row.responsible || "",
    lubricant: row.lubricant || "",
    requiresLoto: row.requires_loto || "Según condición",
    procedure: row.procedure || "",
    active: row.active === 1 || row.active === true,
  };
}

function assignment(row) {
  return {
    id: row.id,
    equipmentId: row.equipment_id,
    routineId: row.routine_id,
    baseDate: row.base_date,
    responsible: row.responsible || "",
    procedure: row.procedure || "",
    lubricant: row.lubricant || "",
    standardQuantity: row.standard_quantity || "",
    requiresLoto: row.requires_loto || "",
    plannedSapOrder: row.planned_sap_order || "",
    observations: row.observations || "",
    active: row.active === 1 || row.active === true,
  };
}

function record(row) {
  return {
    id: row.id,
    equipmentId: row.equipment_id,
    equipmentCode: row.equipment_code || "",
    routineId: row.routine_id,
    routineCode: row.routine_code || "",
    date: row.date,
    time: row.time || "",
    shift: row.shift || "",
    technician: row.technician || "",
    status: row.status || "",
    hourmeter: row.hourmeter || "",
    lubricant: row.lubricant || "",
    quantity: row.quantity || "",
    loto: row.loto || "",
    oilCondition: row.oil_condition || "",
    sapNotice: row.sap_notice || "",
    sapOrder: row.sap_order || "",
    evidence: row.evidence || "",
    supervisor: row.supervisor || "",
    findings: row.findings || "",
    action: row.action || "",
    closeDate: row.close_date || "",
    observations: row.observations || "",
    createdAt: row.created_at || "",
  };
}

async function bootstrap(db) {
  const settings = await all(db, "SELECT key, value FROM app_settings");
  const cfg = Object.fromEntries(settings.map((r) => [r.key, r.value]));
  const equipmentRows = await all(db, "SELECT * FROM equipment ORDER BY code");
  const routineRows = await all(db, "SELECT * FROM routines ORDER BY code");
  const planRows = await all(db, "SELECT * FROM plan_assignments ORDER BY id");
  const recordRows = await all(db, "SELECT * FROM execution_records ORDER BY date DESC, created_at DESC");
  const userRows = await all(
    db,
    `SELECT id, name, username, role, note, active,
            authorized_device_id, authorized_device_label, authorized_device_at, last_login_at
       FROM users
      ORDER BY name`
  );

  return {
    ok: true,
    config: {
      baseDate: cfg.baseDate || "2026-05-01",
      prealertDays: Number(cfg.prealertDays || 7),
      site: cfg.site || "Planta Sales",
      masterSystem: cfg.masterSystem || "SAP",
      supportSystem: cfg.supportSystem || "Cloudflare D1",
    },
    equipment: equipmentRows.map(equipment),
    routines: routineRows.map(routine),
    planAssignments: planRows.map(assignment),
    records: recordRows.map(record),
    users: userRows.map(user),
  };
}

async function saveRecord(db, data) {
  const id = data.id || makeId("REG");
  const createdAt = data.createdAt || new Date().toISOString();
  await run(
    db,
    `INSERT OR REPLACE INTO execution_records (
      id, equipment_id, equipment_code, routine_id, routine_code, date, time, shift,
      technician, status, hourmeter, lubricant, quantity, loto, oil_condition,
      sap_notice, sap_order, evidence, supervisor, findings, action, close_date,
      observations, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.equipmentId || "",
      data.equipmentCode || "",
      data.routineId || "",
      data.routineCode || "",
      data.date || "",
      data.time || "",
      data.shift || "",
      data.technician || "",
      data.status || "",
      data.hourmeter || "",
      data.lubricant || "",
      data.quantity || "",
      data.loto || "",
      data.oilCondition || "",
      data.sapNotice || "",
      data.sapOrder || "",
      data.evidence || "",
      data.supervisor || "",
      data.findings || "",
      data.action || "",
      data.closeDate || "",
      data.observations || "",
      createdAt,
    ]
  );
  return { ...data, id, createdAt };
}

async function saveUser(db, data) {
  const id = data.id || makeId("USR");
  const username = String(data.username || "").trim().toLowerCase();
  if (!username || !data.name || !data.pin) throw new Error("Nombre, usuario y PIN son requeridos");

  const existing = await first(db, "SELECT * FROM users WHERE id = ? OR lower(username) = ?", [id, username]);
  const authorizedDeviceId = data.authorizedDeviceId ?? existing?.authorized_device_id ?? "";
  const authorizedDeviceLabel = data.authorizedDeviceLabel ?? existing?.authorized_device_label ?? "";
  const authorizedDeviceAt = data.authorizedDeviceAt ?? existing?.authorized_device_at ?? "";
  const lastLoginAt = existing?.last_login_at || "";

  await run(
    db,
    `INSERT OR REPLACE INTO users (
      id, name, username, pin, role, note, active,
      authorized_device_id, authorized_device_label, authorized_device_at, last_login_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.name || "",
      username,
      data.pin || "",
      data.role || "tecnico",
      data.note || "",
      data.active === false ? 0 : 1,
      authorizedDeviceId,
      authorizedDeviceLabel,
      authorizedDeviceAt,
      lastLoginAt,
      new Date().toISOString(),
    ]
  );

  const row = await first(
    db,
    `SELECT id, name, username, role, note, active,
            authorized_device_id, authorized_device_label, authorized_device_at, last_login_at
       FROM users WHERE id = ?`,
    [id]
  );
  return user(row);
}

async function login(db, data) {
  const username = String(data.username || "").trim().toLowerCase();
  const pin = String(data.pin || "").trim();
  const deviceId = String(data.deviceId || "").trim();
  const deviceLabel = String(data.deviceLabel || "Equipo sin identificar").slice(0, 180);

  const row = await first(db, "SELECT * FROM users WHERE lower(username) = ? AND pin = ? AND active = 1", [username, pin]);
  if (!row) return { response: error("Usuario o PIN incorrecto", 401) };

  const now = new Date().toISOString();

  if (row.role !== "admin") {
    if (!deviceId) {
      return { response: error("No se pudo identificar este equipo", 400, { code: "DEVICE_REQUIRED" }) };
    }

    if (!row.authorized_device_id) {
      await run(
        db,
        `UPDATE users
            SET authorized_device_id = ?, authorized_device_label = ?, authorized_device_at = ?, last_login_at = ?, updated_at = ?
          WHERE id = ?`,
        [deviceId, deviceLabel, now, now, now, row.id]
      );
      await logDeviceEvent(db, {
        userId: row.id,
        username: row.username,
        deviceId,
        deviceLabel,
        eventType: "AUTHORIZED_FIRST_DEVICE",
        detail: "Primer ingreso: dispositivo vinculado automáticamente.",
      });
    } else if (row.authorized_device_id !== deviceId) {
      await logDeviceEvent(db, {
        userId: row.id,
        username: row.username,
        deviceId,
        deviceLabel,
        eventType: "DENIED_DIFFERENT_DEVICE",
        detail: `Intento desde equipo diferente. Equipo autorizado: ${row.authorized_device_label || row.authorized_device_id}`,
      });
      return {
        response: error("Usuario autorizado en otro equipo", 403, {
          code: "DEVICE_LOCKED",
          username: row.username,
          authorizedDeviceLabel: row.authorized_device_label || "Equipo autorizado previamente",
          authorizedDeviceAt: row.authorized_device_at || "",
        }),
      };
    } else {
      await run(db, "UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?", [now, now, row.id]);
      await logDeviceEvent(db, {
        userId: row.id,
        username: row.username,
        deviceId,
        deviceLabel,
        eventType: "LOGIN_OK",
        detail: "Ingreso desde equipo autorizado.",
      });
    }
  } else {
    await run(db, "UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?", [now, now, row.id]);
  }

  const updated = await first(
    db,
    `SELECT id, name, username, role, note, active,
            authorized_device_id, authorized_device_label, authorized_device_at, last_login_at
       FROM users WHERE id = ?`,
    [row.id]
  );
  return { user: user(updated) };
}

async function releaseDevice(db, id) {
  const row = await first(db, "SELECT * FROM users WHERE id = ?", [id]);
  if (!row) throw new Error("Usuario no encontrado");
  const now = new Date().toISOString();
  await run(
    db,
    `UPDATE users
        SET authorized_device_id = '', authorized_device_label = '', authorized_device_at = '', updated_at = ?
      WHERE id = ?`,
    [now, id]
  );
  await logDeviceEvent(db, {
    userId: row.id,
    username: row.username,
    deviceId: row.authorized_device_id || "",
    deviceLabel: row.authorized_device_label || "",
    eventType: "RELEASED_BY_ADMIN",
    detail: "Equipo liberado desde el módulo Usuarios.",
  });
  const updated = await first(
    db,
    `SELECT id, name, username, role, note, active,
            authorized_device_id, authorized_device_label, authorized_device_at, last_login_at
       FROM users WHERE id = ?`,
    [id]
  );
  return user(updated);
}

export async function onRequest({ request, env }) {
  try {
    const db = requireDb(env);
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const method = request.method.toUpperCase();

    if (method === "GET" && path === "/api/health") {
      return json({ ok: true, app: "cmms-lubricacion", d1: Boolean(env.DB), timestamp: new Date().toISOString() });
    }

    if (method === "GET" && path === "/api/bootstrap") return json(await bootstrap(db));

    if (method === "POST" && path === "/api/auth/login") {
      const result = await login(db, await bodyJson(request));
      if (result.response) return result.response;
      return json({ ok: true, user: result.user });
    }

    if (method === "GET" && path === "/api/equipment") {
      return json({ ok: true, equipment: (await all(db, "SELECT * FROM equipment ORDER BY code")).map(equipment) });
    }

    if (method === "GET" && path === "/api/routines") {
      return json({ ok: true, routines: (await all(db, "SELECT * FROM routines ORDER BY code")).map(routine) });
    }

    if (method === "GET" && path === "/api/plan") {
      return json({ ok: true, planAssignments: (await all(db, "SELECT * FROM plan_assignments ORDER BY id")).map(assignment) });
    }

    if (method === "GET" && path === "/api/records") {
      return json({ ok: true, records: (await all(db, "SELECT * FROM execution_records ORDER BY date DESC, created_at DESC")).map(record) });
    }

    if (method === "POST" && path === "/api/records") {
      return json({ ok: true, record: await saveRecord(db, await bodyJson(request)) }, 201);
    }

    if (method === "DELETE" && path.startsWith("/api/records/")) {
      const id = decodeURIComponent(path.split("/").pop());
      await run(db, "DELETE FROM execution_records WHERE id = ?", [id]);
      return json({ ok: true, id });
    }

    if (method === "GET" && path === "/api/users") {
      return json({
        ok: true,
        users: (await all(
          db,
          `SELECT id, name, username, role, note, active,
                  authorized_device_id, authorized_device_label, authorized_device_at, last_login_at
             FROM users
            ORDER BY name`
        )).map(user),
      });
    }

    if (method === "POST" && path === "/api/users") {
      return json({ ok: true, user: await saveUser(db, await bodyJson(request)) }, 201);
    }

    if (method === "POST" && path.startsWith("/api/users/") && path.endsWith("/release-device")) {
      const id = decodeURIComponent(path.split("/")[3]);
      return json({ ok: true, user: await releaseDevice(db, id) });
    }

    if (method === "DELETE" && path.startsWith("/api/users/")) {
      const id = decodeURIComponent(path.split("/").pop());
      await run(db, "DELETE FROM users WHERE id = ?", [id]);
      return json({ ok: true, id });
    }

    return error("Ruta API no encontrada", 404);
  } catch (err) {
    return error(err.message || "Error interno", 500);
  }
}
