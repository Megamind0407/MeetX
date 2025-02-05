"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

export const streamTokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error("User not authenticated");

  const streamClient = new StreamClient(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    process.env.STREAM_SECRET_KEY!
  );

  console.log("Generating token for user ID:", user.id);

  const token = streamClient.generateUserToken({ 
    user_id: user.id,
    iat: Math.floor(Date.now() / 1000),  // 'issued at' timestamp
    exp: Math.floor(Date.now() / 1000) + 3600 // Expiration time (1 hour)
  });

  console.log("Generated token:", token);

  return token;
};
