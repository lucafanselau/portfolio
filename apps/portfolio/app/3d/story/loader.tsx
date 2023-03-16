import { constants } from "@3d/constants";
import { useStore } from "@3d/store";
import { Html } from "@react-three/drei";
import { match } from "ts-pattern";
import { ExploreBubbleContent } from "./explore";
import { SpeechBubble } from "./speech-bubble";
import { StartBubbleContent } from "./start";

const { approximateHeight } = constants.guy;

export const BubbleLoader = () => {
  const state = useStore((s) => s.state);
  const open = useStore(
    (s) =>
      s.showCard &&
      (s.character.state === "idle" || s.character.state === "greet")
  );

  const content = match(state)
    .with("start", () => StartBubbleContent)
    .with("explore", () => ExploreBubbleContent)
    .with("top-level", () => StartBubbleContent)
    .exhaustive();

  return (
    <Html position={[0, approximateHeight, 0]}>
      <SpeechBubble open={open} {...content} />
    </Html>
  );
};
