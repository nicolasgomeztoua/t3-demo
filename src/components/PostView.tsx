import Image from "next/image";
import dayjs from "dayjs";
import type { RouterOutputs } from "~/utils/api";
import Link from "next/link";

type PostWithUser = RouterOutputs["posts"]["getPosts"][number];
export const PostView = (props: PostWithUser) => {
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
          <Link href={`/@${author.username}`}>{`@${author.username}`} </Link> ·
          <Link href={post.id}>
            <span>{dayjs(post.createdAt).fromNow()}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};
