import { ACCESS_TOKEN, CLIENT_ID, DEFAULT_PLATFORMS, MONTHS } from "./constants";
import { Filters, Game, GameBySearch } from "./types";

const BASE = 'https://api.igdb.com/v4';
const headers = {
  'Accept': 'application/json',
  'Client-ID': `${CLIENT_ID}`,
  'Authorization': `Bearer ${ACCESS_TOKEN}`,
};

const LIMIT = 500;
const ADULT_THEME = 42;
const DEFAULT_CATEGORIES = [0, 2, 4, 8, 9, 11];

export async function fetchGamesBySearch(query?: string) {
  try {
    const response = await fetch(`${BASE}/search`, {
      method: 'POST',
      headers,
      body: `
        fields game.category,game.first_release_date,game.name,game.platforms.abbreviation,game.platforms.alternative_name,game.platforms.name,game.cover.url;
        search "${query}";
        where game.version_parent = null & game.category = (0, 2, 4, 8, 9, 11) & game.first_release_date != null;
        limit ${LIMIT};
      `
    });

    return response.json();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch games data.');
  }
}

export async function fetchGamesByFavorite(ids?: string) {
  const favorites: number[] = ids?.split('-').map(fav => Number(fav)) || [];
  const favoritesFilter: string | null = favorites.length ? `(${favorites.join(', ')})` : null;

  try {
    const response = await fetch(`${BASE}/games`, {
      method: 'POST',
      headers,
      body: `
        fields category,first_release_date,name,platforms.abbreviation,platforms.alternative_name,platforms.name,cover.url;
        where id = ${favoritesFilter};
        sort first_release_date asc;
        limit ${LIMIT};
      `
    });

    // Force a 1 second load time, this helps the animation look better
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return response.json();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch games data.');
  }
}

export async function fetchGamesByReleaseDate(month: number, year: string, filters?: Record<string, string>) {
  const monthStr: string = MONTHS[month];
  const startDate: Date = new Date(`${monthStr} 1 ${year}`)
  startDate.setUTCHours(0,0,0,0);
  const endDate: Date = new Date(`${monthStr} 1 ${year}`);
  // Set endDate to last day of the month
  endDate.setUTCMonth(startDate.getUTCMonth() + 1);
  endDate.setUTCDate(0);

  const platforms: number[] = typeof filters?.platforms === 'string' ? filters.platforms.split('-').map(plat => Number(plat)) : DEFAULT_PLATFORMS;
  const platformFilter: string | null = platforms.length ? `(${platforms.join(', ')})` : null;

  try {
    const response = await fetch(`${BASE}/games`, {
      method: 'POST',
      headers,
      body: `
        fields category,first_release_date,name,platforms.abbreviation,platforms.alternative_name,platforms.name,cover.url;
        where first_release_date >= ${startDate.getTime() / 1000} & first_release_date <= ${endDate.getTime() / 1000} & platforms = ${platformFilter} & themes != (${ADULT_THEME}) & version_parent = null & category = (${DEFAULT_CATEGORIES.join(', ')});
        sort first_release_date asc;
        limit ${LIMIT};
      `
    });

    // Force a 1 second load time, this helps the animation look better
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return response.json();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch games data.');
  }
}

export function groupByDate(games: Game[], sort: boolean = false): Group {
  let groupedData = games.reduce((acc: Group, curr: Game): Group => {
    const releaseDate = new Date(curr.first_release_date * 1000);
    const releaseDateStr = releaseDate.toISOString();

    if (acc[releaseDateStr]) {
      // If entry for isoDate already exists, add current game to games array
      acc[releaseDateStr].games = [
        ...acc[releaseDateStr].games,
        curr,
      ]
    } else {
      // If entry for isoDate doesn't exist, create it and put current game in the games array
      acc[releaseDateStr] = {
        games: [curr]
      }
    }
    return acc;
  }, {});

  if (sort) {
    const sortedGroupedData = Object.keys(groupedData).sort();
    groupedData = sortedGroupedData.reduce((acc: Group, key: string) => {
      acc[key] = groupedData[key];
      return acc;
    }, {});
  }

  return groupedData;
};

export function mungeData(games: GameBySearch[]): Game[] {
  const mungedData = games.map((entry: GameBySearch) => ({
    ...entry.game,
  }));

  return mungedData;
}

export type Group = Record<string, { games: Game[] }>
