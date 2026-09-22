'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { WriteResult } from '../actions';
import { formToPayload, recordToForm, type FieldDef } from './fields';

interface EntityManagerProps {
  title: string;
  addLabel?: string;
  fields: FieldDef[];
  items: Record<string, unknown>[];
  identity: string;
  badge?: string;
  save: (input: Record<string, unknown>) => Promise<WriteResult>;
  remove: (id: string) => Promise<WriteResult>;
}

export default function EntityManager({
  title,
  addLabel = 'إضافة عنصر',
  fields,
  items,
  identity,
  badge,
  save,
  remove,
}: EntityManagerProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openNew = () => {
    setIsNew(true);
    setEditing(null);
    setError(null);
    setForm(recordToForm({}, fields));
  };

  const openEdit = (item: Record<string, unknown>) => {
    setIsNew(false);
    setEditing(item);
    setError(null);
    setForm(recordToForm(item, fields));
  };

  const close = () => {
    setIsNew(false);
    setEditing(null);
    setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const payload = formToPayload(form, fields);
    if (editing) payload.id = editing.id as string;
    const res = await save(payload);
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? 'تعذّر الحفظ.');
      return;
    }
    close();
    router.refresh();
  };

  const handleDelete = async (item: Record<string, unknown>) => {
    const id = item.id as string;
    const label = (item[identity] as string) ?? id;
    if (!window.confirm(`حذف «${label}»؟`)) return;
    setBusy(true);
    const res = await remove(id);
    setBusy(false);
    if (res.ok) {
      router.refresh();
    } else {
      setError(res.error ?? 'تعذّر الحذف.');
    }
  };

  const showForm = isNew || editing;

  return (
    <section className="admin-entity">
      <div className="admin-entity__head">
        <h2 className="h2">{title}</h2>
        {!showForm && (
          <button type="button" className="btn btn-primary btn-sm" onClick={openNew}>
            {addLabel}
          </button>
        )}
      </div>

      {error && <p className="form-note admin-error">{error}</p>}

      {showForm ? (
        <form className="admin-form" onSubmit={submit}>
          <div className="admin-form-grid">
            {fields.map((f) => (
              <label key={f.name} className={f.type === 'textarea' || f.type === 'multiline' || f.type === 'documents' ? 'admin-field--wide' : undefined}>
                <span>{f.label}</span>
                {f.type === 'textarea' ? (
                  <textarea rows={3} required={f.required} value={form[f.name] ?? ''} onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))} />
                ) : f.type === 'multiline' || f.type === 'documents' ? (
                  <textarea rows={4} required={f.required} value={form[f.name] ?? ''} onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))} />
                ) : f.type === 'select' ? (
                  <select value={form[f.name] ?? ''} onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}>
                    {f.options?.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : f.type === 'datetime' ? 'datetime-local' : 'text'}
                    required={f.required}
                    value={form[f.name] ?? ''}
                    onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                  />
                )}
              </label>
            ))}
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? '…' : 'حفظ'}</button>
            <button type="button" className="btn btn-ghost" onClick={close}>إلغاء</button>
          </div>
        </form>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <tbody>
              {items.map((item) => (
                <tr key={item.id as string}>
                  <td className="admin-row-title">
                    {String(item[identity] ?? item.id ?? '')}
                    {badge && item[badge] ? (
                      <span className="chip chip-area">{fields.find((f) => f.name === badge)?.options?.find((o) => o.value === item[badge])?.label ?? String(item[badge])}</span>
                    ) : null}
                  </td>
                  <td className="admin-actions">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => openEdit(item)}>
                      تعديل
                    </button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(item)}>
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}