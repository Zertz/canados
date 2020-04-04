import { useEffect } from "react";

let worker: Worker;

export function useWorker(url: string, receive: (data: any) => void) {
  useEffect(() => {
    worker = new Worker(url);

    return () => {
      worker.terminate();
    };
  }, []);

  useEffect(() => {
    worker.onmessage = (e) => {
      if (!e.isTrusted) {
        return;
      }

      receive(e.data);
    };
  }, [receive]);

  const send = (data: { action: "search" | "store"; payload: any }) => {
    worker.postMessage(JSON.stringify(data));
  };

  return send;
}
