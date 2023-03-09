import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next/types";
import { Header } from "@components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "guythat.codes",
  description: "Portfolio website of Luca Fanselau - Software Engineer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body
        className={
          "relative bg-zinc-100 dark:bg-zinc-700 dark:text-white text-zinc-800 flex justify-center "
        }
      >
        {/* Main Column */}
        <div
          className={
            "min-h-[100vh] flex flex-col max-w-[800px] flex-1 h-full p-4"
          }
        >
          <Header />
          {children}
        </div>
        <div
          className={
            "overflow-hidden absolute w-full h-full top-0 left-0 -z-10"
          }
        >
          <span
            className={
              "absolute top-16 rotate-[6deg] -right-[200px] rounded-full bg-gradient-to-b h-[85vh] w-[400px] from-green-300 to-blue-500 via-cyan-600 opacity-80 blur-3xl filter"
            }
          />
        </div>
      </body>
    </html>
  );
}
