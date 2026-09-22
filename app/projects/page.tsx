import type { Metadata } from 'next';
import { statesList } from '@/lib/geo';
import { getAreas, getProjects } from '@/lib/data';
import ProjectList from '@/app/components/project-list';
import SudanSilhouette from '@/app/components/sudan-silhouette';

export const metadata: Metadata = { title: 'مشاريعنا' };

export default async function ProjectsPage() {
  const [projects, areas] = await Promise.all([getProjects(), getAreas()]);

  return (
    <main className="page projects-page">
      <section className="state-hero has-wm">
        <SudanSilhouette />
        <div className="container">
          <p className="kicker">المشاريع</p>
          <h1 className="display">مشاريعنا</h1>
          <p className="muted">
            تعرف على المشاريع التي عملت عليها المنظمة والمجتمعات التي عاشت معها التجربة.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ProjectList
            projects={projects}
            states={statesList()}
            areas={areas.map((a) => a.name_ar)}
          />
        </div>
      </section>
    </main>
  );
}