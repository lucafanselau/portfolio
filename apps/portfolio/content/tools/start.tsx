import { config } from "@content/config";
import { IconBulb } from "@tabler/icons-react";
import { P } from "@ui/typography";
import Link from "next/link";
import { ToolsContent } from "./types";

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
        Welcome to my website, I am glad you found your way here! This
        landingpage is an interactive experience designed as my Portfolio. If
        you want a more structured and static overview or if this webpage causes
        trouble with your device, you can checkout the{" "}
        <Link className={"link"} href={"/about"}>
          About
        </Link>{" "}
        page. In the second case I would be happy if you could report the issue
        to me. Either via{" "}
        <Link className={"link"} href={"mailto:" + config.mail}>
          E-Mail
        </Link>
        , or directly in the{" "}
        <Link className={"link"} target={"_blank"} href={config.projectGithub}>
          Github Repository
        </Link>
      </P>
      <P>
        If you decided to stay here, let's start by exploring the space... It
        still a bit empty here, but that will change very soon. Otherwise you
        can also checkout my social media profiles, which are linked in the
        toolbar.
      </P>
    </>
  ),
  icon: <IconBulb />,
} satisfies ToolsContent;

export const start = {
  info,
};
