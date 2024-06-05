import Filters from '@/app/ui/dashboard/filters';
import Header from '@/app/ui/dashboard/header';
import SideNav from '@/app/ui/dashboard/sidenav';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1440px] mx-auto px-10">
      <Header />
      <div className="grid gap-x-3 grid-cols-[300px,1fr,300px]">
        <div>
          <SideNav />
        </div>
        <div className="py-3">{children}</div>
        <div>
          <Filters />
        </div>
      </div>
    </div>
  );
}
