import { FC } from "react";
import { ExploreInteractions } from "./interactions";
import { ExploreTarget } from "./target";

export const ExploreModule: FC = () => {
  return (
    <>
      <ExploreTarget />
      <ExploreInteractions />
    </>
  );
};
