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
      const id = crypto.randomUUID();
      console.log("Meeting ID:", id);

      const call = client.call("default", id);
      const response = await call.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
          custom: { description: "Instant Meeting" },
        },
      });

      console.log("WebSocket Response:", response);

      router.push(`/meeting/${call.id}`);
      toast.success("Meeting Created");
    } catch (error: any) {
      console.error("Meeting creation error:", error);
      if (error.isWSFailure) {
        toast.error(`WebSocket Connection failed: ${error.message}`);
      } else {
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
