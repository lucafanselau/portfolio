import { Rust404 } from "@components/404/canvas";
import { Rust404Instructions } from "@components/404/instructions";
import { H1, P } from "@ui/typography";

export default function NotFound() {
  return (
    <main
      className={
        "w-full py-8 mx-auto space-y-4 flex-1 flex flex-col items-center justify-start"
      }
    >
      <H1>
        <span className="text-animation">404</span>, Nothing here...
      </H1>
      <P className={"leading-snug text-center max-w-[48ch]"} size="sm">
        The page you are looking for <b>does not exist</b>...
        <br />
        While you are here, why not play a bit. If you want to learn more about
        the game, look below the canvas!
      </P>
      <Rust404 />
      <Rust404Instructions />
    </main>
  );
}
