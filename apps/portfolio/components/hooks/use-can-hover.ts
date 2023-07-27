import { useMediaQuery } from "./use-media-query";

export const useCanHover = () => {
  return useMediaQuery("(hover: hover)");
};

const matchMedia = window.matchMedia("(hover: hover)");
export const getCanHover = () => {
  return matchMedia.matches;
};
