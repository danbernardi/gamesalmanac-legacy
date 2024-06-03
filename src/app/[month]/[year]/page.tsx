import { Group, fetchGamesByReleaseDate, groupByDate } from "@/app/lib/data";
import type { Game } from "@/app/lib/types";
import { Suspense } from "react";

export default async function Page({ params }: { params: { month: string; year: string; } }) {
  const { month, year } = params;
  const games = await fetchGamesByReleaseDate(month, year);
  const groupedGames: Group = groupByDate(games);

  if (!games) {
    return <p>No data</p>
  }

  return (
    <main>
      <Suspense fallback={<p>loading...</p>}>
          {Object.keys(groupedGames)?.map((isoDate: string) => {
            const entry = groupedGames[isoDate];

            return (
              <div key={isoDate}>
                <h3 className="mb-3 font-bold sticky top-0 bg-black">{new Date(isoDate).toLocaleDateString('en')}</h3>

                <ul className="rounded bg-gray-900 px-6 pb-6 mb-8">
                  {entry.games.map((game: Game) => (
                    <li key={game.id} className="pt-6">
                      {game.name}<br />
                      {game?.platforms?.map(plat => plat?.abbreviation).join(', ')}<br />
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
      </Suspense>
    </main>
  )
};
