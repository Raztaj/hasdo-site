'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { login } from '../actions';
import SetupNotice from './setup-notice';

export default function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configured) return;
    setBusy(true);
    setError(null);
    const res = await login(new FormData(e.currentTarget as HTMLFormElement));
    setBusy(false);
    if (res && res.ok === false && res.error) {
      setError(res.error);
    } else {
      router.replace('/admin/overview');
    }
  };

  return (
    <div className="admin-login-card">
      <h1 className="h1">لوحة البيانات</h1>
      <p className="admin-login-sub">منظمة هسدو — الإشراف على المحتوى</p>
      {!configured ? (
        <SetupNotice />
      ) : (
        <form onSubmit={submit}>
          {error && <p className="form-note admin-error">{error}</p>}
          <label>
            <span>البريد الإلكتروني</span>
            <input type="email" name="email" dir="ltr" required />
          </label>
          <label>
            <span>كلمة المرور</span>
            <input type="password" name="password" dir="ltr" required />
          </label>
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? '…' : 'دخول'}
          </button>
        </form>
      )}
    </div>
  );
}