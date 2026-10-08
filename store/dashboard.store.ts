import { create } from "zustand";
import { DashboardService, type DashboardSummary } from "@/services/dashboard.service";

interface DashboardState {
  summary: DashboardSummary | null;
  loading: boolean;
  error: string | null;
  fetch: (force?: boolean) => Promise<void>;
}

let inFlight = false;

export const useDashboardStore = create<DashboardState>((set, get) => ({
  summary: null,
  loading: true,
  error: null,
  fetch: async (force = false) => {
    const state = get();
    if (inFlight) return;
    if (!force && state.summary) return;
    inFlight = true;
    set({ loading: true, error: null });
    try {
      const summary = await DashboardService.getSummary();
      set({ summary, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load dashboard",
        loading: false,
      });
    } finally {
      inFlight = false;
    }
  },
}));
