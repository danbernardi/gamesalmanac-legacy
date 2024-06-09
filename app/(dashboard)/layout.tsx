import Filters from '@/components/dashboard/filters';
import Header from '@/components/dashboard/header';
import SideNav from '@/components/dashboard/sidenav';
import ScrollToTopBtn from '@/components/ui/scroll-to-top-btn';
import { Suspense } from 'react';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 z-10 relative">
      <Header />
      <div className="grid gap-x-3 md:grid-cols-[240px,1fr] lg:grid-cols-[240px,1fr,240px] xl:grid-cols-[300px,1fr,300px]">
        <Suspense fallback={<></>}>
          <SideNav />
        </Suspense>
        <div className="pt-3 pb-[65px] lg:py-3">{children}</div>

        <div className="hidden lg:block">
          <Suspense fallback={<></>}>
            <Filters card={true} />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<></>}>
        <ScrollToTopBtn />
      </Suspense>
    </div>
  );
}
