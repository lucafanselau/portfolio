import { useControls } from "@components/hooks/use-controls";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { RefObject, useEffect } from "react";
import type { Object3D } from "three";

const animSchema = {
  smoothTime: 0.5,
  maxSpeed: 10,
};
// Use to have one object follow another, with easing
export const useRetainedTransform = (
  key: string,
  retained: RefObject<Object3D> | null | undefined,
  original: Object3D | null | undefined,

  fields: ("position" | "rotation")[] = ["position"]
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

const hasClass = (element: HTMLElement, search: string) => {
  if (element.className != null) {
    return element.className.match(new RegExp("(\\s|^)" + search + "(\\s|$)"));
  }
  return false;
};

// prevent scrolling on mobile
export const useFixedMobileScreen = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const move = (evt: TouchEvent) => {
      //In this case, the default behavior is scrolling the body, which
      //would result in an overflow.  Since we don't want that, we preventDefault.
      if (
        evt.target instanceof HTMLElement &&
        hasClass(evt.target, "scroll-enable")
      )
        return;
      evt.preventDefault();
    };

    document.body.addEventListener("touchmove", move, { passive: false });
    return () => {
      document.body.removeEventListener("touchmove", move);
    };
  }, []);
};
