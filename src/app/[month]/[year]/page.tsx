import { Group, fetchGamesByReleaseDate, groupByDate } from "@/app/lib/data";
import type { Filters, Game } from "@/app/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
import { CATEGORIES } from "@/app/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";

interface PageProps {
  params: { month: number; year: string; };
  searchParams: Filters;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { month, year } = params;
  const filters = searchParams;
  const games = await fetchGamesByReleaseDate(month, year, filters);

  if (!games.length) {
    return (
      <Card className="mb-3">
        <CardHeader>
          <CardTitle>
            Games
          </CardTitle>
        </CardHeader>
        <CardContent>
          No games were found for the selected time frame & filters.
          <div className="flex w-full h-[200px] items-center">
            <Loader variant="pong" theme="dark" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const groupedGames: Group = groupByDate(games);

  return (
    <main>
      {Object.keys(groupedGames)?.map((isoDate: string) => {
        const entry = groupedGames[isoDate];

        const date = new Date(isoDate);

        return (
          <Card key={isoDate} className="mb-3">
            <CardHeader className="top-0 sticky rounded-tl-lg rounded-tr-lg bg-card border-tl border-tr shadow-sm">
              <CardTitle id={`${date.getMonth()}-${date.getDay()}-${date.getFullYear()}`}>
                {date.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {entry.games.map((game: Game) => (
                <div key={game.id} className="py-4 px-6 w-[calc(100%+3rem)] -ml-6 odd:bg-secondary/40 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 overflow-hidden rounded-sm mr-3">
                      {game?.cover?.url ? (
                        <Image
                          width={game.cover.width}
                          height={game.cover.height}
                          src={`https:${game.cover.url}`}
                          alt={`Cover thumbnail for ${game.name}`}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-secondary-foreground/20" />
                      )}
                    </div>
                    <div>
                      <strong className="flex items-center">
                        {game.name}
                      </strong>
                      <span className="text-sm text-foreground/75">
                        {game?.platforms?.map(plat => plat?.abbreviation || plat.alternative_name || plat.name).join(', ')}
                      </span>
                    </div>
                  </div>

                  <Badge variant="outline" className="ml-3">
                    {CATEGORIES[game.category]}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}
    </main>
  )
};
