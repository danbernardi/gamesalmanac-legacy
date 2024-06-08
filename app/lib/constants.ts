export const CLIENT_ID: string | undefined = process.env.TWITCH_CLIENT_ID;
export const SECRET: string | undefined = process.env.TWITCH_CLIENT_SECRET;
export const ACCESS_TOKEN: string | undefined = process.env.TWITCH_ACCESS_TOKEN;
export const RAWG_API_KEY: string | undefined = process.env.RAWG_API_KEY;

export const PLATFORMS: { id: number; name: string; }[] = [
  {
    id: 130,
    name: 'Switch',
  },
  {
    id: 167,
    name: 'PS5',
  },
  {
    id: 169,
    name: 'Series X | S',
  },
  {
    id: 6,
    name: 'PC',
  },
  {
    id: 471,
    name: 'Meta Quest 3',
  },
  {
    id: 390,
    name: 'PSVR2',
  },
];

export const DEFAULT_PLATFORMS: number[] = [130, 167, 169];

export const MONTHS: { [key: number]: string } = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

export const CATEGORIES: { [key: number]: string } = {
  0: 'Main Game',
  1: 'DLC Addon',
  2: 'Expansion',
  3: 'Bundle',
  4: 'Standalone_expansion',
  5: 'Mod',
  6: 'Episode',
  7: 'Season',
  8: 'Remake',
  9: 'Remaster',
  10: 'Expanded Game',
  11: 'Port',
  12: 'Fork',
  13: 'Pack',
  14: 'Update',
};
