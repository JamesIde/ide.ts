import redis from "./redisClient";

export async function setSession(
  sessionId: string,
  userId: string,
  hours: number
) {
  // Set the session data as a key-value pair in a Redis Hash
  await redis.hset("sessions", sessionId, userId);
  // Set the expiration time for the session key to the number of hours passed as parameter (in seconds)
  redis.expire("sessions", 60 * 60 * hours);
}

export async function deleteSession(sessionId: string) {
  await redis.hdel("sessions", sessionId);
}
