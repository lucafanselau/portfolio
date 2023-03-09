import { H1, P } from "@ui/typography";

export const ExploreBubbleContent = () => {
  return (
    <>
      <H1>
        Let's <span className={"text-animation"}>Explore</span> a bit
      </H1>
      <P color={"lighter"}>You can click on the ground to move me!</P>
      <P>
        This world is filled with locations, that are important to me. You can
        run towards and interact with them to learn more about them.
      </P>
    </>
  );
};
