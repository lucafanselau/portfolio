import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import type { FC } from "react";
import { ExploreInteractions } from "./interactions";
import { ExplorePlane } from "./overlay";
import { ExploreTarget } from "./target";

export const ExploreModule: FC = () => {
  const open = useStore(...selectors.state.explore);
  if (!open) return null;

  return (
    <>
      <ExplorePlane />
      <ExploreTarget />
      <ExploreInteractions />
    </>
  );
};
