// import { auth0 } from "@/lib/auth0";
// import { redirect } from "next/navigation";
// import ChatPanel from "@/components/ChatPanel";

// export default async function ChatPage() {
//   const session = await auth0.getSession();
//   const user = session?.user;

//   if (!user) {
//     redirect("/");
//   }

//   if (user.email_verified === false) {
//     redirect("/verify");
//   }

//   const displayName =
//     user.name ?? user.email ?? user.nickname ?? "there";

//   return (
//     <main style={{ minHeight: "100vh" }}>
//       <ChatPanel displayName={displayName} />
//     </main>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatPanel from "@/features/chat/components/ChatPanel";
import { getChatName } from "@/services/storage/chatStorage";

export default function ChatPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    const name = getChatName();
    if (!name) {
      router.push("/");
      return;
    }
    setDisplayName(name);
  }, [router]);

  if (!displayName) {
    return null;
  }

  return (
    <main style={{ minHeight: "100vh" }}>
      <ChatPanel displayName={displayName} />
    </main>
  );
}
