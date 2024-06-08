'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Filters } from '@/lib/types';
import PlatformFiltersForm from "./platform-filters-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DEFAULT_PLATFORMS } from "@/lib/constants";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const filtersInitialState: Filters = {
  platforms: DEFAULT_PLATFORMS
};

const convertToArr = (str: string): number[] => {
  return str.split('-').map(item => Number(item));
}

const convertParamsToArr = (params: Record<string, string>): Record<string, number[]> => {
  let paramsObj = params as unknown as Record<string, number[]>;
  Object.keys(params).forEach(key => {
    if (params[key].includes('-')) {
      // Convert dash separated string to array
      const formattedParams: number[] = convertToArr(params[key]);
      paramsObj[key] = formattedParams;
    } else {
      paramsObj[key] = paramsObj[key] ? [Number(paramsObj[key])] : [];
    }
  });

  return paramsObj;
}

export default function Filters() {
  const searchParams = useSearchParams();
  let initialFilters = filtersInitialState;
  if (searchParams.size) {
    const paramsObj: Record<string, string> = Object.fromEntries(searchParams);
    initialFilters = convertParamsToArr(paramsObj) as unknown as Filters;
  }

  const pathname = usePathname();
  const { replace } = useRouter();
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const onSubmit = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('ids');
    params.delete('query');

    Object.keys(filters).forEach((key: string) => {
      if (JSON.stringify(filters[key]) !== params.get(key)) {
        params.set(key, `${filters[key].join('-')}`)
      };
    })

    replace(`${pathname}?${params.toString()}`);
  }

  const onPlatformCheck = (id: number) => {
    const newCheckedPlatforms = filters.platforms ? [...filters.platforms] : [];
    if (newCheckedPlatforms.includes(id)) {
      newCheckedPlatforms.splice(filters.platforms.indexOf(id), 1)
    } else {
      newCheckedPlatforms.push(id);
    }

    setFilters({
      ...filters,
      platforms: newCheckedPlatforms
    });
  }

  const disableBtn = JSON.stringify(filters.platforms) === JSON.stringify(convertToArr(searchParams.get('platforms') || ''));

  const isActive = !['/search', '/favorites'].includes(pathname);

  return (
    <div
      className={cn(
        'flex md:h-full flex-col md:mt-3 mb-6',
        { 'pointer-events-none opacity-50': !isActive }
      )}
    >
      <Card className="sticky top-3">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <PlatformFiltersForm
            filters={filters}
            onPlatformCheck={onPlatformCheck}
          />

          <Button className="w-full mt-6" variant="brand" onClick={onSubmit} size="sm" disabled={disableBtn}>
            Update filters
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
