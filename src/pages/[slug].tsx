import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/Layout";
import Image from "next/image";
import { LoaderPage } from "~/components/Loader";
import { PostView } from "~/components/PostView";
import { ssgHelper } from "~/server/helpers/ssgHelper";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading) return <LoaderPage />;

  if (!data || data.length === 0)
    return <div className="p-4">No posts yet</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => {
        return <PostView {...fullPost} key={fullPost.post.id} />;
      })}
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profiles.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <div>404 User not found</div>;
  return (
    <>
      <Head>
        <title>{data.username}</title>
        <meta name="description" content="Emoji Only Twitter" />
      </Head>
      <PageLayout>
        {" "}
        <div className="relative h-48 bg-slate-600">
          <Image
            src={data.profilePicture}
            alt={`${data.username ?? ""}'s Profile Picture`}
            width={128}
            height={128}
            className="absolute bottom-0 
            left-0 -mb-[64px] ml-4 rounded-full border-4 
            border-black bg-black"
          />
        </div>{" "}
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${
          data.username ?? ""
        }`}</div>
        <div className="w-full border-b border-slate-400">
          <ProfileFeed userId={data.id} />
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const ssgApi = ssgHelper();
  const slug = ctx.params?.slug;

  if (typeof slug !== "string") {
    throw new Error("No slug provided");
  }
  const username = slug.replace("@", ""); // remove @ from slug

  await ssgApi.profiles.getUserByUsername.prefetch({ username });

  return {
    props: {
      // very important - use `trpcState` as the key
      trpcState: ssgApi.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
