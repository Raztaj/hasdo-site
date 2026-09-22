'use client';

import { useState } from 'react';

const REASONS = ['استفسار عام', 'تطوع', 'شراكة', 'إعلام', 'مشروع', 'أخرى'];

export default function ContactForm({ email }: { email: string }) {
  const [name, setName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [reason, setReason] = useState(REASONS[0]);
  const [message, setMessage] = useState('');
  const [sentNote, setSentNote] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setSentNote(
        'البريد الرسمي غير مُفعّل بعد في هذا الموقع — يُنشر من لوحة التحكم عند اعتماده.',
      );
      return;
    }
    const subject = encodeURIComponent(`[${reason}] رسالة من الموقع — ${name}`);
    const body = encodeURIComponent(`الاسم: ${name}\nالبريد: ${senderEmail}\nنوع التواصل: ${reason}\n\n${message}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSentNote('سيفتح برنامج بريدك لمراجعة الرسالة قبل الإرسال.');
  };

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="contact-row">
        <label>
          الاسم
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك الكامل" />
        </label>
        <label>
          البريد الإلكتروني
          <input type="email" required value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} placeholder="name@example.com" />
        </label>
      </div>
      <label>
        نوع التواصل
        <select value={reason} onChange={(e) => setReason(e.target.value)}>
          {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </label>
      <label>
        الرسالة
        <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="اكتب رسالتك…" />
      </label>
      {sentNote && <p className="form-note">{sentNote}</p>}
      <button type="submit" className="btn btn-primary btn-lg">أرسل رسالتك</button>
    </form>
  );
}