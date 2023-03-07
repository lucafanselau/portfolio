import { useFrame, useThree } from "@react-three/fiber";
import { useControls, folder } from "leva";
import { FC, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import { Model as Guy, ActionName } from "./guy";
import { easing } from "maath";
import { useStore } from "@3d/store";

const getAction = (velocity: number): ActionName => {
  if (velocity > 4) return "Run";
  else if (velocity > 0.3) return "Walk";
  else return "Idle";
};

const rotationThreshold = 0.1;

const last = new Vector3();
export const Person: FC = () => {
  const fade = useControls("Fade", {
    Idle: 0.2,
    Wave: 0.2,
    Walk: 0.2,
    Run: 0.2,
  });
  const { smoothTime, maxSpeed } = useControls("Animation", {
    smoothTime: 1,
    maxSpeed: 10,
  });

  const target = useStore((state) => state.target);
  const camera = useThree((s) => s.camera);
  const [action, setAction] = useState<ActionName>("Idle");
  const guy = useRef<Group>(null);
  const [direction] = useState(() => new Vector3());
  const angle = useRef(0);
  const lastIdle = useRef<number | undefined>();

  useFrame(({ clock }, delta) => {
    if (!guy.current) return;

    // move the guy towards the target
    last.copy(guy.current.position);
    easing.damp3(guy.current.position, target, smoothTime, delta, maxSpeed);

    const vel = last.sub(guy.current.position).length() / delta;
    const distance = guy.current.position.distanceTo(target);
    const newAction = getAction(vel);
    if (newAction !== action) {
      if (newAction === "Idle") {
        if (action !== "Wave") {
          lastIdle.current = clock.getElapsedTime();
          setAction(newAction);
        }
      } else {
        lastIdle.current = undefined;
        setAction(newAction);
      }
    }
    // maybe transition to Wave
    if (lastIdle.current && clock.getElapsedTime() - lastIdle.current > 2) {
      setAction("Wave");
      lastIdle.current = undefined;
    }

    // if distance is below threshold, rotate towards camera position
    if (distance < rotationThreshold) {
      direction.copy(camera.position).sub(guy.current.position).normalize();
      angle.current = Math.atan2(direction.x, direction.z);
    } else {
      // also update facing direction
      const p = guy.current.position;

      direction.set(target.x - p.x, 0, target.z - p.z);
      angle.current = Math.atan2(direction.x, direction.z);
    }

    /* angle.current = Math.asin(direction.z); */

    easing.dampAngle(
      guy.current.rotation,
      "y",
      angle.current,
      smoothTime / 2,
      delta
    );
  });

  return <Guy ref={guy} fade={fade} action={action} />;
};
