import { inter, roboto } from "@app/fonts";
import "@app/globals.css";
import { Header } from "@components/header";
import { cn } from "@ui/utils";

export { metadata } from "@app/metadata";

export default function LandingpageLayout({
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
      </body>
    </html>
  );
}
