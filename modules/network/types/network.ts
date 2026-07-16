export interface NetworkStats {

  directReferrals: number;

  secondLevelReferrals: number;

  totalNetwork: number;

}

export interface ReferralNode {

  uid: string;

  referralCode: string;

  referredByUid: string;

}