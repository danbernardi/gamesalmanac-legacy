import { Group, fetchGamesByReleaseDate, groupByDate } from "@/app/lib/data";
import type { Game } from "@/app/lib/types";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
              <Card key={isoDate} className="mb-3">
                <CardHeader className="top-0 sticky rounded-tl-lg rounded-tr-lg bg-card border-tl border-tr shadow-sm">
                  <CardTitle>{new Date(isoDate).toLocaleDateString('en')}</CardTitle>
                </CardHeader>

                <CardContent>
                  {entry.games.map((game: Game) => (
                    <div key={game.id} className="py-3 px-6 w-[calc(100%+3rem)] -ml-6 odd:bg-secondary/80 flex justify-between gap-x-6">
                      <span>{game.name}</span>
                      <span className="text-right">{game?.platforms?.map(plat => plat?.abbreviation).join(', ')}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
      </Suspense>
    </main>
  )
};
