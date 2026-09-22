import { isDbConfigured } from '@/lib/supabase/server';
import LoginForm from '../components/login-form';

export const metadata = { title: 'دخول | لوحة هسدو' };

export default function LoginPage() {
  return (
    <div className="admin-login">
      <LoginForm configured={isDbConfigured()} />
    </div>
  );
}