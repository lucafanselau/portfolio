import { MDXRemote } from "next-mdx-remote/rsc";

import remarkGfm from "remark-gfm";
// import rehypeSlug from "rehype-slug";
// import rehypeAutolinkHeadings from "rehype-autolink-headings";
// import remarkA11yEmoji from "@fec/remark-a11y-emoji";
import remarkToc from "remark-toc";
import { mdxComponents } from "./markdown-components";

export function PostBody({ children }: { children: string }) {
  return (
    <article className={"prose prose-zinc dark:prose-invert leading-6"}>
      <MDXRemote
        source={children}
        options={{
          mdxOptions: {
            remarkPlugins: [
              // Adds support for GitHub Flavored Markdown
              remarkGfm,
              // Makes emojis more accessible
              // remarkA11yEmoji,
              // generates a table of contents based on headings
              remarkToc,
            ],
            // These work together to add IDs and linkify headings
            // rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
          },
        }}
        components={mdxComponents}
      />
    </article>
  );
}
