import { ACCESS_TOKEN, CLIENT_ID, PLATFORMS } from "./constants";
import { Game } from "./types";
// import { Game } from "./types";
// import { convertToProperDate } from "./utils";

const BASE = 'https://api.igdb.com/v4';
const headers = {
  'Accept': 'application/json',
  'Client-ID': `${CLIENT_ID}`,
  'Authorization': `Bearer ${ACCESS_TOKEN}`,
};

const LIMIT = 500;

// export async function fetchPlatforms() {
//   try {
//     const response = await fetch(`${BASE}/platforms`, {
//       method: 'POST',
//       headers,
//       body: `
//         fields category,abbreviation,name,platform_family,platform_logo.url,slug;
//         where id = (${Object.keys(PLATFORMS).join(', ')});
//         limit ${LIMIT};
//       `,
//     });

//     return response.json();
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch platform data.');
//   }
// }

export async function fetchGamesByReleaseDate(month: string, year: string) {
  const startDate = new Date(`${month} 1 ${year}`);
  const endDate = new Date(`${month} 1 ${year}`);
  endDate.setMonth(startDate.getMonth() + 1);
  endDate.setDate(0);

  console.log(startDate.getTime() / 1000, endDate.getTime() / 1000);

  try {
    const response = await fetch(`${BASE}/games`, {
      method: 'POST',
      headers,
      body: `
        fields category,first_release_date,name,platforms.abbreviation,version_parent;
        where first_release_date > ${startDate.getTime() / 1000} & first_release_date < ${endDate.getTime() / 1000} & platforms = (${Object.keys(PLATFORMS).join(', ')}) & themes != (42) & version_parent = null & category = (0, 2, 4, 8, 9, 11);
        sort first_release_date asc;
        limit ${LIMIT};
      `
    });

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