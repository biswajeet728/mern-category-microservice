import { config } from "dotenv";
import path from "path";
import { z } from "zod";

// Load environment variables from the appropriate .env file
config({
  path: path.join(__dirname, `../../.env`),
});

// config({
//   path: path.join(__dirname, ../../.env),
// });

// Define a Zod schema for the environment variables
const envSchema = z.object({
  PORT: z.string().regex(/^\d+$/).transform(Number), // Ensures PORT is a number
  NODE_ENV: z.string(),
  MONGO_URI: z.string(),
  JWT_SECRET: z.string(),
});

// Validate the environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  process.exit(1); // Exit if validation fails
}

// Export the validated and parsed environment variables
export const Config = {
  PORT: parsedEnv.data.PORT,
  NODE_ENV: parsedEnv.data.NODE_ENV,
  MONGO_URI: parsedEnv.data.MONGO_URI,
  JWT_SECRET: parsedEnv.data.JWT_SECRET,
};
