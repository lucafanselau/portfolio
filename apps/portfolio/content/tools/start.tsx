import { ToolsContent } from "./types";
import Link from "next/link";
import { P } from "@ui/typography";

const info = {
  header: [
    <>
      Hi There, I Am <span className={"text-animation"}>Luca</span>
    </>,
    "Software Engineer, 22 years, from 🇩🇪",
  ],
  body: (
    <>
      <P>
        Welcome to my little Universe. This is an interactive experience
        designed as my Portfolio. If you want a more structured overview you can
        checkout the{" "}
        <Link className={"link"} href={"/about"}>
          About
        </Link>{" "}
        page.
      </P>
      <P>
        If you decided to stay here, let's start by exploring the space... It
        still a bit empty here, but that might change later 😉.
      </P>
    </>
  ),
} satisfies ToolsContent;

export const start = {
  info,
};
