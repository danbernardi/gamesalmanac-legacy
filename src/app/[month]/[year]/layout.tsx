import SideNav from '@/app/ui/dashboard/sidenav';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-x-6 grid-cols-[1fr,3fr] max-w-[1440px] mx-auto px-10">
      <div>
        <SideNav />
      </div>
      <div className="py-6">{children}</div>
    </div>
  );
}
