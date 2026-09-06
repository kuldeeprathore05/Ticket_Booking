import redisClient from "../config/redis.js";

const TTL = parseInt(process.env.SEAT_LOCK_TTL || "300", 10); // seconds

const lockKey = (showId, seatId) => `seat_lock:${showId}:${seatId}`;
 
export const reserveSeats = async (showId, seatIds, userId) => {
  const acquired = [];

  for (const seatId of seatIds) {
    const key = lockKey(showId, seatId); 
    const result = await redisClient.set(key, userId, { NX: true, EX: TTL });

    if (result === "OK") {
      acquired.push(seatId);
    } else { 
      await releaseSeats(showId, acquired);
      return {
        success: false,
        conflictSeat: seatId,
        message: `Seat ${seatId} is currently unavailable`,
      };
    }
  }

  return { success: true, expiresIn: TTL, seats: seatIds };
}; 
const RESERVE_SCRIPT = `
  for i, key in ipairs(KEYS) do
    if redis.call("EXISTS", key) == 1 then
      return key
    end
  end
  for i, key in ipairs(KEYS) do
    redis.call("SET", key, ARGV[1], "EX", ARGV[2])
  end
  return 1
`;

export const reserveSeatsAtomic = async (showId, seatIds, userId) => {
  const keys = seatIds.map((seatId) => lockKey(showId, seatId));
  const result = await redisClient.eval(RESERVE_SCRIPT, {
    keys,
    arguments: [userId, String(TTL)],
  });

  if (result === 1) {
    return { success: true, expiresIn: TTL, seats: seatIds };
  }
 
  const conflictKey = result;
  const conflictSeat = seatIds.find((seatId) => lockKey(showId, seatId) === conflictKey);

  return {
    success: false,
    conflictSeat,
    message: `Seat ${conflictSeat} is currently unavailable`,
  };
};
 
export const releaseSeats = async (showId, seatIds) => {
  if (!seatIds.length) return;
  const keys = seatIds.map((seatId) => lockKey(showId, seatId));
  await redisClient.del(keys);
};
  
export const verifyOwnership = async (showId, seatIds, userId) => {
  if (!seatIds.length) return { valid: true, invalidSeats: [] };

  const keys = seatIds.map((seatId) => lockKey(showId, seatId));
  const values = await redisClient.mGet(keys); // ONE round trip, N keys

  const invalidSeats = seatIds.filter((_, i) => values[i] !== userId);

  return { valid: invalidSeats.length === 0, invalidSeats };
};
 
export const getLockedSeats = async (showId, seatIds) => {
  if (!seatIds.length) return [];

  const keys = seatIds.map((seatId) => lockKey(showId, seatId));
  const values = await redisClient.mGet(keys); // ONE round trip, N keys

  return seatIds.filter((_, i) => values[i] !== null);
}; 
export const getLockTTL = async (showId, seatId) => {
  return redisClient.ttl(lockKey(showId, seatId));
};