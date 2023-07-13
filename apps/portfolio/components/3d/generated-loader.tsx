import collection from "@3d/generated/collection.json";
// import { Instances } from "@3d/generated/index";
import { models } from "@3d/generated/loader";
import { useStore } from "@3d/store";
import { isNone } from "@components/utils";
import type { GroupProps } from "@react-three/fiber";
import type { FC, ReactNode } from "react";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import type { Building, Prop } from "./world/types";

// ***************************************************
// Collection and Assets types and helpers

export type AssetCollection = typeof collection;
export type AssetCategory = keyof AssetCollection;
export type AssetEntry<Keys extends AssetCategory = AssetCategory> =
  UnwrapUnion<AssetCollection[Keys]>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type AssetKey<T extends AssetCategory> = KeysOfUnion<AssetCollection[T]>;
type UnwrapUnion<T> = T extends T ? T[keyof T] : never;
export const findAssetEntry = <C extends AssetCategory>(
  category: C,
  item: KeysOfUnion<AssetCollection[C]>
) => {
  return collection[category][item] as AssetEntry<C>;
};

// ***************************************************
// Model Loaders

export const GeneratedLoader: FC<{ children?: ReactNode }> = ({ children }) => {
  // NOTE: currently instances are turned off
  return <>{children}</>;
  // return <Instances>{children}</Instances>;
};
