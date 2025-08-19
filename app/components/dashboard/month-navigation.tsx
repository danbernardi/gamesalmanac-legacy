'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getNextMonth, getPreviousMonth, getMonthName } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MonthNavigationProps {
  month: string;
  year: string;
  searchParams?: Record<string, string>;
}

export default function MonthNavigation({ month, year, searchParams }: MonthNavigationProps) {
  const nextMonth = getNextMonth(month, year);
  const previousMonth = getPreviousMonth(month, year);
  
  // Build query string from search params
  const queryString = searchParams ? new URLSearchParams(searchParams).toString() : '';
  const queryPath = queryString ? `?${queryString}` : '';

  return (
    <div>
      <div className="flex justify-between items-center">
        <Link 
          href={`/${previousMonth.month}/${previousMonth.year}${queryPath}`}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Button variant="outline" className="flex items-center gap-2 bg-card/75 border-border/75">
            <ChevronLeft size={16} />
            <span>
              {getMonthName(String(previousMonth.month))} {previousMonth.year}
            </span>
          </Button>
        </Link>

        <div className="text-center hidden sm:inline">
          <span className="text-sm text-white/75">
            {getMonthName(month)} {year}
          </span>
        </div>

        <Link 
          href={`/${nextMonth.month}/${nextMonth.year}${queryPath}`}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Button variant="outline" className="flex items-center gap-2 bg-card/75 border-border/75">
            <span>
              {getMonthName(String(nextMonth.month))} {nextMonth.year}
            </span>
            <ChevronRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
}