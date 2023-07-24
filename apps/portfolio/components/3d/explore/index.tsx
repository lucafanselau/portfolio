import type { FC } from "react";
import { ExploreInteractions } from "./interactions";
import { ExplorePlane } from "./overlay";
import { ExploreTarget } from "./target";

export const ExploreModule: FC = () => {
  return (
    <>
      <ExplorePlane />
      <ExploreTarget />
      <ExploreInteractions />
    </>
  );
};
