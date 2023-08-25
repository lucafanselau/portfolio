import { config } from "@content/config";
import { IconBulb } from "@tabler/icons-react";
import { P } from "@ui/typography";
import Link from "next/link";
import { ToolsContent } from "./types";

const info = {
  header: [
    <>
      Hi There, I am <span className={"text-animation"}>Luca</span>
    </>,
    "Software Engineer, 22 years, from 🇩🇪",
  ],
  body: (
    <>
      <P>
        Welcome to my town, stranger! Its always nice to see new faces. I am
        glad you found your way here! This landingpage is an interactive
        experience designed as my Portfolio. If you are looking at a static
        overview of my portfolio, you can checkout the{" "}
        <Link className={"link"} href={"/about"}>
          About page
        </Link>
        .
      </P>
      <P>
        If you decided to stay here, let's start by exploring the space... It
        still a bit empty here, but that will change very soon. Otherwise you
        can also checkout my social media profiles, which are linked in the
        toolbar.
      </P>
      <P color={"lighter"}>
        If you encounter any issues with the issues with the website, please
        report them to me, either via{" "}
        <Link className={"link"} href={"mailto:" + config.mail}>
          E-Mail
        </Link>
        , or directly in the{" "}
        <Link className={"link"} target={"_blank"} href={config.projectGithub}>
          Github Repository
        </Link>
        . As a fallback you can always checkout the static version of my
        portfolio content on the{" "}
        <Link className={"link"} href={"/about"}>
          About page
        </Link>
      </P>
    </>
  ),
  icon: <IconBulb />,
} satisfies ToolsContent;

export const start = {
  info,
};
