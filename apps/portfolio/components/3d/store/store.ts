import { constants, Interaction } from "@3d/constants";
import { initial } from "@3d/world/inital";
import { Building, TerrainType } from "@3d/world/types";
import type { ToolContentKeys } from "@content/tools";
import { Group, Vector3 } from "three";

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
    mode: "focus" | "slide" | "closed";
    key: ToolContentKeys;
    transition: boolean;
  };
  showCard: boolean;
  character: {
    state: "idle" | "walk" | "run" | "rotate" | "greet";
    position: Vector3;
  };
  world: {
    terrain: [type: TerrainType, rotation: number][][];
    buildings: Building[];
    interaction: {
      current?: Interaction["title"];
      history: Record<Interaction["title"], boolean>;
    };
  };
};

export const defaultStore: Store = {
  target: new Vector3(),
  camera: {
    target: constants.transitions.target["start"],
    position: constants.transitions.position["start"],
    controlled: {
      position: true,
      target: true,
    },
  },
  state: "explore",
  ui: {
    mode: "slide",
    key: "office",
    transition: false,
  },
  showCard: true,
  character: {
    state: "greet",
    position: new Vector3(),
  },
  world: {
    terrain: initial.terrain,
    buildings: initial.buildings,
    interaction: {
      current: undefined,
      history: { home: false, office: true, school: false },
    },
  },
};

export type State = Store["state"];
export type CharacterState = Store["character"];
