import 'server-only';

import type {
  Area,
  Locality,
  Organization,
  Partner,
  Project,
  ResourceItem,
  SiteStat,
  State,
  StatePresence,
  Story,
} from './types';
import { isDbConfigured, createClient } from './supabase/server';
import { statesList, localitiesList } from './geo';
import {
  demoProjects,
  demoStories,
  demoResources,
  demoPartners,
  demoPresence,
  demoStats,
  demoAreas,
  demoOrganization,
} from './demo';

/**
 * Data layer: reads from Supabase when configured, otherwise falls back to
 * the demo dataset so the site is always viewable.
 */

export async function getStates(): Promise<State[]> {
  return statesList();
}

export async function getLocalities(): Promise<Locality[]> {
  return localitiesList();
}

export async function getProjects(): Promise<Project[]> {
  if (!isDbConfigured()) return demoProjects;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) {
    console.error('getProjects:', error?.message);
    return demoProjects;
  }
  return data as unknown as Project[];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function getStories(): Promise<Story[]> {
  if (!isDbConfigured()) return demoStories;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .order('published_at', { ascending: false });
  if (error || !data) return demoStories;
  return data as unknown as Story[];
}

export async function getResources(): Promise<ResourceItem[]> {
  if (!isDbConfigured()) return demoResources;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('published_at', { ascending: false });
  if (error || !data) return demoResources;
  return data as unknown as ResourceItem[];
}

export async function getPartners(): Promise<Partner[]> {
  if (!isDbConfigured()) return demoPartners;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('name_ar');
  if (error || !data) return demoPartners;
  return data as unknown as Partner[];
}

export async function getStats(): Promise<SiteStat[]> {
  if (!isDbConfigured()) return demoStats;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_stats')
    .select('*')
    .order('key');
  if (error || !data) return demoStats;
  return data as unknown as SiteStat[];
}

export async function getAreas(): Promise<Area[]> {
  if (!isDbConfigured()) return demoAreas;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('areas')
    .select('*')
    .order('sort_order');
  if (error || !data) return demoAreas;
  return data as unknown as Area[];
}

export async function getOrganization(): Promise<Organization> {
  if (!isDbConfigured()) return demoOrganization;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('organization')
    .select('*')
    .eq('id', 1)
    .maybeSingle();
  if (error || !data) return demoOrganization;
  return data as unknown as Organization;
}

/** حضور المكاتب/مواقع العمل لكل ولاية — يحدد مؤشرات الخريطة */
export async function getPresence(): Promise<StatePresence[]> {
  if (!isDbConfigured()) return demoPresence();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('state_presence')
    .select('*')
    .order('code');
  if (error || !data) return demoPresence();
  return data as unknown as StatePresence[];
}

export function projectsByState(projects: Project[]): Map<string, Project[]> {
  const map = new Map<string, Project[]>();
  for (const p of projects) {
    if (!p.state_code) continue;
    const list = map.get(p.state_code) ?? [];
    list.push(p);
    map.set(p.state_code, list);
  }
  return map;
}