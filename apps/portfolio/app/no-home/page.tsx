import { Rust404 } from "@components/rust-404";
import { Rust404Instructions } from "@components/rust-404-instructions";
import { H1, P } from "@ui/typography";

export default function NotFound() {
  return (
    <main
      className={"space-y-2 flex-1 flex flex-col items-center justify-center"}
    >
      <H1>404, Nothing here...</H1>
      <P className={"text-center max-w-[48ch]"}>
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
