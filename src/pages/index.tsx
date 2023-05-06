import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Image from "next/image";

import { api } from "~/utils/api";

import { Loader, LoaderPage } from "~/components/Loader";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/Layout";
import { PostView } from "~/components/PostView";

const CreatePostWizard = () => {
  const [input, setInput] = useState<string>("");

  const { user } = useUser();
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.createPost.useMutation({
    onSuccess: async () => {
      //Reset input on success
      setInput("");

      await ctx.posts.getPosts.invalidate();
    },
    onError: (err) => {
      const errorMessage = err.data?.zodError?.fieldErrors?.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again.");
      }
    },
  });

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
        value={input}
        type="text"
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key === "Enter" && input !== "") {
            e.preventDefault();
            mutate({ content: input });
          }
        }}
      ></input>
      {input !== "" && !isPosting && (
        <button
          disabled={isPosting}
          onClick={() => mutate({ content: input })}
          className="btn"
        >
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <Loader size={20} />
        </div>
      )}
    </div>
  );
};

const Feed = () => {
  const { data: allPosts, isLoading: isPostsLoading } =
    api.posts.getPosts.useQuery();

  if (isPostsLoading) return <LoaderPage />;

  if (!allPosts) return <h1>Something went wrong</h1>;

  return (
    <div className="flex flex-col">
      {allPosts.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  //Start fetching data early
  api.posts.getPosts.useQuery();
  const { isLoaded: isUserLoaded, isSignedIn } = useUser();

  //Return an empty div if user isint loaded
  if (!isUserLoaded) return <div />;

  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        {!isSignedIn && (
          <div className="flex justify-center">
            <SignInButton mode="modal">
              <button className="btn">Sign in</button>
            </SignInButton>
          </div>
        )}{" "}
        {isSignedIn && <CreatePostWizard></CreatePostWizard>}
      </div>

      <Feed />
    </PageLayout>
  );
};

export default Home;
