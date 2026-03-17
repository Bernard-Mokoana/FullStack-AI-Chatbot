"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

export function useAutoScroll(ref: RefObject<HTMLElement>, deps: unknown[]) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, deps);
}
