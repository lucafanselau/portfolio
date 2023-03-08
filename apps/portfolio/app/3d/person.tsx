import { useFrame, useThree } from "@react-three/fiber";
import { Box, Html } from "@react-three/drei";
import { useControls, folder } from "leva";
import { FC, useRef, useState } from "react";
import { Box3, Group, Vector3 } from "three";
import { Model as Guy, ActionName } from "./guy";
import { easing } from "maath";
import { useStore } from "@3d/store";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils";
import { H1, P } from "@ui/typography";

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
  const [open, setOpen] = useState(false);
  const guy = useRef<Group>(null);
  const model = useRef<Group>(null);
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
        setOpen(false);
        setAction(newAction);
      }
    }
    // maybe transition to Wave
    if (lastIdle.current && clock.getElapsedTime() - lastIdle.current > 2) {
      setAction("Wave");
      setOpen(true);
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

  /* console.log(
   *   model.current &&
   *     new Box3().setFromObject(model?.current).getSize(new Vector3())
   * ); */

  return (
    <group ref={guy}>
      <Guy fade={fade} action={action} ref={model} />
      <Html position={[0, 3.8, 0]} center>
        <div className={"relative"}>
          {/* <div className={"absolute -inset-2 bg-red-500 rounded-full"} /> */}
          <Card
            data-state={open ? "open" : "closed"}
            className={cn(
              "w-[48ch] p-8",
              "absolute bottom-0 left-0 -translate-x-1/2 ",
              "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out data-[state=closed]:opacity-0"
            )}
          >
            <H1>
              Hello, I Am{" "}
              <span
                className={cn(
                  "animate-loop bg-[length:400%_400%] text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-green-300 to-blue-500"
                )}
              >
                Luca
              </span>
            </H1>
            <P>A software developer from Germany 🇩🇪</P>
          </Card>
        </div>
      </Html>
    </group>
  );
};
