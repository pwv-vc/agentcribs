import type { GuestApprovalStatus, LumaGuest } from "@/app/lib/luma";

export type GuestCounts = Record<GuestApprovalStatus, number>;

export function getGuestStatusCounts(guests: LumaGuest[]): GuestCounts {
  const counts: GuestCounts = {
    approved: 0,
    session: 0,
    pending_approval: 0,
    invited: 0,
    declined: 0,
    waitlist: 0,
  };
  for (const g of guests) {
    if (g.approval_status in counts) {
      counts[g.approval_status]++;
    }
  }
  return counts;
}
