import collection from "@3d/generated/collection.json";
// import { Instances } from "@3d/generated/index";
import type { FC, ReactNode } from "react";

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

// utility functions
export const toArray = <T extends object>(value: T | T[]) => {
  return Array.isArray(value) ? value : [value];
};

// ***************************************************
// Model Loaders

export const GeneratedLoader: FC<{ children?: ReactNode }> = ({ children }) => {
  // NOTE: currently instances are turned off
  return <>{children}</>;
  // return <Instances>{children}</Instances>;
};
