import type { AssetCategory, AssetKey } from "@3d/generated-loader";

type Payload<Category extends AssetCategory> = {
  type: Category;
  id: AssetKey<Category>;
  state: {
    valid: true | { intersects: string[] };
    rotation?: number;
    variant?: string;
  };
};

export type BuildStateBuild = {
  type: "build";
  payload: Payload<AssetCategory>;
};
type BuildStateDestroy = { type: "destroy" };
export type BuildState = (BuildStateBuild | BuildStateDestroy) & {
  info: "focus" | "slide" | false;
};
