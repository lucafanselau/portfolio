import { Header } from "@components/header";
import { FullPageGradient } from "@components/random";
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
        <FullPageGradient />
      </body>
    </html>
  );
}
