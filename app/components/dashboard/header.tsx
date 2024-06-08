import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import SearchForm from "./search-form";

export default function Header() {
  return (
    <header className="flex flex-col sm:flex-row h-full mt-3 py-3 text-primary-foreground justify-between items-center">
      <Image
        className="w-[200px] md:w-[300px]"
        src="/gamesalmanac_logo.svg"
        alt="Games Almanac"
        width={300}
        height={32}
      />

      <SearchForm />
    </header>
  );
}
