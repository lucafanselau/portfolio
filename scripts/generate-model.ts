import { getFiles, Unpacked } from "./utils";
import { readFile, mkdir, rename, writeFile } from "fs/promises";
import JSON5 from "json5";
import { z } from "zod";
import rimraf from "rimraf";
import chalk from "chalk";
import gltfjsx from "gltfjsx/src/gltfjsx";
import prependFile from "prepend-file";
import spawnAsync from "@expo/spawn-async";

const base = "./assets/generated/";
const target = {
  src: "./apps/portfolio/components/3d/generated/",
  assets: "./apps/portfolio/public/",
};
const assetPrefix = "generated/";

// try to load the collection file
const collectionFile = await readFile(base + "collection.json", "utf-8");
const rawCollection = JSON5.parse(collectionFile);

const collectionSchema = z.record(
  z.array(
    z.object({
      id: z.string(),
      file: z.string(),
      name: z.optional(z.string()),
    })
  )
);

// validate the collection file
const collection = collectionSchema.parse(rawCollection);

type Entry = Unpacked<(typeof collection)[string]>;

// function invoked to process a single entry
const processEntry = async (key: string, entry: Entry) => {
  // process all subprocesses
  const [gltf, preview] = await Promise.all([
    createGltf(key, entry),
    createThumbnail(key, entry),
  ]);

  return { ...gltf, ...preview, ...entry };
};

// reset target directory
await rimraf(target.src);
await rimraf(target.assets + assetPrefix);
// and recreate the asset directory
await mkdir(target.assets + assetPrefix, { recursive: true });

console.log(`[${chalk.yellow("general")}] - reset target directory`);

// load the entries
const mapped = await Promise.all(
  Object.keys(collection).map(async (key) => {
    // prepare target directory
    await mkdir(target.src + key, { recursive: true });
    console.log(
      `[${chalk.yellow("general")}] - created directory ${target.src + key}`
    );

    const entries = collection[key];
    if (entries === undefined) return;
    const mapped = await Promise.all(
      entries.map((entry) => processEntry(key, entry))
    );
    return { [key]: mapped };
  })
);

// write the new collection file
const newCollection = mapped.reduce((acc, cur) => ({ ...acc, ...cur }), {});

await writeFile(
  target.src + "collection.json",
  JSON5.stringify(newCollection, null, 2)
);
console.log(
  `[${chalk.green("general")}] - wrote new collection file to ${target.src}`
);

// create the instances file
const instancesFile = createInstancesFile();
await writeFile(target.src + "index.tsx", instancesFile);
console.log(
  `[${chalk.green("general")}] - wrote new instances file to ${target.src}`
);

// create the loader file
const loaderFile = createLoaderFile();
await writeFile(target.src + "loader.tsx", loaderFile);
console.log(
  `[${chalk.green("general")}] - wrote new loader file to ${target.src}`
);

// ------------------------------
// UTILITY FUNCTIONS FROM HERE ON
// ------------------------------

async function createGltf(key: string, entry: Entry) {
  const file = `${base}${key}/${entry.file}`;
  const output = `${target.src}${key}/${entry.id}.tsx`;
  try {
    const response = await gltfjsx(file, output, {
      transform: true,
      types: true,
      instanceall: true,
      timeout: 0,
      showLog: console.log,
      shadows: true,
      header: `// Generated from ${file}`,
      delay: 1,
    });

    await prependFile(output, `// @ts-nocheck\n`);
    console.log(`[${chalk.green("success")}] - created model file ${output}`);
  } catch (e) {
    console.log(`[${chalk.red("error")}] - ${file} failed to create tsx file`);
  }
  const transformedName = entry.file.replace(".glb", "-transformed.glb");
  const transformed = `./${transformedName}`;
  const assetFile = `${assetPrefix}${transformedName}`;
  const newPath = `${target.assets}${assetFile}`;
  try {
    await rename(transformed, newPath);
    console.log(
      `[${chalk.green("success")}] - moved ${transformed} to ${newPath}`
    );
  } catch (e) {
    console.log(
      `[${chalk.red("error")}] - ${file} failed to move transformed file`,
      newPath
    );
  }
  return { src: `${key}/${entry.id}.tsx`, glb: `${assetFile}` };
}

async function createThumbnail(key: string, entry: Entry) {
  const file = `${base}${key}/${entry.file}`;
  const assetFile = `${assetPrefix}${entry.id}-preview.png`;
  const out = `${target.assets}${assetFile}`;

  try {
    await spawnAsync("pnpm", [
      "screenshot-glb",
      "-i",
      file,
      "-o",
      out,
      "-m",
      "camera-orbit=135deg 75deg 85%",
      "-w",
      "400",
      "-h",
      "300",
    ]);
    console.log(`[${chalk.green("success")}] - created preview image ${out}`);
  } catch (e) {
    console.log(
      `[${chalk.red("error")}] - ${file} failed to create preview image`
    );
  }

  return { img: assetFile };
}

function createInstancesFile() {
  // write out the import file
  const imports = Object.keys(newCollection ?? {})
    .flatMap((key) => {
      const entries = newCollection?.[key] ?? [];

      return entries.map((entry) => {
        const { id } = entry;
        return `import { Instances as I${id.replace(
          "-",
          ""
        )} } from "./${entry.src.replace(".tsx", "")}";`;
      });
    })
    .join("\n");

  const startBrackets = Object.keys(newCollection ?? {})
    .flatMap((key) => {
      const entries = newCollection?.[key] ?? [];

      return entries.map((entry) => {
        const { id } = entry;
        return `<I${id.replace("-", "")} receiveShadow castShadow>`;
      });
    })
    .join("\n");
  const closeBrackets = Object.keys(newCollection ?? {})
    .flatMap((key) => {
      const entries = newCollection?.[key] ?? [];

      return entries.map((entry) => {
        const { id } = entry;
        return `</I${id.replace("-", "")}>`;
      });
    })
    .reverse()
    .join("\n");

  return `
import { FC, ReactNode } from "react";
${imports}

export const Instances: FC<{ children: ReactNode }> = ({ children }) => {
	return (
      ${startBrackets}
			{children}
			${closeBrackets}
	);
};
`;
}

function createLoaderFile() {
  const imports = Object.keys(newCollection ?? {})
    .flatMap((key) => {
      const entries = newCollection?.[key] ?? [];

      return entries.map((entry) => {
        const { id } = entry;
        return `import { Model as M${id.replace(
          "-",
          ""
        )} } from "./${entry.src.replace(".tsx", "")}";`;
      });
    })
    .join("\n");

  const fields = Object.keys(newCollection ?? {})
    .map((key) => {
      const entries = newCollection?.[key] ?? [];

      const innerFields = entries.map((entry) => {
        const { id } = entry;
        return `${id}: M${id.replace("-", "")},`;
      });

      return `${key}: {\n ${innerFields.join("\n")}\n },`;
    })
    .join("\n");

  return `
${imports}
const models = {
	${fields}
};
`;
}
