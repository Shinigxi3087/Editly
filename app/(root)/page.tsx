// app/(root)/page.tsx
import AddDocumentBtn from '@/components/AddDocumentBtn';
import { DeleteModal } from '@/components/DeleteModal';
import Header from '@/components/Header';
import Notifications from '@/components/Notifications';
import { getDocuments } from '@/lib/actions/room.actions';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import AnimatedDocumentList from '@/components/AnimatedDocument';

const Home = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');

  const email = clerkUser.emailAddresses[0].emailAddress;
  const roomDocuments = await getDocuments(email);

  const hasDocs = roomDocuments.data.length > 0;

  return (
    <main
      className={[
        "relative min-h-dvh overflow-hidden",
        // base gradient
        "bg-gradient-to-b from-slate-50 via-white to-white",
        "dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900",
      ].join(" ")}
    >
      {/* Decorative gradient orbs */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.18),transparent_60%)] blur-2xl dark:bg-[radial-gradient(ellipse_at_center,rgba(129,140,248,0.18),transparent_60%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.16),transparent_60%)] blur-2xl dark:bg-[radial-gradient(ellipse_at_center,rgba(217,70,239,0.16),transparent_60%)]"
      />

      <Header className="sticky top-0" >
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>

      {hasDocs ? (
        <section className="mx-auto w-full max-w-6xl px-4 py-8 lg:py-10">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3
              className={[
                "text-2xl md:text-3xl font-semibold tracking-tight",
                "bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600",
                "dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400",
                "bg-clip-text text-transparent",
              ].join(" ")}
            >
              All documents
            </h3>
            <AddDocumentBtn userId={clerkUser.id} email={email} />
          </div>

          {/* Card wrapper to lift the list slightly */}
          <div className="rounded-2xl border border-black/5 bg-white/60 p-1 backdrop-blur-md shadow-sm dark:border-white/10 dark:bg-neutral-900/50">
            <AnimatedDocumentList
              docs={roomDocuments.data.map((d: any) => ({
                id: d.id,
                title: d.metadata?.title ?? 'Untitled',
                createdAt: d.createdAt,
              }))}
            />
          </div>
        </section>
      ) : (
        <section className="mx-auto grid w-full max-w-3xl place-items-center px-4 py-20 text-center">
          <div className="w-full rounded-2xl border border-black/5 bg-white/70 p-10 shadow-md backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/60">
            <Image
              src="/assets/icons/doc.svg"
              alt=""
              width={56}
              height={56}
              className="mx-auto mb-5 opacity-80"
              priority
            />
            <h4 className="text-xl font-semibold">
              <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-fuchsia-400">
                Create your first document
              </span>
            </h4>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Collaborate in real time, leave comments, and share instantly.
            </p>
            <div className="mt-7 flex justify-center">
              <AddDocumentBtn userId={clerkUser.id} email={email} />
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Home;
