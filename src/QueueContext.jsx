import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { apiBase } from "./constants";

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState(() => {
    try {
      const item = localStorage.getItem("auditLogQueue");
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error("Failed to read from localStorage", error);
      return [];
    }
  });

  const queueRef = useRef(queue);
  const isProcessing = useRef(false);

  useEffect(() => {
    queueRef.current = queue;
    try {
      localStorage.setItem("auditLogQueue", JSON.stringify(queue));
    } catch (err) {
      console.error("Failed to write to localStorage", err);
    }
  }, [queue]);

  const processQueue = async () => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    while (queueRef.current.length > 0) {
      const item = queueRef.current[0];
      try {
        const response = await fetch(apiBase + "audits/auditLogs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        });

        if (response.ok) {
          const newQueue = queueRef.current.slice(1);
          queueRef.current = newQueue;
          setQueue(newQueue);
        } else {
          console.error("API error");
          break;
        }
      } catch (err) {
        console.error("Network error", err);
        break;
      }
    }

    isProcessing.current = false;
  };

  const enqueue = (item) => {
    const newQueue = [...queueRef.current, item];
    queueRef.current = newQueue;
    setQueue(newQueue);
    processQueue();
  };

  return (
    <QueueContext.Provider value={{ enqueue, queue }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => useContext(QueueContext);
