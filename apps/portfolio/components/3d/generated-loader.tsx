import collection from "@3d/generated/collection.json";
import { Instances } from "@3d/generated";
import { FC, ReactNode, useMemo } from "react";
import { Unwrap } from "./constants";
import dynamic from "next/dynamic";

type GeneratedKeys = keyof typeof collection;
type GeneratedEntry<Keys extends GeneratedKeys = GeneratedKeys> = Unwrap<
  (typeof collection)[Keys]
>;

export const GeneratedLoader: FC<{ children?: ReactNode }> = ({ children }) => {
  return <Instances>{children}</Instances>;
};


const ModelLookup = Object.keys(collection).reduce((acc, key) => {
	const entry = collection[key as GeneratedKeys];
	const models = entry.map((e) => e.id);
	return { ...acc, [key]: models };
}, {} as Record<GeneratedKeys, Record<string, >);

export const BuildingLoader: FC<{
  key: Exclude<GeneratedKeys, "streets">;
  type: string;
}> = ({ key, type }) => {
  const entry = useMemo(
    () => collection[key].find((e) => e.id === type),
    [type, key]
  );

	

	
};
