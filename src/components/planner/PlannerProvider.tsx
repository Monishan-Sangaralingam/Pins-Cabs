"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { initialPlannerState, type PlannerState } from "@/lib/enquiry";

import { reconcileVehicle } from "@/lib/vehicleSuggestions";

type PlannerContextValue = {
  state: PlannerState;
  update: (values: Partial<PlannerState>) => void;
  reset: () => void;
};

const PlannerContext = createContext<PlannerContextValue | null>(null);

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialPlannerState);
  const value = useMemo(() => ({
    state,
    update: (values: Partial<PlannerState>) => setState((current) => reconcileVehicle({ ...current, ...values })),
    reset: () => setState(initialPlannerState),
  }), [state]);
  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (!context) throw new Error("usePlanner must be used inside PlannerProvider");
  return context;
}
