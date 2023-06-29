import { useFrame } from "@react-three/fiber";
import { Object3D, Vector3 } from "three";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { easing } from "maath";

type Transition<T = unknown> = {
  resolve: (value: T) => void;
  id: string;
  // a callback that returns true if the transition is still ongoing
  cb: (delta: number) => boolean;
};

const useTransitionStore = create<{
  transitions: Transition<any>[];
  add: (transition: Transition<any>) => void;
  remove: (id: string) => void;
}>()(
  subscribeWithSelector((set) => ({
    transitions: [],
    add: (transition: Transition) =>
      set((state) => ({ transitions: [...state.transitions, transition] })),
    remove: (id: string) =>
      set((state) => ({
        transitions: state.transitions.filter((t) => t.id !== id),
      })),
  }))
);

export const defaultTransitionConfig = {
  smoothTime: 0.5,
  maxSpeed: 11,
  eps: 1e-2,
};

export const createTransition = <T = unknown>(cb: Transition["cb"]) => {
  let resolve: (value: T) => void = () => {};
  const promise = new Promise<T>((r) => (resolve = r));
  const transition: Transition<T> = { resolve, cb, id: crypto.randomUUID() };
  useTransitionStore.getState().add(transition);
  return promise;
};

export const useTransitions = () => {
  return useFrame((_, delta) => {
    const { transitions, remove } = useTransitionStore.getState();
    transitions.forEach(({ cb, resolve, id }) => {
      if (!cb(delta)) {
        remove(id);
        resolve(true);
      }
    });
  });
};

export const transitionVector3 = async (vector: Vector3, target: Vector3) => {
  await createTransition((delta) => {
    const { smoothTime, maxSpeed, eps } = defaultTransitionConfig;

    const result = easing.damp3(
      vector,
      target,
      smoothTime,
      delta,
      maxSpeed,
      undefined,
      eps
    );

    console.log("transitioning", vector, target, result);

    return result;
  });
};

// export const useHasTransition = () =>
//   useTransitionStore((state) => state.transitions.length > 0);
