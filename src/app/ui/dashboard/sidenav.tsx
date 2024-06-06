'use client';

import { MONTHS } from "@/app/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useParams, useSearchParams } from "next/navigation";

const links = (searchParams: URLSearchParams) => Object.keys(MONTHS).map((month: string) => {
  const name = MONTHS[parseInt(month)];
  return {
    name,
    path: `/${month}/2024`,
    href: `/${month}/2024?${searchParams.toString()}`,
  }
});

export default function SideNav() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { year } = useParams();

  return (
    <div className="flex h-full flex-col mt-3">
      <Card className="sticky top-3">
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
    </div>
  );
}
