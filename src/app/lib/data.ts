import { MONTHS, PLATFORMS, RAWG_API_KEY } from "./constants";
import { Game } from "./types";
// import { Game } from "./types";
// import { convertToProperDate } from "./utils";

const BASE = 'https://api.rawg.io/api';
const PAGE_SIZE = 40;
// const headers = {
//   'Accept': 'application/json',
//   'Client-ID': `${CLIENT_ID}`,
//   'Authorization': `Bearer ${ACCESS_TOKEN}`,
// };

// const LIMIT = 500;

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

const addLeadingZeroToValue = (value: number) => {
  return value <= 9 ? `0${value}` : value;
}

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${addLeadingZeroToValue(date.getMonth() + 1)}-${addLeadingZeroToValue(date.getDate())}`;
}

export async function fetchGamesByReleaseDate(month: string, year: string) {
  const startDate = new Date(`${month} 1 ${year}`);
  const endDate = new Date(`${month} 1 ${year}`);
  endDate.setMonth(startDate.getMonth() + 1);
  endDate.setDate(0);

  try {
    const params = `key=${RAWG_API_KEY}&dates=${formatDate(startDate)},${formatDate(endDate)}&ordering=released&page_size=${PAGE_SIZE}&platforms=${Object.keys(PLATFORMS).join(',')}`;

    console.log(`${BASE}/games?${params}`);
    const response = await fetch(`${BASE}/games?${params}`, {
      method: 'GET'
    });

    return response.json();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch games data.');
  }
}

export function groupGamesByDate(games: Game[]): Group[] {
  return games.reduce((acc: Group[], curr: Game) => {
    const releaseDate = new Date(curr.released);
    const year = `${releaseDate.getFullYear()}`;
    const month = `${releaseDate.getMonth()}`;

    const yearEntry = acc.find(entry => entry.year === year);

    if (yearEntry) {
      const monthEntry = yearEntry.months.find(entry => entry.month === month);
      if (monthEntry) {
        monthEntry.games.push(curr);
      } else {
        yearEntry.months.push({
          month,
          games: [curr]
        });
      };
    } else {
      acc.push({
        year,
        months: [
          {
            month,
            games: [curr],
          }
        ]
      })
    }

    return acc;
  }, []);
};

export interface Group {
  year: string;
  months: {
    month: string;
    games: Game[];
  }[];
};