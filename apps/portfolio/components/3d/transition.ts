import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import type { Vector3 } from "three";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

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
  maxSpeed: 25,
  eps: 1e-5,
};

export const createTransition = <T = unknown>(cb: Transition["cb"]) => {
  const promise = new Promise<T>((r) => {
    const transition: Transition<T> = {
      resolve: r,
      cb,
      id: crypto.randomUUID(),
    };
    useTransitionStore.getState().add(transition);
  });
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
  }, 0);
};

export const transitionVector3 = async (vector: Vector3, target: Vector3) => {
  await createTransition((delta) => {
    const { smoothTime, maxSpeed, eps } = defaultTransitionConfig;

    const result = easing.damp3(
      vector,
      target,
      0.25,
      delta,
      maxSpeed,
      undefined, // easing.exp,
      eps
    );

    return result;
  });
};
