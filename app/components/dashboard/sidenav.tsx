'use client';

import { MONTHS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useParams, useSearchParams, redirect, useRouter } from "next/navigation";

const links = (searchParams: URLSearchParams) => Object.keys(MONTHS).map((month: string) => {
  const name = MONTHS[parseInt(month)];
  const params = new URLSearchParams(searchParams);
  params.delete('ids');

  return {
    name,
    path: `/${month}/2024`,
    href: `/${month}/2024?${params.toString()}`,
  }
});

export default function SideNav() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { year } = useParams();
  const router = useRouter()

  const linkToFavoritesPage = () => {
    const favorites = JSON.parse(localStorage?.getItem('favorites') || '');
    const params = new URLSearchParams(searchParams);
    params.set('ids', favorites.join('-'));
    router.push(`/favorites?${params.toString()}`);
  }

  return (
    <div className="flex h-full flex-col mt-3">
      <div className="sticky top-3">
        <Card>
          <CardHeader>
            <CardTitle>{year}</CardTitle>
          </CardHeader>
          <CardContent>
            {links(searchParams).map((link) => (
              <Button
                key={link.href}
                variant={ pathname === link.path ? 'default' : 'secondary' }
                className="mb-3 w-full justify-start text-semibold"
                asChild
              >
                <Link href={link.href} className={cn(
                  {
                    'text-primary-foreground': pathname === link.path
                  }
                  )}>
                  {link.name}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="mt-3 pt-6">
          <CardContent>
            <Button className="w-full" variant="brand" onClick={linkToFavoritesPage}>
              View favorites
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
