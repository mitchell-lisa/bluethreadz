"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { threads } from "@/lib/business";

export type Thread = { name: string; hex: string; ink: string };

type Ctx = { thread: Thread; setThread: (t: Thread) => void };

const ThreadCtx = createContext<Ctx>({ thread: threads[0], setThread: () => {} });

export function useThread() {
  return useContext(ThreadCtx);
}

export function ThreadProvider({ children }: { children: React.ReactNode }) {
  const [thread, setThread] = useState<Thread>(threads[0]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--thread", thread.hex);
    root.style.setProperty("--thread-ink", thread.ink);
  }, [thread]);

  const value = useMemo(() => ({ thread, setThread }), [thread]);
  return <ThreadCtx.Provider value={value}>{children}</ThreadCtx.Provider>;
}
