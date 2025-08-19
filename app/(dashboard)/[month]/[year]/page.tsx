import { Group, fetchGamesByReleaseDate, groupByDate } from "@/lib/data";
import ReleaseDateCards from "@/components/dashboard/release-date-cards";
import NoData from "@/components/dashboard/no-data";
import MonthNavigation from "@/components/dashboard/month-navigation";

interface PageProps {
  params: { month: string; year: string; };
  searchParams: Record<string, string>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { month, year } = params;
  const filters = searchParams;
  const games = await fetchGamesByReleaseDate(parseInt(month), year, filters);

  if (!games.length) {
    return (
      <>
        <NoData message="No games were found for the selected time frame & filters." />
        <MonthNavigation month={month} year={year} searchParams={searchParams} />
      </>
    );
  };

  const groupedGames: Group = groupByDate(games);

  return (
    <main>
      <ReleaseDateCards groupedGames={groupedGames} />
      <MonthNavigation month={month} year={year} searchParams={searchParams} />
    </main>
  );
};
