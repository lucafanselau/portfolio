import { readdir, mkdir, rename, writeFile } from "fs/promises";
import { resolve } from "path";

export type Unpacked<T> = T extends (infer U)[] ? U : T;

export async function getFiles(dir: string): Promise<[string, string[]][]> {
  const recurse = async (
    dir: string,
    path: string[] = []
  ): Promise<[string, string[]][]> => {
    const dirents = await readdir(dir, { withFileTypes: true });

    return (
      await Promise.all(
        dirents.map(async (dirent): Promise<[string, string[]][]> => {
          const res = resolve(dir, dirent.name);
          if (dirent.isDirectory()) {
            return await recurse(res, [...path, dirent.name]);
          } else {
            return [[res, [...path, dirent.name]]];
          }
        })
      )
    ).flat();
  };
  return recurse(dir);
}
