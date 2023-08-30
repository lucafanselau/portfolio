import { inter, roboto } from "@app/fonts";
import "@app/globals.css";
import { Header } from "@components/header";
import { FullPageGradient } from "@components/random";
import { cn } from "@ui/utils";

export { metadata } from "@app/metadata";

export default function StaticLandingpage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(inter.variable, roboto.variable, "min-h-[100%] ")}
    >
      <body
        className={
          "flex h-full min-h-[100vh] w-full justify-center bg-background font-sans text-foreground relative"
        }
      >
        {/* Main Column */}
        <div className={"container flex h-full flex-1 flex-col space-y-4 p-4"}>
          <Header />
          {children}
        </div>
        <FullPageGradient />
      </body>
    </html>
  );
}
