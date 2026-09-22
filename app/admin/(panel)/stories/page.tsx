import { getStates, getStories } from '@/lib/data';
import EntityManager from '../../components/entity-manager';
import { storyFields } from '../../components/entities';
import { deleteStory, saveStory } from '../../actions';

export const metadata = { title: 'القصص والأخبار | لوحة هسدو' };

export default async function StoriesPage() {
  const [stories, states] = await Promise.all([getStories(), getStates()]);
  return (
    <EntityManager
      title="القصص والأخبار"
      fields={storyFields(states)}
      items={stories as unknown as Record<string, unknown>[]}
      identity="title_ar"
      badge="type"
      save={saveStory}
      remove={deleteStory}
    />
  );
}