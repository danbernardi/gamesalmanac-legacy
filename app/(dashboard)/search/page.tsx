import { Group, fetchGamesBySearch, groupByDate, mungeData } from "@/lib/data";
import ReleaseDateCards from "@/components/dashboard/release-date-cards";
import NoData from "@/components/dashboard/no-data";

interface PageProps {
  params: { month: number; year: string; };
  searchParams: Record<string, string>;
}

export default async function Page({ searchParams }: PageProps) {
  const games = await fetchGamesBySearch(searchParams?.query);

  if (!games.length) {
    return (
      <NoData message="There are no matches for your search term. Please try again." />
    );
  };

  const groupedGames: Group = groupByDate(mungeData(games), true);

  return (
    <main>
      <ReleaseDateCards groupedGames={groupedGames} />
    </main>
  )
};
