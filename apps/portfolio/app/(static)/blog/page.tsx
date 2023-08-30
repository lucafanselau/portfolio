import { BlogPost, getPosts } from "@components/blog/utils";
import { H1, P } from "@ui/typography";
import parse from "date-fns/parse";

const formatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const BlogPostCard = ({ post }: { post: BlogPost }) => {
  const { data } = post;

  const from = parse(data.created, "dd.MM.yyyy", new Date());

  return (
    <div className="card">
      <H1>{data.title}</H1>
      <P>{formatter.format(from)}</P>
    </div>
  );
};

export default async function BlogOverview() {
  const posts = await getPosts();

  return (
    <div className="">
      {posts.map((post) => (
        <BlogPostCard key={post.data.slug} post={post} />
      ))}
    </div>
  );
}
