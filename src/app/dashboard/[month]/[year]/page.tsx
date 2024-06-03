import { fetchGamesByReleaseDate } from "@/app/lib/data";
import type { Game } from "@/app/lib/types";
import { formatDate } from "@/app/lib/utils";

export default async function Page({ params }: { params: { month: string; year: string; } }) {
  const { month, year } = params;
  const games = await fetchGamesByReleaseDate(month, year);

  return (
    <main>      
      <ul>
        {games.results.map((entry: Game) => (
          <li key={entry.id}>
            {entry.name}<br />
            {formatDate(entry?.released)}<br />
            {entry?.platforms?.map(plat => plat.platform.name).join(', ')}<br /><br />
          </li>
        ))}
      </ul>
    </main>
  )
};
