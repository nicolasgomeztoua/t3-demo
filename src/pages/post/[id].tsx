import { type NextPage } from "next";
import Head from "next/head";

const SinglePostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Post</title>
        <meta name="description" content="Emoji Only Twitter" />
      </Head>
      <main className="flex h-screen justify-center">Post view</main>
    </>
  );
};

export default SinglePostPage;
