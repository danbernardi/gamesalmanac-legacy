export interface Game {
  id: number;
  name: string;
  slug: string;
  platforms: Platform[];
  released: string;
  tba: boolean;
  updated: string;
};

export interface Platform {
  platform: {
    id: number;
    name: string;
    slug: string;
  }
};
