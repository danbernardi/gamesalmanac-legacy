import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import "./globals.css";
import { Providers } from "./providers";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Games Almanac",
  description: "Get the latest information on upcoming video game releases",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
          "font-sans antialiased",
          fontSans.variable
        )}>
          <div
            className="bg-gradient-to-t from-[#41005F] to-[#000E31] dark:to-[#18083A] dark:from-[#330943] fixed min-w-full min-h-full left-0 top-0 z-0"
          />
          <div
            className="bg-[url('/wavey-fingerprint.svg')] fixed min-w-full min-h-full left-0 top-0 opacity-50"
          />
          <Providers>
            {children}
          </Providers>
        </body>
    </html>
  );
}
