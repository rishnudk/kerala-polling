import { createHash } from "crypto";

export function hashValue(value: string): string {
  return createHash("sha256")
    .update(value + (process.env.HASH_SALT ?? "kerala-poll"))
    .digest("hex");
}