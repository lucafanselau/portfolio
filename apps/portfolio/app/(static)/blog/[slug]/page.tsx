import { PostBody } from "@components/blog/post-body";
import { getPost, getPosts } from "@components/blog/utils";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const post = await getPost(params.slug);
  // notFound is a Next.js utility
  if (!post) return notFound();
  // Pass the post contents to MDX
  return <PostBody>{post?.body}</PostBody>;
}

// this prerenders all of the blog posts at build time
export async function generateStaticParams() {
  const posts = await getPosts();
  console.log(posts);
  // The params to pre-render the page with.
  // Without this, the page will be rendered at runtime
  return posts.map((post) => ({ params: { slug: post?.data.slug } }));
}
