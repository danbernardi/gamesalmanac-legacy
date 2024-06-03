export interface Game {
  id: number;
  name: string;
  slug: string;
  platforms: Platform[];
  first_release_date: number;
};

export interface Platform {
  id: number;
  name: string;
  slug: string;
  abbreviation: string;
};
