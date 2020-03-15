import { useEffect } from "react";

let worker: Worker;

export function useWorker(url: string, receive: (data: Object[]) => void) {
  useEffect(() => {
    worker = new Worker(url);

    worker.onmessage = e => {
      if (!e.isTrusted) {
        return;
      }

      receive(JSON.parse(e.data));
    };

    return () => {
      worker.terminate();
    };
  }, []);

  const send = (data: { action: "search" | "store"; payload: any }) => {
    worker.postMessage(JSON.stringify(data));
  };

  return send;
}
