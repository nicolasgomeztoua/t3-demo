import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/Layout";
import { PostView } from "~/components/PostView";
import { ssgHelper } from "~/server/helpers/ssgHelper";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.posts.getSinglePost.useQuery({
    id,
  });

  if (!data) return <div>404 Post not found</div>;
  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
        <meta name="description" content="Emoji Only Twitter" />
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const ssgApi = ssgHelper();
  const id = ctx.params?.id;

  if (typeof id !== "string") {
    throw new Error("No id provided");
  }

  await ssgApi.posts.getSinglePost.prefetch({ id });

  return {
    props: {
      // very important - use `trpcState` as the key
      trpcState: ssgApi.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default SinglePostPage;
