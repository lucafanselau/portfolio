import { invalidate, useFrame, useThree } from "@react-three/fiber";
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
  smoothTime: 0.2, //0.5,
  maxSpeed: 50,
  eps: 1e-3,
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const createTransition = <T = unknown>(cb: Transition["cb"]) => {
  const promise = new Promise<T>((r) => {
    const transition: Transition<T> = {
      resolve: r,
      cb,
      id: crypto.randomUUID(),
    };
    useTransitionStore.getState().add(transition);
    // and invalidate
    invalidate();
  });
  return promise;
};

export const useTransitions = () => {
  const performance = useThree((state) => state.performance);
  return useFrame((_, delta) => {
    const { transitions, remove } = useTransitionStore.getState();
    transitions.forEach(({ cb, resolve, id }) => {
      if (!cb(delta)) {
        remove(id);
        resolve(true);
      } else {
        // also dispatch a next frame
        invalidate();
        // and notify the performance monitor
        performance.regress();
      }
    });
  }, 0);
};

const maxFrameTime = 1 / 30;

export const transitionVector3 = async (
  vector: Vector3,
  target: Vector3,
  config?: Partial<typeof defaultTransitionConfig>
) => {
  await createTransition((delta) => {
    const { smoothTime, maxSpeed, eps } = {
      ...defaultTransitionConfig,
      ...(config ?? {}),
    };

    const result = easing.damp3(
      vector,
      target,
      smoothTime,
      Math.min(delta, maxFrameTime),
      maxSpeed,
      undefined, // easing.exp,
      eps
    );

    return result;
  });
};
