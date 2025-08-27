import { useLayoutEffect } from "react";

export function useScrollToBottom(ref: React.RefObject<any>, deps: any[] = []) {
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, deps);
}