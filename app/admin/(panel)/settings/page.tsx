import { getOrganization, getPresence, getStats, getStates } from '@/lib/data';
import SettingsForm from '../../components/settings-form';

export const metadata = { title: 'الإعدادات | لوحة هسدو' };

export default async function SettingsPage() {
  const [org, presence, stats, states] = await Promise.all([getOrganization(), getPresence(), getStats(), getStates()]);
  return (
    <>
      <div className="admin-page-head">
        <h1 className="h2">الإعدادات</h1>
      </div>
      <SettingsForm org={org} states={states} presence={presence} stats={stats} />
    </>
  );
}