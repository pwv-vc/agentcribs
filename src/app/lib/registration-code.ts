const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const REQUIRED = ["D", "D", "P", "T"];

function randInt(max: number): number {
  const arr = new Uint8Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

export function generateRegistrationCode(): string {
  const slots = Array.from({ length: 8 }, () =>
    CHARS[randInt(CHARS.length)],
  );

  // Place required chars first, then shuffle
  for (let i = 0; i < REQUIRED.length; i++) {
    slots[i] = REQUIRED[i];
  }

  // Fisher-Yates shuffle
  for (let i = slots.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }

  return slots.join("");
}
