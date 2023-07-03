import { resolve } from "path";
import { readdir, mkdir, rename, writeFile } from "fs/promises";
import gltfjsx from "gltfjsx/src/gltfjsx";
import rimraf from "rimraf";
import prependFile from "prepend-file";
import spawn from "@expo/spawn-async";
import spawnAsync from "@expo/spawn-async";

const outputBase = "apps/portfolio/components/3d/generated";

async function main() {
  console.log("deleting generated folder");
  await rimraf("./" + outputBase);
  console.log("generating models");

  const imports = [];

  const config = {};
  for await (const [file, p] of getFiles("assets/generated")) {
    if (!file.endsWith(".gltf") && !file.endsWith(".glb")) continue;
    const paths = p.map((p) => p.replace(".glb", ".tsx"));
    const output = `./${outputBase}/${paths.join("/")}`;
    imports.push(paths.join("/"));
    console.log("generating", file, "to", output);
    const dir = output.split("/").slice(0, -1).join("/");
    await mkdir(dir, { recursive: true });

    const baseName = p.reverse()[0];
    // try to move the transformed file
    try {
      const name = baseName?.replace(".glb", "-transformed.glb");
      if (!name) throw new Error("no name");
      const dest = "./apps/portfolio/public/" + name;
      console.log("moving", name, "to", dest);
      await rename(name, dest);
    } catch (e) {
      console.error("during rename", e);
    }

    // lastly create a preview image
    try {
      const out =
        "./apps/portfolio/public/" + baseName?.replace(".glb", "-preview.png");

      await spawnAsync("pnpm", [
        "screenshot-glb",
        "-i",
        file,
        "-o",
        out,
        "-m",
        "camera-orbit=135deg 75deg 105%",
      ]);
      console.log("create preview image ", out);
    } catch (e) {
      console.error("during screenshot creation", e);
    }
  }

  const fileContent = `
import { FC, ReactNode } from "react";
${imports
  .map(
    (i, index) =>
      `import { Instances as I${index} } from "./${i.replace(".tsx", "")}";`
  )
  .join("\n")}
export const Instances: FC<{ children: ReactNode }> = ({ children }) => {

  return (
${imports
  .map((_, index) => `    <I${index} receiveShadow castShadow>`)
  .join("\n")}
{children}
${imports
  .map((_, i) => i)
  .reverse()
  .map((index) => `    </I${index}>`)
  .join("\n")}
  );
};
`;

  await writeFile(`./${outputBase}/index.tsx`, fileContent);
}

main();
