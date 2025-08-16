import Image from 'next/image';
import SearchForm from "./search-form";
import UserMenu from "./user-menu";
import { Suspense } from "react";
import Link from "next/link";

export default function Header() {
  const now = new Date();

  return (
    <header className="flex flex-col sm:flex-row h-full mt-3 pt-3 md:py-3 text-primary-foreground justify-between sm:items-center">
      <div className="flex justify-between gap-4">
        <Link href={`/${now.getMonth() + 1}/${now.getFullYear()}`}>
          <Image
            className="w-[240px] lg:w-[300px]"
            src="/gamesalmanac_logo.svg"
            alt="Games Almanac"
            width={300}
            height={32}
            priority
          />
        </Link>
        <div className="sm:hidden inline"><UserMenu /></div>
      </div>
      <Suspense fallback={(<></>)}>
        <SearchForm />
      </Suspense>  
      <div className="hidden sm:inline"><UserMenu /></div>
    </header>
  );
}
