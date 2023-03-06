import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { FC, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import { Model as Guy, ActionName } from "./guy";
import { easing } from "maath";
import { useStore } from "@3d/store";

const last = new Vector3();
export const Person: FC = () => {
  const { fade, smoothTime } = useControls("Animation", {
    fade: 0.2,
    smoothTime: 1,
  });

  const target = useStore((state) => state.target);
  const [action, setAction] = useState<ActionName>("Idle");
  const guy = useRef<Group>(null);
  const [direction] = useState(() => new Vector3());
  const angle = useRef(0);

  useFrame((_, delta) => {
    if (!guy.current) return;

    // move the guy towards the target
    last.copy(guy.current.position);
    easing.damp3(guy.current.position, target, smoothTime, delta, 9);

    const vel = last.sub(guy.current.position).length() / delta;
    if (vel > 4) {
      setAction("Run");
    } else if (vel > 1) {
      setAction("Walk");
    } else {
      setAction("Idle");
    }

    // also update facing direction
    const p = guy.current.position;

    direction.set(target.x - p.x, 0, target.z - p.z).normalize();
    angle.current = Math.atan2(direction.x, direction.z);
    /* angle.current = Math.asin(direction.z); */

    easing.dampAngle(
      guy.current.rotation,
      "y",
      angle.current,
      smoothTime / 4,
      delta
    );
  });

  return <Guy ref={guy} fade={fade} action={action} />;
};
