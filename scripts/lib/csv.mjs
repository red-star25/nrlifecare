/**
 * Minimal RFC 4180 CSV reader/writer.
 *
 * Product names and use descriptions routinely contain commas, so a naive
 * split(",") corrupts the catalogue. This handles quoted fields, escaped
 * quotes and both LF and CRLF line endings.
 */

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  const input = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((entry) => entry.some((cell) => cell.trim() !== ""));
}

/** Parse into objects keyed by the header row, lower-cased and trimmed. */
export function parseCsvRecords(text) {
  const rows = parseCsv(text);
  if (rows.length === 0) return { headers: [], records: [] };

  const headers = rows[0].map((header) => header.trim().toLowerCase());

  const records = rows.slice(1).map((cells, index) => {
    const record = { __line: index + 2 };
    headers.forEach((header, column) => {
      record[header] = (cells[column] ?? "").trim();
    });
    return record;
  });

  return { headers, records };
}

export function toCsv(headers, rows) {
  const escape = (value) => {
    const text = value == null ? "" : String(value);
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  return [
    headers.map(escape).join(","),
    ...rows.map((row) => row.map(escape).join(",")),
  ].join("\n");
}
