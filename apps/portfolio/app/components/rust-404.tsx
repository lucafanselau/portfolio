"use client";

import { isNone, isSome } from "@/utils";
import { Card } from "@ui/card";
import dynamic from "next/dynamic";
import React, {
  Attributes,
  FC,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import { useEffect } from "react";
import type { Game } from "rust-404";
import { useIsomorphicLayoutEffect } from "./hooks/utils";

let mod: typeof import("rust-404");
const loadRust404 = async () => {
  // if (isSome(mod)) return mod;
  mod = await import("rust-404");
  return mod;
};

export const Rust404: FC = ({}) => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const p = useRef<HTMLParagraphElement | null>(null);
  const state = useRef<{
    game: Game | undefined;
    startup: number | undefined;
    running: boolean;
  }>({ game: undefined, startup: undefined, running: false });

  const maybeResizeCanvas = useCallback(() => {
    if (isNone(canvas.current)) return;
    const { width, height } = canvas.current.getBoundingClientRect();

    const { devicePixelRatio: ratio = 1 } = window;
    const scaled = {
      width: Math.floor(width * ratio),
      height: Math.floor(height * ratio),
    };

    if (
      canvas.current.width !== scaled.width ||
      canvas.current.height !== scaled.height
    ) {
      console.log("scaled to", scaled);
      canvas.current.width = scaled.width;
      canvas.current.height = scaled.height;

      // also notify game
      if (isSome(state.current.game)) {
        state.current.game.resize(scaled.width, scaled.height);
      }
    }
  }, []);

  const renderLoop = useCallback((last: number) => {
    state.current.running = true;
    // first of check if we should resize
    maybeResizeCanvas();

    const now = window.performance.now();
    const g = state.current.game;
    if (isNone(g)) return;
    g.update((now - last) / 1000.0, now / 1000.0);
    g.render();
    if (state.current.running) requestAnimationFrame(() => renderLoop(now));
  }, []);

  useIsomorphicLayoutEffect(() => {
    maybeResizeCanvas();
  }, [maybeResizeCanvas]);

  const onClick = useCallback<
    NonNullable<JSX.IntrinsicElements["canvas"]["onClick"]>
  >(async (event) => {
    const now = window.performance.now();
    const game = state.current.game;
    if (isNone(game)) {
      // initialize the whole shit
      try {
        if (isSome(p.current)) p.current.textContent = "Loading...";

        // const mod = await gameMod;
        const mod = await loadRust404();
        const newGame = await mod.Game.new();
        // initialize the
        state.current = { game: newGame, startup: now, running: false };
        if (isSome(p.current))
          p.current.textContent = "Click to start adventure";
      } catch (err) {
        console.error("failed to create game instance", err);
        if (isSome(p.current))
          p.current.textContent =
            "Failed to load game. See Notes for more Information";
      }
    }

    // NOTE: there is an issue with pointer lock in chrome (or others (not tested))
    // https://discourse.threejs.org/t/how-to-avoid-pointerlockcontrols-error/33017
    // TODO: maybe also check for running state
    if (game !== undefined) {
      canvas.current?.requestPointerLock();
    }
  }, []);

  useEffect(() => {
    type Event = DocumentEventMap["pointerlockchange"];
    const lockChange = (event: Event) => {
      if (document.pointerLockElement === canvas.current) {
        // that should be the action that we dispatched ourselves
        if (isSome(p.current)) p.current.style.visibility = "hidden";
        // kickstart the render loop
        if (!state.current.running) renderLoop(state.current.startup ?? 0);
        if (isSome(state.current.game)) state.current.game.set_disabled(false);
      } else {
        if (isSome(state.current.game)) state.current.game.set_disabled(true);
        // state.current.running = false;
        if (isSome(p.current)) {
          p.current.style.visibility = "inherit";
          p.current.textContent = "Click to continue the game";
        }
      }
    };
    document.addEventListener("pointerlockchange", lockChange);
    return () => document.removeEventListener("pointerlockchange", lockChange);
  }, []);

  useLayoutEffect(() => {
    console.log("canvas", canvas.current);
  }, []);

  return (
    <Card className={" w-full  relative p-0 overflow-hidden"}>
      <canvas
        ref={canvas}
        id={"canvas"}
        style={{ display: "block", width: "100%", aspectRatio: 4 / 3 }}
        onClick={onClick}
        onContextMenu={(e) => e.preventDefault()}
      />
      <p
        ref={p}
        className="card absolute pointer-events-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4  rounded-xl"
      >
        Click to start the game
      </p>
    </Card>
  );
};
