import React from 'react';
import { usePlan } from '../../context/PlanContext';
import Button from '../ui/Button';

// PlanGate decides whether to render children based on feature flag or custom predicate.
// Props:
//  - feature: string key in PLAN_CAPABILITIES.features
//  - predicate: (capabilities) => boolean (optional alternative)
//  - fallback: ReactNode shown when not allowed (optional)
//  - upgradeText: optional custom CTA label
//  - onUpgrade: optional click handler (default logs)
export default function PlanGate({
  feature,
  predicate,
  children,
  fallback,
  upgradeText = 'Upgrade to unlock',
  onUpgrade
}) {
  const { hasFeature, planId, PLAN_IDS } = usePlan();
  const capabilitiesOk = feature ? hasFeature(feature) : predicate ? predicate() : true;

  if (capabilitiesOk) return children;

  return (
    <div className="border border-dashed border-border rounded-lg p-4 text-center space-y-3 bg-muted/40">
      <p className="text-sm text-text-secondary">
        This feature isn\'t available on your current plan (<span className="font-medium">{planId}</span>).
      </p>
      {fallback}
      <Button
        variant="outline"
        size="sm"
        onClick={onUpgrade || (() => console.log('[Upgrade Prompt] User wants to upgrade from', planId))}
      >
        {upgradeText}
      </Button>
      <p className="text-[10px] text-text-tertiary uppercase tracking-wide">Free → Plus → Pro → Enterprise</p>
    </div>
  );
}
