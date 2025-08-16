'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getNextMonth, getPreviousMonth, getMonthName } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface MonthNavigationProps {
  month: number;
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
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 40 }}
      viewport={{ once: true, amount: 0, margin: '100px' }}
    >
      <div className="flex justify-between items-center">
        <Link 
          href={`/${previousMonth.month}/${previousMonth.year}${queryPath}`}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Button variant="outline" className="flex items-center gap-2 bg-card/75 border-border/75">
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">
              {getMonthName(previousMonth.month)} {previousMonth.year}
            </span>
            <span className="sm:hidden">Previous</span>
          </Button>
        </Link>

        <div className="text-center">
          <span className="text-sm text-white/75">
            {getMonthName(month)} {year}
          </span>
        </div>

        <Link 
          href={`/${nextMonth.month}/${nextMonth.year}${queryPath}`}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Button variant="outline" className="flex items-center gap-2 bg-card/75 border-border/75">
            <span className="hidden sm:inline">
              {getMonthName(nextMonth.month)} {nextMonth.year}
            </span>
            <span className="sm:hidden">Next</span>
            <ChevronRight size={16} />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}