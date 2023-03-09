import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { easing } from "maath";
import { RefObject } from "react";
import { Object3D } from "three";

const animSchema = {
  smoothTime: 0.5,
  maxSpeed: 10,
};
// Use to have one object follow another, with easing
export const useRetainedTransform = (
  key: string,
  retained: RefObject<Object3D> | null | undefined,
  original: Object3D | null | undefined,
  fields: ("position" | "rotation")[] = ["position", "rotation"]
) => {
  const parameters = useControls(`${key} easing`, animSchema);

  useFrame((_, delta) => {
    if (!retained || !retained.current || !original) return;
    if (fields.includes("position")) {
      easing.damp3(
        retained.current.position,
        original.position,
        parameters.smoothTime,
        delta,
        parameters.maxSpeed
      );
    }
    if (fields.includes("rotation")) {
      easing.dampE(
        retained.current.rotation,
        original.rotation,
        parameters.smoothTime,
        delta,
        parameters.maxSpeed
      );
    }
  });
};
