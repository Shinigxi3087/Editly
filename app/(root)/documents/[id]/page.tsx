// app/documents/[id]/page.tsx (or your current path)
import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type UsersAccesses = Record<string, string[] | undefined>;

type RoomMeta = {
  title?: string | null;
  [key: string]: unknown;
};

type RoomResult = {
  id: string;
  metadata: RoomMeta;
  usersAccesses: UsersAccesses;
};

type User = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
};

type SearchParamProps = {
  params: { id: string };
};

const Document = async ({ params: { id } }: SearchParamProps) => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) redirect("/sign-in");

  const room = (await getDocument({
    roomId: id,
    userId: email,
  })) as RoomResult | null;

  if (!room) redirect("/");

  const usersAccesses = (room.usersAccesses ?? {}) as UsersAccesses;

  // Build collaborators list with role
  const userIds = Object.keys(usersAccesses);
  const users = (await getClerkUsers({ userIds })) as User[];

  const usersData = users.map((u) => {
    const access = usersAccesses[u.email] ?? [];
    const isEditor = access.includes("room:write");
    return {
      ...u,
      userType: isEditor ? ("editor" as const) : ("viewer" as const),
    };
  });

  const currentAccess = usersAccesses[email] ?? [];
  const currentUserType = currentAccess.includes("room:write") ? ("editor" as const) : ("viewer" as const);

  return (
    <main
      className={[
        "relative min-h-dvh overflow-hidden",
        "bg-gradient-to-b from-slate-50 via-white to-white",
        "dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900",
        "flex w-full flex-col items-center",
      ].join(" ")}
    >
      {/* decorative orbs to match Home */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.18),transparent_60%)] blur-2xl dark:bg-[radial-gradient(ellipse_at_center,rgba(129,140,248,0.18),transparent_60%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.16),transparent_60%)] blur-2xl dark:bg-[radial-gradient(ellipse_at_center,rgba(217,70,239,0.16),transparent_60%)]"
      />

      <div className="z-10 w-full">
        <CollaborativeRoom
          roomId={id}
          roomMetadata={room.metadata}
          users={usersData}
          currentUserType={currentUserType}
        />
      </div>
    </main>
  );
};

export default Document;
