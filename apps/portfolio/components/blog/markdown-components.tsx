import { Code } from "bright";

import { H1, H2, H3, H4, P, List } from "@ui/typography";

import type { MDXProvider } from "@mdx-js/react";
import type { ComponentProps } from "react";

type MDXComponents = ComponentProps<typeof MDXProvider>["components"];

Code.lineNumbers = true;
Code.theme = "one-dark-pro";

export const mdxComponents: MDXComponents = {
  pre: Code,
};
