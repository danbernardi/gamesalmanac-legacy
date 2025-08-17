'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface ScrollToTodayProps {
  month: string;
  year: string;
}

export default function ScrollToToday({ month, year }: ScrollToTodayProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  useEffect(() => {
    const scrollToToday = () => {
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      
      // Only scroll if we have the scrollToToday parameter and we're viewing the current month/year
      const shouldScroll = searchParams.get('scrollToToday') === 'true' &&
                          parseInt(month) === currentMonth && 
                          parseInt(year) === currentYear;
            
      if (shouldScroll) {
        const todayId = `${now.getMonth()}-${now.getDate()}-${now.getFullYear()}`;
        let element = document.getElementById(todayId);

        // If today's date doesn't exist, find the next available date
        if (!element) {
          const allDateElements = document.querySelectorAll('[id*="-"]');
          const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          
          let nextElement = null;
          let closestDiff = Infinity;
          
          allDateElements.forEach(el => {
            const id = el.id;
            const parts = id.split('-');
            if (parts.length === 3) {
              const elementMonth = parseInt(parts[0]);
              const elementDay = parseInt(parts[1]);
              const elementYear = parseInt(parts[2]);
              
              const elementDate = new Date(elementYear, elementMonth, elementDay);
              const diff = elementDate.getTime() - currentDate.getTime();
              
              // Only consider dates on or after today
              if (diff >= 0 && diff < closestDiff) {
                closestDiff = diff;
                nextElement = el;
              }
            }
          });
          
          element = nextElement;
        }

        console.log(element);
        
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
        
        // Clean up the URL parameter after scrolling
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('scrollToToday');
        const newUrl = `/${month}/${year}${newSearchParams.toString() ? '?' + newSearchParams.toString() : ''}`;
        router.replace(newUrl, { scroll: false });
      }
    };

    // Small delay to ensure the DOM is fully rendered
    const timer = setTimeout(scrollToToday, 300);
    
    return () => clearTimeout(timer);
  }, [month, year]);

  return null;
}