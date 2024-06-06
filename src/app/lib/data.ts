import { ACCESS_TOKEN, CLIENT_ID, DEFAULT_PLATFORMS, MONTHS } from "./constants";
import { Filters, Game } from "./types";

const BASE = 'https://api.igdb.com/v4';
const headers = {
  'Accept': 'application/json',
  'Client-ID': `${CLIENT_ID}`,
  'Authorization': `Bearer ${ACCESS_TOKEN}`,
};

const LIMIT = 500;

export async function fetchGamesByReleaseDate(month: number, year: string, filters?: Filters) {
  const monthStr = MONTHS[month];
  const startDate = new Date(`${monthStr} 1 ${year}`);
  const endDate = new Date(`${monthStr} 1 ${year}`);
  endDate.setMonth(startDate.getMonth() + 1);
  endDate.setDate(0);

  // @ts-expect-error ts(2339)
  const platforms = typeof filters?.platforms === 'string' ? filters.platforms.split('-') : DEFAULT_PLATFORMS;
  const platformFilter = platforms[0] ? `(${platforms.join(', ')})` : null;

  try {
    const response = await fetch(`${BASE}/games`, {
      method: 'POST',
      headers,
      body: `
        fields category,first_release_date,name,platforms.abbreviation,platforms.alternative_name,platforms.name,version_parent,cover.width,cover.height,cover.url,total_rating,rating_count;
        where first_release_date > ${startDate.getTime() / 1000} & first_release_date < ${endDate.getTime() / 1000} & platforms = ${platformFilter} & themes != (42) & version_parent = null & category = (0, 2, 4, 8, 9, 11);
        sort first_release_date asc;
        limit ${LIMIT};
      `
    });

    // Force a 1 second load time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return response.json();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch games data.');
  }
}

export function groupByDate(games: Game[]): Group {
  const groupedData = games.reduce((acc: Group, curr: Game): Group => {
    const releaseDate = new Date(curr.first_release_date * 1000);
    const releaseDateStr = releaseDate.toISOString();

    if (acc[releaseDateStr]) {
      acc[releaseDateStr].games = [
        ...acc[releaseDateStr].games,
        curr,
      ]
    } else {
      acc[releaseDateStr] = {
        games: [curr]
      }
    }
    return acc;
  }, {});

  return groupedData;
};

export interface Group {
  [isoDate: string]: {
    games: Game[];
  };
};