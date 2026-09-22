import { getPartners } from '@/lib/data';
import EntityManager from '../../components/entity-manager';
import { partnerFields } from '../../components/entities';
import { deletePartner, savePartner } from '../../actions';

export const metadata = { title: 'الشركاء | لوحة هسدو' };

export default async function PartnersPage() {
  const partners = await getPartners();
  return (
    <EntityManager
      title="الشركاء"
      fields={partnerFields()}
      items={partners as unknown as Record<string, unknown>[]}
      identity="name_ar"
      save={savePartner}
      remove={deletePartner}
    />
  );
}