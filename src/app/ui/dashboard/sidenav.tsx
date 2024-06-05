'use client';

import { MONTHS } from "@/app/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

const links = Object.values(MONTHS).map((month) => ({
  name: month, href: `/${month.toLowerCase()}/2024`
}));

links.push({
  name: 'TBD',
  href: `/tbd/2024`,
});

export default function SideNav() {
  const pathname = usePathname();
  const { year } = useParams();

  return (
    <div className="flex h-full flex-col mt-3">
      <Card className="sticky top-3">
        <CardHeader>
          <CardTitle>{year}</CardTitle>
        </CardHeader>
        <CardContent>
          {links.map((link) => (
            <Button
              key={link.href}
              variant={ pathname === link.href ? 'default' : 'secondary' }
              className="mb-3 w-full justify-start"
              asChild
            >
              <Link href={link.href} className={cn(
                {
                  'font-bold': pathname === link.href
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
