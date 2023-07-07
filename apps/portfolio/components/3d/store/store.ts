import type { BuildState } from "@3d/build/types";
import type { Interaction } from "@3d/constants";
import { constants } from "@3d/constants";
import { initial } from "@3d/world/inital";
import type { Building, Prop, TerrainType } from "@3d/world/types";
import type { ToolContentKeys } from "@content/tools";
import type { Object3D } from "three";
import { Vector3 } from "three";

export type Store = {
  target: Vector3;
  camera: {
    target: Vector3;
    position: Vector3;
    controlled: {
      position: boolean;
      target: boolean;
    };
  };
  state: "start" | "explore" | "build";
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
  pointer?: [number, number];
  pointerDown: boolean;
  world: {
    hovered: Object3D[];
    terrain: [type: TerrainType, rotation: number][][];
    buildings: Building[];
    props: Prop[];
    interaction: {
      current?: Interaction["title"];
      history: Record<Interaction["title"], boolean>;
    };
  };
};

export const defaultStore: Store = {
  target: new Vector3(),
  camera: {
    target: constants.transitions.target.start,
    position: constants.transitions.position.start,
    controlled: {
      position: true,
      target: true,
    },
  },
  state: "start",
  ui: {
    mode: { type: "focus", key: "info" },
    transition: false,
  },
  character: {
    state: "greet",
    position: new Vector3(),
  },
  pointer: undefined,
  pointerDown: false,
  world: {
    hovered: [],
    terrain: initial.terrain,
    buildings: initial.buildings,
    props: initial.props,
    interaction: {
      current: undefined,
      history: { home: false, office: false, school: false },
    },
  },
};

export type State = Store["state"];
export type CharacterState = Store["character"];
