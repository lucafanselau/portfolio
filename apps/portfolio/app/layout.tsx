import { Header } from "@components/header";
import { cn } from "@ui/utils";
import { Inter, Roboto_Mono } from "next/font/google";
import type { Metadata } from "next/types";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

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
    <html
      lang="en"
      className={cn(inter.variable, roboto.variable, "fullscreen h-full")}
    >
      <body
        className={
          "flex h-full w-screen justify-center bg-background pb-[env(safe-area-inset-bottom)] font-sans text-foreground"
        }
      >
        {/* Main Column */}
        <div className={"container flex h-full flex-1 flex-col space-y-2 p-4"}>
          <Header />
          {children}
        </div>
        <div
          className={
            "absolute left-0 top-0 -z-10 h-full w-full overflow-hidden"
          }
        >
          <span
            className={
              "absolute -right-[200px] top-16 h-[85vh] w-[400px] rotate-[6deg] rounded-full bg-gradient-to-b from-green-300 via-cyan-600 to-blue-500 opacity-80 blur-3xl filter"
            }
          />
        </div>
      </body>
    </html>
  );
}
