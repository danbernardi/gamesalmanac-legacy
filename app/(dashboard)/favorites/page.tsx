import { Group, fetchGamesByFavorite, groupByDate } from "@/lib/data";
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

export default async function Page({ searchParams }: PageProps) {
  const games = await fetchGamesByFavorite(searchParams?.ids);

  if (!games.length) {
    return (
      <Card className="mb-3">
        <CardHeader>
          <CardTitle>
            Games
          </CardTitle>
        </CardHeader>
        <CardContent>
          You have no favorites. Favorite a game by clicking the heart.
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
