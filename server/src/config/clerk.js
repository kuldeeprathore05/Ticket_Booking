import "dotenv/config";

export const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!CLERK_SECRET_KEY) {
  console.warn(
    "CLERK_SECRET_KEY is not set. Authentication routes will fail until it is configured."
  );
}
