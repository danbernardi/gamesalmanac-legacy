'use client';

import { Search, X } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';

export default function SearchForm () {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState<string>(searchParams.get('query') || '');
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.delete('ids');
    params.delete('platforms');

    params.set('query', query);
    router.push(`/search?${params.toString()}`);
  };

  const clearQuery = (refocus: boolean = false) => {
    setQuery('');
    if (refocus && inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    if (!['/search'].includes(pathname)) {
      clearQuery();
    }
  }, [pathname]);

  return (
    <form className="w-full flex gap-2 sm:ml-4 sm:max-w-[500px] sm:mt-0 mt-6" onSubmit={handleSubmit}>
      <div className="relative w-full">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <Input
          className="block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 text-card-foreground pr-11"
          placeholder="Search for a game"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          value={query || ''}
          ref={inputRef}
        />
        <Search className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        {query && (
          <Button
            variant="ghost"
            className="absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" animate={false}
            onClick={() => clearQuery(true)}
          >
            <X /> Clear
          </Button>
        )}
      </div>
      <Button variant="default" asChild>
        <input type="submit" value="Search" />
      </Button>
    </form>
  )
}
