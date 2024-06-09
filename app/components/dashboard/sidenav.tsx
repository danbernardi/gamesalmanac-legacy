'use client';

import { MONTHS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SlidersHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Filters from "./filters";
import { useState } from "react";

const links = (searchParams: URLSearchParams) => Object.keys(MONTHS).map((month: string) => {
  const name = MONTHS[parseInt(month)];
  const params = new URLSearchParams(searchParams);
  params.delete('ids');
  params.delete('query');

  const paramStr = `?${params.toString()}`;

  return {
    name,
    path: `/${month}/2024`,
    href: `/${month}/2024${params.size ? paramStr : ''}`,
  }
});

export default function SideNav() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  const linkToFavoritesPage = () => {
    const params = new URLSearchParams(searchParams);
    const favorites = JSON.parse(localStorage.getItem('favorites') || '') || [];
    params.set('ids', favorites.join('-'));
    router.push(`/favorites?${params.toString()}`);
  };

  const triggerLink = (href: string) => {
    if (href === 'favorites') {
      linkToFavoritesPage();
    } else {
      router.push(href);
    }
  };

  const filtersActive = !['/search', '/favorites'].includes(pathname);

  return (
    <div className="flex md:h-full flex-col mt-3">
      <div className="md:sticky md:top-3">
        <Card>
          <CardHeader className="py-3 md:p-6">
            <CardTitle className="flex justify-between items-center">
              2024

              <div className="flex lg:hidden items-center">
                <Popover
                  open={mobileFiltersOpen}
                  onOpenChange={(open) => setMobileFiltersOpen(open)}
                >
                  <PopoverTrigger asChild>
                    <Button variant="link" className="flex items-center p-0" animate={false} disabled={!filtersActive}>
                      <SlidersHorizontal size={16} className="mr-1" />
                      Filters
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" alignOffset={-35} className="p-0">
                    <Filters card={false} onFiltersChange={() => setMobileFiltersOpen(false)} />
                  </PopoverContent>
                </Popover>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="hidden md:block">
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
            </div>
            
            {/* Mobile month select */}
            <div className="flex md:hidden gap-4">
              <Select
                value={links(searchParams)?.find(link => link.path === pathname)?.href || undefined}
                onValueChange={triggerLink}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='favorites'>View favorites</SelectItem>
                  {links(searchParams).map((link) => (
                    <SelectItem key={link.href} value={link.href}>{link.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-3 pt-6 hidden md:block">
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
