import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { PLAN_IDS, getCapabilities, canUseFeature } from '../utils/planCapabilities';

// LocalStorage keys
const LS_USER_ID = 'icp_user_id';
const LS_PLAN_ID = 'icp_plan_id';

function generateUserId() {
  // RFC4122-ish UUID v4 (no crypto dependency for now)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const PlanContext = createContext(null);

export const PlanProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [planId, setPlanId] = useState(PLAN_IDS.FREE);

  // initialize identity & plan
  useEffect(() => {
    let existingId = localStorage.getItem(LS_USER_ID);
    if (!existingId) {
      existingId = generateUserId();
      localStorage.setItem(LS_USER_ID, existingId);
      // analytics stub
      console.log('[Identity] Generated new userId', existingId);
    }
    setUserId(existingId);

    const storedPlan = localStorage.getItem(LS_PLAN_ID);
    if (storedPlan && Object.values(PLAN_IDS).includes(storedPlan)) {
      setPlanId(storedPlan);
    }
  }, []);

  const capabilities = useMemo(() => getCapabilities(planId), [planId]);

  const hasFeature = useCallback(
    (featureKey) => canUseFeature(planId, featureKey),
    [planId]
  );

  const switchPlan = useCallback((nextPlan) => {
    if (!Object.values(PLAN_IDS).includes(nextPlan)) return;
    setPlanId(nextPlan);
    localStorage.setItem(LS_PLAN_ID, nextPlan);
    console.log('[Plan] Switched plan', { userId, from: planId, to: nextPlan });
  }, [planId, userId]);

  const value = useMemo(() => ({
    userId,
    planId,
    capabilities,
    hasFeature,
    switchPlan,
    PLAN_IDS
  }), [userId, planId, capabilities, hasFeature, switchPlan]);

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within PlanProvider');
  return ctx;
}
