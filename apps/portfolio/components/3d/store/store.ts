import type { BuildState } from "@3d/build/types";
import type { Interaction } from "@3d/constants";
import { constants } from "@3d/constants";
import { coord, vec2, WorldCoord } from "@3d/world/coord";
import initial from "../world/initial-export.json";
import type { Entity, Terrain } from "@3d/world/types";
import type { ToolContentKeys } from "@content/tools";
import type { RootState as ThreeState } from "@react-three/fiber";
import type { Object3D } from "three";
import { Vector3 } from "three";

export type Store = {
  getThree?: () => ThreeState;
  target: Vector3;
  camera: {
    target: Vector3;
    position: Vector3;
    controlled: {
      position: boolean;
      target: boolean;
    };
  };
  state?: "start" | "explore" | "build";
  ui: {
    mode:
      | { type: "focus" | "slide"; key: ToolContentKeys }
      | { type: "build"; payload: BuildState }
      | { type: "closed" };

    // indicating that a camera transition is in progress
    transition: boolean;
  };
  character: {
    state: "idle" | "walk" | "run" | "rotate" | "greet";
    position: Vector3;
  };
  // pointer for building
  pointer: WorldCoord;
  // NOTE: might be unused, so maybe remove
  pointerDown: boolean;
  world: {
    hovered: [Object3D, string][];
    terrain: Terrain[][];
    entities: Entity[];
    interaction: {
      current?: Interaction["title"];
      history: Record<Interaction["title"], boolean>;
    };
  };
};

export const defaultStore: Store = {
  getThree: undefined,
  target: new Vector3(),
  camera: {
    target: constants.transitions.target.start.clone(),
    position: constants.transitions.position.initial.clone(),
    controlled: {
      position: true,
      target: true,
    },
  },
  state: undefined,
  ui: {
    mode: { type: "closed" }, //  { type: "focus", key: "info" },
    transition: false,
  },
  character: {
    state: "greet",
    position: new Vector3(),
  },
  pointer: coord.world.new(vec2.splat(0)),
  pointerDown: false,
  world: {
    ...(initial.world as Store["world"]),
    hovered: [],
    interaction: {
      current: undefined,
      history: { home: false, office: false, school: false },
    },
  },
};

export type State = NonNullable<Store["state"]>;
export type CharacterState = Store["character"];
