export const CLIENT_ID: string | undefined = process.env.TWITCH_CLIENT_ID;
export const SECRET: string | undefined = process.env.TWITCH_CLIENT_SECRET;
export const ACCESS_TOKEN: string | undefined = process.env.TWITCH_ACCESS_TOKEN;
export const RAWG_API_KEY: string | undefined = process.env.RAWG_API_KEY;

// export const PLATFORMS = {
//   187: 'PS5',
//   186: 'Series X',
//   7: 'Switch',
//   4: 'PC',
// };

export const PLATFORMS = {
  167: 'PS5',
  169: 'Series X',
  130: 'Switch',
  // 6: 'PC',
};

export const MONTHS = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
};

export const CATEGORIES = {
  0: 'main_game',
  1: 'dlc_addon',
  2: 'expansion',
  3: 'bundle',
  4: 'standalone_expansion',
  5: 'mod',
  6: 'episode',
  7: 'season',
  8: 'remake',
  9: 'remaster',
  10: 'expanded_game',
  11: 'port',
  12: 'fork',
  13: 'pack',
  14: 'update',
};
