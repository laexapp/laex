const PREFIX = "LAEX";

function random(length: number): string {

  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let result = "";

  for (let i = 0; i < length; i++) {

    result +=
      characters.charAt(
        Math.floor(
          Math.random() * characters.length
        )
      );

  }

  return result;

}

export function generateReferralCode(): string {

  return `${PREFIX}-${random(6)}`;

}

export function normalizeReferralCode(
  code: string
): string {

  return code
    .trim()
    .toUpperCase();

}

export function isReferralCodeValid(
  code: string
): boolean {

  return normalizeReferralCode(code).length > 0;

}