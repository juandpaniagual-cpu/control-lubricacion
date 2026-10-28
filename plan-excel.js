/* Exportación XLSX del plan visible. Sin dependencias ni acceso a la base de datos. */
(() => {
  "use strict";
  const xml = (value) => String(value ?? "").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const column = (index) => {
    let name = "";
    for (let n = index + 1; n; n = Math.floor((n - 1) / 26)) name = String.fromCharCode(65 + (n - 1) % 26) + name;
    return name;
  };
  function crc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }
  // ZIP sin compresión: formato estándar de un libro Office Open XML.
  function zip(files) {
    const encoder = new TextEncoder();
    const parts = [], central = [];
    let offset = 0, centralSize = 0;
    for (const [path, text] of Object.entries(files)) {
      const name = encoder.encode(path), data = encoder.encode(text), crc = crc32(data);
      const header = new Uint8Array(30 + name.length), view = new DataView(header.buffer);
      view.setUint32(0, 0x04034b50, true); view.setUint16(4, 20, true);
      view.setUint16(12, 33, true); view.setUint32(14, crc, true);
      view.setUint32(18, data.length, true); view.setUint32(22, data.length, true);
      view.setUint16(26, name.length, true); header.set(name, 30);
      const entry = new Uint8Array(46 + name.length), ev = new DataView(entry.buffer);
      ev.setUint32(0, 0x02014b50, true); ev.setUint16(4, 20, true); ev.setUint16(6, 20, true);
      ev.setUint16(14, 33, true); ev.setUint32(16, crc, true);
      ev.setUint32(20, data.length, true); ev.setUint32(24, data.length, true);
      ev.setUint16(28, name.length, true); ev.setUint32(42, offset, true); entry.set(name, 46);
      parts.push(header, data); central.push(entry); offset += header.length + data.length; centralSize += entry.length;
    }
    const end = new Uint8Array(22), endView = new DataView(end.buffer);
    endView.setUint32(0, 0x06054b50, true); endView.setUint16(8, central.length, true);
    endView.setUint16(10, central.length, true); endView.setUint32(12, centralSize, true); endView.setUint32(16, offset, true);
    return new Blob([...parts, ...central, end], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
  }
  function workbook(rows) {
    const ns = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
    const rel = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
    const range = `A1:${column(rows[0].length - 1)}${rows.length}`;
    const data = rows.map((row, r) => `<row r="${r + 1}">${row.map((value, c) => {
      const ref = `${column(c)}${r + 1}`;
      if (r > 0 && c === 1 && /^-?\d+$/.test(String(value))) return `<c r="${ref}" s="1"><v>${Number(value)}</v></c>`;
      return `<c r="${ref}" s="${r === 0 ? 2 : 1}" t="inlineStr"><is><t xml:space="preserve">${xml(value)}</t></is></c>`;
    }).join("")}</row>`).join("");
    const widths = rows[0].map((_, c) => `<col min="${c + 1}" max="${c + 1}" width="${c === 1 ? 10 : [2,4,8,9].includes(c) ? 36 : 23}" customWidth="1"/>`).join("");
    return zip({
      "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
      "_rels/.rels": `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${rel}/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
      "xl/workbook.xml": `<workbook xmlns="${ns}" xmlns:r="${rel}"><sheets><sheet name="Plan maestro" sheetId="1" r:id="rId1"/></sheets></workbook>`,
      "xl/_rels/workbook.xml.rels": `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${rel}/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="${rel}/styles" Target="styles.xml"/></Relationships>`,
      "xl/styles.xml": `<styleSheet xmlns="${ns}"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1F4E79"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`,
      "xl/worksheets/sheet1.xml": `<worksheet xmlns="${ns}"><dimension ref="${range}"/><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="30"/><cols>${widths}</cols><sheetData>${data}</sheetData><autoFilter ref="${range}"/></worksheet>`
    });
  }
  function install() {
    const original = document.getElementById("btnExportPlan");
    if (!original || document.getElementById("btnExportPlanExcel")) return;
    const button = document.createElement("button");
    button.id = "btnExportPlanExcel"; button.type = "button";
    button.textContent = "Exportar plan Excel";
    button.title = "Descarga las filas visibles. Selecciona Todos para exportar el plan completo.";
    const sync = () => { button.className = original.className; button.hidden = original.hidden; button.disabled = original.disabled; };
    sync();
    new MutationObserver(sync).observe(original, {attributes: true, attributeFilter: ["class", "hidden", "disabled"]});
    original.after(button);
    button.addEventListener("click", () => {
      if (original.hidden || original.disabled || original.classList.contains("hidden") || document.body.classList.contains("locked")) return;
      try {
        const table = document.getElementById("planTable")?.closest("table");
        const read = (cell) => cell.innerText.trim();
        const headers = Array.from(table.querySelectorAll("thead th"), read);
        const rows = Array.from(table.querySelectorAll("tbody tr"))
          .filter(row => !row.hidden && row.style.display !== "none" && row.cells.length === headers.length)
          .map(row => Array.from(row.cells, read));
        if (!rows.length) { alert("No hay filas para exportar. Revisa el filtro del plan maestro."); return; }
        const blob = workbook([headers, ...rows]);
        const url = URL.createObjectURL(blob), link = document.createElement("a");
        const date = new Date();
        const stamp = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
        link.href = url; link.download = `Plan_maestro_lubricacion_${stamp}.xlsx`;
        document.body.appendChild(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 30000);
      } catch (error) {
        console.error("Exportación del plan maestro", error);
        alert("No se pudo exportar el plan maestro. Recarga la aplicación y vuelve a intentarlo.");
      }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install);
  else install();
})();
