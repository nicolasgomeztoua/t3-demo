import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

const CreatePostWizard = () => {
  const { user } = useUser();
  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <Image
        className="h-14 w-14 rounded-full"
        src={user.profileImageUrl}
        alt="User Profile Image"
        width={56}
        height={56}
      ></Image>
      <input
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
      ></input>
    </div>
  );
};
dayjs.extend(relativeTime);
type PostWithUser = RouterOutputs["posts"]["getPosts"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className="flex gap-3 border-b border-slate-400 p-4" key={post.id}>
      <Image
        className="h-14 w-14 rounded-full"
        src={author.profilePicture}
        alt={"User Profile Image"}
        width={56}
        height={56}
      ></Image>
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-400">
          {`@${author.username}`}·<span>{dayjs(post.createdAt).fromNow()}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const { data: allPosts, isLoading } = api.posts.getPosts.useQuery();
  const user = useUser();
  if (isLoading) return <div>Loading ...</div>;
  if (!allPosts) return <div>No Data</div>;
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-200 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {!!user.isSignedIn && <SignOutButton />}
            {!user.isSignedIn && (
              <div className="flex justify-center">
                <SignInButton mode="modal">
                  <button className="btn">Sign in</button>
                </SignInButton>
              </div>
            )}
          </div>
          {user.isSignedIn && <CreatePostWizard></CreatePostWizard>}
          <div className="flex flex-col">
            {allPosts.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
