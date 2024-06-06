export interface Game {
  id: number;
  name: string;
  slug: string;
  platforms: Platform[];
  first_release_date: number;
  category: number;
  cover: {
    id: number;
    width: number;
    height: number;
    url: string;
  }
};

export interface Platform {
  id: number;
  abbreviation: string;
  name: string;
  alternative_name: string;
};

export interface Filters {
  platforms: number[]
};
