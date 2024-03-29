"use client";

import { useLocalStorage } from "@components/hooks/local-storage";
import type { FC } from "react";
import { useCallback, useEffect, useRef } from "react";

type ThemeType = "dark" | "light";
const THEME_DARK: ThemeType = "dark";
const THEME_LIGHT: ThemeType = "light";

const width = 54;
const widthClass = "w-[54px]";

const state = {
  sun: {
    light: {
      opacity: 1,
    },
    dark: {
      opacity: 0,
    },
  },
  moon: {
    light: {
      opacity: 0,
    },
    dark: {
      opacity: 1,
    },
  },
  handle: {
    light: {
      /* rotate: "0deg",
       * translate: width - 24 + "px", */
      transform: `translateX(${width - 24}px) rotate(0deg) `,
    },
    dark: {
      /* rotate: "90deg",
       * translate: "4px", */
      transform: `translateX(4px) rotate(90deg) `,
    },
  },
} as const;

const delay = 150;
const total = 350;
const options = {
  sun: {
    light: {
      duration: total - delay,
      delay,
    },
    dark: {
      duration: total - delay,
    },
  },
  moon: {
    light: {
      duration: total - delay,
    },
    dark: {
      duration: total - delay,
      delay,
    },
  },
  handle: {
    light: {
      duration: total,
    },
    dark: {
      duration: total,
    },
  },
};

const getInitial = () => {
  if (
    typeof window !== "undefined" &&
    window.matchMedia(`(prefers-color-scheme: ${THEME_DARK})`).matches
  )
    return THEME_DARK;
  else return THEME_LIGHT;
};

const names = ["sun", "moon", "handle"] as const;

const DarkToggle: FC = () => {
  const [mode, setMode] = useLocalStorage("theme", getInitial());

  // const isMounted = useHasMounted();

  useEffect(() => {
    const list = document.documentElement.classList;
    if (mode === THEME_DARK) list.add("dark");
    else list.remove("dark");
  }, [mode]);

  const sun = useRef<HTMLImageElement>(null);
  const moon = useRef<HTMLImageElement>(null);
  const handle = useRef<SVGSVGElement>(null);

  const toggleTheme = useCallback(() => {
    /* const old = fromStorage(); */
    const toggled = mode === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    // Animation
    const el = { sun, moon, handle };
    names.forEach((name) => {
      const e = el[name].current;
      const s = state[name];
      if (e !== undefined && e !== null)
        e.animate([s[mode], s[toggled]], {
          fill: "forwards",
          easing: "ease-in-out",
          ...(options[name][toggled] ?? {}),
        });
    });
    setMode(toggled);
  }, [mode, setMode]);

  return (
    <button
      onClick={toggleTheme}
      className={
        "relative box-content rounded-full border-2 border-accent-foreground " +
        widthClass +
        " h-[28px]"
      }
      aria-label="Dark-/Light-Mode Switch"
    >
      <img
        alt={"sun icon"}
        style={state.sun[mode]}
        ref={sun}
        src={"/sun.svg"}
        className="absolute left-[6px] top-[6px] h-[16px] w-[16px]"
      />
      <img
        style={state.moon[mode]}
        ref={moon}
        src={"/moon.svg"}
        className="absolute right-[6px] top-[6px] h-[16px] w-[16px]"
        alt={"moon icon"}
      />
      <svg
        ref={handle}
        className="absolute top-[4px] text-accent-foreground"
        style={state.handle[mode]}
        width="20"
        height="20"
        viewBox="0 0 33 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.78028 26.7127L5.07529 29.0077C8.01464 31.4354 11.784 32.894 15.894 32.894C25.2829 32.894 32.894 25.2828 32.894 15.894C32.894 8.63409 28.3433 2.43712 21.9387 0L9.15527e-05 21.9387C0.665123 23.6863 1.61012 25.2959 2.78028 26.7127Z"
          className="fill-foreground"
        />
      </svg>
    </button>
  );
};

export default DarkToggle;
