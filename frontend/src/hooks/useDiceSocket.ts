import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useDiceSocket = (url: string) => {
  const [socketClient, setSocketClient] = useState<Socket | null>(null);
  const [latestRoll, setLatestRoll] = useState<{
    d1: number;
    d2: number;
  } | null>(null);

  useEffect(() => {
    const socket = io(url);

    socket.on("connect", () => {
      socket.emit("ready");
    });

    socket.on("roll", (data) => setLatestRoll(data));

    setSocketClient(socket);
    return () => {
      socket.disconnect();
    };
  }, [url]);

  return {
    socketClient,
    latestRoll,
  };
};

export default useDiceSocket;
