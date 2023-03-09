import { Button } from "@ui/button";
import { H1, P } from "@ui/typography";
import Link from "next/link";

export const StartBubbleContent = () => {
  const handleStartClick = () => {
    // TODO: start the story
  };
  return (
    <>
      <H1>
        Hi There, I Am <span className={"text-animation"}>Luca</span>
      </H1>
      <P color={"lighter"}>Software Engineer, 22 years, from 🇩🇪</P>
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
      <P>
        Just click anywhere on the ground and the little version of me will run
        towards it
      </P>
      <div className={"flex justify-end"}>
        <Button className={"px-8"} onClick={handleStartClick}>
          Start
        </Button>
      </div>
    </>
  );
};
