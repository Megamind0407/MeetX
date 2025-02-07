"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

export const streamTokenProvider = async () => {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    const streamClient = new StreamClient(
      process.env.STREAM_API_KEY!, // Secret key should only be server-side
      process.env.STREAM_SECRET_KEY!
    );

    // Ensure the Stream client is successfully initialized
    const token = streamClient.generateUserToken({ user_id: user.id });

    return token;
  } catch (error) {
    console.error("Error generating Stream token:", error);
    throw new Error("Failed to generate Stream token");
  }
};
