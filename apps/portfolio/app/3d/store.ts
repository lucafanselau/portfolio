import { Vector3 } from "three";
import { create } from "zustand";

type Store = {
  target: Vector3;
};

export const useStore = create<Store>((set, get) => ({
  target: new Vector3(),
}));
