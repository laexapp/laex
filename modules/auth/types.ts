export type UserRole =
  | "visitor"
  | "member"
  | "leader"
  | "admin";

export type UserProfile = {
  id: string;

  username: string;

  fullName: string;

  email: string;

  avatar: string;

  role: UserRole;

  referralCode: string;

  sponsorCode: string;

  isVerified: boolean;

  createdAt: string;
};