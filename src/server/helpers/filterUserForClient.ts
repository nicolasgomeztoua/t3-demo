import type { User } from "@clerk/nextjs/dist/api";

export const filterUsersForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username || user.emailAddresses[0]?.emailAddress,
    profilePicture: user.profileImageUrl,
  };
};
