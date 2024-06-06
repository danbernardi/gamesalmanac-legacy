import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';

export default function Header() {
  return (
    <header className="flex h-full flex-col mt-3 py-3 text-primary-foreground">
      <Image
        src="/gamesalmanac_logo.svg"
        alt="Games Almanac"
        width={300}
        height={32}
      />
    </header>
  );
}
