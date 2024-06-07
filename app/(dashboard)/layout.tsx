import Filters from '@/components/dashboard/filters';
import Header from '@/components/dashboard/header';
import SideNav from '@/components/dashboard/sidenav';
import { Suspense } from 'react';
 
export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 z-10 relative">
      <Header />
      <div className="grid gap-x-3 md:grid-cols-[240px,1fr,240px] xl:grid-cols-[300px,1fr,300px]">
        <Suspense>
          <SideNav />
        </Suspense>
        <div className="pt-3 d:py-3">{children}</div>
        <Suspense>
          <Filters />
        </Suspense>
      </div>
    </div>
  );
}
