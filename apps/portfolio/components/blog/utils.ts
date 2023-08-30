// This whole blog setup is mostly based on this fantastic blog post:
// https://maxleiter.com/blog/build-a-blog-with-nextjs-13#seo

import chalk from "chalk";
import matter from "gray-matter";
import path from "path";
import fs from "fs/promises";
import { cache } from "react";
import { isSome } from "@components/utils";

const fileBase = path.join(process.cwd(), "blog");

export type BlogFrontmatter = {
  author: string;
  title: string;
  created: string;
  updated?: string;
  published?: boolean;
  slug: string;
};

export type BlogPost = {
  body: string;
  data: BlogFrontmatter;
};

// `cache` is a React 18 feature that allows you to cache a function for the lifetime of a request.
// this means getPosts() will only be called once per page build, even though we may call it multiple times
// when rendering the page.
export const getPosts = cache(async (): Promise<BlogPost[]> => {
  const posts = await fs.readdir(fileBase);

  console.log(chalk.green(`📝  ${posts.length} Post(s) loaded`));

  return (
    await Promise.all(
      posts
        .filter((file) => path.extname(file) === ".mdx")
        .map(async (file) => {
          const filePath = path.join(fileBase, file);
          const postContent = await fs.readFile(filePath, "utf8");
          const { data, content } = matter(postContent);

          if (data.published === false) {
            return null;
          }
          // console.log(chalk.green(`📝  ${data.slug} loaded`));

          return { data, body: content } as BlogPost;
        })
    )
  ).filter(isSome);
});

export async function getPost(slug: string) {
  const posts = await getPosts();
  return posts.find((post) => post?.data.slug === slug);
}
