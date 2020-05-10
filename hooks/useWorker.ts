import { useEffect, useRef } from "react";

export function useWorker(Worker, receive: (data: any) => void) {
  const workerRef = useRef<Worker>();

  const getWorkerInstance = () => {
    if (workerRef.current) {
      return workerRef.current;
    }

    workerRef.current = new Worker();

    return workerRef.current as Worker;
  };

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  useEffect(() => {
    getWorkerInstance().onmessage = (e) => {
      if (!e.isTrusted) {
        return;
      }

      receive(e.data);
    };
  }, [receive]);

  const send = (data: { action: "search" | "store"; payload: any }) => {
    getWorkerInstance().postMessage(JSON.stringify(data));
  };

  return send;
}
