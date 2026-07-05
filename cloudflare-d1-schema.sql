PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  pin TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'supervisor', 'tecnico', 'consulta')),
  note TEXT DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS equipment (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  area TEXT DEFAULT '',
  system TEXT DEFAULT '',
  subsystem TEXT DEFAULT '',
  family TEXT DEFAULT 'General',
  criticality TEXT DEFAULT 'Media',
  cost_center TEXT DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS routines (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  scope TEXT DEFAULT 'Todos',
  description TEXT DEFAULT '',
  frequency_days INTEGER NOT NULL,
  frequency_text TEXT DEFAULT '',
  responsible TEXT DEFAULT '',
  lubricant TEXT DEFAULT '',
  requires_loto TEXT DEFAULT 'Según condición',
  procedure TEXT DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plan_assignments (
  id TEXT PRIMARY KEY,
  equipment_id TEXT NOT NULL,
  routine_id TEXT NOT NULL,
  base_date TEXT NOT NULL,
  responsible TEXT DEFAULT '',
  procedure TEXT DEFAULT '',
  lubricant TEXT DEFAULT '',
  standard_quantity TEXT DEFAULT '',
  requires_loto TEXT DEFAULT '',
  planned_sap_order TEXT DEFAULT '',
  observations TEXT DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
  FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS execution_records (
  id TEXT PRIMARY KEY,
  equipment_id TEXT NOT NULL,
  equipment_code TEXT DEFAULT '',
  routine_id TEXT NOT NULL,
  routine_code TEXT DEFAULT '',
  date TEXT NOT NULL,
  time TEXT DEFAULT '',
  shift TEXT DEFAULT '',
  technician TEXT DEFAULT '',
  status TEXT DEFAULT '',
  hourmeter TEXT DEFAULT '',
  lubricant TEXT DEFAULT '',
  quantity TEXT DEFAULT '',
  loto TEXT DEFAULT '',
  oil_condition TEXT DEFAULT '',
  sap_notice TEXT DEFAULT '',
  sap_order TEXT DEFAULT '',
  evidence TEXT DEFAULT '',
  supervisor TEXT DEFAULT '',
  findings TEXT DEFAULT '',
  action TEXT DEFAULT '',
  close_date TEXT DEFAULT '',
  observations TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
  FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_execution_records_equipment_routine_date
  ON execution_records (equipment_id, routine_id, date);

CREATE INDEX IF NOT EXISTS idx_execution_records_date
  ON execution_records (date);

CREATE INDEX IF NOT EXISTS idx_plan_assignments_equipment
  ON plan_assignments (equipment_id);
