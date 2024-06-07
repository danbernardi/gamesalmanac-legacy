import { Group, fetchGamesByReleaseDate, groupByDate } from "@/lib/data";
import ReleaseDateCards from "@/components/dashboard/release-date-cards";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader } from "@/components/ui/loader";

interface PageProps {
  params: { month: number; year: string; };
  searchParams: Record<string, string>;
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
      <ReleaseDateCards groupedGames={groupedGames} />
    </main>
  )
};
