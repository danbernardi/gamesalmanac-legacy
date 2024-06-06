'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Filters } from '@/app/lib/types';
import PlatformFiltersForm from "./platform-filters-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DEFAULT_PLATFORMS } from "@/app/lib/constants";

const filtersInitialState: Filters = {
  platforms: DEFAULT_PLATFORMS,
};

const convertToArr = (str: string): number[] => {
  return str.split('-').map(item => Number(item));
}

export default function Filters() {
  const searchParams = useSearchParams();
  let initialFilters = filtersInitialState;
  if (searchParams.size) {
    const paramsObj = Object.fromEntries(searchParams);
    Object.keys(paramsObj).forEach(key => {
      if (paramsObj[key].includes('-')) {
        // Convert dash separated string to array
        const formattedParams: Array<number> = convertToArr(paramsObj[key]);
        // @ts-expect-error ts(2322) - cannot coerce searchParam type into Filters type
        paramsObj[key] = formattedParams;
      } else {
        // @ts-expect-error ts(2322) - cannot coerce searchParam type into Filters type
        paramsObj[key] = [Number(paramsObj[key])];
      }
    })

    // @ts-expect-error ts(2741) - cannot coerce searchParam type into Filters type
    initialFilters = paramsObj;
  }

  const pathname = usePathname();
  const { replace } = useRouter();
  const [filters, setFilters] = useState<Filters>(initialFilters)

  const onSubmit = () => {
    const params = new URLSearchParams(searchParams);

    Object.keys(filters).forEach((key: string) => {
      // @ts-expect-error ts(7053) - cannot coerce searchParam type into Filters type
      if (filters[key] !== params.get(key)) {
        // @ts-expect-error ts(7053) - cannot coerce searchParam type into Filters type
        params.set(key, `${filters[key].join('-')}`)
      };
    })

    replace(`${pathname}?${params.toString()}`);
  }

  const onPlatformCheck = (id: number) => {
    const newCheckedPlatforms = [...filters.platforms];
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

  return (
    <div className="flex h-full flex-col mt-3">
      <Card className="sticky top-3">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <PlatformFiltersForm
            filters={filters}
            onPlatformCheck={onPlatformCheck}
            onSubmit={onSubmit}
            disableBtn={JSON.stringify(filters.platforms) === JSON.stringify(convertToArr(searchParams.get('platforms') || ''))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
