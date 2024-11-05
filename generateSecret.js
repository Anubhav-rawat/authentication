import { randomBytes } from "crypto";

// Generate a random 256-bit (32-byte) secret
const secret = randomBytes(32).toString("hex");

console.log("Your JWT Secret is:", secret);
