import { resolve } from "path";
import { readdir, mkdir, rename } from "fs/promises";
import gltfjsx from "gltfjsx/src/gltfjsx";
import rimraf from "rimraf";

async function* getFiles(
  dir: string,
  path: string[] = []
): AsyncGenerator<[string, string[]]> {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res, [...path, dirent.name]);
    } else {
      yield [res, [...path, dirent.name]];
    }
  }
}

const outputBase = "apps/portfolio/app/3d/generated";

async function main() {
  console.log("deleting generated folder");
  await rimraf("./" + outputBase);
  console.log("generating models");
  const config = {};
  for await (const [file, p] of getFiles("assets/generated")) {
    const paths = p.map((p) => p.replace(".glb", ".tsx"));
    const output = `./${outputBase}/${paths.join("/")}`;
    console.log("generating", file, "to", output);
    const dir = output.split("/").slice(0, -1).join("/");
    await mkdir(dir, { recursive: true });
    try {
      const response = await gltfjsx(file, output, {
        ...config,
        transform: true,
        types: true,
        instanceall: true,
        timeout: 0,
        showLog: console.log,
        delay: 1,
      });
    } catch (e) {
      console.error("during gltfjsx", e);
    }

    // try to move the transformed file
    try {
      const name = p.reverse()[0]?.replace(".glb", "-transformed.glb");
      if (!name) throw new Error("no name");
      const dest = "./apps/portfolio/public/" + name;
      console.log("moving", name, "to", dest);
      await rename(name, dest);
    } catch (e) {
      console.error("during rename", e);
    }
  }
}

main();
