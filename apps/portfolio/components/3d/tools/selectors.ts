// Some helpers for using the global store together with the ui

import { Store } from "@3d/store";

export const isSlideOpen = (state: Store) => {
  return state.ui.mode === "slide";
};
export const isFocusPanelOpen = (state: Store) => {
  return state.ui.mode === "focus";
};
