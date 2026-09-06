import crypto from "crypto";

// Exclude ambiguous characters (0/O, 1/I/L) so codes are easy to type and share.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 6;

const randomChar = () =>
  ALPHABET[crypto.randomInt(0, ALPHABET.length)];

/**
 * Generate a human-friendly, shareable team invite code.
 * Format: "ASC-XXXXXX" (e.g. ASC-K7M2QP).
 */
export const generateInviteCode = () => {
  const segment = Array.from({ length: CODE_LENGTH }, randomChar).join("");
  return `ASC-${segment}`;
};

export default generateInviteCode;