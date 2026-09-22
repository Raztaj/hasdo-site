export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'datetime'
  | 'select'
  | 'tags'
  | 'multiline'
  | 'documents';

export interface FieldDef {
  name: string;
  label: string;
  type?: FieldType;
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
}

function splitMultiline(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitTags(value: string): string[] {
  return value
    .split(/[،,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function decodeDocuments(value: string): Array<{ label_ar: string; url: string; kind: string }> {
  return splitMultiline(value).map((line) => {
    const [label_ar = '', url = '', kind = 'document'] = line.split('|');
    return { label_ar, url, kind };
  });
}

export function recordToForm(record: Record<string, unknown>, fields: FieldDef[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of fields) {
    const v = record[f.name];
    switch (f.type) {
      case 'number':
        out[f.name] = v == null ? '' : String(v);
        break;
      case 'date':
        out[f.name] = typeof v === 'string' ? v.slice(0, 10) : '';
        break;
      case 'datetime':
        out[f.name] = typeof v === 'string' ? new Date(v).toISOString().slice(0, 16) : '';
        break;
      case 'tags':
        out[f.name] = Array.isArray(v) ? v.join('، ') : '';
        break;
      case 'multiline':
        out[f.name] = Array.isArray(v) ? v.join('\n') : '';
        break;
      case 'documents':
        out[f.name] = Array.isArray(v)
          ? v
              .map((d) => `${(d as Record<string, unknown>).label_ar ?? ''}|${(d as Record<string, unknown>).url ?? ''}|${(d as Record<string, unknown>).kind ?? 'document'}`)
              .join('\n')
          : '';
        break;
      default:
        out[f.name] = typeof v === 'string' ? v : '';
    }
  }
  return out;
}

export function formToPayload(
  form: Record<string, string>,
  fields: FieldDef[],
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = (form[f.name] ?? '').trim();
    switch (f.type) {
      case 'number':
        out[f.name] = raw === '' ? 0 : Number(raw);
        break;
      case 'date':
        out[f.name] = raw === '' ? null : raw;
        break;
      case 'datetime':
        out[f.name] = raw === '' ? null : new Date(raw).toISOString();
        break;
      case 'tags':
        out[f.name] = splitTags(form[f.name] ?? '');
        break;
      case 'multiline':
        out[f.name] = splitMultiline(form[f.name] ?? '');
        break;
      case 'documents':
        out[f.name] = decodeDocuments(form[f.name] ?? '');
        break;
      default:
        out[f.name] = raw;
    }
  }
  return out;
}