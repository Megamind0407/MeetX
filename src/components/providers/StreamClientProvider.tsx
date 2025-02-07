"use client";

import { ReactNode, useEffect, useState } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import LoaderUI from "../LoaderUI";
import { streamTokenProvider } from "@/actions/stream.actions";

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [streamVideoClient, setStreamVideoClient] = useState<StreamVideoClient | null>(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;
  
    const setupClient = async () => {
      console.log("Fetching token for user:", user.id);
  
      try {
        const token = await streamTokenProvider();
        console.log("Received Token:", token);
  
        const client = new StreamVideoClient({
          apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
          user: {
            id: user.id,
            name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user.id,
            image: user?.imageUrl,
          },
          token,
        });
        console.log("Stream Client initialized successfully:", client);
        setStreamVideoClient(client);
      } catch (error) {
        console.error("Error initializing Stream client:", error);
      }
    };
  
    setupClient();
  }, [user, isLoaded]);

  if (!streamVideoClient) return <LoaderUI />;

  return <StreamVideo client={streamVideoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
