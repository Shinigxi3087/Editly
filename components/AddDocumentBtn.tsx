"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createDocument } from "@/lib/actions/room.actions";
import { Button } from "./ui/button";

type AddDocumentBtnProps = {
  userId: string;
  email: string;
  className?: string;
};

const AddDocumentBtn = ({ userId, email, className }: AddDocumentBtnProps) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const statusRef = React.useRef<HTMLSpanElement | null>(null);

  const create = React.useCallback(async () => {
    if (loading) return;
    setLoading(true);
    statusRef.current?.replaceChildren(document.createTextNode("Creating document…"));
    try {
      const room = await createDocument({ userId, email });
      if (room?.id) {
        router.push(`/documents/${room.id}`);
      }
    } catch (err) {
      console.error("Failed to create document:", err);
      statusRef.current?.replaceChildren(document.createTextNode("Creation failed. Try again."));
      setLoading(false);
    }
  }, [loading, router, userId, email]);

  // Cmd/Ctrl + N to start a new doc
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const metaOrCtrl = e.metaKey || e.ctrlKey;
      if (metaOrCtrl && (e.key === "n" || e.key === "N")) {
        e.preventDefault();
        create();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [create]);

  return (
    <>
      <Button
        type="button"
        onClick={create}
        loading={loading}
        leftIcon={
          <Image
            src="/assets/icons/add.svg"
            alt=""
            width={20}
            height={20}
            className="opacity-90"
            priority
          />
        }
        className={`gradient-blue shadow-md ${className || ""}`}
      >
        <span className="hidden sm:inline">Start a blank document</span>
        <span className="sm:hidden">New doc</span>
      </Button>

      {/* A11y live region for status updates */}
      <span
        ref={statusRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </>
  );
};

export default AddDocumentBtn;
