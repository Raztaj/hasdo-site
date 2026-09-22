import mapData from '@/public/data/sudan-map.json';

export interface MapRegion {
  code: string;
  name_ar: string;
  d: string;
  cx: number;
  cy: number;
}

export interface MapDataset {
  width: number;
  height: number;
  states: MapRegion[];
  localities: MapRegion[];
}

export const MAP_DATASET = mapData as MapDataset;

export const MAP_STATES: MapRegion[] = MAP_DATASET.states;
export const MAP_LOCALITIES: MapRegion[] = MAP_DATASET.localities;
export const MAP_WIDTH = MAP_DATASET.width;
export const MAP_HEIGHT = MAP_DATASET.height;