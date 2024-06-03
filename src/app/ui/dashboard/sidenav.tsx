'use client';

import { MONTHS } from "@/app/lib/constants";
import clsx from 'clsx';
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = Object.values(MONTHS).map((month) => ({
  name: month, href: `/${month.toLowerCase()}/2024`
}));

links.push({
  name: 'TBD',
  href: `/tbd/2024`,
});

export default function SideNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col px-3 md:px-2">
      <ul className="sticky top-0 py-6">
        {links.map((link) => (
          <li key={link.href} className="mb-3">
            <Link href={link.href} className={clsx(
              {
                'text-gray-50': pathname !== link.href,
                'font-bold text-blue-50': pathname === link.href
              }
              )}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
