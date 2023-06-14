"use client";

import { isNone, isSome } from "@/utils";
import React, { Attributes, FC, useCallback, useRef } from "react";
import { useEffect } from "react";


const gameMod = import("rust-404");

export const Rust404: FC  = () => {
    const canvas = useRef<HTMLCanvasElement | null>(null);
    const p = useRef<HTMLParagraphElement | null>(null);
    const state = useRef<{ game: object | undefined; startup: number | undefined; running: boolean }>({ game: undefined, startup: undefined, running: false });

    const renderLoop = useCallback((last: number) => {
        const now = window.performance.now();
        const g = state.current.game;
        if (isNone(g)) return;
        // @ts-expect-error
        g.update((now - last) / 1000.0, now / 1000.0);
        // @ts-expect-error
        g.render();
        if (state.current.running) requestAnimationFrame(() => renderLoop(now));
    }, []);
    const onClick = useCallback<NonNullable<JSX.IntrinsicElements["canvas"]["onClick"]>>(async event => {
        const now = window.performance.now();
        const game = state.current.game;
        console.log("got here", game);
        if (isNone(game)) {
            // initialize the whole shit
            try {
                if (isSome(p.current)) p.current.textContent = "Loading...";
                
                console.log("start waiting for the game mod")
                const mod = await gameMod;
                console.log("got the mod")
                const game = await mod.Game.new();
                console.log("created a new game");
                // initialize the
                state.current = { game, startup: now, running: false};
                if (isSome(p.current)) p.current.textContent = "Click to start adventure";
            } catch (err) {
                console.error("failed to create game instance");
                if (isSome(p.current)) p.current.textContent = "Failed to load game. See Notes for more Information";
            }
        }


        // NOTE: there is an issue with pointer lock in chrome (or others (not tested))
        // https://discourse.threejs.org/t/how-to-avoid-pointerlockcontrols-error/33017
        if (!state.current.running && game !== undefined) {
            canvas.current?.requestPointerLock();
        }
    }, []);

    useEffect(() => {

        
        type Event = DocumentEventMap["pointerlockchange"];
    const lockChange = ( event: Event) => {
        if (document.pointerLockElement === canvas.current) {
            // that should be the action that we dispatched ourselves
            state.current.running = true;
            if (isSome(p.current)) p.current.style.visibility = "hidden";
            // kickstart the render loop
            renderLoop(state.current.startup ?? 0);
        } else {
            state.current.running = false;
            if (isSome(p.current)) {
                p.current.style.visibility = "inherit";
                p.current.textContent = "Click to continue the game";
            }
        }
    };
        document.addEventListener("pointerlockchange", lockChange);
        return () => document.removeEventListener("pointerlockchange", lockChange);
    }, []);


    return (
        <div
            className={
                "border-[3px] border-darker dark:border-kinda-white relative " +
                "shadow-solid shadow-darker/25 dark:shadow-kinda-white/25 " +
                "inline-block rounded-2xl dark:from-yellow dark:to-green from-green to-yellow bg-gradient-to-l overflow-hidden " +
                "max-w-[600px] w-full"
            }
        >
            <canvas ref={canvas} id={"canvas"} width={600} height={400} onClick={onClick} onContextMenu={e => e.preventDefault()} />
            <p
                ref={p}
                className="absolute pointer-events-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 bg-yellow rounded-xl dark:bg-darker border-[2px] border-darker dark:border-kinda-white"
            >
                Click to start the game
            </p>
        </div>
    );
};
