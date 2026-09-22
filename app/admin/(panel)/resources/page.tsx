import { getResources } from '@/lib/data';
import EntityManager from '../../components/entity-manager';
import { resourceFields } from '../../components/entities';
import { deleteResource, saveResource } from '../../actions';

export const metadata = { title: 'الموارد | لوحة هسدو' };

export default async function ResourcesPage() {
  const resources = await getResources();
  return (
    <EntityManager
      title="الموارد"
      fields={resourceFields()}
      items={resources as unknown as Record<string, unknown>[]}
      identity="title_ar"
      badge="category"
      save={saveResource}
      remove={deleteResource}
    />
  );
}