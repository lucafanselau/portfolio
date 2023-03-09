import { SpeechBubble } from "@3d/speech-bubble";
import { useStore } from "@3d/store";
import { Html } from "@react-three/drei";
import { match } from "ts-pattern";
import { StartBubbleContent } from "./start";

export const BubbleLoader = () => {
  const state = useStore((s) => s.state);
  const open = useStore((s) => s.character.state === "long-idle");
  return (
    <Html position={[0, 3.8, 0]} center>
      <SpeechBubble open={open}>
        {match(state)
          .with("start", () => <StartBubbleContent />)
          .otherwise(() => null)}
      </SpeechBubble>
    </Html>
  );
};
