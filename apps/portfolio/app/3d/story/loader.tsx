import { constants } from "@3d/constants";
import { useStore } from "@3d/store";
import { Html } from "@react-three/drei";
import { useMemo } from "react";
import { match } from "ts-pattern";
import { ExploreBubbleContent, ExploreSchool } from "./explore";
import { SpeechBubble } from "./speech-bubble";
import { StartBubbleContent } from "./start";

const { approximateHeight } = constants.guy;

export const BubbleLoader = () => {
  const state = useStore((s) => s.state);
  const interaction = useStore((s) => s.world.interaction);
  const open = useStore(
    (s) =>
      s.showCard &&
      (s.character.state === "idle" || s.character.state === "greet")
  );

  const content = useMemo(
    () =>
      match(state)
        .with("start", () => StartBubbleContent)
        .with("explore", () =>
          match(interaction)
            .with("school", () => ExploreSchool)
            .with(undefined, () => ExploreBubbleContent)
            .exhaustive()
        )
        .with("top-level", () => StartBubbleContent)
        .exhaustive(),
    [state, interaction]
  );

  return (
    <Html position={[0, approximateHeight, 0]}>
      <SpeechBubble open={open} {...content} />
    </Html>
  );
};
