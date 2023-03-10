import { useStore } from "@3d/store";
import { Html } from "@react-three/drei";
import { match } from "ts-pattern";
import { ExploreBubbleContent } from "./explore";
import { SpeechBubble } from "./speech-bubble";
import { StartBubbleContent } from "./start";

export const BubbleLoader = () => {
  const state = useStore((s) => s.state);
  const open = useStore((s) => s.character.state === "long-idle");

  const content = match(state)
    .with("start", () => StartBubbleContent)
    .with("explore", () => ExploreBubbleContent)
    .with("top-level", () => StartBubbleContent)
    .exhaustive();

  return (
    <Html position={[0, 3.8, 0]} center>
      <SpeechBubble open={open} {...content} />
    </Html>
  );
};
