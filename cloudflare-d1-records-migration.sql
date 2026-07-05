PRAGMA foreign_keys = ON;

INSERT OR REPLACE INTO execution_records
  (id, equipment_id, equipment_code, routine_id, routine_code, date, time, shift, technician, status, hourmeter, lubricant, quantity, loto, oil_condition, sap_notice, sap_order, evidence, supervisor, findings, action, close_date, observations, created_at)
VALUES
  ('REG-0001', 'EQ-30M001', '30M001', 'RT-R1', 'R1', '2026-05-15', '', 'Turno 1', 'FGOMEZ', 'Ejecutado', '', 'Nevastane XS 80', '', 'Sí', 'OK', '', '', '', '', '', '', '', '', '2026-05-15T00:00:00.000Z'),
  ('REG-0002', 'EQ-30M002', '30M002', 'RT-R2', 'R2', '2026-05-15', '', 'Turno 1', 'FGOMEZ', 'Ejecutado', '', 'Nevastane XS 80', '', 'Sí', 'OK', '', '', '', '', '', '', '', '', '2026-05-15T00:00:00.000Z'),
  ('REG-0003', 'EQ-40M001', '40M001', 'RT-R3', 'R3', '2026-05-15', '', 'Turno 1', 'FGOMEZ', 'Ejecutado', '', 'Nevastane XS 80', '', 'Sí', 'OK', '', '', '', '', '', '', '', '', '2026-05-15T00:00:00.000Z'),
  ('REG-0004', 'EQ-30M001', '30M001', 'RT-R4', 'R4', '2026-06-15', '', 'Turno 1', 'FGOMEZ', 'Ejecutado', '', 'Grasa según placa/manual del motor', '', 'Sí', 'OK', '', '', '', '', '', '', '', '', '2026-06-15T00:00:00.000Z'),
  ('REG-0005', 'EQ-30M002', '30M002', 'RT-R4', 'R4', '2026-06-15', '', 'Turno 1', 'FGOMEZ', 'Ejecutado', '', 'Grasa según placa/manual del motor', '', 'Sí', 'OK', '', '', '', '', '', '', '', '', '2026-06-15T00:00:00.000Z'),
  ('REG-0006', 'EQ-40M001', '40M001', 'RT-R4', 'R4', '2026-06-15', '', 'Turno 1', 'FGOMEZ', 'Ejecutado', '', 'Grasa según placa/manual del motor', '', 'Sí', 'OK', '', '', '', '', '', '', '', '', '2026-06-15T00:00:00.000Z'),
  ('REG-0007', 'EQ-30M001', '30M001', 'RT-R5', 'R5', '2026-06-15', '', 'Turno 1', 'FGOMEZ', 'Ejecutado', '', 'Aceite especificado por fabricante', '', 'Sí', 'OK', '', '', '', '', '', '', '', '', '2026-06-15T00:00:00.000Z'),
  ('REG-0008', 'EQ-30M002', '30M002', 'RT-R5', 'R5', '2026-06-15', '', 'Turno 1', 'FGOMEZ', 'Ejecutado', '', 'Aceite especificado por fabricante', '', 'Sí', 'OK', '', '', '', '', '', '', '', '', '2026-06-15T00:00:00.000Z'),
  ('REG-0009', 'EQ-40M001', '40M001', 'RT-R5', 'R5', '2026-06-15', '', 'Turno 1', 'FGOMEZ', 'Ejecutado', '', 'Aceite especificado por fabricante', '', 'Sí', 'OK', '', '', '', '', '', '', '', '', '2026-06-15T00:00:00.000Z'),
  ('REG-0010', 'EQ-30M001', '30M001', 'RT-R1', 'R1', '2026-06-15', '', 'Turno 1', 'CARABALI', 'Ejecutado', '', 'Nevastane XS 80', '', 'Sí', 'OK', '', '', '', '', '', '', '', '', '2026-06-15T00:00:00.000Z'),
  ('REG-0011', 'EQ-30M002', '30M002', 'RT-R2', 'R2', '2026-06-10', '', 'Turno 1', 'CARABALI', 'Ejecutado', '', 'Nevastane XS 80', '', 'Sí', 'OK', '', '', '', '', '', '', '', '', '2026-06-10T00:00:00.000Z'),
  ('REG-0012', 'EQ-40M001', '40M001', 'RT-R3', 'R3', '2026-06-30', '', 'Turno 1', 'CARABALI', 'Ejecutado', '', 'Nevastane XS 80', '', 'Sí', 'OK', '', '', '', '', '', '', '', '', '2026-06-30T00:00:00.000Z'),
  ('REG-0013', 'EQ-30M001', '30M001', 'RT-R1', 'R1', '2026-06-03', '', 'Turno 1', 'AVILA', 'Ejecutado', '', 'Nevastane XS 80', '', 'Sí', 'OK', '', '', '', '', '', '', '', '', '2026-06-03T00:00:00.000Z'),
  ('REG-0014', 'EQ-30M002', '30M002', 'RT-R2', 'R2', '2026-06-04', '', 'Turno 1', 'AVILA', 'Ejecutado', '', 'Nevastane XS 80', '', 'Sí', 'OK', '', '', '', '', '', '', '', '', '2026-06-04T00:00:00.000Z'),
  ('REG-0015', 'EQ-40M001', '40M001', 'RT-R3', 'R3', '2026-06-05', '', 'Turno 1', 'AVILA', 'Ejecutado', '', 'Nevastane XS 80', '', 'Sí', 'OK', '', '', '', '', '', '', '', '', '2026-06-05T00:00:00.000Z');
