import { useRouter } from "next/navigation";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";

const useMeetingActions = () => {
  const router = useRouter();
  const client = useStreamVideoClient();

  const createInstantMeeting = async () => {
    if (!client) {
      console.error("Stream client is not initialized");
      toast.error("Failed to create meeting: Client not initialized");
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const id = crypto.randomUUID();
      console.log("Meeting ID:", id);

      // Validate WebSocket URL
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "wss://video.stream-io-api.com";
      if (!wsUrl) {
        console.error("WebSocket URL is not defined in environment variables");
        toast.error("WebSocket connection error: Missing WebSocket URL");
        return;
      }

      // Establish the call connection
      const call = client.call("default", id);
      const response = await call.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
          custom: { description: "Instant Meeting" },
        },
      });

      console.log("Meeting created successfully:", response);
      router.push(`/meeting/${call.id}`);
      toast.success("Meeting Created");

    } catch (error: any) {
      console.error("Meeting creation error:", error);

      // Improved error handling
      if (error.isWSFailure) {
        console.error(`WebSocket Connection failed: ${error.message}`);
        toast.error(`WebSocket Connection failed: ${error.message}`);
      } else if (error.code === "JWTAuth") {
        console.error(`Authentication failed: ${error.message}`);
        toast.error(`Authentication failed: ${error.message}`);
      } else if (error.response?.status === 403) {
        console.error("Unauthorized: Invalid API Key or Token");
        toast.error("Unauthorized: Invalid API Key or Token");
      } else {
        console.error(`Failed to create meeting: ${error.message || error}`);
        toast.error(`Failed to create meeting: ${error.message || error}`);
      }
    }
  };

  const joinMeeting = (callId: string) => {
    if (!client) {
      toast.error("Failed to join meeting: Client not initialized");
      return;
    }
    router.push(`/meeting/${callId}`);
  };

  return { createInstantMeeting, joinMeeting };
};

export default useMeetingActions;
