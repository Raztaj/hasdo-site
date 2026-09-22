import { getProjects, getStates } from '@/lib/data';
import EntityManager from '../../components/entity-manager';
import { projectFields } from '../../components/entities';
import { deleteProject, saveProject } from '../../actions';

export const metadata = { title: 'المشاريع | لوحة هسدو' };

export default async function ProjectsPage() {
  const [projects, states] = await Promise.all([getProjects(), getStates()]);
  return (
    <EntityManager
      title="المشاريع"
      fields={projectFields(states)}
      items={projects as unknown as Record<string, unknown>[]}
      identity="name_ar"
      badge="status"
      save={saveProject}
      remove={deleteProject}
    />
  );
}