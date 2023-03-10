import { useStore } from "@3d/store";
import { Button } from "@ui/button";
import { H1, P } from "@ui/typography";
import Link from "next/link";
import { Fragment } from "react";

export const StartActionButton = () => {
  const handleStartClick = () => {
    useStore.getState().setState("explore");
  };
  return (
    <Button className={"px-8 pointer-events-auto"} onClick={handleStartClick}>
      Start
    </Button>
  );
};
export const StartBubbleContent = {
  header: (
    <Fragment>
      <H1>
        Hi There, I Am <span className={"text-animation"}>Luca</span>
      </H1>
      <P color={"lighter"}>Software Engineer, 22 years, from 🇩🇪</P>
    </Fragment>
  ),
  content: (
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
  action: <StartActionButton />,
};
