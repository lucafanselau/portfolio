import { getFiles, Unpacked } from "./utils";
import { readFile, mkdir, rename, writeFile } from "fs/promises";
import JSON5 from "json5";
import { z } from "zod";
import rimraf from "rimraf";
import chalk from "chalk";
import gltfjsx from "gltfjsx/src/gltfjsx";
import prependFile from "prepend-file";
import spawnAsync from "@expo/spawn-async";
import { isNone } from "apps/portfolio/components/utils";

const base = "./assets/generated/";
const target = {
  src: "./apps/portfolio/components/3d/generated/",
  assets: "./apps/portfolio/public/",
};
const assetPrefix = "generated/";
const instance = false;

// try to load the collection file
const collectionFile = await readFile(base + "collection.json", "utf-8");
const rawCollection = JSON5.parse(collectionFile);

const baseEntry = z.object({
  id: z.string(),
  file: z.union([
    z.string(),
    z.array(z.object({ file: z.string(), id: z.string() })),
  ]),
  name: z.string(),
});

const collectionSchema = z.object({
  streets: z.array(baseEntry),
  buildings: z.array(
    baseEntry.extend({
      extend: z.tuple([z.number(), z.number()]),
    })
  ),
  props: z.array(baseEntry),
});

// validate the collection file
const collection = collectionSchema.parse(rawCollection);

type Key = keyof typeof collection;
type Entry = Unpacked<(typeof collection)[Key]>;

const ident = (entry: Entry, index: number) =>
  entry.id + (Array.isArray(entry.file) ? `-${entry.file[index]?.id}` : "");
const safeIdent = (entry: Entry, index: number) =>
  ident(entry, index).replace(/[^a-zA-Z0-9]/g, "_");
const entryFile = (entry: Entry, index: number): string =>
  Array.isArray(entry.file) ? entry.file[index]?.file ?? "" : entry.file;

type Output = Awaited<ReturnType<typeof createGltf>> &
  Awaited<ReturnType<typeof createThumbnail>> & { variant?: string };

type ExportedEntry = Entry & {
  output: Output | Output[];
};

// function invoked to process a single entry
const processEntry = async (
  key: string,
  { ...entry }: Entry
): Promise<ExportedEntry> => {
  const doIndex = async (index: number): Promise<Output> => {
    const [gltf, preview] = await Promise.all([
      createGltf(key, entry, index),
      createThumbnail(key, entry, index),
    ]);
    return { ...gltf, ...preview };
  };

  // process all subprocesses
  if (Array.isArray(entry.file)) {
    const output: ExportedEntry["output"] = await Promise.all(
      entry.file.map((_, index) => doIndex(index))
    );
    return { ...entry, output };
  } else {
    const output = await doIndex(0);
    return { ...entry, output };
  }
};

// reset target directory
await rimraf(target.src);
await rimraf(target.assets + assetPrefix);
// and recreate the asset directory
await mkdir(target.assets + assetPrefix, { recursive: true });

console.log(`[${chalk.yellow("general")}] - reset target directory`);

// load the entries
const mapped = await Promise.all(
  Object.keys(collection).map(async (key: Key) => {
    // prepare target directory
    await mkdir(target.src + key, { recursive: true });
    console.log(
      `[${chalk.yellow("general")}] - created directory ${target.src + key}`
    );

    const entries = collection[key];
    if (entries === undefined) return;
    const mapped = (
      await Promise.all(entries.map((entry) => processEntry(key, entry)))
    ).reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {}) as Record<
      string,
      ExportedEntry
    >;

    return { [key]: mapped };
  })
);

// write the new collection file
const newCollection = mapped.reduce((acc, cur) => ({ ...acc, ...cur }), {});

await writeFile(
  target.src + "collection.json",
  JSON.stringify(newCollection, null, 2)
);
console.log(
  `[${chalk.green("general")}] - wrote new collection file to ${target.src}`
);

// create the instances file
if (instance) {
  // const instancesFile = createInstancesFile();
  // await writeFile(target.src + "index.tsx", instancesFile);
  // console.log(
  //   `[${chalk.green("general")}] - wrote new instances file to ${target.src}`
  // );
}

// create the loader file
const loaderFile = createLoaderFile();
await writeFile(target.src + "loader.tsx", loaderFile);
console.log(
  `[${chalk.green("general")}] - wrote new loader file to ${target.src}`
);

// ------------------------------
// UTILITY FUNCTIONS FROM HERE ON
// ------------------------------

async function createGltf(key: string, entry: Entry, index: number = -1) {
  const file = `${base}${key}/${entryFile(entry, index)}`;
  const outputRelative = `${key}/${ident(entry, index)}.tsx`;
  const output = `${target.src}${outputRelative}`;
  const transformedName = entryFile(entry, index).replace(
    ".glb",
    "-transformed.glb"
  );
  const assetFile = `${assetPrefix}${transformedName}`;
  try {
    const response = await gltfjsx(file, output, {
      transform: true,
      types: true,
      instanceall: instance,
      instance: true,
      timeout: 0,
      showLog: console.log,
      shadows: true,
      header: `// Generated from ${file}`,
      delay: 1,
    });

    await prependFile(output, `// @ts-nocheck\n`);

    let fileContent = await readFile(output, "utf-8");
    fileContent = fileContent.replaceAll(transformedName, assetFile);
    await writeFile(output, fileContent);

    console.log(`[${chalk.green("success")}] - created model file ${output}`);
  } catch (e) {
    console.log(`[${chalk.red("error")}] - ${file} failed to create tsx file`);
    console.error(e);
  }
  const transformed = `./${transformedName}`;
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
  return { src: outputRelative, glb: assetFile };
}

async function createThumbnail(key: string, entry: Entry, index: number) {
  const file = `${base}${key}/${entryFile(entry, index)}`;
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

// function createInstancesFile() {
//   // write out the import file
//   const imports = Object.keys(newCollection ?? {})
//     .flatMap((key) => {
//       const entries = newCollection?.[key] ?? [];

//       return Object.values(entries).map((entry) => {
//         return `import { Instances as I${ident(entry).replace(
//           "-",
//           ""
//         )} } from "./${entry.src.replace(".tsx", "")}";`;
//       });
//     })
//     .join("\n");

//   const startBrackets = Object.keys(newCollection ?? {})
//     .flatMap((key) => {
//       const entries = newCollection?.[key] ?? [];

//       return Object.values(entries).map((entry) => {
//         return `<I${ident(entry).replace("-", "")} receiveShadow castShadow>`;
//       });
//     })
//     .join("\n");
//   const closeBrackets = Object.keys(newCollection ?? {})
//     .flatMap((key) => {
//       const entries = newCollection?.[key] ?? [];

//       return Object.values(entries).map((entry) => {
//         return `</I${ident(entry).replace("-", "")}>`;
//       });
//     })
//     .reverse()
//     .join("\n");

//   return `
// import { FC, ReactNode } from "react";
// ${imports}

// export const Instances: FC<{ children: ReactNode }> = ({ children }) => {
// 	return (
//       ${startBrackets}
// 			{children}
// 			${closeBrackets}
// 	);
// };
// `;
// }

function createLoaderFile() {
  const imports = Object.keys(newCollection ?? {})
    .flatMap((key) => {
      const entries = newCollection?.[key] ?? [];

      const importStatement = (entry: ExportedEntry, index: number) => {
        if (Array.isArray(entry.output))
          return `import { Model as M${safeIdent(
            entry,
            index
          )} } from "./${entry.output[index]?.src.replace(".tsx", "")}";`;
        else
          return `import { Model as M${safeIdent(
            entry,
            index
          )} } from "./${entry.output.src.replace(".tsx", "")}";`;
      };

      return Object.values(entries).flatMap((entry) => {
        if (Array.isArray(entry.file))
          return entry.file.map((file, index) => importStatement(entry, index));
        return importStatement(entry, -1);
      });
    })
    .join("\n");

  const fields = Object.keys(newCollection ?? {})
    .map((key) => {
      const entries = newCollection?.[key] ?? [];

      const fieldStatement = (entry: ExportedEntry, index: number) => {
        return `"${ident(entry, index)}": M${safeIdent(entry, index)},`;
      };

      const innerFields = Object.values(entries).flatMap((entry) => {
        if (Array.isArray(entry.file))
          return entry.file.map((file, index) => fieldStatement(entry, index));
        return fieldStatement(entry, -1);
      });

      return `${key}: {\n ${innerFields.join("\n")}\n },`;
    })
    .join("\n");

  return `
${imports}
export const models = {
	${fields}
};
`;
}
