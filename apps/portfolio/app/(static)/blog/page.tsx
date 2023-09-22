import { BlogPost, getPosts } from "@components/blog/utils";
import { H1, P } from "@ui/typography";
import parse from "date-fns/parse";
import { ComponentProps } from "react";
import Link from "next/link";

const formatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const BlogPostCard = ({ post }: { post: BlogPost }) => {
  const { data } = post;

  const from = parse(data.created, "dd.MM.yyyy", new Date());

  return (
    <Link className="card block w-full" href={`blog/${post.data.slug}`}>
      <H1>{data.title}</H1>
      <P>{formatter.format(from)}</P>
    </Link>
  );
};

export default async function BlogOverview() {
  const posts = await getPosts();

  return (
    <div className="flex flex-col items-start space-y-2">
      <H1>Welcome to my blog</H1>
      <P>
        This is a place to dump my thoughts and interests. Don't expect regular
        updates regularly but I'll give my best to write about things I find
        interesting.
      </P>

      {posts.map((post) => (
        <BlogPostCard key={post.data.slug} post={post} />
      ))}
    </div>
  );
}
