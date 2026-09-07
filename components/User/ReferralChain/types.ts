/**
 * Shared types for the user-facing Referral Network page.
 *
 * These mirror the backend's response shapes. The single source
 * of truth is `services/referral.service.ts` — this file just
 * re-exports + projects the tree into a flat L1 list.
 */
export type {
  ReferralTreeNode,
  MyStatsResponse,
  EligibilityResponse,
} from "@/services/referral.service";

import type { ReferralTreeNode as TreeNode } from "@/services/referral.service";

/** Flattened L1 user — derived from the tree on the client. */
export type ReferralUser = Omit<TreeNode, "children" | "depth">;

export interface ReferralState {
  stats: import("@/services/referral.service").MyStatsResponse;
  referrals: ReferralUser[];
  treeData: TreeNode[];
  myCode: string | null;
  eligibility: import("@/services/referral.service").EligibilityResponse | null;
}

/**
 * Default state used before the first fetch resolves. Mirrors the
 * service's default; re-typed here so consumers can import a single
 * shape regardless of where they live.
 */
import { initialReferralState as _init } from "@/services/referral.service";
export const initialReferralState: ReferralState =
  _init as unknown as ReferralState;
