import { isSome } from "@components/utils";
import { RefCallback, RefObject } from "react";
import { Group } from "three";
import { create } from "zustand";

interface Store {
  slots: Map<string, Group>;
  setSlot: (name: string, slot: Group) => void;
  removeSlot: (name: string) => void;
}

export const useSlots = create<Store>((set, get) => ({
  slots: new Map<string, Group>(),

  setSlot: (name: string, slot: Group) => {
    const slots = get().slots;
    slots.set(name, slot);
    set({ slots });
  },
  removeSlot: (name: string) => {
    const slots = get().slots;
    slots.delete(name);
    set({ slots });
  },
}));

const setSelector = (s: Store) => s.setSlot;
const removeSelector = (s: Store) => s.removeSlot;

export const useSlotRef = (name: string): RefCallback<Group> => {
  const setSlot = useSlots(setSelector);
  const removeSlot = useSlots(removeSelector);
  return (group: Group | null) => {
    if (isSome(group)) {
      setSlot(name, group);
    } else {
      removeSlot(name);
    }
  };
};
