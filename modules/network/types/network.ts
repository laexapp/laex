export interface NetworkUser {

  uid: string;

  fullName: string;

  username: string;

  email: string;

  referralCode: string;

  referredBy: string;

  referredByUid: string;

  directReferrals: number;

  secondLevelReferrals: number;

  totalNetwork: number;

  networkActivated: boolean;

  createdAt: Date | null;

}

export interface NetworkData {

  fullName: string;

  referralCode: string;

  referredBy: string;

  referredByUid: string;

  directReferrals: number;

  secondLevelReferrals: number;

  totalNetwork: number;

}

export interface ReferralUser {

  uid: string;

  fullName: string;

  username: string;

  email: string;

  createdAt: Date | null;

}