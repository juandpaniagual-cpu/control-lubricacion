PRAGMA foreign_keys = ON;

INSERT OR REPLACE INTO app_settings (key, value) VALUES
  ('baseDate', '2026-05-01'),
  ('prealertDays', '7'),
  ('site', 'Planta Sales'),
  ('masterSystem', 'SAP'),
  ('supportSystem', 'App local / CMMS de turno');

INSERT OR REPLACE INTO users (id, name, username, pin, role, note, active) VALUES
  ('USR-ADMIN', 'Administrador', 'admin', 'admin123', 'admin', 'Acceso total inicial', 1),
  ('USR-SUPERVISOR', 'Supervisor mantenimiento', 'supervisor', 'sup123', 'supervisor', 'Seguimiento y exportación', 1),
  ('USR-TECNICO', 'Técnico de turno', 'tecnico', 'tec123', 'tecnico', 'Registro de rutinas', 1),
  ('USR-CONSULTA', 'Usuario consulta', 'consulta', 'ver123', 'consulta', 'Solo lectura', 1);

INSERT OR REPLACE INTO equipment
  (id, code, name, area, system, subsystem, family, criticality, cost_center, active)
VALUES
  ('EQ-30M001', '30M001', 'Centrífuga horizontal 30M001', 'Hipocalcio', 'Centrifugación', 'Decantación', 'Centrífugas', 'Alta', 'CC-CENT-01', 1),
  ('EQ-30M002', '30M002', 'Centrífuga horizontal 30M002', 'Hipocalcio', 'Centrifugación', 'Decantación', 'Centrífugas', 'Alta', 'CC-CENT-01', 1),
  ('EQ-40M001', '40M001', 'Centrífuga horizontal 40M001', 'Hipocalcio', 'Centrifugación', 'Decantación', 'Centrífugas', 'Alta', 'CC-CENT-01', 1);

INSERT OR REPLACE INTO routines
  (id, code, name, scope, description, frequency_days, frequency_text, responsible, lubricant, requires_loto, procedure, active)
VALUES
  ('RT-R1', 'R1', 'Rutina 1', 'Centrífugas', 'Lubricación puntos internos de centrífuga.', 30, 'Mensual', 'Técnico mecánico', 'Nevastane XS 80', 'Sí', 'PROCEDIMIENTO LUBRICACIÓN CENTRÍFUGAS HIPOCALCIO', 1),
  ('RT-R2', 'R2', 'Rutina 2', 'Centrífugas', 'Lubricación según puntos definidos en procedimiento.', 20, 'Cada 20 días', 'Técnico mecánico', 'Nevastane XS 80', 'Según condición', 'PROCEDIMIENTO LUBRICACIÓN CENTRÍFUGAS HIPOCALCIO', 1),
  ('RT-R3', 'R3', 'Rutina 3', 'Centrífugas', 'Lubricación según puntos definidos en procedimiento.', 15, 'Cada 15 días', 'Técnico mecánico', 'Nevastane XS 80', 'Según condición', 'PROCEDIMIENTO LUBRICACIÓN CENTRÍFUGAS HIPOCALCIO', 1),
  ('RT-R4', 'R4', 'Semestral motores', 'Centrífugas', 'Lubricación motor principal y motor auxiliar.', 180, 'Cada 6 meses', 'Técnico mecánico', 'Grasa según placa/manual del motor', 'Según condición', 'Manual motor / procedimiento interno', 1),
  ('RT-R5', 'R5', 'Semestral aceite', 'Centrífugas', 'Chequeo de aceite: nivel, condición, contaminación y fugas.', 180, 'Cada 6 meses', 'Técnico mecánico', 'Aceite especificado por fabricante', 'Según condición', 'Manual fabricante / procedimiento interno', 1);

INSERT OR REPLACE INTO plan_assignments
  (id, equipment_id, routine_id, base_date, responsible, procedure, lubricant, standard_quantity, requires_loto, planned_sap_order, observations, active)
VALUES
  ('PL-30M001-R1', 'EQ-30M001', 'RT-R1', '2026-05-01', 'Técnico mecánico', 'PROCEDIMIENTO LUBRICACIÓN CENTRÍFUGAS HIPOCALCIO', 'Nevastane XS 80', '', 'Sí', '', '', 1),
  ('PL-30M001-R4', 'EQ-30M001', 'RT-R4', '2026-05-01', 'Técnico mecánico', 'Manual motor / procedimiento interno', 'Grasa según placa/manual del motor', '', 'Según condición', '', '', 1),
  ('PL-30M001-R5', 'EQ-30M001', 'RT-R5', '2026-05-01', 'Técnico mecánico', 'Manual fabricante / procedimiento interno', 'Aceite especificado por fabricante', '', 'Según condición', '', '', 1),
  ('PL-30M002-R4', 'EQ-30M002', 'RT-R4', '2026-05-01', 'Técnico mecánico', 'Manual motor / procedimiento interno', 'Grasa según placa/manual del motor', '', 'Según condición', '', '', 1),
  ('PL-30M002-R5', 'EQ-30M002', 'RT-R5', '2026-05-01', 'Técnico mecánico', 'Manual fabricante / procedimiento interno', 'Aceite especificado por fabricante', '', 'Según condición', '', '', 1),
  ('PL-40M001-R3', 'EQ-40M001', 'RT-R3', '2026-05-01', 'Técnico mecánico', 'PROCEDIMIENTO LUBRICACIÓN CENTRÍFUGAS HIPOCALCIO', 'Nevastane XS 80', '', 'Según condición', '', '', 1),
  ('PL-40M001-R4', 'EQ-40M001', 'RT-R4', '2026-05-01', 'Técnico mecánico', 'Manual motor / procedimiento interno', 'Grasa según placa/manual del motor', '', 'Según condición', '', '', 1),
  ('PL-40M001-R5', 'EQ-40M001', 'RT-R5', '2026-05-01', 'Técnico mecánico', 'Manual fabricante / procedimiento interno', 'Aceite especificado por fabricante', '', 'Según condición', '', '', 1);
